import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useCart } from "../context/CartContext";

const CartScreen = ({ navigation }) => {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useCart();

  const [selectedItems, setSelectedItems] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");

  // Coupon codes
  const coupons = {
    WELCOME10: { discount: 10, type: "percentage", minPurchase: 50 },
    SAVE20: { discount: 20, type: "percentage", minPurchase: 100 },
    FLAT50: { discount: 50, type: "fixed", minPurchase: 200 },
    FREESHIP: { discount: 0, type: "freeShipping", minPurchase: 0 },
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      if (selectedItems[item.id]) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);

    const shipping =
      appliedCoupon?.type === "freeShipping" ? 0 : subtotal > 0 ? 5.99 : 0;

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        discount = (subtotal * appliedCoupon.discount) / 100;
      } else if (appliedCoupon.type === "fixed") {
        discount = appliedCoupon.discount;
      }
    }

    const tax = (subtotal - discount) * 0.1; // 10% tax
    const total = Math.max(0, subtotal + shipping + tax - discount);

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
      itemsCount: cartItems.filter((item) => selectedItems[item.id]).length,
    };
  };

  const totals = calculateTotals();

  // Apply coupon code
  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      Alert.alert("Error", "Please enter a coupon code");
      return;
    }

    if (appliedCoupon && appliedCoupon.code === code) {
      Alert.alert("Info", "Coupon already applied");
      return;
    }

    const coupon = coupons[code];

    if (!coupon) {
      Alert.alert("Error", "Invalid coupon code");
      return;
    }

    const subtotal = cartItems.reduce((sum, item) => {
      if (selectedItems[item.id]) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);

    if (subtotal < coupon.minPurchase) {
      Alert.alert(
        "Error",
        `Minimum purchase of $${coupon.minPurchase} required`
      );
      return;
    }

    setAppliedCoupon({ ...coupon, code });
    Alert.alert("Success", "Coupon applied successfully!");
    setCouponCode("");
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    updateQuantity(itemId, newQuantity);
  };

  // Select/deselect item
  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Select all items
  const selectAllItems = () => {
    const allSelected = cartItems.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
    setSelectedItems(allSelected);
  };

  // Deselect all items
  const deselectAllItems = () => {
    setSelectedItems({});
  };

  // Clear entire cart
  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            clearCart();
            setSelectedItems({});
            setAppliedCoupon(null);
          },
        },
      ]
    );
  };

  // Checkout
  const handleCheckout = () => {
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;
    if (selectedCount === 0) {
      Alert.alert("Error", "Please select at least one item to checkout");
      return;
    }
    setShowCheckoutModal(true);
  };

  // Process payment
  const processPayment = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowCheckoutModal(false);
      Alert.alert("Success!", "Your order has been placed successfully", [
        {
          text: "OK",
          onPress: () => {
            // Remove selected items from cart
            const remainingItems = cartItems.filter(
              (item) => !selectedItems[item.id]
            );
            // clearCart();
            // removeFromCart();
            setSelectedItems({});
            setAppliedCoupon(null);
            navigation.navigate("Home");
          },
        },
      ]);
    }, 2000);
  };

  // Render cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {/* Selection checkbox */}
      <TouchableOpacity
        style={styles.selectionCheckbox}
        onPress={() => toggleSelectItem(item.id)}
      >
        <Icon
          name={
            selectedItems[item.id]
              ? "checkbox-marked"
              : "checkbox-blank-outline"
          }
          size={24}
          color={selectedItems[item.id] ? "#3B82F6" : "#9CA3AF"}
        />
      </TouchableOpacity>

      {/* Product Image */}
      <TouchableOpacity
        style={styles.itemImageContainer}
        onPress={() =>
          navigation.navigate("ProductDetail", { productId: item.id })
        }
      >
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Product Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.itemAttributes}>
          <Text style={styles.itemAttribute}>Size: {item.size || "M"}</Text>
          <Text style={styles.itemAttribute}>
            Color: {item.color || "Black"}
          </Text>
        </View>

        <View style={styles.priceQuantityRow}>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Icon
                name="minus"
                size={16}
                color={item.quantity <= 1 ? "#9CA3AF" : "#374151"}
              />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Icon name="plus" size={16} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Remove button and total */}
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Icon name="trash-can-outline" size={20} color="#EF4444" />
        </TouchableOpacity>

        <Text style={styles.itemTotal}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <Icon name="cart-off" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Looks like you haven't added any items to your cart yet
          </Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart ({cartCount})</Text>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* Select All Button */}
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={() => {
            if (Object.keys(selectedItems).length === cartItems.length) {
              deselectAllItems();
            } else {
              selectAllItems();
            }
          }}
        >
          <Icon
            name={
              Object.keys(selectedItems).length === cartItems.length
                ? "checkbox-marked"
                : "checkbox-blank-outline"
            }
            size={20}
            color="#3B82F6"
          />
          <Text style={styles.selectAllText}>
            {Object.keys(selectedItems).length === cartItems.length
              ? "Deselect All"
              : "Select All Items"}
          </Text>
        </TouchableOpacity>

        {/* Cart Items */}
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.cartList}
          // contentContainerStyle={styles.scrollView}
          SectionSeparatorComponent={() => <View style={{ height: 20 }} />}
          ListEmptyComponent={<Text>No items found</Text>}
        />

        {/* Coupon Section */}
        <View style={styles.couponSection}>
          <Text style={styles.sectionTitle}>Have a coupon?</Text>
          <View style={styles.couponInputRow}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
              editable={!appliedCoupon}
            />
            {appliedCoupon ? (
              <TouchableOpacity
                style={[styles.couponButton, styles.removeCouponButton]}
                onPress={removeCoupon}
              >
                <Text style={styles.couponButtonText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.couponButton}
                onPress={applyCoupon}
              >
                <Text style={styles.couponButtonText}>Apply</Text>
              </TouchableOpacity>
            )}
          </View>

          {appliedCoupon && (
            <View style={styles.appliedCoupon}>
              <Icon name="tag" size={16} color="#10B981" />
              <Text style={styles.appliedCouponText}>
                {appliedCoupon.code} -{" "}
                {appliedCoupon.type === "percentage"
                  ? `${appliedCoupon.discount}% off`
                  : appliedCoupon.type === "freeShipping"
                  ? "Free Shipping"
                  : `$${appliedCoupon.discount} off`}
              </Text>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({totals.itemsCount} items)
            </Text>
            <Text style={styles.summaryValue}>${totals.subtotal}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${totals.shipping}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${totals.tax}</Text>
          </View>

          {appliedCoupon && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountLabel]}>
                Discount ({appliedCoupon.code})
              </Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -${totals.discount}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totals.total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <View style={styles.totalPreview}>
          <Text style={styles.totalPreviewText}>Total</Text>
          <Text style={styles.totalPreviewAmount}>${totals.total}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            totals.itemsCount === 0 && styles.disabledCheckoutButton,
          ]}
          onPress={handleCheckout}
          disabled={totals.itemsCount === 0}
        >
          <Icon name="lock" size={20} color="#FFFFFF" />
          <Text style={styles.checkoutButtonText}>
            Checkout ({totals.itemsCount} items)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Checkout Modal */}
      <Modal
        visible={showCheckoutModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCheckoutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Order</Text>
              <TouchableOpacity
                onPress={() => setShowCheckoutModal(false)}
                style={styles.closeModalButton}
              >
                <Icon name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSectionTitle}>Shipping Address</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter your shipping address"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.modalSectionTitle}>Selected Items</Text>
              {cartItems
                .filter((item) => selectedItems[item.id])
                .map((item) => (
                  <View key={item.id} style={styles.modalItem}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.modalItemImage}
                    />
                    <View style={styles.modalItemDetails}>
                      <Text style={styles.modalItemTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.modalItemQuantity}>
                        Qty: {item.quantity}
                      </Text>
                    </View>
                    <Text style={styles.modalItemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}

              <View style={styles.modalTotal}>
                <Text style={styles.modalTotalLabel}>Total Amount:</Text>
                <Text style={styles.modalTotalValue}>${totals.total}</Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCheckoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={processPayment}
                disabled={isLoading || !address.trim()}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="check-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Confirm Order</Text>
                  </>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  continueShoppingButton: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  continueShoppingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "500",
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  cartList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
  },
  cartItem: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 10,
    alignItems: "center",
    height: 150,
    // borderWidth:1,
    borderRadius: 14,
    // borderColor:'#6B7280'
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },
  selectionCheckbox: {
    marginRight: 12,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  itemImage: {
    width: "80%",
    height: "80%",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  itemAttributes: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  itemAttribute: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceQuantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  itemActions: {
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    marginLeft: 12,
  },
  removeButton: {
    padding: 8,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  couponSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  couponInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  couponButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  removeCouponButton: {
    backgroundColor: "#EF4444",
  },
  couponButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  appliedCoupon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  appliedCouponText: {
    fontSize: 14,
    color: "#065F46",
    fontWeight: "500",
  },
  summarySection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 120,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  discountLabel: {
    color: "#10B981",
  },
  discountValue: {
    color: "#10B981",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  checkoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  totalPreview: {
    flex: 1,
  },
  totalPreviewText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  totalPreviewAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  checkoutButton: {
    flex: 2,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  disabledCheckoutButton: {
    backgroundColor: "#9CA3AF",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeModalButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
    minHeight: 80,
    marginBottom: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalItemImage: {
    width: 50,
    height: 50,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
  },
  modalItemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  modalItemTitle: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
  modalItemQuantity: {
    fontSize: 12,
    color: "#6B7280",
  },
  modalItemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  modalTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 16,
    marginTop: 16,
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  modalTotalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CartScreen;