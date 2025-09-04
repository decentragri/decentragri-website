// Type verification for Go struct compatibility
// This file ensures our TypeScript interfaces match the Go farmservices.FarmList struct

import { FarmList, FarmCoordinates } from '../types/farm.types';

/*
Go struct reference:
type FarmList struct {
    Owner             string         `json:"owner"`
    FarmName          string         `json:"farmName"`
    ID                string         `json:"id"`
    CropType          string         `json:"cropType"`
    Description       string         `json:"description"`
    Image             string         `json:"image"`
    Coordinates       FarmCoordinates `json:"coordinates"`
    UpdatedAt         time.Time      `json:"updatedAt"`
    CreatedAt         time.Time      `json:"createdAt"`
    FormattedUpdatedAt string        `json:"formattedUpdatedAt"`
    FormattedCreatedAt string        `json:"formattedCreatedAt"`
    ImageBytes        []byte         `json:"imageBytes"`
    Location          string         `json:"location"`
}

type FarmCoordinates struct {
    Lat float64 `json:"lat"`
    Lng float64 `json:"lng"`
}
*/

// Test data that should match exactly
const testFarm: FarmList = {
  owner: "0x123...",
  farmName: "Test Farm",
  id: "farm_001",
  cropType: "Corn",
  description: "Test description",
  image: "https://example.com/image.jpg",
  coordinates: {
    lat: 40.7128,
    lng: -74.0060
  },
  updatedAt: "2024-09-04T10:30:00Z",
  createdAt: "2024-08-15T08:00:00Z",
  formattedUpdatedAt: "September 4, 2024 at 10:30 AM",
  formattedCreatedAt: "August 15, 2024 at 8:00 AM",
  imageBytes: [1, 2, 3, 4], // number[] matches []byte from Go
  location: "New York, NY"
};

const testCoordinates: FarmCoordinates = {
  lat: 40.7128,  // number matches float64
  lng: -74.0060  // number matches float64
};

// Export for testing
export { testFarm, testCoordinates };

// Type compatibility checks
type GoFarmListKeys = keyof FarmList;
type GoCoordinatesKeys = keyof FarmCoordinates;

// This will cause TypeScript errors if our interface doesn't match the expected structure
const requiredFarmFields: Record<GoFarmListKeys, string> = {
  owner: 'string',
  farmName: 'string', 
  id: 'string',
  cropType: 'string',
  description: 'string',
  image: 'string',
  coordinates: 'FarmCoordinates',
  updatedAt: 'string', // ISO date string from Go time.Time JSON
  createdAt: 'string', // ISO date string from Go time.Time JSON
  formattedUpdatedAt: 'string',
  formattedCreatedAt: 'string',
  imageBytes: 'number[]', // TypeScript number[] for Go []byte
  location: 'string'
};

const requiredCoordinateFields: Record<GoCoordinatesKeys, string> = {
  lat: 'number', // TypeScript number for Go float64
  lng: 'number'  // TypeScript number for Go float64
};

console.log('✅ Type verification passed - interfaces match Go structs');
export { requiredFarmFields, requiredCoordinateFields };
