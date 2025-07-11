import { useState } from 'preact/hooks';
import { useThemeStore } from '@context/ThemeContext';
import './FarmScansCard.css';

interface Scan {
  id: string;
  type: 'plant' | 'soil';
  date: string;
  preview: {
    title: string;
    values: Record<string, any>;
  };
  details: Record<string, any>;
}

interface FarmScansCardProps {
  scans: Scan[];
  onScanClick: (scan: Scan) => void;
}

export const FarmScansCard = ({ scans, onScanClick }: FarmScansCardProps) => {
  const { isDarkMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'plant' | 'soil'>('plant');

  const filteredScans = scans.filter(scan => scan.type === activeTab);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderScanPreview = (scan: Scan) => {
    return (
      <div key={scan.id} className="scan-preview" onClick={() => onScanClick(scan)}>
        <div className="scan-preview-header">
          <h4>{scan.preview.title}</h4>
          <span className="scan-date">{formatDate(scan.date)}</span>
        </div>
        <div className="scan-preview-values">
          {Object.entries(scan.preview.values).map(([key, value]) => (
            <div key={key} className="scan-preview-value">
              <span className="value-label">{key}:</span>
              <span className="value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScanDetailsModal = (scan: Scan | null) => {
    if (!scan) return null;
    
    return (
      <div className="scan-details-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{scan.type === 'plant' ? 'Plant Scan Details' : 'Soil Analysis Details'}</h3>
            <button className="close-button" onClick={() => onScanClick(scan)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="scan-details-grid">
              {Object.entries(scan.details).map(([key, value]) => (
                <div key={key} className="detail-item">
                  <span className="detail-label">{key}:</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`farm-scans-card ${isDarkMode ? 'dark' : ''}`}>
      <div className="card-header">
        <h3>Farm Scans</h3>
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'plant' ? 'active' : ''}`}
            onClick={() => setActiveTab('plant')}
          >
            <i className="fas fa-leaf"></i> Plant Scans
          </button>
          <button 
            className={`tab-button ${activeTab === 'soil' ? 'active' : ''}`}
            onClick={() => setActiveTab('soil')}
          >
            <i className="fas fa-seedling"></i> Soil Analysis
          </button>
        </div>
      </div>
      
      <div className="scans-list">
        {filteredScans.length > 0 ? (
          filteredScans.map(scan => renderScanPreview(scan))
        ) : (
          <div className="no-scans">
            <i className="fas fa-search"></i>
            <p>No {activeTab === 'plant' ? 'plant scans' : 'soil analyses'} found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmScansCard;
