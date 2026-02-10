import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    Pressable,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react-native';
import { AlertOptions, AlertButton, AlertType } from './AlertTypes';

const { width } = Dimensions.get('window');

export const CustomAlert: React.FC<{
    visible: boolean;
    options: AlertOptions | null;
    onClose: () => void;
}> = ({ visible, options, onClose }) => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsVisible(false);
            });
        }
    }, [visible]);

    if (!isVisible || !options) return null;

    const { title, message, type = 'info', buttons = [{ text: 'OK' }] } = options;

    const getIcon = () => {
        const iconSize = 48;
        switch (type) {
            case 'success':
                return <CheckCircle2 size={iconSize} color={theme.colors.success} />;
            case 'error':
                return <XCircle size={iconSize} color={theme.colors.error} />;
            case 'warning':
                return <AlertCircle size={iconSize} color={theme.colors.accent} />;
            default:
                return <Info size={iconSize} color={theme.colors.primary} />;
        }
    };

    const handleButtonPress = (btn: AlertButton) => {
        if (btn.onPress) {
            btn.onPress();
        }
        onClose();
    };

    const isStacked = buttons.length > 2;

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Animated.View style={[styles.backdropBackground, { opacity: fadeAnim, backgroundColor: 'rgba(0,0,0,0.5)' }]} />
            </Pressable>

            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.alertBox,
                        {
                            backgroundColor: theme.colors.surface,
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                            borderRadius: theme.borderRadius.large,
                        },
                    ]}
                >
                    <View style={styles.iconContainer}>
                        {getIcon()}
                    </View>

                    <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.typography.h3.fontFamily }]}>
                        {title}
                    </Text>

                    <Text style={[styles.message, { color: theme.colors.textSecondary, fontFamily: theme.typography.body2.fontFamily }]}>
                        {message}
                    </Text>

                    <View style={[styles.buttonContainer, isStacked ? styles.buttonStack : styles.buttonRow]}>
                        {buttons.map((btn, index) => {
                            const isDestructive = btn.style === 'destructive';
                            const isCancel = btn.style === 'cancel';

                            let buttonBg = theme.colors.surface;
                            let textColor = theme.colors.textSecondary;
                            let borderWidth = 1;
                            let borderColor = theme.colors.border;

                            if (btn.style === 'default' || (!btn.style && index === buttons.length - 1)) {
                                buttonBg = theme.colors.primary;
                                textColor = theme.colors.textInverse;
                                borderWidth = 0;
                            } else if (isDestructive) {
                                buttonBg = theme.colors.error + '10';
                                textColor = theme.colors.error;
                                borderColor = theme.colors.error;
                            }

                            return (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor: buttonBg,
                                            borderColor: borderColor,
                                            borderWidth: borderWidth,
                                            borderRadius: theme.borderRadius.medium,
                                            flex: isStacked ? 0 : 1,
                                            marginHorizontal: isStacked ? 0 : 8,
                                            marginBottom: isStacked ? 12 : 0,
                                        }
                                    ]}
                                    onPress={() => handleButtonPress(btn)}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        {
                                            color: textColor,
                                            fontFamily: theme.typography.button.fontFamily,
                                            fontWeight: (btn.style === 'default' || index === buttons.length - 1) ? 'bold' : '600'
                                        }
                                    ]}>
                                        {btn.text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    backdropBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    alertBox: {
        width: '100%',
        maxWidth: 340,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    buttonContainer: {
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: -8,
    },
    buttonStack: {
        flexDirection: 'column',
    },
    button: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    buttonText: {
        fontSize: 14,
        letterSpacing: 0.5,
    },
});
