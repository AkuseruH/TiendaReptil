import React, { useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMsg("❌ Usuario o contraseña incorrectos");
    } else {
      navigate("/catalogo");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
};

export default Login;
