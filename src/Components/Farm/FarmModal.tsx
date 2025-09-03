import React from 'react';
import './FarmModal.css';

export interface FarmCoordinates {
  lat: number;
  lng: number;
}

export interface FarmPlotAttributes {
  id: string;
  price: string;
  farmName: string;
  description: string;
  cropType: string;
  owner: string;
  image: string;
  location: string;
  coordinates: FarmCoordinates;
  createdAt: string;
}

export interface CurrencyValuePerToken {
  name: string;
  symbol: string;
  decimals: number;
  value: string;
  displayValue: string;
}

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
  attributes?: FarmPlotAttributes[];
}

export interface FarmPlotDirectListing extends DirectListing {
  asset: FarmPlotMetadata;
  imageBytes?: number[];
}

interface FarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: FarmPlotDirectListing | null;
}

const FarmModal: React.FC<FarmModalProps> = ({ isOpen, onClose, farm }) => {
  if (!farm) return null;

  const farmAttributes = farm.asset.attributes?.[0];
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = () => {
    if (farm.currencyValuePerToken) {
      return `${farm.currencyValuePerToken.displayValue} ${farm.currencyValuePerToken.symbol}`;
    }
    return farm.pricePerToken;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '#6DBE45';
      case 'COMPLETED':
        return '#2ecc71';
      case 'CANCELLED':
        return '#e74c3c';
      case 'EXPIRED':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBuyFarm = () => {
    // Implement buy functionality
    console.log('Buy farm:', farm.id);
    // You can add your purchase logic here
  };

  return (
    <div 
      className={`farm-modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="farm-modal">
        <div className="farm-modal-header">
          <h2 className="farm-modal-title">
            {farm.asset.name || farmAttributes?.farmName || 'Farm Plot'}
          </h2>
          <button className="farm-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="farm-modal-content">
          <div className="farm-modal-body">
            <div className="farm-modal-image-section">
              <img
                src={farm.asset.image || farmAttributes?.image || '/assets/img/banner/banner-bg.jpg'}
                alt={farm.asset.name || farmAttributes?.farmName}
                className="farm-modal-image"
              />
              <div 
                className="farm-modal-status-badge"
                style={{ backgroundColor: getStatusColor(farm.status) }}
              >
                {farm.status}
              </div>
            </div>

            <div className="farm-modal-details">
              {/* Basic Information */}
              <div className="farm-detail-section">
                <h4>
                  <i className="fas fa-info-circle"></i>
                  Basic Information
                </h4>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Farm ID:</span>
                  <span className="farm-detail-value">{farmAttributes?.id || farm.tokenId}</span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Crop Type:</span>
                  <span className="farm-detail-value">{farmAttributes?.cropType || 'Not specified'}</span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Location:</span>
                  <span className="farm-detail-value">{farmAttributes?.location || 'Unknown'}</span>
                </div>
                {farmAttributes?.coordinates && (
                  <div className="farm-detail-item">
                    <span className="farm-detail-label">Coordinates:</span>
                    <span className="farm-coordinates">
                      {farmAttributes.coordinates.lat.toFixed(4)}, {farmAttributes.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Listing Information */}
              <div className="farm-detail-section">
                <h4>
                  <i className="fas fa-tag"></i>
                  Listing Details
                </h4>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Price:</span>
                  <span className="farm-detail-value farm-price">{formatPrice()}</span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Quantity:</span>
                  <span className="farm-detail-value">{farm.quantity}</span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Seller:</span>
                  <span className="farm-detail-value">
                    {farm.seller ? `${farm.seller.slice(0, 6)}...${farm.seller.slice(-4)}` : 'Unknown'}
                  </span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Listed:</span>
                  <span className="farm-detail-value">{formatDate(farm.startTimeInSeconds)}</span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Expires:</span>
                  <span className="farm-detail-value">{formatDate(farm.endTimeInSeconds)}</span>
                </div>
              </div>

              {/* Owner Information */}
              {farmAttributes?.owner && (
                <div className="farm-detail-section">
                  <h4>
                    <i className="fas fa-user"></i>
                    Owner Information
                  </h4>
                  <div className="farm-detail-item">
                    <span className="farm-detail-label">Owner:</span>
                    <span className="farm-detail-value">
                      {farmAttributes.owner.slice(0, 6)}...{farmAttributes.owner.slice(-4)}
                    </span>
                  </div>
                  {farmAttributes.createdAt && (
                    <div className="farm-detail-item">
                      <span className="farm-detail-label">Created:</span>
                      <span className="farm-detail-value">
                        {new Date(farmAttributes.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {(farm.asset.description || farmAttributes?.description) && (
            <div className="farm-detail-section" style={{ marginTop: '24px' }}>
              <h4>
                <i className="fas fa-file-text"></i>
                Description
              </h4>
              <p className="farm-description-text">
                {farm.asset.description || farmAttributes?.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="farm-modal-actions">
            <button className="farm-modal-btn farm-modal-btn-secondary" onClick={onClose}>
              Close
            </button>
            {farm.status === 'ACTIVE' && (
              <button className="farm-modal-btn farm-modal-btn-primary" onClick={handleBuyFarm}>
                <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i>
                Buy Now - {formatPrice()}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmModal;
