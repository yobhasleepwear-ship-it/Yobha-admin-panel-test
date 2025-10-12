import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
} from "lucide-react";
import { addToCart, getCartDetails, getProductDescription, updateCartQuantity } from "../../service/productAPI";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../redux/cartSlice";
import { addToWishlist } from "../../service/wishlist";
import ToastContainer, { message } from "../../comman/toster-message/ToastContainer";
/**
 * Helper function to safely format product data from API
 * Handles null checks and provides fallbacks
 */
// eslint-disable-next-line no-unused-vars
const formatProductData = (apiData) => {
  if (!apiData) return null;

  const data = apiData.data || apiData;

  return {
    id: data?.id || data?.productId || '',
    productId: data?.productId || data?.id || '',
    name: data?.name || 'Untitled Product',
    slug: data?.slug || '',
    description: data?.description || '',
    
    // Images with null checks
    images: Array.isArray(data?.images) && data.images.length > 0
      ? data.images.map(img => ({
          url: img?.url || 'https://via.placeholder.com/800x800?text=No+Image',
          thumbnailUrl: img?.thumbnailUrl || img?.url || 'https://via.placeholder.com/150x150?text=No+Image',
          alt: img?.alt || 'Product image',
        }))
      : [{
          url: 'https://via.placeholder.com/800x800?text=No+Image',
          thumbnailUrl: 'https://via.placeholder.com/150x150?text=No+Image',
          alt: 'Product image',
        }],

    // Pricing with null checks
    price: data?.prices?.IN || data?.prices?.default || 0,
    compareAtPrice: data?.compareAtPrice || null,
    
    // Variants and inventory
    variants: Array.isArray(data?.variants) ? data.variants.filter(v => v?.isActive !== false) : [],
    inventory: Array.isArray(data?.inventory) ? data.inventory : [],
    
    // Product attributes
    colors: Array.isArray(data?.colors) && data.colors.length > 0 ? data.colors : [],
    sizes: Array.isArray(data?.sizeOfProduct) && data.sizeOfProduct.length > 0 
      ? data.sizeOfProduct 
      : [],
    fabricType: Array.isArray(data?.fabricType) ? data.fabricType : [],
    
    // Categories
    productMainCategory: data?.productMainCategory || '',
    productCategory: data?.productCategory || '',
    productSubCategory: data?.productSubCategory || '',
    
    // Ratings and reviews
    averageRating: typeof data?.averageRating === 'number' ? data.averageRating : 0,
    reviewCount: typeof data?.reviewCount === 'number' ? data.reviewCount : 0,
    reviews: Array.isArray(data?.reviews) 
      ? data.reviews.filter(r => r?.approved !== false) 
      : [],
    
    // Additional info
    isFeatured: data?.isFeatured === true,
    salesCount: data?.salesCount || 0,
    isActive: data?.isActive !== false,
    
    // Specifications
    specifications: data?.specifications || {},
    keyFeatures: Array.isArray(data?.keyFeatures) ? data.keyFeatures : [],
    careInstructions: Array.isArray(data?.careInstructions) ? data.careInstructions : [],
    
    // Metadata
    createdAt: data?.createdAt || null,
    updatedAt: data?.updatedAt || null,
  };
};

/**
 * Get available quantity for a specific color/size combination
 */
const getAvailableQuantity = (inventory, color, size) => {
  if (!Array.isArray(inventory) || inventory.length === 0) return 0;
  
  const item = inventory.find(
    inv => inv?.color === color && inv?.size === size && inv?.quantity > 0
  );
  
  return item ? (item.quantity - (item.reserved || 0)) : 0;
};

/**
 * Format price to INR
 */
