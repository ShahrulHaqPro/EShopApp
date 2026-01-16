import api from './api';

export const ordersApi = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders'); // Note: Fake Store API doesn't have /orders
      return response.data;
    } catch (error) {
      // Since Fake Store API doesn't have orders, we'll simulate with carts
      throw new Error('Orders endpoint not available in Fake Store API');
    }
  },

  // Simulate order creation using carts
  createOrder: async (userId, cartId, shippingInfo) => {
    try {
      // Get cart with details
      const cart = await api.get(`/carts/${cartId}`);
      
      // Calculate total
      let total = 0;
      for (const item of cart.data.products) {
        const product = await api.get(`/products/${item.productId}`);
        total += product.data.price * item.quantity;
      }

      // Simulate order creation (not persisted in Fake Store API)
      const order = {
        id: Date.now(), // Temporary ID
        userId,
        date: new Date().toISOString(),
        products: cart.data.products,
        total: parseFloat(total.toFixed(2)),
        status: 'pending',
        shippingInfo,
      };

      return order;
    } catch (error) {
      throw error;
    }
  },

  // Get user's orders (simulated)
  getUserOrders: async (userId) => {
    try {
      // Get user's carts and treat them as orders
      const carts = await api.get(`/carts/user/${userId}`);
      
      const orders = await Promise.all(
        carts.data.map(async (cart) => {
          let total = 0;
          const productsWithDetails = await Promise.all(
            cart.products.map(async (item) => {
              const product = await api.get(`/products/${item.productId}`);
              total += product.data.price * item.quantity;
              return {
                ...item,
                product: product.data,
              };
            })
          );

          return {
            ...cart,
            orderId: cart.id,
            total: parseFloat(total.toFixed(2)),
            status: 'completed', // Assume all carts are completed orders
            products: productsWithDetails,
          };
        })
      );

      return orders;
    } catch (error) {
      throw error;
    }
  },

  // Get single order
  getOrderById: async (orderId) => {
    try {
      // Treat cart as order
      const cart = await api.get(`/carts/${orderId}`);
      
      let total = 0;
      const productsWithDetails = await Promise.all(
        cart.data.products.map(async (item) => {
          const product = await api.get(`/products/${item.productId}`);
          total += product.data.price * item.quantity;
          return {
            ...item,
            product: product.data,
          };
        })
      );

      return {
        ...cart.data,
        orderId: cart.data.id,
        total: parseFloat(total.toFixed(2)),
        status: 'completed',
        products: productsWithDetails,
      };
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      // Since we're using carts as orders, we can't really update status
      // Return success for simulation
      return {
        success: true,
        message: 'Order status updated',
        orderId,
        status,
      };
    } catch (error) {
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      // Delete the cart (since we're using carts as orders)
      await api.delete(`/carts/${orderId}`);
      return {
        success: true,
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      throw error;
    }
  },

  // Get order count
  getOrderCount: async (userId) => {
    try {
      const carts = await api.get(`/carts/user/${userId}`);
      return carts.data.length;
    } catch (error) {
      throw error;
    }
  },
};