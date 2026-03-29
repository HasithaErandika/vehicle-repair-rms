import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

const BRAND   = '#FF7300';
const WHITE   = '#FFFFFF';
const BG      = '#F4F5F7';
const CARD    = '#FFFFFF';
const TEXT    = '#111827';
const MUTED   = '#6B7280';
const BORDER  = '#E5E7EB';

export default function GarageDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock data for the specific garage
  const garage = {
    id: id,
    name: 'AutoCare Garage Colombo',
    rating: '4.8',
    reviews: '124',
    address: '123 Main St, Colombo 03',
    description: 'AutoCare Garage is a premier vehicle repair center in Colombo, specializing in hybrid systems, engine diagnostics, and routine maintenance for all major brands.',
    phone: '+94 11 234 5678',
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    services: [
      { id: 's1', name: 'Full Service & Inspection', price: 'Rs. 15,000' },
      { id: 's2', name: 'Oil & Filter Change', price: 'Rs. 8,500' },
      { id: 's3', name: 'A/C Diagnostic & Top-up', price: 'Rs. 5,000' },
      { id: 's4', name: 'Brake Pad Replacement', price: 'Rs. 12,000' },
    ]
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* HERO / IMAGE PLACEHOLDER */}
        <View style={styles.hero}>
          <View style={styles.heroPlaceholder}>
            <Ionicons name="business" size={60} color="rgba(255,255,255,0.3)" />
          </View>
          
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color={WHITE} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{garage.name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.statText}>{garage.rating} ({garage.reviews} Reviews)</Text>
              </View>
              <View style={styles.statSep} />
              <View style={styles.stat}>
                <Ionicons name="location-sharp" size={14} color={MUTED} />
                <Text style={styles.statText}>Colombo 03</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{garage.description}</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Ionicons name="phone-portrait" size={18} color={BRAND} />
              <View>
                <Text style={styles.infoLabel}>Call</Text>
                <Text style={styles.infoValue}>{garage.phone}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="time" size={18} color={BRAND} />
              <View>
                <Text style={styles.infoLabel}>Hours</Text>
                <Text style={styles.infoValue}>{garage.hours}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services & Pricing</Text>
            <View style={styles.servicesList}>
              {garage.services.map(service => (
                <View key={service.id} style={styles.serviceItem}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>{service.price}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER ACTION */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.bookBtn} 
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: '/tabs/explore/booking', params: { garageId: id, garageName: garage.name } })}
        >
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WHITE },
  scroll: { paddingBottom: 100 },

  hero: { height: 220, backgroundColor: BRAND },
  heroPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: { padding: 24, marginTop: -20, backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  
  headerInfo: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '900', color: TEXT, marginBottom: 12, letterSpacing: -0.5 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, fontWeight: '600', color: MUTED },
  statSep: { width: 4, height: 4, borderRadius: 2, backgroundColor: BORDER },

  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: TEXT, marginBottom: 12 },
  description: { fontSize: 15, color: MUTED, lineHeight: 22, fontWeight: '500' },

  infoGrid: { flexDirection: 'row', gap: 12, marginTop: 24 },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  infoLabel: { fontSize: 12, color: MUTED, fontWeight: '600' },
  infoValue: { fontSize: 13, color: TEXT, fontWeight: '700', marginTop: 2 },

  servicesList: { gap: 12 },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  serviceName: { fontSize: 14, fontWeight: '600', color: TEXT },
  servicePrice: { fontSize: 14, fontWeight: '800', color: BRAND },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  bookBtn: {
    backgroundColor: BRAND,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnText: { color: WHITE, fontSize: 16, fontWeight: '800' },
});
