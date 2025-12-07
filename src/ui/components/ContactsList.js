import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import ContactItem from './ContactItem';

export default function ContactsList({
  sections,
  onContactPress,
  onEdit,
  onDelete,
}) {
  const renderItem = ({ item }) => (
    <ContactItem
      item={item}
      onPress={onContactPress}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
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
});
