import { View, StyleSheet } from 'react-native';

const Spacer = ({ 
  size = 8, 
  horizontal = false, 
  flex,
  style,
  ...props 
}) => {
  const spacerStyle = [
    !flex && {
      [horizontal ? 'width' : 'height']: size,
    },
    flex && { flex },
    style,
  ];

  return <View style={spacerStyle} {...props} />;
};

Spacer.Sizes = {
  XS: 4,
  S: 8,
  M: 16,
  L: 24,
  XL: 32,
  XXL: 48,
};

// <Spacer size={Spacer.Sizes.M} />
// <Spacer size={16} horizontal />
// <Spacer flex={1} />

export default Spacer;