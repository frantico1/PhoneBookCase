import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SuccessModal = ({ visible, onFinished }) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onFinished}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <LottieView
            source={require('../../assets/lottie/Done.json')}
            autoPlay
            loop={false}
            speed={1.8}
            style={styles.animation}
            onAnimationFinish={onFinished}
          />
          <Text style={styles.title}>All Done!</Text>
          <Text style={styles.subtitle}>New contact saved 🎉</Text>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  animation: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#3C3C43',
  },
});