const formatPrice = (price) => {
  if (typeof price !== 'number') return '₹0';
  return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  // UI State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // API State
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============ TESTING DUMMY DATA - REMOVE AFTER TESTING ============
  const TESTING_DUMMY_PRODUCT = {
    id: "test-product-001",
    productId: "PID10001",
    name: "Luxe Cotton Nightshirt",
    slug: "luxe-cotton-nightshirt",
    description: "Lightweight, breathable cotton nightshirt with mother-of-pearl buttons. Designed for ultimate comfort and style.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
        thumbnailUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=150",
        alt: "Front view",
      },
      {
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
        thumbnailUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=150",
        alt: "Side view",
      },
      {
        url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800",
        thumbnailUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=150",
        alt: "Back view",
      },
    ],
    price: 1499.00,
    compareAtPrice: 1799.00,
    variants: [
      {
        id: "variant-1",
        sku: "PID10001-NAV-S",
        color: "navy",
        size: "S",
        quantity: 10,
        isActive: true,
        image:"https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
      },
      {
        id: "variant-2",
        sku: "PID10001-NAV-M",
        color: "navy",
        size: "M",
        quantity: 15,
        isActive: true,
         image:"https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
      },
      {
        id: "variant-3",
        sku: "PID10001-ROSE-S",
        color: "rose",
        size: "S",
        quantity: 8,
        isActive: true,
         image:"https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
      },
      {
        id: "variant-4",
        sku: "PID10001-ROSE-M",
        color: "rose",
        size: "M",
        quantity: 12,
        isActive: true,
         image:"https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
      },
    ],
    inventory: [
      {
        id: "inv1",
        variantId: "variant-1",
        sku: "PID10001-NAV-S",
        size: "S",
        color: "navy",
        quantity: 10,
        reserved: 0,
      },
      {
        id: "inv2",
        variantId: "variant-2",
        sku: "PID10001-NAV-M",
        size: "M",
        color: "navy",
        quantity: 15,
        reserved: 2,
      },
      {
        id: "inv3",
        variantId: "variant-3",
        sku: "PID10001-ROSE-S",
        size: "S",
        color: "rose",
        quantity: 8,
        reserved: 1,
      },
      {
        id: "inv4",
        variantId: "variant-4",
        sku: "PID10001-ROSE-M",
        size: "M",
        color: "rose",
        quantity: 12,
        reserved: 0,
      },
    ],
    colors: ["navy", "rose"],
    sizes: ["S", "M", "L", "XL"],
    fabricType: ["100% Cotton"],
    productMainCategory: "sleepwear",
    productCategory: "women",
    productSubCategory: "nightshirts",
    averageRating: 4.5,
    reviewCount: 12,
    reviews: [
      {
        id: "r1",
        userId: "user-1",
        rating: 5,
        comment: "Great nightshirt! Very comfortable and the fabric quality is excellent. Highly recommend!",
        createdAt: "2025-09-20T10:00:00Z",
        approved: true
      },
      {
        id: "r2",
        userId: "user-2",
        rating: 4,
        comment: "Nice product, good fit. Would have given 5 stars if the sleeves were slightly longer.",
        createdAt: "2025-09-15T14:30:00Z",
        approved: true
      },
    ],
    isFeatured: false,
    salesCount: 120,
    isActive: true,
    specifications: {
      Material: "100% Cotton",
      SleeveType: "Full sleeve",
      Care: "Machine wash cold"
    },
    keyFeatures: [
      "100% breathable cotton",
      "Mother-of-pearl buttons",
      "Soft and comfortable",
      "Durable stitching",
      "Machine washable"
    ],
    careInstructions: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Iron on medium heat"
    ],
    createdAt: "2025-09-01T12:00:00Z",
    updatedAt: "2025-10-01T08:00:00Z",
  };
  
  useEffect(() => {
    

    if (productId) {
      fetchProductDetail(productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);
  
  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      if (product.availableColors.length > 0 && !selectedColor) {
        setSelectedColor(product.availableColors[0]);
      }
      if (product.sizeOfProduct.length > 0 && !selectedSize) {
        setSelectedSize(product.sizeOfProduct[0]);
      }
    }
  }, [product, selectedColor, selectedSize]);
 const fetchProductDetail = async (productId) => {
  setIsLoading(true)
    try {
      const response = await getProductDescription(productId);
      console.log("Product details:");
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
    finally{
      setIsLoading(false)
    }
  };

  // Get available quantity for current selection
  const availableQuantity = product 
    ? getAvailableQuantity(product.inventory, selectedColor, selectedSize) 
    : 0;
  
  // Image navigation
  const handlePrevImage = () => {
    if (!product || product.images.length === 0) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product || product.images.length === 0) return;
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  // Quantity controls
  const handleIncrement = () => {
    if (quantity < availableQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
 
const fetchCart = async () => {
  
    try {
      const response = await getCartDetails()
      console.log(response.data.items.length);
      dispatch(setCartCount(response.data.items.length));
    }
    catch (err) {
      console.log(err || "something went wrong")
    }
    finally{
     
    }

  }
  // Add to cart
const handleAddToCart = async () => {
  if (!selectedColor || !selectedSize || availableQuantity === 0) {
    alert('Please select color and size');
    return;
  }

  // Find the variant SKU for selected color + size
  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const payload = {
    productId: product.productId,                    // required
    variantSku: selectedVariant?.sku || '',          // optional
    quantity: quantity,                              // required
    currency: "INR",                                 // optional
    note: ""                                         // optional, can be set dynamically
  };

  try {
    const response = await addToCart(payload);
    console.log("Added to cart:", response);
    message.success("Product added to cart successfully!");
    fetchCart()
  } catch (err) {
    console.error("Error adding to cart:", err);
    alert("Failed to add product to cart. Please try again.");
  }
};


  // Wishlist toggle
  const handleAddToWishlist = async (productId) => {
      const payload={
    "productId": "PID10001",
    "variantSku": "PID10001-NAV-S",
    "desiredQuantity": 1,
    "desiredSize": "S",
    "desiredColor": "Navy Blue",
    "notifyWhenBackInStock": true,
    "note": "Buy during Diwali sale"
  }
  
      try {
        const result = await addToWishlist(productId,payload);
        console.log("Added to wishlist:", result);
        alert("Product added to wishlist!");
      } catch (err) {
        console.error("Failed to add to wishlist:", err);
        alert("Failed to add to wishlist");
      }
    };
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement actual wishlist API call
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
          <p className="text-text-medium text-sm uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div 
        className="min-h-screen bg-premium-cream flex items-center justify-center"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-wider">
            Product Not Found
          </h2>
          <p className="text-text-medium mb-8">
            {error || 'The product you are looking for does not exist or is no longer available.'}
          </p>
          <a
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-sm"
          >
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  const currentImage = product.images[selectedImageIndex] || product.images[0];
  const hasMultipleImages = product.images.length > 1;

  return (
    <div 
      className="min-h-screen bg-premium-cream"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-12">
        
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-text-medium">
          <a href="/" className="hover:text-black transition-colors">Home</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-black transition-colors">Products</a>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white overflow-hidden group">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x800?text=Image+Not+Found';
                }}
              />
              
              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 hover:bg-white transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} className="text-black" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 hover:bg-white transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} className="text-black" strokeWidth={1.5} />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-1 rounded-full transition-all ${
                        index === selectedImageIndex 
                          ? 'w-6 bg-black' 
                          : 'w-1 bg-black/30'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white overflow-hidden transition-all ${
                      index === selectedImageIndex
                        ? 'ring-2 ring-black'
                        : 'ring-1 ring-text-light/20 hover:ring-text-light'
                    }`}
                  >
                    <img
                      src={image.thumbnailUrl}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-8">
            
            {/* Product Name */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black uppercase tracking-wide mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(product.averageRating)
                            ? "fill-black text-black"
                            : "fill-none text-text-light"
                        }
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-text-medium">
                    {product.averageRating} ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-text-medium text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="py-6 border-y border-text-light/20">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-black">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-text-light line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {product?.availableColors?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-widest">
                  Color: <span className="font-normal text-text-medium">{selectedColor}</span>
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {product?.availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 border-2 transition-all uppercase text-sm tracking-wider ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-text-light/30 text-black hover:border-text-dark'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizeOfProduct.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-widest">
                  Size: <span className="font-normal text-text-medium">{selectedSize}</span>
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizeOfProduct.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border-2 transition-all uppercase text-sm tracking-wider font-medium ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-text-light/30 text-black hover:border-text-dark'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-widest">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-text-light/30">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-premium-beige transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} strokeWidth={2} />
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= availableQuantity}
                    className="p-3 hover:bg-premium-beige transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} strokeWidth={2} />
                  </button>
                </div>
                {availableQuantity > 0 && (
                  <span className="text-sm text-text-medium">
                    {availableQuantity} available
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={availableQuantity === 0 || !selectedColor || !selectedSize}
                className="flex-1 bg-black text-white py-4 px-6 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-3 disabled:bg-text-light disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={()=>handleAddToWishlist(product.id)}
                className={`p-4 border-2 transition-all ${
                  isWishlisted
                    ? 'border-black bg-black'
                    : 'border-text-light/30 hover:border-black'
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart 
                  size={20} 
                  strokeWidth={1.5}
                  className={isWishlisted ? 'fill-white text-white' : 'text-black'}
                />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3 pt-6 border-t border-text-light/20">
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-text-medium mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-black">Free Shipping</p>
                  <p className="text-xs text-text-medium">Estimated delivery: 3-5 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={20} className="text-text-medium mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-black">Easy Returns</p>
                  <p className="text-xs text-text-medium">30-day return policy</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            {(product.keyFeatures.length > 0 || Object.keys(product.specifications).length > 0 || product.fabricType.length > 0) && (
              <div className="space-y-6 pt-6 border-t border-text-light/20">
                
                {/* Key Features */}
                {product.keyFeatures.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-widest">
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {product.keyFeatures.map((feature, index) => (
                        <li key={index} className="text-sm text-text-medium flex items-start">
                          <span className="mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fabric Type */}
                {product.fabricType.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-widest">
                      Fabric
                    </h3>
                    <p className="text-sm text-text-medium">
                      {product.fabricType.join(', ')}
                    </p>
                  </div>
                )}

                {/* Care Instructions */}
                {product.careInstructions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-widest">
                      Care Instructions
                    </h3>
                    <ul className="space-y-2">
                      {product.careInstructions.map((instruction, index) => (
                        <li key={index} className="text-sm text-text-medium flex items-start">
                          <span className="mr-2">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mt-20 pt-12 border-t border-text-light/20">
            <h2 className="text-2xl md:text-3xl font-bold text-black uppercase tracking-wide mb-8">
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div key={review.id || index} className="border-b border-text-light/10 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "fill-black text-black"
                              : "fill-none text-text-light"
                          }
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-text-medium">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-text-dark leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {product.variants?.length > 0 && (
  <div className="space-y-6 pt-6 border-t border-text-light/20 ">
    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-widest">
      Available Variants
    </h3>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 ">
      {product.variants
        .filter(v => v.isActive)
        .map((variant) => (
          <div
            key={variant.id}
            className="group border border-text-light/20 hover:border-black transition-all rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={variant.image}
                alt={`${variant.color} ${variant.size}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/300x300?text=No+Image")
                }
              />
            </div>
            <div className="p-4 text-center space-y-2">
              <p className="text-sm font-semibold text-black uppercase tracking-widest">
                {variant.color}
              </p>
              <p className="text-xs text-text-medium uppercase">
                Size: {variant.size}
              </p>
              <p className="text-xs text-text-medium">
                Qty: {variant.quantity > 0 ? variant.quantity : "Out of Stock"}
              </p>
            </div>
          </div>
        ))}
    </div>
  </div>
)}
      </div>
      {/* Product Variants */}


    </div>
  );
};

export default ProductDetailPage;
