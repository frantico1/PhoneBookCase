import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DeleteUser from '../modals/DeleteUser';
import {
  createContact,
  updateContact,
  deleteContact as deleteContactApi,
} from '../../api/contactsApi';
import Icon from '@react-native-vector-icons/fontawesome';
import Contacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import ContactInfoForm from '../components/ContactInfoForm';
import ProfileImageSection from '../components/ProfileImageSection';

export default function ProfileScreen({ navigation, route }) {
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
  const [toastVisible, setToastVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const [isAlreadySaved, setIsAlreadySaved] = useState(false);

  const requestContactsPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

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

      if (!readGranted || !writeGranted) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  };

  const normalizePhone = num =>
    (num || '').replace(/\D/g, '').replace(/^0+/, '').slice(-10);

  useEffect(() => {
    const checkIfAlreadySaved = async () => {
      if (!editingContact?.phoneNumber) {
        setIsAlreadySaved(false);
        return;
      }

      const granted = await requestContactsPermission();
      if (!granted) {
        setIsAlreadySaved(false);
        return;
      }

      try {
        const target = normalizePhone(editingContact.phoneNumber);
        if (!target) {
          setIsAlreadySaved(false);
          return;
        }

        const matches = await Contacts.getContactsByPhoneNumber(target);
        const exists = Array.isArray(matches) && matches.length > 0;
        setIsAlreadySaved(exists);
      } catch (e) {
        setIsAlreadySaved(false);
      }
    };

    checkIfAlreadySaved();
  }, [editingContact]);

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
      Alert.alert('Error', 'An error occurred while selecting the photo.');
      return;
    }

    const asset = response.assets && response.assets[0];
    if (asset?.uri) {
      setProfileImage(asset.uri);
    }
  };

  const handlePickFromCamera = () => {
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

  const convertImageToBase64 = async imageUrl => {
    try {
      if (!imageUrl) return null;

      if (imageUrl.startsWith('http')) {
        const destPath = `${
          RNFS.CachesDirectoryPath
        }/temp_contact_${Date.now()}.jpg`;

        await RNFS.downloadFile({
          fromUrl: imageUrl,
          toFile: destPath,
        }).promise;

        const base64 = await RNFS.readFile(destPath, 'base64');

        await RNFS.unlink(destPath).catch(() => {});

        return base64;
      }

      let filePath = imageUrl;

      if (imageUrl.startsWith('content://')) {
        const destPath = `${
          RNFS.CachesDirectoryPath
        }/temp_contact_${Date.now()}.jpg`;
        await RNFS.copyFile(imageUrl, destPath);
        filePath = destPath;
      } else if (imageUrl.startsWith('file://')) {
        filePath = imageUrl.replace('file://', '');
      }

      const base64 = await RNFS.readFile(filePath, 'base64');
      return base64;
    } catch (error) {
      return null;
    }
  };

  const handleEditPress = () => {
    setOptionsVisible(false);
    navigation.navigate('Update', {
      contact: editingContact,
      onContactUpdated: updatedContact => {
        if (updatedContact?.profileImageUrl) {
          setProfileImage(updatedContact.profileImageUrl);
        }

        if (updatedContact?.firstName) setFirstName(updatedContact.firstName);
        if (updatedContact?.lastName) setLastName(updatedContact.lastName);
        if (updatedContact?.phoneNumber)
          setPhoneNumber(updatedContact.phoneNumber);
      },
    });
  };

  const handleDeletePress = () => {
    if (!editingContact?.id) {
      Alert.alert('Cannot delete', 'This contact is not synced with server.');
      return;
    }

    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!editingContact?.id) {
      setDeleteModalVisible(false);
      return;
    }

    try {
      await deleteContactApi(editingContact.id);

      try {
        const granted = await requestContactsPermission();
        if (!granted) {
        } else {
          const targetPhoneDigits = normalizePhone(
            editingContact.phoneNumber || '',
          );

          if (targetPhoneDigits) {
            const matches = await Contacts.getContactsByPhoneNumber(
              targetPhoneDigits,
            );

            if (Array.isArray(matches) && matches.length > 0) {
              await Contacts.deleteContact(matches[0]);
            }
          }
        }
      } catch (contactError) {
      }

      setDeleteModalVisible(false);
      setOptionsVisible(false);
      navigation.goBack();
    } catch (error) {
      setDeleteModalVisible(false);
      Alert.alert('Error', 'An error occurred while deleting the contact.');
    }
  };

  const handleSave = async () => {
    const rawPhoneDigitsForPayload = phoneNumber.replace(/\D/g, '');

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: rawPhoneDigitsForPayload,
      profileImageUrl: editingContact?.profileImageUrl || '',
    };

    try {
      if (editingContact?.id) {
        await updateContact(editingContact.id, payload);
      } else {
        await createContact(payload);
      }

      try {
        if (!isAlreadySaved) {
          const granted = await requestContactsPermission();
          if (!granted) {
            console.log('Cihaz rehberine kaydetme atlandı: izin yok');
          } else {
            const thumbnailPhoto = await convertImageToBase64(profileImage);

            const deviceContact = {
              givenName: firstName.trim(),
              familyName: lastName.trim(),
              phoneNumbers: [
                {
                  label: 'mobile',
                  number: rawPhoneDigitsForPayload,
                },
              ],
            };

            if (thumbnailPhoto) {
              deviceContact.thumbnailPath = thumbnailPhoto;
            }

            await Contacts.addContact(deviceContact);
            setIsAlreadySaved(true);
          }
        }
      } catch (contactError) {
      }

      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 2000);
    } catch (error) {
      console.log('Kişi kaydedilirken hata:', error?.response?.data || error?.message || error);
      Alert.alert('Error', 'An error occurred while saving the contact.');
    }
  };

  return (
    <>
      <DeleteUser
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerCancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOptionsVisible(prev => !prev)}>
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        </View>
        {optionsVisible && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleEditPress}
            >
              <Icon name="pencil" size={16} color="#111827" />
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleDeletePress}
            >
              <Icon name="trash" size={16} color="#DC2626" />
              <Text style={[styles.optionText, styles.optionDeleteText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <ProfileImageSection
          profileImage={profileImage}
          onChangePhoto={handleEditPress}
        />
        <ContactInfoForm
          firstName={firstName}
          lastName={lastName}
          phoneNumber={phoneNumber}
        />
        <TouchableOpacity
          style={[
            styles.saveButton,
            isAlreadySaved && styles.saveButtonDisabled,
          ]}
          disabled={!isValid || isAlreadySaved}
          onPress={isValid ? handleSave : undefined}
        >
          <View style={styles.saveContent}>
            <Icon
              name="bookmark"
              size={20}
              color="#888"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.saveText}>Save to My Phone Contact</Text>
          </View>
        </TouchableOpacity>
        {isAlreadySaved && (
          <Text style={styles.alreadySavedText}>
            This contact is already saved your phone.
          </Text>
        )}

        {toastVisible && (
          <View style={styles.toastContainer}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: 'green',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              <Icon name="check" size={12} color="white" />
            </View>
            <Text style={styles.toastText}>User is added your phone!</Text>
          </View>
        )}
      </ScrollView>
    </>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
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
  menuDots: {
    fontSize: 22,
    color: '#3C3C43',
    paddingHorizontal: 4,
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
    alignItems: 'centerC',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#555',
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 1,
  },
  saveButtonDisabled: {
    opacity: 0.3,
  },
  saveText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 0.2,
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
  saveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'white',
    left: 16,
    right: 16,
    bottom: 32,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    color: 'green',
    fontSize: 18,
  },
  alreadySavedText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
