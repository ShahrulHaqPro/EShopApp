import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Define test credentials locally as fallback
const FALLBACK_TEST_CREDENTIALS = [
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

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { signIn, loading, testCredentials: contextTestCredentials } = useAuth();
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Use context test credentials or fallback
  const testCredentials = contextTestCredentials || FALLBACK_TEST_CREDENTIALS;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    const result = await signIn(username, password);
    if (!result.success) {
      // Error is already shown by AuthContext
      return;
    }
  };

  const useTestAccount = (testUser) => {
    setUsername(testUser.username);
    setPassword(testUser.password);
    Alert.alert(
      'Test Account Loaded',
      `Using ${testUser.name}'s account. Click Login to continue.`,
      [{ text: 'OK' }]
    );
  };

  const renderTestAccountItem = (user, index) => (
    <TouchableOpacity
      key={index}
      style={styles.testAccountCard}
      onPress={() => useTestAccount(user)}
    >
      <View style={styles.testAccountAvatar}>
        <Text style={styles.testAccountInitial}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.testAccountInfo}>
        <Text style={styles.testAccountName}>{user.name}</Text>
        <Text style={styles.testAccountUsername}>@{user.username}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                  <Ionicons name="cart" size={40} color="#4F46E5" />
                </View>
                <Text style={styles.appName}>FakeStore</Text>
              </View>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.subtitle}>Sign in to continue shopping</Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <Ionicons name="log-in" size={24} color="#4F46E5" />
                <Text style={styles.formTitle}>Login to your account</Text>
              </View>

              {/* Username Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Username</Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'username' && styles.inputFocused,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={focusedInput === 'username' ? '#4F46E5' : '#9CA3AF'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                    onFocus={() => setFocusedInput('username')}
                    onBlur={() => setFocusedInput(null)}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'password' && styles.inputFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={focusedInput === 'password' ? '#4F46E5' : '#9CA3AF'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons
                      name="refresh-outline"
                      size={20}
                      color="#FFFFFF"
                      style={styles.loadingIcon}
                    />
                    <Text style={styles.loginButtonText}>Signing in...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name="arrow-forward-outline"
                      size={20}
                      color="#FFFFFF"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Test Accounts Section */}
              <View style={styles.testAccountsSection}>
                <View style={styles.testAccountsHeader}>
                  <Ionicons name="people-outline" size={20} color="#6B7280" />
                  <Text style={styles.testAccountsTitle}>
                    Try a test account
                  </Text>
                </View>
                <Text style={styles.testAccountsSubtitle}>
                  These are pre-configured accounts from Fake Store API
                </Text>

                <View style={styles.testAccountsGrid}>
                  {testCredentials && testCredentials.length > 0 ? (
                    testCredentials.slice(0, 3).map(renderTestAccountItem)
                  ) : (
                    <Text style={styles.noAccountsText}>
                      No test accounts available
                    </Text>
                  )}
                </View>

                {testCredentials && testCredentials.length > 3 && (
                  <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={() =>
                      Alert.alert(
                        'All Test Accounts',
                        testCredentials
                          .map(
                            (user) =>
                              `${user.name}\nUsername: ${user.username}\nPassword: ${user.password}`
                          )
                          .join('\n\n'),
                        [{ text: 'OK' }]
                      )
                    }
                  >
                    <Text style={styles.showMoreText}>
                      Show all {testCredentials.length} test accounts
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Register Link */}
              <View style={styles.registerSection}>
                <Text style={styles.registerText}>Don't have an account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                  disabled={loading}
                >
                  <Text style={styles.registerLink}>Sign up now</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Using Fake Store API</Text>
                <Text style={styles.infoText}>
                  This app uses a mock API for demonstration. Test accounts are
                  provided above.
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 10,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  loadingIcon: {
    marginRight: 8,
    transform: [{ rotate: '0deg' }],
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#6B7280',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  testAccountsSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  testAccountsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  testAccountsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  testAccountsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  testAccountsGrid: {
    marginBottom: 12,
  },
  testAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testAccountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testAccountInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  testAccountInfo: {
    flex: 1,
  },
  testAccountName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  testAccountUsername: {
    fontSize: 12,
    color: '#6B7280',
  },
  noAccountsText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontStyle: 'italic',
    padding: 20,
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  showMoreText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#6B7280',
    fontSize: 14,
    marginRight: 4,
  },
  registerLink: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
});

