import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Settings.module.css';
import Navbar from '../components/Navbar.js'
import { UserContext } from '../components/UserContext.js';
import toast, { Toaster } from 'react-hot-toast';

const Settings = () => {
    const navigate = useNavigate(); // Use navigate for programmatic redirection
    const { username, setUsername } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    let intervalId;

    const startAnimation = () => {
        const states = ["Sending..", "Sending...", "Sending...."];
        let index = 0;
        // document.querySelector('.loader').style.display = 'inline-block';


        intervalId = setInterval(() => {
            document.getElementById('btntext').textContent = states[index];
            index = (index + 1) % states.length;
        }, 500);
    };

    const stopAnimation = () => {
        clearInterval(intervalId);
        // document.querySelector('.loader').style.display = 'none';

        document.getElementById('btntext').textContent = "Send Message";
    };

    const handleSupportTicket = async (e) => {
        e.preventDefault();
        setLoading(true);
        startAnimation();

        const name = e.target.name.value;
        const subject = e.target.subject.value;
        const message = e.target.message.value;

        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/api/support`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, subject, message }),
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('Message Sent!',
                    {
                        style: {
                            borderRadius: '14px',
                            background: '#211F2D',
                            color: '#fff',
                            padding: '16px',
                        },
                    });
                stopAnimation();
            } else {
                toast.error('Message Sent!',
                    {
                        style: {
                            borderRadius: '14px',
                            background: '#211F2D',
                            color: '#fff',
                            padding: '16px',
                        },
                    });
                setError(true);
                console.log(`Error: ${data.message}`);
                stopAnimation();
            }
        } catch (error) {
            toast.error('Message Sent!',
                {
                    style: {
                        borderRadius: '14px',
                        background: '#211F2D',
                        color: '#fff',
                        padding: '16px',
                    },
                });
            setError(true);
            console.log(`Error: ${error.message}`);
            stopAnimation();
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        // Fetch user details and histories
        fetch(`${process.env.REACT_APP_HOST_URL}/api/home`, {
            method: 'GET',
            credentials: 'include', // Include session cookies
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    // Redirect to login if unauthorized
                    navigate('/login');
                } else if (response.ok) {
                    return response.json(); // Parse JSON if response is okay
                } else {
                    console.log('Something went wrong');
                }
            })
            .then((data) => {
                if (data) {
                    setUsername(data.username); // Set the username
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }, [navigate]);


    return (
        <div className={styles.settingsHome}>
            <Navbar />
            <h1 style={{ textAlign: "center", color: "white" }}>Support</h1>
            <div style={{ padding: "0px 20px" }} className={styles.Supportcont}>
                <div className={styles.loader} style={{ display: loading ? 'none' : 'none' }}></div>
                <form onSubmit={handleSupportTicket} >
                    <div style={{ color: "#fff", margin: "auto", display: "flex", justifyContent: "center", flexDirection: "column" }}>
                        {/* <table  className={styles.settingsFormTable}>
                            <tr>
                            <label className={styles.settings_label}>Name:</label>
                            <input type="text" placeholder="Username" id="username" name="uname" required className={styles.settings_input} />
                            </tr>
                            <tr>
                            <label className={styles.settings_label}>Name:</label>
                            <input type="text" placeholder="Username" id="username" name="uname" required className={styles.settings_input} />
                            </tr>
                            <tr>
                            <label className={styles.settings_label}>Name:</label>
                            <input type="text" placeholder="Username" id="username" name="uname" required className={styles.settings_input} />
                            </tr>
                            <tr>
                            <label className={styles.settings_label}>Name:</label>
                            <input type="text" placeholder="Username" id="username" name="uname" required className={styles.settings_input} />
                            </tr>
                        </table> */}
                        <div style={{ display: "flex", padding: "0 110px" }}>
                            <div className={styles.settings_formgrp}>
                                <label className={styles.settings_label}>Name:</label>
                                <input type="text" id="name" name="name" required className={styles.settings_input} />
                            </div>
                            <div className={styles.settings_formgrp}>
                                <label className={styles.settings_label}>Username:</label>
                                <input type="text" id="username" name="username" required className={styles.settings_input} value={username} disabled />
                            </div>
                        </div>
                        <div className={styles.settings_formgrp}>
                            <label className={styles.settings_label}>Subject:</label>
                            <input type="text" id="subject" name="subject" required className={styles.settings_input} style={{ width: "70%" }} />
                        </div>
                        <div className={styles.settings_formgrp} style={{ marginTop: '70px' }}>
                            <label className={styles.settings_label}>Message:</label>
                            <textarea className={styles.support_textarea} rows='12' id='message' name='message' required></textarea>
                        </div>
                        <button className={styles.savebtn} type="submit" id="sendMsg" disabled={loading}>
                            {loading ? (
                                <span className={styles.loader}></span>
                            ) : (
                                <div></div>
                            )}
                            <span id='btntext' style={{ color: '#080710' }}>Send Message</span> </button>
                    </div>
                </form>
                <Toaster position="bottom-right" containerStyle={{
                    top: 20,
                    left: 20,
                    bottom: 30,
                    right: 20,
                }} />



            </div>
        </div>
    );
};


export default Settings;
