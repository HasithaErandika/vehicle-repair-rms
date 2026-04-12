import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';

interface AvatarMenuProps {
  initials: string;
  onSettings: () => void;
  onSignOut: () => void;
}

export function AvatarMenu({ initials, onSettings, onSignOut }: AvatarMenuProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.avatar} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Text style={styles.avatarText}>{initials}</Text>
        <View style={styles.chevron}>
          <Ionicons name="chevron-down" size={9} color="#F56E0F" />
        </View>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.menuWrapper}>
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => { setVisible(false); onSettings(); }}
              >
                <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="settings-outline" size={16} color="#3B82F6" />
                </View>
                <Text style={styles.menuText}>Settings</Text>
                <Ionicons name="chevron-forward" size={14} color="#D1D5DB" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => { setVisible(false); onSignOut(); }}
              >
                <View style={[styles.menuIconBox, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="log-out-outline" size={16} color="#EF4444" />
                </View>
                <Text style={[styles.menuText, { color: '#EF4444' }]}>Sign Out</Text>
                <Ionicons name="chevron-forward" size={14} color="#D1D5DB" />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create(() => ({
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: 'rgba(245,110,15,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F56E0F',
  },
  avatarText: { fontSize: 15, fontWeight: '900', color: '#F56E0F' },
  chevron: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#F56E0F',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: 20,
  },
  menuWrapper: {},
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  menuDivider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 16 },
}));
