import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  Switch,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    memberSince: '2023',
    orders: 24,
    reviews: 18,
    favorites: 42,
    isNotificationEnabled: true,
    isDarkMode: false,
  });
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState('profile');

  // Mock order history
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      items: 3,
      total: 149.99,
      status: 'delivered',
      tracking: 'TRK123456789',
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      items: 2,
      total: 89.99,
      status: 'shipped',
      tracking: 'TRK987654321',
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      items: 1,
      total: 59.99,
      status: 'processing',
      tracking: 'TRK456123789',
    },
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const handleEditProfile = (field, value) => {
    setEditField(field);
    setEditValue(value);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    setUser(prev => ({
      ...prev,
      [editField]: editValue,
    }));
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const toggleNotification = () => {
    setUser(prev => ({
      ...prev,
      isNotificationEnabled: !prev.isNotificationEnabled,
    }));
  };

  const toggleDarkMode = () => {
    setUser(prev => ({
      ...prev,
      isDarkMode: !prev.isDarkMode,
    }));
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#374151" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Profile</Text>
      <TouchableOpacity 
        style={styles.editProfileButton}
        onPress={() => handleEditProfile('name', user.name)}
      >
        <Icon name="pencil" size={20} color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );

  const renderUserInfo = () => (
    <View style={styles.userInfoSection}>
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.avatar}
        />
        <TouchableOpacity 
          style={styles.changeAvatarButton}
          onPress={() => handleEditProfile('avatar', user.avatar)}
        >
          <Icon name="camera" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.orders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.reviews}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.favorites}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>
    </View>
  );

  const renderMenuItems = () => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>Account</Text>
      
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => handleEditProfile('name', user.name)}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: '#EFF6FF' }]}>
            <Icon name="account" size={20} color="#3B82F6" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>Personal Information</Text>
            <Text style={styles.menuItemSubtitle}>Name, email, phone</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => handleEditProfile('address', user.address)}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: '#FEF2F2' }]}>
            <Icon name="map-marker" size={20} color="#EF4444" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>Shipping Address</Text>
            <Text style={styles.menuItemSubtitle}>Manage your addresses</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('PaymentMethods')}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: '#ECFDF5' }]}>
            <Icon name="credit-card" size={20} color="#10B981" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>Payment Methods</Text>
            <Text style={styles.menuItemSubtitle}>Credit cards, PayPal</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('OrderHistory')}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
            <Icon name="package-variant" size={20} color="#F59E0B" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>Order History</Text>
            <Text style={styles.menuItemSubtitle}>View all your orders</Text>
          </View>
        </View>
        <View style={styles.orderCountBadge}>
          <Text style={styles.orderCountText}>{orders.length}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>Settings</Text>
      
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('Settings')}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: '#F5F3FF' }]}>
            <Icon name="cog" size={20} color="#8B5CF6" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>App Settings</Text>
            <Text style={styles.menuItemSubtitle}>Notifications, theme, language</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <View style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: '#F3F4F6' }]}>
            <Icon name="bell" size={20} color="#374151" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>Notifications</Text>
            <Text style={styles.menuItemSubtitle}>Order updates, promotions</Text>
          </View>
        </View>
        <Switch
          value={user.isNotificationEnabled}
          onValueChange={toggleNotification}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: '#1F2937' }]}>
            <Icon name="theme-light-dark" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>Dark Mode</Text>
            <Text style={styles.menuItemSubtitle}>Switch to dark theme</Text>
          </View>
        </View>
        <Switch
          value={user.isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('HelpCenter')}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: '#DBEAFE' }]}>
            <Icon name="help-circle" size={20} color="#3B82F6" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>Help Center</Text>
            <Text style={styles.menuItemSubtitle}>FAQs, contact support</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('About')}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: '#FCE7F3' }]}>
            <Icon name="information" size={20} color="#EC4899" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>About</Text>
            <Text style={styles.menuItemSubtitle}>App version, terms</Text>
          </View>
        </View>
        <Text style={styles.versionText}>v1.0.0</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecentOrders = () => (
    <View style={styles.ordersSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {orders.map((order) => (
        <TouchableOpacity 
          key={order.id} 
          style={styles.orderCard}
          onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
        >
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) }
            ]}>
              <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.orderDetails}>
            <Text style={styles.orderItems}>{order.items} items</Text>
            <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
          </View>
          
          <View style={styles.orderFooter}>
            <TouchableOpacity style={styles.trackButton}>
              <Icon name="truck-fast" size={16} color="#3B82F6" />
              <Text style={styles.trackText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reorderButton}>
              <Text style={styles.reorderText}>Reorder</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return '#D1FAE5';
      case 'shipped': return '#DBEAFE';
      case 'processing': return '#FEF3C7';
      default: return '#F3F4F6';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {renderProfileHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderUserInfo()}
        {renderMenuItems()}
        {renderSettingsSection()}
        {renderRecentOrders()}
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Member since {user.memberSince}</Text>
          <Text style={styles.footerText}>FakeStore v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit {editField === 'name' ? 'Name' : editField === 'email' ? 'Email' : 'Avatar URL'}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter your ${editField}`}
              autoFocus
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  editProfileButton: {
    padding: 8,
  },
  userInfoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#D1D5DB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderCountBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  orderCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  ordersSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  orderCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111827',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderItems: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trackText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  reorderButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  reorderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;


// import { StyleSheet, Text, View, Button } from "react-native";

// export default function ProfileScreen({navigation}) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>ProfileScreen</Text>
//       <Button
//         title="Go to Settings"
//         onPress={() => navigation.navigate("Settings")}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
// });
