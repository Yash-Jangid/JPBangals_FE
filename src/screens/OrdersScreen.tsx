import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { useTheme } from '../theme/ThemeContext';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders } from '../store/slices/ordersSlice';
import { Order } from '../api/ordersApi';

export const OrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { orders, loading, error } = useAppSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders({ page: 1, limit: 20 }));
    }, [dispatch]);

    const navigateToDetails = (orderId: string) => {
        navigation.navigate('OrderDetails', { orderId });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return theme.colors.success;
            case 'SHIPPED': return theme.colors.info;
            case 'CANCELLED': return theme.colors.error;
            case 'PENDING': return theme.colors.primary;
            default: return theme.colors.textSecondary;
        }
    };

    const renderOrderItem = ({ item }: { item: Order }) => (
        <TouchableOpacity
            style={[styles.orderCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.textPrimary }]}
            onPress={() => navigateToDetails(item.id)}
        >
            <View style={styles.orderHeader}>
                <Text style={[styles.orderNumber, { color: theme.colors.textPrimary }]}>Order #{item.orderNumber}</Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
            </View>

            <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>
                Placed on {new Date(item.createdAt).toLocaleDateString()}
            </Text>

            <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

            <View style={styles.orderFooter}>
                <Text style={[styles.itemCount, { color: theme.colors.textSecondary }]}>
                    {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
                </Text>
                <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>₹{item.totalAmount}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>No orders yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                Start shopping to see your orders here
            </Text>
            <TouchableOpacity
                style={[styles.shopButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            >
                <Text style={[styles.shopButtonText, { color: theme.colors.textInverse }]}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading.list && orders.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <CustomHeader title="My Orders" showBackButton onBackPress={() => navigation.goBack()} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <CustomHeader title="My Orders" showBackButton onBackPress={() => navigation.goBack()} />

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyList}
                refreshing={loading.list}
                onRefresh={() => dispatch(fetchOrders({ page: 1, limit: 20 }))}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    orderCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderNumber: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
    },
    orderStatus: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    orderDate: {
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemCount: {
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    totalAmount: {
        fontSize: 16,
        fontFamily: Fonts.bold,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 100,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: Fonts.semiBold,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        marginBottom: 24,
    },
    shopButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    shopButtonText: {
        fontSize: 16,
        fontFamily: Fonts.medium,
    },
});
