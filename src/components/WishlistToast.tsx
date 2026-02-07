import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Fonts } from '../common/fonts';

interface WishlistToastProps {
    visible: boolean;
    message: string;
    onClose: () => void;
    onView: () => void;
}

export const WishlistToast: React.FC<WishlistToastProps> = ({ visible, message, onClose, onView }) => {
    const { theme } = useTheme();
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Auto hide after 3 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity, backgroundColor: theme.colors.surface }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { borderColor: '#4CAF50' }]}>
                    <Check size={16} color="#4CAF50" strokeWidth={3} />
                </View>
                <Text style={[styles.message, { color: theme.colors.textPrimary }]}>{message}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={onView}>
                    <Text style={styles.viewButton}>VIEW</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <X size={20} color={theme.colors.textPrimary} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 100 : 80, // Positioned above bottom tab bar (60-80px)
        left: 16,
        right: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 9999,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    viewButton: {
        color: '#FFD700', // Gold/Yellow
        fontSize: 13,
        fontFamily: Fonts.bold,
        letterSpacing: 0.5,
    },
    closeButton: {
        padding: 4,
    }
});
