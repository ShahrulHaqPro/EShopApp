import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const TextButton = ({
  title,
  onPress,
  disabled = false,
  underline = false,
  color = '#3B82F6',
  align = 'center',
  leftIcon,
  rightIcon,
  size = 'medium',
  style,
  textStyle,
  ...props
}) => {
  const textSizeStyle = getTextSizeStyle(size);
  
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <Text
        style={[
          styles.text,
          textSizeStyle,
          { color, textAlign: align },
          underline && styles.underline,
          disabled && styles.disabled,
          textStyle,
        ]}
      >
        {title}
      </Text>
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

const getTextSizeStyle = (size) => {
  switch (size) {
    case 'small':
      return { fontSize: 13 };
    case 'large':
      return { fontSize: 16 };
    case 'medium':
    default:
      return { fontSize: 14 };
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  text: {
    fontWeight: '500',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  disabled: {
    opacity: 0.5,
  },
  leftIcon: {
    marginRight: 6,
  },
  rightIcon: {
    marginLeft: 6,
  },
});

TextButton.Sizes = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

export default TextButton;