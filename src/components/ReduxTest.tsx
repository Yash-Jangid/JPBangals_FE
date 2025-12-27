import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loginUser, logoutUser } from '../store/slices/authSlice';

export const ReduxTest: React.FC = () => {
	const dispatch = useAppDispatch();
	const { isAuthenticated, user, loading, error } = useAppSelector((state) => state.auth);

	const handleTestLogin = () => {
		dispatch(loginUser({ email: 'test@example.com', password: 'password' }));
	};

	const handleLogout = () => {
		dispatch(logoutUser());
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Redux Test Component</Text>
			<Text style={styles.status}>Authentication Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}</Text>
			{user && <Text style={styles.userInfo}>User: {user.name} ({user.email})</Text>}
			{loading && <Text style={styles.loading}>Loading...</Text>}
			{error && <Text style={styles.error}>Error: {error}</Text>}
			<TouchableOpacity style={styles.button} onPress={handleTestLogin}>
				<Text style={styles.buttonText}>Test Login</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={handleLogout}>
				<Text style={styles.buttonText}>Logout</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { padding: 20, backgroundColor: '#f5f5f5' },
	title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
	status: { fontSize: 16, marginBottom: 5 },
	userInfo: { fontSize: 14, marginBottom: 5 },
	loading: { fontSize: 14, color: 'blue', marginBottom: 5 },
	error: { fontSize: 14, color: 'red', marginBottom: 10 },
	button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, marginBottom: 10 },
	buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});
