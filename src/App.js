import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import "./App.css";
import AxiosInterceptorProvider from "./interceptors/axiosInterceptorProvider";
import { store } from "./redux/store";
import { Provider, useDispatch } from "react-redux";
import { getCartDetails } from "./service/productAPI";
import { setCartCount } from "./redux/cartSlice"; // assume you have this action
import ToastContainer from "./comman/toster-message/ToastContainer";

function AppContent() {
  const dispatch = useDispatch();

  const fetchCart = async () => {
    try {
      const response = await getCartDetails();
      const count = response.data.items.length;
      console.log("Cart items:", count);
      dispatch(setCartCount(count)); // dispatch action with payload
    } catch (err) {
      console.log(err || "something went wrong");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return <Router />;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AxiosInterceptorProvider>
          <AppContent />
          <ToastContainer />
        </AxiosInterceptorProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
