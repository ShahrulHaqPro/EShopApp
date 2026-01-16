import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { authApi } from '../api';

// Define test credentials here if not imported from API
const TEST_CREDENTIALS = [
  { username: 'johnd', password: 'm38rmF$', name: 'John Doe' },
  { username: 'mor_2314', password: '83r5^_', name: 'Moriah Stanton' },
  { username: 'kevinryan', password: 'kev02937@', name: 'Kevin Ryan' },
  { username: 'donero', password: 'ewedon', name: 'Donero' },
  { username: 'derek', password: 'jklg*_56', name: 'Derek' },
  { username: 'david_r', password: '3478*#54', name: 'David' },
  { username: 'snyder', password: 'f238&@*$', name: 'Snyder' },
  { username: 'hopkins', password: 'William56$hj', name: 'Hopkins' },
  { username: 'kate_h', password: 'kfejk@*_', name: 'Kate' },
  { username: 'jimmie_k', password: 'klein*#%*', name: 'Jimmie' },
];

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const authData = await authApi.getStoredAuthData();
      if (authData.user && authData.token) {
        // Validate token
        const validation = await authApi.validateToken(authData.token);
        if (validation.valid) {
          setUser(authData.user);
          setToken(authData.token);
        } else {
          await authApi.clearAuthData();
        }
      }
    } catch (error) {
      console.log('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username, password) => {
    try {
      setLoading(true);
      const loginData = await authApi.login(username, password);
      
      if (loginData.token) {
        // Get user details
        const users = await authApi.getAllUsers();
        const foundUser = users.find(u => u.username === username);
        
        if (foundUser) {
          const userWithToken = { ...foundUser, token: loginData.token };
          await authApi.storeAuthData(userWithToken, loginData.token);
          setUser(userWithToken);
          setToken(loginData.token);
          return { success: true, user: userWithToken };
        }
      }
      
      return { success: false, error: 'User not found' };
    } catch (error) {
      Alert.alert('Login Failed', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);
      
      // Check username availability
      const usernameCheck = await authApi.checkUsernameAvailability(userData.username);
      if (!usernameCheck.available) {
        Alert.alert('Error', 'Username already exists');
        return { success: false, error: 'Username taken' };
      }
      
      // Check email availability
      const emailCheck = await authApi.checkEmailAvailability(userData.email);
      if (!emailCheck.available) {
        Alert.alert('Error', 'Email already registered');
        return { success: false, error: 'Email taken' };
      }
      
      // Prepare user data for Fake Store API format
      const formattedUserData = {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        name: {
          firstname: userData.firstname,
          lastname: userData.lastname,
        },
        address: {
          city: userData.city || 'new city',
          street: userData.street || 'new street',
          number: userData.number || 3,
          zipcode: userData.zipcode || '12926-3874',
          geolocation: {
            lat: '-37.3159',
            long: '81.1496',
          },
        },
        phone: userData.phone || '1-570-236-7033',
      };
      
      const newUser = await authApi.register(formattedUserData);
      
      // Auto login after registration
      if (newUser.id) {
        const loginResult = await signIn(userData.username, userData.password);
        if (loginResult.success) {
          Alert.alert('Success', 'Account created successfully!');
          return { success: true, user: loginResult.user };
        }
      }
      
      Alert.alert('Success', 'Account created! Please log in.');
      return { success: true, user: newUser };
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authApi.clearAuthData();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const updateProfile = async (userData) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = await authApi.updateUser(user.id, {
        ...user,
        ...userData,
      });
      
      await authApi.storeAuthData(updatedUser, token);
      setUser(updatedUser);
      Alert.alert('Success', 'Profile updated!');
      return { success: true, user: updatedUser };
    } catch (error) {
      Alert.alert('Update Failed', error.message);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        testCredentials: TEST_CREDENTIALS, // Make sure this is included
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



//===========================================================
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { Alert } from 'react-native';
// import { authApi, TEST_CREDENTIALS } from '../api';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadStoredAuth();
//   }, []);

//   const loadStoredAuth = async () => {
//     try {
//       const authData = await authApi.getStoredAuthData();
//       if (authData.user && authData.token) {
//         // Validate token
//         const validation = await authApi.validateToken(authData.token);
//         if (validation.valid) {
//           setUser(authData.user);
//           setToken(authData.token);
//         } else {
//           await authApi.clearAuthData();
//         }
//       }
//     } catch (error) {
//       console.log('Error loading auth:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signIn = async (username, password) => {
//     try {
//       setLoading(true);
//       const loginData = await authApi.login(username, password);
      
//       if (loginData.token) {
//         // Get user details
//         const users = await authApi.getAllUsers();
//         const foundUser = users.find(u => u.username === username);
        
//         if (foundUser) {
//           const userWithToken = { ...foundUser, token: loginData.token };
//           await authApi.storeAuthData(userWithToken, loginData.token);
//           setUser(userWithToken);
//           setToken(loginData.token);
//           return { success: true, user: userWithToken };
//         }
//       }
      
//       return { success: false, error: 'User not found' };
//     } catch (error) {
//       Alert.alert('Login Failed', error.message);
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async (userData) => {
//     try {
//       setLoading(true);
      
//       // Check username availability
//       const usernameCheck = await authApi.checkUsernameAvailability(userData.username);
//       if (!usernameCheck.available) {
//         Alert.alert('Error', 'Username already exists');
//         return { success: false, error: 'Username taken' };
//       }
      
//       // Check email availability
//       const emailCheck = await authApi.checkEmailAvailability(userData.email);
//       if (!emailCheck.available) {
//         Alert.alert('Error', 'Email already registered');
//         return { success: false, error: 'Email taken' };
//       }
      
//       // Prepare user data for Fake Store API format
//       const formattedUserData = {
//         email: userData.email,
//         username: userData.username,
//         password: userData.password,
//         name: {
//           firstname: userData.firstname,
//           lastname: userData.lastname,
//         },
//         address: {
//           city: userData.city || 'new city',
//           street: userData.street || 'new street',
//           number: userData.number || 3,
//           zipcode: userData.zipcode || '12926-3874',
//           geolocation: {
//             lat: '-37.3159',
//             long: '81.1496',
//           },
//         },
//         phone: userData.phone || '1-570-236-7033',
//       };
      
//       const newUser = await authApi.register(formattedUserData);
      
//       // Auto login after registration
//       if (newUser.id) {
//         const loginResult = await signIn(userData.username, userData.password);
//         if (loginResult.success) {
//           Alert.alert('Success', 'Account created successfully!');
//           return { success: true, user: loginResult.user };
//         }
//       }
      
//       Alert.alert('Success', 'Account created! Please log in.');
//       return { success: true, user: newUser };
//     } catch (error) {
//       Alert.alert('Registration Failed', error.message);
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await authApi.clearAuthData();
//       setUser(null);
//       setToken(null);
//     } catch (error) {
//       console.log('Error signing out:', error);
//     }
//   };

//   const updateProfile = async (userData) => {
//     try {
//       if (!user) throw new Error('No user logged in');
      
//       const updatedUser = await authApi.updateUser(user.id, {
//         ...user,
//         ...userData,
//       });
      
//       await authApi.storeAuthData(updatedUser, token);
//       setUser(updatedUser);
//       Alert.alert('Success', 'Profile updated!');
//       return { success: true, user: updatedUser };
//     } catch (error) {
//       Alert.alert('Update Failed', error.message);
//       return { success: false, error: error.message };
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         signIn,
//         signUp,
//         signOut,
//         updateProfile,
//         testCredentials: TEST_CREDENTIALS,
//         isAuthenticated: !!user && !!token,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // import React, { createContext, useState, useContext, useEffect } from 'react';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { Alert } from 'react-native';

// // const AuthContext = createContext({});

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [token, setToken] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [allUsers, setAllUsers] = useState([]);

// //   // Fake Store API endpoints
// //   const API_URL = 'https://fakestoreapi.com/users';
  
// //   useEffect(() => {
// //     // Check if user is logged in on app start
// //     loadStorageData();
// //     // Fetch all users for validation
// //     fetchUsers();
// //   }, []);

// //   const loadStorageData = async () => {
// //     try {
// //       const storedUser = await AsyncStorage.getItem('@user');
// //       const storedToken = await AsyncStorage.getItem('@token');

// //       if (storedUser && storedToken) {
// //         setUser(JSON.parse(storedUser));
// //         setToken(storedToken);
// //       }
// //     } catch (error) {
// //       console.log('Error loading auth data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchUsers = async () => {
// //     try {
// //       const response = await fetch(`${API_URL}/users`);
// //       const users = await response.json();
// //       setAllUsers(users);
// //     } catch (error) {
// //       console.log('Error fetching users:', error);
// //     }
// //   };

// //   const signIn = async (username, password) => {
// //     try {
// //       setLoading(true);
      
// //       // Fake Store API authentication endpoint
// //       const response = await fetch(`${API_URL}/auth/login`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           username: username,
// //           password: password
// //         }),
// //       });

// //       const data = await response.json();

// //       if (response.ok && data.token) {
// //         // Get user details
// //         const userResponse = await fetch(`${API_URL}/users`);
// //         const users = await userResponse.json();
// //         const foundUser = users.find(user => user.username === username);
        
// //         if (foundUser) {
// //           // Store user with token
// //           const userWithToken = {
// //             ...foundUser,
// //             token: data.token
// //           };
          
// //           await AsyncStorage.setItem('@user', JSON.stringify(userWithToken));
// //           await AsyncStorage.setItem('@token', data.token);
// //           setUser(userWithToken);
// //           setToken(data.token);
          
// //           Alert.alert('Success', 'Logged in successfully!');
// //           return { success: true, user: userWithToken };
// //         } else {
// //           Alert.alert('Error', 'User not found');
// //           return { success: false, error: 'User not found' };
// //         }
// //       } else {
// //         Alert.alert('Login Failed', data.message || 'Invalid credentials');
// //         return { success: false, error: data.message || 'Invalid credentials' };
// //       }
// //     } catch (error) {
// //       console.log('Login error:', error);
// //       Alert.alert('Error', 'Network error. Please try again.');
// //       return { success: false, error: error.message };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const signUp = async (userData) => {
// //     try {
// //       setLoading(true);
      
// //       // Check if username already exists
// //       const existingUser = allUsers.find(user => user.username === userData.username);
// //       if (existingUser) {
// //         Alert.alert('Error', 'Username already exists');
// //         return { success: false, error: 'Username already exists' };
// //       }

// //       // Check if email already exists
// //       const existingEmail = allUsers.find(user => user.email === userData.email);
// //       if (existingEmail) {
// //         Alert.alert('Error', 'Email already registered');
// //         return { success: false, error: 'Email already registered' };
// //       }

// //       // Register new user with Fake Store API
// //       const response = await fetch(`${API_URL}/users`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           email: userData.email,
// //           username: userData.username,
// //           password: userData.password,
// //           name: {
// //             firstname: userData.firstname,
// //             lastname: userData.lastname
// //           },
// //           address: {
// //             city: userData.city || 'new city',
// //             street: userData.street || 'new street',
// //             number: userData.number || 3,
// //             zipcode: userData.zipcode || '12926-3874',
// //             geolocation: {
// //               lat: '-37.3159',
// //               long: '81.1496'
// //             }
// //           },
// //           phone: userData.phone || '1-570-236-7033'
// //         }),
// //       });

// //       const newUser = await response.json();

// //       if (response.ok) {
// //         // Auto-login after successful registration
// //         const loginResult = await signIn(userData.username, userData.password);
        
// //         if (loginResult.success) {
// //           Alert.alert('Success', 'Account created and logged in successfully!');
// //           return { success: true, user: loginResult.user };
// //         } else {
// //           Alert.alert('Success', 'Account created successfully! Please log in.');
// //           return { success: true, user: newUser };
// //         }
// //       } else {
// //         Alert.alert('Error', 'Registration failed');
// //         return { success: false, error: 'Registration failed' };
// //       }
// //     } catch (error) {
// //       console.log('Registration error:', error);
// //       Alert.alert('Error', 'Network error. Please try again.');
// //       return { success: false, error: error.message };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const signOut = async () => {
// //     try {
// //       await AsyncStorage.multiRemove(['@user', '@token']);
// //       setUser(null);
// //       setToken(null);
// //       Alert.alert('Success', 'Logged out successfully');
// //     } catch (error) {
// //       console.log('Error signing out:', error);
// //     }
// //   };

// //   const updateUserProfile = async (updatedData) => {
// //     try {
// //       setLoading(true);
      
// //       // Update user with Fake Store API
// //       const response = await fetch(`${API_URL}/users/${user.id}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           ...user,
// //           ...updatedData
// //         }),
// //       });

// //       const updatedUser = await response.json();

// //       if (response.ok) {
// //         await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
// //         setUser(updatedUser);
// //         Alert.alert('Success', 'Profile updated successfully!');
// //         return { success: true, user: updatedUser };
// //       } else {
// //         Alert.alert('Error', 'Failed to update profile');
// //         return { success: false, error: 'Update failed' };
// //       }
// //     } catch (error) {
// //       console.log('Update error:', error);
// //       Alert.alert('Error', 'Failed to update profile');
// //       return { success: false, error: error.message };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Get current user's cart from API
// //   const getUserCart = async () => {
// //     try {
// //       if (!user) return [];
      
// //       const response = await fetch(`${API_URL}/carts/user/${user.id}`);
// //       const cartData = await response.json();
// //       return cartData;
// //     } catch (error) {
// //       console.log('Error fetching cart:', error);
// //       return [];
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         token,
// //         loading,
// //         signIn,
// //         signUp,
// //         signOut,
// //         updateUserProfile,
// //         getUserCart,
// //         isAuthenticated: !!user && !!token,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };