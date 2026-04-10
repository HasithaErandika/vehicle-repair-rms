import * as Location from 'expo-location';

export const LocationService = {
  async getCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }
    const location = await Location.getCurrentPositionAsync({});
    return location;
  },
};
