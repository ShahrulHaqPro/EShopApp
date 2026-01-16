import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      
      <Image
        source={require('../assets/adaptive-icon.png')}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          CR Book
        </Text>

        <Text style={styles.category}>
          Stationary
        </Text>

        <View style={styles.row}>
          <Text style={styles.price}>LKR 185.00</Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    overflow: 'hidden',
    elevation: 3,
    width: '47%',
  },

  image: {
    width: '100%',
    minHeight:120,
    height: 'auto',
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
  },

  category: {
    fontSize: 12,
    color: '#888',
    marginVertical: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

