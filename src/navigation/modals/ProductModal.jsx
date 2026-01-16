import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  Alert
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const ProductModal = ({
  visible,
  product,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  itemQuantityInCart = 0,
  navigation
}) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const slideAnim = useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(height);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      setQuantity(1);
      setSelectedSize('M');
      setSelectedColor('Black');
    });
  };

  const handleAddToCartPress = () => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    onAddToCart(product);
    Alert.alert(
      'Added to Cart!',
      `${product.title} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => {
          handleClose();
          navigation.navigate('Cart');
        }}
      ]
    );
  };

  const handleBuyNow = () => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    // In a real app, you would add to cart and navigate to checkout
    onAddToCart(product);
    handleClose();
    navigation.navigate('Cart');
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const getColorHex = (colorName) => {
    const colors = {
      'Red': '#EF4444',
      'Blue': '#3B82F6',
      'Black': '#000000',
      'White': '#FFFFFF',
      'Green': '#10B981',
      'Yellow': '#F59E0B',
      'Purple': '#8B5CF6',
    };
    return colors[colorName] || '#E5E7EB';
  };

  if (!product) return null;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          onPress={handleClose}
          activeOpacity={1}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Product Image Gallery */}
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            style={styles.modalImageContainer}
          >
            <Image 
              source={{ uri: product.image }} 
              style={styles.modalProductImage}
              resizeMode="contain"
            />
            {/* Add more images here if available */}
            <View style={styles.additionalImagePlaceholder}>
              <Text style={styles.additionalImageText}>Additional Image</Text>
            </View>
          </ScrollView>
          
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Icon name="close" size={24} color="#374151" />
          </TouchableOpacity>
          
          {/* Favorite Button */}
          <TouchableOpacity 
            style={styles.modalFavoriteButton}
            onPress={onToggleFavorite}
          >
            <Icon 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#EF4444" : "#374151"} 
            />
          </TouchableOpacity>

          {/* Product Details */}
          <ScrollView style={styles.modalContent}>
            {/* Category and Rating */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategory}>
                {product.category.toUpperCase()}
              </Text>
              <View style={styles.modalRating}>
                <Icon name="star" size={16} color="#F59E0B" />
                <Text style={styles.modalRatingText}>
                  {product.rating} ({product.reviewCount} reviews)
                </Text>
              </View>
            </View>
            
            {/* Product Title */}
            <Text style={styles.modalProductName}>
              {product.title}
            </Text>
            
            {/* Price */}
            <View style={styles.modalPriceContainer}>
              {product.discount > 0 ? (
                <>
                  <Text style={styles.modalCurrentPrice}>
                    ${((parseFloat(product.price) * (100 - product.discount)) / 100).toFixed(2)}
                  </Text>
                  <Text style={styles.modalOriginalPrice}>
                    ${product.price}
                  </Text>
                  <View style={styles.discountTag}>
                    <Text style={styles.discountTagText}>
                      Save {product.discount}%
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.modalCurrentPrice}>
                  ${product.price}
                </Text>
              )}
            </View>
            
            {/* Stock Status */}
            <View style={styles.modalStockStatus}>
              <Icon 
                name={product.inStock ? "check-circle" : "close-circle"} 
                size={20} 
                color={product.inStock ? "#10B981" : "#EF4444"} 
              />
              <Text style={[
                styles.modalStockText,
                { color: product.inStock ? "#10B981" : "#EF4444" }
              ]}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
              {itemQuantityInCart > 0 && (
                <Text style={styles.inCartText}>
                  ({itemQuantityInCart} in cart)
                </Text>
              )}
            </View>
            
            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>
                {product.description}
              </Text>
            </View>
            
            {/* Sizes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.sizeContainer}>
                {product.sizes?.map((size) => (
                  <TouchableOpacity 
                    key={size} 
                    style={[
                      styles.sizeButton,
                      selectedSize === size && styles.selectedSizeButton
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[
                      styles.sizeButtonText,
                      selectedSize === size && styles.selectedSizeButtonText
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Colors */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorContainer}>
                {product.colors?.map((color) => (
                  <TouchableOpacity 
                    key={color} 
                    style={[
                      styles.colorButton,
                      { backgroundColor: getColorHex(color) },
                      selectedColor === color && styles.selectedColorButton
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Icon name="check" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.selectedColorText}>
                Selected: {selectedColor}
              </Text>
            </View>
            
            {/* Quantity Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Icon name="minus" size={20} color={quantity <= 1 ? "#9CA3AF" : "#374151"} />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={increaseQuantity}
                  disabled={!product.inStock}
                >
                  <Icon name="plus" size={20} color={!product.inStock ? "#9CA3AF" : "#374151"} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Icon name="truck-fast" size={20} color="#3B82F6" />
                <Text style={styles.featureText}>Free Shipping</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="shield-check" size={20} color="#10B981" />
                <Text style={styles.featureText}>2 Year Warranty</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="swap-horizontal" size={20} color="#F59E0B" />
                <Text style={styles.featureText}>30 Day Returns</Text>
              </View>
            </View>
          </ScrollView>
          
          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.wishlistButton]}
              onPress={onToggleFavorite}
            >
              <Icon 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={20} 
                color="#374151" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.addToCartModalButton,
                !product.inStock && styles.disabledButton
              ]}
              disabled={!product.inStock}
              onPress={handleAddToCartPress}
            >
              <Icon name="cart-plus" size={20} color="#FFFFFF" />
              <Text style={styles.addToCartModalText}>
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.buyNowButton,
                !product.inStock && styles.disabledButton
              ]}
              disabled={!product.inStock}
              onPress={handleBuyNow}
            >
              <Icon name="flash" size={20} color="#FFFFFF" />
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalImageContainer: {
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  modalProductImage: {
    width: width,
    height: 300,
  },
  additionalImagePlaceholder: {
    width: width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  additionalImageText: {
    color: '#6B7280',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalFavoriteButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    padding: 20,
    maxHeight: height * 0.5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalRatingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalProductName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 28,
  },
  modalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalCurrentPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  modalOriginalPrice: {
    fontSize: 18,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discountTag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountTagText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  modalStockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  modalStockText: {
    fontSize: 16,
    fontWeight: '500',
  },
  inCartText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  selectedSizeButton: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  sizeButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedSizeButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  selectedColorText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    minWidth: 40,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureItem: {
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  wishlistButton: {
    width: 60,
    backgroundColor: '#F3F4F6',
  },
  addToCartModalButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
  },
  buyNowButton: {
    flex: 2,
    backgroundColor: '#111827',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  addToCartModalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductModal;