import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';

export default function ToastProfile({ visible }) {
  if (!visible) return null;

  return (
    <View style={styles.toastContainer}>
      <View style={styles.iconContainer}>
        <Icon name="check" size={12} color="white" />
      </View>
      <Text style={styles.toastText}>User is added your phone!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'white',
    left: 16,
    right: 16,
    bottom: 32,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
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
    fontSize: 18,
  },
});
