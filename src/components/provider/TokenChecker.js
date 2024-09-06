"use client"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setToken } from '@/redux/slices/AuthSlice';

const TokenChecker = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return children;
};

export default TokenChecker;