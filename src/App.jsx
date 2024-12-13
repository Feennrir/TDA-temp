import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_VIEW_STATE } from './config';
import Header from "./components/Header";
import MapContainer from './components/MapContainer';
import Tooltip from './components/Tooltip';
import Loader from './components/Loader';
import useLayerLoader from './hooks/useLayerLoader';
import ProductionInformation from './components/ProductionInformation';
import MapRightFilters from "./components/MapRightFilters";
import CurrentDate from './components/CurrentDate';
import ChartOverlay from './components/ChartOverlay';
import Menu from './components/Menu';

import "./styles/header.css";
import "./styles/productionInformation.css";
import "./styles/mapRightFilters.css";
import './styles/menu.css';

/**
 * The main application component that renders a map and handles user interactions.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return <App />;
 *
 * @description
 * This component manages the state of the map view, including the active layer, hovered feature,
 * clicked feature, view state, and mouse position. It adjusts the active layer based on the zoom level
 * and updates the map layers accordingly. It also handles mouse movement to update the mouse position
 * when a feature is hovered.
 *
 * @function
 * @name App
 *
 * @property {string} activeLayer - The currently active map layer.
 * @property {function} setActiveLayer - Function to update the active layer.
 * @property {object|null} hoveredFeature - The feature currently being hovered over, or null if none.
 * @property {function} setHoveredFeature - Function to update the hovered feature.
 * @property {object|null} clickedFeature - The feature currently being clicked, or null if none.
 * @property {function} setClickedFeature - Function to update the clicked feature.
 * @property {object} viewState - The current view state of the map.
 * @property {function} setViewState - Function to update the view state.
 * @property {object} mousePosition - The current mouse position.
 * @property {function} setMousePosition - Function to update the mouse position.
 * @property {object} previousLayer - A reference to the previous active layer.
 * @property {function} useEffect - Hook to monitor zoom level and adjust active layer.
 * @property {object} useLayerLoader - Hook to load map layers based on the current state.
 * @property {function} handleMouseMove - Function to handle mouse movement and update mouse position.
 */
function App() {
  const [activeLayer, setActiveLayer] = useState('region');
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [clickedFeature, setClickedFeature] = useState(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const previousLayer = useRef(activeLayer);

  const handleZoomIn = () => {
    setViewState(prevState => ({ ...prevState, zoom: prevState.zoom + 1 }));
  };

  const handleZoomOut = () => {
    setViewState(prevState => ({ ...prevState, zoom: prevState.zoom - 1 }));
  };

  const handleChartClick = () => {
    setOverlayVisible(prevState => !prevState); // Toggle visibility
  };

  const handleMapClick = () => {
    setOverlayVisible(false); // Hide chart
  };


  // Monitor zoom level and adjust active layer based on zoom thresholds
  useEffect(() => {
    const { zoom } = viewState;

    if (zoom >= 11 && activeLayer !== 'commune') {
      setActiveLayer('commune');
    } else if (zoom >= 8 && zoom < 11 && activeLayer !== 'departement') {
      setActiveLayer('departement');
    } else if (zoom < 8 && activeLayer !== 'region') {
      setActiveLayer('region');
    }
  }, [viewState.zoom, activeLayer]);

  // Load map layers based on the current state
  const { layers, isLoading } = useLayerLoader({
    activeLayer,
    hoveredFeature,
    clickedFeature,
    viewState,
    setHoveredFeature,
    setClickedFeature,
    setViewState,
    previousLayer,
  });

  // Handle mouse movement and update mouse position when a feature is hovered
  const handleMouseMove = (event) => {
    if (hoveredFeature) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  // Render the map, loader, and tooltip components
  return (
    <>
      <Header />
      <div className="container">
        <CurrentDate />
        <div style={{ width: "20px" }}></div>
        <ProductionInformation clickedFeature={clickedFeature} />
      </div>
      <Menu />
      <div onMouseMove={handleMouseMove}>
        <MapContainer
          viewState={viewState}
          onViewStateChange={(newViewState) => setViewState(newViewState)}
          layers={layers} />
        <MapRightFilters
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onChartClick={handleChartClick}
          onMapClick={handleMapClick}
        />
        <ChartOverlay isVisible={isOverlayVisible} />
        {isLoading && <Loader />}
        {hoveredFeature && <Tooltip feature={hoveredFeature} mousePosition={mousePosition} />}
      </div>

    </>
  );
}

export default App;
