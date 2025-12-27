import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CustomHeader } from '../components/CustomHeader';
import { Colors } from '../common/colors';
import { colors } from '../theme/colors';
import { Fonts } from '../common/fonts';
import apiService from '../services/ApiService';

const { width } = Dimensions.get('window');

interface Course {
  id: number;
  title: string;
  instructor: string;
  image: string;
  price: number;
  rating: number;
  students: number;
}

interface ApiCourse {
  id: number;
  title: string;
  instructor: string;
  image: string;
  price: number;
  category: string;
}

interface Category {
  id: number;
  title: string;
  icon: string;
  count: number;
}

// Hero banner data
const HERO_BANNERS = [
  {
    id: 1,
    title: 'New Arrival',
    subtitle: 'Kundan Gold Collection',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Special Offer',
    subtitle: 'Diamond Bangles 20% OFF',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Festive Collection',
    subtitle: 'Traditional Meenakari Sets',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=400&fit=crop',
  },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % HERO_BANNERS.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const loadHomeData = async () => {
    try {
      console.log('Loading home data...');

      // Dummy featured bangles data
      const dummyProducts = [
        {
          id: 1,
          title: 'Royal Kundan Gold Bangles',
          instructor: 'Traditional Elegance',
          image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop',
          price: 15999,
          rating: 4.8,
          students: 342,
        },
        {
          id: 2,
          title: 'Diamond Studded Pearl Bangles',
          instructor: 'Luxury Collection',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
          price: 28999,
          rating: 4.9,
          students: 567,
        },
        {
          id: 3,
          title: 'Meenakari Colorful Bangles Set',
          instructor: 'Rajasthani Craft',
          image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=300&fit=crop',
          price: 8999,
          rating: 4.6,
          students: 789,
        },
        {
          id: 4,
          title: 'Antique Temple Design Bangles',
          instructor: 'Heritage Collection',
          image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
          price: 12499,
          rating: 4.7,
          students: 423,
        },
      ];

      setFeaturedCourses(dummyProducts);

      // Bangles categories
      setCategories([
        { id: 1, title: 'Gold', icon: '✨', count: 120 },
        { id: 2, title: 'Diamond', icon: '💎', count: 85 },
        { id: 3, title: 'Glass', icon: '🔮', count: 95 },
        { id: 4, title: 'Metal', icon: '⚡', count: 67 },
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
      setFeaturedCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  const navigateToCourses = () => {
    navigation.navigate('Collections');
  };

  const navigateToCategory = (categoryId: number) => {
    navigation.navigate('CategoryCourses', { categoryId });
  };

  const navigateToCourseDetail = (courseId: number) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  const renderWelcomeSection = () => (
    <View style={styles.bannerContainer}>
      <FlatList
        ref={flatListRef}
        data={HERO_BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentBannerIndex(index);
        }}
        renderItem={({ item }) => (
          <LinearGradient
            colors={[colors.primary.main, colors.secondary.main]}
            style={styles.welcomeSection}
          >
            <Image source={{ uri: item.image }} style={styles.bannerImage} />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>{item.title}</Text>
              <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
            </View>
          </LinearGradient>
        )}
      />
      <View style={styles.paginationContainer}>
        {HERO_BANNERS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentBannerIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Links</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Collections')}
        >
          <Text style={styles.quickActionIcon}>🛍️</Text>
          <Text style={styles.quickActionText}>Shop by Category</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.quickActionIcon}>🛒</Text>
          <Text style={styles.quickActionText}>View Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.quickActionIcon}>📦</Text>
          <Text style={styles.quickActionText}>My Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => navigateToCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryCount}>{category.count} bangles</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFeaturedCourses = () => (
    <View style={styles.featuredCoursesContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Bangles</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {featuredCourses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💍</Text>
          <Text style={styles.emptyTitle}>No bangles available</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new collections
          </Text>
        </View>
      ) : (
        featuredCourses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => navigateToCourseDetail(course.id)}
          >
            <Image source={{ uri: course.image }} style={styles.courseImage} />
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle} numberOfLines={2}>
                {course.title}
              </Text>
              <Text style={styles.courseInstructor}>Design: {course.instructor}</Text>
              <View style={styles.courseStats}>
                <Text style={styles.courseRating}>⭐ {course.rating}</Text>
                <Text style={styles.courseStudents}>💬 {course.students} reviews</Text>
                <Text style={styles.coursePrice}>₹{course.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Jaipur Bangles" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Jaipur Bangles" />

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {renderWelcomeSection()}
        {renderQuickActions()}
        {renderCategories()}
        {renderFeaturedCourses()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    width: width,
    height: 250,
  },
  welcomeSection: {
    width: width,
    height: 250,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.3,
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  bannerTitle: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: Colors.textLight,
    width: 24,
  },
  welcomeTitle: {
    fontSize: Fonts.size.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: Colors.textLight,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: Fonts.size.xl,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (width - 60) / 2,
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  categoriesContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  categoriesScroll: {
    marginHorizontal: -4,
  },
  categoryCard: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    minWidth: 100,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: Fonts.size.xs,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  featuredCoursesContainer: {
    padding: 20,
  },
  courseCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  courseContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseRating: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  courseStudents: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  coursePrice: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
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
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: Fonts.size.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});