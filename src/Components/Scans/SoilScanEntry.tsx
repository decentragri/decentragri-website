import { h } from 'preact';
import { SensorReadingsWithInterpretation } from '../../types/scan.types';
import './Scans.css';

type Props = {
  reading: SensorReadingsWithInterpretation;
  onClick: () => void;
};

export const SoilScanEntry = ({ reading, onClick }: Props) => {
  const date = new Date(reading.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getSoilQuality = (ph: number, fertility: number) => {
    if (ph >= 6 && ph <= 7.5 && fertility > 60) return 'Optimal';
    if (ph < 5.5 || ph > 8 || fertility < 30) return 'Poor';
    return 'Moderate';
  };

  const soilQuality = getSoilQuality(reading.ph, reading.fertility);
  const qualityColor = {
    'Optimal': 'success',
    'Moderate': 'warning',
    'Poor': 'error'
  }[soilQuality];

  return (
    <div className="scan-entry-compact" onClick={onClick}>
      <div className="scan-icon">
        <i className="fas fa-seedling"></i>
      </div>
      <div className="scan-info">
        <div className="scan-meta">
          <span className="scan-date">{date}</span>
          <span className="scan-id">#{reading.id?.substring(0, 6) || 'N/A'}</span>
        </div>
        <div className="scan-diagnosis">
          <span className={`status-badge ${qualityColor}`}>
            {soilQuality} Soil Quality
          </span>
        </div>
        <div className="scan-metrics">
          <div className="metric-tag">
            <i className="fas fa-tint" style={{ color: '#3b82f6' }}></i>
            <span>{reading.moisture}%</span>
          </div>
          <div className="metric-tag">
            <i className="fas fa-flask" style={{ color: getPhColor(reading.ph) }}></i>
            <span>pH {reading.ph.toFixed(1)}</span>
          </div>
          <div className="metric-tag">
            <i className="fas fa-chart-line" style={{ color: getFertilityColor(reading.fertility) }}></i>
            <span>{reading.fertility}%</span>
          </div>
        </div>
      </div>
      <div className="scan-arrow">
        <i className="fas fa-chevron-right"></i>
      </div>
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
  if (fertility < 25) return '#ef4444';
  if (fertility < 50) return '#f59e0b';
  return '#10b981';
}
