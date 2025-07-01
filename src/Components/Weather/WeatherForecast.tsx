import { useState, useEffect } from 'preact/hooks';
import { getForecastWeather } from '../../client/weather/clientWeather';
import type { ForecastData } from '@server/weather.services/weather.interface';
import { useAuthStore } from '../../context/AuthContext';
import '../Weather/WeatherForecast.css';

const getWeatherIcon = (condition: string) => {
  condition = condition.toLowerCase();
  if (condition.includes('rain') || condition.includes('drizzle')) return 'cloud-rain';
  if (condition.includes('snow')) return 'snowflake';
  if (condition.includes('cloud')) return 'cloud-sun';
  if (condition.includes('thunder')) return 'bolt';
  if (condition.includes('fog') || condition.includes('mist')) return 'smog';
  return 'sun';
};

const WeatherForecast = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(() => {
    // Initialize with today's date in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Temporarily commented out for later use
  /*
  const weatherAlerts = [
    {
      type: 'warning',
      title: 'Heavy Rain Alert',
      message: 'Potential flooding in low-lying areas. Consider checking field drainage.',
      time: '2 hours ago'
    },
    {
      type: 'info',
      title: 'Optimal Planting Conditions',
      message: 'Next 3 days show ideal conditions for rice planting.',
      time: '5 hours ago'
    }
  ];

  const farmingTips = {
    humidity: {
      high: 'High humidity may increase disease risk. Monitor crops for fungal growth.',
      low: 'Low humidity might stress plants. Consider irrigation.'
    },
    wind: {
      high: 'Strong winds may damage crops. Check support structures.',
      low: 'Light winds are good for natural pollination.'
    },
    rain: {
      high: 'Heavy rain forecast. Ensure proper drainage.',
      low: 'Dry conditions expected. Plan irrigation accordingly.'
    }
  };
  */

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      const city = userInfo?.city || 'Manila';
      const result = await getForecastWeather(city);
      if (result instanceof Error) {
        setError(result.message || 'Unable to load forecast');
        setForecast(null);
      } else {
        setForecast(result);
        // Set selectedDay to the first available forecast day
        if (result.forecast?.forecastday?.[0]) {
          setSelectedDay(result.forecast.forecastday[0].date);
        }
        setError(null);
      }
      setLoading(false);
    };
    fetchForecast();
  }, [userInfo?.city, userInfo?.accessToken]);

  return (
    <div className="weather-forecast-container">
      {/* Today's Weather Card */}
      <div className="overview-card today-weather-card">
        {loading ? (
          <div className="weather-loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading forecast...</p>
          </div>
        ) : error ? (
          <div className="weather-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={() => {
              const city = userInfo?.city || 'Manila';
              getForecastWeather(city).then(result => {
                if (result instanceof Error) {
                  setError(result.message || 'Unable to load forecast');
                  setForecast(null);
                } else {
                  setForecast(result);
                  // Set selectedDay to the first available forecast day on retry
                  if (result.forecast?.forecastday?.[0]) {
                    setSelectedDay(result.forecast.forecastday[0].date);
                  }
                  setError(null);
                }
              });
            }} className="retry-button">
              <i className="fas fa-sync-alt"></i> Retry
            </button>
          </div>
        ) : forecast?.forecast?.forecastday?.[0] ? (
          <>
            <div className="today-header">
              <div className="today-location">
                <i className="fas fa-map-marker-alt"></i>
                <h2>{forecast.location?.name || userInfo?.city || 'Manila'}</h2>
              </div>
              <div className="today-date">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="today-content">
              <div className="today-main">
                <i className={`weather-icon-large fas fa-${getWeatherIcon(forecast.forecast.forecastday[0].day.condition.text)}`}></i>
                <div className="today-temp-container">
                  <div className="today-temp">
                    {Math.round(forecast.forecast.forecastday[0].day.avgtemp_c)}°C
                  </div>
                  <div className="today-high-low">
                    <span>H: {Math.round(forecast.forecast.forecastday[0].day.maxtemp_c)}°</span>
                    <span>L: {Math.round(forecast.forecast.forecastday[0].day.mintemp_c)}°</span>
                  </div>
                </div>
              </div>
              <div className="today-condition">{forecast.forecast.forecastday[0].day.condition.text}</div>
              <div className="today-details">
                <div className="detail-item">
                  <i className="fas fa-tint"></i>
                  <span>Humidity</span>
                  <span className="detail-value">{forecast.forecast.forecastday[0].day.avghumidity}%</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-wind"></i>
                  <span>Wind Speed</span>
                  <span className="detail-value">{Math.round(forecast.forecast.forecastday[0].day.maxwind_kph)} km/h</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-cloud-showers-heavy"></i>
                  <span>Rain Chance</span>
                  <span className="detail-value">{forecast.forecast.forecastday[0].day.daily_chance_of_rain}%</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* 7-Day Forecast Card */}
      <div className="overview-card forecast-card">
        <div className="card-header">
          <h3><i className="fas fa-calendar-alt"></i> 7-Day Forecast</h3>
        </div>
        {!loading && !error && forecast ? (
          <div className="forecast-list">
            {forecast.forecast?.forecastday?.slice(1).map((day) => (
              <div 
                className={`forecast-item ${selectedDay === day.date ? 'active' : ''}`}
                key={day.date}
                onClick={() => setSelectedDay(selectedDay === day.date ? null : day.date)}
              >
                <div className="forecast-date">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div className="forecast-main">
                  <i className={`weather-icon fas fa-${getWeatherIcon(day.day.condition.text)}`}></i>
                  <div className="forecast-temp">
                    <span>{Math.round(day.day.maxtemp_c)}°</span>
                    <span className="temp-separator">/</span>
                    <span className="min-temp">{Math.round(day.day.mintemp_c)}°</span>
                  </div>
                </div>
                <div className="forecast-desc">{day.day.condition.text}</div>
                <div className="forecast-details">
                  <span><i className="fas fa-tint"></i> {day.day.avghumidity}%</span>
                  <span><i className="fas fa-wind"></i> {Math.round(day.day.maxwind_kph)} km/h</span>
                  <span><i className="fas fa-cloud-showers-heavy"></i> {day.day.daily_chance_of_rain}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Hourly Forecast Card */}
      {forecast?.forecast?.forecastday && (
        <div className="hourly-forecast-card">
          <div className="hourly-forecast-header">
            <h3>
              <i className="fas fa-clock"></i> Hourly Forecast for{' '}
              {selectedDay === forecast.forecast.forecastday[0].date ? 'Today' : 
                new Date(selectedDay!).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
          </div>
          <div className="hourly-list">
            {forecast.forecast.forecastday
              .find(day => day.date === selectedDay)
              ?.hour.map((hour, index) => {
                const hourTime = new Date(hour.time);
                const isNow = selectedDay === forecast.forecast.forecastday[0].date && 
                             new Date().getHours() === hourTime.getHours();
                return (
                  <div key={index} className={`hourly-item ${isNow ? 'active' : ''}`}>
                    <div className="hourly-time">
                      {hourTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      {isNow && <span className="now-indicator">Now</span>}
                    </div>
                    <i className={`hourly-icon fas fa-${getWeatherIcon(hour.condition.text)}`}></i>
                    <div className="hourly-temp">{Math.round(hour.temp_c)}°</div>
                    <div className="hourly-details">
                      <span><i className="fas fa-tint"></i>{hour.humidity}%</span>
                      <span><i className="fas fa-wind"></i>{Math.round(hour.wind_kph)} km/h</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
