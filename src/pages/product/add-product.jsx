import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import { AddProduct } from "../../service/productAPI";

export default function AddProductPage() {
  const navigate = useNavigate();

  const handleSubmit = async (productData) => {
    try {
      console.log("Submitting product:", productData);
      const response = await AddProduct(productData);
      console.log("Product added successfully:", response);
      alert("Product added successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-premium-white rounded-2xl shadow-xl border border-luxury-light-gold p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-dark uppercase tracking-wider">Add Product</h1>
            <p className="mt-2 text-lg text-text-medium font-medium uppercase tracking-wider">
              Create a new product
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
        onSubmit={handleSubmit}
        isEditMode={false}
        submitButtonText="Add Product"
      />
    </div>
  );
}