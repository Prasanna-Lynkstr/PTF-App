import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/me', {
          credentials: 'include'
        });

        if (!isMounted) return;
        if (response.ok) {
          const data = await response.json();
          
          setUser(data);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
          setLoggedIn(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('token'); // optional if using tokens in localStorage
    window.location.href = '/hiring-org/';  // redirect to login page
  } catch (error) {
  }
};

  return { user, loggedIn, loading, logout };
}