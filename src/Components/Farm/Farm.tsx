import { useState, useEffect } from 'preact/hooks';
import { useAuthStore } from '../../context/AuthContext';
import { useThemeStore } from '../../context/ThemeContext';
import { getFarmList } from '../../client/farmer/clientFarmer';
import '../../Components/Dashboard/UserDashboard.css';
import './Farm.css';

// Interface for the farm data from the API
interface FarmList {
  id: string;
  farmName: string;
  cropType: string;
}

// Extended interface with additional fields for our UI
interface Farm extends FarmList {
  // Optional fields for UI
  description?: string;
  createdAt?: string | Date;
  image?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

// Simple loading component
function LoadingSpinner() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{
        border: '4px solid rgba(0, 0, 0, 0.1)',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        borderLeftColor: '#09f',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }}></div>
      <p>Loading your farms...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Main Farm component
export default function Farm() {
  console.log('[Farm] Component rendering');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [farms, setFarms] = useState<Farm[]>([]);
  
  const { isLoggedIn, userInfo } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const accessToken = userInfo?.accessToken;
  
  // Fetch farm data
  useEffect(() => {
    console.log('[Farm] useEffect running, isLoggedIn:', isLoggedIn);
    
    if (!isLoggedIn) {
      console.log('[Farm] User not logged in or missing token');
      setError('Please log in to view your farms');
      setLoading(false);
      return;
    }

    const fetchFarms = async () => {
      try {


        console.log('[Farm] Fetching farm data...');
        const result = await getFarmList();
        
        if (result instanceof Error) {
          console.error('[Farm] Error fetching farms:', result);
          setError('Failed to load farms. Please try again later.');
          setLoading(false);
          return;
        }
        
        console.log('[Farm] Farm data received:', result);
        
        // Ensure we have a valid array of farms
        if (!Array.isArray(result)) {
          console.error('[Farm] Invalid farm data format:', result);
          setError('Invalid farm data received from server');
          setLoading(false);
          return;
        }
        
        // Map the API response to our extended Farm type
        const farmsData: Farm[] = result.map(farm => ({
          // Required fields from FarmList
          id: farm.id,
          farmName: farm.farmName,
          cropType: farm.cropType,
          // Initialize optional fields with default values
          description: 'No description available',
          // Use current date for creation
          createdAt: new Date().toISOString()
        }));
        
        setFarms(farmsData);
        setError(null);
      } catch (error) {
        console.error('[Farm] Unexpected error:', error);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
    
    return () => {
      console.log('[Farm] Cleaning up');
    };
  }, [isLoggedIn, accessToken]);

  if (loading) {
    return <div className="loading-text">Loading your farms...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }



  return (
    <div className="farm-page-container">
      <div className="dashboard-header">
        <h2 className="dashboard-greeting">My Farms</h2>
        <p className="dashboard-date">
          Manage your farms and monitor their status
        </p>
      </div>

      <div className="dashboard-cards">
        {farms.length === 0 ? (
          <div className="dashboard-card farm-status">
            <p>No farms found. Create your first farm to get started!</p>
            <button className="add-farm-btn">+ Add Farm</button>
          </div>
        ) : (
          farms.map((farm) => (
            <div key={farm.id} className="dashboard-card">
              <h3>{farm.farmName}</h3>
              <div className="farm-details">
                <p><strong>Crop Type:</strong> {farm.cropType || 'Not specified'}</p>
                {farm.description && (
                  <p className="farm-description">
                    {farm.description.length > 120 
                      ? `${farm.description.substring(0, 120)}...`
                      : farm.description}
                  </p>
                )}
              </div>
              <div className="farm-footer">
                <span>ID: {farm.id.substring(0, 6)}...</span>
                {farm.createdAt && (
                  <span>Created: {new Date(farm.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
