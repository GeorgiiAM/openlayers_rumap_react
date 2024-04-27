export async function getAreaStatisticsByCoordinates(coordinates) {
    const url = `http://gis01.rumap.ru/4898/areaStatistics?guid=93BC6341-B35E-4B34-9DFE-26796F64BBB7&geometry=1&geojson={"features":[{"geometry":{"coordinates":[${coordinates}],"type":"Polygon"},"properties":{},"type":"Feature"}],"type":"FeatureCollection"}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('response:', response);
            throw new Error('Request failed');
        }

        const data = await response.json();
        console.log('data = ', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
