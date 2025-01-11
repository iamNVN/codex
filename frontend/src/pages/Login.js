import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/Login.module.css';
import { UserContext } from '../components/UserContext.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Loading state to control rendering
    const { setUsername } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for error messages in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const errcode = urlParams.get('errcode');

        if (errcode) {
            let message = '';

            switch (errcode) {
                case '9':
                    message = 'Invalid credentials';
                    break;
                default:
                    message = 'An unknown error occurred';
            }

            setError(message);
        }
    }, []);

    useEffect(() => {
        // Fetch user session data
        fetch('https://codex.iamnvn.in/api/home', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Parse JSON for valid response
                } else {
                    setIsLoading(false); // Finish loading if unauthorized
                    throw new Error('Unauthorized or session expired');
                }
            })
            .then((data) => {
                if (data && data.username) {
                    setUsername(data.username);
                    navigate('/dashboard'); // Redirect to home if session is valid
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setIsLoading(false); // Finish loading even on error
            });
    }, [navigate, setUsername]);

    if (isLoading) {
        // Render loading indicator or nothing until the fetch completes
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.loginBody}>
            <div className={styles.background}>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
            </div>
            <form action="https://codex.iamnvn.in/api/login" method="post" className={styles.login_form}>
                <h3>Login</h3>
                {error && <span className={styles.error_msg}>{error}</span>}
                <input
                    type="text"
                    placeholder="Username"
                    id="username"
                    name="uname"
                    required
                    className={styles.login_input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    name="pwd"
                    required
                    className={styles.login_input}
                />
                <button className={styles.login} type="submit">Log In</button>
                <a className={styles.register} href="/register">
                    Create an Account
                </a>
            </form>
        </div>
    );
};

export default Login;
