import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../common/colors';

const { width } = Dimensions.get('window');

const SkeletonItem = ({ style }: { style: any }) => {
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <View style={[styles.skeletonItem, style, { overflow: 'hidden' }]}>
            <Animated.View
                style={{
                    width: '100%',
                    height: '100%',
                    transform: [{ translateX }],
                }}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                />
            </Animated.View>
        </View>
    );
};

export const SkeletonLoader = () => {
    // Brand colors from your theme
    const bgColor = Colors.splash_background || '#360F10';

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <SkeletonItem style={styles.menuIcon} />
                <SkeletonItem style={styles.logoSkeleton} />
                <SkeletonItem style={styles.cartIcon} />
            </View>

            {/* Banner Skeleton */}
            <SkeletonItem style={styles.banner} />

            {/* Category Grid Skeleton */}
            <View style={styles.grid}>
                <View style={styles.row}>
                    <SkeletonItem style={styles.categoryCard} />
                    <SkeletonItem style={styles.categoryCard} />
                </View>
                <View style={styles.row}>
                    <SkeletonItem style={styles.categoryCard} />
                    <SkeletonItem style={styles.categoryCard} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50, // Safe area approximation
    },
    skeletonItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    menuIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    logoSkeleton: {
        width: 150,
        height: 30,
    },
    cartIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    banner: {
        width: width - 32,
        height: 180,
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 12,
    },
    grid: {
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    categoryCard: {
        width: (width - 48) / 2,
        height: 150,
        borderRadius: 12,
    },
});
