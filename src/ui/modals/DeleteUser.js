import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DeleteUser = ({ visible, onClose, onConfirm, id }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Delete Contact</Text>
          <Text style={styles.subtitle}>
            Are you sure want to delete this contact?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.noButton} onPress={onClose}>
              <Text style={styles.noText}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.yesButton}
              onPress={() => onConfirm(id)}
            >
              <Text style={styles.yesText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  noButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 19,
    borderRadius: 15,
    alignItems: 'center',
  },
  noText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  yesButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#000',
    paddingVertical: 19,
    borderRadius: 15,
    alignItems: 'center',
  },
  yesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteUser;
