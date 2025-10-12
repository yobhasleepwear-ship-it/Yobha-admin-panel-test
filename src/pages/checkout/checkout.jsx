import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, CreditCard, Smartphone, Wallet, 
  Building2, Banknote, Truck, RotateCcw, Shield
} from "lucide-react";

/**
 * Helper function to format checkout data for API
 * Prepares data with null checks for order placement
 */
// eslint-disable-next-line no-unused-vars
const prepareCheckoutData = (address, paymentMethod, cartSummary) => {
  if (!address || !paymentMethod) return null;

  return {
    shippingAddress: {
      fullName: address?.fullName || '',
      phone: address?.phone || '',
      addressLine1: address?.addressLine1 || '',
      addressLine2: address?.addressLine2 || '',
      city: address?.city || '',
      state: address?.state || '',
      pincode: address?.pincode || '',
      country: address?.country || 'India',
      landmark: address?.landmark || '',
    },
    paymentMethod: {
      type: paymentMethod?.id || '',
      provider: paymentMethod?.name || '',
    },
    orderSummary: {
      subTotal: cartSummary?.subTotal || 0,
      shipping: cartSummary?.shipping || 0,
      tax: cartSummary?.tax || 0,
      discount: cartSummary?.discount || 0,
      grandTotal: cartSummary?.grandTotal || 0,
      currency: cartSummary?.currency || 'INR',
    }
  };
};

/**
 * Validate address form
 */
const validateAddress = (address) => {
  const errors = {};

  if (!address.fullName || address.fullName.trim() === '') {
    errors.fullName = 'Full name is required';
  }

  if (!address.phone || address.phone.trim() === '') {
    errors.phone = 'Phone number is required';
  } else if (!/^[0-9]{10}$/.test(address.phone.replace(/\D/g, ''))) {
    errors.phone = 'Please enter a valid 10-digit phone number';
  }

  if (!address.addressLine1 || address.addressLine1.trim() === '') {
    errors.addressLine1 = 'Address is required';
  }

  if (!address.city || address.city.trim() === '') {
    errors.city = 'City is required';
  }

  if (!address.state || address.state.trim() === '') {
    errors.state = 'State is required';
  }

  if (!address.pincode || address.pincode.trim() === '') {
    errors.pincode = 'Pincode is required';
  } else if (!/^[0-9]{6}$/.test(address.pincode)) {
    errors.pincode = 'Please enter a valid 6-digit pincode';
  }

  return errors;
};

