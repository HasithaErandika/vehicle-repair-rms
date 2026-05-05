import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface AvatarMenuProps {
  initials: string;
  onSettings: () => void;
  onSignOut: () => void;
}

export function AvatarMenu({ initials, onSettings, onSignOut }: AvatarMenuProps) {
  const [visible, setVisible] = useState(false);
  const { theme } = useUnistyles();

  return (
    <>
      <TouchableOpacity 
        style={styles.avatar} 
        onPress={() => setVisible(true)} 
        activeOpacity={0.8}
      >
        <Text style={styles.avatarText}>{initials}</Text>
        <View style={styles.badge}>
          <Ionicons name="chevron-down" size={8} color={theme.colors.white} />
        </View>
      </TouchableOpacity>

      <Modal 
        visible={visible} 
        transparent 
        animationType="fade" 
        statusBarTranslucent
      >
        <Pressable 
          style={styles.backdrop} 
          onPress={() => setVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <View style={styles.headerAvatar}>
                <Text style={styles.headerAvatarText}>{initials}</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Account</Text>
                <Text style={styles.headerSub}>Manage your profile</Text>
              </View>
            </View>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => { setVisible(false); onSettings(); }}
            >
              <View style={[styles.iconBox, { backgroundColor: theme.colors.infoBackground }]}>
                <Ionicons name="settings-sharp" size={16} color={theme.colors.infoText} />
              </View>
              <Text style={styles.menuText}>Settings</Text>
              <Ionicons name="chevron-forward" size={14} color={theme.colors.mutedLight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => { setVisible(false); onSignOut(); }}
            >
              <View style={[styles.iconBox, { backgroundColor: theme.colors.errorBackground }]}>
                <Ionicons name="log-out-sharp" size={16} color={theme.colors.error} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.error }]}>Sign Out</Text>
              <Ionicons name="chevron-forward" size={14} color={theme.colors.mutedLight} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.brand,
    position: 'relative',
  },
  avatarText: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: theme.colors.brand,
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: theme.colors.brand,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.text, // Using text color for border as it's dark
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.6)', // Glass effect backdrop
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    width: 220,
    padding: 8,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 24,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingBottom: 16,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.warningBackground, // Soft orange background
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.brand,
  },
  headerAvatarText: {
    color: theme.colors.brand,
    fontWeight: '900',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
  },
  headerSub: {
    fontSize: 11,
    color: theme.colors.mutedLight,
    fontWeight: '600',
    marginTop: 1,
  },
  menuDivider: {
    height: 1.5,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textDim,
  },
}));
