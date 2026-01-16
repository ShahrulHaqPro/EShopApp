import api from './api';

export const cartApi = {
  // Get user's cart
  getUserCart: async (userId) => {
    try {
      const response = await api.get(`/carts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single cart
  getCart: async (cartId) => {
    try {
      const response = await api.get(`/carts/${cartId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add to cart
  addToCart: async (cartData) => {
    try {
      const response = await api.post('/carts', cartData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update cart
  updateCart: async (cartId, cartData) => {
    try {
      const response = await api.put(`/carts/${cartId}`, cartData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete cart
  deleteCart: async (cartId) => {
    try {
      const response = await api.delete(`/carts/${cartId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add product to cart
  addProductToCart: async (userId, productId, quantity = 1) => {
    try {
      // Get user's existing cart or create new
      const userCarts = await cartApi.getUserCart(userId);
      let cart = userCarts[0]; // Assume user has one cart

      if (!cart) {
        // Create new cart
        cart = await cartApi.addToCart({
          userId,
          date: new Date().toISOString(),
          products: [{ productId, quantity }],
        });
      } else {
        // Update existing cart
        const existingProductIndex = cart.products.findIndex(
          item => item.productId === productId
        );

        if (existingProductIndex >= 0) {
          // Update quantity
          cart.products[existingProductIndex].quantity += quantity;
        } else {
          // Add new product
          cart.products.push({ productId, quantity });
        }

        cart = await cartApi.updateCart(cart.id, cart);
      }

      return cart;
    } catch (error) {
      throw error;
    }
  },

  // Remove product from cart
  removeProductFromCart: async (cartId, productId) => {
    try {
      const cart = await cartApi.getCart(cartId);
      cart.products = cart.products.filter(item => item.productId !== productId);
      const updatedCart = await cartApi.updateCart(cartId, cart);
      return updatedCart;
    } catch (error) {
      throw error;
    }
  },

  // Update product quantity in cart
  updateCartItemQuantity: async (cartId, productId, quantity) => {
    try {
      const cart = await cartApi.getCart(cartId);
      const productIndex = cart.products.findIndex(item => item.productId === productId);
      
      if (productIndex >= 0) {
        if (quantity <= 0) {
          // Remove if quantity is 0 or negative
          cart.products.splice(productIndex, 1);
        } else {
          // Update quantity
          cart.products[productIndex].quantity = quantity;
        }
      }

      const updatedCart = await cartApi.updateCart(cartId, cart);
      return updatedCart;
    } catch (error) {
      throw error;
    }
  },

  // Clear cart
  clearCart: async (cartId) => {
    try {
      const cart = await cartApi.getCart(cartId);
      cart.products = [];
      const updatedCart = await cartApi.updateCart(cartId, cart);
      return updatedCart;
    } catch (error) {
      throw error;
    }
  },

  // Get cart total
  getCartTotal: async (cartId) => {
    try {
      const cart = await cartApi.getCart(cartId);
      let total = 0;
      
      // Note: We need to fetch product prices from products API
      // This is a simplified version
      for (const item of cart.products) {
        const product = await api.get(`/products/${item.productId}`);
        total += product.data.price * item.quantity;
      }
      
      return total;
    } catch (error) {
      throw error;
    }
  },

  // Get cart items with product details
  getCartWithDetails: async (cartId) => {
    try {
      const cart = await cartApi.getCart(cartId);
      const productsWithDetails = await Promise.all(
        cart.products.map(async (item) => {
          const product = await api.get(`/products/${item.productId}`);
          return {
            ...item,
            product: product.data,
          };
        })
      );
      
      return {
        ...cart,
        products: productsWithDetails,
      };
    } catch (error) {
      throw error;
    }
  },
};