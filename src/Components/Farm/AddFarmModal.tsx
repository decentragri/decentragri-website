import { useState, useRef, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import { useThemeStore } from '@context/ThemeContext';
import { FarmData } from '../../../server/src/farmer.services/farmer.interface';
import './AddFarmModal.css';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (farmData: FarmData) => void;
  loading?: boolean;
}

export const AddFarmModal = ({ isOpen, onClose, onSubmit, loading = false }: AddFarmModalProps) => {
  const { isDarkMode } = useThemeStore();
  // Function to generate a unique ID
  const generateId = () => {
    return 'farm_' + Math.random().toString(36).substr(2, 9);
  };

  const [formData, setFormData] = useState<Omit<FarmData, 'image'>>({ 
    id: generateId(),
    farmName: '',
    cropType: '',
    description: '',
    location: { lat: 0, lng: 0 },
    status: 'active',
    establishedDate: new Date().toISOString()
  });
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');
  const [isRetrying, setIsRetrying] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationRetryTimeout = useRef<number>();

  // Function to get accuracy description
  const getAccuracyDescription = (accuracy: number | null) => {
    if (!accuracy) return 'Unknown accuracy';
    if (accuracy < 100) return 'High accuracy (GPS)';
    if (accuracy < 1000) return 'Medium accuracy (Wi-Fi)';
    return 'Low accuracy (IP-based)';
  };

  // Function to fetch location details (city, region, etc.) from coordinates
  const fetchLocationDetails = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Failed to fetch location details');
      
      const data = await response.json();
      const address = data.address;
      
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
          city: address.city || address.town || address.village || address.hamlet || '',
          region: address.state || address.region || '',
          displayName: data.display_name?.split(',').slice(0, 3).join(', ')
        }
      }));
      
    } catch (error) {
      console.error('Error fetching location details:', error);
      // Don't show error to user, just continue with coordinates only
    }
  };

  // Get user's current location when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    // Reset location status when modal opens
    setLocationStatus('idle');
    
    if ('geolocation' in navigator) {
      setLocationStatus('fetching');
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0 // Force fresh location
      };
      
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setAccuracy(accuracy);
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: parseFloat(latitude.toFixed(6)),
              lng: parseFloat(longitude.toFixed(6))
            }
          }));
          setLocationStatus('success');
          // Clear the watch after getting one good position
          navigator.geolocation.clearWatch(watchId);
          // Fetch location details
          fetchLocationDetails(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('error');
          // Clear any pending timeouts
          if (locationRetryTimeout.current) {
            clearTimeout(locationRetryTimeout.current);
          }
        },
        options
      );
      
      // Cleanup function to clear the watch when component unmounts or modal closes
      return () => {
        navigator.geolocation.clearWatch(watchId);
        if (locationRetryTimeout.current) {
          clearTimeout(locationRetryTimeout.current);
        }
      };
    } else {
      setLocationStatus('error');
    }
  }, [isOpen]);
  
  const handleGetLocation = () => {
    setLocationStatus('fetching');
    setIsRetrying(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setAccuracy(accuracy);
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: parseFloat(latitude.toFixed(6)),
              lng: parseFloat(longitude.toFixed(6))
            }
          }));
          setLocationStatus('success');
          setIsRetrying(false);
          // Fetch location details
          fetchLocationDetails(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('error');
          setIsRetrying(false);
          
          // Auto-retry after 3 seconds if there was an error
          if (locationRetryTimeout.current) {
            clearTimeout(locationRetryTimeout.current);
          }
          locationRetryTimeout.current = window.setTimeout(() => {
            handleGetLocation();
          }, 3000);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationStatus('error');
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location!,
          [name]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      id: generateId(),
      farmName: '',
      cropType: '',
      description: '',
      location: { lat: 0, lng: 0 },
      status: 'active',
      establishedDate: new Date().toISOString()
    });
    setPreviewImage(null);
    setLocationStatus('idle');
    setAccuracy(null);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const farmToSubmit = {
      ...formData,
      image: previewImage || undefined
    };
    onSubmit(farmToSubmit);
    resetForm();
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isDarkMode ? 'dark' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Farm</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="farmName">Farm Name *</label>
            <input
              type="text"
              id="farmName"
              name="farmName"
              value={formData.farmName}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cropType">Crop Type *</label>
            <input
              type="text"
              id="cropType"
              name="cropType"
              value={formData.cropType}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="e.g., Corn, Wheat, Soybeans"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
              className="form-input"
              placeholder="Tell us about your farm..."
            />
          </div>

          <div className="form-group">
            <div className="location-header">
              <label>Location</label>
              <button 
                type="button" 
                className={`location-btn ${locationStatus === 'fetching' ? 'fetching' : ''}`}
                onClick={handleGetLocation}
                disabled={locationStatus === 'fetching'}
              >
                {locationStatus === 'fetching' ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Locating...
                  </>
                ) : locationStatus === 'success' ? (
                  <>
                    <i className="fas fa-check-circle"></i> Location Found
                  </>
                ) : locationStatus === 'error' ? (
                  <>
                    <i className="fas fa-exclamation-circle"></i> Retry Location
                  </>
                ) : (
                  <>
                    <i className="fas fa-location-arrow"></i> Use My Location
                  </>
                )}
              </button>
            </div>
            <div className="location-inputs">
              <div className="location-input-group">
                <label className="location-label">Latitude</label>
                <input
                  type="number"
                  name="lat"
                  value={formData.location?.lat || ''}
                  onChange={handleInputChange}
                  placeholder="Latitude"
                  step="any"
                  className="form-input location-input"
                />
              </div>
              <div className="location-input-group">
                <label className="location-label">Longitude</label>
                <input
                  type="number"
                  name="lng"
                  value={formData.location?.lng || ''}
                  onChange={handleInputChange}
                  placeholder="Longitude"
                  step="any"
                  className="form-input location-input"
                />
              </div>
            </div>
            
            {(formData.location?.city || formData.location?.region) && (
              <div className="location-details">
                <div className="location-detail">
                  <div className="location-info">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <div className="location-text">
                        {formData.location.city || 'Unknown city'}{formData.location.region ? `, ${formData.location.region}` : ''}
                      </div>
                      {accuracy !== null && (
                        <div className="location-accuracy">
                          <i className="fas fa-info-circle"></i>
                          <span>{getAccuracyDescription(accuracy)}</span>
                          {accuracy > 1000 && (
                            <span className="accuracy-warning">
                              <i className="fas fa-exclamation-triangle"></i>
                              Location may be inaccurate on desktop
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {formData.location.displayName && (
                  <div className="location-full-address" title={formData.location.displayName}>
                    <i className="fas fa-info-circle"></i>
                    <span>{formData.location.displayName}</span>
                  </div>
                )}
              </div>
            )}
            {locationStatus === 'error' && (
              <div className="location-error">
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>Could not determine your location. Please check your browser permissions or enter manually.</span>
                </div>
                <button 
                  className="retry-btn"
                  onClick={handleGetLocation}
                  disabled={isRetrying}
                >
                  {isRetrying ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Trying again...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt"></i> Retry
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Farm Image</label>
            <div 
              className={`image-upload ${previewImage ? 'has-image' : ''}`} 
              onClick={() => fileInputRef.current?.click()}
            >
              {previewImage ? (
                <img src={previewImage} alt="Farm preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <i className="fas fa-camera"></i>
                  <span>Click to upload an image</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !formData.farmName || !formData.cropType}
            >
              {loading ? 'Adding...' : 'Add Farm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
