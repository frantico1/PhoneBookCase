import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function UpdateContactForm({
  firstName,
  lastName,
  phoneNumber,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
}) {
  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={onFirstNameChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={onLastNameChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        value={phoneNumber}
        onChangeText={onPhoneChange}
        keyboardType="phone-pad"
      />
    </>
  );
}

const styles = StyleSheet.create({
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
});
