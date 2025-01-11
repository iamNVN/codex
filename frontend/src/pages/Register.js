import React, { useState, useEffect } from 'react';
import styles from '../styles/Register.module.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        general: ''
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const errcode = urlParams.get('errcode');

        if (errcode) {
            let message = '';

            switch (errcode) {
                case '9':
                    message = 'Invalid username. Please try again';
                    break;
                case '1':
                    message = 'Username or password cannot be empty';
                    break;
                case '12':
                    message = 'Password length should be at least 8';
                    break;
                case '18':
                    message = 'Username is already taken';
                    break;
                default:
                    message = 'An unknown error occurred';
            }

            setErrors((prevErrors) => ({
                ...prevErrors,
                general: message
            }));
        }
    }, []);

    const verifyUsername = () => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (username && !usernameRegex.test(username)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                username: 'Username can only contain alphanumeric characters and underscores'
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                username: ''
            }));
        }
    };

    const verifyPassword = (value) => {
        if (value.length < 8) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Password length must be at least 8 characters',
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: '',
            }));
        }
    };

    const matchPassword = (passwordValue, confirmPasswordValue) => {
        if (confirmPasswordValue && passwordValue !== confirmPasswordValue) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: "Passwords don't match",
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: '',
            }));
        }
    };

    return (
        <div className={styles.registerBody}>
            <div className={styles.regbackground}>
                <div className={styles.regshape}></div>
                <div className={styles.regshape}></div>
            </div>
            <form action="http://localhost:8080/register" method="post" className={styles.regform}>
                <h3>Register</h3>
                {errors.general && <span className={styles.regerror_title}>{errors.general}</span>}
                <input
                    type="text"
                    placeholder="Enter Username"
                    name="uname"
                    className={styles.reg_input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onInput={verifyUsername}
                />
                {errors.username && <span className={styles.regerror_msg}>{errors.username}</span>}

                <input
                    type="password"
                    placeholder="Enter Password"
                    name="pwd"
                    className={styles.reg_input}
                    value={password}
                    onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);
                        verifyPassword(value);
                    }}
                />
                {errors.password && <span className={styles.regerror_msg}>{errors.password}</span>}

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    className={styles.reg_input}
                    onChange={(e) => {
                        const value = e.target.value;
                        setConfirmPassword(value);
                        matchPassword(password, value);
                    }}
                />
                {errors.confirmPassword && <span className={styles.regerror_msg}>{errors.confirmPassword}</span>}

                <button className={styles.mainbtn} type="submit">Register</button>
                <a className={styles.secondarybtn} href="http://localhost:3000/login">
                    Already have an account?
                </a>
            </form>
        </div>
    );
};

export default Register;
