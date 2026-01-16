import React, { useState, useRef } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    // Step 2
    firstname: '',
    lastname: '',
    phone: '',
    // Step 3
    city: '',
    street: '',
    zipcode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { signUp, loading } = useAuth();
  const scrollViewRef = useRef();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const steps = [
    { number: 1, title: 'Account', icon: 'person-outline' },
    { number: 2, title: 'Personal', icon: 'information-circle-outline' },
    { number: 3, title: 'Address', icon: 'location-outline' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const { email, username, password, confirmPassword } = formData;

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Please choose a username');
      return false;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please create a password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const { firstname, lastname } = formData;

    if (!firstname.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }

    if (!lastname.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    if (currentStep < 3) {
      Animated.timing(slideAnim, {
        toValue: -width * currentStep,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ x: width * currentStep, animated: true });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      Animated.timing(slideAnim, {
        toValue: -width * (currentStep - 2),
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ x: width * (currentStep - 2), animated: true });
    }
  };

  const handleRegister = async () => {
    if (!validateStep1() || !validateStep2()) return;

    try {
      const result = await signUp(formData);
      if (result.success) {
        Alert.alert(
          'Success!',
          'Account created successfully. You are now logged in.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepsContainer}>
      {steps.map(step => (
        <View key={step.number} style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step.number && styles.stepCircleActive,
            ]}
          >
            <Ionicons
              name={step.icon}
              size={16}
              color={currentStep >= step.number ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
          <Text
            style={[
              styles.stepTitle,
              currentStep >= step.number && styles.stepTitleActive,
            ]}
          >
            {step.title}
          </Text>
          {step.number < steps.length && (
            <View
              style={[
                styles.stepLine,
                currentStep > step.number && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={[styles.stepContent, { width }]}>
      <Text style={styles.stepHeading}>Create Account</Text>
      <Text style={styles.stepDescription}>
        Enter your basic information to get started
      </Text>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email Address *</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'email' && styles.inputFocused,
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={focusedInput === 'email' ? '#4F46E5' : '#9CA3AF'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>
      </View>

      {/* Username */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Username *</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'username' && styles.inputFocused,
          ]}
        >
          <Ionicons
            name="at-circle-outline"
            size={20}
            color={focusedInput === 'username' ? '#4F46E5' : '#9CA3AF'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            value={formData.username}
            onChangeText={text => handleChange('username', text)}
            onFocus={() => setFocusedInput('username')}
            onBlur={() => setFocusedInput(null)}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>
        <Text style={styles.hintText}>At least 3 characters</Text>
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Password *</Text>
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
            placeholder="Create a strong password"
            value={formData.password}
            onChangeText={text => handleChange('password', text)}
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
        <Text style={styles.hintText}>At least 6 characters</Text>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Confirm Password *</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'confirmPassword' && styles.inputFocused,
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={focusedInput === 'confirmPassword' ? '#4F46E5' : '#9CA3AF'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={text => handleChange('confirmPassword', text)}
            onFocus={() => setFocusedInput('confirmPassword')}
            onBlur={() => setFocusedInput(null)}
            secureTextEntry={!showConfirmPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
        <Text style={styles.nextButtonText}>Continue</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={[styles.stepContent, { width }]}>
      <Text style={styles.stepHeading}>Personal Information</Text>
      <Text style={styles.stepDescription}>
        Tell us a little about yourself
      </Text>

      <View style={styles.row}>
        {/* First Name */}
        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>First Name *</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === 'firstname' && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="John"
              value={formData.firstname}
              onChangeText={text => handleChange('firstname', text)}
              onFocus={() => setFocusedInput('firstname')}
              onBlur={() => setFocusedInput(null)}
              editable={!loading}
            />
          </View>
        </View>

        {/* Last Name */}
        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Last Name *</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === 'lastname' && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Doe"
              value={formData.lastname}
              onChangeText={text => handleChange('lastname', text)}
              onFocus={() => setFocusedInput('lastname')}
              onBlur={() => setFocusedInput(null)}
              editable={!loading}
            />
          </View>
        </View>
      </View>

      {/* Phone */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Phone Number (Optional)</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'phone' && styles.inputFocused,
          ]}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={focusedInput === 'phone' ? '#4F46E5' : '#9CA3AF'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="+1 (234) 567-8900"
            value={formData.phone}
            onChangeText={text => handleChange('phone', text)}
            onFocus={() => setFocusedInput('phone')}
            onBlur={() => setFocusedInput(null)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>
      </View>

      <View style={styles.stepButtons}>
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <Text style={styles.nextButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={[styles.stepContent, { width }]}>
      <Text style={styles.stepHeading}>Shipping Address</Text>
      <Text style={styles.stepDescription}>
        Where should we send your orders? (Optional)
      </Text>

      {/* City */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>City</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'city' && styles.inputFocused,
          ]}
        >
          <Ionicons
            name="business-outline"
            size={20}
            color={focusedInput === 'city' ? '#4F46E5' : '#9CA3AF'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="New York"
            value={formData.city}
            onChangeText={text => handleChange('city', text)}
            onFocus={() => setFocusedInput('city')}
            onBlur={() => setFocusedInput(null)}
            editable={!loading}
          />
        </View>
      </View>

      {/* Street */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Street Address</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'street' && styles.inputFocused,
          ]}
        >
          <Ionicons
            name="location-outline"
            size={20}
            color={focusedInput === 'street' ? '#4F46E5' : '#9CA3AF'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="123 Main Street"
            value={formData.street}
            onChangeText={text => handleChange('street', text)}
            onFocus={() => setFocusedInput('street')}
            onBlur={() => setFocusedInput(null)}
            editable={!loading}
          />
        </View>
      </View>

      {/* Zip Code */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Zip Code</Text>
        <View
          style={[
            styles.inputContainer,
            focusedInput === 'zipcode' && styles.inputFocused,
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={focusedInput === 'zipcode' ? '#4F46E5' : '#9CA3AF'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="10001"
            value={formData.zipcode}
            onChangeText={text => handleChange('zipcode', text)}
            onFocus={() => setFocusedInput('zipcode')}
            onBlur={() => setFocusedInput(null)}
            keyboardType="numeric"
            editable={!loading}
          />
        </View>
      </View>

      <View style={styles.noteBox}>
        <Ionicons name="information-circle" size={20} color="#F59E0B" />
        <View style={styles.noteContent}>
          <Text style={styles.noteTitle}>Note about registration</Text>
          <Text style={styles.noteText}>
            This app uses Fake Store API. Your account will be created in the
            mock database and can be accessed with the test credentials.
          </Text>
        </View>
      </View>

      <View style={styles.stepButtons}>
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.buttonDisabled]}
          onPress={handleRegister}
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
              <Text style={styles.registerButtonText}>Creating Account...</Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.registerButtonText}>Create Account</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonHeader}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {renderStepIndicator()}

          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            style={styles.stepsScrollView}
          >
            {renderStep1()}
            {renderStep2()}
            {renderStep3()}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.footerLink}>Sign in instead</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

        </ScrollView>
      
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  stepCircleActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  stepTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
    fontWeight: '600',
  },
  stepTitleActive: {
    color: '#4F46E5',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#4F46E5',
  },
  stepsScrollView: {
    flex: 1,
  },
  stepContent: {
    paddingBottom: 30,
  },
  stepHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
  hintText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
  },
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginLeft: 12,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  noteContent: {
    flex: 1,
    marginLeft: 12,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
    marginRight: 4,
  },
  footerLink: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;


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

// const RegisterScreen = ({ navigation }) => {
//   const [formData, setFormData] = useState({
//     email: '',
//     username: '',
//     password: '',
//     confirmPassword: '',
//     firstname: '',
//     lastname: '',
//     phone: '',
//     city: '',
//     street: '',
//     zipcode: '',
//   });

//   const { signUp, loading } = useAuth();

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleRegister = async () => {
//     const { email, username, password, confirmPassword, firstname, lastname } = formData;
    
//     // Basic validation
//     if (!email || !username || !password || !confirmPassword || !firstname || !lastname) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters');
//       return;
//     }

//     if (!email.includes('@')) {
//       Alert.alert('Error', 'Please enter a valid email');
//       return;
//     }

//     // Prepare user data for Fake Store API
//     const userData = {
//       email,
//       username,
//       password,
//       firstname,
//       lastname,
//       phone: formData.phone || '1-234-567-8900',
//       city: formData.city || 'New York',
//       street: formData.street || '123 Main St',
//       zipcode: formData.zipcode || '10001',
//     };

//     const result = await signUp(userData);
    
//     if (result.success) {
//       // Navigation will be handled by auth state change
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView contentContainerStyle={styles.scrollView}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Create Account</Text>
//             <Text style={styles.subtitle}>Join Fake Store</Text>
//           </View>

//           <View style={styles.form}>
//             <Text style={styles.sectionTitle}>Personal Information</Text>
            
//             <View style={styles.row}>
//               <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
//                 <Text style={styles.label}>First Name *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="John"
//                   value={formData.firstname}
//                   onChangeText={(text) => handleChange('firstname', text)}
//                   editable={!loading}
//                 />
//               </View>
              
//               <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
//                 <Text style={styles.label}>Last Name *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Doe"
//                   value={formData.lastname}
//                   onChangeText={(text) => handleChange('lastname', text)}
//                   editable={!loading}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Email *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="john@example.com"
//                 value={formData.email}
//                 onChangeText={(text) => handleChange('email', text)}
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//                 editable={!loading}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Username *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="johndoe"
//                 value={formData.username}
//                 onChangeText={(text) => handleChange('username', text)}
//                 autoCapitalize="none"
//                 editable={!loading}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Phone</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="1-234-567-8900"
//                 value={formData.phone}
//                 onChangeText={(text) => handleChange('phone', text)}
//                 keyboardType="phone-pad"
//                 editable={!loading}
//               />
//             </View>

//             <Text style={styles.sectionTitle}>Address (Optional)</Text>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>City</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="New York"
//                 value={formData.city}
//                 onChangeText={(text) => handleChange('city', text)}
//                 editable={!loading}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Street</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="123 Main St"
//                 value={formData.street}
//                 onChangeText={(text) => handleChange('street', text)}
//                 editable={!loading}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Zip Code</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="10001"
//                 value={formData.zipcode}
//                 onChangeText={(text) => handleChange('zipcode', text)}
//                 keyboardType="numeric"
//                 editable={!loading}
//               />
//             </View>

//             <Text style={styles.sectionTitle}>Security</Text>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Password *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="At least 6 characters"
//                 value={formData.password}
//                 onChangeText={(text) => handleChange('password', text)}
//                 secureTextEntry
//                 editable={!loading}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Confirm Password *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Confirm your password"
//                 value={formData.confirmPassword}
//                 onChangeText={(text) => handleChange('confirmPassword', text)}
//                 secureTextEntry
//                 editable={!loading}
//               />
//             </View>

//             <TouchableOpacity
//               style={[styles.registerButton, loading && styles.disabledButton]}
//               onPress={handleRegister}
//               disabled={loading}
//             >
//               <Text style={styles.registerButtonText}>
//                 {loading ? 'Creating Account...' : 'Create Account'}
//               </Text>
//             </TouchableOpacity>

//             <View style={styles.footer}>
//               <Text style={styles.footerText}>Already have an account? </Text>
//               <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                 <Text style={styles.signInText}>Sign In</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.noteBox}>
//             <Text style={styles.noteTitle}>Note:</Text>
//             <Text style={styles.noteText}>
//               • This uses Fake Store API for demonstration
//               {'\n'}• New users are temporary and won't persist
//               {'\n'}• Use test accounts for persistent login
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
//     padding: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
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
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#374151',
//     marginTop: 8,
//     marginBottom: 16,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   row: {
//     flexDirection: 'row',
//     marginBottom: 16,
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
//   registerButton: {
//     backgroundColor: '#10B981',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   disabledButton: {
//     backgroundColor: '#9CA3AF',
//   },
//   registerButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   footerText: {
//     color: '#6B7280',
//     fontSize: 14,
//   },
//   signInText: {
//     color: '#4F46E5',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   noteBox: {
//     backgroundColor: '#FEF3C7',
//     borderRadius: 8,
//     padding: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#F59E0B',
//   },
//   noteTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#92400E',
//     marginBottom: 8,
//   },
//   noteText: {
//     fontSize: 13,
//     color: '#92400E',
//     lineHeight: 20,
//   },
// });

// export default RegisterScreen;