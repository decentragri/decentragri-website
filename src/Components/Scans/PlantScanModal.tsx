import React from 'react';
import { PlantScanResult } from '../../types/scan.types';

interface PlantScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: Omit<PlantScanResult, 'id' | 'createdAt'>) => void;
  farmName: string;
}

export const PlantScanModal: React.FC<PlantScanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  farmName,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would include the actual scan data
    onSubmit({
      cropType: 'Tomato', // Example data
      note: 'Sample plant scan',
      lat: 0,
      lng: 0,
      imageUrl: null,
      interpretation: {
        Diagnosis: 'Healthy',
        Reason: 'No issues detected',
        Recommendations: ['Continue current care routine']
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Plant Scan - {farmName}</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields for plant scan */}
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Submit Scan</button>
          </div>
        </form>
      </div>
    </div>
  );
};