const CheckoutPage = () => {
  const navigate = useNavigate();

  // Address State
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    landmark: '',
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Payment State
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Order State
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment Methods
  const paymentMethods = [
    { 
      id: "upi", 
      name: "UPI", 
      icon: Smartphone, 
      description: "Google Pay, PhonePe, Paytm",
      popular: true
    },
    { 
      id: "card", 
      name: "Credit / Debit Card", 
      icon: CreditCard, 
      description: "Visa, Mastercard, Amex, RuPay"
    },
    { 
      id: "netbanking", 
      name: "Net Banking", 
      icon: Building2, 
      description: "All major banks"
    },
    { 
      id: "wallet", 
      name: "Digital Wallets", 
      icon: Wallet, 
      description: "Paytm, PhonePe, Amazon Pay"
    },
    { 
      id: "cod", 
      name: "Cash on Delivery", 
      icon: Banknote, 
      description: "Pay when you receive"
    },
  ];

  // ============ TESTING DUMMY DATA - REMOVE AFTER TESTING ============
  const TESTING_CART_SUMMARY = {
    totalItems: 3,
    distinctItems: 2,
    subTotal: 4597.00,
    shipping: 0.00,
    tax: 0.00,
    discount: 300.00,
    grandTotal: 4297.00,
    currency: "INR"
  };
  const [cartSummary] = useState(TESTING_CART_SUMMARY);
  // ============ END TESTING DUMMY DATA ============

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (addressErrors[name]) {
      setAddressErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Place Order
  const handlePlaceOrder = async () => {
    // Validate address
    const errors = validateAddress(address);
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    // ============ TESTING MODE - COMMENT OUT AFTER TESTING ============
    setTimeout(() => {
      alert('Order placed successfully! (Test Mode)');
      navigate('/orders');
      setIsProcessing(false);
    }, 1500);
    return;
    // ============ END TESTING MODE ============

    // ============ PRODUCTION API CODE - UNCOMMENT AFTER TESTING ============
    /*
    try {
      const checkoutData = prepareCheckoutData(address, selectedPayment, cartSummary);
      
      // Call your API to place order
      const response = await placeOrder(checkoutData);
      
      if (response && response.success) {
        // Navigate to order confirmation or orders page
        navigate(`/orders/${response.data.orderId}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
    */
    // ============ END PRODUCTION API CODE ============
  };

  // Format price
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '₹0';
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div 
      className="min-h-screen bg-premium-cream"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-12">
        
        {/* Back Button & Page Header */}
        <div className="mb-8 md:mb-12">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-text-medium hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
            <span className="text-sm uppercase tracking-wider">Back to Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black uppercase tracking-wide mb-2 md:mb-3">
            Checkout
          </h1>
          <p className="text-text-medium text-sm md:text-base">
            Complete your order details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Address Section */}
            <div className="bg-white border border-text-light/20">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-text-light/20">
                <h2 className="text-base md:text-lg font-bold text-black uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={20} strokeWidth={1.5} />
                  Delivery Address
                </h2>
                <p className="text-xs md:text-sm text-text-medium mt-1">
                  Enter delivery details
                </p>
              </div>

              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 border-2 focus:outline-none text-sm transition-colors ${
                        addressErrors.fullName
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-text-light/30 focus:border-black'
                      }`}
                    />
                    {addressErrors.fullName && (
                      <p className="text-xs text-red-500 mt-1">{addressErrors.fullName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-3 border-2 focus:outline-none text-sm transition-colors ${
                        addressErrors.phone
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-text-light/30 focus:border-black'
                      }`}
                    />
                    {addressErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">{addressErrors.phone}</p>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleInputChange}
                      placeholder="House No., Building Name, Street"
                      className={`w-full px-4 py-3 border-2 focus:outline-none text-sm transition-colors ${
                        addressErrors.addressLine1
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-text-light/30 focus:border-black'
                      }`}
                    />
                    {addressErrors.addressLine1 && (
                      <p className="text-xs text-red-500 mt-1">{addressErrors.addressLine1}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Area, Colony, Sector"
                      className="w-full px-4 py-3 border-2 border-text-light/30 focus:border-black focus:outline-none text-sm transition-colors"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className={`w-full px-4 py-3 border-2 focus:outline-none text-sm transition-colors ${
                        addressErrors.city
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-text-light/30 focus:border-black'
                      }`}
                    />
                    {addressErrors.city && (
                      <p className="text-xs text-red-500 mt-1">{addressErrors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className={`w-full px-4 py-3 border-2 focus:outline-none text-sm transition-colors ${
                        addressErrors.state
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-text-light/30 focus:border-black'
                      }`}
                    />
                    {addressErrors.state && (
                      <p className="text-xs text-red-500 mt-1">{addressErrors.state}</p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN"
                      maxLength={6}
                      className={`w-full px-4 py-3 border-2 focus:outline-none text-sm transition-colors ${
                        addressErrors.pincode
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-text-light/30 focus:border-black'
                      }`}
                    />
                    {addressErrors.pincode && (
                      <p className="text-xs text-red-500 mt-1">{addressErrors.pincode}</p>
                    )}
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={address.landmark}
                      onChange={handleInputChange}
                      placeholder="Nearby landmark"
                      className="w-full px-4 py-3 border-2 border-text-light/30 focus:border-black focus:outline-none text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white border border-text-light/20">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-text-light/20">
                <h2 className="text-base md:text-lg font-bold text-black uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={20} strokeWidth={1.5} />
                  Payment Method
                </h2>
                <p className="text-xs md:text-sm text-text-medium mt-1">
                  Choose your payment option
                </p>
              </div>

              <div className="p-4 md:p-6">
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`block p-4 border-2 cursor-pointer transition-all ${
                          selectedPayment?.id === method.id
                            ? "border-black bg-premium-beige"
                            : "border-text-light/20 hover:border-text-dark bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={selectedPayment?.id === method.id}
                          onChange={() => setSelectedPayment(method)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-4">
                          <div className={`p-3 ${
                            selectedPayment?.id === method.id 
                              ? "bg-black text-white" 
                              : "bg-premium-beige text-black"
                          }`}>
                            <IconComponent size={22} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-black text-sm md:text-base">
                                {method.name}
                              </span>
                              {method.popular && (
                                <span className="text-xs bg-black text-white px-2 py-0.5 uppercase tracking-wider">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs md:text-sm text-text-medium mt-1">
                              {method.description}
                            </p>
                          </div>
                          {selectedPayment?.id === method.id && (
                            <div className="flex-shrink-0">
                              <div className="w-5 h-5 border-2 border-black bg-black flex items-center justify-center">
                                <div className="w-2 h-2 bg-white"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-text-light/20 lg:sticky lg:top-24">
              <div className="p-4 md:p-6 border-b border-text-light/20">
                <h2 className="text-base md:text-lg font-bold text-black uppercase tracking-wider mb-1">
                  Order Summary
                </h2>
                <p className="text-xs md:text-sm text-text-medium">
                  {cartSummary?.distinctItems || 0} {(cartSummary?.distinctItems || 0) === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="p-4 md:p-6">
                {/* Price Breakdown */}
                <div className="space-y-3 pb-4 border-b border-text-light/10">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-text-medium">Subtotal</span>
                    <span className="text-black font-semibold">
                      {formatPrice(cartSummary?.subTotal || 0)}
                    </span>
                  </div>

                  {(cartSummary?.discount || 0) > 0 && (
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-text-medium">Savings</span>
                      <span className="text-luxury-rose-gold font-semibold">
                        -{formatPrice(cartSummary?.discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-text-medium">Shipping</span>
                    {(cartSummary?.shipping || 0) === 0 ? (
                      <span className="text-black font-semibold">FREE</span>
                    ) : (
                      <span className="text-black font-semibold">
                        {formatPrice(cartSummary.shipping)}
                      </span>
                    )}
                  </div>

                  {(cartSummary?.tax || 0) > 0 && (
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-text-medium">Tax</span>
                      <span className="text-black font-semibold">
                        {formatPrice(cartSummary.tax)}
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
                    {formatPrice(cartSummary?.grandTotal || 0)}
                  </span>
                </div>

                {/* Shipping & Return Info */}
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

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-black text-white py-3 md:py-4 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-3 disabled:bg-text-light disabled:cursor-not-allowed mt-6"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={18} strokeWidth={1.5} />
                      <span>Place Order</span>
                    </>
                  )}
                </button>

                {/* Security Badge */}
                <div className="mt-6 pt-4 border-t border-text-light/10">
                  <div className="flex items-center gap-2 text-xs text-text-medium justify-center">
                    <Shield size={14} strokeWidth={1.5} />
                    <span>100% Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
