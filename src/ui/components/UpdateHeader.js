import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function UpdateHeader({ isValid, onCancel, onSave }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onCancel}>
        <Text style={styles.headerCancel}>Cancel</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Edit Contact</Text>

      <TouchableOpacity
        disabled={!isValid}
        onPress={isValid ? onSave : undefined}
      >
        <Text
          style={isValid ? styles.headerDoneActive : styles.headerDoneDisabled}
        >
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerCancel: {
    color: '#007AFF',
    fontSize: 17,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.02,
  },
  headerDoneDisabled: {
    color: '#A7A7A7',
    fontSize: 17,
  },
  headerDoneActive: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
