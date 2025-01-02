"use client"
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { token = null } = useSelector((state) => state.auth ?? {});
  const { user = null } = useSelector((state) => state.auth ?? {});

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
