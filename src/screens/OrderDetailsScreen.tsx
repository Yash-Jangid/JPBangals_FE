import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Image,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { useTheme } from '../theme/ThemeContext';
import { Fonts } from '../common/fonts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrderDetails, clearCurrentOrder } from '../store/slices/ordersSlice';

export const OrderDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { currentOrder, loading, error } = useAppSelector((state) => state.orders);
    const { orderId } = route.params;

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetails(orderId));
        }
        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [dispatch, orderId]);

    if (loading.details) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error.details || !currentOrder) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {typeof error.details === 'string' ? error.details : 'Order not found'}
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <CustomHeader title={`Order #${currentOrder.orderNumber}`} showBackButton onBackPress={() => navigation.goBack()} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Status Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Order Status</Text>
                    <View style={styles.statusRow}>
                        <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>Current Status</Text>
                        <Text style={[styles.statusValue, { color: theme.colors.primary }]}>
                            {currentOrder.status}
                        </Text>
                    </View>
                    <Text style={[styles.dateText, { color: theme.colors.textSecondary + '80' }]}>
                        Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                {/* Items Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Items</Text>
                    {currentOrder.items.map((item) => (
                        <View key={item.id} style={[styles.itemCard, { borderBottomColor: theme.colors.divider }]}>
                            <Image
                                source={{ uri: item.productImageUrl || 'https://via.placeholder.com/80' }}
                                style={[styles.itemImage, { backgroundColor: theme.colors.surfaceHighlight }]}
                            />
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemName, { color: theme.colors.textPrimary }]} numberOfLines={2}>{item.productName}</Text>
                                <Text style={[styles.itemMeta, { color: theme.colors.textSecondary }]}>Size: {item.size} • Qty: {item.quantity}</Text>
                                <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>₹{item.price}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Shipping Address */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Shipping Address</Text>
                    <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>{currentOrder.shippingAddress.fullName}</Text>
                    <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>{currentOrder.shippingAddress.addressLine1}</Text>
                    {currentOrder.shippingAddress.addressLine2 && (
                        <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>{currentOrder.shippingAddress.addressLine2}</Text>
                    )}
                    <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
                        {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
                    </Text>
                    <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>Phone: {currentOrder.shippingAddress.phoneNumber}</Text>
                </View>

                {/* Price Summary */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Payment Summary</Text>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Total Amount</Text>
                        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>₹{currentOrder.totalAmount}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Payment Method</Text>
                        <Text style={[styles.value, { color: theme.colors.textPrimary }]}>{currentOrder.paymentMethod}</Text>
                    </View>
                </View>
            </ScrollView>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
    },
    content: {
        padding: 16,
    },
    section: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusLabel: {
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    statusValue: {
        fontSize: 14,
        fontFamily: Fonts.bold,
    },
    dateText: {
        fontSize: 12,
        fontFamily: Fonts.regular,
    },
    itemCard: {
        flexDirection: 'row',
        marginBottom: 12,
        borderBottomWidth: 1,
        paddingBottom: 12,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        marginBottom: 4,
    },
    itemMeta: {
        fontSize: 12,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: Fonts.bold,
    },
    addressText: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        marginBottom: 4,
        lineHeight: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
    },
    value: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
});
