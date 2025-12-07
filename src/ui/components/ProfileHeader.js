import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProfileHeader({ onMenuPress, onCancel }) {
  return (
    <View style={styles.topRow}>
      <TouchableOpacity onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <TouchableOpacity onPress={onMenuPress}>
        <Text style={styles.menuDots}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '400',
  },
  menuDots: {
    fontSize: 22,
    color: '#3C3C43',
    paddingHorizontal: 4,
  },
});
