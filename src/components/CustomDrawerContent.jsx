import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Alert
} from "react-native";
import { 
  DrawerContentScrollView, 
  DrawerItemList 
} from "@react-navigation/drawer";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CustomDrawerContent(props) {
  const state = props.state;
  const activeRoute = state.routeNames[state.index];
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [stats] = useState({
    orders: 24,
    reviews: 18,
    points: 1250,
  });

  // Animation values
  const scaleAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setUser(users[selectedUserIndex]);
      setLoading(false);
    }
  }, [users, selectedUserIndex]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fakestoreapi.com/users');
      const data = await response.json();
      
      // Enhance user data with avatar and additional info
      const enhancedUsers = data.map((user, index) => ({
        ...user,
        id: user.id,
        avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
        membership: ['Silver', 'Gold', 'Platinum'][index % 3],
        joinDate: `2023-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
        phone: `+1 (555) ${String(100 + index).padStart(3, '0')}-${String(1000 + index).padStart(4, '0')}`,
        address: user.address
          ? `${user.address.number || '123'} ${user.address.street || 'Main St'}, ${user.address.city || 'New York'}, ${user.address.zipcode || '10001'}`
          : '123 Main Street, New York, NY 10001',
      }));
      
      setUsers(enhancedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to load user data');
      setLoading(false);
    }
  };

  const handleAvatarPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSwitchUser = () => {
    if (users.length > 0) {
      const nextIndex = (selectedUserIndex + 1) % users.length;
      setSelectedUserIndex(nextIndex);
      setUser(users[nextIndex]);
    }
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
            props.navigation.closeDrawer();
            props.navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    props.navigation.navigate('Profile');
  };

  const renderUserInfo = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      );
    }

    if (!user) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="account-alert" size={40} color="#FFFFFF" />
          <Text style={styles.errorText}>No user data available</Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.profileHeader}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatar}
              />
              <View style={styles.onlineStatus} />
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.userMainInfo}>
            <Text style={styles.userName}>
              {user.name?.firstname || 'John'} {user.name?.lastname || 'Doe'}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            <View style={styles.userActions}>
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={handleEditProfile}
              >
                <Icon name="pencil" size={14} color="#3B82F6" />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.switchUserButton}
                onPress={handleSwitchUser}
              >
                <Icon name="account-switch" size={14} color="#8B5CF6" />
                <Text style={styles.switchUserText}>Switch User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.userDetails}>
          <View style={styles.userDetailRow}>
            <Icon name="phone" size={14} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.userDetailText}>{user.phone}</Text>
          </View>
          
          <View style={styles.userDetailRow}>
            <Icon name="map-marker" size={14} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.userDetailText} numberOfLines={1}>
              {user.address}
            </Text>
          </View>
          
          <View style={styles.userDetailRow}>
            <Icon name="calendar" size={14} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.userDetailText}>Joined {user.joinDate}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#3B82F620' }]}>
              <Icon name="package-variant" size={18} color="#3B82F6" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{stats.orders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
              <Icon name="star" size={18} color="#10B981" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{stats.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#F59E0B20' }]}>
              <Icon name="crown" size={18} color="#F59E0B" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{user.membership}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  // Custom drawer item component
  const renderCustomDrawerItem = (route, index) => {
    const isActive = activeRoute === route.name;
    const iconName = getIconForRoute(route.name);
    const showBadge = shouldShowBadge(route.name);

    return (
      <TouchableOpacity
        key={route.key}
        style={[
          styles.drawerItem,
          isActive && styles.activeDrawerItem
        ]}
        onPress={() => props.navigation.navigate(route.name)}
      >
        <View style={styles.drawerItemContent}>
          <View style={[
            styles.iconContainer,
            isActive && styles.activeIconContainer
          ]}>
            <Icon 
              name={iconName} 
              size={22} 
              color={isActive ? '#FFFFFF' : '#6B7280'} 
            />
          </View>
          <Text style={[
            styles.drawerLabel,
            isActive && styles.activeDrawerLabel
          ]}>
            {props.descriptors[route.key].options.drawerLabel || route.name}
          </Text>
        </View>
        
        {showBadge && (
          <View style={[
            styles.badge,
            route.name === 'Deals' ? styles.hotBadge : styles.countBadge
          ]}>
            <Text style={styles.badgeText}>
              {getBadgeContent(route.name)}
            </Text>
          </View>
        )}
        
        {!showBadge && (
          <Icon name="chevron-right" size={20} color="#D1D5DB" />
        )}
      </TouchableOpacity>
    );
  };

  // Icon mapping for routes
  const getIconForRoute = (routeName) => {
    const icons = {
      'Home': 'home-outline',
      'Categories': 'view-grid-outline',
      'Deals': 'tag-outline',
      'Orders': 'package-variant-outline',
      'Wishlist': 'heart-outline',
      'Cart': 'cart-outline',
      'Notifications': 'bell-outline',
      'Messages': 'message-outline',
      'Settings': 'cog-outline',
      'Help': 'help-circle-outline',
      'About': 'information-outline',
      'Invite': 'gift-outline',
      'Wallet': 'wallet-outline',
      'Addresses': 'map-marker-outline',
    };
    return icons[routeName] || 'circle-outline';
  };

  // Badge configuration
  const shouldShowBadge = (routeName) => {
    const badges = {
      'Deals': true,
      'Wishlist': true,
      'Cart': true,
      'Notifications': true,
      'Messages': true,
    };
    return badges[routeName] || false;
  };

  const getBadgeContent = (routeName) => {
    const badgeContents = {
      'Deals': 'HOT',
      'Wishlist': '12',
      'Cart': '5',
      'Notifications': '3',
      'Messages': '2',
    };
    return badgeContents[routeName] || '';
  };

  // Group routes into sections
  const groupRoutes = () => {
    const sections = {
      main: [],
      shopping: [],
      account: [],
      settings: [],
    };

    state.routes.forEach(route => {
      if (['Home', 'Categories', 'Deals', 'Orders'].includes(route.name)) {
        sections.main.push(route);
      } else if (['Wishlist', 'Cart', 'Notifications', 'Messages'].includes(route.name)) {
        sections.shopping.push(route);
      } else if (['Wallet', 'Addresses'].includes(route.name)) {
        sections.account.push(route);
      } else if (['Settings', 'Help', 'About', 'Invite'].includes(route.name)) {
        sections.settings.push(route);
      } else {
        sections.main.push(route);
      }
    });

    return sections;
  };

  const sections = groupRoutes();

  return (
    <View style={styles.container}>
      {/* Status Bar Spacer for iOS */}
      {Platform.OS === 'ios' && <View style={styles.statusBarSpacer} />}
      
      {/* User Profile Section with Gradient */}
      <LinearGradient
        colors={['#1F2937', '#111827', '#030712']}
        style={styles.profileSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {renderUserInfo()}
      </LinearGradient>

      {/* Scrollable Menu Content */}
      <DrawerContentScrollView 
        {...props}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAIN</Text>
          {sections.main.map(renderCustomDrawerItem)}
        </View>

        {/* Shopping Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SHOPPING</Text>
          {sections.shopping.map(renderCustomDrawerItem)}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          {sections.account.map(renderCustomDrawerItem)}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          {sections.settings.map(renderCustomDrawerItem)}
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.promoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="gift" size={32} color="#FFFFFF" />
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Welcome Bonus!</Text>
              <Text style={styles.promoText}>Get 500 extra points on first purchase</Text>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Claim Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="history" size={20} color="#D97706" />
              </View>
              <Text style={styles.actionText}>Recent</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Icon name="download" size={20} color="#1D4ED8" />
              </View>
              <Text style={styles.actionText}>Downloads</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#FCE7F3' }]}>
                <Icon name="share-variant" size={20} color="#BE185D" />
              </View>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
                <Icon name="qrcode" size={20} color="#065F46" />
              </View>
              <Text style={styles.actionText}>QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>User ID: {user?.id || 'N/A'}</Text>
          <Text style={styles.copyrightText}>FakeStore • v1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusBarSpacer: {
    height: Platform.OS === 'ios' ? StatusBar.currentHeight || 44 : 0,
  },
  profileSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#3B82F6',
    backgroundColor: '#F3F4F6',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#1F2937',
  },
  userMainInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  userActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 4,
  },
  switchUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  switchUserText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginLeft: 4,
  },
  userDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  userDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userDetailText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 10,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeDrawerItem: {
    backgroundColor: '#F3F4F6',
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeIconContainer: {
    backgroundColor: '#3B82F6',
  },
  drawerLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  activeDrawerLabel: {
    color: '#111827',
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  hotBadge: {
    backgroundColor: '#EF4444',
  },
  countBadge: {
    backgroundColor: '#3B82F6',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  promoBanner: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  promoGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoContent: {
    marginLeft: 16,
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 48) / 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionInfo: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});




// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Platform,
//   Animated,
//   Dimensions
// } from "react-native";
// import { 
//   DrawerContentScrollView, 
//   DrawerItemList,
//   DrawerItem 
// } from "@react-navigation/drawer";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const { width } = Dimensions.get('window');

// export default function CustomDrawerContent(props) {
//   const state = props.state;
//   const activeRoute = state.routeNames[state.index];
//   const [user] = useState({
//     name: 'Alex Johnson',
//     email: 'alex@example.com',
//     avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
//     membership: 'Gold Member',
//     points: 1250,
//   });

//   // Animation values
//   const scaleAnim = new Animated.Value(1);
//   const rotateAnim = new Animated.Value(0);

//   const handleAvatarPress = () => {
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 1.2,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   // Custom drawer item component
//   const renderCustomDrawerItem = (route, index) => {
//     const isActive = activeRoute === route.name;
//     const iconName = getIconForRoute(route.name);
//     const showBadge = shouldShowBadge(route.name);

//     return (
//       <TouchableOpacity
//         key={route.key}
//         style={[
//           styles.drawerItem,
//           isActive && styles.activeDrawerItem
//         ]}
//         onPress={() => props.navigation.navigate(route.name)}
//       >
//         <View style={styles.drawerItemContent}>
//           <View style={[
//             styles.iconContainer,
//             isActive && styles.activeIconContainer
//           ]}>
//             <Icon 
//               name={iconName} 
//               size={22} 
//               color={isActive ? '#FFFFFF' : '#6B7280'} 
//             />
//           </View>
//           <Text style={[
//             styles.drawerLabel,
//             isActive && styles.activeDrawerLabel
//           ]}>
//             {props.descriptors[route.key].options.drawerLabel || route.name}
//           </Text>
//         </View>
        
//         {showBadge && (
//           <View style={[
//             styles.badge,
//             route.name === 'Deals' ? styles.hotBadge : styles.countBadge
//           ]}>
//             <Text style={styles.badgeText}>
//               {getBadgeContent(route.name)}
//             </Text>
//           </View>
//         )}
        
//         {!showBadge && (
//           <Icon name="chevron-right" size={20} color="#D1D5DB" />
//         )}
//       </TouchableOpacity>
//     );
//   };

//   // Icon mapping for routes
//   const getIconForRoute = (routeName) => {
//     const icons = {
//       'Home': 'home-outline',
//       'Categories': 'view-grid-outline',
//       'Deals': 'tag-outline',
//       'Orders': 'package-variant-outline',
//       'Wishlist': 'heart-outline',
//       'Cart': 'cart-outline',
//       'Notifications': 'bell-outline',
//       'Messages': 'message-outline',
//       'Settings': 'cog-outline',
//       'Help': 'help-circle-outline',
//       'About': 'information-outline',
//       'Invite': 'gift-outline',
//       'Wallet': 'wallet-outline',
//       'Addresses': 'map-marker-outline',
//     };
//     return icons[routeName] || 'circle-outline';
//   };

//   // Badge configuration
//   const shouldShowBadge = (routeName) => {
//     const badges = {
//       'Deals': true,
//       'Wishlist': true,
//       'Cart': true,
//       'Notifications': true,
//       'Messages': true,
//     };
//     return badges[routeName] || false;
//   };

//   const getBadgeContent = (routeName) => {
//     const badgeContents = {
//       'Deals': 'HOT',
//       'Wishlist': '12',
//       'Cart': '5',
//       'Notifications': '3',
//       'Messages': '2',
//     };
//     return badgeContents[routeName] || '';
//   };

//   // Group routes into sections
//   const groupRoutes = () => {
//     const sections = {
//       main: [],
//       shopping: [],
//       account: [],
//       settings: [],
//     };

//     state.routes.forEach(route => {
//       if (['Home', 'Categories', 'Deals', 'Orders'].includes(route.name)) {
//         sections.main.push(route);
//       } else if (['Wishlist', 'Cart', 'Notifications', 'Messages'].includes(route.name)) {
//         sections.shopping.push(route);
//       } else if (['Wallet', 'Addresses'].includes(route.name)) {
//         sections.account.push(route);
//       } else if (['Settings', 'Help', 'About', 'Invite'].includes(route.name)) {
//         sections.settings.push(route);
//       } else {
//         sections.main.push(route);
//       }
//     });

//     return sections;
//   };

//   const sections = groupRoutes();

//   const handleLogout = () => {
//     // Add your logout logic here
//     props.navigation.closeDrawer();
//     props.navigation.navigate('Login');
//   };

//   const handleEditProfile = () => {
//     props.navigation.navigate('Profile');
//   };

//   return (
//     <View style={styles.container}>
//       {/* Status Bar Spacer for iOS */}
//       {Platform.OS === 'ios' && <View style={styles.statusBarSpacer} />}
      
//       {/* User Profile Section */}
//       <View style={styles.profileSection}>
//         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//           <TouchableOpacity onPress={handleAvatarPress}>
//             <Image 
//               source={{ uri: user.avatar }} 
//               style={styles.avatar}
//             />
//             <View style={styles.onlineStatus} />
//           </TouchableOpacity>
//         </Animated.View>
        
//         <View style={styles.userInfo}>
//           <Text style={styles.userName}>{user.name}</Text>
//           <Text style={styles.userEmail}>{user.email}</Text>
          
//           <View style={styles.userStats}>
//             <View style={styles.statItem}>
//               <Icon name="crown" size={16} color="#F59E0B" />
//               <Text style={styles.statText}>{user.membership}</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statItem}>
//               <Icon name="star" size={16} color="#3B82F6" />
//               <Text style={styles.statText}>{user.points} points</Text>
//             </View>
//           </View>
          
//           <TouchableOpacity 
//             style={styles.editProfileButton}
//             onPress={handleEditProfile}
//           >
//             <Icon name="pencil" size={14} color="#3B82F6" />
//             <Text style={styles.editProfileText}>Edit Profile</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Scrollable Content */}
//       <DrawerContentScrollView 
//         {...props}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Main Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>MAIN</Text>
//           {sections.main.map(renderCustomDrawerItem)}
//         </View>

//         {/* Shopping Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>SHOPPING</Text>
//           {sections.shopping.map(renderCustomDrawerItem)}
//         </View>

//         {/* Account Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>ACCOUNT</Text>
//           {sections.account.map(renderCustomDrawerItem)}
//         </View>

//         {/* Settings Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>SETTINGS</Text>
//           {sections.settings.map(renderCustomDrawerItem)}
//         </View>

//         {/* Promotional Banner */}
//         <View style={styles.promoBanner}>
//           <Icon name="gift" size={28} color="#8B5CF6" />
//           <View style={styles.promoContent}>
//             <Text style={styles.promoTitle}>Get 20% Off</Text>
//             <Text style={styles.promoText}>On your first order</Text>
//             <TouchableOpacity style={styles.promoButton}>
//               <Text style={styles.promoButtonText}>Claim Now</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </DrawerContentScrollView>

//       {/* Footer Section */}
//       <View style={styles.footer}>
//         <TouchableOpacity 
//           style={styles.logoutButton}
//           onPress={handleLogout}
//         >
//           <Icon name="logout" size={20} color="#EF4444" />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
        
//         <View style={styles.versionInfo}>
//           <Text style={styles.versionText}>FakeStore v1.0.0</Text>
//           <Text style={styles.copyrightText}>© 2024 All rights reserved</Text>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   statusBarSpacer: {
//     height: Platform.OS === 'ios' ? StatusBar.currentHeight || 44 : 0,
//   },
//   profileSection: {
//     backgroundColor: '#1F2937',
//     paddingHorizontal: 24,
//     paddingVertical: 32,
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 8,
//     marginBottom: 8,
//   },
//   avatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     borderWidth: 3,
//     borderColor: '#3B82F6',
//     backgroundColor: '#F3F4F6',
//   },
//   onlineStatus: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: '#10B981',
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   userInfo: {
//     marginLeft: 20,
//     flex: 1,
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   userEmail: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginBottom: 12,
//   },
//   userStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statDivider: {
//     width: 1,
//     height: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     marginHorizontal: 12,
//   },
//   statText: {
//     fontSize: 12,
//     color: '#FFFFFF',
//     fontWeight: '500',
//     marginLeft: 6,
//   },
//   editProfileButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   editProfileText: {
//     fontSize: 12,
//     color: '#3B82F6',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   scrollContent: {
//     paddingTop: 16,
//     paddingBottom: 20,
//   },
//   section: {
//     paddingHorizontal: 16,
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#9CA3AF',
//     letterSpacing: 1,
//     marginBottom: 12,
//     textTransform: 'uppercase',
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     marginBottom: 4,
//   },
//   activeDrawerItem: {
//     backgroundColor: '#F3F4F6',
//   },
//   drawerItemContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   activeIconContainer: {
//     backgroundColor: '#3B82F6',
//   },
//   drawerLabel: {
//     fontSize: 15,
//     color: '#374151',
//     fontWeight: '500',
//     flex: 1,
//   },
//   activeDrawerLabel: {
//     color: '#111827',
//     fontWeight: '600',
//   },
//   badge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//     marginRight: 8,
//   },
//   hotBadge: {
//     backgroundColor: '#EF4444',
//   },
//   countBadge: {
//     backgroundColor: '#3B82F6',
//   },
//   badgeText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   promoBanner: {
//     backgroundColor: '#F5F3FF',
//     marginHorizontal: 16,
//     marginTop: 20,
//     marginBottom: 10,
//     borderRadius: 16,
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   promoContent: {
//     marginLeft: 16,
//     flex: 1,
//   },
//   promoTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   promoText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 12,
//   },
//   promoButton: {
//     backgroundColor: '#8B5CF6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     alignSelf: 'flex-start',
//   },
//   promoButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   footer: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FEF2F2',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginBottom: 16,
//     gap: 8,
//   },
//   logoutText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#EF4444',
//   },
//   versionInfo: {
//     alignItems: 'center',
//   },
//   versionText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   copyrightText: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
// });


// // import { View, Text, StyleSheet } from "react-native";
// // import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

// // export default function CustomDrawerContent(props) {
// //   const state = props.state;
// //   const activeRoute = state.routeNames[state.index];

// //   return (
// //     <DrawerContentScrollView {...props}>
// //       {/* Drawer Header */}
// //       <View style={styles.header}>
// //         <Text style={styles.title}>Gift Shop</Text>
// //         <Text style={styles.subtitle}>{activeRoute}</Text>
// //       </View>

// //       {/* Drawer Items */}
// //       <DrawerItemList {...props} />
// //     </DrawerContentScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   header: {
// //     padding: 20,
// //     backgroundColor: "#4F46E5",
// //     marginBottom: 10,
// //     borderRadius: 14
// //   },
// //   title: {
// //     color: "#fff",
// //     fontSize: 20,
// //     fontWeight: "bold",
// //   },
// //   subtitle: {
// //     color: "#E0E7FF",
// //     marginTop: 4,
// //   },
// // });
