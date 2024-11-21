import React from 'react';
import '../styles/header.css';

const Header = () => (
    <header className="header">
        <img src="/src/assets/icons/logo.png" alt="TDA" className="logo" />
        {/* <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav> */}
    </header>
);

export default Header;
