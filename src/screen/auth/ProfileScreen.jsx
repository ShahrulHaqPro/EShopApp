import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../api/hoohs/useCart';
import { ordersApi } from '../../api';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user, signOut, updateProfile, loading: authLoading } = useAuth();
  const { getUserCart, loading: cartLoading } = useCart();
  const [userCart, setUserCart] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Load cart data
      const cartData = await getUserCart.execute(user.id);
      setUserCart(cartData.data?.[0]);

      // Load orders data
      setLoadingOrders(true);
      const orders = await ordersApi.getUserOrders(user.id);
      setUserOrders(orders);
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleEditField = (field, value) => {
    setEditField(field);
    setEditValue(value);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    setSaving(true);
    try {
      const updateData = {};
      
      switch (editField) {
        case 'firstname':
          updateData.name = { ...user.name, firstname: editValue };
          break;
        case 'lastname':
          updateData.name = { ...user.name, lastname: editValue };
          break;
        case 'email':
          updateData.email = editValue;
          break;
        case 'phone':
          updateData.phone = editValue;
          break;
        case 'city':
          updateData.address = { ...user.address, city: editValue };
          break;
        case 'street':
          updateData.address = { ...user.address, street: editValue };
          break;
      }

      const result = await updateProfile(updateData);
      if (result.success) {
        setEditModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const renderProfileSection = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.firstname?.[0]?.toUpperCase() || 'U'}
            {user?.name?.lastname?.[0]?.toUpperCase() || ''}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>
            {user?.name?.firstname} {user?.name?.lastname}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userId}>User ID: {user?.id}</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="cart-outline" size={24} color="#4F46E5" />
          <Text style={styles.statValue}>
            {userCart ? userCart.products?.length || 0 : 0}
          </Text>
          <Text style={styles.statLabel}>Cart Items</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="receipt-outline" size={24} color="#10B981" />
          <Text style={styles.statValue}>{userOrders.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="star-outline" size={24} color="#F59E0B" />
          <Text style={styles.statValue}>Member</Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-circle-outline" size={20} color="#374151" />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>

        <TouchableOpacity
          style={styles.infoItem}
          onPress={() =>
            handleEditField(
              'firstname',
              user?.name?.firstname || ''
            )
          }
        >
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>First Name</Text>
            <Text style={styles.infoValue}>{user?.name?.firstname}</Text>
          </View>
          <Ionicons name="create-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoItem}
          onPress={() =>
            handleEditField('lastname', user?.name?.lastname || '')
          }
        >
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Last Name</Text>
            <Text style={styles.infoValue}>{user?.name?.lastname}</Text>
          </View>
          <Ionicons name="create-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => handleEditField('email', user?.email || '')}
        >
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <Ionicons name="create-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => handleEditField('phone', user?.phone || '')}
        >
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{user?.phone || 'Not set'}</Text>
          </View>
          <Ionicons name="create-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Address Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={20} color="#374151" />
          <Text style={styles.sectionTitle}>Address</Text>
        </View>

        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => handleEditField('city', user?.address?.city || '')}
        >
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>
              {user?.address?.city || 'Not set'}
            </Text>
          </View>
          <Ionicons name="create-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => handleEditField('street', user?.address?.street || '')}
        >
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Street</Text>
            <Text style={styles.infoValue}>
              {user?.address?.street || 'Not set'}
            </Text>
          </View>
          <Ionicons name="create-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.infoItem}>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Zip Code</Text>
            <Text style={styles.infoValue}>{user?.address?.zipcode}</Text>
          </View>
        </View>
      </View>

      {/* Account Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="key-outline" size={20} color="#374151" />
          <Text style={styles.sectionTitle}>Account</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>{user?.username}</Text>
          </View>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderOrdersSection = () => (
    <View style={styles.ordersSection}>
      <Text style={styles.ordersTitle}>My Orders</Text>
      {loadingOrders ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : userOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={60} color="#E5E7EB" />
          <Text style={styles.emptyStateTitle}>No orders yet</Text>
          <Text style={styles.emptyStateText}>
            Your order history will appear here
          </Text>
        </View>
      ) : (
        userOrders.map((order, index) => (
          <TouchableOpacity key={index} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.orderItems}>
                {order.products?.length || 0} items
              </Text>
              <Text style={styles.orderTotal}>${order.total?.toFixed(2)}</Text>
            </View>
            <View style={styles.orderStatus}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Completed</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Tabs */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
              onPress={() => setActiveTab('profile')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'profile' && styles.activeTabText,
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
              onPress={() => setActiveTab('orders')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'orders' && styles.activeTabText,
                ]}
              >
                Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'profile' ? renderProfileSection() : renderOrdersSection()}

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={authLoading}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* API Note */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={16} color="#6B7280" />
          <Text style={styles.noteText}>
            Connected to Fake Store API. Profile data is read-only in this demo.
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit {editField === 'firstname' ? 'First Name' :
                  editField === 'lastname' ? 'Last Name' :
                  editField === 'email' ? 'Email' :
                  editField === 'phone' ? 'Phone' :
                  editField === 'city' ? 'City' :
                  editField === 'street' ? 'Street' : ''}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editField}`}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setEditModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveButton, saving && styles.buttonDisabled]}
                onPress={handleSaveEdit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSaveText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  ordersSection: {
    padding: 20,
  },
  ordersTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderItems: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  orderStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modalSaveButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    marginLeft: 8,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
});

export default ProfileScreen;



// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import { useAuth } from '../../context/AuthContext';
// import { Ionicons } from '@expo/vector-icons';

// const ProfileScreen = () => {
//   const { user, signOut, getUserCart } = useAuth();

//   const handleSignOut = () => {
//     Alert.alert(
//       'Sign Out',
//       'Are you sure you want to sign out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Sign Out', style: 'destructive', onPress: signOut },
//       ]
//     );
//   };

//   const handleViewCart = async () => {
//     const cart = await getUserCart();
//     Alert.alert(
//       'Your Cart',
//       `You have ${cart.length} cart(s) in the system.`,
//       [{ text: 'OK' }]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollView}>
//         <View style={styles.header}>
//           <View style={styles.avatarContainer}>
//             <Text style={styles.avatarText}>
//               {user?.name?.firstname?.[0] || 'U'}
//             </Text>
//           </View>
//           <Text style={styles.userName}>
//             {user?.name?.firstname} {user?.name?.lastname}
//           </Text>
//           <Text style={styles.userEmail}>{user?.email}</Text>
//           <Text style={styles.userUsername}>@{user?.username}</Text>
//         </View>

//         <View style={styles.infoCard}>
//           <Text style={styles.cardTitle}>Account Information</Text>
          
//           <View style={styles.infoRow}>
//             <Ionicons name="person-outline" size={20} color="#6B7280" />
//             <View style={styles.infoContent}>
//               <Text style={styles.infoLabel}>Full Name</Text>
//               <Text style={styles.infoValue}>
//                 {user?.name?.firstname} {user?.name?.lastname}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.infoRow}>
//             <Ionicons name="mail-outline" size={20} color="#6B7280" />
//             <View style={styles.infoContent}>
//               <Text style={styles.infoLabel}>Email</Text>
//               <Text style={styles.infoValue}>{user?.email}</Text>
//             </View>
//           </View>

//           <View style={styles.infoRow}>
//             <Ionicons name="call-outline" size={20} color="#6B7280" />
//             <View style={styles.infoContent}>
//               <Text style={styles.infoLabel}>Phone</Text>
//               <Text style={styles.infoValue}>{user?.phone}</Text>
//             </View>
//           </View>

//           <View style={styles.infoRow}>
//             <Ionicons name="location-outline" size={20} color="#6B7280" />
//             <View style={styles.infoContent}>
//               <Text style={styles.infoLabel}>Address</Text>
//               <Text style={styles.infoValue}>
//                 {user?.address?.street}, {user?.address?.city}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.statsCard}>
//           <Text style={styles.cardTitle}>Account Stats</Text>
          
//           <View style={styles.statsGrid}>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>{user?.id}</Text>
//               <Text style={styles.statLabel}>User ID</Text>
//             </View>
            
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>
//                 {user?.address?.zipcode}
//               </Text>
//               <Text style={styles.statLabel}>Zip Code</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.actionsCard}>
//           <Text style={styles.cardTitle}>Actions</Text>
          
//           <TouchableOpacity style={styles.actionButton} onPress={handleViewCart}>
//             <Ionicons name="cart-outline" size={24} color="#4F46E5" />
//             <View style={styles.actionContent}>
//               <Text style={styles.actionText}>View My Cart</Text>
//               <Text style={styles.actionSubtext}>Check your shopping cart</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionButton}>
//             <Ionicons name="settings-outline" size={24} color="#4F46E5" />
//             <View style={styles.actionContent}>
//               <Text style={styles.actionText}>Settings</Text>
//               <Text style={styles.actionSubtext}>Account preferences</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionButton}>
//             <Ionicons name="help-circle-outline" size={24} color="#4F46E5" />
//             <View style={styles.actionContent}>
//               <Text style={styles.actionText}>Help & Support</Text>
//               <Text style={styles.actionSubtext}>Get help with your account</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={styles.signOutButton}
//           onPress={handleSignOut}
//         >
//           <Ionicons name="log-out-outline" size={20} color="#EF4444" />
//           <Text style={styles.signOutText}>Sign Out</Text>
//         </TouchableOpacity>

//         <View style={styles.noteBox}>
//           <Text style={styles.noteText}>
//             Note: This account is from Fake Store API. Data is read-only.
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   scrollView: {
//     padding: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   avatarContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#4F46E5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   avatarText: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   userName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   userEmail: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   userUsername: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
//   infoCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   statsCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   actionsCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   infoContent: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 2,
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#111827',
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#4F46E5',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   actionContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   actionText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   actionSubtext: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   signOutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FEF2F2',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 20,
//   },
//   signOutText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#EF4444',
//     marginLeft: 8,
//   },
//   noteBox: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center',
//   },
//   noteText: {
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
// });

// export default ProfileScreen;