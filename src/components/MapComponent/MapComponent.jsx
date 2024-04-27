import { useEffect, useState, useRef } from 'react'
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { Fill, Stroke, Circle, Style } from 'ol/style';
import { MultiPoint } from 'ol/geom';
import { Draw, Modify } from 'ol/interaction';
import { doubleClick } from 'ol/events/condition';
import { Control } from 'ol/control.js';
import { getAreaStatisticsByCoordinates } from '../../services/ApiService.js'
import Overlay from 'ol/Overlay';
import { GUID } from '../../../config.js';
import './MapComponent.css'


const MapComponent = () => {
    // best way to store state in this case is to use useState, but it's not that simple
    // you create state ref that can be accessed in OpenLayers onclick callback function
    // https://stackoverflow.com/a/60643670
    // however this solution does not work very well, so I'll use a simple variable
    let drawingEnabled = false;

    const styles = [
        new Style({
            stroke: new Stroke({
                color: 'blue',
                width: 3,
            }),
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)',
            }),
        }),
        new Style({
            image: new Circle({
                radius: 10,
                fill: new Fill({
                    color: 'orange',
                }),
            }),
            geometry: function (feature) {
                // return the coordinates of the first ring of the polygon
                const coordinates = feature.getGeometry().getCoordinates()[0];
                return new MultiPoint(coordinates);
            },
        }),
    ];

    useEffect(() => {

        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: `http://tile.digimap.ru/rumap/{z}/{x}/{y}.png?guid=${GUID}`
                    })
                })
            ],
            view: new View({
                center: transform([30.35, 59.95], 'EPSG:4326', 'EPSG:3857'),
                zoom: 12,
                projection: 'EPSG:3857'
            })
        });

        const source = new VectorSource();

        const vector = new VectorLayer({
            source: source,
            style: styles,
        });
        map.addLayer(vector);

        const draw = new Draw({
            source: source,
            type: 'Polygon',
            stopClick: true
        });

        const modifyStyle = new Style({
            image: new Circle({
                radius: 10,
                fill: new Fill({
                    color: 'green',
                }),
            })
        })

        const modify = new Modify({
            source: source,
            pixelTolerance: 15,
            deleteCondition: doubleClick,
            style: modifyStyle
        });

        draw.on('drawend', event => {
            const feature = event.feature;

            getAreaStatisticsAndShowPopup(feature);

            map.removeInteraction(draw);
        });

        modify.on('modifyend', function (event) {
            const modifiedFeature = event.features.getArray()[0];

            if (modifiedFeature && modifiedFeature.getGeometry().getType() === 'Polygon') {
                getAreaStatisticsAndShowPopup(modifiedFeature);
            }
        });

        const getAreaStatisticsAndShowPopup = (feature) => {
            const coordinates = feature.getGeometry().getCoordinates()[0];
            const transformedCoordinates = coordinates.map((element) => transform(element, 'EPSG:3857', 'EPSG:4326'));
            const centerPolygonPoint = feature.getGeometry().getInteriorPoint().getCoordinates();
            let message = 'Ошибка';

            getAreaStatisticsByCoordinates(transformedCoordinates).then((data) => {
                if (data) {
                    if ('population_rs' in data) {
                        const formattedNumber = data.population_rs.toLocaleString('ru-RU', { style: 'decimal' });
                        message = `Население на данной территории: ${formattedNumber}`;
                    }
                    else {
                        message = `Ошибка: ${data.message}. ${data.verboseMessage}`
                    }
                }
                showPopup(centerPolygonPoint, message);
            }).catch(error => {
                console.error('Error:', error);
                message = `Ошибка: ${error}`;
                showPopup(centerPolygonPoint, message);
            });
        }

        const showPopup = (centerPolygonPoint, message) => {
            removePopups(map);

            const popupElement = document.createElement('div');
            popupElement.className = 'popup';
            popupElement.innerHTML = `<div id="popup" class="ol-popup">
                                         <div id="popup-closer" class="popup-closer">✖</div>
                                         <div>${message}</div>
                                      </div>`;

            const popup = new Overlay({
                element: popupElement,
                positioning: 'bottom-center',
                stopEvent: false,
            });

            map.addOverlay(popup);
            popup.setPosition(centerPolygonPoint);

            document.getElementById('popup-closer').addEventListener('click', () => {
                map.removeOverlay(popup);
                map.removeInteraction(draw);
                map.removeInteraction(modify);
                drawingEnabled = false;
                createPolygonButton.style.backgroundColor = 'rgb(252 252 252)';
                source.clear();
            });
        };

        const createPolygonButton = document.createElement('div');
        createPolygonButton.className = 'createPolygonButton'

        createPolygonButton.addEventListener('click', function () {

            if (drawingEnabled) {
                createPolygonButton.style.backgroundColor = 'rgb(252 252 252)';
                map.removeInteraction(draw);
                map.removeInteraction(modify);
                removePopups(map);
                drawingEnabled = false;
                source.clear();
            } else {
                createPolygonButton.style.backgroundColor = 'rgb(185 221 251)';
                map.addInteraction(draw);
                map.addInteraction(modify);
                drawingEnabled = true;
            }
        });

        const createPolygonControl = new Control({
            element: createPolygonButton
        });
        map.addControl(createPolygonControl);

        return () => {
            map.setTarget(null);
        };
    }, []);


    return <>
        <div id="map"></div>
    </>
};

const removePopups = (map) => {
    const overlays = map.getOverlays().getArray();

    overlays.forEach(overlay => {
        map.removeOverlay(overlay);
    });
};

export default MapComponent;
