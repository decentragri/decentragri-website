# CORS Fix Guide

## Problem
```
Access to fetch at 'http://localhost:9085/api/farm/list' from origin 'http://localhost:5174' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution 1: Go Backend CORS Configuration (Recommended)

Add CORS middleware to your Go Fiber server:

### Install Fiber CORS middleware:
```bash
go get github.com/gofiber/fiber/v2/middleware/cors
```

### Add to your main.go or server setup:
```go
package main

import (
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "decentragri-app-cx-server/routes"
)

func main() {
    app := fiber.New()
    
    // CORS Configuration
    app.Use(cors.New(cors.Config{
        AllowOrigins:     "http://localhost:5173,http://localhost:5174,http://localhost:3000",
        AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
        AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
        AllowCredentials: true,
    }))
    
    // Your existing routes
    routes.FarmRoutes(app)
    
    app.Listen(":9085")
}
```

### Alternative - More permissive for development:
```go
app.Use(cors.New(cors.Config{
    AllowOrigins: "*",
    AllowHeaders: "*",
    AllowMethods: "*",
}))
```

## Solution 2: Frontend Proxy (Already Applied)

The frontend now uses Vite proxy configuration:

### vite.config.ts:
```typescript
server: {
    proxy: {
        '/api': {
            target: 'http://localhost:9085',
            changeOrigin: true,
            secure: false,
        }
    }
}
```

### API Config:
```typescript
BASE_URL: process.env.NODE_ENV === 'development' ? '' : 'http://localhost:9085'
```

## Testing the Fix

1. **Apply Backend CORS** (recommended):
   - Add CORS middleware to your Go server
   - Restart your Go server on port 9085
   
2. **Test API Call**:
   - Open http://localhost:5174/farm
   - Click "🔑 Set Dev Token" to set authentication
   - Toggle to "🌐 Using API Data"
   - Check browser console for successful API calls

3. **Expected Behavior**:
   - No CORS errors in browser console
   - API calls succeed or show authentication errors
   - Farm data loads from your Go backend

## Troubleshooting

### Still getting CORS errors?
1. Check Go server logs for any errors
2. Verify Go server is running on port 9085
3. Ensure CORS middleware is applied before your routes
4. Try the more permissive CORS config for testing

### Authentication errors?
1. Use the development token setter in the frontend
2. Check if your Go middleware is extracting tokens correctly
3. Verify token format matches your backend expectations

## Production Notes

- Remove `AllowOrigins: "*"` in production
- Set specific origins for your production domains
- Keep `AllowCredentials: true` for authentication
- Consider environment-based CORS configuration
