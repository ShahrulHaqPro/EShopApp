import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

const BodyText = ({ 
  children, 
  style, 
  color = '#333333',
  align = 'left',
  size = 'medium',
  bold = false,
  italic = false,
  numberOfLines,
  selectable = false, // Useful for Android text selection
  ...props 
}) => {
  const sizeStyle = getSizeStyle(size);
  
  return (
    <Text
      style={[
        styles.body,
        sizeStyle,
        { color, textAlign: align },
        bold && styles.bold,
        italic && styles.italic,
        style,
      ]}
      numberOfLines={numberOfLines}
      selectable={selectable}
      maxFontSizeMultiplier={1.5} // Higher for body text accessibility
      {...props}
    >
      {children}
    </Text>
  );
};

const getSizeStyle = (size) => {
  switch(size) {
    case 'small':
      return styles.small;
    case 'large':
      return styles.large;
    case 'medium':
    default:
      return styles.medium;
  }
};

const styles = StyleSheet.create({
  body: {
    fontFamily: Platform.select({
      android: 'sans-serif', // Default system font
      ios: 'System',
    }),
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  medium: {
    fontSize: Platform.OS === 'android' ? 14 : 16,
    lineHeight: Platform.OS === 'android' ? 20 : 22,
  },
  large: {
    fontSize: Platform.OS === 'android' ? 16 : 18,
    lineHeight: Platform.OS === 'android' ? 24 : 26,
    letterSpacing: 0.5,
  },
  small: {
    fontSize: Platform.OS === 'android' ? 12 : 14,
    lineHeight: Platform.OS === 'android' ? 16 : 18,
    letterSpacing: 0.4,
  },
  bold: {
    fontFamily: Platform.select({
      android: 'sans-serif-medium',
      ios: 'System',
    }),
    fontWeight: Platform.OS === 'ios' ? '600' : '400',
  },
  italic: {
    fontStyle: 'italic',
  },
});

// Additional utilities
BodyText.Sizes = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

// Helper for creating text sections
BodyText.Section = ({ children, style, ...props }) => (
  <BodyText style={[styles1.section, style]} {...props}>
    {children}
  </BodyText>
);

// Helper for inline bold text
BodyText.Bold = ({ children, style, ...props }) => (
  <BodyText bold style={style} {...props}>
    {children}
  </BodyText>
);

const styles1 = StyleSheet.create({
  ...styles,
  section: {
    marginBottom: 12,
    lineHeight: 22,
  },
});

export default BodyText;