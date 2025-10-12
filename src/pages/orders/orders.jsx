import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle2, XCircle, Clock, ChevronRight } from "lucide-react";
import { getOrders } from "../../service/order";

/**
 * Helper function to safely format orders data from API
 * Handles null checks and provides fallbacks
 * 
 * Expected API Response for Orders List:
 * Array of order objects
 */
const formatOrderData = (order) => {
  if (!order) return null;

  return {
    id: order?.id || '',
    userId: order?.userId || '',
    
    // Items with null checks
    items: Array.isArray(order?.items) && order.items.length > 0
      ? order.items.map(item => ({
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
    subTotal: typeof order?.subTotal === 'number' ? order.subTotal : 0,
    shipping: typeof order?.shipping === 'number' ? order.shipping : 0,
    tax: typeof order?.tax === 'number' ? order.tax : 0,
    discount: typeof order?.discount === 'number' ? order.discount : 0,
    total: typeof order?.total === 'number' ? order.total : 0,
    
    // Status and dates
    status: order?.status || 'Pending',
    createdAt: order?.createdAt || null,
    updatedAt: order?.updatedAt || null,
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

const formatPrice = (price, currency = 'INR') => {
  if (typeof price !== 'number') return '₹0';
  const symbol = currency === 'INR' ? '₹' : currency;
  return `${symbol}${price.toLocaleString('en-IN', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  })}`;
};


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

const OrdersPage = () => {
  const navigate = useNavigate();

  // API State
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============ TESTING DUMMY DATA - REMOVE AFTER TESTING ============
  const TESTING_DUMMY_ORDERS = [
    {
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
        }
      ],
      subTotal: 2598.00,
      shipping: 0.00,
      tax: 0.00,
      discount: 0.00,
      total: 2598.00,
      status: "Shipped",
      createdAt: "2025-10-11T03:12:00Z",
      updatedAt: "2025-10-12T10:00:00Z"
    },
    {
      id: "650f1a2b3c4d5e0000000002",
      userId: "user-123",
      items: [
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
        },
        {
          productId: "PID10003",
          productObjectId: "650b8c1e4b5f4a0000000002",
          productName: "Premium Velvet Robe",
          variantSku: "PID10003-BLK-L",
          variantId: "var-789",
          quantity: 1,
          unitPrice: 2499.00,
          lineTotal: 2499.00,
          compareAtPrice: null,
          currency: "INR",
          thumbnailUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400",
          slug: "premium-velvet-robe"
        }
      ],
      subTotal: 4498.00,
      shipping: 0.00,
      tax: 0.00,
      discount: 200.00,
      total: 4298.00,
      status: "Delivered",
      createdAt: "2025-10-05T08:20:00Z",
      updatedAt: "2025-10-08T15:30:00Z"
    },
    {
      id: "650f1a2b3c4d5e0000000003",
      userId: "user-123",
      items: [
        {
          productId: "PID10004",
          productObjectId: "650b8c1e4b5f4a0000000003",
          productName: "Cashmere Lounge Set",
          variantSku: "PID10004-GRY-M",
          variantId: "var-101",
          quantity: 1,
          unitPrice: 3299.00,
          lineTotal: 3299.00,
          compareAtPrice: 3999.00,
          currency: "INR",
          thumbnailUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
          slug: "cashmere-lounge-set"
        }
      ],
      subTotal: 3299.00,
      shipping: 0.00,
      tax: 0.00,
      discount: 100.00,
      total: 3199.00,
      status: "Pending",
      createdAt: "2025-10-10T14:45:00Z",
      updatedAt: null
    }
  ];
  // ============ END TESTING DUMMY DATA ============

  // Fetch orders
  useEffect(() => {
   const getOrder = async () => {
    setIsLoading(true)
  try {
    const orders = await getOrders();
    console.log("Orders:", orders.data);
  } catch (err) {
    console.log("Failed to fetch orders");
  }
  finally{
    setIsLoading(false)
  }
};
    getOrder();
   
  }, []);

  // View order details
  const viewOrderDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
    // Or open modal/navigate to separate page
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-premium-cream flex items-center justify-center"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-premium-beige border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-medium text-sm uppercase tracking-wider">Loading Orders...</p>
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
        <div className="text-center max-w-md px-4">
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
            My Orders
          </h1>
          <p className="text-text-medium text-sm md:text-base">
            Track and manage your orders
          </p>
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 md:py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 border-2 border-text-light/20 flex items-center justify-center">
                <Package size={40} className="text-text-light md:w-12 md:h-12" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4 uppercase tracking-wider">
                No Orders Yet
              </h2>
              <p className="text-sm md:text-base text-text-medium mb-6 md:mb-8">
                Start shopping to see your orders here
              </p>
              <button
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 md:gap-3 bg-black text-white px-6 md:px-8 py-3 md:py-4 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-xs md:text-sm"
              >
                Browse Products
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const totalItems = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

              return (
                <div 
                  key={order.id}
                  className="bg-white border border-text-light/20 hover:shadow-lg transition-all"
                >
                  {/* Order Header */}
                  <div className="px-4 md:px-6 py-4 border-b border-text-light/20">
                    <div className="flex flex-col gap-3">
                      {/* Order ID and Status - Stack on mobile */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-black text-sm md:text-base uppercase tracking-wider mb-2">
                            Order ID: {order.id}
                          </h3>
                          <p className="text-xs md:text-sm text-text-medium">
                            Placed on {formatDate(order.createdAt)}
                            {order.updatedAt && <span className="hidden sm:inline"> • Updated {formatDate(order.updatedAt)}</span>}
                          </p>
                        </div>

                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 border ${statusInfo.borderColor} ${statusInfo.bgColor} self-start`}>
                          <StatusIcon size={14} className={statusInfo.color} strokeWidth={2} />
                          <span className={`text-xs font-semibold ${statusInfo.color} uppercase tracking-wider`}>
                            {statusInfo.text}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button - Full width on mobile */}
                      <button
                        onClick={() => viewOrderDetails(order.id)}
                        className="w-full sm:w-auto sm:self-end flex items-center justify-center gap-2 border-2 border-text-light/30 px-4 md:px-6 py-2 md:py-3 hover:border-black transition-colors text-xs md:text-sm font-semibold uppercase tracking-wider"
                      >
                        View Details
                        <ChevronRight size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Items - 2/3 width on desktop */}
                      <div className="lg:col-span-2">
                        <h4 className="text-xs font-semibold text-text-medium uppercase tracking-wider mb-4">
                          Items ({totalItems})
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div 
                              key={`${item.productId}-${index}`}
                              className="flex gap-4 pb-3 border-b border-text-light/10 last:border-0 last:pb-0"
                            >
                              <div 
                                className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-premium-beige overflow-hidden cursor-pointer"
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
                                <h5 
                                  className="font-semibold text-black text-sm md:text-base mb-2 line-clamp-2 hover:underline cursor-pointer uppercase tracking-tight"
                                  onClick={() => navigate(`/productDetail/${item.productId}`)}
                                >
                                  {item.productName}
                                </h5>
                                <p className="text-xs md:text-sm text-text-medium mb-2">
                                  Quantity: <span className="font-medium text-black">{item.quantity}</span>
                                  {item.variantSku && (
                                    <span className="ml-3">SKU: <span className="font-medium text-black">{item.variantSku}</span></span>
                                  )}
                                </p>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-base md:text-lg font-bold text-black">
                                    {formatPrice(item.lineTotal, item.currency)}
                                  </span>
                                  {item.compareAtPrice && (
                                    <span className="text-xs md:text-sm text-text-light line-through">
                                      {formatPrice(item.compareAtPrice * item.quantity, item.currency)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary - 1/3 width on desktop */}
                      <div className="lg:col-span-1">
                        <h4 className="text-xs font-semibold text-text-medium uppercase tracking-wider mb-4">
                          Order Summary
                        </h4>
                        <div className="bg-premium-beige p-4 space-y-2">
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

                          <div className="flex justify-between pt-3 border-t border-text-light/20">
                            <span className="text-sm md:text-base font-bold text-black uppercase tracking-wider">
                              Total
                            </span>
                            <span className="text-lg md:text-xl font-bold text-black">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
