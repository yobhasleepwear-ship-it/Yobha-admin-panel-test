import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight, Bell } from "lucide-react";
import { removeFromWishlists } from "../../service/wishlist";
import { addToCart } from "../../service/productAPI";

/**
 * Helper function to safely format wishlist data from API
 * Handles null checks and provides fallbacks
 * 
 * Expected API Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "...",
 *       "userId": "...",
 *       "product": {...},
 *       "desiredQuantity": 1,
 *       "desiredSize": "S",
 *       "desiredColor": "Navy Blue",
 *       "notifyWhenBackInStock": true,
 *       "movedToCart": false,
 *       "note": "...",
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     }
 *   ]
 * }
 */
const formatWishlistData = (apiResponse) => {
  if (!apiResponse || !apiResponse.data) {
    return [];
  }

  const data = Array.isArray(apiResponse.data) ? apiResponse.data : [];

  return data
    .filter(item => item && item.product && item.product.isActive !== false)
    .map(item => ({
      // Wishlist item fields
      id: item?.id || Math.random().toString(),
      userId: item?.userId || '',
      desiredQuantity: typeof item?.desiredQuantity === 'number' ? item.desiredQuantity : 1,
      desiredSize: item?.desiredSize || '',
      desiredColor: item?.desiredColor || '',
      notifyWhenBackInStock: item?.notifyWhenBackInStock === true,
      movedToCart: item?.movedToCart === true,
      note: item?.note || '',
      createdAt: item?.createdAt || null,
      updatedAt: item?.updatedAt || null,

      // Product nested object fields
      product: {
        productId: item?.product?.productId || '',
        productObjectId: item?.product?.productObjectId || '',
        name: item?.product?.name || 'Untitled Product',
        slug: item?.product?.slug || '',
        thumbnailUrl: item?.product?.thumbnailUrl || 'https://via.placeholder.com/400x400?text=No+Image',
        variantSku: item?.product?.variantSku || '',
        variantId: item?.product?.variantId || '',
        variantSize: item?.product?.variantSize || '',
        variantColor: item?.product?.variantColor || '',
        unitPrice: typeof item?.product?.unitPrice === 'number' ? item.product.unitPrice : 0,
        compareAtPrice: typeof item?.product?.compareAtPrice === 'number' ? item.product.compareAtPrice : null,
        currency: item?.product?.currency || 'INR',
        isActive: item?.product?.isActive !== false,
        freeShipping: item?.product?.freeShipping === true,
      }
    }));
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

const WishlistPage = () => {
  const navigate = useNavigate();

  // API State
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============ TESTING DUMMY DATA - REMOVE AFTER TESTING ============
  const TESTING_DUMMY_WISHLIST = {
    success: true,
    status: 200,
    message: "OK",
    data: [
      {
        id: "6708a3e7d1b2a4c9f0000001",
        userId: "user_12345",
        product: {
          productId: "PID10001",
          productObjectId: "66fc87e10b9a2b7fbe901001",
          name: "Luxe Cotton Nightshirt",
          slug: "luxe-cotton-nightshirt",
          thumbnailUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600",
          variantSku: "PID10001-NAV-S",
          variantId: "var-1001",
          variantSize: "S",
          variantColor: "Navy Blue",
          unitPrice: 1299.00,
          compareAtPrice: 1599.00,
          currency: "INR",
          isActive: true,
          freeShipping: true
        },
        desiredQuantity: 1,
        desiredSize: "S",
        desiredColor: "Navy Blue",
        notifyWhenBackInStock: true,
        movedToCart: false,
        note: "Buy when restocked",
        createdAt: "2025-10-11T07:10:00Z",
        updatedAt: "2025-10-11T07:10:00Z"
      },
      {
        id: "6708a3e7d1b2a4c9f0000002",
        userId: "user_12345",
        product: {
          productId: "PID10002",
          productObjectId: "66fc87e10b9a2b7fbe901002",
          name: "Silk Pyjama Set",
          slug: "silk-pyjama-set",
          thumbnailUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600",
          variantSku: "PID10002-GRN-M",
          variantId: "var-1022",
          variantSize: "M",
          variantColor: "Green",
          unitPrice: 1599.00,
          compareAtPrice: 1799.00,
          currency: "INR",
          isActive: true,
          freeShipping: false
        },
        desiredQuantity: 2,
        desiredSize: "M",
        desiredColor: "Green",
        notifyWhenBackInStock: false,
        movedToCart: false,
        note: "Gift for sister",
        createdAt: "2025-10-11T07:12:00Z",
        updatedAt: "2025-10-11T07:12:00Z"
      },
      {
        id: "6708a3e7d1b2a4c9f0000003",
        userId: "user_12345",
        product: {
          productId: "PID10003",
          productObjectId: "66fc87e10b9a2b7fbe901003",
          name: "Premium Velvet Robe",
          slug: "premium-velvet-robe",
          thumbnailUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600",
          variantSku: "PID10003-BLK-L",
          variantId: "var-1033",
          variantSize: "L",
          variantColor: "Black",
          unitPrice: 2499.00,
          compareAtPrice: 2999.00,
          currency: "INR",
          isActive: true,
          freeShipping: true
        },
        desiredQuantity: 1,
        desiredSize: "L",
        desiredColor: "Black",
        notifyWhenBackInStock: false,
        movedToCart: false,
        note: "",
        createdAt: "2025-10-10T15:30:00Z",
        updatedAt: "2025-10-10T15:30:00Z"
      }
    ]
  };
  // ============ END TESTING DUMMY DATA ============

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      setError(null);

      // ============ TESTING MODE - COMMENT OUT AFTER TESTING ============
      setTimeout(() => {
        const formattedWishlist = formatWishlistData(TESTING_DUMMY_WISHLIST);
        setWishlistItems(formattedWishlist);
        setIsLoading(false);
      }, 500);
      return;
      // ============ END TESTING MODE ============

      // ============ PRODUCTION API CODE - UNCOMMENT AFTER TESTING ============
      /*
      try {
        const response = await getWishlist(); // Your API call
        
        if (response && response.success) {
          const formattedWishlist = formatWishlistData(response);
          setWishlistItems(formattedWishlist);
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setError('Failed to load wishlist');
        setWishlistItems([]);
      } finally {
        setIsLoading(false);
      }
      */
      // ============ END PRODUCTION API CODE ============
    };

    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove from wishlist

 const removeFromWishlist = async (productId) => {
  try {
    const response = await removeFromWishlists(productId)
    return response.data;
  } catch (err) {
    console.error("removeFromWishlist error:", err.response?.data || err.message);
    throw err;
  }
};
  // Move to cart
  const moveToCart = async(item) => {
    
    const cartData = {
      productId: item.product.productId,
      variantSku: item.product.variantSku,
      quantity: item.desiredQuantity,
      size: item.desiredSize,
      color: item.desiredColor
    };
    try{
   await addToCart(cartData);
   
    
   
    removeFromWishlist(item.id);
    alert('Item moved to cart!');
    }
    catch(err){
      console.log(err||"something went wrong")
    }
 
  };

  // Toggle notify when back in stock
  const toggleNotification = (itemId) => {
    setWishlistItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, notifyWhenBackInStock: !item.notifyWhenBackInStock }
          : item
      )
    );
    // TODO: Call API to update notification preference
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
          <p className="text-text-medium text-sm uppercase tracking-wider">Loading Wishlist...</p>
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black uppercase tracking-wide mb-2 md:mb-3">
                My Wishlist
              </h1>
              <p className="text-text-medium text-sm md:text-base">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={() => navigate("/products")}
                className="flex items-center gap-2 text-black hover:text-text-medium transition-colors border-b-2 border-black hover:border-text-medium uppercase text-sm tracking-wider font-medium"
              >
                Continue Shopping
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="text-center py-12 md:py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 border-2 border-text-light/20 flex items-center justify-center">
                <Heart size={40} className="text-text-light md:w-12 md:h-12" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4 uppercase tracking-wider">
                Your Wishlist is Empty
              </h2>
              <p className="text-sm md:text-base text-text-medium mb-6 md:mb-8">
                Save items you love for later
              </p>
              <button
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 md:gap-3 bg-black text-white px-6 md:px-8 py-3 md:py-4 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-xs md:text-sm"
              >
                Explore Products
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item?.product || {};
              const discountPercent = calculateDiscountPercent(product.compareAtPrice, product.unitPrice);

              return (
                <div
                  key={item.id}
                  className="group bg-white border border-text-light/20 overflow-hidden hover:shadow-lg transition-all flex flex-col"
                >
                  {/* Product Image */}
                  <div 
                    className="relative aspect-square overflow-hidden bg-premium-beige cursor-pointer"
                    onClick={() => navigate(`/productDetail/${product.productId}`)}
                  >
                    <img
                      src={product.thumbnailUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(item.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 text-black hover:text-red-500 transition-all z-10"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <div className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 text-xs font-medium uppercase tracking-wider">
                        {discountPercent}% OFF
                      </div>
                    )}

                    {/* Free Shipping Badge */}
                    {product.freeShipping && (
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-black px-2.5 py-1 text-xs font-medium uppercase tracking-wider">
                        Free Shipping
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 
                      className="font-semibold text-black text-base mb-2 line-clamp-2 hover:underline cursor-pointer uppercase tracking-tight"
                      onClick={() => navigate(`/productDetail/${product.productId}`)}
                    >
                      {product.name}
                    </h3>
                    
                    {/* Variant Info */}
                    <div className="flex flex-wrap gap-2 text-xs text-text-medium mb-3">
                      {item.desiredColor && (
                        <span className="capitalize">Color: <span className="text-black font-medium">{item.desiredColor}</span></span>
                      )}
                      {item.desiredSize && (
                        <span>Size: <span className="text-black font-medium">{item.desiredSize}</span></span>
                      )}
                    </div>

                    {/* Note */}
                    {item.note && (
                      <p className="text-xs text-text-light italic mb-3 line-clamp-1">
                        Note: {item.note}
                      </p>
                    )}
                    
                    {/* Price */}
                    <div className="flex flex-wrap items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold text-black">
                        {formatPrice(product.unitPrice, product.currency)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-text-light line-through">
                          {formatPrice(product.compareAtPrice, product.currency)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto space-y-2">
                      {/* Move to Cart Button */}
                      <button
                        onClick={() => moveToCart(item)}
                        className="w-full bg-black text-white py-3 font-semibold hover:bg-text-dark transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={16} strokeWidth={1.5} />
                        Move to Cart
                      </button>

                      {/* Notify When Back in Stock */}
                      <button
                        onClick={() => toggleNotification(item.id)}
                        className={`w-full py-2 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                          item.notifyWhenBackInStock
                            ? 'bg-premium-beige text-black border-2 border-black'
                            : 'border-2 border-text-light/30 text-text-medium hover:border-black hover:text-black'
                        }`}
                      >
                        <Bell size={14} strokeWidth={1.5} />
                        {item.notifyWhenBackInStock ? 'Notifications On' : 'Notify Me'}
                      </button>
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

export default WishlistPage;
