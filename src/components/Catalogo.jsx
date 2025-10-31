import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useCart } from "./CartContext";
import styles from "./Catalogo.module.css";

const Catalogo = () => {
  const [reptiles, setReptiles] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchReptiles = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error al obtener reptiles:", error);
      } else {
        setReptiles(data);
      }
    };
    fetchReptiles();
  }, []);

  return (
    <div className={styles.catalogoContainer}>
      <h2 className={styles.title}>Catálogo de Reptiles</h2>
      <div className={styles.grid}>
        {reptiles.map((reptil) => (
          <div key={reptil.id} className={styles.card}>
            <img
              src={reptil.image_url}
              alt={reptil.name}
              className={styles.image}
            />
            <h3>{reptil.name}</h3>
            <p>{reptil.description}</p>
            <p className={styles.precio}>${reptil.price}</p>
            <button onClick={() => addToCart(reptil)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;