import React from 'react';
import { Link } from 'react-router-dom';
import homeImage from '../assets/homeimage.png'; // Import the new image
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <span className="dark-blue-letter">G</span><span className="light-blue-letter">o</span><span className="dark-blue-letter">E</span><span className="light-blue-letter">asy</span><span className="dark-blue-letter">T</span><span className="light-blue-letter">rade</span>
          </Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li className="dropdown">
            <span className="dropbtn">Seller Side</span>
            <div className="dropdown-content">
              <Link to="/seller/domestic-hvi">Seller-Domestic-HVI</Link>
              <Link to="/seller/domestic-description">Seller-Domestic-Description</Link>
              <Link to="/seller/import-description">Seller-Import Description</Link>
              <Link to="/seller/import-recap">Seller-Import Recap</Link>
            </div>
          </li>
          <li className="dropdown">
            <span className="dropbtn">Buyer Side</span>
            <div className="dropdown-content">
              <Link to="/buyer/domestic-hvi">Buyer-Domestic-HVI</Link>
              <Link to="/buyer/domestic-description">Buyer-Domestic-Description</Link>
              <Link to="/buyer/import-description">Buyer-Import Description</Link>
              <Link to="/buyer/import-recap">Buyer-Import Recap</Link>
              <Link to="/buyer/inquiry-cotton">Buyer-Inquiry Cotton</Link>
            </div>
          </li>
          <li><Link to="/mmf">MMF</Link></li>
          <li><Link to="/yarn">YARN</Link></li>
        </ul>
        <div className="navbar-actions">
          <Link to="/login" className="navbar-button login">Login</Link>
          <Link to="/signup" className="navbar-button signup">Sign Up</Link>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1>Your Gateway to Seamless Global Trading</h1>
          <p>
            GoEasyTrade provides a robust platform for buyers and sellers to connect, trade, and manage their agricultural commodities with ease and efficiency.
            Experience transparent transactions, real-time market insights, and a comprehensive suite of tools designed to streamline your trading operations.
          </p>
          {/* Removed "Get This Theme" button */}
        </div>
        <div className="hero-image">
          <img src={homeImage} alt="Cotton Trading Platform" />
        </div>
      </header>
    </div>
  );
};

export default Home;
