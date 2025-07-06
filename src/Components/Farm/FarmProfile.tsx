import { useEffect, useState } from 'preact/hooks';
import { useLocation, useRoute } from 'preact-iso';
import { useThemeStore } from '@context/ThemeContext';
import { getFarmList } from '@client/farmer/clientFarmer';
import { FarmData } from '../../../server/src/farmer.services/farmer.interface';
import { PlantScanModal } from '../Scan/PlantScanModal';
import { SoilScanModal } from '../Scan/SoilScanModal';
import './FarmProfile.css';

const FarmProfile = () => {
  const { params } = useRoute();
  const farmId = params?.id as string;
  const [farm, setFarm] = useState<FarmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlantScanModal, setShowPlantScanModal] = useState(false);
  const [showSoilScanModal, setShowSoilScanModal] = useState(false);
  const { isDarkMode } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    const fetchFarmDetails = async () => {
      if (!farmId) return;
      
      try {
        const result = await getFarmList();
        if (result instanceof Error) {
          throw result;
        }
        const foundFarm = result.find(f => f.id === farmId);
        if (!foundFarm) {
          throw new Error('Farm not found');
        }
        setFarm(foundFarm);
      } catch (err) {
        console.error('Error fetching farm details:', err);
        setError('Failed to load farm details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmDetails();
  }, [farmId]);

  if (loading) {
    return (
      <div className={`farm-profile-container ${isDarkMode ? 'dark' : ''}`}>
        <div className="farm-profile-loading">
          <div className="spinner"></div>
          <p>Loading farm details...</p>
        </div>
      </div>
    );
  }

  const handlePlantScanSubmit = async (scanData: {
    imageBytes: string;
    cropType: string;
    farmName: string;
    location?: { lat: number; lng: number };
    note?: string;
  }) => {
    try {
      // TODO: Implement API call to submit plant scan data
      console.log('Submitting plant scan:', scanData);
      // Example API call:
      // const result = await submitPlantScan(scanData);
    } catch (error) {
      console.error('Error submitting plant scan:', error);
      // Handle error (show error message to user)
    }
  };

  const handleSoilScanSubmit = async (scanData: any) => {
    try {
      // TODO: Implement API call to submit soil scan data
      console.log('Submitting soil scan:', scanData);
      // Example API call:
      // const result = await submitSoilScan(scanData);
    } catch (error) {
      console.error('Error submitting soil scan:', error);
      // Handle error (show error message to user)
    }
  };

  if (error || !farm) {
    console.log('Farm not found or error:', { error, farm, farmId });
    return (
      <div className={`farm-profile-container ${isDarkMode ? 'dark' : ''}`}>
        <div className="farm-profile-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error || 'Farm not found'}</p>
          <button className="back-button" onClick={() => location.route('/dashboard/farm')}>
            <i className="fas fa-arrow-left"></i> Back to Farms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`farm-profile-container ${isDarkMode ? 'dark' : ''}`}>
      <div className="farm-profile-header">
        <button className="back-button" onClick={() => location.route('/dashboard/farm')}>
          <i className="fas fa-arrow-left"></i> Back to Farms
        </button>
        <h1>{farm.farmName}</h1>
      </div>

      <div className="farm-profile-content">
        <div className="farm-profile-hero">
          <div className="farm-cover-photo">
            <i className="fas fa-image"></i>
            <span>Farm Cover Photo</span>
          </div>
          <div className="farm-basic-info">
            <div className="farm-avatar">
              <i className="fas fa-tractor"></i>
            </div>
            <div className="farm-details">
              <h2>{farm.farmName}</h2>
              <p className="farm-location">
                <i className="fas fa-map-marker-alt"></i>
                {farm.location?.displayName || farm.location || 'Location not specified'}
              </p>
              <div className="farm-stats">
                <div className="stat">
                  <span className="stat-value">-</span>
                  <span className="stat-label">Size</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{farm.cropType || 'N/A'}</span>
                  <span className="stat-label">Crop Type</span>
                </div>
              </div>
              
              <div className="scan-actions">
                <button 
                  type="button"
                  className="scan-button crop-scan"
                  onClick={() => setShowPlantScanModal(true)}
                >
                  <i className="fas fa-leaf"></i>
                  <span>Scan Plant Health</span>
                </button>
                <button 
                  type="button"
                  className="scan-button soil-scan"
                  onClick={() => setShowSoilScanModal(true)}
                >
                  <i className="fas fa-seedling"></i>
                  <span>Soil Analysis</span>
                </button>
              </div>
              
              <PlantScanModal
                isOpen={showPlantScanModal}
                onClose={() => setShowPlantScanModal(false)}
                farm={farm}
                onSubmit={handlePlantScanSubmit}
              />
              
              <SoilScanModal
                isOpen={showSoilScanModal}
                onClose={() => setShowSoilScanModal(false)}
                farm={farm}
                username="current_user" // Replace with actual username from auth context
                sensorId="sensor_123" // Replace with actual sensor ID
                onSubmit={handleSoilScanSubmit}
              />
            </div>
          </div>
        </div>

        <div className="farm-profile-sections">
          <div className="farm-section">
            <h3>About This Farm</h3>
            <p className="farm-description">
              {farm.description || 'No description available for this farm.'}
            </p>
          </div>

          <div className="farm-section">
            <h3>Farm Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Farm ID:</span>
                <span className="detail-value">{farm.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="status-badge active">
                  Active
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Crop Type:</span>
                <span className="detail-value">{farm.cropType || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmProfile;
