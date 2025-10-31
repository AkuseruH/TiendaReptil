import React, { useState } from "react";
import { supabase } from "../supabase/client";
import styles from "./Auth.module.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage("✅ Revisa tu correo para confirmar el registro.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSignup} className={styles.form}>
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
        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Registrarse"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
