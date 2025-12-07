import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';

export default function SaveButton({ isValid, isAlreadySaved, onSave }) {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.saveButton,
          (!isValid || isAlreadySaved) && { opacity: 0.5 },
        ]}
        disabled={!isValid || isAlreadySaved}
        onPress={!isValid || isAlreadySaved ? undefined : onSave}
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
    </>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 1,
  },
  saveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 0.2,
  },
  alreadySavedText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
