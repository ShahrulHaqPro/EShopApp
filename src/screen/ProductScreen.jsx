import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from '@react-native-vector-icons/ionicons';
import ProductModal from "../navigation/modals/ProductModal";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");
const cardWidth = (width - 40) / 2;

const ProductScreen = ({ navigation }) => {
  const { addToCart, cartCount, getItemCount } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [favorites, setFavorites] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Add some additional data to match e-commerce needs
      const enhancedData = data.map((product) => ({
        ...product,
        rating: (Math.random() * 4 + 1).toFixed(1),
        reviewCount: Math.floor(Math.random() * 1000),
        isFavorite: false,
        inStock: Math.random() > 0.1,
        discount: Math.random() > 0.3 ? Math.floor(Math.random() * 50 + 10) : 0,
        originalPrice: (product.price * 1.3).toFixed(2),
        sizes: ["S", "M", "L", "XL"],
        colors: ["Red", "Blue", "Black", "White"],
      }));

      setProducts(enhancedData);
      setFilteredProducts(enhancedData);

      // Extract unique categories
      const uniqueCategories = ["all", ...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddToCart = (product) => {
    if (!product.inStock) {
      Alert.alert("Out of Stock", "This product is currently out of stock.");
      return;
    }

    addToCart(product, 1);

    // Alert.alert(
    //   'Added to Cart!',
    //   `${product.title} has been added to your cart.`,
    //   [
    //     { text: 'Continue Shopping', style: 'cancel' },
    //     { text: 'View Cart', onPress: () => navigation.navigate('Cart') }
    //   ]
    // );
  };

  const renderProductCard = ({ item }) => {
    const itemQuantityInCart = getItemCount(item.id);
    const isItemInCart = itemQuantityInCart > 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => openProductModal(item)}
      >
        {/* Product Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />

          {/* Discount Badge */}
          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{item.discount}%</Text>
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
          >
            <Icon
              name={favorites[item.id] ? "heart" : "heart-outline"}
              size={20}
              color={favorites[item.id] ? "#EF4444" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        {/* Product Details */}
        <View style={styles.productDetails}>
          {/* Category */}
          <Text style={styles.categoryText} numberOfLines={1}>
            {item.category}
          </Text>

          {/* Product Title */}
          <Text style={styles.productName} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Rating Section */}
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name={
                    star <= Math.floor(parseFloat(item.rating))
                      ? "star"
                      : "star-outline"
                  }
                  size={12}
                  color="#F59E0B"
                />
              ))}
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <Text style={styles.reviewText}>({item.reviewCount})</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceContainer}>
            {item.discount > 0 ? (
              <>
                <Text style={styles.currentPrice}>
                  $
                  {(
                    (parseFloat(item.price) * (100 - item.discount)) /
                    100
                  ).toFixed(2)}
                </Text>
                <Text style={styles.originalPrice}>${item.price}</Text>
              </>
            ) : (
              <Text style={styles.currentPrice}>${item.price}</Text>
            )}
          </View>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            {item.inStock ? (
              <View style={styles.inStock}>
                <View style={styles.stockDot} />
                <Text style={styles.stockText}>In Stock</Text>
              </View>
            ) : (
              <Text style={styles.outOfStock}>Out of Stock</Text>
            )}
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              !item.inStock && styles.disabledButton,
              isItemInCart && styles.inCartButton,
            ]}
            disabled={!item.inStock}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart(item);
            }}
          >
            {isItemInCart ? (
              <>
                <Icon name="check" size={16} color="#FFFFFF" />
                <Text style={styles.addToCartText}>
                  {itemQuantityInCart} in Cart
                </Text>
              </>
            ) : (
              <>
                <Icon name="cart-plus" size={16} color="#FFFFFF" />
                <Text style={styles.addToCartText}>
                  {item.inStock ? "Add to Cart" : "Out of Stock"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading State
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Icon name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.errorTitle}>Failed to Load Products</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Empty State
  if (filteredProducts.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Icon name="package-variant" size={64} color="#6B7280" />
        <Text style={styles.emptyTitle}>No Products Found</Text>
        <Text style={styles.emptyText}>
          {selectedCategory !== "all"
            ? `No products in ${selectedCategory} category`
            : "No products available"}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => filterByCategory("all")}
        >
          <Text style={styles.retryButtonText}>View All Products</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeareaContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>

          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'baseline' }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={24} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Gift Shop</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="magnify" size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate("Cart")}
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

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => filterByCategory(category)}
            >
              <View
                style={[
                  styles.categoryButton,
                  selectedCategory === category &&
                  styles.selectedCategoryButton,
                ]}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category &&
                    styles.selectedCategoryButtonText,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Count */}
        <View style={styles.productCountContainer}>
          <Text style={styles.productCountText}>
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </Text>
        </View>

        {/* Product Grid */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === "all" ? "All Products" : selectedCategory}
              </Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                End of products • {filteredProducts.length} items
              </Text>
            </View>
          }
        />
      </View>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          visible={modalVisible}
          product={selectedProduct}
          onClose={() => setModalVisible(false)}
          onAddToCart={handleAddToCart}
          isFavorite={!!favorites[selectedProduct.id]}
          onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
          itemQuantityInCart={getItemCount(selectedProduct.id)}
          navigation={navigation}
        />
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeareaContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    // flex: 1,
    paddingHorizontal: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#f8fafc",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerButton: {
    position: "relative",
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  categoriesContainer: {
    // marginBottom: 8,
    // maxHeight: 40,
  },
  categoryButton: {
    backgroundColor: "#FFFFFF",
    // paddingHorizontal: 16,
    padding: 10,
    // paddingVertical: 8,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 40,
    minWidth: 60,
  },
  selectedCategoryButton: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  categoryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCategoryButtonText: {
    color: "#FFFFFF",
  },
  productCountContainer: {
    marginBottom: 8,
  },
  productCountText: {
    color: "#6B7280",
    fontSize: 13,
  },
  listHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  productsGrid: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    height: 150,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  productDetails: {
    padding: 12,
  },
  categoryText: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    height: 36,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 11,
    color: "#6B7280",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  originalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  stockContainer: {
    marginBottom: 12,
  },
  inStock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  stockText: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "500",
  },
  outOfStock: {
    fontSize: 11,
    color: "#EF4444",
    fontWeight: "500",
  },
  addToCartButton: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  inCartButton: {
    backgroundColor: "#10B981",
  },
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },
});

