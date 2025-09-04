// Farm types based on the Go struct
export interface FarmCoordinates {
  lat: number;
  lng: number;
}

// Updated interface to match the Go farmservices.FarmList struct
export interface FarmList {
  owner: string;
  farmName: string;
  id: string;
  cropType: string;
  description: string;
  image: string;
  coordinates: FarmCoordinates;
  updatedAt: string;  // ISO string format (time.Time in Go)
  createdAt: string;  // ISO string format (time.Time in Go)
  formattedUpdatedAt: string;
  formattedCreatedAt: string;
  imageBytes: number[]; // byte array represented as number array
  location: string;
}

// Alias for backward compatibility
export type FarmData = FarmList;

// Currency-related types for marketplace functionality
export interface CurrencyValuePerToken {
  name: string;
  symbol: string;
  decimals: number;
  value: string;
  displayValue: string;
}

// Marketplace listing types
export interface DirectListing {
  id: string;
  marketplaceContractAddress: string;
  assetContractAddress: string;
  tokenId: string;
  seller?: string;
  pricePerToken: string;
  currencyContractAddress: string;
  quantity: string;
  isReservedListing: boolean;
  currencyValuePerToken?: CurrencyValuePerToken;
  startTimeInSeconds: number;
  endTimeInSeconds: number;
  status: 'UNSET' | 'CREATED' | 'COMPLETED' | 'CANCELLED' | 'ACTIVE' | 'EXPIRED';
}

export interface FarmPlotMetadata {
  name: string;
  description?: string;
  image?: string;
  external_url?: string;
  background_color?: string;
  properties?: Record<string, any>;
  attributes?: FarmList[];
}

export interface FarmPlotDirectListing extends DirectListing {
  asset: FarmPlotMetadata;
  imageBytes?: number[];
}
