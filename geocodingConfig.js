// geocodingConfig.js
const axios = require('axios');

// Free geocoding using Nominatim (OpenStreetMap)
async function geocodeAddress(location, country) {
    try {
        const query = `${location}, ${country}`;
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                format: 'json',
                q: query,
                limit: 1,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'YourAppName/1.0' // Nominatim requires a User-Agent
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                formatted_address: result.display_name,
                coordinates: [parseFloat(result.lon), parseFloat(result.lat)] // [lng, lat] for GeoJSON
            };
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}

async function reverseGeocode(latitude, longitude) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                format: 'json',
                lat: latitude,
                lon: longitude,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'YourAppName/1.0'
            }
        });

        if (response.data) {
            return {
                formatted_address: response.data.display_name,
                components: response.data.address
            };
        } else {
            throw new Error('Address not found');
        }
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        throw error;
    }
}

module.exports = {
    geocodeAddress,
    reverseGeocode
};