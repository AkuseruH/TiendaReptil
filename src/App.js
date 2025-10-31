import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Catalogo from "./components/Catalogo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { CartProvider } from "./components/CartContext";
import styles from "./App.module.css";
import Cart from "./pages/Carrito";
import AdminPanel from "./pages/AdminPanel";
import Checkout from "./pages/Checkout";
import OrdersAdmin from "./pages/OrdersAdmin";


function App() {
  return (
    <CartProvider>
      <Router>
        <div className={styles.appContainer}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} /> 
            <Route path="/admin/pedidos" element={<OrdersAdmin />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;