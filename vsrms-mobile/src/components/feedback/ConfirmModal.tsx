import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
  theme?: 'dark' | 'light';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  theme = 'light',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!visible) return null;

  const isLight = theme === 'light';

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut} 
          style={StyleSheet.absoluteFill}
        >
          <Pressable style={styles.backdrop} onPress={onCancel} />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.springify().damping(15)} 
          style={styles.modalWrapper}
        >
          <View style={[styles.modalContent, isLight && styles.modalContentLight]}>
            <View style={[
              styles.iconCircle, 
              { backgroundColor: type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 110, 15, 0.1)' }
            ]}>
              <Ionicons 
                name={type === 'danger' ? 'alert-circle-outline' : 'information-circle-outline'} 
                size={32} 
                color={type === 'danger' ? '#EF4444' : '#F56E0F'} 
              />
            </View>

            <Text style={[styles.title, isLight && styles.titleLight]}>{title}</Text>
            <Text style={[styles.message, isLight && styles.messageLight]}>{message}</Text>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.cancelBtn, isLight && styles.cancelBtnLight]} 
                onPress={onCancel} 
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelText, isLight && styles.cancelTextLight]}>{cancelText}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmBtn, { backgroundColor: type === 'danger' ? '#EF4444' : '#F56E0F' }]} 
                onPress={onConfirm} 
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalWrapper: {
    width: '100%',
    maxWidth: 340,
  },
  modalContent: {
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalContentLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  titleLight: {
    color: '#1A1A2E',
  },
  message: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  messageLight: {
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelBtnLight: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  cancelText: {
    color: '#D1D5DB',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelTextLight: {
    color: '#6B7280',
  },
  confirmBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
