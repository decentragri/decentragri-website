import { h } from 'preact';
import { PlantScanResult } from '../../types/scan.types';
import './Scans.css';

type Props = {
  scan: PlantScanResult;
  onClick: () => void;
};

export const PlantScanEntry = ({ scan, onClick }: Props) => {
  const interpretation = typeof scan.interpretation === 'string' 
    ? JSON.parse(scan.interpretation)
    : scan.interpretation;

  const date = new Date(scan.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="scan-entry-compact" onClick={onClick}>
      <div className="scan-icon">
        <i className="fas fa-leaf"></i>
      </div>
      <div className="scan-info">
        <div className="scan-meta">
          <span className="scan-date">{date}</span>
          <span className="scan-id">#{scan.id?.substring(0, 6) || 'N/A'}</span>
        </div>
        <div className="scan-diagnosis">
          <span className={`status-badge ${
            interpretation.Diagnosis.toLowerCase().includes('healthy') ? 'success' : 'warning'
          }`}>
            {interpretation.Diagnosis}
          </span>
        </div>
        <div className="scan-crop">
          <i className="fas fa-seedling"></i>
          <span>{scan.cropType || 'Unknown Crop'}</span>
        </div>
      </div>
      <div className="scan-arrow">
        <i className="fas fa-chevron-right"></i>
      </div>
    </div>
  );
};
