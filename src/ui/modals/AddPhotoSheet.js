import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AddPhotoSheet = ({ visible, onClose, onPressCamera, onPressGallery }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>Add Photo</Text>

          <TouchableOpacity style={styles.sheetButton} onPress={onPressCamera}>
            <Text style={styles.sheetButtonText}>📷 Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetButton} onPress={onPressGallery}>
            <Text style={styles.sheetButtonText}>🖼️ Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetCancelButton} onPress={onClose}>
            <Text style={styles.sheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 12,
  },
  sheetButton: {
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetButtonText: {
    fontSize: 16,
    color: '#111111',
  },
  sheetCancelButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  sheetCancelText: {
    fontSize: 17,
    color: '#007AFF',
  },
});

export default AddPhotoSheet;
