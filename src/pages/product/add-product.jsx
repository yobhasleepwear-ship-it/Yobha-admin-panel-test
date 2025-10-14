import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import { AddProduct } from "../../service/product-upload";

export default function AddProductPage() {
  const navigate = useNavigate();

  const handleSubmit = async (productData) => {
    try {
      console.log("Submitting product:", productData);
      const response = await AddProduct(productData);
      console.log("Product added successfully:", response);
      alert("Product added successfully!");
      navigate("/products"); // Navigate to products list
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isEditMode={false}
      submitButtonText="Add Product"
    />
  );
}

