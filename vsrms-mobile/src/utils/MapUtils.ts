import { Platform, Linking } from 'react-native';

export const MapUtils = {

  //  Opens the native maps app with directions to the specified coordinates.

  openMapDirections: (latitude: number, longitude: number, label: string) => {
    const latLng = `${latitude},${longitude}`;
    const encodedLabel = encodeURIComponent(label);
    const url = Platform.select({
      ios: `maps:0,0?q=${encodedLabel}@${latLng}`,
      android: `geo:0,0?q=${latLng}(${encodedLabel})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latLng}`,
    })!;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latLng}`);
      }
    });
  },

  getRegionForCoordinates: (points: { latitude: number; longitude: number }[]) => {
    if (!points || points.length === 0) {
      return { latitude: 7.8731, longitude: 80.7718, latitudeDelta: 4.5, longitudeDelta: 3.0 };
    }

    let minLat = points[0].latitude;
    let maxLat = points[0].latitude;
    let minLng = points[0].longitude;
    let maxLng = points[0].longitude;

    points.forEach((point) => {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLng = Math.min(minLng, point.longitude);
      maxLng = Math.max(maxLng, point.longitude);
    });

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const deltaLat = (maxLat - minLat) * 1.5;
    const deltaLng = (maxLng - minLng) * 1.5;

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(deltaLat, 0.05),
      longitudeDelta: Math.max(deltaLng, 0.05),
    };
  },
};
