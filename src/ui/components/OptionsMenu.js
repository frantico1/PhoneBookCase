import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';

export default function OptionsMenu({ visible, onEdit, onDelete }) {
  if (!visible) return null;

  return (
    <View style={styles.optionsMenu}>
      <TouchableOpacity style={styles.optionItem} onPress={onEdit}>
        <Icon name="pencil" size={16} color="#111827" />
        <Text style={styles.optionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionItem} onPress={onDelete}>
        <Icon name="trash" size={16} color="#DC2626" />
        <Text style={[styles.optionText, styles.optionDeleteText]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  optionsMenu: {
    position: 'absolute',
    top: 52,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 170,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#111827',
  },
  optionDeleteText: {
    color: '#DC2626',
  },
});
