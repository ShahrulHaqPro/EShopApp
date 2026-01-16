import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

const TitleText = ({ 
  children, 
  style, 
  color = '#000000',
  align = 'left',
  numberOfLines,
  ...props 
}) => {
  return (
    <Text
      style={[
        styles.title,
        { color, textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
      maxFontSizeMultiplier={1.2} // Android accessibility
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: Platform.OS === 'android' ? 20 : 22,
    fontFamily: Platform.select({
      android: 'sans-serif-medium', // Android system font
      ios: 'System',
    }),
    fontWeight: Platform.OS === 'ios' ? '600' : '400', // Android uses fontFamily for weight
    lineHeight: 28,
    letterSpacing: 0.15,
    marginBottom: 4,
  },
});

// Variant sizes
TitleText.Variants = {
  LARGE: StyleSheet.create({
    large: {
      fontSize: Platform.OS === 'android' ? 24 : 26,
      fontFamily: Platform.select({
        android: 'sans-serif-medium',
        ios: 'System',
      }),
      lineHeight: 32,
      letterSpacing: 0,
    },
  }).large,
  MEDIUM: StyleSheet.create({
    medium: {
      fontSize: Platform.OS === 'android' ? 20 : 22,
      lineHeight: 28,
    },
  }).medium,
  SMALL: StyleSheet.create({
    small: {
      fontSize: Platform.OS === 'android' ? 18 : 20,
      lineHeight: 24,
    },
  }).small,
};

export default TitleText;