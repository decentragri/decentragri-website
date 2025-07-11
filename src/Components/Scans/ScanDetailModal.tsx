import { h } from 'preact';
import { PlantScanResult, SensorReadingsWithInterpretation } from '../../types/scan.types';
import './Scans.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  scan: PlantScanResult | SensorReadingsWithInterpretation | null;
  type: 'plant' | 'soil';
};

export const ScanDetailModal = ({ isOpen, onClose, scan, type }: Props) => {
  if (!isOpen || !scan) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-header">
          <h2>
            <i className={`fas ${type === 'plant' ? 'fa-leaf' : 'fa-seedling'}`}></i>
            {type === 'plant' ? 'Plant Scan Details' : 'Soil Analysis Details'}
          </h2>
          <div className="scan-date">
            {new Date(scan.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="modal-body">
          {type === 'plant' ? (
            <PlantScanDetails scan={scan as PlantScanResult} />
          ) : (
            <SoilScanDetails scan={scan as SensorReadingsWithInterpretation} />
          )}
        </div>
      </div>
    </div>
  );
};

const PlantScanDetails = ({ scan }: { scan: PlantScanResult }) => {
  const interpretation = typeof scan.interpretation === 'string' 
    ? JSON.parse(scan.interpretation) 
    : scan.interpretation;

  return (
    <div className="scan-details">
      <div className="detail-section">
        <h3>Scan Information</h3>
        <div className="detail-row">
          <span className="detail-label">Crop Type:</span>
          <span className="detail-value">{scan.cropType || 'N/A'}</span>
        </div>
        {scan.lat && scan.lng && (
          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">
              {scan.lat.toFixed(4)}, {scan.lng.toFixed(4)}
            </span>
          </div>
        )}
        {scan.note && (
          <div className="detail-row">
            <span className="detail-label">Note:</span>
            <span className="detail-value">{scan.note}</span>
          </div>
        )}
      </div>

      <div className="detail-section">
        <h3>Diagnosis</h3>
        <div className="diagnosis">
          <div className="diagnosis-severity">
            <span className="severity-label">Status:</span>
            <span className={`severity-badge ${interpretation.Diagnosis.toLowerCase().includes('healthy') ? 'healthy' : 'issue'}`}>
              {interpretation.Diagnosis}
            </span>
          </div>
          <div className="diagnosis-reason">
            <p>{interpretation.Reason}</p>
          </div>
        </div>
      </div>

      {interpretation.Recommendations?.length > 0 && (
        <div className="detail-section">
          <h3>Recommendations</h3>
          <ul className="recommendations-list">
            {interpretation.Recommendations.map((rec, i) => (
              <li key={i}>
                <i className="fas fa-check-circle"></i>
                <span>{rec as string}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SoilScanDetails = ({ scan }: { scan: SensorReadingsWithInterpretation }) => {
  const interpretation = scan.interpretation;
  
  return (
    <div className="scan-details">
      <div className="soil-metrics-grid">
        <div className="soil-metric">
          <div className="metric-label">Moisture</div>
          <div className="metric-value">{scan.moisture}%</div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill" 
              style={{ width: `${scan.moisture}%` }}
            ></div>
          </div>
        </div>

        <div className="soil-metric">
          <div className="metric-label">pH Level</div>
          <div className="metric-value">{scan.ph.toFixed(1)}</div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill" 
              style={{ 
                width: `${(scan.ph / 14) * 100}%`,
                backgroundColor: getPhColor(scan.ph)
              }}
            ></div>
          </div>
        </div>

        <div className="soil-metric">
          <div className="metric-label">Fertility</div>
          <div className="metric-value">{scan.fertility}%</div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill" 
              style={{ 
                width: `${scan.fertility}%`,
                backgroundColor: getFertilityColor(scan.fertility)
              }}
            ></div>
          </div>
        </div>

        <div className="soil-metric">
          <div className="metric-label">Temperature</div>
          <div className="metric-value">{scan.temperature}°C</div>
        </div>

        <div className="soil-metric">
          <div className="metric-label">Sunlight</div>
          <div className="metric-value">{scan.sunlight}%</div>
        </div>

        <div className="soil-metric">
          <div className="metric-label">Humidity</div>
          <div className="metric-value">{scan.humidity}%</div>
        </div>
      </div>

      {interpretation && (
        <div className="detail-section">
          <h3>Analysis Summary</h3>
          <div className="analysis-summary">
            <p>{interpretation.summary}</p>
            
            {interpretation.recommendations && (
              <div className="recommendations">
                <h4>Recommendations</h4>
                <ul>
                  {Array.isArray(interpretation.recommendations) ? (
                    interpretation.recommendations.map((rec, i) => (
                      <li key={i}>
                        <i className="fas fa-check-circle"></i>
                        <span>{rec as string}</span>
                      </li>
                    ))
                  ) : (
                    <li>
                      <i className="fas fa-check-circle"></i>
                      <span>{interpretation.recommendations}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for visualization
function getPhColor(ph: number): string {
  if (ph < 4) return '#9e0142';
  if (ph < 5) return '#d53e4f';
  if (ph < 6) return '#f46d43';
  if (ph < 7) return '#fdae61';
  if (ph < 8) return '#fee08b';
  if (ph < 9) return '#e6f598';
  if (ph < 10) return '#abdda4';
  return '#66c2a5';
}

function getFertilityColor(fertility: number): string {
  if (fertility < 25) return '#ff6b6b';
  if (fertility < 50) return '#ffd93d';
  return '#6bcb77';
}
