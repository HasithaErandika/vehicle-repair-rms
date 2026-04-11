import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Phone, Clock, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useWorkshop } from '../queries/queries';
import { RatingStars } from '../components/RatingStars';
import { WorkshopMap } from '../components/WorkshopMap';
import { handleApiError } from '@/services/error.handler';

export function WorkshopDetailScreen({ id: propId }: { id?: string }) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = propId || params.id;
  const router = useRouter();
  const { theme } = useUnistyles();
  const { data: workshop, isLoading, isError, error } = useWorkshop(id!);

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (isError) return <Text style={{ color: 'red', padding: 20 }}>{handleApiError(error)}</Text>;
  if (!workshop) return <Text style={{ padding: 20 }}>Workshop not found</Text>;

  return (
    <ScreenWrapper scroll>
      <View style={styles.container}>
        {workshop.imageUrl && (
          <Image source={{ uri: workshop.imageUrl }} style={styles.heroImage} />
        )}
        
        <View style={styles.header}>
          <Text style={styles.name}>{workshop.name}</Text>
          <RatingStars rating={workshop.averageRating || 0} size={20} />
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <MapPin size={18} color={theme.colors.brand} />
            <Text style={styles.infoText}>{workshop.address?.city || 'Colombo'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Phone size={18} color={theme.colors.brand} />
            <Text style={styles.infoText}>{workshop.contactNumber || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={18} color={theme.colors.brand} />
            <Text style={styles.infoText}>08:00 AM - 06:00 PM</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {workshop.description || "Professional vehicle repair and maintenance services with certified technicians and state-of-the-art diagnostic equipment."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <WorkshopMap />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specializations</Text>
          <View style={styles.chipContainer}>
            {workshop.specialization?.map(s => (
              <View key={s} style={styles.chip}>
                <ShieldCheck size={14} color={theme.colors.brand} />
                <Text style={styles.chipText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => router.push(`/tabs/workshops/book/${workshop._id}` as any)}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { paddingBottom: 40 },
  heroImage: { width: '100%', height: 240 },
  header: { padding: theme.spacing.md, gap: 8 },
  name: { fontSize: theme.fonts.sizes.xxl, fontWeight: '800', color: theme.colors.text },
  infoGrid: { 
    padding: theme.spacing.md, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: theme.fonts.sizes.sm, color: theme.colors.muted, fontWeight: '500' },
  section: { padding: theme.spacing.md, gap: 12 },
  sectionTitle: { fontSize: theme.fonts.sizes.lg, fontWeight: '800', color: theme.colors.text },
  description: { fontSize: theme.fonts.sizes.md, color: theme.colors.muted, lineHeight: 22 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: theme.colors.brandSoft, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: theme.radii.full 
  },
  chipText: { fontSize: theme.fonts.sizes.sm, fontWeight: '700', color: theme.colors.brand },
  bookButton: { 
    margin: theme.spacing.md, 
    backgroundColor: theme.colors.brand, 
    padding: theme.spacing.md, 
    borderRadius: theme.radii.lg, 
    alignItems: 'center' 
  },
  bookButtonText: { color: '#fff', fontWeight: '800', fontSize: theme.fonts.sizes.md },
}));
