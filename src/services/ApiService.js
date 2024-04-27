import {
    GUID
} from '../../config.js';

export const getAreaStatisticsByCoordinates = async (coordinates) => {
    const geojson = {
        "features": [{
            "geometry": {
                "coordinates": [coordinates],
                "type": "Polygon"
            },
            "properties": {},
            "type": "Feature"
        }],
        "type": "FeatureCollection"
    }

    const url = `http://gis01.rumap.ru/4898/areaStatistics?guid=${GUID}&geometry=1&geojson=${JSON.stringify(geojson)}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}