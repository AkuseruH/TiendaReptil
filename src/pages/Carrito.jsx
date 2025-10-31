import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { getCartItems, removeFromCart } from "../supabase/cartService";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data?.user;
      setUser(u);
      if (u) {
        const cartItems = await getCartItems(u.id);
        setItems(cartItems);
      }
    });
  }, []);

  const total = items.reduce(
    (acc, item) => acc + item.products.price * item.quantity,
    0
  );

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
    const updated = items.filter((i) => i.id !== itemId);
    setItems(updated);
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { items, total } });
  };

  if (!user)
    return (
      <p>
        Debes <Link to="/login">iniciar sesión</Link> para ver tu carrito.
      </p>
    );

  if (items.length === 0) return <p>Tu carrito está vacío 🦎</p>;

  return (
    <div>
      <h2>🛒 Tu carrito</h2>
      {items.map((item) => (
        <div key={item.id}>
          <p>
            {item.products.name} — {item.quantity} × ${item.products.price}
          </p>
          <button onClick={() => handleRemove(item.id)}>❌ Quitar</button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={handleCheckout}>Proceder al pago</button>
    </div>
  );
};

export default Cart;
