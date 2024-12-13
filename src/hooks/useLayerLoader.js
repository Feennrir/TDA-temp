import { useState, useEffect } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { FlyToInterpolator } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { easeCubic } from "d3-ease";
import {
  FRENCH_REGIONS,
  FRENCH_DEPARTEMENTS,
} from "../config";

import { normalizePower, calculateCommuneCenter } from "../utils";

import FRENCH_COMMUNES from '../json/COMMUNE.json';
import REGISTRE_NUCLEAIRE from '../json/REGISTRE_NUCLEAIRE.json';
import REGISTRE_EOLIEN from '../json/REGISTRE_EOLIEN.json';


/**
 * Custom hook to manage the loading and interaction of map layers.
 *
 * @param {Object} params - The parameters for the hook.
 * @param {string} params.activeLayer - The currently active layer.
 * @param {Object} params.hoveredFeature - The feature currently being hovered over.
 * @param {Object} params.clickedFeature - The feature currently being clicked.
 * @param {Object} params.viewState - The current view state of the map.
 * @param {Function} params.setHoveredFeature - Function to set the hovered feature.
 * @param {Function} params.setClickedFeature - Function to set the clicked feature.
 * @param {Function} params.setViewState - Function to set the view state of the map.
 * @param {Object} params.previousLayer - Ref object to keep track of the previous layer.
 *
 * @returns {Object} - An object containing the layers and the loading state.
 * @returns {Array} layers - The array of layers to be rendered on the map.
 * @returns {boolean} isLoading - The loading state of the layers.
 */
const useLayerLoader = ({
  activeLayer,
  hoveredFeature,
  clickedFeature,
  viewState,
  setHoveredFeature,
  setClickedFeature,
  setViewState,
  previousLayer,
}) => {
  const [layers, setLayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  

  useEffect(() => {
    if (previousLayer.current !== activeLayer) {
      setIsLoading(true);
      previousLayer.current = activeLayer;
    }

    const loadLayer = async () => {
      let baseLayer = null;
      const communeMap = new Map(FRENCH_COMMUNES.features.map(commune => [commune.properties.INSEE_COM, commune]));
      

      const commonLayerSettings = {
        stroked: true,
        filled: true,
        lineWidthMinPixels: 2,
        pickable: true,
        onHover: ({ object }) => setHoveredFeature(object || null),
        onClick: (info) => {
          if (info.object) {
            setClickedFeature(info.object);
            setViewState({
              ...viewState,
              longitude: info.coordinate[0],
              latitude: info.coordinate[1],
              zoom:
                activeLayer === "commune"
                  ? 12
                  : activeLayer === "departement"
                  ? 9
                  : 8,
              transitionDuration: 1000,
              transitionInterpolator: new FlyToInterpolator(),
              transitionEasing: easeCubic,
            });
          } else {
            setClickedFeature(null);
          }
        },
        updateTriggers: {
          getFillColor: [hoveredFeature, clickedFeature],
          getLineColor: [hoveredFeature, clickedFeature],
        },
      };

      FRENCH_COMMUNES.features.forEach((commune) => {
        if (!commune.center) {
          const center = calculateCommuneCenter(commune.geometry.coordinates);
          commune.center = center;
        }
      });

      switch (activeLayer) {
        case "region":
          baseLayer = new GeoJsonLayer({
            id: "region-layer",
            data: FRENCH_REGIONS,
            ...commonLayerSettings,
            getLineColor: [255, 255, 255, 255],
            lineWidthMaxPixels: 0.75,
            getFillColor: (d) => {
              if (
                hoveredFeature &&
                hoveredFeature.properties.ID === d.properties.ID
              )
                return [62, 68, 145, 230];
              return [62, 68, 145, 255];
            },
          });
          break;

        case "departement":
          baseLayer = new GeoJsonLayer({
            id: "departement-layer",
            data: FRENCH_DEPARTEMENTS,
            ...commonLayerSettings,
            getLineColor: [255, 255, 255, 255],
            lineWidthMaxPixels: 0.75,
            getFillColor: (d) => {
              if (
                hoveredFeature &&
                hoveredFeature.properties.ID === d.properties.ID
              )
                return [62, 68, 145, 230];
              return [62, 68, 145, 255];
            },
          });
          break;

        case "commune":
          baseLayer = new GeoJsonLayer({
            id: "commune-layer",
            data: FRENCH_COMMUNES,
            ...commonLayerSettings,
            getLineColor: [255, 255, 255, 255],
            lineWidthMaxPixels: 0.75,
            getFillColor: (d) => {
              if (
                hoveredFeature &&
                hoveredFeature.properties.ID === d.properties.ID
              )
                return [62, 68, 145, 230];
              return [62, 68, 145, 255];
            },
          });
          break;

        default:
          baseLayer = null;
      }


      /**
       * NUCLEAR LAYER
       */
      const nuclearData = REGISTRE_NUCLEAIRE.map((nuclear) => {
        const commune = communeMap.get(nuclear.codeINSEECommune);
        if (commune) {
          return {
            ...nuclear,
            latitude: commune.center[1],
            longitude: commune.center[0],
            puissance: parseFloat(nuclear.maxPuis),
          };
        }
        return null;
      }).filter((d) => d !== null);


      const nuclearPlotLayer = new ScatterplotLayer({
        id: "nuclearPlot-layer",
        data: nuclearData,
        getPosition: (d) => [d.longitude, d.latitude],
        getRadius: (d) => activeLayer === "region" ? d.puissance / 75 : activeLayer === "departement" ? d.puissance / 150 : d.puissance / 500,
        // Hex to RGB : #D13A8C
        getFillColor: [209, 58, 140, 255],
        pickable: true,
      });

      /**
       * WIND LAYER
       */
      const windData = REGISTRE_EOLIEN.map((eolien) => {
        const commune = communeMap.get(eolien.codeINSEECommune);
        if (commune) {
          return {
            ...eolien,
            latitude: commune.center[1],
            longitude: commune.center[0],
            puissance: normalizePower(eolien.maxPuis),
          };
        }
        return null;
      }).filter((d) => d !== null);


      const windPlotLayer = new ScatterplotLayer({
        id: "windPlot-layer",
        data: windData,
        getPosition: (d) => [d.longitude, d.latitude],
        getRadius: (d) => activeLayer === "region" ? d.puissance /20 : activeLayer === "departement" ? d.puissance / 40 : d.puissance / 100,
        // Hex to RGB : #00E0CB
        getFillColor: [0, 224, 203, 255],
        pickable: true,
      });



      setLayers([baseLayer, nuclearPlotLayer, windPlotLayer]);
      setTimeout(() => setIsLoading(false), 1000);
    };

    loadLayer();
  }, [activeLayer, hoveredFeature, clickedFeature, viewState]);

  return { layers, isLoading };
};

export default useLayerLoader;
