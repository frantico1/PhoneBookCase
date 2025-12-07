import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function ContactInfoForm({ firstName, lastName, phoneNumber }) {
  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#888"
        value={firstName}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lastName}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        value={phoneNumber}
        editable={false}
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
