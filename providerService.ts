import { Provider, TriageResult, Appointment } from '@/types';

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'General Practice',
    rating: 4.9,
    distance: '0.8 mi',
    availableSlots: ['Today 2:00 PM', 'Today 4:30 PM', 'Tomorrow 9:00 AM'],
    address: '123 Medical Plaza, Suite 200',
    phone: '(555) 123-4567',
    acceptsInsurance: true
  },
  {
    id: '2',
    name: 'CityHealth Urgent Care',
    specialty: 'Urgent Care',
    rating: 4.7,
    distance: '1.2 mi',
    availableSlots: ['Walk-in Available', 'Today 3:00 PM', 'Today 5:00 PM'],
    address: '456 Health Street',
    phone: '(555) 234-5678',
    acceptsInsurance: true
  },
  {
    id: '3',
    name: 'Dr. Michael Torres',
    specialty: 'Internal Medicine',
    rating: 4.8,
    distance: '2.1 mi',
    availableSlots: ['Tomorrow 10:00 AM', 'Tomorrow 2:00 PM', 'Next Week'],
    address: '789 Wellness Avenue',
    phone: '(555) 345-6789',
    acceptsInsurance: true
  },
  {
    id: '4',
    name: 'TeleHealth Now',
    specialty: 'Tele-Consult',
    rating: 4.6,
    distance: 'Virtual',
    availableSlots: ['Available Now', 'Today 1:00 PM', 'Today 6:00 PM'],
    address: 'Virtual Consultation',
    phone: '(555) 456-7890',
    acceptsInsurance: true
  }
];

export const findRecommendedProviders = (triageResult: TriageResult): Provider[] => {
  const { suggestedAction } = triageResult;
  
  let filteredProviders = [...MOCK_PROVIDERS];
  
  if (suggestedAction === 'urgent-care' || suggestedAction === 'emergency') {
    filteredProviders = filteredProviders.filter(p => 
      p.specialty === 'Urgent Care' || p.specialty === 'Emergency Medicine'
    );
  } else if (suggestedAction === 'self-care') {
    filteredProviders = filteredProviders.filter(p => 
      p.specialty === 'Tele-Consult'
    );
  }
  
  // Sort by distance and rating
  return filteredProviders.sort((a, b) => {
    const aDistance = parseFloat(a.distance) || 999;
    const bDistance = parseFloat(b.distance) || 999;
    return aDistance - bDistance;
  });
};

export const bookAppointment = async (
  provider: Provider,
  slot: string,
  symptoms: string[],
  type: 'in-person' | 'tele-consult'
): Promise<Appointment> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const [date, time] = slot.includes('Today') ? 
    [new Date().toISOString().split('T')[0], slot.replace('Today ', '')] :
    slot.includes('Tomorrow') ?
    [new Date(Date.now() + 86400000).toISOString().split('T')[0], slot.replace('Tomorrow ', '')] :
    ['2025-10-20', slot];
  
  return {
    id: Date.now().toString(),
    providerId: provider.id,
    providerName: provider.name,
    date,
    time,
    type,
    status: 'scheduled',
    symptoms
  };
};