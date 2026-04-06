'use strict';

/**
 * sortByDistance — sorts an array of workshop documents by distance from a point.
 * Used when $near is unavailable or for client-side distance display.
 *
 * @param {Array}  workshops - Array of Workshop Mongoose docs (with location.coordinates)
 * @param {number} lat       - User's latitude
 * @param {number} lng       - User's longitude
 * @returns {Array}          - Sorted array with a `distanceKm` property on each item
 */
const toRad = (deg) => (deg * Math.PI) / 180;

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R  = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const sortByDistance = (workshops, lat, lng) =>
  workshops
    .map((w) => {
      const [wLng, wLat] = w.location.coordinates; // GeoJSON: [longitude, latitude]
      return { ...w.toObject(), distanceKm: Math.round(haversineKm(lat, lng, wLat, wLng) * 10) / 10 };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

module.exports = { haversineKm, sortByDistance };
