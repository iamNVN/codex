import React, {useState, useEffect,} from 'react';
import '../styles/Navbar.css';
import { Turn as Hamburger } from 'hamburger-react'
import HamburgerMenu from './Hamburger';


const Navbar = () => {
  
  const [isOpen, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    // Set activeLink to the current path on initial render
    setActiveLink(window.location.pathname);
  }, []);

  const handleClick = (link) => {
    setActiveLink(link);
  };


  return (
    <div className="navbar">
      <div>
        <div className="title">CodeX</div>
        <span className="subtitle">AI-Powered Code Reviewer</span>
      </div>
      <HamburgerMenu />
      

      <div className="nav-links">
        <a
          href="/dashboard"
          className={activeLink === '/dashboard' ? 'active' : ''}
          onClick={() => handleClick('/dashboard')}
        >
          Dashboard
        </a>
        <a
          href="/history"
          className={activeLink === '/history' ? 'active' : ''}
          onClick={() => handleClick('/history')}
        >
          History
        </a>
        <a
          href="/support"
          className={activeLink === '/support' ? 'active' : ''}
          onClick={() => handleClick('/support')}
        >
          Support
        </a>
        <a
          href="/logout"
          className={activeLink === '/logout' ? 'active' : ''}
          onClick={() => handleClick('/logout')}
        >
          Logout
        </a>
      </div>
    </div>
  );
};

export default Navbar;
