import { useEffect, useState } from 'preact/hooks';
import { useLocation, useRoute } from 'preact-iso';
import { useThemeStore } from '@context/ThemeContext';
import { getFarmList } from '@client/farmer/clientFarmer';
import { FarmData } from '../../../server/src/farmer.services/farmer.interface';
import { PlantScanModal } from '../Scan/PlantScanModal';
import { SoilScanModal } from '../Scan/SoilScanModal';
import { FarmScansCard } from './FarmScansCard';
import { SensorReadings } from '../../../server/src/ai.services/soil.ai.team.service/soil.types';
import './FarmProfile.css';
import './FarmScansCard.css';

const FarmProfile = () => {
  const { params } = useRoute();
  const farmId = params?.id as string;
  const [farm, setFarm] = useState<FarmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Define types for our scan data
  type ScanBase = {
    id: string;
    type: 'plant' | 'soil';
    date: string;
    preview: {
      title: string;
      values: Record<string, string>;
    };
    details: Record<string, any>;
  };

  const [showPlantScanModal, setShowPlantScanModal] = useState(false);
  const [showSoilScanModal, setShowSoilScanModal] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanBase | null>(null);
  
  // Mock data for plant scans and soil analyses
  const initialScans: ScanBase[] = [
    // Plant Scans
    {
      id: 'plant-1',
      type: 'plant' as const,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      preview: {
        title: 'Corn Field Health Scan',
        values: {
          'Crop Type': 'Corn',
          'Status': 'Healthy',
          'Disease Risk': 'Low',
          'Confidence': '92%'
        }
      },
      details: {
        'Scan ID': 'PLANT-3F9H2K1L',
        'Date': new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(),
        'Farm': 'Sunny Acres',
        'Crop Type': 'Corn (Zea mays)',
        'Status': 'Healthy',
        'Disease Risk': 'Low (8%)',
        'Confidence': '92%',
        'Location': '14.6760° N, 121.0437° E',
        'Notes': 'No signs of disease detected. Plants show good growth and color.',
        'Leaf Condition': 'Normal',
        'Growth Stage': 'V6 (6th leaf stage)',
        'Image Resolution': '3024x4032',
        'Analysis Model': 'PlantNet v2.3.1',
        'Recommendations': ['Continue current watering schedule', 'Check again in 1 week']
      }
    },
    {
      id: 'plant-2',
      type: 'plant' as const,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      preview: {
        title: 'Rice Paddy Health Scan',
        values: {
          'Crop Type': 'Rice',
          'Status': 'Warning',
          'Disease Risk': 'Medium',
          'Confidence': '87%'
        }
      },
      details: {
        'Scan ID': 'PLANT-7H2J9K1M',
        'Date': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString(),
        'Farm': 'Green Valley Fields',
        'Crop Type': 'Rice (Oryza sativa)',
        'Status': 'Warning - Possible nutrient deficiency',
        'Disease Risk': 'Medium (35%)',
        'Confidence': '87%',
        'Location': '14.6789° N, 121.0456° E',
        'Notes': 'Yellowing of lower leaves detected. Possible nitrogen deficiency.',
        'Leaf Condition': 'Yellowing lower leaves',
        'Growth Stage': 'Tillering',
        'Image Resolution': '3024x4032',
        'Analysis Model': 'PlantNet v2.3.1',
        'Recommendations': [
          'Apply nitrogen-rich fertilizer',
          'Check soil moisture levels',
          'Rescan in 3 days'
        ]
      }
    },
    // Soil Analyses
    {
      id: 'soil-1',
      type: 'soil' as const,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      preview: {
        title: 'Field A1 Soil Analysis',
        values: {
          'Moisture': '42%',
          'pH': '6.5',
          'Fertility': '78%',
          'Temp': '28°C'
        }
      },
      details: {
        'Analysis ID': 'SOIL-5K9L2M3N',
        'Date': new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
        'Farm': 'Sunny Acres',
        'Sensor ID': 'SENSOR-A1-2023',
        'Moisture': '42%',
        'pH Level': '6.5',
        'Fertility': '78%',
        'Temperature': '28°C',
        'Sunlight': '85,000 lux',
        'Humidity': '65%',
        'Crop Type': 'Corn',
        'Analysis Model': 'SoilMaster Pro v1.2.0',
        'Data Points': '15,230',
        'Confidence': '94%',
        'Nitrogen (N)': 'High',
        'Phosphorus (P)': 'Medium',
        'Potassium (K)': 'High',
        'Organic Matter': '3.2%',
        'Salinity': '0.5 dS/m (Low)',
        'Recommendations': [
          'Adequate moisture levels maintained',
          'Ideal pH for most crops',
          'Consider phosphorus supplement for next planting'
        ]
      }
    },
    {
      id: 'soil-2',
      type: 'soil' as const,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      preview: {
        title: 'Field B2 Soil Analysis',
        values: {
          'Moisture': '28%',
          'pH': '5.2',
          'Fertility': '65%',
          'Temp': '32°C'
        }
      },
      details: {
        'Analysis ID': 'SOIL-8P7O6I9U',
        'Date': new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleString(),
        'Farm': 'Green Valley Fields',
        'Sensor ID': 'SENSOR-B2-2023',
        'Moisture': '28%',
        'pH Level': '5.2',
        'Fertility': '65%',
        'Temperature': '32°C',
        'Sunlight': '92,000 lux',
        'Humidity': '58%',
        'Crop Type': 'Rice',
        'Analysis Model': 'SoilMaster Pro v1.2.0',
        'Data Points': '18,450',
        'Confidence': '91%',
        'Nitrogen (N)': 'Medium',
        'Phosphorus (P)': 'Low',
        'Potassium (K)': 'Medium',
        'Organic Matter': '2.1%',
        'Salinity': '0.8 dS/m (Moderate)',
        'Alerts': [
          'Low soil moisture detected',
          'Slightly acidic pH - consider liming',
          'Low phosphorus levels'
        ],
        'Recommendations': [
          'Increase irrigation frequency',
          'Apply agricultural lime to raise pH',
          'Add phosphorus-rich fertilizer',
          'Consider adding organic matter to improve water retention'
        ]
      }
    }
  ];

  const [scans, setScans] = useState(initialScans);
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
      
      // Mock response - in a real app, this would come from your API
      const newScan: ScanBase = {
        id: `plant-${Date.now()}`,
        type: 'plant',
        date: new Date().toISOString(),
        preview: {
          title: 'Plant Health Scan',
          values: {
            'Crop Type': scanData.cropType || 'Unknown',
            'Status': 'Healthy',
            'Disease Risk': 'Low',
            'Confidence': '85%'
          }
        },
        details: {
          'Scan ID': `PLANT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          'Date': new Date().toLocaleString(),
          'Farm': scanData.farmName,
          'Crop Type': scanData.cropType || 'Not specified',
          'Status': 'Healthy',
          'Disease Risk': 'Low (15%)',
          'Confidence': '85%',
          'Location': scanData.location 
            ? `${scanData.location.lat.toFixed(4)}, ${scanData.location.lng.toFixed(4)}`
            : 'Not available',
          'Notes': scanData.note || 'No additional notes',
          'Leaf Condition': 'Normal',
          'Growth Stage': 'Vegetative',
          'Image Resolution': '3024x4032',
          'Analysis Model': 'PlantNet v2.3.1',
          'Recommendations': ['Continue current watering schedule', 'Check again in 1 week']
        }
      };

      setScans(prev => [newScan, ...prev]);
      setShowPlantScanModal(false);
    } catch (error) {
      console.error('Error submitting plant scan:', error);
      // Handle error (show error message to user)
    }
  };

  const handleSoilScanSubmit = async (scanData: SensorReadings) => {
    try {
      // TODO: Implement API call to submit soil scan data
      console.log('Submitting soil scan:', scanData);
      
      // Mock response - in a real app, this would come from your API
      const newScan: ScanBase = {
        id: `soil-${Date.now()}`,
        type: 'soil',
        date: new Date().toISOString(),
        preview: {
          title: 'Soil Analysis',
          values: {
            'Moisture': `${scanData.moisture}%`,
            'pH': scanData.ph.toFixed(1),
            'Fertility': `${scanData.fertility}%`,
            'Temp': `${scanData.temperature}°C`
          }
        },
        details: {
          'Analysis ID': `SOIL-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          'Date': new Date().toLocaleString(),
          'Farm': scanData.farmName,
          'Sensor ID': scanData.sensorId,
          'Moisture': `${scanData.moisture}%`,
          'pH Level': scanData.ph.toFixed(1),
          'Fertility': `${scanData.fertility}%`,
          'Temperature': `${scanData.temperature}°C`,
          'Sunlight': `${scanData.sunlight} lux`,
          'Humidity': `${scanData.humidity}%`,
          'Crop Type': scanData.cropType || 'Not specified',
          'Analysis Model': 'SoilMaster Pro v1.2.0',
          'Data Points': '12,450',
          'Confidence': '92%',
          'Nitrogen (N)': 'Medium',
          'Phosphorus (P)': 'Medium',
          'Potassium (K)': 'High',
          'Organic Matter': '3.1%',
          'Salinity': '0.6 dS/m (Low)',
          'Recommendations': [
            'Ideal soil conditions maintained',
            'Continue current fertilization schedule',
            'Check again in 2 weeks'
          ]
        }
      };

      setScans(prev => [newScan, ...prev]);
      setShowSoilScanModal(false);
    } catch (error) {
      console.error('Error submitting soil scan:', error);
      // Handle error (show error message to user)
    }
  };

  const handleScanClick = (scan: any) => {
    setSelectedScan(selectedScan?.id === scan.id ? null : scan);
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

          <div className="farm-section">
            <FarmScansCard 
              scans={scans} 
              onScanClick={handleScanClick} 
            />
            
            {selectedScan && (
              <div className="scan-details-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>{selectedScan.type === 'plant' ? 'Plant Scan Details' : 'Soil Analysis Details'}</h3>
                    <button className="close-button" onClick={() => setSelectedScan(null)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="scan-details-grid">
                      {Object.entries(selectedScan.details).map(([key, value]) => (
                        <div key={key} className="detail-item">
                          <span className="detail-label">{key}:</span>
                          <span className="detail-value">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmProfile;
