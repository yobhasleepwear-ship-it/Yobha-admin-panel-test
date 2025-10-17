import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { GetAllProducts, DeleteProduct } from "../../service/productAPI";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting to fetch products...");
      
      const productsData = await GetAllProducts();
      
      console.log("=== PRODUCTS API DEBUG ===");
      console.log("Raw API Response:", productsData);
      console.log("Response Type:", typeof productsData);
      console.log("Is Array:", Array.isArray(productsData));
      console.log("Response Keys:", productsData ? Object.keys(productsData) : "No keys");
      console.log("===========================");
      
      // Handle different possible response formats
      let productsArray = [];
      if (Array.isArray(productsData)) {
        productsArray = productsData;
        console.log("✅ Using productsData as array:", productsArray.length);
      } else if (productsData && productsData.data && Array.isArray(productsData.data.items)) {
        // Handle the actual API response format: { data: { items: [...] } }
        productsArray = productsData.data.items;
        console.log("✅ Using productsData.data.items:", productsArray.length);
        console.log("📊 Pagination info:", {
          page: productsData.data.page,
          pageSize: productsData.data.pageSize,
          totalCount: productsData.data.totalCount,
          totalPages: productsData.data.totalPages
        });
      } else if (productsData && Array.isArray(productsData.data)) {
        productsArray = productsData.data;
        console.log("✅ Using productsData.data:", productsArray.length);
      } else if (productsData && productsData.products && Array.isArray(productsData.products)) {
        productsArray = productsData.products;
        console.log("✅ Using productsData.products:", productsArray.length);
      } else {
        console.log("❌ No valid products array found in response");
        console.log("Available keys:", productsData ? Object.keys(productsData) : "No data");
        if (productsData && productsData.data) {
          console.log("Data keys:", Object.keys(productsData.data));
        }
      }
      
      console.log("Final products array:", productsArray);
      setProducts(productsArray);
    } catch (err) {
      console.error("Error fetching products:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(`Failed to fetch products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        setDeleteLoading(productId);
        await DeleteProduct(productId);
        alert("Product deleted successfully!");
        // Refresh the products list
        await fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product. Please try again.");
      } finally {
        setDeleteLoading(null);
      }
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchProducts}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-premium-white rounded-2xl shadow-xl border border-luxury-light-gold p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-dark uppercase tracking-wider">Products</h1>
            <p className="mt-2 text-lg text-text-medium font-medium uppercase tracking-wider">
              Manage your premium sleepwear inventory
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchProducts}
              className="bg-text-dark hover:bg-luxury-gold text-white hover:text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-luxury-gold hover:bg-luxury-warm text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-premium-white shadow-xl rounded-2xl border border-luxury-light-gold overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first product.</p>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-text-dark to-luxury-gold">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-premium-white divide-y divide-luxury-light-gold">
                {products.map((product) => (
                  <tr key={product.id || product._id} className="hover:bg-premium-cream transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.images[0]}
                              alt={product.name || product.title}
                            />
                          ) : product.imageUrl || product.image ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.imageUrl || product.image}
                              alt={product.name || product.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name || product.title || "Unnamed Product"}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {product.id || product._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.category || product.productMainCategory || "N/A"}
                      </div>
                      {product.productMainCategory && product.category !== product.productMainCategory && (
                        <div className="text-sm text-gray-500">
                          {product.productMainCategory}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.price || product.costPrice || "0.00"}
                      </div>
                      {product.salePrice && product.salePrice !== product.price && (
                        <div className="text-sm text-green-600">
                          Sale: ${product.salePrice}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stockQuantity || product.quantity || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (product.available === true || product.status === 'active' || product.isActive) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.available === true ? 'Available' : 
                         product.available === false ? 'Unavailable' :
                         product.status || (product.isActive ? 'Active' : 'Inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product.id || product._id)}
                          className="text-luxury-gold hover:text-luxury-warm p-2 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id || product._id, product.name || product.title)}
                          disabled={deleteLoading === (product.id || product._id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === (product.id || product._id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {products.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
            <div className="text-sm text-gray-500">
              Total: {products.length} products
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;