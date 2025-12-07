import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome as Icon } from '@react-native-vector-icons/fontawesome';

export default function Toast({ visible, message }) {
  if (!visible) return null;

  return (
    <View style={styles.toastContainer}>
      <View style={styles.iconContainer}>
        <Icon name="check" size={12} color="white" />
      </View>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 5,
    zIndex: 1000,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  toastText: {
    color: 'green',
    fontSize: 14,
    fontWeight: '500',
  },
});
