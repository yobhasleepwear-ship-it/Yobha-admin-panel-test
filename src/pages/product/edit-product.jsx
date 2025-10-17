import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import { GetProductById, UpdateProduct } from "../../service/productAPI";

export default function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("=== FETCHING PRODUCT DATA ===");
      console.log("Product ID:", productId);
      
      const response = await GetProductById(productId);
      console.log("=== PRODUCT API RESPONSE ===");
      console.log("Raw response:", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", response ? Object.keys(response) : "No response");
      
      // Log the full response structure
      if (response) {
        console.log("Full response structure:", JSON.stringify(response, null, 2));
      }
      console.log("============================");
      
      // Handle different possible response formats
      let product = null;
      if (response && response.data) {
        product = response.data;
        console.log("✅ Using response.data as product");
      } else if (response && !response.data) {
        product = response;
        console.log("✅ Using response directly as product");
      } else {
        console.log("❌ No valid product data found");
      }
      
      if (product) {
        console.log("Setting product data:", product);
        setProductData(product);
      } else {
        console.log("❌ Product not found");
        setError("Product not found");
      }
    } catch (err) {
      console.error("❌ Error fetching product:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      setError("Failed to fetch product details. Please try again.");
    } finally {
      setLoading(false);
      console.log("=== PRODUCT FETCH COMPLETED ===");
    }
  };

  const handleSubmit = async (updatedProductData) => {
    try {
      console.log("Updating product:", productId, updatedProductData);
      
      const response = await UpdateProduct(productId, updatedProductData);
      console.log("Product updated successfully:", response);
      
      alert("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
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
            <div className="mt-4 space-x-3">
              <button
                onClick={fetchProductData}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-gray-100 px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-200"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
        <p className="text-gray-500 mb-4">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-premium-white rounded-2xl shadow-xl border border-luxury-light-gold p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-dark uppercase tracking-wider">Edit Product</h1>
            <p className="mt-2 text-lg text-text-medium font-medium uppercase tracking-wider">
              Update product information
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="bg-text-dark hover:bg-luxury-gold text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Back to Products
          </button>
        </div>
      </div>

      {/* Product Form */}
      <ProductForm
        initialData={productData}
        onSubmit={handleSubmit}
        isEditMode={true}
        submitButtonText="Update Product"
      />
    </div>
  );
}