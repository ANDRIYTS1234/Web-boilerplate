import { useCallback, useEffect, useState } from 'react';
import {
  KYIV, fetchCityName, fetchForecast, getCurrentPosition,
} from '../api/weather';

// Tries the browser geolocation first and falls back to Kyiv.
const resolveLocation = async () => {
  try {
    const coords = await getCurrentPosition();
    const name = await fetchCityName(coords).catch(() => 'Your location');
    return { ...coords, name, fromGeolocation: true };
  } catch {
    return { ...KYIV, fromGeolocation: false };
  }
};

const useWeather = () => {
  const [state, setState] = useState({
    loading: true, error: '', location: null, forecast: [],
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      const location = await resolveLocation();
      const forecast = await fetchForecast(location);
      setState({
        loading: false, error: '', location, forecast,
      });
    } catch {
      setState((prev) => ({
        ...prev, loading: false, error: 'Could not load the weather. Please try again.',
      }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
};

export default useWeather;
