import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Package, Truck, CheckCircle2, XCircle, 
  Clock, MapPin, Phone, Mail 
} from "lucide-react";

/**
 * Helper function to safely format order detail data from API
 * Handles null checks and provides fallbacks
 * 
 * Expected API Response:
 * {
 *   "id": "...",
 *   "userId": "...",
 *   "items": [...],
 *   "subTotal": 0,
 *   "shipping": 0,
 *   "tax": 0,
 *   "discount": 0,
 *   "total": 0,
 *   "status": "Pending",
 *   "createdAt": "...",
 *   "updatedAt": null
 * }
 */
const formatOrderDetailData = (orderData) => {
  if (!orderData) return null;

  const data = orderData.data || orderData;

  return {
    id: data?.id || '',
    userId: data?.userId || '',
    
    // Items with null checks
    items: Array.isArray(data?.items) && data.items.length > 0
      ? data.items.map(item => ({
          productId: item?.productId || '',
          productObjectId: item?.productObjectId || '',
          productName: item?.productName || 'Untitled Product',
          variantSku: item?.variantSku || '',
          variantId: item?.variantId || '',
          quantity: typeof item?.quantity === 'number' ? item.quantity : 0,
          unitPrice: typeof item?.unitPrice === 'number' ? item.unitPrice : 0,
          lineTotal: typeof item?.lineTotal === 'number' ? item.lineTotal : 0,
          compareAtPrice: typeof item?.compareAtPrice === 'number' ? item.compareAtPrice : null,
          currency: item?.currency || 'INR',
          thumbnailUrl: item?.thumbnailUrl || 'https://via.placeholder.com/150x150?text=No+Image',
          slug: item?.slug || '',
        }))
      : [],
    
    // Pricing
    subTotal: typeof data?.subTotal === 'number' ? data.subTotal : 0,
    shipping: typeof data?.shipping === 'number' ? data.shipping : 0,
    tax: typeof data?.tax === 'number' ? data.tax : 0,
    discount: typeof data?.discount === 'number' ? data.discount : 0,
    total: typeof data?.total === 'number' ? data.total : 0,
    
    // Status and dates
    status: data?.status || 'Pending',
    createdAt: data?.createdAt || null,
    updatedAt: data?.updatedAt || null,

    // Additional fields (if your API provides them)
    shippingAddress: data?.shippingAddress || null,
    trackingNumber: data?.trackingNumber || null,
    estimatedDelivery: data?.estimatedDelivery || null,
    deliveredAt: data?.deliveredAt || null,
  };
};

/**
 * Get status display info
 */
