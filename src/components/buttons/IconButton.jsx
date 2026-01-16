import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';


const IconButton = ({
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
  circular = false,
  disabled = false,
  loading = false,
  badge,
  style,
  ...props
}) => {
  const sizeStyle = getSizeStyle(size);
  const variantStyle = getVariantStyle(variant);
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        sizeStyle,
        variantStyle.container,
        circular && styles.circular,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'default'}
          color={variantStyle.iconColor}
        />
      ) : (
        <>
          {icon}
          {badge && (
            <TouchableOpacity style={[styles.badge, { backgroundColor: variantStyle.badgeColor }]}>
              {badge}
            </TouchableOpacity>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const getSizeStyle = (size) => {
  const sizes = {
    small: {
      width: 32,
      height: 32,
      padding: 6,
    },
    medium: {
      width: 44,
      height: 44,
      padding: 10,
    },
    large: {
      width: 56,
      height: 56,
      padding: 14,
    },
  };
  return sizes[size] || sizes.medium;
};

const getVariantStyle = (variant) => {
  switch (variant) {
    case 'primary':
      return {
        container: styles.primary,
        iconColor: '#FFFFFF',
        badgeColor: '#EF4444',
      };
    case 'ghost':
      return {
        container: styles.ghost,
        iconColor: '#374151',
        badgeColor: '#EF4444',
      };
    case 'danger':
      return {
        container: styles.danger,
        iconColor: '#FFFFFF',
        badgeColor: '#DC2626',
      };
    case 'success':
      return {
        container: styles.success,
        iconColor: '#FFFFFF',
        badgeColor: '#059669',
      };
    default:
      return {
        container: styles.default,
        iconColor: '#374151',
        badgeColor: '#EF4444',
      };
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  circular: {
    borderRadius: 50,
  },
  default: {
    backgroundColor: '#F3F4F6',
  },
  primary: {
    backgroundColor: '#3B82F6',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#EF4444',
  },
  success: {
    backgroundColor: '#10B981',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});

IconButton.Sizes = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

IconButton.Variants = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  GHOST: 'ghost',
  DANGER: 'danger',
  SUCCESS: 'success',
};

export default IconButton;