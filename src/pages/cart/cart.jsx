import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Minus, Heart, Trash2, ShoppingBag, ArrowRight, Truck, RotateCcw
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { deleteCartItem, getCartDetails, updateCartQuantity } from "../../service/productAPI";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../redux/cartSlice";

/**
 * Helper function to safely format cart data from API
 * Handles null checks and provides fallbacks
 * 
 * Expected API Response Structure:
 * {
 *   "success": true,
 *   "data": {
 *     "items": [...],
 *     "summary": {...}
 *   }
 * }
 */
const formatCartData = (apiResponse) => {
  if (!apiResponse || !apiResponse.data) {
    return { items: [], summary: null };
  }

  const data = apiResponse.data;

  // Format cart items with null checks
  const items = Array.isArray(data?.items)
    ? data.items
      .filter(item => item && item.product && item.product.isActive !== false)
      .map(item => ({
        // Item level fields
        id: item?.id || Math.random().toString(),
        userId: item?.userId || '',
        quantity: typeof item?.quantity === 'number' ? item.quantity : 1,
        lineTotal: typeof item?.lineTotal === 'number' ? item.lineTotal : 0,
        addedAt: item?.addedAt || null,
        updatedAt: item?.updatedAt || null,
        note: item?.note || '',

        // Product fields (nested)
        product: {
          productId: item?.product?.productId || '',
          productObjectId: item?.product?.productObjectId || '',
          name: item?.product?.name || 'Untitled Product',
          slug: item?.product?.slug || '',
          thumbnailUrl: item?.product?.thumbnailUrl || 'https://via.placeholder.com/150x150?text=No+Image',
          variantSku: item?.product?.variantSku || '',
          variantId: item?.product?.variantId || '',
          variantSize: item?.product?.variantSize || '',
          variantColor: item?.product?.variantColor || '',
          unitPrice: typeof item?.product?.unitPrice === 'number' ? item.product.unitPrice : 0,
          compareAtPrice: typeof item?.product?.compareAtPrice === 'number' ? item.product.compareAtPrice : null,
          currency: item?.product?.currency || 'INR',
          stockQuantity: typeof item?.product?.stockQuantity === 'number' ? item.product.stockQuantity : 0,
          reservedQuantity: typeof item?.product?.reservedQuantity === 'number' ? item.product.reservedQuantity : 0,
          isActive: item?.product?.isActive !== false,
          freeShipping: item?.product?.freeShipping === true,
          cashOnDelivery: item?.product?.cashOnDelivery === true,
          priceList: Array.isArray(item?.product?.priceList) ? item.product.priceList : [],
        }
      }))
    : [];

  // Format summary with null checks
  const summary = data?.summary ? {
    totalItems: typeof data.summary.totalItems === 'number' ? data.summary.totalItems : 0,
    distinctItems: typeof data.summary.distinctItems === 'number' ? data.summary.distinctItems : 0,
    subTotal: typeof data.summary.subTotal === 'number' ? data.summary.subTotal : 0,
    shipping: typeof data.summary.shipping === 'number' ? data.summary.shipping : 0,
    tax: typeof data.summary.tax === 'number' ? data.summary.tax : 0,
    discount: typeof data.summary.discount === 'number' ? data.summary.discount : 0,
    grandTotal: typeof data.summary.grandTotal === 'number' ? data.summary.grandTotal : 0,
    currency: data.summary.currency || 'INR',
  } : null;

  return { items, summary };
};

/**
 * Format price to INR
 */
