import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ReviewActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ReviewActionSheet({
  visible,
  onClose,
  onEdit,
  onDelete,
}: ReviewActionSheetProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={StyleSheet.absoluteFill} entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </BlurView>
      </Animated.View>
      <View style={styles.backdrop}>
        <Animated.View 
          style={[
            styles.sheetContainer, 
            { 
              backgroundColor: theme.colors.surface,
              paddingBottom: Math.max(insets.bottom, 24)
            }
          ]}
          entering={FadeInDown.springify().damping(20).stiffness(200).mass(0.8)}
          exiting={FadeOutDown.duration(200)}
        >
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Review Options</Text>
            <Text style={[styles.headerSub, { color: theme.colors.muted }]}>What would you like to do?</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => {
              onClose();
              onEdit();
            }}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.colors.brandSoft }]}>
              <Ionicons name="create-outline" size={20} color={theme.colors.brand} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Edit Review</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => {
              onClose();
              onDelete();
            }}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete Review</Text>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: theme.colors.muted }]}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