export default LoginScreen;



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
//   Image,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import { useAuth } from '../../context/AuthContext';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// const LoginScreen = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [focusedInput, setFocusedInput] = useState(null);
//   const { signIn, loading, testCredentials } = useAuth();
//   const [fadeAnim] = useState(new Animated.Value(0));

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const handleLogin = async () => {
//     if (!username.trim()) {
//       Alert.alert('Error', 'Please enter your username');
//       return;
//     }

//     if (!password.trim()) {
//       Alert.alert('Error', 'Please enter your password');
//       return;
//     }

//     const result = await signIn(username, password);
//     if (!result.success) {
//       // Error is already shown by AuthContext
//       return;
//     }
//   };

//   const useTestAccount = (testUser) => {
//     setUsername(testUser.username);
//     setPassword(testUser.password);
//     Alert.alert(
//       'Test Account Loaded',
//       `Using ${testUser.name}'s account. Click Login to continue.`,
//       [{ text: 'OK' }]
//     );
//   };

//   const renderTestAccountItem = (user, index) => (
//     <TouchableOpacity
//       key={index}
//       style={styles.testAccountCard}
//       onPress={() => useTestAccount(user)}
//     >
//       <View style={styles.testAccountAvatar}>
//         <Text style={styles.testAccountInitial}>
//           {user.name.charAt(0).toUpperCase()}
//         </Text>
//       </View>
//       <View style={styles.testAccountInfo}>
//         <Text style={styles.testAccountName}>{user.name}</Text>
//         <Text style={styles.testAccountUsername}>@{user.username}</Text>
//       </View>
//       <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollView}
//           showsVerticalScrollIndicator={false}
//         >
//           <Animated.View style={{ opacity: fadeAnim }}>
//             {/* Header */}
//             <View style={styles.header}>
//               <View style={styles.logoContainer}>
//                 <Image
//                   source={{ uri: 'https://fakestoreapi.com/icons/logo.png' }}
//                   style={styles.logo}
//                 />
//                 <Text style={styles.appName}>FakeStore</Text>
//               </View>
//               <Text style={styles.welcomeText}>Welcome back!</Text>
//               <Text style={styles.subtitle}>Sign in to continue shopping</Text>
//             </View>

//             {/* Login Form */}
//             <View style={styles.formContainer}>
//               <View style={styles.formHeader}>
//                 <Ionicons name="log-in" size={24} color="#4F46E5" />
//                 <Text style={styles.formTitle}>Login to your account</Text>
//               </View>

//               {/* Username Input */}
//               <View style={styles.inputWrapper}>
//                 <Text style={styles.label}>Username</Text>
//                 <View
//                   style={[
//                     styles.inputContainer,
//                     focusedInput === 'username' && styles.inputFocused,
//                   ]}
//                 >
//                   <Ionicons
//                     name="person-outline"
//                     size={20}
//                     color={focusedInput === 'username' ? '#4F46E5' : '#9CA3AF'}
//                     style={styles.inputIcon}
//                   />
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your username"
//                     value={username}
//                     onChangeText={setUsername}
//                     onFocus={() => setFocusedInput('username')}
//                     onBlur={() => setFocusedInput(null)}
//                     autoCapitalize="none"
//                     editable={!loading}
//                   />
//                 </View>
//               </View>

//               {/* Password Input */}
//               <View style={styles.inputWrapper}>
//                 <Text style={styles.label}>Password</Text>
//                 <View
//                   style={[
//                     styles.inputContainer,
//                     focusedInput === 'password' && styles.inputFocused,
//                   ]}
//                 >
//                   <Ionicons
//                     name="lock-closed-outline"
//                     size={20}
//                     color={focusedInput === 'password' ? '#4F46E5' : '#9CA3AF'}
//                     style={styles.inputIcon}
//                   />
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your password"
//                     value={password}
//                     onChangeText={setPassword}
//                     onFocus={() => setFocusedInput('password')}
//                     onBlur={() => setFocusedInput(null)}
//                     secureTextEntry={!showPassword}
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={() => setShowPassword(!showPassword)}
//                     style={styles.eyeIcon}
//                   >
//                     <Ionicons
//                       name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//                       size={20}
//                       color="#9CA3AF"
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* Forgot Password */}
//               <TouchableOpacity style={styles.forgotPassword}>
//                 <Text style={styles.forgotPasswordText}>Forgot password?</Text>
//               </TouchableOpacity>

//               {/* Login Button */}
//               <TouchableOpacity
//                 style={[styles.loginButton, loading && styles.buttonDisabled]}
//                 onPress={handleLogin}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <View style={styles.loadingContainer}>
//                     <Ionicons
//                       name="refresh-outline"
//                       size={20}
//                       color="#FFFFFF"
//                       style={styles.loadingIcon}
//                     />
//                     <Text style={styles.loginButtonText}>Signing in...</Text>
//                   </View>
//                 ) : (
//                   <View style={styles.buttonContent}>
//                     <Ionicons
//                       name="arrow-forward-outline"
//                       size={20}
//                       color="#FFFFFF"
//                       style={styles.buttonIcon}
//                     />
//                     <Text style={styles.loginButtonText}>Sign In</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>

