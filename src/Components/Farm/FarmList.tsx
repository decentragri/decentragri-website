import React, { useEffect, useState } from 'react';
import './FarmList.css';
import FarmModal, { FarmPlotDirectListing } from './FarmModal';

export interface FarmCoordinates {
  lat: number;
  lng: number;
}

// Updated interface to match the Go struct
export interface FarmList {
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

export interface CurrencyValuePerToken {
  name: string;
  symbol: string;
  decimals: number;
  value: string;
  displayValue: string;
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

// Mock data based on your updated Go struct
const mockFarms: FarmPlotDirectListing[] = [
  {
    id: '1',
    marketplaceContractAddress: '0x123...',
    assetContractAddress: '0x456...',
    tokenId: '1001',
    seller: '0x789abcdef123456789abcdef123456789abcdef12',
    pricePerToken: '100000000000000000000',
    currencyContractAddress: '0xA0b86a33E6441c8c95CEF4C0F623c9C3c6c6F02D',
    quantity: '1',
    isReservedListing: false,
    currencyValuePerToken: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      value: '100000000000000000000',
      displayValue: '100.0'
    },
    startTimeInSeconds: 1693747200,
    endTimeInSeconds: 1725369600,
    status: 'ACTIVE',
    asset: {
      name: 'Green Valley Farm Plot #1001',
      description: 'A premium agricultural plot with fertile soil perfect for organic farming. Located in a prime area with excellent water access and transportation links.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&crop=center',
      attributes: [{
        owner: '0x789abcdef123456789abcdef123456789abcdef12',
        farmName: 'Green Valley Farm',
        id: 'farm_001',
        cropType: 'Corn',
        description: 'Premium organic farming plot with excellent soil quality',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&crop=center',
        coordinates: { lat: 13.4176, lng: 123.2833 },
        updatedAt: '2024-09-03T15:30:00Z',
        createdAt: '2024-09-01T10:00:00Z',
        formattedUpdatedAt: 'September 3, 2024 at 3:30 PM',
        formattedCreatedAt: 'September 1, 2024 at 10:00 AM',
        imageBytes: [],
        location: 'Bicol Region, Philippines'
      }]
    },
    imageBytes: []
  },
  {
    id: '2',
    marketplaceContractAddress: '0x123...',
    assetContractAddress: '0x456...',
    tokenId: '1002',
    seller: '0x987fedcba987654321fedcba987654321fedcba98',
    pricePerToken: '75000000000000000000',
    currencyContractAddress: '0xA0b86a33E6441c8c95CEF4C0F623c9C3c6c6F02D',
    quantity: '1',
    isReservedListing: false,
    currencyValuePerToken: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      value: '75000000000000000000',
      displayValue: '75.0'
    },
    startTimeInSeconds: 1693747200,
    endTimeInSeconds: 1725369600,
    status: 'ACTIVE',
    asset: {
      name: 'Sunrise Agricultural Estate #1002',
      description: 'Spacious rice farming estate with modern irrigation systems and sustainable farming practices.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&crop=center',
      attributes: [{
        owner: '0x987fedcba987654321fedcba987654321fedcba98',
        farmName: 'Sunrise Agricultural Estate',
        id: 'farm_002',
        cropType: 'Rice',
        description: 'Modern rice farming with advanced irrigation',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&crop=center',
        coordinates: { lat: 14.2691, lng: 121.1607 },
        updatedAt: '2024-09-02T16:45:00Z',
        createdAt: '2024-08-28T14:30:00Z',
        formattedUpdatedAt: 'September 2, 2024 at 4:45 PM',
        formattedCreatedAt: 'August 28, 2024 at 2:30 PM',
        imageBytes: [],
        location: 'Laguna Province, Philippines'
      }]
    },
    imageBytes: []
  },
  {
    id: '3',
    marketplaceContractAddress: '0x123...',
    assetContractAddress: '0x456...',
    tokenId: '1003',
    seller: '0xabc123def456ghi789jkl012mno345pqr678stu90',
    pricePerToken: '150000000000000000000',
    currencyContractAddress: '0xA0b86a33E6441c8c95CEF4C0F623c9C3c6c6F02D',
    quantity: '1',
    isReservedListing: false,
    currencyValuePerToken: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      value: '150000000000000000000',
      displayValue: '150.0'
    },
    startTimeInSeconds: 1693747200,
    endTimeInSeconds: 1725369600,
    status: 'ACTIVE',
    asset: {
      name: 'Mountain View Coffee Plantation #1003',
      description: 'Premium coffee growing land at optimal altitude with perfect climate conditions for arabica beans.',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop&crop=center',
      attributes: [{
        owner: '0xabc123def456ghi789jkl012mno345pqr678stu90',
        farmName: 'Mountain View Plantation',
        id: 'farm_003',
        cropType: 'Coffee',
        description: 'High-altitude coffee plantation with arabica beans',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop&crop=center',
        coordinates: { lat: 16.4023, lng: 120.5979 },
        updatedAt: '2024-09-04T08:20:00Z',
        createdAt: '2024-09-02T09:15:00Z',
        formattedUpdatedAt: 'September 4, 2024 at 8:20 AM',
        formattedCreatedAt: 'September 2, 2024 at 9:15 AM',
        imageBytes: [],
        location: 'Benguet Province, Philippines'
      }]
    },
    imageBytes: []
  },
  {
    id: '4',
    marketplaceContractAddress: '0x123...',
    assetContractAddress: '0x456...',
    tokenId: '1004',
    seller: '0xdef456abc789ghi012jkl345mno678pqr901stu23',
    pricePerToken: '120000000000000000000',
    currencyContractAddress: '0xA0b86a33E6441c8c95CEF4C0F623c9C3c6c6F02D',
    quantity: '1',
    isReservedListing: false,
    currencyValuePerToken: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      value: '120000000000000000000',
      displayValue: '120.0'
    },
    startTimeInSeconds: 1693747200,
    endTimeInSeconds: 1725369600,
    status: 'COMPLETED',
    asset: {
      name: 'Coastal Organic Vegetable Farm #1004',
      description: 'Certified organic vegetable farm with diverse crop rotation and sustainable practices near the coast.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&crop=center',
      attributes: [{
        owner: '0xdef456abc789ghi012jkl345mno678pqr901stu23',
        farmName: 'Coastal Organic Farm',
        id: 'farm_004',
        cropType: 'Vegetables',
        description: 'Certified organic with diverse vegetables',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&crop=center',
        coordinates: { lat: 14.6760, lng: 120.4437 },
        updatedAt: '2024-09-03T12:30:00Z',
        createdAt: '2024-08-30T16:45:00Z',
        formattedUpdatedAt: 'September 3, 2024 at 12:30 PM',
        formattedCreatedAt: 'August 30, 2024 at 4:45 PM',
        imageBytes: [],
        location: 'Bataan Province, Philippines'
      }]
    },
    imageBytes: []
  }
];

