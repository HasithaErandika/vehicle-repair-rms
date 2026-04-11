import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

export default function StaffRecordScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const [loading, setLoading] = useState(false);

  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');
  const [parts, setParts] = useState(false);

  const handleSubmit = () => {
    if (!mileage) {
      Alert.alert('Error', 'Please enter current mileage');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Service record created successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1500);
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Service Record Entry</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>Vehicle & Job Details</Text>
            
            <View style={styles.jobPreview}>
              <View style={styles.iconBox}>
                <Ionicons name="car-sport" size={24} color={theme.colors.brand} />
              </View>
              <View>
                <Text style={styles.jobVehicle}>Toyota Prius (CAA-9876)</Text>
                <Text style={styles.jobType}>Periodic Maintenance (100k km)</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Mileage (km)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. 100,245" 
                placeholderTextColor={theme.colors.muted}
                value={mileage}
                onChangeText={setMileage}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Technician Notes</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Describe work done, issues found..." 
                placeholderTextColor={theme.colors.muted}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Parts Replaced</Text>
                <Text style={styles.switchSub}>Oil filter, Air filter, Brake pads</Text>
              </View>
              <Switch 
                value={parts} 
                onValueChange={setParts}
                trackColor={{ false: theme.colors.border, true: theme.colors.brand }}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Submit Record'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.muted} />
            <Text style={styles.infoText}>
              Submitting this record will notify the vehicle owner and update the service history.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: { 
    padding: theme.spacing.md, 
    backgroundColor: theme.colors.surface, 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border 
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },

  scroll: { padding: theme.spacing.md, paddingBottom: 120 },
  formCard: { 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.radii.lg, 
    padding: theme.spacing.md, 
    borderWidth: 1, 
    borderColor: theme.colors.border 
  },
  sectionLabel: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: theme.colors.muted, 
    textTransform: 'uppercase', 
    marginBottom: 16 
  },
  
  jobPreview: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    backgroundColor: theme.colors.background, 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: theme.colors.border 
  },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 10, 
    backgroundColor: theme.colors.brandSoft, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  jobVehicle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 2 },
  jobType: { fontSize: 13, color: theme.colors.muted, fontWeight: '600' },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
  input: { 
    backgroundColor: theme.colors.background, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: theme.colors.border, 
    paddingHorizontal: 16, 
    height: 48, 
    fontSize: 15, 
    color: theme.colors.text 
  },
  textArea: { height: 100, paddingTop: 12, textAlignVertical: 'top' },

  switchRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 32 
  },
  switchLabel: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  switchSub: { fontSize: 12, color: theme.colors.muted, fontWeight: '500' },

  submitBtn: { 
    backgroundColor: theme.colors.brand, 
    height: 54, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: theme.colors.brand, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 6 
  },
  submitBtnText: { color: theme.colors.surface, fontSize: 16, fontWeight: '800' },

  infoBox: { 
    flexDirection: 'row', 
    gap: 12, 
    padding: 16, 
    backgroundColor: 'rgba(0,0,0,0.03)', 
    borderRadius: 12, 
    marginTop: 24, 
    alignItems: 'flex-start' 
  },
  infoText: { 
    flex: 1, 
    fontSize: 13, 
    color: theme.colors.muted, 
    lineHeight: 18, 
    fontWeight: '500' 
  }
}));
