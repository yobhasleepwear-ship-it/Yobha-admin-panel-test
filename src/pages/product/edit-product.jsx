import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import { GetProductById, UpdateProduct } from "../../service/product-upload";

export default function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const product = await GetProductById(productId);
        setProductData(product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (updatedProductData) => {
    try {
      console.log("Updating product:", updatedProductData);
      const response = await UpdateProduct(productId, updatedProductData);
      console.log("Product updated successfully:", response);
      alert("Product updated successfully!");
      navigate("/products"); // Navigate back to products list
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading product data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Product not found</div>
      </div>
    );
  }

  return (
    <ProductForm
      initialData={productData}
      onSubmit={handleSubmit}
      isEditMode={true}
      submitButtonText="Update Product"
    />
  );
}