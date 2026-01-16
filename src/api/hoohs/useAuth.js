import { useApi } from './useApi';
import { authApi } from '../index';

export const useAuth = () => {
  const login = useApi(authApi.login);
  const register = useApi(authApi.register);
  const getCurrentUser = useApi(authApi.getCurrentUser);
  const updateUser = useApi(authApi.updateUser);
  const getAllUsers = useApi(authApi.getAllUsers);
  const checkUsernameAvailability = useApi(authApi.checkUsernameAvailability);
  const checkEmailAvailability = useApi(authApi.checkEmailAvailability);

  return {
    login,
    register,
    getCurrentUser,
    updateUser,
    getAllUsers,
    checkUsernameAvailability,
    checkEmailAvailability,
  };
};