import { useEffect, useState } from 'preact/hooks';
import './FarmDashboard.css';
import { FarmList, FarmScanResult, PlantScanResult, SensorReadingsWithInterpretation, ParsedInterpretation } from '../../types/farm.types';
import { getFarmScans } from '../../services/farmScanService';
import { getFarmByName } from '../../services/farmService';
import { getFarmImageSrc } from '../../utils/imageUtils';
import { useThemeStore } from '../../context/ThemeContext';

interface FarmDashboardProps {
  farm?: FarmList;
}

const FarmDashboard = ({ farm: propFarm }: FarmDashboardProps) => {
  const { isDarkMode } = useThemeStore();
  
  // Get farm name from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const farmName = urlParams.get('farmName');
  
  const [farm, setFarm] = useState<FarmList | null>(propFarm || null);
  const [scanData, setScanData] = useState<FarmScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [scansLoading, setScansLoading] = useState(true);
  const [sensorsLoading, setSensorsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'scans' | 'sensors'>('overview');
  const [selectedScan, setSelectedScan] = useState<PlantScanResult | null>(null);
  console.log(farm)

  // Helper function to safely access nested properties
  const safeGet = (obj: any, path: string, defaultValue = 'N/A') => {
    try {
      return path.split('.').reduce((o, k) => o?.[k], obj) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Helper function to parse interpretation data
  const parseInterpretation = (interpretation: ParsedInterpretation | string | null): ParsedInterpretation | null => {
    if (!interpretation) return null;
    
    // If it's already an object, return it
    if (typeof interpretation === 'object' && interpretation !== null) {
      return interpretation;
    }
    
    // If it's a string, try to parse as JSON
    if (typeof interpretation === 'string') {
      try {
        return JSON.parse(interpretation);
      } catch {
        return null;
      }
    }
    
    return null;
  };
  const navigateToFarms = () => {
    window.location.href = '/farms';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setScansLoading(true);
        setSensorsLoading(true);
        setError(null);
        
        // If we don't have farm data but have farmName, fetch it
        if (!farm && farmName) {
          console.log('Fetching farm data for:', farmName);
          const fetchedFarm = await getFarmByName(farmName);
          if (fetchedFarm) {
            setFarm(fetchedFarm);
            // Fetch scan data for this farm
            try {
              const data = await getFarmScans(fetchedFarm.farmName);
              setScanData(data);
              setScansLoading(false);
              setSensorsLoading(false);
              console.log('Successfully loaded farm scan data:', data);
            } catch (scanError) {
              console.error('Failed to load scan data:', scanError);
              setError(`Failed to load farm scan data: ${scanError instanceof Error ? scanError.message : 'Unknown error'}`);
              // Set empty scan data to show empty states
              setScanData({
                plantScans: [],
                soilReadings: [],
                pagination: {
                  page: 1,
                  limit: 10,
                  total: 0,
                  totalPages: 0,
                  hasNext: false,
                  hasPrevious: false
                }
              });
              setScansLoading(false);
              setSensorsLoading(false);
            }
          } else {
            setError('Farm not found');
            setScansLoading(false);
            setSensorsLoading(false);
          }
        } else if (farm) {
          // We already have farm data, just fetch scan data
          try {
            const data = await getFarmScans(farm.farmName);
            setScanData(data);
            setScansLoading(false);
            setSensorsLoading(false);
            console.log('Successfully loaded farm scan data:', data);
          } catch (scanError) {
            console.error('Failed to load scan data:', scanError);
            setError(`Failed to load farm scan data: ${scanError instanceof Error ? scanError.message : 'Unknown error'}`);
            // Set empty scan data to show empty states
            setScanData({
              plantScans: [],
              soilReadings: [],
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNext: false,
                hasPrevious: false
              }
            });
            setScansLoading(false);
            setSensorsLoading(false);
          }
        } else {
          // No farm data and no farm name, redirect
          navigateToFarms();
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setScansLoading(false);
        setSensorsLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farm, farmName]);

  if (error) {
    return (
      <div className={`farm-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="dashboard-container">
          <div className="error-state">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Unable to Load Farm Data</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={() => window.location.reload()} className="retry-button">
                <i className="fas fa-redo"></i>
                Retry
              </button>
              <button onClick={navigateToFarms} className="back-button">
                <i className="fas fa-arrow-left"></i>
                Back to Farms
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!farm) {
    return null;
  }

  const imageData = getFarmImageSrc(farm.imageBytes, farm.image);

  const renderOverview = () => (
    <div className="farm-overview">
      {/* Farm Header Section */}
      <div className="farm-header-section">
        <div className="farm-header-content">
          <div className="farm-title-section">
            <h1 className="farm-title">{farm.farmName}</h1>
            <div className="farm-status-badge">
              <i className="fas fa-check-circle"></i>
              <span>Active Farm</span>
            </div>
          </div>
          <p className="farm-description">{farm.description || "Professional agricultural operation focused on sustainable farming practices and optimal crop production."}</p>
        </div>
        <div className="farm-image-container">
          <img
            src={imageData.src}
            alt={farm.farmName}
            className={`farm-overview-image ${imageData.isLogo ? 'farm-image-logo' : ''}`}
          />
        </div>
      </div>

      {/* Farm Details Grid */}
      <div className="farm-details-grid">
        <div className="farm-detail-card">
          <div className="detail-icon">
            <i className="fas fa-seedling"></i>
          </div>
          <div className="detail-content">
            <h3>Primary Crop</h3>
            <p>{farm.cropType}</p>
          </div>
        </div>
        
        <div className="farm-detail-card">
          <div className="detail-icon">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="detail-content">
            <h3>Location</h3>
            <p>{farm.location}</p>
          </div>
        </div>
        
        <div className="farm-detail-card">
          <div className="detail-icon">
            <i className="fas fa-user-tie"></i>
          </div>
          <div className="detail-content">
            <h3>Farm Owner</h3>
            <p>{farm.owner}</p>
          </div>
        </div>
        
        <div className="farm-detail-card">
          <div className="detail-icon">
            <i className="fas fa-globe-americas"></i>
          </div>
          <div className="detail-content">
            <h3>Coordinates</h3>
            <p>{farm.coordinates.lat.toFixed(4)}, {farm.coordinates.lng.toFixed(4)}</p>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="farm-stats-section">
        <h2 className="section-title">Farm Analytics Overview</h2>
        <div className="farm-stats-grid">
          <div 
            className={`stat-card secondary ${sensorsLoading ? 'loading' : 'clickable'}`} 
            onClick={() => !sensorsLoading && setActiveTab('sensors')}
            style={{ cursor: sensorsLoading ? 'not-allowed' : 'pointer' }}
          >
            <div className="stat-icon">
              {sensorsLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-thermometer-half"></i>
              )}
            </div>
            <div className="stat-content">
              <h3>Soil Readings</h3>
              <span className="stat-number">{scanData?.soilReadings.length || 0}</span>
              <span className="stat-label">Sensor Reports</span>
            </div>
          </div>
          
          <div 
            className={`stat-card primary ${scansLoading ? 'loading' : 'clickable'}`} 
            onClick={() => !scansLoading && setActiveTab('scans')}
            style={{ cursor: scansLoading ? 'not-allowed' : 'pointer' }}
          >
            <div className="stat-icon">
              {scansLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-microscope"></i>
              )}
            </div>
            <div className="stat-content">
              <h3>Plant Scans</h3>
              <span className="stat-number">{scanData?.plantScans.length || 0}</span>
              <span className="stat-label">Total Analyses</span>
            </div>
          </div>
          
          <div className="stat-card accent">
            <div className="stat-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="stat-content">
              <h3>Last Updated</h3>
              <span className="stat-text">{farm.formattedUpdatedAt}</span>
              <span className="stat-label">Farm Data</span>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-content">
              <h3>Farm Status</h3>
              <span className="stat-text">Operational</span>
              <span className="stat-label">Current State</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlantScans = () => (
    <div className="plant-scans-section">
      <div className="section-header">
        <button 
          className="back-button"
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
        <h2 className="section-title">Plant Health Analysis</h2>
        <p className="section-subtitle">AI-powered crop monitoring and health assessments</p>
      </div>
      
      {loading ? (
        <div className="loading-state">
          <p>Loading plant analysis data...</p>
        </div>
      ) : scanData?.plantScans.length ? (
        <div className="scans-grid">
          {scanData.plantScans.map((scan: PlantScanResult, index: number) => {
            // Format date properly, handling zero-value dates
            const formatScanDate = (dateStr: string) => {
              if (!dateStr || dateStr.includes('0001-01-01') || dateStr.includes('January 1, 0001')) {
                return 'Recent scan';
              }
              return dateStr;
            };

            const displayDate = formatScanDate(scan.formattedCreatedAt);
            
            // Debug logging for image data
            console.log('Scan image debug:', {
              id: scan.id,
              imageUri: scan.imageUri,
              imageBytes: scan.imageBytes ? `Array with ${scan.imageBytes.length} bytes` : 'none',
              imageBytesLength: scan.imageBytes?.length || 0,
              hasImageUri: !!(scan.imageUri && scan.imageUri !== ''),
              hasImageBytes: !!(scan.imageBytes && scan.imageBytes.length > 0)
            });

            // Helper function to convert byte array to base64
            const convertBytesToBase64 = (bytes: number[]): string => {
              try {
                if (!bytes || bytes.length === 0) {
                  console.warn('Empty or invalid byte array');
                  return '';
                }
                
                console.log('Converting byte array to base64:', {
                  length: bytes.length,
                  firstBytes: bytes.slice(0, 10),
                  isPNG: bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71
                });

                // Convert numbers to Uint8Array
                const uint8Array = new Uint8Array(bytes);
                
                // Convert to binary string in chunks to avoid stack overflow
                let binaryString = '';
                const chunkSize = 8192; // Process in smaller chunks
                
                for (let i = 0; i < uint8Array.length; i += chunkSize) {
                  const chunk = uint8Array.slice(i, i + chunkSize);
                  const chunkString = Array.from(chunk, byte => String.fromCharCode(byte)).join('');
                  binaryString += chunkString;
                }
                
                const base64 = btoa(binaryString);
                console.log('Base64 conversion successful:', {
                  originalLength: bytes.length,
                  base64Length: base64.length,
                  base64Preview: base64.substring(0, 50) + '...'
                });
                
                return base64;
              } catch (error) {
                console.error('Error converting bytes to base64:', error);
                return '';
              }
            };
            
            return (
            <div key={scan.id || index} className="scan-card">
                <div className="scan-header">
                <div className="scan-title-section">
                  <h3 className="scan-title">
                    <i className="fas fa-seedling"></i>
                    {scan.cropType.charAt(0).toUpperCase() + scan.cropType.slice(1)} Analysis
                  </h3>
                  {/* Show diagnosis if available */}
                  {(() => {
                    const parsedInterpretation = parseInterpretation(scan.interpretation);
                    return parsedInterpretation && parsedInterpretation.diagnosis && (
                      <div className="scan-diagnosis">
                        <span className="diagnosis-label">Diagnosis:</span>
                        <span className="diagnosis-value">{parsedInterpretation.diagnosis}</span>
                      </div>
                    );
                  })()}
                </div>
                <div className="scan-status">
                  <span className="status-badge analyzed">
                    <i className="fas fa-microscope"></i>
                    Analyzed
                  </span>
                </div>
              </div>              <div className="scan-content">
                <div className="scan-main">
                  {/* Plant Image */}
                  <div className="scan-image-section">
                    {(scan.imageUri && scan.imageUri !== '') || (scan.imageBytes && scan.imageBytes.length > 0) ? (
                      <div className="scan-image-container">
                        <img 
                          src={
                            // Try imageBytes first since IPFS might not be accessible
                            scan.imageBytes && scan.imageBytes.length > 0
                              ? `data:image/png;base64,${convertBytesToBase64(scan.imageBytes)}`
                              : scan.imageUri || ''
                          }
                          alt={`${scan.cropType} plant scan`}
                          className="scan-image"
                          onError={(e) => {
                            console.error('Image failed to load:', {
                              imageUri: scan.imageUri,
                              imageBytes: scan.imageBytes ? `Array with ${scan.imageBytes.length} bytes` : 'none',
                              imageBytesLength: scan.imageBytes?.length || 0,
                              src: (e.target as HTMLImageElement).src
                            });
                            
                            // Try fallback to IPFS if base64 failed
                            const target = e.target as HTMLImageElement;
                            if (target.src.startsWith('data:') && scan.imageUri) {
                              console.log('Trying IPFS fallback...');
                              target.src = scan.imageUri;
                              return;
                            }
                            
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) {
                              placeholder.classList.remove('hidden');
                              placeholder.style.display = 'flex';
                            }
                          }}
                          onLoad={(e) => {
                            console.log('Image loaded successfully:', {
                              imageUri: scan.imageUri,
                              imageBytesLength: scan.imageBytes?.length || 0,
                              src: (e.target as HTMLImageElement).src.substring(0, 50) + '...'
                            });
                          }}
                        />
                        <div className="scan-image-placeholder hidden" style={{ display: 'none' }}>
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>Failed to load image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="scan-image-placeholder">
                        <i className="fas fa-camera-slash"></i>
                        <span>No image captured</span>
                        <small style={{ fontSize: '12px', color: '#666' }}>
                          Debug: URI={scan.imageUri || 'none'}, Bytes={scan.imageBytes?.length || 0}
                        </small>
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Info */}
                  <div className="scan-quick-info">
                    <div className="info-grid">
                      <div className="info-item">
                        <i className="fas fa-leaf"></i>
                        <div>
                          <span className="info-label">Crop Type</span>
                          <span className="info-value">{scan.cropType.charAt(0).toUpperCase() + scan.cropType.slice(1)}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-clock"></i>
                        <div>
                          <span className="info-label">Scanned</span>
                          <span className="info-value">{displayDate}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-fingerprint"></i>
                        <div>
                          <span className="info-label">ID</span>
                          <span className="info-value">{scan.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="scan-actions">
                  <button 
                    className="ai-analysis-button" 
                    onClick={() => setSelectedScan(scan)}
                  >
                    <i className="fas fa-brain"></i>
                    View AI Analysis
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div className="no-data-state">
          <div className="no-data-icon">
            <i className="fas fa-microscope"></i>
          </div>
          <h3>No Plant Scans Available</h3>
          <p>No plant health analyses have been conducted for this farm yet.</p>
        </div>
      )}
    </div>
  );

  const renderSensorReadings = () => (
    <div className="sensor-readings-section">
      <div className="section-header">
        <button 
          className="back-button"
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
        <h2 className="section-title">Soil Sensor Analytics</h2>
        <p className="section-subtitle">Real-time environmental monitoring and soil health metrics</p>
      </div>
      
      {loading ? (
        <div className="loading-state">
          <p>Loading sensor data...</p>
        </div>
      ) : scanData?.soilReadings.length ? (
        <div className="readings-grid">
          {scanData.soilReadings.map((reading: SensorReadingsWithInterpretation, index: number) => (
            <div key={reading.id || index} className="reading-card">
              <div className="reading-header">
                <div className="reading-info">
                  <h3 className="reading-title">Sensor Report #{index + 1}</h3>
                  <div className="reading-meta">
                    <span className="reading-date">
                      <i className="fas fa-clock"></i>
                      {reading.formattedCreatedAt}
                    </span>
                    <span className="sensor-id">
                      <i className="fas fa-microchip"></i>
                      {reading.sensorId}
                    </span>
                  </div>
                </div>
                <div className="reading-status">
                  <span className={`status-badge ${reading.interpretation.evaluation.toLowerCase()}`}>
                    <i className="fas fa-chart-bar"></i>
                    {reading.interpretation.evaluation}
                  </span>
                </div>
              </div>
              
              <div className="reading-content">
                {/* Key Metrics Grid */}
                <div className="metrics-section">
                  <h4>Environmental Metrics</h4>
                  <div className="reading-metrics">
                    <div className="metric-item">
                      <div className="metric-icon fertility">
                        <i className="fas fa-leaf"></i>
                      </div>
                      <div className="metric-data">
                        <span className="metric-label">Soil Fertility</span>
                        <span className="metric-value">{reading.fertility.toFixed(1)} µS/cm</span>
                        <span className="metric-status">{reading.interpretation.fertility}</span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-icon moisture">
                        <i className="fas fa-tint"></i>
                      </div>
                      <div className="metric-data">
                        <span className="metric-label">Moisture Level</span>
                        <span className="metric-value">{reading.moisture.toFixed(1)}%</span>
                        <span className="metric-status">{reading.interpretation.moisture}</span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-icon ph">
                        <i className="fas fa-vial"></i>
                      </div>
                      <div className="metric-data">
                        <span className="metric-label">pH Level</span>
                        <span className="metric-value">{reading.ph.toFixed(2)}</span>
                        <span className="metric-status">{reading.interpretation.ph}</span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-icon temperature">
                        <i className="fas fa-thermometer-half"></i>
                      </div>
                      <div className="metric-data">
                        <span className="metric-label">Temperature</span>
                        <span className="metric-value">{reading.temperature.toFixed(1)}°C</span>
                        <span className="metric-status">{reading.interpretation.temperature}</span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-icon sunlight">
                        <i className="fas fa-sun"></i>
                      </div>
                      <div className="metric-data">
                        <span className="metric-label">Sunlight</span>
                        <span className="metric-value">{reading.sunlight.toFixed(1)} lux</span>
                        <span className="metric-status">{reading.interpretation.sunlight}</span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-icon humidity">
                        <i className="fas fa-cloud"></i>
                      </div>
                      <div className="metric-data">
                        <span className="metric-label">Humidity</span>
                        <span className="metric-value">{reading.humidity.toFixed(1)}%</span>
                        <span className="metric-status">{reading.interpretation.humidity}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Overall Assessment */}
                <div className="assessment-section">
                  <h4>Overall Assessment</h4>
                  <div className="assessment-content">
                    <div className="assessment-item">
                      <span className="assessment-label">General Evaluation:</span>
                      <span className={`assessment-value ${reading.interpretation.evaluation.toLowerCase()}`}>
                        {reading.interpretation.evaluation}
                      </span>
                    </div>
                    <div className="submitted-info">
                      <i className="fas fa-upload"></i>
                      <span>Data submitted: {reading.formattedSubmittedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-state">
          <div className="no-data-icon">
            <i className="fas fa-thermometer-half"></i>
          </div>
          <h3>No Sensor Data Available</h3>
          <p>No soil sensor readings have been recorded for this farm yet.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className={`farm-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="dashboard-header">
        <button 
          className="back-button"
          onClick={navigateToFarms}
        >
          <i className="fas fa-arrow-left"></i>
          Back to Farms
        </button>
        
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-pie"></i>
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'scans' ? 'active' : ''} ${scansLoading ? 'loading' : ''}`}
            onClick={() => !scansLoading && setActiveTab('scans')}
            disabled={scansLoading}
          >
            {scansLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-microscope"></i>
            )}
            Plant Analysis
          </button>
          <button 
            className={`tab ${activeTab === 'sensors' ? 'active' : ''} ${sensorsLoading ? 'loading' : ''}`}
            onClick={() => !sensorsLoading && setActiveTab('sensors')}
            disabled={sensorsLoading}
          >
            {sensorsLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-thermometer-half"></i>
            )}
            Sensor Data
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        )}
        
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'scans' && renderPlantScans()}
        {activeTab === 'sensors' && renderSensorReadings()}
        
        {/* AI Analysis Modal */}
        {selectedScan && (
          <div className="ai-analysis-modal-overlay" onClick={() => setSelectedScan(null)}>
            <div className="ai-analysis-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <i className="fas fa-brain"></i>
                  AI Analysis Results
                </h3>
                <button 
                  className="modal-close-button" 
                  onClick={() => setSelectedScan(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-content">
                <div className="scan-info-header">
                  <h4>{selectedScan.cropType.charAt(0).toUpperCase() + selectedScan.cropType.slice(1)} Analysis</h4>
                  <span className="scan-id">ID: {selectedScan.id}</span>
                </div>
                
                {selectedScan.interpretation ? (
                  <div className="analysis-results">
                    {(() => {
                      const parsedInterpretation = parseInterpretation(selectedScan.interpretation);
                      return parsedInterpretation ? (
                        <>
                          {parsedInterpretation.diagnosis && (
                            <div className="analysis-section">
                              <h5><i className="fas fa-stethoscope"></i> Diagnosis</h5>
                              <p className="diagnosis-value">{parsedInterpretation.diagnosis}</p>
                            </div>
                          )}
                          
                          {parsedInterpretation.reason && (
                            <div className="analysis-section">
                              <h5><i className="fas fa-search"></i> Detailed Analysis</h5>
                              <p className="analysis-text">{parsedInterpretation.reason}</p>
                            </div>
                          )}
                          
                          {parsedInterpretation.recommendations && parsedInterpretation.recommendations.length > 0 && (
                            <div className="analysis-section">
                              <h5><i className="fas fa-lightbulb"></i> Recommendations</h5>
                              <ul className="recommendations-list">
                                {parsedInterpretation.recommendations.map((rec: string, idx: number) => (
                                  <li key={idx} className="recommendation-item">
                                    <i className="fas fa-arrow-right"></i>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="analysis-section">
                          <h5><i className="fas fa-info-circle"></i> Analysis Status</h5>
                          <p>Analysis in progress or unavailable</p>
                          {typeof selectedScan.interpretation === 'string' && selectedScan.interpretation && (
                            <div className="raw-data">
                              <h6>Raw Data:</h6>
                              <p>{selectedScan.interpretation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="analysis-results">
                    <div className="analysis-section">
                      <h5><i className="fas fa-info-circle"></i> Analysis Status</h5>
                      <p>No analysis available for this scan.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDashboard;