const getStatusInfo = (status) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  
  const statusMap = {
    pending: {
      icon: Clock,
      text: "Pending",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    confirmed: {
      icon: CheckCircle2,
      text: "Confirmed",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    processing: {
      icon: Clock,
      text: "Processing",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    shipped: {
      icon: Truck,
      text: "Shipped",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    delivered: {
      icon: CheckCircle2,
      text: "Delivered",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    cancelled: {
      icon: XCircle,
      text: "Cancelled",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    }
  };
  
  return statusMap[normalizedStatus] || statusMap.pending;
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
 * Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // API State
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============ TESTING DUMMY DATA - REMOVE AFTER TESTING ============
  const TESTING_DUMMY_ORDER = {
    id: "650f1a2b3c4d5e0000000001",
    userId: "user-123",
    items: [
      {
        productId: "PID10001",
        productObjectId: "650b8c1e4b5f4a0000000000",
        productName: "Luxe Cotton Nightshirt",
        variantSku: "PID10001-NAV-S",
        variantId: "var-123",
        quantity: 2,
        unitPrice: 1299.00,
        lineTotal: 2598.00,
        compareAtPrice: 1599.00,
        currency: "INR",
        thumbnailUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        slug: "luxe-cotton-nightshirt"
      },
      {
        productId: "PID10002",
        productObjectId: "650b8c1e4b5f4a0000000001",
        productName: "Silk Camisole Set",
        variantSku: "PID10002-ROSE-M",
        variantId: "var-456",
        quantity: 1,
        unitPrice: 1999.00,
        lineTotal: 1999.00,
        compareAtPrice: 2499.00,
        currency: "INR",
        thumbnailUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400",
        slug: "silk-camisole-set"
      }
    ],
    subTotal: 4597.00,
    shipping: 0.00,
    tax: 0.00,
    discount: 300.00,
    total: 4297.00,
    status: "Shipped",
    createdAt: "2025-10-11T03:12:00Z",
    updatedAt: "2025-10-12T10:00:00Z",
    shippingAddress: {
      fullName: "John Doe",
      phone: "+91 9876543210",
      email: "john.doe@example.com",
      addressLine1: "123 Main Street",
      addressLine2: "Near Park",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
      landmark: "Opposite Mall"
    },
    trackingNumber: "YOBHA1234567890",
    estimatedDelivery: "2025-10-15T00:00:00Z",
  };
  // ============ END TESTING DUMMY DATA ============

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetail = async () => {
      setIsLoading(true);
      setError(null);

      // ============ TESTING MODE - COMMENT OUT AFTER TESTING ============
      setTimeout(() => {
        const formattedOrder = formatOrderDetailData(TESTING_DUMMY_ORDER);
        setOrder(formattedOrder);
        setIsLoading(false);
      }, 500);
      return;
      // ============ END TESTING MODE ============

      // ============ PRODUCTION API CODE - UNCOMMENT AFTER TESTING ============
      /*
      try {
        const response = await getOrderDetail(orderId); // Your API call
        
        if (response && response.success) {
          const formattedOrder = formatOrderDetailData(response);
          setOrder(formattedOrder);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
      */
      // ============ END PRODUCTION API CODE ============
    };

    if (orderId) {
      fetchOrderDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-premium-cream flex items-center justify-center"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-premium-beige border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-medium text-sm uppercase tracking-wider">Loading Order...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div 
        className="min-h-screen bg-premium-cream flex items-center justify-center"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-wider">
            Order Not Found
          </h2>
          <p className="text-text-medium mb-8">
            {error || 'The order you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-black text-white px-8 py-3 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-sm"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const totalItems = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div 
      className="min-h-screen bg-premium-cream"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-12">
        
        {/* Back Button & Page Header */}
        <div className="mb-8 md:mb-12">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-text-medium hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
            <span className="text-sm uppercase tracking-wider">Back to Orders</span>
          </button>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black uppercase tracking-wide mb-2">
                Order Details
              </h1>
              <p className="text-text-medium text-sm md:text-base">
                Order ID: <span className="font-semibold text-black">{order.id}</span>
              </p>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 border-2 ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
              <StatusIcon size={16} className={statusInfo.color} strokeWidth={2} />
              <span className={`text-sm font-bold ${statusInfo.color} uppercase tracking-wider`}>
                {statusInfo.text}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs md:text-sm text-text-medium">
            <span>Placed: <span className="text-black font-medium">{formatDate(order.createdAt)}</span></span>
            {order.updatedAt && (
              <span>Updated: <span className="text-black font-medium">{formatDate(order.updatedAt)}</span></span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column - Order Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Items */}
            <div className="bg-white border border-text-light/20">
              <div className="px-4 md:px-6 py-4 border-b border-text-light/20">
                <h2 className="text-base md:text-lg font-bold text-black uppercase tracking-wider">
                  Order Items ({totalItems})
                </h2>
              </div>

              <div className="p-4 md:p-6 space-y-4">
                {order.items.map((item, index) => {
                  const savingsAmount = item.compareAtPrice 
                    ? (item.compareAtPrice - item.unitPrice) * item.quantity
                    : 0;

                  return (
                    <div 
                      key={`${item.productId}-${index}`}
                      className="flex gap-4 pb-4 border-b border-text-light/10 last:border-0 last:pb-0"
                    >
                      <div 
                        className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-premium-beige overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/productDetail/${item.productId}`)}
                      >
                        <img
                          src={item.thumbnailUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-semibold text-black text-base md:text-lg mb-2 line-clamp-2 hover:underline cursor-pointer uppercase tracking-tight"
                          onClick={() => navigate(`/productDetail/${item.productId}`)}
                        >
                          {item.productName}
                        </h3>
                        
                        <div className="space-y-1 mb-3">
                          {item.variantSku && (
                            <p className="text-xs md:text-sm text-text-medium">
                              SKU: <span className="font-medium text-black">{item.variantSku}</span>
                            </p>
                          )}
                          <p className="text-xs md:text-sm text-text-medium">
                            Quantity: <span className="font-medium text-black">{item.quantity}</span>
                          </p>
                          <p className="text-xs md:text-sm text-text-medium">
                            Unit Price: <span className="font-medium text-black">{formatPrice(item.unitPrice, item.currency)}</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-lg md:text-xl font-bold text-black">
                            {formatPrice(item.lineTotal, item.currency)}
                          </span>
                          {item.compareAtPrice && (
                            <>
                              <span className="text-sm text-text-light line-through">
                                {formatPrice(item.compareAtPrice * item.quantity, item.currency)}
                              </span>
                              {savingsAmount > 0 && (
                                <span className="text-xs bg-black text-white px-2 py-0.5 uppercase tracking-wider">
                                  Saved {formatPrice(savingsAmount, item.currency)}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white border border-text-light/20">
                <div className="px-4 md:px-6 py-4 border-b border-text-light/20">
                  <h2 className="text-base md:text-lg font-bold text-black uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={20} strokeWidth={1.5} />
                    Delivery Address
                  </h2>
                </div>

                <div className="p-4 md:p-6">
                  <div className="space-y-2">
                    <p className="text-sm md:text-base font-semibold text-black">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-sm text-text-medium">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-text-medium">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    <p className="text-sm text-text-medium">
                      {order.shippingAddress.country}
                    </p>
                    {order.shippingAddress.landmark && (
                      <p className="text-xs text-text-light italic">
                        Landmark: {order.shippingAddress.landmark}
                      </p>
                    )}
                    
                    <div className="pt-3 mt-3 border-t border-text-light/10 space-y-1">
                      {order.shippingAddress.phone && (
                        <div className="flex items-center gap-2 text-sm text-text-medium">
                          <Phone size={14} strokeWidth={1.5} />
                          <span>{order.shippingAddress.phone}</span>
                        </div>
                      )}
                      {order.shippingAddress.email && (
                        <div className="flex items-center gap-2 text-sm text-text-medium">
                          <Mail size={14} strokeWidth={1.5} />
                          <span>{order.shippingAddress.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-text-light/20 lg:sticky lg:top-24">
              <div className="p-4 md:p-6 border-b border-text-light/20">
                <h2 className="text-base md:text-lg font-bold text-black uppercase tracking-wider mb-1">
                  Order Summary
                </h2>
              </div>

              <div className="p-4 md:p-6">
                {/* Price Breakdown */}
                <div className="space-y-3 pb-4 border-b border-text-light/10">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-text-medium">Subtotal</span>
                    <span className="text-black font-semibold">
                      {formatPrice(order.subTotal)}
                    </span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-text-medium">Discount</span>
                      <span className="text-luxury-rose-gold font-semibold">
                        -{formatPrice(order.discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-text-medium">Shipping</span>
                    {order.shipping === 0 ? (
                      <span className="text-black font-semibold">FREE</span>
                    ) : (
                      <span className="text-black font-semibold">
                        {formatPrice(order.shipping)}
                      </span>
                    )}
                  </div>

                  {order.tax > 0 && (
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-text-medium">Tax</span>
                      <span className="text-black font-semibold">
                        {formatPrice(order.tax)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between pt-4 pb-4 md:pb-6 border-b border-text-light/20">
                  <span className="text-base md:text-lg font-bold text-black uppercase tracking-wider">
                    Total Paid
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-black">
                    {formatPrice(order.total)}
                  </span>
                </div>

                {/* Tracking & Delivery Info */}
                {order.trackingNumber && (
                  <div className="py-4 border-b border-text-light/20">
                    <p className="text-xs font-semibold text-text-medium uppercase tracking-wider mb-2">
                      Tracking Number
                    </p>
                    <p className="text-sm font-mono font-bold text-black">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}

                {order.estimatedDelivery && order.status.toLowerCase() !== 'delivered' && (
                  <div className="py-4 border-b border-text-light/20">
                    <div className="flex items-start gap-3">
                      <Truck size={16} className="text-text-medium mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs font-semibold text-black mb-1">Estimated Delivery</p>
                        <p className="text-sm text-text-medium">
                          {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {order.deliveredAt && (
                  <div className="py-4 border-b border-text-light/20">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-green-600 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs font-semibold text-black mb-1">Delivered On</p>
                        <p className="text-sm text-text-medium">
                          {formatDate(order.deliveredAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  {order.status.toLowerCase() === 'delivered' && (
                    <button
                      onClick={() => {
                        // TODO: Implement reorder functionality
                        console.log('Reorder items:', order.items);
                      }}
                      className="w-full border-2 border-text-light/30 text-black py-3 font-semibold hover:border-black transition-colors uppercase tracking-wider text-sm"
                    >
                      Reorder
                    </button>
                  )}

                  {['pending', 'confirmed', 'processing'].includes(order.status.toLowerCase()) && (
                    <button
                      onClick={() => {
                        // TODO: Implement cancel order functionality
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          console.log('Cancel order:', order.id);
                        }
                      }}
                      className="w-full border-2 border-red-300 text-red-600 py-3 font-semibold hover:bg-red-50 transition-colors uppercase tracking-wider text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

