import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';

const SecondaryButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'default',
  outline = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const variantStyle = getVariantStyle(variant, outline);
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        variantStyle.container,
        outline && styles.outline,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text.color} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[styles.text, variantStyle.text, textStyle]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const getVariantStyle = (variant, outline) => {
  const baseStyles = {
    container: {
      borderWidth: outline ? 1 : 0,
      backgroundColor: outline ? 'transparent' : getBackgroundColor(variant),
      borderColor: getBorderColor(variant),
    },
    text: {
      color: outline ? getTextColor(variant) : '#FFFFFF',
    },
  };
  
  return baseStyles;
};

const getBackgroundColor = (variant) => {
  switch (variant) {
    case 'success': return '#4CAF50';
    case 'warning': return '#FF9800';
    case 'info': return '#2196F3';
    case 'neutral': return '#6B7280';
    default: return '#374151'; // Default dark gray
  }
};

const getBorderColor = (variant) => {
  switch (variant) {
    case 'success': return '#4CAF50';
    case 'warning': return '#FF9800';
    case 'info': return '#2196F3';
    case 'neutral': return '#6B7280';
    default: return '#374151';
  }
};

const getTextColor = (variant) => {
  switch (variant) {
    case 'success': return '#4CAF50';
    case 'warning': return '#FF9800';
    case 'info': return '#2196F3';
    case 'neutral': return '#6B7280';
    default: return '#374151';
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  outline: {
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

SecondaryButton.Variants = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  NEUTRAL: 'neutral',
};

export default SecondaryButton;