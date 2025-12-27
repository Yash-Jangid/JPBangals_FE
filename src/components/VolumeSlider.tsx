import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Colors } from '../common/colors';
import { Fonts } from '../common/fonts';
import { VolumeUpIcon, VolumeOffIcon } from './icons/VideoControlIcons';

const { width } = Dimensions.get('window');

interface VolumeSliderProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onClose: () => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  onClose,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<View>(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Handle touch start
    },
    onPanResponderMove: (evt) => {
      if (sliderRef.current) {
        sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
          const touchX = evt.nativeEvent.pageX - pageX;
          const percentage = Math.max(0, Math.min(1, touchX / width));
          onVolumeChange(percentage);
        });
      }
    },
    onPanResponderRelease: (evt) => {
      if (sliderRef.current) {
        sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
          const touchX = evt.nativeEvent.pageX - pageX;
          const percentage = Math.max(0, Math.min(1, touchX / width));
          onVolumeChange(percentage);
        });
      }
    },
  });

  const handleSliderPress = (evt: any) => {
    if (sliderRef.current) {
      sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
        const touchX = evt.nativeEvent.pageX - pageX;
        const percentage = Math.max(0, Math.min(1, touchX / width));
        onVolumeChange(percentage);
      });
    }
  };

  const currentVolume = isMuted ? 0 : volume;
  const volumePercentage = currentVolume * 100;

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={styles.muteButton}
          onPress={onMuteToggle}
        >
          {isMuted || currentVolume === 0 ? (
            <VolumeOffIcon size={20} color={Colors.textLight} />
          ) : (
            <VolumeUpIcon size={20} color={Colors.textLight} />
          )}
        </TouchableOpacity>

        <View style={styles.sliderWrapper}>
          <Text style={styles.volumeLabel}>Volume</Text>
          <View
            ref={sliderRef}
            style={styles.sliderTrack}
            onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              style={styles.sliderTouchable}
              onPress={handleSliderPress}
              activeOpacity={1}
            >
              <View style={styles.sliderBackground}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${volumePercentage}%` }
                  ]}
                />
                <View
                  style={[
                    styles.sliderThumb,
                    { left: `${volumePercentage}%` }
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.volumeText}>{Math.round(volumePercentage)}%</Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  sliderContainer: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  muteButton: {
    padding: 8,
    marginRight: 12,
  },
  sliderWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
    marginRight: 12,
    minWidth: 50,
  },
  sliderTrack: {
    flex: 1,
    height: 30,
    justifyContent: 'center',
  },
  sliderTouchable: {
    flex: 1,
    height: 30,
    justifyContent: 'center',
  },
  sliderBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.textLight,
    marginLeft: -8,
  },
  volumeText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
    marginLeft: 12,
    minWidth: 35,
    textAlign: 'right',
  },
  closeButton: {
    padding: 8,
    marginLeft: 12,
  },
  closeButtonText: {
    fontSize: 20,
    color: Colors.textLight,
    fontWeight: 'bold',
  },
});
