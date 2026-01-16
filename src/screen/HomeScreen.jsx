import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
  StatusBar,
  RefreshControl,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { cartCount, addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [banners, setBanners] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Initialize with mock data while loading
  const initialCategories = [
    { id: 'electronics', name: 'Electronics', icon: 'laptop', color: '#FF6B6B' },
    { id: 'jewelery', name: 'Jewelry', icon: 'diamond-stone', color: '#4ECDC4' },
    { id: "men's clothing", name: "Men's Fashion", icon: 'tshirt-crew', color: '#FFD166' },
    { id: "women's clothing", name: "Women's Fashion", icon: 'hanger', color: '#6A0572' },
    { id: 'all', name: 'All', icon: 'view-grid', color: '#118AB2' },
  ];

  // Sample banners
  const bannerData = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% off",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
      color: "#FF6B6B"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Latest Collection",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      color: "#4ECDC4"
    },
  ];

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch all products from Fake Store API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      
      // Enhance product data with additional information
      const enhancedProducts = data.map(product => ({
        ...product,
        rating: {
          rate: product.rating?.rate || (Math.random() * 4 + 1).toFixed(1),
          count: product.rating?.count || Math.floor(Math.random() * 1000),
        },
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30 + 10) : 0,
        originalPrice: (product.price * (1 + Math.random() * 0.5)).toFixed(2),
        isNew: Math.random() > 0.8,
        isTrending: product.rating?.rate > 4.0 || Math.random() > 0.7,
        inStock: Math.random() > 0.1,
      }));
      
      setProducts(enhancedProducts);
      setBanners(bannerData);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const data = await response.json();
      
      // Map API categories to our format
      const mappedCategories = data.map(category => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        icon: getCategoryIcon(category),
        color: getCategoryColor(category),
      }));
      
      // Add "All" category
      setCategories([
        { id: 'all', name: 'All', icon: 'view-grid', color: '#118AB2' },
        ...mappedCategories
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(initialCategories);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      electronics: 'laptop',
      jewelery: 'diamond-stone',
      "men's clothing": 'tshirt-crew',
      "women's clothing": 'hanger',
    };
    return icons[category] || 'tag';
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics: '#FF6B6B',
      jewelery: '#4ECDC4',
      "men's clothing": '#FFD166',
      "women's clothing": '#6A0572',
    };
    return colors[category] || '#118AB2';
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
    fetchCategories();
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    
    Alert.alert(
      'Added to Cart!',
      `${product.title.substring(0, 30)}... has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  // Filter products by category
  const getProductsByCategory = (categoryId) => {
    if (categoryId === 'all') return products;
    return products.filter(product => product.category === categoryId);
  };

  // Get featured products (top rated)
  const getFeaturedProducts = () => {
    return [...products]
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, 8);
  };

  // Get best selling products (highest rating count)
  const getBestSellers = () => {
    return [...products]
      .sort((a, b) => b.rating.count - a.rating.count)
      .slice(0, 4);
  };

  // Get flash sale products (with discount)
  const getFlashSaleProducts = () => {
    return products
      .filter(product => product.discount > 0)
      .slice(0, 4);
  };

  const renderBannerItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.bannerCard, { backgroundColor: item.color }]}
      activeOpacity={0.9}
    >
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Shop Now</Text>
          <Icon name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Image 
        source={{ uri: item.image }} 
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => setActiveCategory(item.id)}
    >
      <View style={[
        styles.categoryIcon, 
        { backgroundColor: activeCategory === item.id ? item.color : item.color + '20' }
      ]}>
        <Icon 
          name={item.icon} 
          size={24} 
          color={activeCategory === item.id ? '#FFFFFF' : item.color} 
        />
      </View>
      <Text style={[
        styles.categoryName,
        activeCategory === item.id && styles.activeCategoryName
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage}
          resizeMode="contain"
        />
        
        {/* Badges */}
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}
        
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        
        {/* Quick Add to Cart */}
        <TouchableOpacity 
          style={styles.quickAddButton}
          onPress={() => handleAddToCart(item)}
        >
          <Icon name="cart-plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View style={styles.productDetails}>
        <Text style={styles.productCategory} numberOfLines={1}>
          {item.category}
        </Text>
        
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name={star <= Math.floor(item.rating.rate) ? "star" : "star-outline"}
                size={12}
                color="#F59E0B"
              />
            ))}
          </View>
          <Text style={styles.ratingText}>{item.rating.rate}</Text>
          <Text style={styles.reviewText}>({item.rating.count})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          {item.discount > 0 ? (
            <>
              <Text style={styles.currentPrice}>
                ${((parseFloat(item.price) * (100 - item.discount)) / 100).toFixed(2)}
              </Text>
              <Text style={styles.originalPrice}>${item.price}</Text>
            </>
          ) : (
            <Text style={styles.currentPrice}>${item.price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredProducts = getProductsByCategory(activeCategory);
  const featuredProducts = getFeaturedProducts();
  const bestSellers = getBestSellers();
  const flashSaleProducts = getFlashSaleProducts();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Icon name="storefront" size={28} color="#3B82F6" />
            <Text style={styles.logoText}>FakeStore</Text>
          </View>

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Icon name="magnify" size={24} color="#374151" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Icon name="cart-outline" size={24} color="#374151" />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.8}
        >
          <Icon name="magnify" size={20} color="#9CA3AF" />
          <Text style={styles.searchPlaceholder}>Search {products.length} products</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Banner Carousel */}
        <View style={styles.bannerContainer}>
          <FlatList
            data={banners}
            renderItem={renderBannerItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            decelerationRate="fast"
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.bannerPagination}>
            {banners.map((_, index) => (
              <View key={index} style={styles.paginationDot} />
            ))}
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Featured Products Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            renderItem={renderProductItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
        

        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && (
          <View style={[styles.sectionContainer, styles.flashSaleContainer]}>
            <View style={styles.flashSaleHeader}>
              <View style={styles.flashSaleTag}>
                <Icon name="flash" size={16} color="#FFFFFF" />
                <Text style={styles.flashSaleText}>FLASH SALE</Text>
              </View>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>Ends in </Text>
                <View style={styles.timerBox}>
                  <Text style={styles.timerNumber}>24</Text>
                  <Text style={styles.timerLabel}>HRS</Text>
                </View>
              </View>
            </View>
            
            <FlatList
              data={flashSaleProducts}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.flashSaleCard}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                >
                  <View style={styles.flashSaleImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.flashSaleImage} />
                  </View>
                  <View style={styles.flashSaleContent}>
                    <Text style={styles.flashSaleTitle} numberOfLines={2}>
                      {item.title.substring(0, 30)}...
                    </Text>
                    <View style={styles.flashSalePriceRow}>
                      <Text style={styles.flashSalePrice}>
                        ${((parseFloat(item.price) * (100 - item.discount)) / 100).toFixed(2)}
                      </Text>
                      <Text style={styles.flashSaleOriginalPrice}>${item.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flashSaleList}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}

        {/* Best Sellers Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Sellers</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products', { sort: 'popular' })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bestSellersGrid}>
            {bestSellers.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.bestSellerCard}
                onPress={() => navigation.navigate('ProductDetail', { product })}
              >
                <Image source={{ uri: product.image }} style={styles.bestSellerImage} />
                <View style={styles.bestSellerContent}>
                  <Text style={styles.bestSellerTitle} numberOfLines={2}>
                    {product.title.substring(0, 25)}...
                  </Text>
                  <View style={styles.bestSellerRating}>
                    <Icon name="star" size={12} color="#F59E0B" />
                    <Text style={styles.bestSellerRatingText}>{product.rating.rate}</Text>
                  </View>
                  <Text style={styles.bestSellerPrice}>${product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <TouchableOpacity style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Get 20% Off</Text>
            <Text style={styles.promoSubtitle}>On your first order</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <Icon name="gift-outline" size={80} color="#FFFFFF" style={styles.promoIcon} />
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 FakeStore. Powered by Fake Store API</Text>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
  },
  bannerContainer: {
    height: 200,
    marginTop: 8,
  },
  bannerCard: {
    width: width - 32,
    height: 180,
    borderRadius: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  bannerButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bannerImage: {
    width: 150,
    height: 180,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  productCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
  },
  activeCategoryName: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  featuredList: {
    paddingRight: 16,
  },
  flashSaleContainer: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
  },
  flashSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  flashSaleTag: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  flashSaleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 12,
    color: '#6B7280',
  },
  timerBox: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
    alignItems: 'center',
    minWidth: 40,
  },
  timerNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  timerLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  flashSaleList: {
    paddingRight: 16,
  },
  flashSaleCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  flashSaleImageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashSaleImage: {
    width: '80%',
    height: '80%',
  },
  flashSaleContent: {
    padding: 12,
  },
  flashSaleTitle: {
    fontSize: 12,
    color: '#111827',
    marginBottom: 8,
    height: 32,
  },
  flashSalePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flashSalePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  flashSaleOriginalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  bestSellersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bestSellerCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bestSellerImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F3F4F6',
  },
  bestSellerContent: {
    padding: 12,
  },
  bestSellerTitle: {
    fontSize: 13,
    color: '#111827',
    marginBottom: 8,
    height: 36,
  },
  bestSellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  bestSellerRatingText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  bestSellerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridProductCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gridImageContainer: {
    position: 'relative',
    height: 150,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridProductImage: {
    width: '80%',
    height: '80%',
  },
  gridDiscountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  gridDiscountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  gridProductContent: {
    padding: 12,
  },
  gridProductTitle: {
    fontSize: 13,
    color: '#111827',
    marginBottom: 8,
    height: 36,
  },
  gridPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridProductPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  gridRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridRatingText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },

   promoBanner: {
    backgroundColor: '#3B82F6',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  promoIcon: {
    opacity: 0.8,
  },

  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  productCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImageContainer: {
    position: 'relative',
    height: 150,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  quickAddButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    padding: 12,
  },
  productCategory: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    height: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
});

export default HomeScreen;