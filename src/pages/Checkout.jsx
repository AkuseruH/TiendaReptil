import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { clearCart, getOrCreateCart } from "../supabase/cartService";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleConfirmPayment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Inicia sesión");

    const total = state.total;

    const { data: order } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total, status: "pagado" })
      .select()
      .single();

    for (const item of state.items) {
      await supabase.from("order_items").insert({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price: item.products.price,
      });

      // 🔻 Reducir stock
      const newStock = item.products.stock - item.quantity;
      await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.products.id);
    }

    const cart = await getOrCreateCart(user.id);
    await clearCart(cart.id);

    alert("✅ Pago confirmado. Pedido realizado.");
    navigate("/");
  };

  return (
    <div>
      <h2>💳 Confirmar pedido</h2>
      <p>Total a pagar: ${state.total.toFixed(2)}</p>
      <button onClick={handleConfirmPayment}>Pagar (simulado)</button>
    </div>
  );
};

export default Checkout;