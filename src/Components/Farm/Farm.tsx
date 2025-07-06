import { useState, useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { useThemeStore } from '@context/ThemeContext';
import { getFarmList, createFarm } from '@client/farmer/clientFarmer';
import { AddFarmModal } from './AddFarmModal';
import { FarmData } from '../../../server/src/farmer.services/farmer.interface';
import './Farm.css';

interface FarmList {
  farmName: string;
  id: string;
  cropType: string;
  location?: {
    displayName?: string;
    lat?: number;
    lng?: number;
  };
  status?: string;
}

const Farm = () => {
  // Sample data for demonstration
  const sampleFarms: FarmList[] = [
    {
      id: 'farm-123',
      farmName: 'Sunny Valley Farm',
      cropType: 'Corn',
      location: {
        displayName: 'Central Valley, CA',
        lat: 36.7378,
        lng: -119.7871
      },
      status: 'Active'
    },
    {
      id: 'farm-124',
      farmName: 'Green Pastures',
      cropType: 'Wheat',
      location: {
        displayName: 'Kansas Plains, KS',
        lat: 38.4937,
        lng: -98.3804
      },
      status: 'Active'
    },
    {
      id: 'farm-125',
      farmName: 'Mountain View Orchard',
      cropType: 'Apples',
      location: {
        displayName: 'Wenatchee, WA',
        lat: 47.4235,
        lng: -120.3103
      },
      status: 'Active'
    }
  ];

  const [farms, setFarms] = useState<FarmList[]>(sampleFarms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isDarkMode } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const result = await getFarmList();
        
        // Check if result is an Error instance
        if (result instanceof Error) {
          throw result;
        }
        
        // Check if we have valid farm data
        if (Array.isArray(result) && result.length > 0) {
          setFarms(result);
          setError(null);
        } else {
          // Fall back to sample data if API returns empty or invalid data
          setFarms(sampleFarms);
          setError('No farms found. Showing sample data.');
        }
      } catch (err) {
        console.error('Error fetching farms:', err);
        // Use sample data if API fails
        setFarms(sampleFarms);
        setError('Using sample data. Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [sampleFarms]); // Add sampleFarms to dependency array

  if (loading) {
    return (
      <div className={`farm-container ${isDarkMode ? 'dark' : ''}`}>
        <div className="farm-loading">
          <div className="farm-spinner"></div>
          <p>Loading farms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`farm-error ${isDarkMode ? 'dark' : ''}`}>
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  const handleAddFarm = async (farmData: FarmData) => {
    setIsSubmitting(true);
    try {
      const result = await createFarm(farmData);
      if (result instanceof Error) {
        throw result;
      }
      // Refresh the farm list
      const updatedFarms = await getFarmList();
      if (!(updatedFarms instanceof Error)) {
        setFarms(updatedFarms);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating farm:', err);
      setError('Failed to create farm. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchFarmsList = async () => {
    try {
      const result = await getFarmList();
      if (result instanceof Error) {
        throw result;
      }
      setFarms(result);
    } catch (err) {
      console.error('Error fetching farms:', err);
      setError('Failed to load farms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmsList();
  }, []);

  return (
    <div className={`farm-container ${isDarkMode ? 'dark' : ''}`}>
      <div className="farm-header">
        <h1>My Farms</h1>
        <button 
          className="add-farm-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fas fa-plus"></i> Add Farm
        </button>
      </div>
      
      <AddFarmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddFarm}
        loading={isSubmitting}
      />

      {farms.length === 0 ? (
        <div className="farm-empty-state">
          <i className="fas fa-tractor"></i>
          <h3>No Farms Yet</h3>
          <p>You haven't added any farms yet. Get started by adding your first farm.</p>
          <button className="primary-btn">
            <i className="fas fa-plus"></i> Add Your First Farm
          </button>
        </div>
      ) : (
        <div className="farm-grid">
          {farms.map((farm) => (
            <div 
              key={farm.id} 
              className="farm-card"
              onClick={() => location.route(`/dashboard/farm/${farm.id}`)}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && location.route(`/dashboard/farm/${farm.id}`)}
              aria-label={`View details for ${farm.farmName}`}
            >
              <div className="farm-card-header">
                <i className="fas fa-tractor"></i>
                <h3>{farm.farmName}</h3>
              </div>
              <div className="farm-card-body">
                <div className="farm-detail">
                  <span className="detail-label">Crop Type</span>
                  <span className="detail-value">
                    {farm.cropType ? (
                      <span className="crop-type-badge">{farm.cropType}</span>
                    ) : (
                      'Not specified'
                    )}
                  </span>
                </div>
                <div className="farm-detail">
                  <span className="detail-label">Farm ID</span>
                  <span className="detail-value" title={farm.id}>
                    {farm.id.substring(0, 8)}...
                  </span>
                </div>
                {farm.location?.displayName && (
                  <div className="farm-detail">
                    <span className="detail-label">Location</span>
                    <span className="detail-value location">
                      <i className="fas fa-map-marker-alt"></i>
                      {farm.location.displayName}
                    </span>
                  </div>
                )}
              </div>
              <div className="farm-card-footer">
                <span className="view-details-link">
                  View Details <i className="fas fa-arrow-right"></i>
                </span>
                <span className="status-badge">
                  <i className="fas fa-circle"></i> Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Farm;
