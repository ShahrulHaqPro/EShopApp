import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BuyNowButton = ({
  price,
  discountPrice,
  onPress,
  disabled = false,
  showBadge = false,
  badgeText = 'DEAL',
  style,
}) => {
  const hasDiscount = discountPrice && discountPrice < price;
  
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Icon name="flash" size={20} color="#FFFFFF" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>Buy Now</Text>
          <Text style={styles.subText}>Fast checkout</Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        {hasDiscount ? (
          <>
            <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
            <Text style={styles.discountPrice}>${discountPrice.toFixed(2)}</Text>
          </>
        ) : (
          <Text style={styles.price}>${price.toFixed(2)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flexDirection: 'column',
  },
  mainText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  subText: {
    color: '#D1D5DB',
    fontSize: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  originalPrice: {
    color: '#9CA3AF',
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  discountPrice: {
    color: '#10B981',
    fontSize: 22,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default BuyNowButton;