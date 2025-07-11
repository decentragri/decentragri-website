import React from 'react';
import { SensorReadingsWithInterpretation } from '../../types/scan.types';

interface SoilScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: Omit<SensorReadingsWithInterpretation, 'id' | 'createdAt'>) => void;
  farmName: string;
}

export const SoilScanModal: React.FC<SoilScanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  farmName,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would include the actual sensor data
    onSubmit({
      moisture: 65,
      ph: 6.5,
      fertility: 75,
      temperature: 28,
      sunlight: 85,
      humidity: 60,
      farmName,
      cropType: 'Unknown',
      username: 'user123',
      interpretation: {
        summary: 'Ideal soil conditions',
        recommendations: [
          'Maintain current moisture levels',
          'Monitor pH monthly'
        ]
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Soil Analysis - {farmName}</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields for soil analysis */}
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Submit Analysis</button>
          </div>
        </form>
      </div>
    </div>
  );
};