//               {/* Divider */}
//               <View style={styles.divider}>
//                 <View style={styles.dividerLine} />
//                 <Text style={styles.dividerText}>or continue with</Text>
//                 <View style={styles.dividerLine} />
//               </View>

//               {/* Test Accounts Section */}
//               <View style={styles.testAccountsSection}>
//                 <View style={styles.testAccountsHeader}>
//                   <Ionicons name="people-outline" size={20} color="#6B7280" />
//                   <Text style={styles.testAccountsTitle}>
//                     Try a test account
//                   </Text>
//                 </View>
//                 <Text style={styles.testAccountsSubtitle}>
//                   These are pre-configured accounts from Fake Store API
//                 </Text>

//                 <View style={styles.testAccountsGrid}>
//                   {testCredentials.slice(0, 3).map(renderTestAccountItem)}
//                 </View>

//                 {testCredentials.length > 3 && (
//                   <TouchableOpacity
//                     style={styles.showMoreButton}
//                     onPress={() =>
//                       Alert.alert(
//                         'All Test Accounts',
//                         testCredentials
//                           .map(
//                             (user) =>
//                               `${user.name}\nUsername: ${user.username}\nPassword: ${user.password}`
//                           )
//                           .join('\n\n'),
//                         [{ text: 'OK' }]
//                       )
//                     }
//                   >
//                     <Text style={styles.showMoreText}>
//                       Show all {testCredentials.length} test accounts
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>

