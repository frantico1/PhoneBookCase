import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function EmptyState({ onCreatePress }) {
  return (
    <View style={styles.emptyCenter}>
      <Image
        source={require('../../assets/icons/person-icon.png')}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No Contacts</Text>
      <Text style={styles.emptySubtitle}>
        Contacts you've added will appear here.
      </Text>

      <TouchableOpacity onPress={onCreatePress}>
        <Text style={styles.emptyCreate}>Create New Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCenter: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '20%',
  },
  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 100,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: 0.2,
  },
  emptyCreate: {
    fontSize: 16,
    color: '#0075FF',
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.2,
  },
});
