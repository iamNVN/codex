import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar.js'
import ReactMarkdown from 'react-markdown';
import { UserContext } from '../components/UserContext.js';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [bugsFound, setBugsFound] = useState('0');
  const [rating, setRating] = useState('-/10');
  const [results, setResults] = useState('');
  let intervalId;

  const startAnimation = () => {
    const states = ["Analyzing..", "Analyzing...", "Analyzing...."];
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

    document.getElementById('btntext').textContent = "Analyze";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    startAnimation();

    const code = e.target.codeInput.value;
    const language = e.target.lang.value;

    try {
      const response = await fetch('http://localhost:8080/analyze', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();

      if (response.ok) {
        setBugsFound(data.bugsFound || 'Not Available');
        setRating(data.rating || 'Not Available');
        setResults(data.review || 'No results available');
        stopAnimation();
      } else {
        setResults(`Error: ${data.message}`);
        stopAnimation();
      }
    } catch (error) {
      setResults(`Error: ${error.message}`);
      stopAnimation();
    } finally {
      setLoading(false);
      stopAnimation();
    }
  };

  const navigate = useNavigate(); // Use navigate for programmatic redirection
  const { username, setUsername } = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:8080/home', {
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
          return console.log('Something went wrong');
        }
      })
      .then((data) => {
        if (data) {
          setUsername(data.username);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [navigate]); // Dependency array includes navigate to avoid warning




  return (
    <div className={styles.BodyHome}>
      <Navbar />
      {/* <h3 className={styles.welcometxt}>Welcome, {username}!</h3> */}
      <div className={styles.flexhome} style={{
        display: 'flex',
        marginRight: '40px',
        gap: '10px',
        marginTop: '60px',
        justifyContent: 'space-between',
      }}
      >
        <form onSubmit={handleSubmit} id="codeForm" className={styles.home_form}>
          <span className={styles.error_title} id="errorreg"></span>
          <h3 style={{
            fontSize: '18px',
            color: '#ffffffe8',
            textAlign: 'left',
            marginTop: '-25px',
            marginBottom: '26px',
          }}
          >Code:</h3>
          <textarea className={styles.home_textarea} placeholder="Paste your Code" rows="18" id="codeInput" name="codeInput" required></textarea>
          <div style={{
            display: 'flex',
            marginTop: '20px',
            justifyContent: 'space-between',
          }}
          >
            <select name="lang" id="lang" className={styles.lang} style={{ marginRight: '12px' }}>
              <option value="HTML">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="php">PHP</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="dart">Dart</option>
              <option value="java">Java</option>
              <option value="ruby">Ruby</option>
              <option value="swift">Swift</option>
              <option value="kotlin">Kotlin</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="sql">SQL</option>
              <option value="perl">Perl</option>
              <option value="shell">Shell Script</option>
              <option value="lua">Lua</option>
            </select>
            <button className={styles.analyze} type="submit" id="analyze" disabled={loading}>
              {loading ? (
                <span className={styles.loader}></span>
              ) : (
                <div></div>
              )}
              <span id='btntext' style={{ color: '#080710' }}>Analyze</span> </button>
          </div>
        </form>
        <div className={styles.feedback}>
          <h3>Results:</h3>
          <span className={styles.error_title} id="errorreg"></span>
          <div id="results" className={styles.custom_textarea} tabindex="0">
            <ReactMarkdown>
              {results}</ReactMarkdown></div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '5px 10px',
          }}
          >
            <div style={{ float: 'left' }}>
              <span id="" className={styles.span_title}>Bugs Found: </span>
              <span className={styles.span_value} id="bugsFound">{bugsFound}</span>
            </div>
            <div style={{ float: 'right' }}>
              <span id="" className={styles.span_title}>Rating: </span>
              <span className={styles.span_value} id="codeRating">{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
