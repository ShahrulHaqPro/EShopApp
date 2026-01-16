import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddToCartButton = ({
  price,
  onAddToCart,
  initialQuantity = 0,
  showQuantitySelector = true,
  disabled = false,
  style,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const scaleAnim = new Animated.Value(1);

  const handleAddToCart = () => {
    if (showQuantitySelector && quantity === 0) {
      setQuantity(1);
    } else {
      onAddToCart?.(quantity || 1);
    }
    
    // Animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  };

  if (showQuantitySelector && quantity > 0) {
    return (
      <View style={[styles.quantityContainer, style]}>
        <TouchableOpacity
          style={[styles.quantityButton, styles.decreaseButton]}
          onPress={handleDecrease}
          disabled={disabled}
        >
          <Icon name="minus" size={20} color="#374151" />
        </TouchableOpacity>
        
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantityText}>{quantity}</Text>
          <Text style={styles.quantityLabel}>in cart</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.quantityButton, styles.increaseButton]}
          onPress={handleIncrease}
          disabled={disabled}
        >
          <Icon name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => onAddToCart?.(quantity)}
          disabled={disabled}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.container, disabled && styles.disabled, style]}
        onPress={handleAddToCart}
        disabled={disabled}
        activeOpacity={0.9}
      >
        <Icon name="cart-plus" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.text}>Add to Cart</Text>
        {price && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${price.toFixed(2)}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 52,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  priceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 48,
  },
  quantityButton: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  decreaseButton: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  increaseButton: {
    backgroundColor: '#10B981',
  },
  quantityDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  quantityLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AddToCartButton;