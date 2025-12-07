import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function ProfileImageSection({ profileImage, onChangePhoto }) {
  return (
    <>
      <View style={styles.imageWrapper}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../../assets/icons/person-icon.png')
          }
          style={styles.profileImage}
        />
      </View>
      <TouchableOpacity onPress={onChangePhoto}>
        <Text style={styles.addPhotoText}>Change Photo</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  addPhotoText: {
    color: '#0075FF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '400',
  },
});
