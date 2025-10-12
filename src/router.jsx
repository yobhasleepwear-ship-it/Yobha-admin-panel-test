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
const Home = lazy(() => import("./pages/coming-soon/comingSoon"));
const AddProduct = lazy(() => import("./pages/product/add-product"));
// const EditProduct = lazy(() => import("./pages/product/edit-product"));
// const Orders = lazy(() => import("./pages/orders/orders"));

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
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/signup" replace />
            )
          }
        />

        {/* Private Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <AppLayout>
                <Home />
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
        {/* <Route
          path="/edit-product"
          element={
            <PrivateRoute>
              <AppLayout>
                <EditProduct />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <AppLayout>
                <Orders />
              </AppLayout>
            </PrivateRoute>
          }
        /> */}

        {/* Catch-all unknown routes */}
        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/home" replace />
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
