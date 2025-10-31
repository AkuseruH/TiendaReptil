import { useEffect, useState } from "react";
// 🚨 Importar useNavigate de react-router-dom
import { useNavigate } from "react-router-dom"; 
import { supabase } from "../supabase/client";
import ProductCard from "../components/ProductCard";
import styles from "./Home.module.css"; 

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // 🚨 Inicializar useNavigate

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    // Usamos la tabla "products" para consistencia
    const { data, error } = await supabase.from("products").select("*").eq("is_active", true);
    if (error) console.error("Error cargando productos:", error);
    else setProducts(data);
  }

  // 🚨 Función que navega a la ruta del catálogo
  const goToCatalog = () => {
    // Asegúrate de que '/catalogo' sea la ruta correcta definida en tu router
    navigate('/catalogo'); 
  };

  return (
    <div style={{ padding: "0 2rem" }}>
      
      {/* 1. SECCIÓN PRINCIPAL (HERO) */}
      <div className={styles.heroContainer}>
        <h1 className={styles.heroTitle}>
          EL REINO ESCAMADO 🐍
        </h1>
        <p className={styles.heroSubtitle}>
          Encuentra a tu nuevo compañero exótico. Expertos en iguanas, geckos y serpientes de la más alta calidad y cuidado.
        </p>
        <button 
          className={styles.heroButton}
          onClick={goToCatalog} // 🚨 Llama a la función de navegación
        >
          Ver Catálogo Completo
        </button>
      </div>

      {/* 2. MENSAJES CLAVE (FEATURES) */}
      <div className={styles.featuresContainer}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>✅</div>
          <h4>Garantía de Salud</h4>
          <p>Todos nuestros reptiles pasan por chequeos veterinarios rigurosos.</p>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>🚚</div>
          <h4>Envío Seguro</h4>
          <p>Transporte especializado para garantizar la llegada segura de tu mascota.</p>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>📞</div>
          <h4>Soporte Experto</h4>
          <p>Asesoría gratuita de por vida para el cuidado de tu nuevo reptil.</p>
        </div>
      </div>

      <hr style={{ borderTop: '1px solid #ccc', margin: '4rem 0 3rem' }} />

    </div>
  );
}

export default Home;
