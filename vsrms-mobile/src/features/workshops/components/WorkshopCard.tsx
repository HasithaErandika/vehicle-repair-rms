import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { Workshop } from '../types/workshops.types';

export function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const { theme } = useUnistyles();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/tabs/workshops/${workshop.id}` as any)}
    >
      {workshop.imageUrl ? (
        <Image source={{ uri: workshop.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
           <MapPin size={32} color={theme.colors.muted} />
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{workshop.name}</Text>
          <View style={styles.ratingRow}>
            <Star size={14} color={theme.colors.brand} fill={theme.colors.brand} />
            <Text style={styles.ratingText}>{workshop.averageRating?.toFixed(1) || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MapPin size={14} color={theme.colors.muted} />
          <Text style={styles.distance} numberOfLines={1}>
            {workshop.district} • {workshop.distance ? `${workshop.distance} km away` : 'Near you'}
          </Text>
        </View>

        <View style={styles.badgeContainer}>
           {workshop.servicesOffered?.slice(0, 3).map(s => (
             <View key={s} style={styles.badge}>
                <Text style={styles.badgeText}>{s}</Text>
             </View>
           ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
  },
  image: { width: '100%', height: 160 },
  imagePlaceholder: { 
    width: '100%', 
    height: 160, 
    backgroundColor: theme.colors.background, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  content: { padding: theme.spacing.md },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  name: { fontSize: theme.fonts.sizes.md, fontWeight: '800', color: theme.colors.text, flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: theme.spacing.sm },
  distance: { fontSize: theme.fonts.sizes.xs, color: theme.colors.muted, fontWeight: '500' },
  badgeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: { 
    backgroundColor: theme.colors.brandSoft, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: theme.radii.sm 
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: theme.colors.brand, textTransform: 'uppercase' },
}));
