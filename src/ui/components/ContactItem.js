import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { FontAwesome as Icon } from '@react-native-vector-icons/fontawesome';

export default function ContactItem({ item, onPress, onEdit, onDelete }) {
  const initials = `${item.firstName?.[0] ?? ''}${
    item.lastName?.[0] ?? ''
  }`.toUpperCase();

  const renderRightActions = () => (
    <View style={styles.rowActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => onEdit(item)}
      >
        <Icon name="pencil" size={16} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => onDelete(item)}
      >
        <Icon name="trash" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
        <View style={styles.avatar}>
          {item.profileImageUrl ? (
            <Image
              source={{ uri: item.profileImageUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.phone}>{item.phoneNumber}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 1,
    alignItems: 'center',
    elevation: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  phone: { fontSize: 14, color: '#555' },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  actionButton: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4DA3FF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});
