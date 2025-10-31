// src/supabase/cartService.js
import { supabase } from "./client";

export async function getOrCreateCart(userId) {
  const { data, error } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (data) return data;

  const { data: newCart, error: createError } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select()
    .single();

  if (createError) throw createError;
  return newCart;
}

export async function addToCart(userId, productId, quantity = 1) {
  const cart = await getOrCreateCart(userId);

  // Verificar si ya existe el producto en el carrito
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    // Actualizar cantidad (sin exceder stock)
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);

    await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", existingItem.id);
  } else {
    await supabase
      .from("cart_items")
      .insert({ cart_id: cart.id, product_id: productId, quantity });
  }
}

export async function getCartItems(userId) {
  const cart = await getOrCreateCart(userId);

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      products (id, name, price, image_url, stock)
    `)
    .eq("cart_id", cart.id);

  if (error) throw error;
  return data;
}

export async function removeFromCart(itemId) {
  await supabase.from("cart_items").delete().eq("id", itemId);
}

export async function clearCart(cartId) {
  await supabase.from("cart_items").delete().eq("cart_id", cartId);
}
