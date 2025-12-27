import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';
import { colors } from './colors';

const fontConfig = {
  fontFamily: 'System',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary.main,
    onPrimary: colors.primary.contrast,
    primaryContainer: colors.primary.light,
    onPrimaryContainer: colors.primary.dark,
    
    secondary: colors.secondary.main,
    onSecondary: colors.secondary.contrast,
    secondaryContainer: colors.secondary.light,
    onSecondaryContainer: colors.secondary.dark,
    
    error: colors.semantic.error,
    background: colors.background.primary,
    surface: colors.background.primary,
    surfaceVariant: colors.background.secondary,
    
    outline: colors.border.medium,
  },
  fonts: configureFonts({config: fontConfig}),
};
