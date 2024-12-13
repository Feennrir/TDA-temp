import React, { useState } from 'react';
import '../styles/menu.css';

function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    const filterData = {
        "Tout": [],
        "Lignes aériennes": ["Continu", "BT", "HT", "THT"],
        "Lignes souterraines": ["Continu", "BT", "HT", "THT"]
      };

  return (
    <div className="menuContainer">
    <div className={`menu ${isOpen ? 'open' : ''}`}>
    <p>Affichage des lignes électriques</p>
    {Object.entries(filterData).map(([category, options]) => (
        <div key={category}>
        <input
          type="checkbox"
          id={category}
          name={category}
        />
        <label htmlFor={category}>{category}</label>
        <ul>
          {options.map((option) => (
            <li key={option}>
              <input
                type="checkbox"
                id={`${category}-${option}`}
                name={`${category}-${option}`}
              />
              <label htmlFor={`${category}-${option}`}>{option}</label>
            </li>
          ))}
        </ul>
      </div> 
    ))}
    </div>
    <button className={`buttonMenu ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>{isOpen ? '<' : '>'}</button>
    </div>
    
  );
}

export default Menu;