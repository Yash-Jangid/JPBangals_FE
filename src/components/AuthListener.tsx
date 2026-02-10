import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthFailureListener } from '../api/apiClient';
import { logoutUser } from '../store/slices/authSlice';
import { AppDispatch } from '../store';

export const AuthListener: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setAuthFailureListener(() => {
            console.log('🏁 [Root] Auth failure notified from API layer. Dispatching logout.');
            dispatch(logoutUser());
        });

        return () => {
            setAuthFailureListener(() => { });
        };
    }, [dispatch]);

    return null;
};
