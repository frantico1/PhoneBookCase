import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FontAwesome as Icon } from '@react-native-vector-icons/fontawesome';

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.searchWrapper}>
      <View style={styles.searchInputContainer}>
        <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    borderColor: '#CED0D4',
    letterSpacing: 0.2,
  },
});
