import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, StatusBar } from 'react-native';
import { COLORS, Images } from '../common';
import { Text } from 'react-native-gesture-handler';

const SplashScreen = () => {
  return (
    <>
    <StatusBar backgroundColor={COLORS.PRIMARY[400]} barStyle="light-content" />
    <View style={[styles.container]}>
      <View style={styles.logoContainer}>
        <Text style={styles.text}>Edurise</Text>
        <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 24,
    width: 48,
    height: 48,
  },
  text: {
    color: COLORS.GRAY[0],
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 50,
  }
});

export { SplashScreen };
