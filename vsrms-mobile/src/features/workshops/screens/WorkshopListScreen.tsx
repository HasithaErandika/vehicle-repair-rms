import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useWorkshops } from '../queries/queries';
import { WorkshopCard } from '../components/WorkshopCard';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleSkeleton } from '@/components/feedback/Skeleton';
import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Workshop } from '../types/workshops.types';
import { Ionicons } from '@expo/vector-icons';

export function WorkshopListScreen() {
  const { data, isLoading, isError, refetch } = useWorkshops();
  const [activeCategory, setActiveCategory] = useState('All');

  if (isLoading) return <VehicleSkeleton />;       
  if (isError)   return <ErrorScreen onRetry={refetch} />;

  const categories = [
    { name: 'All', icon: 'grid-outline' },
    { name: 'Service', icon: 'build-outline' },
    { name: 'Body Shop', icon: 'hammer-outline' },
    { name: 'Tires', icon: 'disc-outline' },
  ];

  return (
    <ScreenWrapper bg="#F9FAFB">
      <View style={styles.header}>
        <Text style={styles.title}>Find Garages</Text>
        
        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search by name or service..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* CATEGORIES */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.name} 
              onPress={() => setActiveCategory(cat.name)}
              style={[
                styles.categoryChip, 
                activeCategory === cat.name && styles.categoryChipActive
              ]}
            >
              <Ionicons 
                name={cat.icon as any} 
                size={18} 
                color={activeCategory === cat.name ? '#FFFFFF' : '#F56E0F'} 
              />
              <Text style={[
                styles.categoryText, 
                activeCategory === cat.name && styles.categoryTextActive
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.subtitle}>Nearby Garages</Text>
        <TouchableOpacity>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlashList<Workshop>                               
        data={data || []}
        renderItem={({ item }) => <WorkshopCard workshop={item} />}
        estimatedItemSize={140}                 
        keyExtractor={(w) => w._id || w.id!}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No workshops found near you." />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: { paddingHorizontal: 24, paddingTop: 40, backgroundColor: '#FFFFFF', paddingBottom: 24 },
  title: { fontSize: 26, fontWeight: '900', color: '#1A1A2E', marginBottom: 20 },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    marginBottom: 24
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1A1A2E', fontWeight: '600' },
  
  categoryScroll: { marginHorizontal: -24 },
  categoryContent: { paddingHorizontal: 24, gap: 12 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    gap: 8
  },
  categoryChipActive: { backgroundColor: '#F56E0F', borderColor: '#F56E0F' },
  categoryText: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  categoryTextActive: { color: '#FFFFFF' },

  listHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 24, 
    paddingBottom: 16 
  },
  subtitle: { fontSize: 18, fontWeight: '900', color: '#1A1A2E' },
  filterText: { fontSize: 14, fontWeight: '800', color: '#F56E0F' },

  list: { paddingHorizontal: 24, paddingBottom: 100 },
}));
