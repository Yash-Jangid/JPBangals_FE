import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface ProfileSectionProps {
  title: string;
  icon?: string;
  onViewAll?: () => void;
  viewAllText?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showEmptyState?: boolean;
}

export const ProfileSection = memo<ProfileSectionProps>(({
  title,
  icon,
  onViewAll,
  viewAllText = 'View All',
  children,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  showEmptyState = false,
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surfaceHighlight }]}>
          <View style={styles.sectionTitleContainer}>
            {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.h3.fontFamily }]}>{title}</Text>
          </View>
          {onViewAll && (
            <View style={[styles.loadingIndicator, { backgroundColor: theme.colors.border }]}>
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary, fontFamily: theme.typography.caption.fontFamily }]}>Loading...</Text>
            </View>
          )}
        </View>
        <View style={[styles.loadingContent, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary, fontFamily: theme.typography.caption.fontFamily }]}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surfaceHighlight }]}>
          <View style={styles.sectionTitleContainer}>
            {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.h3.fontFamily }]}>{title}</Text>
          </View>
        </View>
        <View style={[styles.errorContent, { backgroundColor: theme.colors.error + '10', borderColor: theme.colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: theme.colors.error, fontFamily: theme.typography.body2.fontFamily }]}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  if (showEmptyState) {
    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surfaceHighlight }]}>
          <View style={styles.sectionTitleContainer}>
            {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.h3.fontFamily }]}>{title}</Text>
          </View>
          {onViewAll && (
            <TouchableOpacity onPress={onViewAll}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary, fontFamily: theme.typography.body2.fontFamily }]}>{viewAllText}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.emptyContent, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary, fontFamily: theme.typography.body2.fontFamily }]}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surfaceHighlight }]}>
        <View style={styles.sectionTitleContainer}>
          {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: theme.typography.h3.fontFamily }]}>{title}</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary, fontFamily: theme.typography.body2.fontFamily }]}>{viewAllText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
  },
  loadingIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 12,
  },
  loadingContent: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  errorContent: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContent: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
