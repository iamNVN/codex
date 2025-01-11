import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_HOST_URL}/api/logout`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/login');
                } else {
                    console.error('Logout failed');
                }
            })
            .catch((error) => {
                console.error('Error during logout:', error);
            });
    }, [navigate]);

    return null;
};

export default Logout;
