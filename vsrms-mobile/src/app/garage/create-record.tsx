import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

export default function CreateRecordScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const [loading, setLoading] = useState(false);

  return (
    <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Service Record</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionDesc}>Enter details of the services performed on the vehicle.</Text>

          {/* CUSTOMER SEARCH */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Vehicle / License Plate</Text>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={theme.colors.muted} />
              <TextInput 
                style={styles.input} 
                placeholder="e.g. CBA-1234" 
                placeholderTextColor={theme.colors.muted} 
              />
            </View>
          </View>

          {/* SERVICE TYPE */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Service Type</Text>
            <TextInput 
              style={styles.inputStd} 
              placeholder="e.g. Full Service, Brake Pad Change" 
              placeholderTextColor={theme.colors.muted} 
            />
          </View>

          {/* MILEAGE */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Current Mileage (km)</Text>
            <TextInput 
              style={styles.inputStd} 
              keyboardType="numeric" 
              placeholder="45200" 
              placeholderTextColor={theme.colors.muted} 
            />
          </View>

          {/* NOTES */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Technician Notes</Text>
            <TextInput 
              style={[styles.inputStd, styles.textArea]} 
              multiline 
              numberOfLines={4} 
              placeholder="List parts replaced and any observations..." 
              placeholderTextColor={theme.colors.muted} 
            />
          </View>

          {/* COST */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Total Labor & Parts Cost (LKR)</Text>
            <TextInput 
              style={styles.inputStd} 
              keyboardType="numeric" 
              placeholder="15000" 
              placeholderTextColor={theme.colors.muted} 
            />
          </View>

          <TouchableOpacity 
            style={styles.submitBtn} 
            activeOpacity={0.8}
            onPress={() => {
              setLoading(true);
              setTimeout(() => {
                router.back();
              }, 1000);
            }}
          >
            <Text style={styles.submitBtnText}>{loading ? 'Saving...' : 'Finalize & Save Record'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  backBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    alignItems: 'center', justifyContent: 'center', 
    backgroundColor: theme.colors.background 
  },

  scroll: { padding: theme.spacing.lg, paddingBottom: 60 },
  sectionDesc: { fontSize: 14, color: theme.colors.muted, marginBottom: 24, fontWeight: '500' },

  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
  
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: theme.colors.border 
  },
  input: { flex: 1, fontSize: 15, color: theme.colors.text, fontWeight: '600' },
  inputStd: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '600' 
  },
  textArea: { height: 120, paddingTop: 16, textAlignVertical: 'top' },

  submitBtn: {
    backgroundColor: theme.colors.brand,
    borderRadius: theme.radii.md,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: theme.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4 
  },
  submitBtnText: { color: theme.colors.surface, fontSize: 16, fontWeight: '800' }
}));
