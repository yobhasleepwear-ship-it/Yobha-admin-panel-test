import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetAllProducts, DeleteProduct } from "../../service/product-upload";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await GetAllProducts();
      console.log("=== API DEBUG INFO ===");
      console.log("Raw API Response:", productsData);
      console.log("Response Type:", typeof productsData);
      console.log("Is Array:", Array.isArray(productsData));
      console.log("Response Keys:", productsData ? Object.keys(productsData) : "No keys");
      console.log("=======================");
      
      // Handle different possible response formats
      let productsArray = [];
      if (Array.isArray(productsData)) {
        productsArray = productsData;
      } else if (productsData && Array.isArray(productsData.data)) {
        productsArray = productsData.data;
      } else if (productsData && Array.isArray(productsData.products)) {
        productsArray = productsData.products;
      } else if (productsData && typeof productsData === 'object') {
        // If it's a single product object, wrap it in an array
        productsArray = [productsData];
      } else {
        console.warn("Unexpected API response format:", productsData);
        productsArray = [];
      }
      
      setProducts(productsArray);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please check your API connection.");
      
      // Set empty array to prevent map error
      setProducts([]);
      
      // Optional: Show a more helpful message
      console.log("API Error Details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await DeleteProduct(productId);
        setProducts(products.filter(product => product._id !== productId));
        alert("Product deleted successfully!");
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product");
      }
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'object' && price.$numberDecimal) {
      return `₹${parseFloat(price.$numberDecimal).toFixed(2)}`;
    }
    return `₹${price?.toFixed(2) || '0.00'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <Link
            to="/add-product"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add New Product
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={fetchProducts}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto min-h-screen"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black uppercase tracking-wider">Products</h1>
        <Link
          to="/add-product"
          className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-text-dark transition-colors uppercase tracking-wider text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-luxury-gold w-full sm:w-auto text-center"
        >
          Add New Product
        </Link>
      </div>

      {!Array.isArray(products) || products.length === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <div className="text-text-medium text-lg sm:text-xl mb-4 sm:mb-6">No products found</div>
          <Link
            to="/add-product"
            className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-text-dark transition-colors uppercase tracking-wider text-xs sm:text-sm font-semibold"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-premium-white rounded-lg shadow-lg overflow-hidden border border-text-light/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-premium-beige">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Product
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Price
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-premium-white divide-y divide-text-light/20">
                {Array.isArray(products) && products.map((product) => (
                  <tr key={product._id} className="hover:bg-premium-beige transition-colors duration-300">
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12">
                          {product.Images && product.Images.length > 0 ? (
                            <img
                              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg object-cover"
                              src={product.Images[0].ThumbnailUrl || product.Images[0].Url}
                              alt={product.Name}
                            />
                          ) : (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-2 sm:ml-3 md:ml-4 min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {product.Name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 truncate">
                            {product.ProductId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-gray-900">
                        {product.ProductMainCategory} / {product.ProductCategory}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {product.ProductSubCategory}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-gray-900">
                        {formatPrice(product.Price)}
                      </div>
                      {product.CompareAtPrice && (
                        <div className="text-xs sm:text-sm text-gray-500 line-through">
                          {formatPrice(product.CompareAtPrice)}
                        </div>
                      )}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-gray-900">
                        {product.Inventory && product.Inventory.length > 0
                          ? product.Inventory.reduce((total, item) => total + (item.Quantity || 0), 0)
                          : product.Variants && product.Variants.length > 0
                          ? product.Variants.reduce((total, variant) => total + (variant.Quantity || 0), 0)
                          : 0
                        }
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {formatDate(product.CreatedAt)}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1 sm:space-x-2">
                          <Link
                            to={`/edit-product/${product._id}`}
                            className="text-black hover:text-luxury-gold bg-premium-beige px-2 sm:px-3 py-1 rounded-md hover:bg-luxury-light-gold transition-colors text-xs sm:text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-800 bg-red-50 px-2 sm:px-3 py-1 rounded-md hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
