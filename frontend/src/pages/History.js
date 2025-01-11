import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/History.module.css';
import Navbar from '../components/Navbar.js'
import { UserContext } from '../components/UserContext.js';

const History = () => {
    const navigate = useNavigate(); // Use navigate for programmatic redirection
    const { setUsername } = useContext(UserContext);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      // Fetch user details and historiesS
      fetch(`${process.env.HOST_URL}/api/home`, {
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
      fetch(`${process.env.HOST_URL}/api/history`, {
          method: 'POST',
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
                  code: <a href={`${process.env.HOST_URL}/api/getCode/${item._id}`} target="_blank" rel="noopener noreferrer">View Code</a>,
                  review: <a href={`${process.env.HOST_URL}/api/getReview/${item._id}`} target="_blank" rel="noopener noreferrer">View Review</a>,
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
  // Dependency array includes navigate to avoid warning

      const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    
      const sortTable = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    
        const sortedData = [...tableData].sort((a, b) => {
          if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
          if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
          return 0;
        });
    
        setTableData(sortedData);
        setSortConfig({ key, direction });
      };
    
      const getSortIcon = (key) => {
        if (sortConfig.key === key) {
          return sortConfig.direction === "asc" ? "▲" : "▼";
        }
        return "⇅";
      };
    

  return (
    <div className={styles.HistoryHome}>
      <Navbar />
    
      <h1 style={{ textAlign: "center", color: "white" }}>History</h1>
      
    
        <div style={{ padding: "20px" }}>
          
        <div className={styles.loader} style={{display: loading ? 'block' : 'none'}}></div>
      <table className={styles.history_card} style={{display: loading ? 'None' : 'table'}}>
        <thead>
          <tr style={{backgroundColor: "rgba(5, 5, 5, 0.09)"}}>
            <th onClick={() => sortTable("id")} style={{cursor: "pointer"}}>
              S.No {getSortIcon("id")}
            </th>
            <th onClick={() => sortTable("dateTime")} style={{cursor: "pointer"}} >
              Date Time {getSortIcon("dateTime")}
            </th>
            <th >
              Code
            </th>
            <th  >
              Review
            </th>
            <th onClick={() => sortTable("bugsFound")} style={{cursor: "pointer"}} >
              Bugs Found {getSortIcon("bugsFound")}
            </th>
            <th onClick={() => sortTable("rating")} style={{cursor: "pointer"}} >
              Rating {getSortIcon("rating")}
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.id}</td>
              <td>{row.dateTime}</td>
              <td>{row.code}</td>
              <td>{row.review}</td>
              <td>{row.bugsFound}</td>
              <td>{row.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
  );
};


export default History;