const fetchFarms = async (): Promise<FarmPlotDirectListing[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFarms);
    }, 1000);
  });
  
  // Replace with your actual API endpoint
  // const response = await fetch('/api/farms');
  // if (!response.ok) throw new Error('Failed to fetch farms');
  // return response.json();
};

const FarmList: React.FC = () => {
  const [farms, setFarms] = useState<FarmPlotDirectListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<FarmPlotDirectListing | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchFarms()
      .then(setFarms)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (farm: FarmPlotDirectListing) => {
    if (farm.currencyValuePerToken) {
      return `${farm.currencyValuePerToken.displayValue} ${farm.currencyValuePerToken.symbol}`;
    }
    return farm.pricePerToken;
  };

  const handleViewFarm = (farm: FarmPlotDirectListing) => {
    setSelectedFarm(farm);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFarm(null);
  };

  if (loading) {
    return (
      <section className="farm-list-section">
        <div className="farm-list-container">
          <div className="farm-loading">
            <i className="fas fa-spinner fa-spin" style={{ marginRight: '12px' }}></i>
            Loading farms...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="farm-list-section">
        <div className="farm-list-container">
          <div className="farm-error">
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '12px' }}></i>
            Error: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="farm-list-section">
        <div className="farm-list-container">
          <div className="farm-list-header">
            <h1>Farm Marketplace</h1>
            <p>
              Discover and invest in premium agricultural plots using blockchain technology. 
              Each farm is verified and tokenized for secure ownership.
            </p>
          </div>

          {farms.length === 0 ? (
            <div className="farm-empty-state">
              <i className="fas fa-seedling"></i>
              <h3>No farms available</h3>
              <p>Check back later for new farm listings.</p>
            </div>
          ) : (
            <div className="farm-list-grid">
              {farms.map(farm => {
                const farmAttributes = farm.asset.attributes?.[0];
                return (
                  <div className="farm-card" key={farm.id}>
                      <img
                        src={
                          farm.asset.image && farm.asset.image !== '' ? farm.asset.image :
                          farmAttributes?.image && farmAttributes?.image !== '' ? farmAttributes.image :
                          '/assets/img/placeholder/farm-placeholder.jpg'
                        }
                        alt={farm.asset.name || farmAttributes?.farmName}
                        className="farm-image"
                      />
                    <div className="farm-card-content">
                      <h3>{farm.asset.name || farmAttributes?.farmName || 'Farm Plot'}</h3>
                      
                      <div className="farm-info-item">
                        <i className="fas fa-seedling"></i>
                        <span className="farm-info-label">Crop:</span>
                        <span className="farm-crop-type">{farmAttributes?.cropType || 'Unknown'}</span>
                      </div>
                      
                      <div className="farm-info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span className="farm-info-label">Location:</span>
                        <span className="farm-detail-value">{farmAttributes?.location || 'Unknown'}</span>
                      </div>
                      
                      <div className="farm-info-item">
                        <i className="fas fa-tag"></i>
                        <span className="farm-info-label">Price:</span>
                        <span className="farm-detail-value farm-price">{formatPrice(farm)}</span>
                      </div>
                      
                      {farmAttributes?.coordinates && (
                        <div className="farm-info-item">
                          <i className="fas fa-globe"></i>
                          <span className="farm-info-label">Coords:</span>
                          <span className="farm-coordinates">
                            {farmAttributes.coordinates.lat.toFixed(4)}, {farmAttributes.coordinates.lng.toFixed(4)}
                          </span>
                        </div>
                      )}
                      
                      <div className="farm-stats">
                        <div className="farm-updated">
                          <i className="fas fa-clock"></i>
                          Listed {formatDate(farm.startTimeInSeconds)}
                        </div>
                        <button 
                          className="farm-view-btn"
                          onClick={() => handleViewFarm(farm)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <FarmModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        farm={selectedFarm}
      />
    </>
  );
};

export default FarmList;
