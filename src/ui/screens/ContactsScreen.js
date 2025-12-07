import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  PermissionsAndroid,
  TouchableWithoutFeedback,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { FontAwesome as Icon } from '@react-native-vector-icons/fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeleteUser from '../modals/DeleteUser';
import { fetchContacts, deleteContact } from '../../api/contactsApi';
import Contacts from 'react-native-contacts';

const SEARCH_HISTORY_KEY = '@contacts_search_history';

export default function ContactsScreen({ navigation, route }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedContactForDelete, setSelectedContactForDelete] =
    useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [devicePhoneMap, setDevicePhoneMap] = useState({});
  const searchTimeoutRef = React.useRef(null);

  const normalizePhone = num =>
    (num || '').replace(/\D/g, '').replace(/^0+/, '').slice(-10);

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
        console.log('Contacts permission denied: ', result);
        return false;
      }

      return true;
    } catch (err) {
      console.log('Contacts permission error: ', err);
      return false;
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      console.log('📖 Loaded search history:', history);
      if (history) {
        const parsed = JSON.parse(history);
        console.log('✅ Parsed history:', parsed);
        setSearchHistory(parsed);
      } else {
        console.log('ℹ️ No search history found');
      }
    } catch (error) {
      console.log('❌ Search history load error:', error);
    }
  };

  const saveSearchHistory = async history => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
      console.log('💾 Saved search history:', history);
    } catch (error) {
      console.log('❌ Search history save error:', error);
    }
  };

  const handleSearchChange = text => {
    setSearchQuery(text);

    if (text.trim().length > 0 && isSearchFocused) {
      setIsSearchFocused(false);
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        const newHistory = searchHistory.includes(trimmedText)
          ? [trimmedText, ...searchHistory.filter(item => item !== trimmedText)]
          : [trimmedText, ...searchHistory].slice(0, 10);

        setSearchHistory(newHistory);
        saveSearchHistory(newHistory);
      }, 2000);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchIconPress = () => {
    const trimmedText = searchQuery.trim();
    if (trimmedText.length > 0) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      const newHistory = searchHistory.includes(trimmedText)
        ? [trimmedText, ...searchHistory.filter(item => item !== trimmedText)]
        : [trimmedText, ...searchHistory].slice(0, 10);

      setSearchHistory(newHistory);
      saveSearchHistory(newHistory);
      setIsSearchFocused(false);
    } else {
      setIsSearchFocused(true);
    }
  };

  const handleSelectHistoryItem = item => {
    setSearchQuery(item);
    const newHistory = [item, ...searchHistory.filter(i => i !== item)].slice(
      0,
      10,
    );
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
    setIsSearchFocused(false);
  };

  const handleRemoveHistoryItem = itemToRemove => {
    const newHistory = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  const handleClearAllHistory = () => {
    setSearchHistory([]);
    saveSearchHistory([]);
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchContacts();
      setContacts(data);
    } catch (e) {
      setError('Kişiler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const loadDeviceContacts = async () => {
    try {
      const granted = await requestContactsPermission();
      if (!granted) {
        setDevicePhoneMap({});
        return;
      }

      const deviceContacts = await Contacts.getAll();
      const map = {};

      deviceContacts.forEach(dc => {
        (dc.phoneNumbers || []).forEach(p => {
          const normalized = normalizePhone(p.number || '');
          if (normalized) {
            map[normalized] = true;
          }
        });
      });

      setDevicePhoneMap(map);
    } catch (error) {
      console.log('Device contacts load error:', error);
      setDevicePhoneMap({});
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadContacts();
      loadDeviceContacts();
      loadSearchHistory();

      if (route?.params?.updated) {
        setToastMessage('User is updated!');
        setToastVisible(true);
        navigation.setParams({ updated: false });
      }

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, [route?.params?.updated]),
  );

  useEffect(() => {
    if (!toastVisible) {
      return;
    }

    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastVisible]);

  const confirmDelete = contact => {
    setSelectedContactForDelete(contact);
    setDeleteModalVisible(true);
  };

  const handleDelete = async contactId => {
    if (!contactId) {
      setDeleteModalVisible(false);
      setSelectedContactForDelete(null);
      return;
    }

    try {
      setLoading(true);
      setError('');

      await deleteContact(contactId);

      try {
        const granted = await requestContactsPermission();
        if (!granted) {
          console.log('Device contact delete skipped: no permission');
        } else if (selectedContactForDelete?.phoneNumber) {
          const targetPhoneDigits = normalizePhone(
            selectedContactForDelete.phoneNumber || '',
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
        console.log('Device contact delete error:', contactError);
      }

      await loadContacts();

      setToastMessage('User is deleted!');
      setToastVisible(true);
    } catch (e) {
      console.log('Delete contact error:', e);
      setError('Kişi silinirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedContactForDelete(null);
    }
  };

  const renderRightActions = item => (
    <View style={styles.rowActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => navigation.navigate('Update', { contact: item })}
      >
        <Icon name="pencil" size={16} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => confirmDelete(item)}
      >
        <Icon name="trash" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const buildSections = contactList => {
    const groups = {};

    contactList.forEach(contact => {
      const firstChar = contact.firstName?.[0] || contact.lastName?.[0] || '#';
      const letter = firstChar.toUpperCase();

      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
    });

    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map(letter => ({
        title: letter,
        data: groups[letter].sort((a, b) => {
          const nameA = `${a.firstName ?? ''} ${a.lastName ?? ''}`
            .trim()
            .toLowerCase();
          const nameB = `${b.firstName ?? ''} ${b.lastName ?? ''}`
            .trim()
            .toLowerCase();
          return nameA.localeCompare(nameB);
        }),
      }));
  };

  const filteredContacts = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return contacts;
    }

    const q = searchQuery.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    return contacts.filter(contact => {
      const fullName = `${contact.firstName ?? ''} ${contact.lastName ?? ''}`
        .trim()
        .toLowerCase();

      if (tokens.length === 0) {
        return true;
      }

      return tokens.every(token => fullName.includes(token));
    });
  }, [contacts, searchQuery]);

  const sections = buildSections(filteredContacts);

  const renderItem = ({ item }) => {
    const initials = `${item.firstName?.[0] ?? ''}${
      item.lastName?.[0] ?? ''
    }`.toUpperCase();
    const normalizedPhone = normalizePhone(item.phoneNumber || '');
    const isInDevice = !!devicePhoneMap[normalizedPhone];

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Profile', { contact: item })}
        >
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
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>
              {isInDevice && (
                <Icon
                  name="mobile"
                  size={14}
                  color="#16A34A"
                  style={styles.deviceIcon}
                />
              )}
            </View>
            <Text style={styles.phone}>{item.phoneNumber}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const showSearchHistory =
    isSearchFocused && searchQuery.trim() === '' && searchHistory.length > 0;

  const showFilteredResults =
    searchQuery.trim().length > 0 && filteredContacts.length > 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <DeleteUser
          visible={deleteModalVisible}
          onClose={() => {
            setDeleteModalVisible(false);
            setSelectedContactForDelete(null);
          }}
          onConfirm={() => {
            if (selectedContactForDelete) {
              handleDelete(selectedContactForDelete.id);
            } else {
              setDeleteModalVisible(false);
            }
          }}
        />
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
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contacts</Text>

          <TouchableOpacity
            style={styles.headerAddContainer}
            onPress={() => navigation.navigate('Add')}
          >
            <Text style={styles.headerAdd}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchWrapper}>
          <View style={styles.searchInputContainer}>
            <TouchableOpacity onPress={handleSearchIconPress}>
              <Icon
                name="search"
                size={18}
                color="#888"
                style={styles.searchIcon}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={handleSearchFocus}
              returnKeyType="search"
            />
          </View>
        </View>

        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Yükleniyor...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <DeleteUser
          visible={deleteModalVisible}
          onClose={() => {
            setDeleteModalVisible(false);
            setSelectedContactForDelete(null);
          }}
          onConfirm={() => {
            if (selectedContactForDelete) {
              handleDelete(selectedContactForDelete.id);
            } else {
              setDeleteModalVisible(false);
            }
          }}
        />
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
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contacts</Text>

          <TouchableOpacity
            style={styles.headerAddContainer}
            onPress={() => navigation.navigate('Add')}
          >
            <Text style={styles.headerAdd}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchWrapper}>
          <View style={styles.searchInputContainer}>
            <TouchableOpacity onPress={handleSearchIconPress}>
              <Icon
                name="search"
                size={18}
                color="#888"
                style={styles.searchIcon}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={handleSearchFocus}
              returnKeyType="search"
            />
          </View>
        </View>

        <View style={styles.center}>
          <Text>{error}</Text>
          <TouchableOpacity onPress={loadContacts} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tekrar dene</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!contacts.length) {
    return (
      <View style={styles.container}>
        <DeleteUser
          visible={deleteModalVisible}
          onClose={() => {
            setDeleteModalVisible(false);
            setSelectedContactForDelete(null);
          }}
          onConfirm={() => {
            if (selectedContactForDelete) {
              handleDelete(selectedContactForDelete.id);
            } else {
              setDeleteModalVisible(false);
            }
          }}
        />
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
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contacts</Text>

          <TouchableOpacity
            style={styles.headerAddContainer}
            onPress={() => navigation.navigate('Add')}
          >
            <Text style={styles.headerAdd}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchWrapper}>
          <View style={styles.searchInputContainer}>
            <TouchableOpacity onPress={handleSearchIconPress}>
              <Icon
                name="search"
                size={18}
                color="#888"
                style={styles.searchIcon}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={handleSearchFocus}
              returnKeyType="search"
            />
          </View>
        </View>

        <View style={styles.emptyCenter}>
          <Image
            source={require('../../assets/icons/person-icon.png')}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No Contacts</Text>
          <Text style={styles.emptySubtitle}>
            Contacts you've added will appear here.
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Add')}>
            <Text style={styles.emptyCreate}>Create New Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (filteredContacts.length === 0 && searchQuery.trim().length > 0) {
    return (
      <View style={styles.container}>
        <DeleteUser
          visible={deleteModalVisible}
          onClose={() => {
            setDeleteModalVisible(false);
            setSelectedContactForDelete(null);
          }}
          onConfirm={() => {
            if (selectedContactForDelete) {
              handleDelete(selectedContactForDelete.id);
            } else {
              setDeleteModalVisible(false);
            }
          }}
        />

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
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contacts</Text>

          <TouchableOpacity
            style={styles.headerAddContainer}
            onPress={() => navigation.navigate('Add')}
          >
            <Text style={styles.headerAdd}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchInputContainer}>
            <TouchableOpacity onPress={handleSearchIconPress}>
              <Icon
                name="search"
                size={18}
                color="#888"
                style={styles.searchIcon}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={handleSearchFocus}
              returnKeyType="search"
            />
          </View>
        </View>

        <View style={styles.noResultsContainer}>
          <Icon name="search" size={55} color="#000" style={{ opacity: 0.3 }} />
          <Text style={styles.noResultsTitle}>No Results</Text>
          <Text style={styles.noResultsSubtitle}>
            The user you are looking for could not be found.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (showSearchHistory) {
          setIsSearchFocused(false);
        }
      }}
    >
      <View style={styles.container}>
      <DeleteUser
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setSelectedContactForDelete(null);
        }}
        onConfirm={() => {
          if (selectedContactForDelete) {
            handleDelete(selectedContactForDelete.id);
          } else {
            setDeleteModalVisible(false);
          }
        }}
      />
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
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>

        <TouchableOpacity
          style={styles.headerAddContainer}
          onPress={() => navigation.navigate('Add')}
        >
          <Text style={styles.headerAdd}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchInputContainer}>
          <TouchableOpacity onPress={handleSearchIconPress}>
            <Icon
              name="search"
              size={18}
              color="#888"
              style={styles.searchIcon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={handleSearchFocus}
            returnKeyType="search"
          />
        </View>
      </View>

      {showSearchHistory && (
        <View style={styles.searchHistoryWrapper}>
          <View style={styles.searchHistoryHeader}>
            <Text style={styles.searchHistoryTitle}>Search Story</Text>
            <TouchableOpacity onPress={handleClearAllHistory}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchHistoryList}>
            {searchHistory.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.searchHistoryItem}
                onPress={() => handleSelectHistoryItem(item)}
                activeOpacity={0.7}
              >
                <TouchableOpacity
                  style={styles.removeChipButton}
                  onPress={() => handleRemoveHistoryItem(item)}
                  activeOpacity={0.7}
                >
                  <Icon name="times" size={14} color="#666" />
                </TouchableOpacity>
                <Text style={styles.searchHistoryChipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showFilteredResults && (
        <View style={styles.matchesHeader}>
          <Text style={styles.matchesHeaderText}>TOP NAME MATCHES</Text>
        </View>
      )}

      {!showSearchHistory && (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          contentContainerStyle={{ padding: 16 }}
        />
      )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    marginBottom: 1,
    marginTop: 20,
  },
  sectionHeaderText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#374151',
  },
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: { fontSize: 16, fontWeight: '600' },
  phone: { fontSize: 14, color: '#555' },
  deviceIcon: {
    marginLeft: 8,
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 6,
  },
  retryText: { color: '#fff' },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  headerAddContainer: {
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAdd: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#F2F2F7',
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
  searchHistoryWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  searchHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.2,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    letterSpacing: 0.2,
  },
  searchHistoryList: {
    gap: 0,
  },
  searchHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  removeChipButton: {
    marginRight: 12,
    padding: 4,
  },
  searchHistoryChipText: {
    fontSize: 15,
    color: '#000',
    letterSpacing: 0.2,
    flex: 1,
  },
  matchesHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  matchesHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
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
  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 5,
    zIndex: 1000,
  },
  toastText: {
    color: 'green',
    fontSize: 14,
    fontWeight: '500',
  },
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
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
