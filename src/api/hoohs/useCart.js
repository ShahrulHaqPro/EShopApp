import { useApi } from './useApi';
import { cartApi } from '../index';

export const useCart = () => {
  const getUserCart = useApi(cartApi.getUserCart);
  const getCart = useApi(cartApi.getCart);
  const addToCart = useApi(cartApi.addToCart);
  const addProductToCart = useApi(cartApi.addProductToCart);
  const removeProductFromCart = useApi(cartApi.removeProductFromCart);
  const updateCartItemQuantity = useApi(cartApi.updateCartItemQuantity);
  const clearCart = useApi(cartApi.clearCart);
  const getCartWithDetails = useApi(cartApi.getCartWithDetails);
  const getCartTotal = useApi(cartApi.getCartTotal);

  return {
    getUserCart,
    getCart,
    addToCart,
    addProductToCart,
    removeProductFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartWithDetails,
    getCartTotal,
  };
};