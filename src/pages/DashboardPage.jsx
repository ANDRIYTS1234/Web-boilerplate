import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import useWeather from '../hooks/useWeather';
import Loader from '../components/Loader';
import WeatherCard from '../components/WeatherCard';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    loading, error, location, forecast, reload,
  } = useWeather();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1 className="dashboard__title">
            5-day forecast{location ? ` for ${location.name}` : ''}
          </h1>
          {location && !location.fromGeolocation && (
            <p className="dashboard__note">Location access is off, showing Kyiv.</p>
          )}
        </div>
        <div className="dashboard__user">
          <span>{user}</span>
          <button className="button button--ghost" type="button" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {loading && <Loader text="Loading the forecast..." />}

      {!loading && error && (
        <div className="dashboard__error" role="alert">
          <p>{error}</p>
          <button className="button" type="button" onClick={reload}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <section className="dashboard__grid">
          {forecast.map((day) => <WeatherCard key={day.date} {...day} />)}
        </section>
      )}
    </main>
  );
};

export default DashboardPage;
