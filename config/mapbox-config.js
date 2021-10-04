const mapboxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapboxConfig = {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_KEY
}

const geocodingClient = mapboxGeocoding(mapboxConfig);
export default geocodingClient;
