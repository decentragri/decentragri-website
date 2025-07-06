import { useState, useRef, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { useThemeStore } from '@context/ThemeContext';
import { FarmData } from '../../../server/src/farmer.services/farmer.interface';
import './PlantScanModal.css';

interface PlantScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: FarmData;
  onSubmit: (data: {
    imageBytes: string;
    cropType: string;
    farmName: string;
    location?: { lat: number; lng: number };
    note?: string;
  }) => void;
}

export const PlantScanModal = ({ isOpen, onClose, farm, onSubmit }: PlantScanModalProps) => {
  const { isDarkMode } = useThemeStore();
  const [cropType, setCropType] = useState(farm.cropType || '');
  const [note, setNote] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setCropType(farm.cropType || '');
      setNote('');
      setImagePreview(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.[0]) {
      alert('Please select an image to scan');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const file = fileInputRef.current.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);
      const imageBytes = JSON.stringify(Array.from(byteArray));
      
      onSubmit({
        imageBytes,
        cropType,
        farmName: farm.farmName,
        location: farm.location?.lat && farm.location?.lng 
          ? { lat: farm.location.lat, lng: farm.location.lng } 
          : undefined,
        note: note || undefined,
      });
      
      onClose();
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`plant-scan-modal-overlay ${isDarkMode ? 'dark' : ''}`}>
      <div className="plant-scan-modal">
        <div className="modal-header">
          <h2>Plant Health Scan</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="scan-form">
          <div className="form-group">
            <label htmlFor="crop-type">Crop Type</label>
            <input
              id="crop-type"
              type="text"
              value={cropType}
              onChange={(e) => setCropType((e.target as HTMLInputElement).value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label>Plant Image</label>
            <div className="image-upload-container">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="image-upload-input"
                required
              />
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              ) : (
                <div className="upload-prompt">
                  <i className="fas fa-camera"></i>
                  <span>Tap to take a photo</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="note">Notes (Optional)</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote((e.target as HTMLTextAreaElement).value)}
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
                  <i className="fas fa-spinner fa-spin"></i> Scanning...
                </>
              ) : (
                'Scan Plant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlantScanModal;