//               {/* Register Link */}
//               <View style={styles.registerSection}>
//                 <Text style={styles.registerText}>Don't have an account?</Text>
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate('Register')}
//                   disabled={loading}
//                 >
//                   <Text style={styles.registerLink}>Sign up now</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Info Box */}
//             <View style={styles.infoBox}>
//               <Ionicons name="information-circle" size={20} color="#3B82F6" />
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoTitle}>Using Fake Store API</Text>
//                 <Text style={styles.infoText}>
//                   This app uses a mock API for demonstration. Test accounts are
//                   provided above.
//                 </Text>
//               </View>
//             </View>
//           </Animated.View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollView: {
//     flexGrow: 1,
//     paddingBottom: 30,
//   },
//   header: {
//     alignItems: 'center',
//     paddingTop: 40,
//     paddingBottom: 30,
//     paddingHorizontal: 20,
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     width: 40,
//     height: 40,
//     marginRight: 10,
//   },
//   appName: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#4F46E5',
//     letterSpacing: -0.5,
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   formContainer: {
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 20,
//     borderRadius: 20,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.1,
//     shadowRadius: 20,
//     elevation: 10,
//     marginBottom: 20,
//   },
//   formHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   formTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginLeft: 10,
//   },
//   inputWrapper: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//     marginLeft: 4,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     backgroundColor: '#F9FAFB',
//     paddingHorizontal: 16,
//   },
//   inputFocused: {
//     borderColor: '#4F46E5',
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: '#111827',
//   },
//   eyeIcon: {
//     padding: 4,
//   },
//   forgotPassword: {
//     alignSelf: 'flex-end',
//     marginBottom: 24,
//   },
//   forgotPasswordText: {
//     color: '#4F46E5',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   loginButton: {
//     backgroundColor: '#4F46E5',
//     borderRadius: 12,
//     paddingVertical: 16,
//     marginBottom: 24,
//   },
//   buttonDisabled: {
//     backgroundColor: '#9CA3AF',
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonIcon: {
//     marginRight: 8,
//   },
//   loadingIcon: {
//     marginRight: 8,
//     transform: [{ rotate: '0deg' }],
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#E5E7EB',
//   },
//   dividerText: {
//     color: '#6B7280',
//     paddingHorizontal: 16,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   testAccountsSection: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//   },
//   testAccountsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   testAccountsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#374151',
//     marginLeft: 8,
//   },
//   testAccountsSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 16,
//   },
//   testAccountsGrid: {
//     marginBottom: 12,
//   },
//   testAccountCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   testAccountAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#4F46E5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   testAccountInitial: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   testAccountInfo: {
//     flex: 1,
//   },
//   testAccountName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   testAccountUsername: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   showMoreButton: {
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   showMoreText: {
//     color: '#4F46E5',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   registerSection: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   registerText: {
//     color: '#6B7280',
//     fontSize: 14,
//     marginRight: 4,
//   },
//   registerLink: {
//     color: '#4F46E5',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   infoBox: {
//     flexDirection: 'row',
//     backgroundColor: '#EFF6FF',
//     marginHorizontal: 20,
//     borderRadius: 12,
//     padding: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#3B82F6',
//     alignItems: 'center',
//   },
//   infoContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1E40AF',
//     marginBottom: 4,
//   },
//   infoText: {
//     fontSize: 13,
//     color: '#374151',
//     lineHeight: 18,
//   },
// });

// export default LoginScreen;





// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { useAuth } from '../../context/AuthContext';

// // Fake Store API test credentials
// const TEST_CREDENTIALS = [
//   { username: 'johnd', password: 'm38rmF$', name: 'John Doe' },
//   { username: 'mor_2314', password: '83r5^_', name: 'Moriah Stanton' },
//   { username: 'kevinryan', password: 'kev02937@', name: 'Kevin Ryan' },
//   { username: 'donero', password: 'ewedon', name: 'Donero' },
//   { username: 'derek', password: 'jklg*_56', name: 'Derek' },
//   { username: 'david_r', password: '3478*#54', name: 'David' },
//   { username: 'snyder', password: 'f238&@*$', name: 'Snyder' },
//   { username: 'hopkins', password: 'William56$hj', name: 'Hopkins' },
//   { username: 'kate_h', password: 'kfejk@*_', name: 'Kate' },
//   { username: 'jimmie_k', password: 'klein*#%*', name: 'Jimmie' },
// ];

// const LoginScreen = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showTestAccounts, setShowTestAccounts] = useState(false);
//   const { signIn, loading } = useAuth();

//   const handleLogin = async () => {
//     if (!username || !password) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     const result = await signIn(username, password);
//     if (result.success) {
//       // Navigation handled by AppNavigator
//     }
//   };

//   const useTestAccount = (testUser) => {
//     setUsername(testUser.username);
//     setPassword(testUser.password);
//     Alert.alert(
//       'Test Account Selected',
//       `Using ${testUser.name}'s account:\nUsername: ${testUser.username}\nPassword: ${testUser.password}`
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView contentContainerStyle={styles.scrollView}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Welcome Back</Text>
//             <Text style={styles.subtitle}>Sign in to Fake Store</Text>
//           </View>

//           <View style={styles.form}>
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Username</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter username"
//                 value={username}
//                 onChangeText={setUsername}
//                 autoCapitalize="none"
//                 editable={!loading}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Password</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//                 editable={!loading}
//               />
//             </View>

//             <TouchableOpacity
//               style={styles.testAccountsButton}
//               onPress={() => setShowTestAccounts(!showTestAccounts)}
//             >
//               <Text style={styles.testAccountsText}>
//                 {showTestAccounts ? 'Hide Test Accounts' : 'Show Test Accounts'}
//               </Text>
//             </TouchableOpacity>

//             {showTestAccounts && (
//               <View style={styles.testAccountsContainer}>
//                 <Text style={styles.testAccountsTitle}>Test Accounts:</Text>
//                 {TEST_CREDENTIALS.map((testUser, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.testAccountItem}
//                     onPress={() => useTestAccount(testUser)}
//                   >
//                     <Text style={styles.testAccountName}>{testUser.name}</Text>
//                     <Text style={styles.testAccountUsername}>
//                       {testUser.username}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             <TouchableOpacity
//               style={[styles.loginButton, loading && styles.disabledButton]}
//               onPress={handleLogin}
//               disabled={loading}
//             >
//               <Text style={styles.loginButtonText}>
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </Text>
//             </TouchableOpacity>

//             <View style={styles.divider}>
//               <View style={styles.dividerLine} />
//               <Text style={styles.dividerText}>OR</Text>
//               <View style={styles.dividerLine} />
//             </View>

//             <TouchableOpacity
//               style={styles.registerButton}
//               onPress={() => navigation.navigate('Register')}
//             >
//               <Text style={styles.registerButtonText}>Create New Account</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.infoBox}>
//             <Text style={styles.infoTitle}>About Fake Store API:</Text>
//             <Text style={styles.infoText}>
//               • This is a mock API for testing
//               {'\n'}• No real user accounts exist
//               {'\n'}• Use test accounts above
//               {'\n'}• Registration creates temporary users
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollView: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   form: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: '#FFFFFF',
//   },
//   testAccountsButton: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   testAccountsText: {
//     color: '#4F46E5',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   testAccountsContainer: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//   },
//   testAccountsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   testAccountItem: {
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   testAccountName: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//   },
//   testAccountUsername: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   loginButton: {
//     backgroundColor: '#4F46E5',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   disabledButton: {
//     backgroundColor: '#9CA3AF',
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#E5E7EB',
//   },
//   dividerText: {
//     color: '#6B7280',
//     paddingHorizontal: 10,
//     fontSize: 14,
//   },
//   registerButton: {
//     backgroundColor: '#10B981',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//   },
//   registerButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   infoBox: {
//     backgroundColor: '#EFF6FF',
//     borderRadius: 8,
//     padding: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#3B82F6',
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1E40AF',
//     marginBottom: 8,
//   },
//   infoText: {
//     fontSize: 13,
//     color: '#374151',
//     lineHeight: 20,
//   },
// });

// export default LoginScreen;