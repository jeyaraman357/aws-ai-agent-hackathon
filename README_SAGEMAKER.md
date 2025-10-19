# AWS SageMaker Integration Guide for HealthNav

## Architecture Overview

```
React Native App → Supabase Edge Functions → AWS SageMaker Endpoints
```

This architecture ensures:
- ✅ Secure AWS credentials (never exposed to client)
- ✅ Serverless auto-scaling
- ✅ HIPAA-compliant data handling
- ✅ Low latency (Edge Functions at user's region)

## SageMaker Models Setup

### 1. Medical Triage Model
**Purpose**: Predicts urgency level and recommends specialty

**Training Data**: Patient symptoms, demographics, outcomes
**Model Type**: XGBoost or Deep Learning (PyTorch/TensorFlow)
**Endpoint Name**: `medical-triage-endpoint`

**Input Format**:
```json
{
  "symptoms": ["chest pain", "shortness of breath"],
  "age": 45,
  "gender": "male",
  "medical_history": ["hypertension"],
  "current_medications": ["lisinopril"]
}
```

**Output Format**:
```json
{
  "urgency_score": 0.92,
  "risk_level": "critical",
  "recommended_specialty": "Cardiology",
  "confidence": 0.94,
  "key_findings": ["High cardiac risk detected"],
  "model_version": "1.2.0",
  "inference_time_ms": 45
}
```

### 2. Medical Image Analysis Model
**Purpose**: Analyzes X-rays, CT scans, skin lesions

**Training Data**: Labeled medical images (NIH, MIMIC, custom datasets)
**Model Type**: CNN (ResNet, EfficientNet) or Vision Transformer
**Endpoint Name**: `medical-image-classifier`

**Input Format**:
```json
{
  "image_url": "s3://bucket/patient-xray.jpg",
  "image_type": "xray",
  "analysis_type": "classification"
}
```

**Output Format**:
```json
{
  "predictions": [
    {
      "condition": "pneumonia",
      "confidence": 0.87,
      "severity": "moderate"
    }
  ],
  "model_version": "2.0.1",
  "inference_time_ms": 120
}
```

### 3. Patient Risk Scoring Model
**Purpose**: Calculates overall health risk score

**Training Data**: EHR data, vital signs, outcomes
**Model Type**: Gradient Boosting (XGBoost/LightGBM)
**Endpoint Name**: `patient-risk-scorer`

## Deployment Steps

### Step 1: Train and Deploy SageMaker Models

```python
# train_triage_model.py
import sagemaker
from sagemaker.xgboost import XGBoost

# Initialize SageMaker session
sess = sagemaker.Session()
role = 'arn:aws:iam::YOUR_ACCOUNT:role/SageMakerRole'

# Configure XGBoost estimator
xgb = XGBoost(
    entry_point='triage_model.py',
    role=role,
    instance_count=1,
    instance_type='ml.m5.xlarge',
    framework_version='1.5-1',
    hyperparameters={
        'max_depth': 5,
        'eta': 0.2,
        'objective': 'multi:softmax',
        'num_class': 4,
        'num_round': 100
    }
)

# Train model
xgb.fit({'train': 's3://your-bucket/training-data'})

# Deploy endpoint
predictor = xgb.deploy(
    initial_instance_count=1,
    instance_type='ml.t2.medium',
    endpoint_name='medical-triage-endpoint'
)
```

### Step 2: Configure Supabase Edge Functions

```bash
# Set AWS credentials in Supabase dashboard
supabase secrets set AWS_ACCESS_KEY_ID=your_key
supabase secrets set AWS_SECRET_ACCESS_KEY=your_secret
supabase secrets set AWS_REGION=us-east-1

# Deploy Edge Functions
supabase functions deploy sagemaker-triage
supabase functions deploy sagemaker-image-analysis
supabase functions deploy sagemaker-risk-score
```

### Step 3: Configure React Native App

```typescript
// .env file
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Testing the Integration

### Test Triage Endpoint
```bash
curl -X POST https://your-project.supabase.co/functions/v1/sagemaker-triage \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["fever", "cough"],
    "patient_data": {"age": 35, "gender": "female"},
    "endpoint": "medical-triage-endpoint"
  }'
