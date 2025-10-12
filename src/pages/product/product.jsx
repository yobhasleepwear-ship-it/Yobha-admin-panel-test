import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../product/components/product-card";
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { getFilteredProducts } from "../../service/productAPI";

/**
 * Helper function to format API response data
 * Handles null checks and provides fallbacks
 */
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const formatProductData = (apiResponse) => {
  if (!apiResponse || !apiResponse.data || !apiResponse.data.items) {
    return [];
  }

  return apiResponse.data.items
    .filter(item => item && item.available !== false)
    .map(item => ({
      id: item?.id || item?.productId || Math.random().toString(),
      productId: item?.productId || item?.id || '',
      name: item?.name || 'Untitled Product',
      price: item?.price || 0,
      category: item?.category || item?.productMainCategory || '',
      images: Array.isArray(item?.images) && item.images.length > 0
        ? item.images
        : ['https://via.placeholder.com/400x400?text=No+Image'],
      available: item?.available !== false,
      productMainCategory: item?.productMainCategory || item?.category || '',
      availableColors: Array.isArray(item?.availableColors) ? item.availableColors : [],
      availableSizes: Array.isArray(item?.availableSizes) ? item.availableSizes : [],
    }));
};

const ProductsPage = () => {
  const { category } = useParams();

  // UI State
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("categories");

  // Filter State
  const [filters, setFilters] = useState({
    segment: 'all',
    categories: [],
    subCategories: [],
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured',
    country: 'IN',
  });

  // API State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 12,
    total: 0,
  });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });

  // Filter Options (can be fetched from API using setFilterOptions)
  // TODO: Replace with API call to fetch dynamic filters from backend
  // Example: useEffect(() => { fetchFilterOptions().then(setFilterOptions); }, []);
  const [filterOptions] = useState({
    segments: ["All", "Women", "Men", "Kids", "Pets", "Couple", "Family"],
    categories: [
      { id: "sleepwear", name: "Sleepwear" },
      { id: "loungewear", name: "Loungewear" },
      { id: "homewear", name: "Homewear" },
      { id: "accessories", name: "Accessories" },
    ],
    subCategories: {
      sleepwear: [
        { id: "sleepwear-sets", name: "Sleepwear Sets" },
        { id: "nightgowns", name: "Nightgowns" },
        { id: "pajama-sets", name: "Pajama Sets" },
        { id: "robes", name: "Robes & Kaftans" },
      ],
      loungewear: [
        { id: "coord-sets", name: "Co-ord Sets" },
        { id: "lounge-pants", name: "Lounge Pants" },
        { id: "lounge-tops", name: "Lounge Tops" },
      ],
      homewear: [
        { id: "day-dresses", name: "Day Dresses" },
        { id: "casual-sets", name: "Casual Sets" },
      ],
      accessories: [
        { id: "slippers", name: "Slippers" },
        { id: "scrunchies", name: "Hair Scrunchies" },
        { id: "eye-masks", name: "Eye Masks" },
      ],
    },
    sortOptions: [
      { id: "featured", name: "Featured" },
      { id: "price-low", name: "Price: Low to High" },
      { id: "price-high", name: "Price: High to Low" },
      { id: "newest", name: "Newest First" },
      { id: "popular", name: "Most Popular" },
    ],
  });
  useEffect(() => {
    const debouncedFilterUpdate = debounce(() => {
      setFilters(prev => ({
        ...prev,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      }));
    }, 600);

    debouncedFilterUpdate();

  }, [priceRange]);
  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const payload = {
        q: 'night',
        category: filters.categories.length > 0 ? filters.categories.join(',') : '',
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        sort: filters.sortBy,
        country: filters.country,
      };

      // Remove undefined values
      Object.keys(payload).forEach(key =>
        payload[key] === undefined && delete payload[key]
      );

      const response = await getFilteredProducts(payload);

      if (response && response.success && response.data) {
        // const formattedProducts = formatProductData({
        //   "success": true,
        //   "status": 200,
        //   "message": "OK",
        //   "data": {
        //     "pageNumber": 1,
        //     "pageSize": 12,
        //     "total": 2,
        //     "items": [
        //       {
        //         "id": "68ea9382034b313e6da0d974",
        //         "productId": "PID10017",
        //         "name": "Satin Pyjama Set",
        //         "price": 2199.00,
        //         "category": "Pyjamas",
        //         "images": [
        //           "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800"
        //         ],
        //         "available": true,
        //         "productMainCategory": "Sleepwear",
        //         "availableColors": [
        //           "Black"
        //         ],
        //         "availableSizes": [
        //           "L"
        //         ]
        //       },
        //       {
        //         "id": "68ea9364034b313e6da0d972",
        //         "productId": "PID10015",
        //         "name": "Luxe Cotton Nightshirt",
        //         "price": 1299.00,
        //         "category": "Nightwear",
        //         "images": [
        //           "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
        //         ],
        //         "available": true,
        //         "productMainCategory": "Sleepwear",
        //         "availableColors": [
        //           "Navy Blue"
        //         ],
        //         "availableSizes": [
        //           "S"
        //         ]
        //       }
        //     ]
        //   },
        //   "errors": null,
        //   "pagination": null
        // });
        setProducts(response.data.items);


        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
      // const formattedProducts = formatProductData({
      //   "success": true,
      //   "status": 200,
      //   "message": "OK",
      //   "data": {
      //     "pageNumber": 1,
      //     "pageSize": 12,
      //     "total": 2,
      //     "items": [
      //       {
      //         "id": "68ea9382034b313e6da0d974",
      //         "productId": "PID10017",
      //         "name": "Satin Pyjama Set",
      //         "price": 2199.00,
      //         "category": "Pyjamas",
      //         "images": [
      //           "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800"
      //         ],
      //         "available": true,
      //         "productMainCategory": "Sleepwear",
      //         "availableColors": [
      //           "Black"
      //         ],
      //         "availableSizes": [
      //           "L"
      //         ]
      //       },
      //       {
      //         "id": "68ea9364034b313e6da0d972",
      //         "productId": "PID10015",
      //         "name": "Luxe Cotton Nightshirt",
      //         "price": 1299.00,
      //         "category": "Nightwear",
      //         "images": [
      //           "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
      //         ],
      //         "available": true,
      //         "productMainCategory": "Sleepwear",
      //         "availableColors": [
      //           "Navy Blue"
      //         ],
      //         "availableSizes": [
      //           "S"
      //         ]
      //       }
      //     ]
      //   },
      //   "errors": null,
      //   "pagination": null
      // });
      // setProducts(formattedProducts);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, filters.categories, filters.sortBy, pagination.pageNumber, priceRange,filters.country]);

  // Handle filter changes
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  };

  const toggleCategory = (categoryId) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    updateFilter('categories', newCategories);
  };

  const clearAllFilters = () => {
    setFilters({
      segment: 'all',
      categories: [],
      subCategories: [],
      minPrice: '',
      maxPrice: '',
      sortBy: 'featured',
      country: 'IN',
    });
  };

  const hasActiveFilters =
    filters.segment !== 'all' ||
    filters.categories.length > 0 ||
    filters.subCategories.length > 0;

  // Get category name helper
  const getCategoryName = (id) => {
    return filterOptions.categories.find(cat => cat.id === id)?.name || id;
  };

  // Toggle accordion
  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  // Accordion Component - Minimal Gucci-style
  const FilterAccordion = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-text-light/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-6 hover:bg-black/[0.02] transition-colors duration-200"
      >
        <span className="text-black text-sm uppercase tracking-widest font-medium">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-black" strokeWidth={1.5} />
        ) : (
          <ChevronDown size={16} className="text-text-medium" strokeWidth={1.5} />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );

  // Filter Sidebar Component
  const FilterSidebar = ({ showHeader = true }) => (
    <div className="bg-white overflow-hidden">
      {showHeader && (
        <div className="px-6 py-5 border-b border-text-light/10 flex items-center justify-between">
          <h2 className="text-black text-sm uppercase tracking-widest font-medium">
            Filters
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-black hover:text-text-medium font-medium uppercase tracking-wider underline transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Gender & Type */}
      <FilterAccordion
        title="Gender & Type"
        isOpen={openAccordion === "gender"}
        onToggle={() => toggleAccordion("gender")}
      >
        <div className="space-y-3">
          {filterOptions.segments.map((segment) => (
            <label
              key={segment}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="segment"
                checked={filters.segment === segment.toLowerCase()}
                onChange={() => updateFilter('segment', segment.toLowerCase())}
                className="w-4 h-4 border border-text-light text-black focus:ring-1 focus:ring-black cursor-pointer"
              />
              <span className={`ml-3 text-sm tracking-wide transition-colors ${filters.segment === segment.toLowerCase()
                ? "text-black font-medium"
                : "text-text-medium group-hover:text-black"
                }`}>
                {segment}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      {/* Categories */}
      {/* <FilterAccordion
        title="Category"
        isOpen={openAccordion === "categories"}
        onToggle={() => toggleAccordion("categories")}
      >
        <div className="space-y-3">
          {filterOptions.categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="w-4 h-4 border border-text-light text-black focus:ring-1 focus:ring-black cursor-pointer rounded-none"
              />
              <span className={`ml-3 text-sm tracking-wide transition-colors ${filters.categories.includes(cat.id)
                ? "text-black font-medium"
                : "text-text-medium group-hover:text-black"
                }`}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion> */}

      {/* Sort */}
      <FilterAccordion
        title="Sort By"
        isOpen={openAccordion === "sort"}
        onToggle={() => toggleAccordion("sort")}
      >
        <div className="space-y-3">
          {filterOptions.sortOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="sortBy"
                checked={filters.sortBy === option.id}
                onChange={() => updateFilter('sortBy', option.id)}
                className="w-4 h-4 border border-text-light text-black focus:ring-1 focus:ring-black cursor-pointer"
              />
              <span className={`ml-3 text-sm tracking-wide transition-colors ${filters.sortBy === option.id
                ? "text-black font-medium"
                : "text-text-medium group-hover:text-black"
                }`}>
                {option.name}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>
      <FilterAccordion
        title="Price Range"
        isOpen={openAccordion === "price"}
        onToggle={() => toggleAccordion("price")}
      >
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange.min}</span>
            <span>₹{priceRange.max}</span>
          </div>

          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                min: Math.min(Number(e.target.value), prev.max - 1000),
              }))
            }
            className="w-full accent-black cursor-pointer"
          />

          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                max: Math.max(Number(e.target.value), prev.min + 1000),
              }))
            }
            className="w-full accent-black cursor-pointer"
          />
        </div>
      </FilterAccordion>
      <FilterAccordion
        title="Country"
        isOpen={openAccordion === "country"}
        onToggle={() => toggleAccordion("country")}
      >
        <div className="space-y-3 mt-2">
          {["IN", "SA", "AE"].map((code) => {
            const countryNames = { IN: "India", SA: "Saudi Arabia", AE: "UAE" };
            return (
              <label
                key={code}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="country"
                  checked={filters.country === code}
                  onChange={() => setFilters((prev) => ({ ...prev, country: code }))}
                  className="w-4 h-4 border border-gray-400 text-black focus:ring-1 focus:ring-black cursor-pointer"
                />
                <span
                  className={`ml-3 text-sm tracking-wide transition-colors ${filters.country === code
                      ? "text-black font-medium"
                      : "text-gray-600 group-hover:text-black"
                    }`}
                >
                  {countryNames[code]}
                </span>
              </label>
            );
          })}
        </div>
      </FilterAccordion>



    </div>
  );

  return (
    <div
      className="min-h-screen bg-premium-cream"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Filter Sidebar - Opens from left */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          ></div>

          <div className="absolute left-0 top-0 bottom-0 w-80 md:w-96 bg-white shadow-2xl overflow-y-auto animate-slideInLeft">
            <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-text-light/20">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-black uppercase tracking-wider text-sm">
                  Filters
                </h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-black hover:text-text-medium transition-colors"
                  aria-label="Close filters"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    clearAllFilters();
                    setShowMobileFilters(false);
                  }}
                  className="mt-3 text-xs text-black hover:text-text-medium font-medium uppercase tracking-wider underline"
                >
                  Clear All
                </button>
              )}
            </div>
            <FilterSidebar showHeader={false} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-12">

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black uppercase tracking-wide mb-3">
            {category ? `${category} Collection` : "All Products"}
          </h1>
          <p className="text-text-medium text-base md:text-lg">
            Timeless essentials crafted for serene nights and refined comfort
          </p>
        </div>

        {/* Filter Button & Product Count */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-text-light/20">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 text-black hover:text-text-medium transition-colors group"
          >
            <SlidersHorizontal size={18} strokeWidth={1.5} />
            <span className="uppercase text-sm tracking-wider font-medium border-b-2 border-black group-hover:border-text-medium transition-colors">
              Filters
            </span>
          </button>
          <div className="text-text-medium text-sm uppercase tracking-wider">
            {products.length} Product{products.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {filters.segment !== 'all' && (
              <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 text-xs uppercase tracking-wider">
                <span>{filters.segment}</span>
                <button
                  onClick={() => updateFilter('segment', 'all')}
                  className="hover:bg-white/20 transition-colors"
                  aria-label="Remove segment filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {filters.categories.map((catId) => (
              <div key={catId} className="inline-flex items-center gap-2 border border-text-light text-black px-3 py-1.5 text-xs uppercase tracking-wider font-medium">
                <span>{getCategoryName(catId)}</span>
                <button
                  onClick={() => toggleCategory(catId)}
                  className="hover:bg-black/5 transition-colors"
                  aria-label={`Remove ${getCategoryName(catId)} filter`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={clearAllFilters}
              className="text-xs text-black hover:text-text-medium font-medium underline uppercase tracking-wider"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-premium-beige border-t-black rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-medium text-sm uppercase tracking-wider">Loading...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 border-2 border-text-light/20 flex items-center justify-center">
                <span className="text-4xl text-text-light">✕</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-3 uppercase tracking-wider">
                No Products Found
              </h3>
              <p className="text-text-medium mb-8">
                Try adjusting your filters to find what you're looking for
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="bg-black text-white px-8 py-3 font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;
