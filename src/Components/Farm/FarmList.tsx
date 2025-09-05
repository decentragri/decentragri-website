import React, { useEffect, useState } from 'react';
import './FarmList.css';
import FarmModal from './FarmModal';
import { FarmList as FarmData } from '../../types/farm.types';
import { getFarmList } from '../../services/farmService';
import { setDevelopmentToken, isAuthenticated, mockLogout } from '../../utils/auth';
import { getFarmImageSrc } from '../../utils/imageUtils';

const FarmList: React.FC = () => {
  const [farms, setFarms] = useState<FarmData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<FarmData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try API first, fallback to mock data automatically
        const farmData = await getFarmList(useMockData);
        setFarms(farmData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch farms';
        setError(errorMessage);
        console.error('Error fetching farms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [useMockData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewFarm = (farm: FarmData) => {
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
            <h1>Farm Directory</h1>
            <p>
              Explore our exclusive network of partner farms offering exceptional investment opportunities 
              in sustainable agriculture. Each farm represents a carefully vetted, high-yield agricultural 
              venture with transparent monitoring, proven track records, and strong potential returns. 
              Invest in the future of farming with our trusted partners.
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
                // Debug logging for imageBytes
                console.log(`Farm ${farm.farmName}:`, {
                  id: farm.id,
                  hasImageBytes: !!farm.imageBytes,
                  imageBytesLength: farm.imageBytes?.length || 0,
                  imageBytesType: typeof farm.imageBytes,
                  imageUrl: farm.image,
                  firstFewBytes: farm.imageBytes?.slice(0, 10) || 'none'
                });

                const imageData = getFarmImageSrc(farm.imageBytes, farm.image);

                return (
                  <div className="farm-card" key={farm.id}>
                    <img
                      src={imageData.src}
                      alt={farm.farmName}
                      className={`farm-image ${imageData.isLogo ? 'farm-image-logo' : ''}`}
                      style={imageData.isLogo ? {
                        opacity: 0.3,
                        filter: 'grayscale(100%) brightness(0.5)',
                        objectFit: 'contain',
                        padding: '20px',
                        cursor: 'pointer'
                      } : {
                        cursor: 'pointer'
                      }}
                      onClick={() => handleViewFarm(farm)}
                    />
                    <div className="farm-card-content">
                    <h3>{farm.farmName}</h3>
                    
                    <div className="farm-info-items">
                      <div className="farm-info-item">
                        <i className="fas fa-seedling"></i>
                        <span className="farm-info-label">Crop:</span>
                        <span className="farm-crop-type">{farm.cropType}</span>
                      </div>
                      
                      <div className="farm-info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span className="farm-info-label">Location:</span>
                        <span className="farm-detail-value">{farm.location}</span>
                      </div>
                      
                      <div className="farm-info-item">
                        <i className="fas fa-user"></i>
                        <span className="farm-info-label">Owner:</span>
                        <span className="farm-detail-value">{farm.owner.slice(0, 6)}...{farm.owner.slice(-4)}</span>
                      </div>
                      
                      <div className="farm-info-item">
                        <i className="fas fa-globe"></i>
                        <span className="farm-info-label">Coords:</span>
                        <span className="farm-coordinates">
                          {farm.coordinates.lat.toFixed(4)}, {farm.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="farm-stats">
                      <div className="farm-updated">
                        <i className="fas fa-clock"></i>
                        Updated {formatDate(farm.updatedAt)}
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