```

### Test Image Analysis
```bash
curl -X POST https://your-project.supabase.co/functions/v1/sagemaker-image-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "image_data": "s3://bucket/image.jpg",
    "image_type": "xray",
    "endpoint": "medical-image-classifier"
  }'
```

## Cost Optimization

### 1. Use Auto-scaling
```python
# Configure auto-scaling for SageMaker endpoint
client.register_scalable_target(
    ServiceNamespace='sagemaker',
    ResourceId=f'endpoint/{endpoint_name}/variant/AllTraffic',
    ScalableDimension='sagemaker:variant:DesiredInstanceCount',
    MinCapacity=1,
    MaxCapacity=5
)
```

### 2. Use Async Inference for Images
```python
# Deploy as async endpoint for cost savings
predictor = model.deploy(
    initial_instance_count=1,
    instance_type='ml.m5.large',
    async_inference_config=AsyncInferenceConfig()
)
```

### 3. Batch Predictions
Process multiple patients in batches during off-peak hours.

## Security & Compliance

### HIPAA Compliance Checklist
- ✅ Enable encryption at rest (S3, SageMaker)
- ✅ Enable encryption in transit (HTTPS/TLS)
- ✅ Implement access logging (CloudTrail)
- ✅ Use VPC endpoints for SageMaker
- ✅ Sign BAA with AWS
- ✅ Implement audit trails
- ✅ Data retention policies

### IAM Policy for Edge Functions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sagemaker:InvokeEndpoint"
      ],
      "Resource": [
        "arn:aws:sagemaker:*:*:endpoint/medical-*"
      ]
    }
  ]
}
```

## Monitoring & Alerts

### CloudWatch Alarms
```python
# Set up latency alarm
cloudwatch.put_metric_alarm(
    AlarmName='SageMaker-High-Latency',
    MetricName='ModelLatency',
    Namespace='AWS/SageMaker',
    Statistic='Average',
    Period=60,
    EvaluationPeriods=2,
    Threshold=1000,  # 1 second
    ComparisonOperator='GreaterThanThreshold'
)
```

## Model Versioning & A/B Testing

```python
# Deploy multiple variants for A/B testing
predictor = model.deploy(
    endpoint_name='medical-triage-endpoint',
    variants=[
        {
            'VariantName': 'model-v1',
            'ModelName': 'triage-model-v1',
            'InitialInstanceCount': 1,
            'InstanceType': 'ml.m5.large',
            'InitialVariantWeight': 0.5
        },
        {
            'VariantName': 'model-v2',
            'ModelName': 'triage-model-v2',
            'InitialInstanceCount': 1,
            'InstanceType': 'ml.m5.large',
            'InitialVariantWeight': 0.5
        }
    ]
)
```

## Troubleshooting

### Issue: High Latency
**Solution**: 
- Use faster instance types (ml.c5 instead of ml.t2)
- Enable model compilation with SageMaker Neo
- Implement caching for common predictions

### Issue: High Costs
**Solution**:
- Use Spot Instances for training
- Implement auto-scaling
- Use async inference for non-critical predictions

### Issue: Model Drift
**Solution**:
- Monitor prediction distributions
- Implement Model Monitor
- Retrain quarterly with new data

## Next Steps

1. ✅ Train your first model with sample medical data
2. ✅ Deploy to SageMaker endpoint
3. ✅ Test Edge Functions locally
4. ✅ Deploy Edge Functions to Supabase
5. ✅ Update React Native app with real endpoints
6. ✅ Set up monitoring and alerts
7. ✅ Conduct load testing
8. ✅ Obtain HIPAA compliance certification

## Support Resources

- [AWS SageMaker Documentation](https://docs.aws.amazon.com/sagemaker/)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Medical AI Models Hub](https://github.com/topics/medical-ai)
- [HIPAA Compliance Guide](https://aws.amazon.com/compliance/hipaa-compliance/)