import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanel.module.css";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
  });
  const navigate = useNavigate();

  // 🧑‍💻 Verificar si el usuario es admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email !== "admin@tiendareptil.com") {
        navigate("/"); // Redirigir si no es admin
      }
    };
    checkAdmin();
  }, [navigate]);

  // 📦 Obtener productos
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error(error);
    else setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ Agregar producto
  const addProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("products").insert([newProduct]);
    if (error) alert("Error al agregar producto: " + error.message);
    else {
      alert("✅ Producto agregado con éxito");
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: "",
        category_id: "",
      });
      fetchProducts();
    }
  };

  // ✏️ Editar producto
  const updateProduct = async (id, field, value) => {
    const { error } = await supabase
      .from("products")
      .update({ [field]: value })
      .eq("id", id);
    if (error) console.error("Error al actualizar:", error);
    else fetchProducts();
  };

  // ❌ Eliminar producto
  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert("Error al eliminar: " + error.message);
    else fetchProducts();
  };

  return (
    <div className={styles.panelContainer}>
      <h1 className={styles.title}>🦎 Panel de Administración</h1>

      {/* 🔹 Botón para ir a pedidos */}
      <div className={styles.actions}>
        <button
          className={styles.ordersButton}
          onClick={() => navigate("/admin/pedidos")}
        >
          📦 Ver pedidos
        </button>
      </div>

      {/* 🔹 Agregar nuevo producto */}
      <form className={styles.form} onSubmit={addProduct}>
        <h2>Agregar nuevo producto</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Precio"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="URL de imagen"
          value={newProduct.image_url}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image_url: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="ID de categoría"
          value={newProduct.category_id}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category_id: e.target.value })
          }
        />
        <button type="submit">Agregar producto</button>
      </form>

      {/* 🔹 Lista de productos */}
      <h2 className={styles.subtitle}>Lista de productos</h2>
      <div className={styles.productList}>
        {products.map((p) => (
          <div key={p.id} className={styles.card}>
            <img src={p.image_url} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <label>
              Precio:
              <input
                type="number"
                value={p.price}
                onChange={(e) => updateProduct(p.id, "price", e.target.value)}
              />
            </label>
            <label>
              Stock:
              <input
                type="number"
                value={p.stock}
                onChange={(e) => updateProduct(p.id, "stock", e.target.value)}
              />
            </label>
            <button onClick={() => deleteProduct(p.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;

