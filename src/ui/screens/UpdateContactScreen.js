import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AddPhotoSheet from '../modals/AddPhotoSheet';
import ProfileImageSection from '../components/ProfileImageSection';
import UpdateContactForm from '../components/UpdateContactForm';
import {
  createContact,
  updateContact,
  uploadImage,
} from '../../api/contactsApi';
import Contacts from 'react-native-contacts';

const normalizePhone = phone => (phone || '').replace(/\D/g, '');

const requestContactsPermission = async () => {
  try {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
    ]);

    const readGranted =
      result[PermissionsAndroid.PERMISSIONS.READ_CONTACTS] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const writeGranted =
      result[PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS] ===
      PermissionsAndroid.RESULTS.GRANTED;

    return readGranted && writeGranted;
  } catch (e) {
    console.log('İzin hatası:', e);
    return false;
  }
};

export default function UpdateContactScreen({ navigation, route }) {
  const editingContact = route?.params?.contact || null;
  const MAX_PHONE_LENGTH = 15;

  const [firstName, setFirstName] = useState(editingContact?.firstName || '');
  const [lastName, setLastName] = useState(editingContact?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(
    editingContact?.phoneNumber || '',
  );
  const [profileImage, setProfileImage] = useState(
    editingContact?.profileImageUrl || '',
  );
  const [isPhotoSheetVisible, setPhotoSheetVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = text => {
    const digitsOnly = text.replace(/\D/g, '');
    const limitedDigits = digitsOnly.slice(0, MAX_PHONE_LENGTH);
    setPhoneNumber(limitedDigits);
  };

  const rawPhoneDigits = phoneNumber.replace(/\D/g, '');
  const isValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    rawPhoneDigits.length >= 10;

  const handleImageResponse = response => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {

      let message = 'An error occurred while selecting the photo.';

      if (response.errorCode === 'camera_unavailable') {
        message = 'Camera is not available on this device or emulator.';
      } else if (response.errorCode === 'permission') {
        message = 'Camera or photo permission was denied. Please enable it in settings.';
      } else if (response.errorCode === 'others' && response.errorMessage) {
        message = response.errorMessage;
      }

      Alert.alert('Error', message);
      return;
    }

    const asset = response.assets && response.assets[0];
    if (asset?.uri) {
      setProfileImage(asset.uri);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (e) {
      return false;
    }
  };

  const handlePickFromCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      Alert.alert(
        'Permission required',
        'Camera permission is needed to take a photo.',
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
    };

    launchCamera(options, handleImageResponse);
  };

  const handlePickFromGallery = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const rawPhoneDigitsForPayload = phoneNumber.replace(/\D/g, '');

    let profileImageUrlToSend = editingContact?.profileImageUrl || '';

    try {
      if (
        profileImage &&
        (profileImage.startsWith('file:') ||
          profileImage.startsWith('content:'))
      ) {
        const formData = new FormData();
        formData.append('image', {
          uri: profileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });

        const uploadRes = await uploadImage(formData);

        profileImageUrlToSend =
          uploadRes?.data?.url ||
          uploadRes?.data?.imageUrl ||
          uploadRes?.data ||
          profileImageUrlToSend;
      } else if (profileImage && profileImage.startsWith('http')) {
        profileImageUrlToSend = profileImage;
      }

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: rawPhoneDigitsForPayload,
        profileImageUrl: profileImageUrlToSend,
      };

      const isEditingExisting = !!editingContact?.id;

      if (isEditingExisting) {
        await updateContact(editingContact.id, payload);
      } else {
        await createContact(payload);
      }

      if (isEditingExisting && editingContact?.phoneNumber) {
          const granted = await requestContactsPermission();
          if (granted) {
            const oldDigits = normalizePhone(editingContact.phoneNumber);
            if (oldDigits) {
              const matches = await Contacts.getContactsByPhoneNumber(
                oldDigits,
              );

              if (Array.isArray(matches) && matches.length > 0) {
                const contactToUpdate = { ...matches[0] };

                contactToUpdate.givenName = firstName.trim();
                contactToUpdate.familyName = lastName.trim();

                if (
                  Array.isArray(contactToUpdate.phoneNumbers) &&
                  contactToUpdate.phoneNumbers.length > 0
                ) {
                  contactToUpdate.phoneNumbers[0].number =
                    rawPhoneDigitsForPayload;
                } else {
                  contactToUpdate.phoneNumbers = [
                    { label: 'mobile', number: rawPhoneDigitsForPayload },
                  ];
                }

                try {
                  await Contacts.updateContact(contactToUpdate);
                } catch (updateErr) {
                }
              }
            }
          } else {
          }
        }

      setIsLoading(false);
      navigation.navigate('Contacts', { updated: true });
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'An error occurred while saving the contact.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerCancel}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Contact</Text>

        <TouchableOpacity
          disabled={!isValid}
          onPress={isValid ? handleSave : undefined}
        >
          <Text
            style={
              isValid ? styles.headerDoneActive : styles.headerDoneDisabled
            }
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <ProfileImageSection
        profileImage={profileImage}
        onChangePhoto={() => setPhotoSheetVisible(true)}
      />

      <UpdateContactForm
        firstName={firstName}
        lastName={lastName}
        phoneNumber={phoneNumber}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onPhoneChange={handlePhoneChange}
      />
      <AddPhotoSheet
        visible={isPhotoSheetVisible}
        onClose={() => setPhotoSheetVisible(false)}
        onPressCamera={() => {
          setPhotoSheetVisible(false);
          handlePickFromCamera();
        }}
        onPressGallery={() => {
          setPhotoSheetVisible(false);
          handlePickFromGallery();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: '#F2F2F7',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    letterSpacing: 0.2,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  placeholderImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 24,
  },
  saveText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  },
  addPhotoText: {
    color: '#0075FF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '400',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerCancel: {
    color: '#007AFF',
    fontSize: 17,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.02,
  },
  headerDoneDisabled: {
    color: '#A7A7A7',
    fontSize: 17,
  },
  headerDoneActive: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
