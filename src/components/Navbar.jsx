import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    getUser();

    // 🔁 Detectar cambios en sesión (por si inicia/cierra sesión en otra parte)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  const isAdmin = user?.email === "admin@tiendareptil.com";

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>🐍 Tienda de Reptiles</h1>
      <div className={styles.links}>
        <Link to="/">Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/carrito">Carrito 🛒</Link>

        {isAdmin && <Link to="/admin">Panel Admin</Link>}

        {user ? (
          <>
            <span>👤 {user.email}</span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/signup">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
