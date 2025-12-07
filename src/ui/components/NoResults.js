import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome as Icon } from '@react-native-vector-icons/fontawesome';

export default function NoResults() {
  return (
    <View style={styles.noResultsContainer}>
      <Icon name="search" size={55} color="#000" style={{ opacity: 0.3 }} />
      <Text style={styles.noResultsTitle}>No Results</Text>
      <Text style={styles.noResultsSubtitle}>
        The user you are looking for could not be found.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 12,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
