// Export all API services
export { authApi } from './authApi';
export { productsApi } from './productsApi';
export { cartApi } from './cartApi';
export { ordersApi } from './ordersApi';
export { default as api } from './api';

// Utility functions
export const apiUtils = {
  // Format price
  formatPrice: (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  },

  // Format date
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Calculate rating percentage
  getRatingPercentage: (rating) => {
    return (rating / 5) * 100;
  },

  // Truncate text
  truncateText: (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Validate email
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate password
  validatePassword: (password) => {
    return password.length >= 6;
  },

  // Generate random ID (for local use when API doesn't provide)
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
};


// // Export all API services
// export { authApi } from './authApi';
// export { productsApi } from './productsApi';
// export { cartApi } from './cartApi';
// export { ordersApi } from './ordersApi';
// export { default as api } from './api';
// export { TEST_CREDENTIALS } from './authApi';

// // Utility functions
// export const apiUtils = {
//   // Format price
//   formatPrice: (price) => {
//     return `$${parseFloat(price).toFixed(2)}`;
//   },

//   // Format date
//   formatDate: (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   },

//   // Calculate rating percentage
//   getRatingPercentage: (rating) => {
//     return (rating / 5) * 100;
//   },

//   // Truncate text
//   truncateText: (text, maxLength = 100) => {
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + '...';
//   },

//   // Validate email
//   validateEmail: (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   },

//   // Validate password
//   validatePassword: (password) => {
//     return password.length >= 6;
//   },

//   // Generate random ID (for local use when API doesn't provide)
//   generateId: () => {
//     return Date.now().toString(36) + Math.random().toString(36).substr(2);
//   },
// };