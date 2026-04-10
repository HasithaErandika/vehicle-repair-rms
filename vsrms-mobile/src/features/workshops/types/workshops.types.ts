export interface Workshop {
  id: string; // From jsonFormatter
  name: string;
  address: string;
  district: string;
  location: { type: 'Point', coordinates: [number, number] };
  averageRating: number;
  totalReviews: number;
  imageUrl?: string;
  contactNumber?: string;
  servicesOffered?: string[];
  distance?: number; // Calculated on backend via $geoNear
}
