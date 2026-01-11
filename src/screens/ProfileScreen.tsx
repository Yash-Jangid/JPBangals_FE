import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl,
    Dimensions,
    ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CustomHeader } from '../components/CustomHeader';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/ordersSlice';
import { useTheme } from '../theme/ThemeContext';
import {
    ShoppingBag,
    ChevronRight,
    Package,
    Heart,
    MapPin,
    LifeBuoy,
    Settings,
    LogOut,
    User,
    Moon,
    Sun,
    Monitor
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isGuestMode } = useAppSelector((state) => state.auth);
    const { theme, themeMode, setThemeMode, isDark } = useTheme();
    const { orders } = useAppSelector((state) => state.orders);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !isGuestMode) {
            loadData();
        }
    }, [isAuthenticated, isGuestMode]);

    const loadData = async () => {
        try {
            await dispatch(fetchOrders({ page: 1, limit: 10 })).unwrap();
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(logoutUser());
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                },
            ]
        );
    };

    const handleLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const MenuLink = ({ title, icon: IconComponent, onPress, subtitle }: { title: string, icon: any, onPress: () => void, subtitle?: string }) => (
        <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.menuIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F5F5F5' }]}>
                <IconComponent size={20} color={theme.colors.text} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{title}</Text>
                {subtitle && <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
    );

    // Guest Mode View
    if (isGuestMode) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <CustomHeader
                    title="Profile"
                    rightComponent={
                        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                            <ShoppingBag size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    }
                />
                <ScrollView contentContainerStyle={styles.guestContainer}>
                    <View style={styles.guestContent}>
                        <View style={[styles.guestIconContainer, { backgroundColor: theme.colors.card }]}>
                            <User size={48} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.guestTitle, { color: theme.colors.text }]}>You're browsing as Guest</Text>
                        <Text style={[styles.guestSubtitle, { color: theme.colors.textSecondary }]}>
                            Login to access your orders, wishlist, and personalized recommendations
                        </Text>

                        <TouchableOpacity
                            style={styles.modernLoginButton}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[theme.colors.primary, '#D4AF37']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.modernLoginButtonText}>Login or Sign Up</Text>
                                <ChevronRight size={20} color="#FFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    const totalOrders = orders?.length || 0;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <CustomHeader
                title="Profile"
                rightComponent={
                    <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                        <ShoppingBag size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.colors.backgroundSecondary }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
            >
                {/* Profile Header */}
                <View style={[styles.profileHeader, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.profileInfoContainer}>
                        <View style={[styles.avatarCircle, { backgroundColor: theme.colors.primary }]}>
                            <Text style={styles.avatarText}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: theme.colors.text }]}>{user?.name || 'User'}</Text>
                            <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>{user?.email || ''}</Text>
                            <TouchableOpacity style={styles.editProfileBtn}>
                                <Text style={[styles.editProfileText, { color: theme.colors.primary }]}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Account Settings Section */}
                <View style={[styles.sectionContainer, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textSecondary }]}>MY ACCOUNT</Text>

                    <MenuLink
                        title="Orders"
                        subtitle={`Check your order status (${totalOrders})`}
                        icon={Package}
                        onPress={() => navigation.navigate('Orders')}
                    />
                    <MenuLink
                        title="Wishlist"
                        subtitle="Your favorite items"
                        icon={Heart}
                        onPress={() => { }}
                    />
                    <MenuLink
                        title="Addresses"
                        subtitle="Manage delivery addresses"
                        icon={MapPin}
                        onPress={() => { }}
                    />
                    <MenuLink
                        title="Help Center"
                        subtitle="Help regarding your recent purchases"
                        icon={LifeBuoy}
                        onPress={() => { }}
                    />
                </View>

                {/* App Settings Section */}
                <View style={[styles.sectionContainer, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textSecondary }]}>SETTINGS</Text>

                    {/* Theme Selector as Menu Items */}
                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                        onPress={() => {
                            const nextMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'auto' : 'light';
                            setThemeMode(nextMode);
                        }}
                    >
                        <View style={[styles.menuIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F5F5F5' }]}>
                            {themeMode === 'light' ? <Sun size={20} color={theme.colors.text} /> :
                                themeMode === 'dark' ? <Moon size={20} color={theme.colors.text} /> :
                                    <Monitor size={20} color={theme.colors.text} />}
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Appearance</Text>
                            <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
                                {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode
                            </Text>
                        </View>
                        <ChevronRight size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>

                    <MenuLink
                        title="App Settings"
                        icon={Settings}
                        onPress={() => { }}
                    />
                </View>

                {/* Logout Button */}
                <View style={[styles.sectionContainer, { backgroundColor: theme.colors.background, marginBottom: 40 }]}>
                    <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
                        <LogOut size={20} color={theme.colors.error} />
                        <Text style={[styles.logoutText, { color: theme.colors.error }]}>Log Out</Text>
                    </TouchableOpacity>
                    <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>Version 1.0.0</Text>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    // Guest Styles
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    guestContent: {
        alignItems: 'center',
        width: '100%',
    },
    guestIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        marginBottom: 8,
        textAlign: 'center',
    },
    guestSubtitle: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    modernLoginButton: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradientButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    modernLoginButtonText: {
        color: '#FFF',
        fontFamily: Fonts.bold,
        fontSize: 16,
    },

    // Profile Styles
    profileHeader: {
        paddingVertical: 24,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    profileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    avatarText: {
        fontSize: 28,
        fontFamily: Fonts.bold,
        color: '#FFF',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        marginBottom: 8,
    },
    editProfileBtn: {
        alignSelf: 'flex-start',
    },
    editProfileText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },

    // Section Styles
    sectionContainer: {
        marginBottom: 12,
        paddingVertical: 8,
    },
    sectionHeaderTitle: {
        fontSize: 12,
        fontFamily: Fonts.bold,
        letterSpacing: 1,
        marginBottom: 8,
        paddingHorizontal: 20,
        marginTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        fontFamily: Fonts.regular,
    },

    // Logout
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: Fonts.medium,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: Fonts.regular,
        marginTop: 8,
        marginBottom: 16,
    },
});
