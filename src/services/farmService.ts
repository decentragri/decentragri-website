export interface FarmData {
  id: string;
  farmName: string;
  cropType: string;
  location?: {
    displayName?: string;
    lat?: number;
    lng?: number;
  };
  status?: string;
  size?: number;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock data for development
const mockFarms: FarmData[] = [
  {
    id: '1',
    farmName: 'Sunny Fields',
    cropType: 'Tomato',
    location: {
      displayName: 'Central Valley, CA',
      lat: 36.7378,
      lng: -119.7871
    },
    status: 'Active',
    size: 10,
    description: 'A beautiful tomato farm in the heart of Central Valley'
  },
  {
    id: '2',
    farmName: 'Green Pastures',
    cropType: 'Wheat',
    location: {
      displayName: 'Kansas Plains, KS',
      lat: 38.4937,
      lng: -98.3804
    },
    status: 'Active',
    size: 25,
    description: 'Expansive wheat fields in the Great Plains'
  },
  {
    id: '3',
    farmName: 'Mountain View Orchard',
    cropType: 'Apples',
    location: {
      displayName: 'Hood River, OR',
      lat: 45.7054,
      lng: -121.5215
    },
    status: 'Active',
    size: 15,
    description: 'Organic apple orchard with mountain views'
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
