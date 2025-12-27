import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, SafeAreaView, Image } from 'react-native';
import OutpostLogo from '../assets/images/OutpostLogo';
import internetErrorIcon from '../assets/images/internetErrorIcon.png';


const { width, height } = Dimensions.get('window');

type GlobalErrorScreenProps = {
    retry: () => void;
};

const GlobalErrorScreen: React.FC<GlobalErrorScreenProps> = ({ retry }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                <View style={styles.subContainer}>
                    <View style={styles.iconContainer}>
                        <OutpostLogo />
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={internetErrorIcon}
                            style={styles.errorImage}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={[{ gap: 8 }]}>
                        <Text style={styles.message}>No Internet</Text>
                        <Text style={styles.subMessage}>Please check your network connection</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.tryAgainButton}
                        onPress={() => { retry }}
                    >
                        <Text style={styles.tryAgainText}>Try again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 82,
        paddingBottom: 130
    },
    iconContainer: {
        alignSelf: 'center',
        maxHeight: 14,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    subContainer: {
        width: width * 0.85,
        maxWidth: 350,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'#ff0000'
    },
    errorImage: {
        width: '100%',
        height: '100%',
    },
    message: {
        textAlign: 'center',
        fontSize: 22,
        color: '#101010',
        fontWeight: '600',
    },
    subMessage: {
        color: '#636262',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 20,
    },
    tryAgainButton: {
        borderColor: '#6e419b',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 2,
        width: '100%',
        borderRadius: 4,
    },
    tryAgainText: {
        textAlign: 'center',
        color: '#6e419b',
        fontSize: 16,
        fontWeight: '400'
    },
});

export default GlobalErrorScreen;