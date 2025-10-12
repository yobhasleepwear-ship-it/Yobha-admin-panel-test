import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

const SAMPLE_PRODUCTS = [
  {
    _id: {
      $oid: "68ea9364034b313e6da0d971"
    },
    ProductId: "PID10001",
    Name: "Silk Night Shirt",
    Slug: "silk-night-shirt",
    Description: "Hand-finished mulberry silk with mother-of-pearl buttons, crafted for ultimate comfort and timeless elegance.",
    Price: {
      $numberDecimal: "4990.00"
    },
    CompareAtPrice: {
      $numberDecimal: "5990.00"
    },
    DiscountPercent: 17,
    Stock: 25,
    Variants: [
      {
        _id: "VAR10001-BLK-M",
        Sku: "PID10001-BLK-M",
        Color: "Black",
        Size: "M",
        Quantity: 10,
        Images: [
          {
            Url: "https://i.etsystatic.com/19870219/r/il/9939a4/3877887290/il_fullxfull.3877887290_o82x.jpg",
            ThumbnailUrl: "https://i.etsystatic.com/19870219/r/il/9939a4/3877887290/il_fullxfull.3877887290_o82x.jpg",
            Alt: "Silk Night Shirt - Black"
          }
        ],
        IsActive: true
      }
    ],
    Images: [
      {
        Url: "https://i.etsystatic.com/19870219/r/il/9939a4/3877887290/il_fullxfull.3877887290_o82x.jpg",
        ThumbnailUrl: "https://i.etsystatic.com/19870219/r/il/9939a4/3877887290/il_fullxfull.3877887290_o82x.jpg",
        Alt: "Silk Night Shirt main image"
      }
    ],
    IsFeatured: true,
    SalesCount: 150,
    IsActive: true,
    IsDeleted: false,
    ProductMainCategory: "Sleepwear",
    ProductCategory: "Nightwear",
    ProductSubCategory: "Night Shirts"
  },
  {
    _id: {
      $oid: "68ea9364034b313e6da0d972"
    },
    ProductId: "PID10002",
    Name: "Cashmere Lounge Set",
    Slug: "cashmere-lounge-set",
    Description: "Featherlight knit, designed for all-day luxury comfort in soft pastel tones.",
    Price: {
      $numberDecimal: "6450.00"
    },
    CompareAtPrice: {
      $numberDecimal: "7450.00"
    },
    DiscountPercent: 13,
    Stock: 18,
    Variants: [
      {
        _id: "VAR10002-GRY-L",
        Sku: "PID10002-GRY-L",
        Color: "Grey",
        Size: "L",
        Quantity: 8,
        Images: [
          {
            Url: "https://i.ebayimg.com/images/g/F8gAAOSw5RldMuSB/s-l400.jpg",
            ThumbnailUrl: "https://i.ebayimg.com/images/g/F8gAAOSw5RldMuSB/s-l400.jpg",
            Alt: "Cashmere Lounge Set - Grey"
          }
        ],
        IsActive: true
      }
    ],
    Images: [
      {
        Url: "https://i.ebayimg.com/images/g/F8gAAOSw5RldMuSB/s-l400.jpg",
        ThumbnailUrl: "https://i.ebayimg.com/images/g/F8gAAOSw5RldMuSB/s-l400.jpg",
        Alt: "Cashmere Lounge Set main image"
      }
    ],
    IsFeatured: false,
    SalesCount: 230,
    IsActive: true,
    IsDeleted: false,
    ProductMainCategory: "Loungewear",
    ProductCategory: "Lounge Sets",
    ProductSubCategory: "Cashmere Sets"
  },
  {
    _id: {
      $oid: "68ea9364034b313e6da0d973"
    },
    ProductId: "PID10003",
    Name: "Satin Camisole",
    Slug: "satin-camisole",
    Description: "Lustrous satin drape with delicate adjustable straps, made for graceful ease.",
    Price: {
      $numberDecimal: "2490.00"
    },
    Stock: 45,
    Variants: [
      {
        _id: "VAR10003-WHT-S",
        Sku: "PID10003-WHT-S",
        Color: "White",
        Size: "S",
        Quantity: 20,
        Images: [
          {
            Url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlDdRDL3DAbUYYbvbijqJDG6btkfNZYECbz2IG3Y1hCknNZrt01pYWKCofaaUiCX-DVKM&usqp=CAU",
            ThumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlDdRDL3DAbUYYbvbijqJDG6btkfNZYECbz2IG3Y1hCknNZrt01pYWKCofaaUiCX-DVKM&usqp=CAU",
            Alt: "Satin Camisole - White"
          }
        ],
        IsActive: true
      }
    ],
    Images: [
      {
        Url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlDdRDL3DAbUYYbvbijqJDG6btkfNZYECbz2IG3Y1hCknNZrt01pYWKCofaaUiCX-DVKM&usqp=CAU",
        ThumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlDdRDL3DAbUYYbvbijqJDG6btkfNZYECbz2IG3Y1hCknNZrt01pYWKCofaaUiCX-DVKM&usqp=CAU",
        Alt: "Satin Camisole main image"
      }
    ],
    IsFeatured: false,
    SalesCount: 320,
    IsActive: true,
    IsDeleted: false,
    ProductMainCategory: "Sleepwear",
    ProductCategory: "Camisoles",
    ProductSubCategory: "Satin"
  },
  {
    _id: {
      $oid: "68ea9364034b313e6da0d974"
    },
    ProductId: "PID10004",
    Name: "Velour Robe",
    Slug: "velour-robe",
    Description: "Ultra-plush warmth with a hotel-grade finish — comfort meets elegance.",
    Price: {
      $numberDecimal: "5290.00"
    },
    CompareAtPrice: {
      $numberDecimal: "6290.00"
    },
    DiscountPercent: 16,
    Stock: 30,
    Variants: [
      {
        _id: "VAR10004-NAV-XL",
        Sku: "PID10004-NAV-XL",
        Color: "Navy Blue",
        Size: "XL",
        Quantity: 12,
        Images: [
          {
            Url: "https://i.pinimg.com/236x/7e/6d/a5/7e6da53be4b66e464fd76766878c9b7c.jpg",
            ThumbnailUrl: "https://i.pinimg.com/236x/7e/6d/a5/7e6da53be4b66e464fd76766878c9b7c.jpg",
            Alt: "Velour Robe - Navy Blue"
          }
        ],
        IsActive: true
      }
    ],
    Images: [
      {
        Url: "https://i.pinimg.com/236x/7e/6d/a5/7e6da53be4b66e464fd76766878c9b7c.jpg",
        ThumbnailUrl: "https://i.pinimg.com/236x/7e/6d/a5/7e6da53be4b66e464fd76766878c9b7c.jpg",
        Alt: "Velour Robe main image"
      }
    ],
    IsFeatured: true,
    SalesCount: 95,
    IsActive: true,
    IsDeleted: false,
    ProductMainCategory: "Loungewear",
    ProductCategory: "Robes",
    ProductSubCategory: "Velour"
  }
];

