import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

function Loader() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.loader}>
      <Animated.View
        style={[
          styles.spinner,
          {
            transform: [
              {
                rotate: spinValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    height: 128,
    width: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: '#6E419B',
    borderTopWidth: 0,
    borderLeftWidth:0,
    transform: [
      {
        rotate: '90deg',
      },
    ],
  },
});

export default Loader;