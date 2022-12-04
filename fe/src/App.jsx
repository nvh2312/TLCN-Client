import { Routes, Route } from "react-router-dom";
import React from "react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import HomePage from "./page/HomePage";
import NotFoundPage from "./page/NotFoundPage";
import SignInPage from "./page/SignInPage";
import SignUpPage from "./page/SignUpPage";
import VerifyPage from "./page/VerifyPage";
import ResetPasswordPage from "./page/ResetPasswordPage";
import ForgotPasswordPage from "./page/ForgotPasswordPage";
import UserAccount from "./module/UserProfile/UserAccount";
import UserOrder from "./module/UserProfile/UserOrder";
import UserAddress from "./module/UserProfile/UserAddress";
import DashboardLayout from "./module/dashboard/DashboardLayout";
import ProductDetail from "./page/ProductDetail";
import UpdatePassword from "./module/UserProfile/UpdatePassword";
import CartPage from "./module/cart/CartPage";
import PaymentPage from "./module/payment/PaymentPage";
import ProductFilterPage from "./page/ProductFilterPage";
import PaymentCash from "./module/payment/PaymentCash";
import PaymentBank from "./module/payment/PaymentBank";
import InformationDetailOrder from "./module/UserProfile/InformationDetailOrder";
import Navbar from "./components/navbar/Navbar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { key } from "./utils/constants/key";
import ChatStream from "./components/chat/ChatStream";

function App() {
  return (
    <>
      <PayPalScriptProvider
        options={{
          "client-id": key.ClientId,
        }}
      >
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/sign-in" element={<SignInPage />}></Route>
          <Route path="/sign-up" element={<SignUpPage />}></Route>
          <Route path="/verify" element={<VerifyPage />}></Route>
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          ></Route>
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          ></Route>
          <Route element={<DashboardLayout />}>
            <Route path="/account" element={<UserAccount />}></Route>
            <Route path="/account/orders" element={<UserOrder />}></Route>
            <Route
              path="/account/orders/:id"
              element={<InformationDetailOrder />}
            ></Route>
            <Route path="/account/address" element={<UserAddress />}></Route>
            <Route path="/account/chat" element={<ChatStream />}></Route>
            <Route
              path="/account/reset-password"
              element={<UpdatePassword />}
            ></Route>
          </Route>
          <Route element={<ProductDetail />} path="/:slug/:id"></Route>
          <Route path="/cart" element={<CartPage />}></Route>
          <Route path="/checkout" element={<PaymentPage />}></Route>
          <Route path="/product" element={<ProductFilterPage />}></Route>
          <Route path="/payment-cash" element={<PaymentCash />}></Route>
          <Route path="/payment-bank" element={<PaymentBank />}></Route>
          <Route path="/*" element={<NotFoundPage />}></Route>
        </Routes>
        <Footer />
      </PayPalScriptProvider>
    </>
  );
}

export default App;
