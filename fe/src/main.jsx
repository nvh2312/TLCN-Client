import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import "./styles/index.scss";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { FacebookProvider, CustomChat } from "react-facebook";
import { pageId, appId } from "./config";
import store from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer></ToastContainer>
      <FacebookProvider appId={appId} chatSupport>
        <CustomChat pageId={pageId} minimized={true} />
      </FacebookProvider>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
