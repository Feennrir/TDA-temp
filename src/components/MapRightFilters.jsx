import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faMap, faChartLine, faBolt, faBars, faPaintBrush, faPlug } from '@fortawesome/free-solid-svg-icons';
import '../styles/mapRightFilters.css';

const MapRightFilters = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="map-controls">
      <div className="zoom-controls">
        <button onClick={onZoomIn} className="control-button control-button-zoom-in">
          <FontAwesomeIcon icon={faPlus} className="fa-icon" />
        </button>
        <button onClick={onZoomOut} className="control-button control-button-zoom-out">
          <FontAwesomeIcon icon={faMinus} className="fa-icon" />
        </button>
      </div>
      <div className="filter-controls">
        <button className="control-button control-button-filter">
          <FontAwesomeIcon icon={faMap} className="fa-icon" />
        </button>
        <button className="control-button control-button-filter">
          <FontAwesomeIcon icon={faChartLine} className="fa-icon" />
        </button>
        <button className="control-button control-button-filter">
          <FontAwesomeIcon icon={faBolt} className="fa-icon" />
        </button>
        <button className="control-button control-button-filter">
          <FontAwesomeIcon icon={faBars} className="fa-icon" />
        </button>
        <button className="control-button control-button-filter">
          <FontAwesomeIcon icon={faPaintBrush} className="fa-icon" />
        </button>
        <button className="control-button control-button-filter">
          <FontAwesomeIcon icon={faPlug} className="fa-icon" />
        </button>
      </div>
    </div>
  );
};

export default MapRightFilters;