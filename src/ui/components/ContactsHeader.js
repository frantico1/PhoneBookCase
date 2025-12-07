import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ContactsHeader({ onAddPress }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Contacts</Text>

      <TouchableOpacity style={styles.headerAddContainer} onPress={onAddPress}>
        <Text style={styles.headerAdd}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  headerAddContainer: {
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAdd: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