const formatPrice = (price, currency = 'INR') => {
  if (typeof price !== 'number') return '₹0';
  const symbol = currency === 'INR' ? '₹' : currency;
  return `${symbol}${price.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

/**
 * Calculate discount percentage
 */
const calculateDiscountPercent = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // API State
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // ============ TESTING DUMMY DATA - REMOVE AFTER TESTING ============
  // const TESTING_DUMMY_CART = {
  //   success: true,
  //   status: 200,
  //   message: "OK",
  //   data: {
  //     items: [
  //       {
  //         id: "656fa3e7d1b2a4c9f0000001",
  //         userId: "user-123",
  //         product: {
  //           productId: "PID10001",
  //           productObjectId: "650b8c1e4b5f4a0000000000",
  //           name: "Luxe Cotton Nightshirt",
  //           slug: "luxe-cotton-nightshirt",
  //           thumbnailUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
  //           variantSku: "PID10001-NAV-S",
  //           variantId: "var-123",
  //           variantSize: "S",
  //           variantColor: "navy",
  //           unitPrice: 1299.00,
  //           compareAtPrice: 1599.00,
  //           currency: "INR",
  //           stockQuantity: 10,
  //           reservedQuantity: 0,
  //           isActive: true,
  //           freeShipping: true,
  //           cashOnDelivery: true,
  //           priceList: [
  //             { id: "pt1", size: "S", priceAmount: 1299.0, quantity: 0, currency: "INR" }
  //           ]
  //         },
  //         quantity: 2,
  //         lineTotal: 2598.00,
  //         addedAt: "2025-10-11T03:12:00Z",
  //         updatedAt: "2025-10-11T03:12:00Z",
  //         note: "Gift wrap please"
  //       },
  //       {
  //         id: "656fa3e7d1b2a4c9f0000002",
  //         userId: "user-123",
  //         product: {
  //           productId: "PID10002",
  //           productObjectId: "650b8c1e4b5f4a0000000001",
  //           name: "Silk Camisole Set",
  //           slug: "silk-camisole-set",
  //           thumbnailUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400",
  //           variantSku: "PID10002-ROSE-M",
  //           variantId: "var-456",
  //           variantSize: "M",
  //           variantColor: "rose",
  //           unitPrice: 1999.00,
  //           compareAtPrice: 2499.00,
  //           currency: "INR",
  //           stockQuantity: 8,
  //           reservedQuantity: 2,
  //           isActive: true,
  //           freeShipping: true,
  //           cashOnDelivery: true,
  //           priceList: []
  //         },
  //         quantity: 1,
  //         lineTotal: 1999.00,
  //         addedAt: "2025-10-11T04:20:00Z",
  //         updatedAt: "2025-10-11T04:20:00Z",
  //         note: ""
  //       }
  //     ],
  //     summary: {
  //       totalItems: 3,
  //       distinctItems: 2,
  //       subTotal: 4597.00,
  //       shipping: 0.00,
  //       tax: 0.00,
  //       discount: 0.00,
  //       grandTotal: 4597.00,
  //       currency: "INR"
  //     }
  //   }
  // };

  useEffect(() => {
    
    fetchCart();
    
  }, []);
  const fetchCart = async () => {
    setIsLoading(true)
    try {
      const response = await getCartDetails()
      console.log(response.data);
      setCartItems(response.data.items)
      dispatch(setCartCount(response.data.items.length));
    }
    catch (err) {
      console.log(err || "something went wrong")
    }
    finally{
      setIsLoading(false)
    }

  }

  const handleUpdateCartQuantity = async (itemId,q) => {
    try {
      const payload = { cartItemId:itemId, quantity:q};
      const data = await updateCartQuantity(payload);
      console.log("Cart quantity updated:", data);
      return data;
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };
  // Update quantity
 const updateQuantity = async (itemId, delta) => {
  setCartItems(items =>
    items.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        const maxQuantity = item.product.stockQuantity - item.product.reservedQuantity;

        const finalQuantity = Math.min(newQuantity, maxQuantity);

        // Call API to update cart quantity
        handleUpdateCartQuantity(itemId, finalQuantity);

        return {
          ...item,
          quantity: finalQuantity,
          lineTotal: item.product.unitPrice * finalQuantity
        };
      }
      return item;
    })
  );
};

const handleDeleteCartItem = async (id) => {


  try {
  
    await deleteCartItem(id);

    const response = await fetchCart();
    console.log("Item deleted successfully");
  } catch (err) {
    console.error("Failed to delete cart item:", err);
  }
};
  // Remove item
  const removeItem = (itemId) => {
    // setCartItems(items => items.filter(item => item.id !== itemId));
    handleDeleteCartItem(itemId)
  };

  // Move to wishlist
  const moveToWishlist = (itemId) => {
    // TODO: Call API to move to wishlist
    removeItem(itemId);
  };

  // Apply coupon
  const applyCoupon = () => {
    setCouponError('');

    if (!couponCode || couponCode.trim() === '') {
      setCouponError('Please enter a coupon code');
      return;
    }

    // TODO: Call API to validate and apply coupon
    // For now, mock validation
    const mockCoupons = [
      { code: 'YOBHA10', discount: 10, type: 'percentage', description: '10% off on all products' },
      { code: 'FIRST100', discount: 100, type: 'fixed', description: '₹100 off on first order' },
      { code: 'LUXURY20', discount: 20, type: 'percentage', description: '20% off on premium collection' },
    ];

    const validCoupon = mockCoupons.find(c => c.code === couponCode.toUpperCase());

    if (validCoupon) {
      setAppliedCoupon(validCoupon);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    // TODO: Call API to remove coupon from cart
  };

  // Calculate totals from cart items (used when summary is not available)
  const calculateTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return {
        subTotal: 0,
        totalSavings: 0,
        shipping: 0,
        tax: 0,
        couponDiscount: 0,
        grandTotal: 0,
      };
    }

    const subTotal = cartItems.reduce((sum, item) => {
      const price = item?.product?.unitPrice || 0;
      const qty = item?.quantity || 0;
      return sum + (price * qty);
    }, 0);

    const totalSavings = cartItems.reduce((sum, item) => {
      const comparePrice = item?.product?.compareAtPrice || 0;
      const currentPrice = item?.product?.unitPrice || 0;
      const qty = item?.quantity || 0;
      return sum + ((comparePrice - currentPrice) * qty);
    }, 0);

    const shipping = subTotal > 1000 || cartItems.some(item => item?.product?.freeShipping) ? 0 : 99;

    // Calculate coupon discount
    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        couponDiscount = Math.round((subTotal * appliedCoupon.discount) / 100);
      } else {
        couponDiscount = appliedCoupon.discount;
      }
    }

    const tax = 0; // Tax calculation can be added if needed
    const grandTotal = subTotal - couponDiscount + shipping + tax;

    return { subTotal, totalSavings, shipping, tax, couponDiscount, grandTotal };
  };

  // Use API summary if available, otherwise calculate
  const totals = cartSummary || calculateTotals();

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-premium-cream flex items-center justify-center"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-premium-beige border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-medium text-sm uppercase tracking-wider">Loading Cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen bg-premium-cream flex items-center justify-center"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-wider">
            Something Went Wrong
          </h2>
          <p className="text-text-medium mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-8 py-3 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-premium-cream"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-12">

        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black uppercase tracking-wide mb-2 md:mb-3">
            Shopping Cart
          </h1>
          <p className="text-text-medium text-sm md:text-base">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-12 md:py-20">
            <div className="max-w-md mx-auto px-4">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 border-2 border-text-light/20 flex items-center justify-center">
                <ShoppingBag size={40} className="text-text-light md:w-12 md:h-12" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4 uppercase tracking-wider">
                Your Cart is Empty
              </h2>
              <p className="text-sm md:text-base text-text-medium mb-6 md:mb-8">
                Discover our premium collection of luxury sleepwear
              </p>
              <button
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 md:gap-3 bg-black text-white px-6 md:px-8 py-3 md:py-4 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-xs md:text-sm"
              >
                Start Shopping
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item?.product || {};
                const availableStock = (product.stockQuantity || 0) - (product.reservedQuantity || 0);
                const discountPercent = calculateDiscountPercent(product.compareAtPrice, product.unitPrice);

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-text-light/20 p-4 md:p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div
                        className="w-full sm:w-28 md:w-32 h-32 flex-shrink-0 bg-premium-beige overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/productDetail/${product.productId}`)}
                      >
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-semibold text-black text-base md:text-lg mb-2 line-clamp-2 hover:underline cursor-pointer uppercase tracking-tight"
                              onClick={() => navigate(`/productDetail/${product.productId}`)}
                            >
                              {product.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-text-medium mb-2">
                              {product.variantColor && (
                                <span>Color: <span className="text-black font-medium capitalize">{product.variantColor}</span></span>
                              )}
                              {product.variantSize && (
                                <span>Size: <span className="text-black font-medium">{product.variantSize}</span></span>
                              )}
                            </div>
                            {item.note && (
                              <p className="text-xs text-text-light italic line-clamp-1">Note: {item.note}</p>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-text-medium hover:text-black transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex flex-wrap items-baseline gap-2 mb-1">
                            <span className="text-xl md:text-2xl font-bold text-black">
                              {formatPrice(product.unitPrice, product.currency)}
                            </span>
                            {product.compareAtPrice && (
                              <span className="text-sm md:text-base text-text-light line-through">
                                {formatPrice(product.compareAtPrice, product.currency)}
                              </span>
                            )}
                            {discountPercent > 0 && (
                              <span className="text-xs bg-black text-white px-2 py-0.5 uppercase tracking-wider whitespace-nowrap">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-text-medium">
                            Line Total: <span className="font-bold text-black">{formatPrice(item.lineTotal, product.currency)}</span>
                          </p>
                        </div>

                        {/* Quantity Controls & Actions */}
                        <div className="flex flex-wrap items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border-2 border-text-light/30">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-premium-beige transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} strokeWidth={2} />
                            </button>
                            <span className="px-4 md:px-6 py-2 font-semibold text-sm md:text-base min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={item.quantity >= availableStock}
                              className="p-2 hover:bg-premium-beige transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} strokeWidth={2} />
                            </button>
                          </div>

                          {/* Move to Wishlist */}
                          <button
                            onClick={() => moveToWishlist(item.id)}
                            className="flex items-center gap-2 text-xs md:text-sm text-text-medium hover:text-black transition-colors"
                          >
                            <Heart size={14} strokeWidth={1.5} />
                            <span className="hidden sm:inline">Wishlist</span>
                          </button>

                          {/* Stock Warning */}
                          {availableStock <= 5 && availableStock > 0 && (
                            <span className="text-xs text-luxury-rose-gold whitespace-nowrap">
                              Only {availableStock} left
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coupon Section */}
              <div className="bg-white border border-text-light/20 p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-black uppercase tracking-wider mb-4">
                  Apply Coupon
                </h3>

                {/* Coupon Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-text-light/30 focus:border-black focus:outline-none text-sm uppercase font-medium tracking-wider transition-colors"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-black text-white font-semibold px-6 md:px-8 py-3 hover:bg-text-dark transition-colors uppercase tracking-wider text-xs md:text-sm whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>

                {/* Error Message */}
                {couponError && (
                  <p className="text-xs text-red-500 mb-4">{couponError}</p>
                )}

                {/* Applied Coupon */}
                {appliedCoupon && (
                  <div className="bg-premium-beige border-2 border-black p-4 mb-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-black uppercase tracking-wider">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-xs text-text-medium mt-1">
                        {appliedCoupon.description}
                      </p>
                      <p className="text-xs text-luxury-rose-gold font-semibold mt-1">
                        You saved{' '}
                        {appliedCoupon.type === 'percentage'
                          ? `${appliedCoupon.discount}%`
                          : formatPrice(appliedCoupon.discount)}!
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-text-medium hover:text-black transition-colors p-2"
                      aria-label="Remove coupon"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                )}

                {/* Available Coupons */}
                {!appliedCoupon && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-text-medium uppercase tracking-wider mb-3">
                      Available Coupons
                    </p>
                    <button
                      onClick={() => {
                        setCouponCode('YOBHA10');
                        setCouponError('');
                      }}
                      className="w-full p-3 md:p-4 border border-text-light/20 hover:border-black hover:bg-premium-cream transition-all text-left group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black uppercase tracking-wider mb-1">
                            YOBHA10
                          </p>
                          <p className="text-xs text-text-medium">
                            10% off on all products
                          </p>
                        </div>
                        <span className="text-xs text-text-medium uppercase tracking-wider group-hover:text-black transition-colors whitespace-nowrap">
                          Apply
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCouponCode('FIRST100');
                        setCouponError('');
                      }}
                      className="w-full p-3 md:p-4 border border-text-light/20 hover:border-black hover:bg-premium-cream transition-all text-left group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black uppercase tracking-wider mb-1">
                            FIRST100
                          </p>
                          <p className="text-xs text-text-medium">
                            ₹100 off on first order
                          </p>
                        </div>
                        <span className="text-xs text-text-medium uppercase tracking-wider group-hover:text-black transition-colors whitespace-nowrap">
                          Apply
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCouponCode('LUXURY20');
                        setCouponError('');
                      }}
                      className="w-full p-3 md:p-4 border border-text-light/20 hover:border-black hover:bg-premium-cream transition-all text-left group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black uppercase tracking-wider mb-1">
                            LUXURY20
                          </p>
                          <p className="text-xs text-text-medium">
                            20% off on premium collection
                          </p>
                        </div>
                        <span className="text-xs text-text-medium uppercase tracking-wider group-hover:text-black transition-colors whitespace-nowrap">
                          Apply
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-text-light/20 lg:sticky lg:top-24">
                <div className="p-4 md:p-6 border-b border-text-light/20">
                  <h2 className="text-lg md:text-xl font-bold text-black uppercase tracking-wider mb-1">
                    Order Summary
                  </h2>
                  <p className="text-xs md:text-sm text-text-medium">
                    {cartSummary?.distinctItems || cartItems.length} {(cartSummary?.distinctItems || cartItems.length) === 1 ? 'item' : 'items'}
                  </p>
                </div>

                <div className="p-4 md:p-6 space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3 pb-4 border-b border-text-light/10">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-text-medium">Subtotal</span>
                      <span className="text-black font-semibold">
                        {formatPrice(cartSummary?.subTotal || totals.subTotal)}
                      </span>
                    </div>

                    {(cartSummary?.discount || totals.totalSavings) > 0 && (
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-text-medium">Product Savings</span>
                        <span className="text-luxury-rose-gold font-semibold">
                          -{formatPrice(cartSummary?.discount || totals.totalSavings)}
                        </span>
                      </div>
                    )}

                    {(totals.couponDiscount || 0) > 0 && (
                      <div className="flex justify-between text-xs md:text-sm bg-premium-beige -mx-4 md:-mx-6 px-4 md:px-6 py-2">
                        <span className="text-text-dark font-medium">
                          Coupon ({appliedCoupon?.code})
                        </span>
                        <span className="text-luxury-rose-gold font-bold">
                          -{formatPrice(totals.couponDiscount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-text-medium">Shipping</span>
                      {(cartSummary?.shipping || totals.shipping) === 0 ? (
                        <span className="text-black font-semibold">FREE</span>
                      ) : (
                        <span className="text-black font-semibold">
                          {formatPrice(cartSummary?.shipping || totals.shipping)}
                        </span>
                      )}
                    </div>

                    {(cartSummary?.tax || totals.tax || 0) > 0 && (
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-text-medium">Tax</span>
                        <span className="text-black font-semibold">
                          {formatPrice(cartSummary?.tax || totals.tax)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between pt-4 pb-4 md:pb-6 border-b border-text-light/20">
                    <span className="text-base md:text-lg font-bold text-black uppercase tracking-wider">
                      Total
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-black">
                      {formatPrice(cartSummary?.grandTotal || totals.grandTotal)}
                    </span>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-3 py-4 border-b border-text-light/20">
                    <div className="flex items-start gap-3">
                      <Truck size={16} className="text-text-medium mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-black">Free Shipping</p>
                        <p className="text-xs text-text-medium">Delivery in 3-5 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RotateCcw size={16} className="text-text-medium mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-black">Easy Returns</p>
                        <p className="text-xs text-text-medium">30-day return policy</p>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => navigate("/checkout")}
                    disabled={cartItems.length === 0}
                    className="w-full bg-black text-white py-3 md:py-4 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-2 md:gap-3 disabled:bg-text-light disabled:cursor-not-allowed"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} strokeWidth={1.5} />
                  </button>

                  <button
                    onClick={() => navigate("/products")}
                    className="w-full mt-3 border-2 border-text-light/30 text-black py-3 md:py-4 font-semibold hover:border-black transition-colors uppercase tracking-wider text-xs md:text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
