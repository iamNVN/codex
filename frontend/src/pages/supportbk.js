import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Settings.module.css';
import Navbar from '../components/Navbar.js'
import { UserContext } from '../components/UserContext.js';

const Settings = () => {
    const navigate = useNavigate(); // Use navigate for programmatic redirection
    const { username, setUsername } = useContext(UserContext);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);


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

        // Fetch histories
        fetch(`${process.env.REACT_APP_HOST_URL}/api/api/settings`, {
            method: 'GET',
            credentials: 'include', // Include session cookies
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch histories');
                }
                return response.json();
            })
            .then((histories) => {
                setTableData(
                    histories.map((item, index) => ({
                        id: histories.length - index, // Serial number
                        dateTime: new Date(item.dateTime).toLocaleString(),
                        code: <a href={`https://codex.iamnvn.in/api/getCode/${item._id}`} target="_blank" rel="noopener noreferrer">View Code</a>,
                        review: <a href={`https://codex.iamnvn.in/api/getReview/${item._id}`} target="_blank" rel="noopener noreferrer">View Review</a>,
                        bugsFound: item.bugs,
                        rating: item.rating,
                    }))
                );
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching histories:', error);
            });
    }, [navigate]);


    return (
        <div className={styles.settingsHome}>
            <Navbar />

            <h1 style={{ textAlign: "center", color: "white" }}>Support</h1>


            <div style={{ padding: "20px" }}>

                <div className={styles.loader} style={{ display: loading ? 'none' : 'none' }}></div>

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
                    <div style={{display:"flex",padding: "0 110px"}}>
                    <div className={styles.settings_formgrp}>
                        <label className={styles.settings_label}>Name:</label>
                        <input type="text" placeholder="Your Name" id="name" name="name" required className={styles.settings_input} />
                    </div>

                    <div className={styles.settings_formgrp}>
                        <label className={styles.settings_label}>Username:</label>
                        <input type="text" placeholder="Username" id="username" name="username" required className={styles.settings_input} value={username} disabled />
                    </div>
                    </div>

                    <div className={styles.settings_formgrp}>
                        <label className={styles.settings_label}>Subject:</label>
                        <input type="text" id="subject" name="subject" required className={styles.settings_input} style={{width: "70%"}}/>
                    </div>

                    <div className={styles.settings_formgrp} style={{marginTop: '50px'}}>
                        <label className={styles.settings_label}>Message:</label>
                        <textarea className={styles.support_textarea} rows='12'></textarea>
                    </div>

                    <button className={styles.savebtn} type="submit">Save Changes</button>

                </div>
                

            </div>
        </div>
    );
};


export default Settings;
