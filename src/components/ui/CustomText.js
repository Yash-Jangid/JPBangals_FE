import React from 'react';
import {Text, StyleSheet} from 'react-native';

import {FONT_FAMILY} from '../../common';

const CustomText = props => {
  return (
    <Text
      {...props}
      style={[styles.text(StyleSheet.flatten(props.style)), props.style]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: propStyle => ({
    fontSize: propStyle?.fontSize ?? 15,
    lineHeight: (propStyle?.fontSize ?? 15) * 1.4,
    fontFamily: FONT_FAMILY[400],
  }),
});

export {CustomText};
