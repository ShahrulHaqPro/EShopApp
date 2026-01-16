import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

const SubtitleText = ({ 
  children, 
  style, 
  color = '#666666',
  align = 'left',
  muted = false,
  numberOfLines,
  ...props 
}) => {
  return (
    <Text
      style={[
        styles.subtitle,
        { color, textAlign: align },
        muted && styles.muted,
        style,
      ]}
      numberOfLines={numberOfLines}
      maxFontSizeMultiplier={1.3}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: Platform.OS === 'android' ? 16 : 17,
    fontFamily: Platform.select({
      android: 'sans-serif', // Regular system font
      ios: 'System',
    }),
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    lineHeight: 22,
    letterSpacing: 0.25,
    marginBottom: 2,
  },
  muted: {
    color: '#999999',
    opacity: 0.8,
  },
});

// Subtitle variants
SubtitleText.Variants = {
  LEADING: StyleSheet.create({
    leading: {
      fontSize: Platform.OS === 'android' ? 14 : 15,
      fontFamily: Platform.select({
        android: 'sans-serif',
        ios: 'System',
      }),
      letterSpacing: 0.1,
      lineHeight: 20,
    },
  }).leading,
  CAPTION: StyleSheet.create({
    caption: {
      fontSize: Platform.OS === 'android' ? 12 : 13,
      fontFamily: Platform.select({
        android: 'sans-serif',
        ios: 'System',
      }),
      letterSpacing: 0.4,
      lineHeight: 16,
    },
  }).caption,
};

export default SubtitleText;