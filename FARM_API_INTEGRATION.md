# Farm API Integration Documentation

## Overview
This document describes the integration between the DecentrAgri PWA frontend and the Go backend API for farm data management.

## API Endpoint
- **Base URL**: `http://localhost:8085`
- **Endpoint**: `GET /api/farm/list`
- **Authentication**: Required (Bearer Token)

## Go Backend Route
```go
// GET /api/farm/list - Get user's farms with formatted dates and image bytes
farmGroup.Get("/list", func(c *fiber.Ctx) error {
    token := middleware.ExtractToken(c)
    response, err := farmservices.GetFarmList(token)
    if err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
    }
    return c.JSON(response)
})
```

## Frontend Implementation

### 1. API Configuration (`src/config/api.ts`)
- Centralized API configuration
- Helper functions for headers and error handling
- Timeout management (10 seconds)

### 2. Farm Service (`src/services/farmService.ts`)
- `fetchFarmListFromAPI()`: Direct API call to Go backend
- `getFarmList(useMockData)`: Smart function that tries API first, falls back to mock data
- Error handling with detailed messages

### 3. Farm List Component (`src/Components/Farm/FarmList.tsx`)
- Integrated API service
- Development controls for testing
- Authentication status monitoring
- Automatic fallback to mock data on API failure

## Data Structure (TypeScript Interface)
```typescript
interface FarmList {
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
  imageBytes: number[];
  location: string;
}

interface FarmCoordinates {
  lat: number;
  lng: number;
}
```

## Authentication
The API requires a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

### Development Authentication
For development purposes, use the development controls:
1. Click "🔑 Set Dev Token" to generate a mock token
2. The token is stored in localStorage
3. API calls will include this token

## Usage Examples

### 1. Get Farm List (Production)
```typescript
import { getFarmList } from '../services/farmService';

const farms = await getFarmList(); // Tries API first, fallback to mock
```

### 2. Force Mock Data (Development)
```typescript
const farms = await getFarmList(true); // Uses mock data only
```

### 3. Direct API Call
```typescript
import { fetchFarmListFromAPI } from '../services/farmService';

const farms = await fetchFarmListFromAPI(); // Direct API call only
```

## Error Handling
The service handles various error scenarios:
- **401 Unauthorized**: Token missing or invalid
- **Network errors**: Connection issues
- **Timeout**: Request takes longer than 10 seconds
- **Server errors**: 500, 502, etc.

All errors automatically fall back to mock data to ensure the UI remains functional during development.

## Development Features

### Development Panel
The farm list page includes development controls:
- **Data Source Toggle**: Switch between API and mock data
- **Authentication Status**: Shows if auth token is present
- **Token Management**: Set development tokens or logout

### Mock Data Fallback
When API calls fail, the service automatically provides mock data to ensure:
- UI remains functional
- Development can continue
- No breaking changes to existing components

## Production Deployment
1. Update `API_CONFIG.BASE_URL` in `src/config/api.ts`
2. Remove development controls from `FarmList.tsx`
3. Implement proper authentication system
4. Set up environment variables for API configuration

## Testing
1. **With Backend Running**: 
   - Start Go server on localhost:8085
   - Set development token
   - Toggle to "Using API Data"
   
2. **Without Backend**: 
   - Toggle to "Using Mock Data"
   - Or let automatic fallback handle it

## Security Notes
- Tokens are stored in localStorage for development
- Use secure token storage in production
- Implement proper token refresh mechanisms
- Add CORS configuration on backend for production domains
