import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { useThemeStore } from '@context/ThemeContext';
import { FarmData } from '../../../server/src/farmer.services/farmer.interface';
import './SoilScanModal.css';

interface SoilScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: FarmData;
  username: string;
  sensorId: string;
  onSubmit: (data: {
    fertility: number;
    moisture: number;
    ph: number;
    temperature: number;
    sunlight: number;
    humidity: number;
    farmName: string;
    cropType?: string;
    username: string;
    sensorId: string;
    id: string;
  }) => void;
}

export const SoilScanModal = ({ 
  isOpen, 
  onClose, 
  farm, 
  username, 
  sensorId, 
  onSubmit 
}: SoilScanModalProps) => {
  const { isDarkMode } = useThemeStore();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fertility: 0,
    moisture: 0,
    ph: 7.0,
    temperature: 0,
    sunlight: 0,
    humidity: 0,
    notes: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate a simple ID (in a real app, this would come from your backend)
      const scanId = `scan-${Date.now()}`;
      
      await onSubmit({
        ...formData,
        farmName: farm.farmName,
        cropType: farm.cropType,
        username,
        sensorId,
        id: scanId
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting soil scan:', error);
      // Handle error (show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`soil-scan-modal-overlay ${isDarkMode ? 'dark' : ''}`}>
      <div className="soil-scan-modal">
        <div className="modal-header">
          <h2>Soil Analysis</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="scan-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="moisture">Moisture Level (%)</label>
              <input
                id="moisture"
                name="moisture"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.moisture}
                onInput={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ph">pH Level</label>
              <input
                id="ph"
                name="ph"
                type="number"
                min="0"
                max="14"
                step="0.1"
                value={formData.ph}
                onInput={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="temperature">Temperature (°C)</label>
              <input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                value={formData.temperature}
                onInput={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fertility">Fertility Index</label>
              <input
                id="fertility"
                name="fertility"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.fertility}
                onInput={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sunlight">Sunlight Exposure (lux)</label>
              <input
                id="sunlight"
                name="sunlight"
                type="number"
                min="0"
                step="100"
                value={formData.sunlight}
                onInput={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="humidity">Humidity (%)</label>
              <input
                id="humidity"
                name="humidity"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.humidity}
                onInput={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onInput={handleInputChange}
              disabled={isSubmitting}
              rows={3}
            />
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Submitting...
                </>
              ) : (
                'Submit Analysis'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoilScanModal;
