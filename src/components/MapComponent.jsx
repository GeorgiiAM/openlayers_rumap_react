import { useEffect } from 'react'
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';


const MapComponent = () => {
    useEffect(() => {

        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'http://tile.digimap.ru/rumap/{z}/{x}/{y}.png?guid=93BC6341-B35E-4B34-9DFE-26796F64BBB7'
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
            source: source
        });
        map.addLayer(vector);

        return () => {
            map.setTarget(null);
        };
    }, []);

    return <>
        <div id="map"></div>
    </>

};

export default MapComponent;