/**
 * Helper function to safely extract and format product data from DB structure
 * Handles null checks and MongoDB specific formats
 */
const formatProductForDisplay = (product) => {
  if (!product) return null;

  // Safely extract product ID
  const id = product?.ProductId || product?._id?.$oid || product?._id || null;
  
  // Safely extract name
  const title = product?.Name || "Untitled Product";
  
  // Safely extract description
  const description = product?.Description || "";
  
  // Safely extract and format price with null checks
  const formatPrice = (priceObj) => {
    if (!priceObj) return "Price not available";
    
    const priceValue = priceObj?.$numberDecimal || priceObj;
    if (!priceValue) return "Price not available";
    
    const numPrice = parseFloat(priceValue);
    if (isNaN(numPrice)) return "Price not available";
    
    return `₹${numPrice.toLocaleString('en-IN', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  };
  
  const price = formatPrice(product?.Price);
  const compareAtPrice = product?.CompareAtPrice ? formatPrice(product.CompareAtPrice) : null;
  
  // Safely extract image URL with multiple fallbacks
  const getImageUrl = () => {
    // First try: Main product images array
    if (product?.Images && Array.isArray(product.Images) && product.Images.length > 0) {
      const mainImage = product.Images[0];
      return mainImage?.Url || mainImage?.ThumbnailUrl || null;
    }
    
    // Second try: First variant's images
    if (product?.Variants && Array.isArray(product.Variants) && product.Variants.length > 0) {
      const firstVariant = product.Variants[0];
      if (firstVariant?.Images && Array.isArray(firstVariant.Images) && firstVariant.Images.length > 0) {
        const variantImage = firstVariant.Images[0];
        return variantImage?.Url || variantImage?.ThumbnailUrl || null;
      }
    }
    
    // Fallback: placeholder image
    return "https://via.placeholder.com/400x300?text=No+Image";
  };
  
  const image = getImageUrl();
  
  // Determine badge based on product properties
  const getBadge = () => {
    if (product?.IsFeatured) return "Featured";
    if (product?.DiscountPercent && product.DiscountPercent > 0) {
      return `${product.DiscountPercent}% OFF`;
    }
    if (product?.SalesCount && product.SalesCount > 100) return "Bestseller";
    return "New";
  };
  
  const badge = getBadge();
  
  // Get product slug for navigation
  const slug = product?.Slug || product?.ProductId || id;
  
  return {
    id,
    title,
    description,
    price,
    compareAtPrice,
    image,
    badge,
    slug,
    discountPercent: product?.DiscountPercent || 0,
    stock: product?.Stock || 0,
    isActive: product?.IsActive !== false,
  };
};

const TrendingNewArrivals = ({ products = null }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(() =>
    typeof window !== "undefined" && window.innerWidth >= 768 ? 3 : 1
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const handle = (e) => setVisibleCount(e.matches ? 3 : 1);
    handle(mq);
    if (mq.addEventListener) mq.addEventListener("change", handle);
    else mq.addListener(handle);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handle);
      else mq.removeListener(handle);
    };
  }, []);

  // Use provided products or fallback to sample data
  // Format products from DB structure to display structure
  const displayProducts = useMemo(() => {
    const rawProducts = products || SAMPLE_PRODUCTS;
    
    if (!rawProducts || !Array.isArray(rawProducts)) {
      return SAMPLE_PRODUCTS;
    }
    
    // If products are from DB, format them; otherwise use as-is
    const hasDbStructure = rawProducts.some(p => p?.ProductId || p?._id?.$oid);
    
    if (hasDbStructure) {
      return rawProducts
        .map(formatProductForDisplay)
        .filter(p => p !== null && p.isActive && p.stock > 0);
    }
    
    return rawProducts;
  }, [products]);

  const maxIndex = Math.max(0, displayProducts.length - visibleCount);
  const clampedIndex = useMemo(
    () => Math.max(0, Math.min(index, maxIndex)),
    [index, maxIndex]
  );
  const trackRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [gapPx, setGapPx] = useState(0);

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  useLayoutEffect(() => {
    if (!trackRef.current) return;
    const measure = () => {
      const first = trackRef.current.querySelector("article");
      if (!first) {
        setCardWidth(0);
        setGapPx(0);
        return;
      }
      const rect = first.getBoundingClientRect();
      const w = Math.round(rect.width);
      const cs = window.getComputedStyle(trackRef.current);
      const gapStr = cs.columnGap || cs.gap || "0px";
      const gap = Math.round(parseFloat(gapStr) || 0);
      setCardWidth(w);
      setGapPx(gap);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [visibleCount]);

  return (
    <section 
      className="relative max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-20 bg-premium-cream overflow-hidden"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-black uppercase mb-3">
            Trending Collections
          </h2>
          <p className="text-text-medium text-base md:text-lg">
            New Arrivals crafted for elevated living
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <button
            onClick={prev}
            disabled={clampedIndex === 0}
            className="h-12 w-12 rounded-sm border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black disabled:cursor-not-allowed"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            disabled={clampedIndex === maxIndex}
            className="h-12 w-12 rounded-sm border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black disabled:cursor-not-allowed"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Mobile arrows */}
        <div className="md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-10">
          <button
            onClick={prev}
            disabled={clampedIndex === 0}
            className="h-10 w-10 rounded-sm border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-30"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            disabled={clampedIndex === maxIndex}
            className="h-10 w-10 rounded-sm border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-30"
            aria-label="Next"
          >
            ›
          </button>
        </div>

        <div className="overflow-hidden md:px-4">
          <div
            ref={trackRef}
            className="grid grid-flow-col auto-cols-[100%] sm:auto-cols-[85%] md:auto-cols-[calc((100%-40px)/3)] gap-6 transition-transform duration-500"
            style={{
              transform: cardWidth
                ? `translateX(-${clampedIndex * (cardWidth + gapPx)}px)`
                : `translateX(-${clampedIndex * (100 / visibleCount)}%)`,
            }}
          >
            {displayProducts && displayProducts.length > 0 ? (
              displayProducts.map((p) => {
                if (!p || !p.id) return null;
                
                return (
                  <article
                    key={p.id}
                    className="group bg-white border border-text-light/20 overflow-hidden shadow-sm hover:shadow-lg flex flex-col h-full cursor-pointer transition-all duration-300"
                    onClick={() => {
                      const productId = p.slug || p.id;
                      if (productId) {
                        navigate(`/productDetail/${productId}`);
                      }
                    }}
                  >
                    <div className="relative aspect-square overflow-hidden bg-premium-beige">
                      <img
                        src={p.image || "https://via.placeholder.com/400x300?text=No+Image"}
                        alt={p.title || "Product"}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                        }}
                      />
                      {p.badge && (
                        <span className="absolute top-3 left-3 text-xs px-2.5 py-1 bg-black text-white font-medium uppercase tracking-wider">
                          {p.badge}
                        </span>
                      )}
                      {p.discountPercent > 0 && !p.badge.includes("%") && (
                        <span className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-black text-white font-medium uppercase tracking-wider">
                          {p.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 bg-white">
                      <h3 className="text-text-dark font-semibold text-base tracking-tight group-hover:text-black transition-colors mb-1 uppercase">
                        {p.title || "Untitled Product"}
                      </h3>
                      <p className="text-text-medium text-xs mt-1 line-clamp-2 flex-1 leading-relaxed">
                        {p.description || "No description available"}
                      </p>
                      <div className="mt-3 pt-3 border-t border-text-light/20">
                        <div className="flex items-center gap-2">
                          <span className="text-black font-bold text-lg">
                            {p.price || "Price not available"}
                          </span>
                          {p.compareAtPrice && (
                            <span className="text-text-light text-xs line-through">
                              {p.compareAtPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 text-text-medium">
                <p className="text-lg">No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingNewArrivals;
