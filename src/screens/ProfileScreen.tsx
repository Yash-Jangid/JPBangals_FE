import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    RefreshControl,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CustomHeader } from '../components/CustomHeader';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { fetchOrders } from '../store/slices/ordersSlice';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isGuestMode } = useAppSelector((state) => state.auth);
    const { theme, themeMode, setThemeMode } = useTheme();
    const { orders, loading: ordersLoading } = useAppSelector((state) => state.orders);
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

    // Guest Mode View
    if (isGuestMode) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <CustomHeader title="Profile" />
                <ScrollView contentContainerStyle={styles.guestContainer}>
                    <View style={styles.guestContent}>
                        <View style={styles.guestIconContainer}>
                            <Text style={styles.guestIcon}>👤</Text>
                        </View>
                        <Text style={styles.guestTitle}>You're browsing as Guest</Text>
                        <Text style={styles.guestSubtitle}>
                            Login to access your orders, wishlist, and personalized recommendations
                        </Text>

                        <TouchableOpacity
                            style={styles.modernLoginButton}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#D4AF37', '#F5E6B3', '#D4AF37']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.modernLoginButtonText}>Login or Sign Up</Text>
                                <Text style={styles.loginArrow}>→</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.guestFeatures}>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>📦</Text>
                                <Text style={styles.featureText}>Track Orders</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>❤️</Text>
                                <Text style={styles.featureText}>Save Wishlist</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>🎁</Text>
                                <Text style={styles.featureText}>Exclusive Offers</Text>
                            </View>
                        </View>

                        {/* Theme Selector for Guest */}
                        <View style={styles.guestThemeSection}>
                            <Text style={styles.guestThemeTitle}>Appearance</Text>
                            <View style={styles.themeSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.themeOption,
                                        themeMode === 'light' && styles.themeOptionActive,
                                    ]}
                                    onPress={() => setThemeMode('light')}
                                >
                                    <Text style={styles.themeIcon}>☀️</Text>
                                    <Text style={[
                                        styles.themeText,
                                        themeMode === 'light' && styles.themeTextActive,
                                    ]}>Light</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.themeOption,
                                        themeMode === 'dark' && styles.themeOptionActive,
                                    ]}
                                    onPress={() => setThemeMode('dark')}
                                >
                                    <Text style={styles.themeIcon}>🌙</Text>
                                    <Text style={[
                                        styles.themeText,
                                        themeMode === 'dark' && styles.themeTextActive,
                                    ]}>Dark</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.themeOption,
                                        themeMode === 'auto' && styles.themeOptionActive,
                                    ]}
                                    onPress={() => setThemeMode('auto')}
                                >
                                    <Text style={styles.themeIcon}>⚙️</Text>
                                    <Text style={[
                                        styles.themeText,
                                        themeMode === 'auto' && styles.themeTextActive,
                                    ]}>Auto</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Calculate stats from real data
    const totalOrders = orders?.length || 0;
    const totalSpent = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

    const quickActions = [
        { id: 1, title: 'My Orders', icon: '📦', route: 'Orders', color: '#FFE5E5' },
        { id: 2, title: 'Wishlist', icon: '❤️', route: 'Wishlist', color: '#FFF0E5' },
        { id: 3, title: 'Addresses', icon: '📍', route: 'Addresses', color: '#E5F5FF' },
        { id: 4, title: 'Help', icon: '💬', route: 'Support', color: '#F0E5FF' },
    ];

    const recentOrders = orders?.slice(0, 2) || [];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <CustomHeader title="Profile" />

            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.colors.backgroundSecondary }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || ''}</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{totalOrders}</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>₹{(totalSpent / 1000).toFixed(1)}K</Text>
                        <Text style={styles.statLabel}>Spent</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Wishlist</Text>
                    </View>
                </View>

                {/* Quick Actions Grid */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Quick Actions
                    </Text>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={[styles.actionCard, { backgroundColor: action.color }]}
                                onPress={() => navigation.navigate(action.route)}
                            >
                                <Text style={styles.actionIcon}>{action.icon}</Text>
                                <Text style={styles.actionTitle}>{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Activity */}
                {recentOrders.length > 0 && (
                    <View style={styles.section}>
                        <View style={[styles.sectionHeader, { backgroundColor: theme.colors.backgroundSecondary }]}>
                            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                                Recent Orders
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                                <Text style={styles.seeAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>

                        {recentOrders.map((order) => (
                            <TouchableOpacity
                                key={order.id}
                                style={styles.orderCard}
                                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                            >
                                <View style={styles.orderIconBox}>
                                    <Text style={styles.orderIcon}>📦</Text>
                                </View>
                                <View style={styles.orderInfo}>
                                    <Text style={styles.orderName}>Order #{order.id}</Text>
                                    <Text style={styles.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={styles.orderRight}>
                                    <Text style={styles.orderAmount}>₹{order.totalAmount}</Text>
                                    <View style={[
                                        styles.statusBadge,
                                        order.status === 'DELIVERED' && styles.statusDelivered,
                                    ]}>
                                        <Text style={styles.statusText}>{order.status}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Theme Selector */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
                    <View style={styles.themeSelector}>
                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                themeMode === 'light' && styles.themeOptionActive,
                            ]}
                            onPress={() => setThemeMode('light')}
                        >
                            <Text style={styles.themeIcon}>☀️</Text>
                            <Text style={[
                                styles.themeText,
                                themeMode === 'light' && styles.themeTextActive,
                            ]}>Light</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                themeMode === 'dark' && styles.themeOptionActive,
                            ]}
                            onPress={() => setThemeMode('dark')}
                        >
                            <Text style={styles.themeIcon}>🌙</Text>
                            <Text style={[
                                styles.themeText,
                                themeMode === 'dark' && styles.themeTextActive,
                            ]}>Dark</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                themeMode === 'auto' && styles.themeOptionActive,
                            ]}
                            onPress={() => setThemeMode('auto')}
                        >
                            <Text style={styles.themeIcon}>⚙️</Text>
                            <Text style={[
                                styles.themeText,
                                themeMode === 'auto' && styles.themeTextActive,
                            ]}>Auto</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8', // Will be dynamic
    },
    scrollView: {
        flex: 1,
    },
    // Guest Mode Styles
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    guestContent: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
    },
    guestIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F0E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    guestIcon: {
        fontSize: 48,
    },
    guestTitle: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    guestSubtitle: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    modernLoginButton: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        marginBottom: 40,
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    gradientButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    modernLoginButtonText: {
        color: '#1a1a1a',
        fontFamily: Fonts.bold,
        fontSize: 17,
        letterSpacing: 0.8,
    },
    loginArrow: {
        color: '#1a1a1a',
        fontSize: 20,
        fontFamily: Fonts.bold,
    },
    guestFeatures: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    featureItem: {
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    featureText: {
        fontSize: 13,
        fontFamily: Fonts.medium,
        color: '#666',
    },
    guestThemeSection: {
        marginTop: 40,
        width: '100%',
    },
    guestThemeTitle: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    // Profile Styles
    profileHeader: {
        backgroundColor: '#FFFFFF',
        paddingTop: 32,
        paddingBottom: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarText: {
        fontSize: 36,
        fontFamily: Fonts.bold,
        color: '#FFF',
    },
    userName: {
        fontSize: 22,
        fontFamily: Fonts.bold,
        color: '#1a1a1a',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: '#666',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: '#D4AF37',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: Fonts.medium,
        color: '#666',
    },
    section: {
        marginTop: 24,
        marginHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.semiBold,
        color: '#1a1a1a',
        marginBottom: 12,
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        color: '#D4AF37',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionCard: {
        width: (width - 44) / 2,
        aspectRatio: 1.5,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIcon: {
        fontSize: 36,
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 14,
        fontFamily: Fonts.semiBold,
        color: '#1a1a1a',
        textAlign: 'center',
    },
    orderCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    orderIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F5F0E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    orderIcon: {
        fontSize: 24,
    },
    orderInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    orderName: {
        fontSize: 15,
        fontFamily: Fonts.semiBold,
        color: '#1a1a1a',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: '#666',
    },
    orderRight: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    orderAmount: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#1a1a1a',
        marginBottom: 6,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#FFF3E0',
    },
    statusDelivered: {
        backgroundColor: '#E8F5E9',
    },
    statusText: {
        fontSize: 11,
        fontFamily: Fonts.semiBold,
        color: '#F57C00',
        textTransform: 'capitalize',
    },
    logoutButton: {
        marginHorizontal: 16,
        marginTop: 32,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF3B30',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: '#FF3B30',
    },
    themeSelector: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        padding: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    themeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: 'transparent',
        gap: 6,
    },
    themeOptionActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    themeIcon: {
        fontSize: 18,
    },
    themeText: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: '#666',
    },
    themeTextActive: {
        color: '#D4AF37',
        fontFamily: Fonts.semiBold,
    },
});