export default ProductScreen;


//===============================================
// import { View, StyleSheet, ScrollView } from "react-native";
// import ProductCard from "../components/ProductCard";

// export default function ProductScreen() {
//   return (
//           <ScrollView style={styles.container}>
//               <View style={styles.cardContainer}>
//                   <ProductCard style={styles.card} />
//                   <ProductCard style={styles.card} />
//                   <ProductCard style={styles.card} />
//                   <ProductCard style={styles.card} />
//                   <ProductCard style={styles.card} />
//               </View>
//           </ScrollView>
//       );
//   }

//   const styles = StyleSheet.create({
//       container: {
//           flex: 1,
//           // alignItems: "center",
//           // justifyContent: "center",
//       },
//       text: {
//           fontSize: 24,
//           fontWeight: "bold",
//           marginBottom: 16,
//       },
//       cardContainer:{
//           flexWrap:'wrap',
//           flexDirection:'row',
//           gap:10,
//           alignItems: "center",
//           justifyContent: "center",

//       },
//       card:{

//       }
//   });

//============================================================


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   SafeAreaView,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { useProducts, apiUtils } from '../api';

// const ProductsScreen = () => {
//   const { getAllProducts, loading, error, execute: fetchProducts } = useProducts();
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchProducts();
//     setRefreshing(false);
//   };

//   const renderProduct = ({ item }) => (
//     <TouchableOpacity style={styles.productCard}>
//       <Image source={{ uri: item.image }} style={styles.productImage} />
//       <View style={styles.productInfo}>
//         <Text style={styles.productTitle} numberOfLines={2}>
//           {item.title}
//         </Text>
//         <Text style={styles.productCategory}>{item.category}</Text>
//         <View style={styles.ratingContainer}>
//           <Text style={styles.ratingText}>⭐ {item.rating.rate}</Text>
//           <Text style={styles.ratingCount}>({item.rating.count})</Text>
//         </View>
//         <Text style={styles.productPrice}>{apiUtils.formatPrice(item.price)}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#4F46E5" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>Error: {error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={getAllProducts.data || []}
//         renderItem={renderProduct}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         columnWrapperStyle={styles.columnWrapper}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListHeaderComponent={
//           <View style={styles.header}>
//             <Text style={styles.headerTitle}>All Products</Text>
//             <Text style={styles.headerSubtitle}>
//               {getAllProducts.data?.length || 0} products available
//             </Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8FAFC',
//   },
//   listContainer: {
//     padding: 16,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   header: {
//     marginBottom: 20,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   productCard: {
//     flex: 0.48,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   productImage: {
//     width: '100%',
//     height: 120,
//     resizeMode: 'contain',
//     marginBottom: 12,
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 4,
//     height: 40,
//   },
//   productCategory: {
//     fontSize: 12,
//     color: '#6B7280',
//     textTransform: 'capitalize',
//     marginBottom: 8,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   ratingText: {
//     fontSize: 12,
//     color: '#F59E0B',
//     marginRight: 4,
//   },
//   ratingCount: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#EF4444',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   retryButton: {
//     backgroundColor: '#4F46E5',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default ProductsScreen;