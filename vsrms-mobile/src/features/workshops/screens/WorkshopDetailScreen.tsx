import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Platform,
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
import { useCreateReview } from '@/features/reviews/queries/mutations';
import { useAuth } from '@/hooks';
import { RatingStars } from '../components/RatingStars';
import { ReviewCard } from '@/features/reviews/components/ReviewCard';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';

export function WorkshopDetailScreen({ id: propId }: { id?: string }) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = propId || params.id;
  const router = useRouter();
  const { theme } = useUnistyles();
  const { user } = useAuth();

  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const { data: workshop, isLoading, isError, refetch } = useWorkshop(id!);
  const { data: reviews } = useWorkshopReviews(id ?? '');
  const { mutate: submitReview, isPending: submittingReview } = useCreateReview();

  const handleSubmitReview = () => {
    if (!reviewRating || !id) return;
    submitReview(
      { workshopId: id, rating: reviewRating, reviewText: reviewText.trim() || undefined },
      {
        onSuccess: () => {
          setReviewModalVisible(false);
          setReviewRating(0);
          setReviewText('');
        },
      },
    );
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
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

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
                  <ReviewCard key={r._id || i} review={r} />
                ))}
                {reviews.length > 3 && (
                  <Text style={styles.moreReviews}>+{reviews.length - 3} more reviews</Text>
                )}
              </>
            ) : (
              <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* STICKY BOOK BUTTON */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push(`/customer/schedule/book?workshopId=${workshop._id ?? workshop.id}` as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* WRITE REVIEW MODAL */}
      <Modal visible={reviewModalVisible} animationType="slide" transparent>
        <View style={styles.reviewModalBg}>
          <View style={styles.reviewModalContent}>
            <View style={styles.reviewModalHandle} />
            <View style={styles.reviewModalHeader}>
              <View>
                <Text style={styles.reviewModalTitle}>Write a Review</Text>
                <Text style={styles.reviewModalSub}>{workshop.name}</Text>
              </View>
              <TouchableOpacity onPress={() => { setReviewModalVisible(false); setReviewRating(0); setReviewText(''); }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Star picker */}
            <View style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity key={i} onPress={() => setReviewRating(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons
                    name={i <= reviewRating ? 'star' : 'star-outline'}
                    size={36}
                    color={i <= reviewRating ? '#F59E0B' : '#D1D5DB'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.starLabel}>
              {reviewRating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
            </Text>

            <View style={styles.reviewInputGroup}>
              <Text style={styles.reviewInputLabel}>Your Review (optional)</Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience..."
                placeholderTextColor="#9CA3AF"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.reviewSubmitBtn, (reviewRating === 0 || submittingReview) && { opacity: 0.5 }]}
              onPress={handleSubmitReview}
              disabled={reviewRating === 0 || submittingReview}
            >
              {submittingReview
                ? <ActivityIndicator color="#FFF" />
                : <><Ionicons name="send-outline" size={18} color="#FFF" /><Text style={styles.reviewSubmitBtnText}>Submit Review</Text></>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  noReviewsText: { fontSize: 13, color: theme.colors.muted, fontWeight: '500', fontStyle: 'italic', textAlign: 'center', paddingVertical: 16 },
  writeReviewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: theme.colors.brandSoft, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
  },
  writeReviewBtnText: { fontSize: 12, fontWeight: '700', color: theme.colors.brand },

  reviewModalBg: { flex: 1, backgroundColor: 'rgba(26,26,46,0.7)', justifyContent: 'flex-end' },
  reviewModalContent: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingTop: 12,
  },
  reviewModalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 20 },
  reviewModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  reviewModalTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.text },
  reviewModalSub: { fontSize: 13, color: theme.colors.muted, marginTop: 3, fontWeight: '500' },
  starPicker: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 8 },
  starLabel: { fontSize: 14, fontWeight: '700', color: theme.colors.muted, textAlign: 'center', marginBottom: 20 },
  reviewInputGroup: { marginBottom: 20 },
  reviewInputLabel: { fontSize: 11, fontWeight: '800', color: theme.colors.muted, textTransform: 'uppercase', marginBottom: 8, marginLeft: 2 },
  reviewInput: {
    backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14,
    fontSize: 15, color: theme.colors.text, minHeight: 100,
    borderWidth: 1.5, borderColor: theme.colors.border,
  },
  reviewSubmitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: theme.colors.brand, borderRadius: 16, height: 56,
    marginBottom: 8,
    shadowColor: theme.colors.brand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  reviewSubmitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: theme.colors.surface, paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: theme.radii.full, borderWidth: 1, borderColor: theme.colors.border,
  },
  serviceChipText: { fontSize: 13, fontWeight: '600', color: theme.colors.text },

  stickyFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 1, borderTopColor: theme.colors.border,
  },
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: theme.colors.brand, borderRadius: 16, height: 56,
    shadowColor: theme.colors.brand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  bookBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
}));
