import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContactsScreen from '../ui/screens/ContactsScreen';
import ProfileScreen from '../ui/screens/ProfileScreen';
import UpsertContactScreen from '../ui/screens/AddContactScreen';
import UpdateContactScreen from '../ui/screens/UpdateContactScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Add" component={UpsertContactScreen} />
        <Stack.Screen name="Update" component={UpdateContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
