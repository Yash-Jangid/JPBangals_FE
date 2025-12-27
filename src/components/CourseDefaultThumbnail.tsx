import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, G, Text as SvgText, Circle } from 'react-native-svg';

interface CourseDefaultThumbnailProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: object;
  text?: string;
}

export const CourseDefaultThumbnail: React.FC<CourseDefaultThumbnailProps> = ({
  width,
  height,
  borderRadius = 16,
  style = {},
  text = 'Image Not Available',
}) => {
  const containerStyle = [
    styles.container,
    width !== undefined ? { width } : { width: '100%' },
    height !== undefined ? { height } : { height: '100%' },
    { borderRadius },
    style,
  ];

  return (
    <View style={containerStyle}>
      <Svg width={width} height={height} viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
        <Rect width="200" height="120" rx={borderRadius} fill="#EEE" />
        <G>
          <SvgText
            x="100"
            y="68"
            fontSize="18"
            fontFamily="Arial"
            fill="#888"
            textAnchor="middle"
          >
            {text}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

export default CourseDefaultThumbnail;
