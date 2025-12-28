import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '../common/fonts';
import { useTheme } from '../theme/ThemeContext';

interface FooterItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface CustomFooterProps {
  items: FooterItem[];
  activeItem?: string;
}

export const CustomFooter: React.FC<CustomFooterProps> = ({
  items,
  activeItem,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.border,
      }]}
      edges={['bottom']}
    >
      <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.footerItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                isActive && { backgroundColor: theme.isDark ? 'rgba(212, 175, 55, 0.15)' : '#F5F0E8' }
              ]}>
                <Text style={styles.footerIcon}>
                  {item.icon}
                </Text>
              </View>
              <Text
                style={[
                  styles.footerLabel,
                  { color: isActive ? theme.colors.primary : theme.colors.textSecondary },
                  isActive && styles.activeLabel,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  footerIcon: {
    fontSize: 22,
  },
  footerLabel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  activeLabel: {
    fontFamily: Fonts.semiBold,
  },
});
