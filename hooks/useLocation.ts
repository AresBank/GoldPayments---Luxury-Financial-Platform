
import { useState, useCallback } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
}

const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({ latitude: null, longitude: null });
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setRequesting(true);
    setError(null);

    // Simulate API call and validation
    setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Simulate checking if location is in Mexico. For this demo, we'll always succeed.
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setRequesting(false);
            },
            (err) => {
                setError(`Failed to get location: ${err.message}`);
                setRequesting(false);
            }
        );
    }, 1500);
  }, []);

  return { location, error, requesting, getLocation };
};

export default useLocation;
