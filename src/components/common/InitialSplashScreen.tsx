import React, { useEffect, useRef } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Images } from '../../common/images';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export const InitialSplashScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* 
                We use translucent=true and transparent background 
                so the View fills the ENTIRE screen (behind status bar),
                matching the native windowBackground behavior. 
            */}
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            {/* Native-matching Radial Shadow using SVG */}
            <View style={styles.shadowContainer}>
                <Svg height="220" width="220" viewBox="0 0 220 220">
                    <Defs>
                        <RadialGradient
                            id="grad"
                            cx="110"
                            cy="110"
                            rx="110"
                            ry="110"
                            fx="110"
                            fy="110"
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
                            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="110" cy="110" r="110" fill="url(#grad)" />
                </Svg>
            </View>

            {/* App Logo - Static and immediately visible */}
            <View style={styles.logoContainer}>
                <Image
                    source={Images.nativeSplashLogo}
                    style={styles.logo}
                    resizeMode="center"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#360F10', // splash_background from colors.xml
        justifyContent: 'center',
        alignItems: 'center',
    },
    shadowContainer: {
        position: 'absolute',
        width: 220,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radialShadow: {
        // SVG used instead for accuracy
    },
    logoContainer: {
        // Native splash uses gravity="center" without fixed bounds.
        // We let the container fill the screen and center the image content.
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2, // Ensure logo is above shadow
    },
    logo: {
        // center: scale the image down so that it is completely visible, if bigger than the area of the view.
        // The image will not be scaled up.
        width: '100%',
        height: '100%',
    },
});
