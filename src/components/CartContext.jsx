import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase/client";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
  }, []);

  const addToCart = async (product) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    let { data: cartData } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Crear carrito si no existe
    if (!cartData) {
      const { data: newCart } = await supabase
        .from("carts")
        .insert({ user_id: user.id })
        .select()
        .single();
      cartData = newCart;
    }

    // Insertar item
    await supabase.from("cart_items").insert({
      cart_id: cartData.id,
      product_id: product.id,
      quantity: 1,
    });

    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = async (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
    if (user) {
      const { data: userCart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (userCart) {
        await supabase
          .from("cart_items")
          .delete()
          .eq("cart_id", userCart.id)
          .eq("product_id", productId);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      const { data: userCart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (userCart) {
        await supabase.from("cart_items").delete().eq("cart_id", userCart.id);
      }
    }
  };

  const checkout = async () => {
    if (!user) return alert("Debes iniciar sesión para confirmar el pedido");
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: order } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total, status: "pendiente" })
      .select()
      .single();

    for (const item of cart) {
      await supabase.from("order_items").insert({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    await clearCart();
    alert("✅ Pedido registrado correctamente.");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);