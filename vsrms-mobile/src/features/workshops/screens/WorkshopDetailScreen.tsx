import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StatusBar,
  Modal, TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapUtils } from '../../../utils/MapUtils';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useWorkshop } from '../queries/queries';
import { useWorkshopReviews } from '@/features/reviews/queries/queries';
import { useCreateReview, useUpdateReview, useDeleteReview } from '@/features/reviews/queries/mutations';
import { Review } from '@/features/reviews/types/reviews.types';
import { useAuth } from '@/hooks';
import { RatingStars } from '../components/RatingStars';
import { ReviewCard } from '@/features/reviews/components/ReviewCard';
import { ReviewFormModal } from '@/features/reviews/components/ReviewFormModal';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';

export function WorkshopDetailScreen({ id: propId }: { id?: string }) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = propId || params.id;
  const router = useRouter();
  const { theme } = useUnistyles();
  const { user } = useAuth();

  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const { data: workshop, isLoading, isError, refetch } = useWorkshop(id!);
  const { data: reviews } = useWorkshopReviews(id ?? '');
  const { mutate: createReview, isPending: creatingReview } = useCreateReview();
  const { mutate: updateReview, isPending: updatingReview } = useUpdateReview();
  const { mutate: deleteReview } = useDeleteReview();

  const submittingReview = creatingReview || updatingReview;

  const handleSubmitReview = (rating: number, text: string) => {
    if (!rating || !id) return;

    if (editingReview) {
      updateReview(
        { id: editingReview.id, payload: { rating, reviewText: text.trim() || undefined } },
        {
          onSuccess: () => {
            setReviewModalVisible(false);
            setEditingReview(null);
          },
        }
      );
    } else {
      createReview(
        { workshopId: id, rating, reviewText: text.trim() || undefined },
        {
          onSuccess: () => {
            setReviewModalVisible(false);
          },
        },
      );
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewModalVisible(true);
  };

  const handleDeleteReview = (review: Review) => {
    if (!review.id) return;
    deleteReview(review.id);
  };

  if (isLoading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={theme.colors.brand} />
    </View>
  );
  if (isError) return <ErrorScreen onRetry={refetch} />;
  if (!workshop) return (
    <View style={styles.centered}>
      <Text style={{ color: theme.colors.muted }}>Workshop not found.</Text>
    </View>
  );

  return (
    <ScreenWrapper bg="#FFFFFF">
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* HERO IMAGE */}
        {workshop.imageUrl
          ? <Image source={{ uri: workshop.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons name="business" size={56} color="#D1D5DB" />
            </View>
          )
        }

        {/* BACK BUTTON overlay */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#1A1A2E" />
        </TouchableOpacity>

        <View style={styles.body}>
          {/* NAME + RATING */}
          <Text style={styles.name}>{workshop.name}</Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={workshop.averageRating ?? 0} size={16} />
            <Text style={styles.ratingText}>
              {(workshop.averageRating ?? 0).toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>
              ({workshop.totalReviews ?? 0} review{workshop.totalReviews !== 1 ? 's' : ''})
            </Text>
          </View>

          {/* INFO CHIPS */}
          <View style={styles.infoGrid}>
            <View style={styles.infoChip}>
              <Ionicons name="location-outline" size={15} color={theme.colors.brand} />
              <Text style={styles.infoChipText}>{workshop.district}</Text>
            </View>
            {workshop.contactNumber ? (
              <View style={styles.infoChip}>
                <Ionicons name="call-outline" size={15} color={theme.colors.brand} />
                <Text style={styles.infoChipText}>{workshop.contactNumber}</Text>
              </View>
            ) : null}
          </View>

          {/* ADDRESS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Address</Text>
              <TouchableOpacity
                onPress={() => MapUtils.openMapDirections(
                  workshop.location.coordinates[1],
                  workshop.location.coordinates[0],
                  workshop.name
                )}
                style={styles.directionsLink}
              >
                <Ionicons name="navigate-circle" size={18} color={theme.colors.brand} />
                <Text style={styles.directionsLinkText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.addressBox}>
              <Ionicons name="map-outline" size={16} color={theme.colors.muted} />
              <Text style={styles.sectionText}>{workshop.address}</Text>
            </View>
          </View>

          {/* MAP PREVIEW */}
          <View style={styles.mapContainer}>
            <MapView
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.detailMap}
              region={{
                latitude: workshop.location.coordinates[1],
                longitude: workshop.location.coordinates[0],
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: workshop.location.coordinates[1],
                  longitude: workshop.location.coordinates[0],
                }}
              />
            </MapView>
          </View>

          {/* DESCRIPTION */}
          {workshop.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.sectionText}>{workshop.description}</Text>
            </View>
          ) : null}

          {/* SERVICES OFFERED */}
          {(workshop.servicesOffered?.length ?? 0) > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Services Offered</Text>
              <View style={styles.chipWrap}>
                {workshop.servicesOffered!.map(s => (
                  <View key={s} style={styles.serviceChip}>
                    <Ionicons name="checkmark-circle-outline" size={14} color={theme.colors.brand} />
                    <Text style={styles.serviceChipText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* REVIEWS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              {user?.role === 'customer' && (
                <TouchableOpacity style={styles.writeReviewBtn} onPress={() => setReviewModalVisible(true)}>
                  <Ionicons name="create-outline" size={14} color={theme.colors.brand} />
                  <Text style={styles.writeReviewBtnText}>Write Review</Text>
                </TouchableOpacity>
              )}
            </View>
            {reviews && reviews.length > 0 ? (
              <>
                {reviews.slice(0, 3).map((r, i) => (
                  <ReviewCard
                    key={r.id || (r as any)._id || i}
                    review={r}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                  />
                ))}
                {reviews.length > 0 && (
                  <TouchableOpacity
                    onPress={() => router.push(`/customer/workshops/reviews?workshopId=${id}&name=${workshop.name}` as any)}
                  >
                    <Text style={styles.moreReviews}>
                      {reviews.length > 3 ? `View all ${reviews.length} reviews` : 'View all reviews'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
            )}
          </View>
          {/* BOOK BUTTON AT BOTTOM */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => router.push(`/customer/schedule/book?workshopId=${workshop._id ?? workshop.id}` as any)}
              activeOpacity={0.85}
            >
              <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              <Text style={styles.bookBtnText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ReviewFormModal
        visible={reviewModalVisible}
        onClose={() => { setReviewModalVisible(false); setEditingReview(null); }}
        onSubmit={(rating, text) => handleSubmitReview(rating, text)}
        isSubmitting={submittingReview}
        initialData={editingReview}
        workshopName={workshop.name}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  heroImage: { width: '100%', height: 240 },
  heroPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },

  backBtn: {
    position: 'absolute', top: 52, left: 20,
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },

  body: { padding: 24 },

  name: { fontSize: 26, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, marginBottom: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  ratingText: { fontSize: 14, fontWeight: '800', color: theme.colors.text },
  reviewCount: { fontSize: 13, color: theme.colors.muted, fontWeight: '500' },

  infoGrid: { flexDirection: 'row', gap: 10, marginBottom: 24, flexWrap: 'wrap' },
  infoChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: theme.colors.brandSoft, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: theme.radii.full,
  },
  infoChipText: { fontSize: 13, fontWeight: '700', color: theme.colors.brand },

  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  directionsLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  directionsLinkText: { fontSize: 13, fontWeight: '700', color: theme.colors.brand },
  addressBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: theme.colors.surface, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  sectionText: { flex: 1, fontSize: 14, color: theme.colors.muted, lineHeight: 22 },
  mapContainer: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailMap: { ...StyleSheet.absoluteFillObject },
  moreReviews: { fontSize: 13, color: theme.colors.brand, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  noReviewsText: { fontSize: 13, color: theme.colors.muted, fontStyle: 'italic', paddingVertical: 10, marginBottom: 20 },
  writeReviewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: theme.colors.brandSoft, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
  },
  writeReviewBtnText: { fontSize: 12, fontWeight: '700', color: theme.colors.brand },

  reviewSubmitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: theme.colors.surface, paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: theme.radii.full, borderWidth: 1, borderColor: theme.colors.border,
  },
  serviceChipText: { fontSize: 13, fontWeight: '600', color: theme.colors.text },

  buttonSection: { marginTop: 10, marginBottom: 20, paddingHorizontal: 20 },
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: theme.colors.brand, borderRadius: 16, height: 58,
  },
  bookBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
}));
