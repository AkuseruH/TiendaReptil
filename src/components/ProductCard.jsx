import React from "react";
import { addToCart } from "../supabase/cartService";
import { supabase } from "../supabase/client";

const ProductCard = ({ product }) => {
  const handleAddToCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Debes iniciar sesión para añadir al carrito.");
      return;
    }
    await addToCart(user.id, product.id, 1);
    alert(`${product.name} añadido al carrito 🛒`);
  };

  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>Stock: {product.stock}</p>
      <button onClick={handleAddToCart}>Añadir al carrito</button>
    </div>
  );
};

export default ProductCard;

