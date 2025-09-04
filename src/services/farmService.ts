export interface FarmCoordinates {
  lat: number;
  lng: number;
}

// Updated interface to match the Go struct
export interface FarmData {
  owner: string;
  farmName: string;
  id: string;
  cropType: string;
  description: string;
  image: string;
  coordinates: FarmCoordinates;
  updatedAt: string;  // ISO string format
  createdAt: string;  // ISO string format
  formattedUpdatedAt: string;
  formattedCreatedAt: string;
  imageBytes: number[]; // byte array represented as number array
  location: string;
}

// Mock data for development - updated to match Go struct
const mockFarms: FarmData[] = [
  {
    owner: '0x123456789abcdef123456789abcdef123456789ab',
    farmName: 'Sunny Fields',
    id: 'farm_001',
    cropType: 'Tomato',
    description: 'A beautiful tomato farm in the heart of Central Valley',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    coordinates: {
      lat: 36.7378,
      lng: -119.7871
    },
    updatedAt: '2024-09-04T10:30:00Z',
    createdAt: '2024-08-15T08:00:00Z',
    formattedUpdatedAt: 'September 4, 2024 at 10:30 AM',
    formattedCreatedAt: 'August 15, 2024 at 8:00 AM',
    imageBytes: [],
    location: 'Central Valley, CA'
  },
  {
    owner: '0x987654321fedcba987654321fedcba987654321f',
    farmName: 'Green Pastures',
    id: 'farm_002',
    cropType: 'Wheat',
    description: 'Expansive wheat fields in the Great Plains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
    coordinates: {
      lat: 38.4937,
      lng: -98.3804
    },
    updatedAt: '2024-09-03T14:15:00Z',
    createdAt: '2024-08-20T12:30:00Z',
    formattedUpdatedAt: 'September 3, 2024 at 2:15 PM',
    formattedCreatedAt: 'August 20, 2024 at 12:30 PM',
    imageBytes: [],
    location: 'Kansas Plains, KS'
  },
  {
    owner: '0xabcdef123456789abcdef123456789abcdef12345',
    farmName: 'Mountain View Orchard',
    id: 'farm_003',
    cropType: 'Apples',
    description: 'Organic apple orchard with mountain views',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
    coordinates: {
      lat: 45.7054,
      lng: -121.5215
    },
    updatedAt: '2024-09-02T09:45:00Z',
    createdAt: '2024-08-10T11:00:00Z',
    formattedUpdatedAt: 'September 2, 2024 at 9:45 AM',
    formattedCreatedAt: 'August 10, 2024 at 11:00 AM',
    imageBytes: [],
    location: 'Hood River, OR'
  }
];

export const getFarmById = async (id: string): Promise<FarmData | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const farm = mockFarms.find(farm => farm.id === id) || null;
      resolve(farm);
    }, 500);
  });
};

export const getFarmList = async (): Promise<FarmData[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockFarms]);
    }, 500);
  });
};
