import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../common/colors';
import { Fonts } from '../common/fonts';

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
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.footerItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.footerIcon,
                activeItem === item.id && styles.activeIcon,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                styles.footerLabel,
                activeItem === item.id && styles.activeLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 8,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  footerIcon: {
    fontSize: 20,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  activeIcon: {
    color: Colors.primary,
  },
  footerLabel: {
    fontSize: Fonts.size.xs,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  activeLabel: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },
});
