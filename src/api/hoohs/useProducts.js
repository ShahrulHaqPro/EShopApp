import { useApi } from './useApi';
import { productsApi } from '../index';

export const useProducts = () => {
  const getAllProducts = useApi(productsApi.getAllProducts);
  const getProductById = useApi(productsApi.getProductById);
  const getProductsByCategory = useApi(productsApi.getProductsByCategory);
  const getAllCategories = useApi(productsApi.getAllCategories);
  const searchProducts = useApi(productsApi.searchProducts);
  const getFeaturedProducts = useApi(productsApi.getFeaturedProducts);
  const getTopRatedProducts = useApi(productsApi.getTopRatedProducts);

  return {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getAllCategories,
    searchProducts,
    getFeaturedProducts,
    getTopRatedProducts,
  };
};