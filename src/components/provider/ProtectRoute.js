"use client"
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!token || !user) {
      const tokenFromCookie = Cookies.get('token');
      if (!tokenFromCookie || !user) {
        router.push('/login');
      }
    }
  }, [token, router]);

  return token ? children : null;
};

export default ProtectedRoute;
