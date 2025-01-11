import React, { useState } from 'react';
import { Turn as Hamburger } from 'hamburger-react'; // Import from hamburger-react
import '../styles/Hamburger.css';

const HamburgerMenu = () => {
  const [isOpen, setOpen] = useState(false);

  const closeMenu = () => setOpen(false); // Function to close the menu

  return (
    <div className="hamburger-menu">
      <div className='menu-icon'>
          <Hamburger toggled={isOpen} toggle={setOpen} color="#fff"/>
      </div>

      {isOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <ul onClick={(e) => e.stopPropagation()}>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/history">History</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
