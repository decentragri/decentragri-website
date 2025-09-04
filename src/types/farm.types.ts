export interface FarmCoordinates {
  lat: number;
  lng: number;
}

export interface FarmList {
  owner: string;
  farmName: string;
  id: string;
  cropType: string;
  description: string;
  image: string;
  coordinates: FarmCoordinates;
  updatedAt: string;
  createdAt: string;
  formattedUpdatedAt: string;
  formattedCreatedAt: string;
  imageBytes: number[] | string;
  location: string;
}