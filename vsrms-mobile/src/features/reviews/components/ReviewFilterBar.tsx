import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUnistyles } from 'react-native-unistyles';

export type ReviewSortOption = 'newest' | 'highest' | 'lowest';

interface ReviewFilterBarProps {
  activeSort: ReviewSortOption;
  onSortChange: (sort: ReviewSortOption) => void;
  total?: number;
}

export function ReviewFilterBar({ activeSort, onSortChange, total }: ReviewFilterBarProps) {
  const { theme } = useUnistyles();

  const options: { label: string; value: ReviewSortOption; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Newest', value: 'newest', icon: 'time-outline' },
    { label: 'Top Rated', value: 'highest', icon: 'trending-up-outline' },
    { label: 'Lowest Rated', value: 'lowest', icon: 'trending-down-outline' },
  ];

  return (
    <View style={styles.container}>
      {total !== undefined && (
        <View style={styles.header}>
          <Text style={[styles.totalText, { color: theme.colors.text }]}>
            {total} Review{total !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const isActive = activeSort === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSortChange(option.value)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                { 
                  backgroundColor: isActive ? theme.colors.brand : theme.colors.surface,
                  borderColor: isActive ? theme.colors.brand : theme.colors.border,
                }
              ]}
            >
              <Ionicons 
                name={option.icon} 
                size={14} 
                color={isActive ? '#FFFFFF' : theme.colors.muted} 
              />
              <Text 
                style={[
                  styles.chipLabel, 
                  { color: isActive ? '#FFFFFF' : theme.colors.text }
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1.5,
    gap: 6,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
