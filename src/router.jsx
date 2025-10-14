import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./comman/app-layout/app-layout";
import Signup from "./pages/signUp/sign-up";

// PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

// Lazy load pages
const AddProduct = lazy(() => import("./pages/product/add-product"));
const EditProduct = lazy(() => import("./pages/product/edit-product"));
const Products = lazy(() => import("./pages/products/products"));

const Router = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public Route */}
        <Route path="/signup" element={<Signup />} />

        {/* Root redirect based on token */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/products" replace />
            ) : (
              <Navigate to="/signup" replace />
            )
          }
        />

        {/* Private Routes */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AppLayout>
                <Products />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AppLayout>
                <AddProduct />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-product/:productId"
          element={
            <PrivateRoute>
              <AppLayout>
                <EditProduct />
              </AppLayout>
            </PrivateRoute>
          }
        />

        {/* Catch-all unknown routes */}
        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/products" replace />
            ) : (
              <Navigate to="/signup" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  );
};

export default Router;
