import React from 'react';
import './FarmModal.css';
import { FarmList as FarmData } from '../../types/farm.types';
import { getFarmImageSrc } from '../../utils/imageUtils';

interface FarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: FarmData | null;
}

const FarmModal: React.FC<FarmModalProps> = ({ isOpen, onClose, farm }) => {
  if (!farm) return null;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleViewOnMap = () => {
    const { lat, lng } = farm.coordinates;
    
    // Using the most reliable Google Maps URL format that always works
    // This format directly opens the coordinates in Google Maps with a pin
    const googleMapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    
    console.log('Opening map for farm:', farm.farmName, 'at coordinates:', lat, lng);
    console.log('Map URL:', googleMapsUrl);
    
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleBuyFarm = () => {
    // Implement buy functionality
    console.log('Buy farm:', farm.id);
    // You can add your purchase logic here
  };

  const handleMoreDetails = () => {
    // Navigate to farm dashboard page with only farm name - FIXED VERSION
    console.log('Navigating to farm dashboard for:', farm.farmName);
    const url = `/farm-dashboard?farmName=${encodeURIComponent(farm.farmName)}`;
    console.log('URL:', url);
    window.location.href = url;
    onClose();
  };

  return (
    <div 
      className={`farm-modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="farm-modal">
        <div className="farm-modal-header">
          <h2 className="farm-modal-title">
            {farm.farmName}
          </h2>
          <button className="farm-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="farm-modal-content">
          <div className="farm-modal-body">
            <div className="farm-modal-image-section">
              {(() => {
                const imageData = getFarmImageSrc(farm.imageBytes, farm.image);
                return (
                  <img
                    src={imageData.src}
                    alt={farm.farmName}
                    className={`farm-modal-image ${imageData.isLogo ? 'farm-modal-image-logo' : ''}`}
                    style={imageData.isLogo ? {
                      opacity: 0.3,
                      filter: 'grayscale(100%) brightness(0.5)',
                      objectFit: 'contain',
                      padding: '40px'
                    } : {}}
                  />
                );
              })()}
            </div>

            <div className="farm-modal-details">
              {/* Basic Information */}
              <div className="farm-detail-section">
                <h4>
                  <i className="fas fa-info-circle"></i>
                  Farm Information
                </h4>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Farm ID:</span>
                  <span className="farm-detail-value">{farm.id}</span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Crop Type:</span>
                  <span className="farm-detail-value">{farm.cropType}</span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Location:</span>
                  <span className="farm-detail-value">{farm.location}</span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Coordinates:</span>
                  <span className="farm-coordinates">
                    {farm.coordinates.lat.toFixed(4)}, {farm.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Owner Information */}
              <div className="farm-detail-section">
                <h4>
                  <i className="fas fa-user"></i>
                  Owner Information
                </h4>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Owner Address:</span>
                  <span className="farm-detail-value">
                    {farm.owner.slice(0, 6)}...{farm.owner.slice(-4)}
                  </span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Created:</span>
                  <span className="farm-detail-value">{formatDate(farm.createdAt)}</span>
                </div>
                <div className="farm-detail-item">
                  <span className="farm-detail-label">Last Updated:</span>
                  <span className="farm-detail-value">{formatDate(farm.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {farm.description && (
            <div className="farm-detail-section" style={{ marginTop: '24px' }}>
              <h4>
                <i className="fas fa-file-text"></i>
                Description
              </h4>
              <p className="farm-description-text">
                {farm.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="farm-modal-actions">
            <button className="farm-modal-btn farm-modal-btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="farm-modal-btn farm-modal-btn-accent" onClick={handleMoreDetails}>
              <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
              More Details
            </button>
            <button className="farm-modal-btn farm-modal-btn-primary" onClick={handleViewOnMap}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
              View on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmModal;
