import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    RefreshControl,
    Switch,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/ordersSlice';
import { deleteAccount } from '../api/userApi';
import { useTheme } from '../theme/ThemeContext';
import {
    Package,
    Heart,
    MapPin,
    LifeBuoy,
    LogOut,
    User,
    ChevronRight,
    Moon,
    Trash2,
} from 'lucide-react-native';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isGuestMode } = useAppSelector((state) => state.auth);
    const { theme, themeMode, setThemeMode } = useTheme();
    const isDark = theme.isDark;
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
                            routes: [{ name: 'LoginNew' }], // Redirect to new login
                        });
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAccount();
                            await dispatch(logoutUser());
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'LoginNew' }],
                            });
                            Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete account. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const MenuItem = ({ title, icon: Icon, onPress, subtitle, showChevron = true, rightElement }: any) => (
        <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.surface }]}>
                <Icon size={20} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
                {subtitle && <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
            </View>
            {rightElement}
            {showChevron && !rightElement && <ChevronRight size={20} color={theme.colors.textSecondary} />}
        </TouchableOpacity>
    );

    // Guest View
    if (isGuestMode) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.guestContainer}>
                    <View style={[styles.guestIconCircle, { backgroundColor: theme.colors.primary + '15' }]}>
                        <User size={64} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.guestTitle, { color: theme.colors.textPrimary }]}>Welcome Guest</Text>
                    <Text style={[styles.guestSubtitle, { color: theme.colors.textSecondary }]}>
                        Log in to view your profile, orders, and wishlist.
                    </Text>
                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => navigation.navigate('LoginNew')}
                    >
                        <Text style={styles.loginButtonText}>Login / Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

            {/* Header Area */}
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>My Account</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Card */}
                <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <View style={styles.profileRow}>
                        <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
                            <Text style={styles.avatarText}>{user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
                                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.name || 'User'}
                            </Text>
                            <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>{user?.email}</Text>
                            <Text style={[styles.userPhone, { color: theme.colors.textSecondary }]}>{user?.phoneNumber || '+91 -'}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('EditProfile')}
                            style={styles.editButton}
                        >
                            <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section: Orders */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>ORDERS & SHOPPING</Text>
                    <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <MenuItem
                            title="My Orders"
                            subtitle={`Check your order status (${orders?.length || 0})`}
                            icon={Package}
                            onPress={() => navigation.navigate('Orders')}
                        />
                        <MenuItem
                            title="Wishlist"
                            subtitle="Your favorite items"
                            icon={Heart}
                            onPress={() => navigation.navigate('Wishlist')}
                        />
                        <MenuItem
                            title="Addresses"
                            subtitle="Manage delivery addresses"
                            icon={MapPin}
                            onPress={() => { /* Navigate to Addresses */ }}
                        />
                    </View>
                </View>

                {/* Section: Settings */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>ACCOUNT SETTINGS</Text>
                    <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <MenuItem
                            title="Dark Mode"
                            icon={Moon}
                            onPress={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                            rightElement={
                                <Switch
                                    value={themeMode === 'dark'}
                                    onValueChange={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                                    trackColor={{ false: '#767577', true: theme.colors.primary }}
                                    thumbColor={'#f4f3f4'}
                                />
                            }
                        />
                        <MenuItem
                            title="Help Center"
                            icon={LifeBuoy}
                            onPress={() => { }}
                        />
                        <MenuItem
                            title="Delete Account"
                            subtitle="Permanently delete your account and data"
                            icon={Trash2}
                            onPress={handleDeleteAccount}
                        />
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={[styles.logoutButton, { borderColor: theme.colors.error }]}
                    onPress={handleLogout}
                >
                    <LogOut size={20} color={theme.colors.error} />
                    <Text style={[styles.logoutText, { color: theme.colors.error }]}>Log Out</Text>
                </TouchableOpacity>

                <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>App Version 1.0.0</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    profileCard: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 32,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        marginBottom: 2,
    },
    userPhone: {
        fontSize: 13,
    },
    editButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 12,
        paddingLeft: 4,
    },
    sectionContent: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    menuSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 8,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 24,
        opacity: 0.5,
    },
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    guestIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    guestTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 12,
    },
    guestSubtitle: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 32,
    },
    loginButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
