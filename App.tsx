import React, { useEffect } from 'react';
import { StatusBar, View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AppNavigator } from './src/navigation/AppNavigator';
import { Colors } from './src/common/colors';
import { Fonts } from './src/common/fonts';
import { store, persistor } from './src/store';
// import socialLoginService from './src/services/SocialLoginService';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { AuthListener } from './src/components/AuthListener';
import { CustomAlertProvider } from './src/components/ui/CustomAlertProvider';

const AppContent: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CustomAlertProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </CustomAlertProvider>
      </GestureHandlerRootView>
    </View>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    console.log('🏁 [SplashTrace] JS: App Root Provider mounted.');
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => console.log('🏁 [SplashTrace] JS: PersistGate onBeforeLift (Redux Hydrated)')}
      >
        <ThemeProvider>
          <AuthListener />
          <AppContent />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
});

export default App;