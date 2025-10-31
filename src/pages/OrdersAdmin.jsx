import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import styles from "./OrdersAdmin.module.css";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🔐 UID del Administrador de la captura de tu tabla 'orders'
  const ADMIN_UID = "404abf2f-7efe-4ef8-8d40-19116492c53f";

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;
      setUser(currentUser);

      // 🚨 Verificación de acceso por UID, más robusta que por email
      if (!currentUser || currentUser.id !== ADMIN_UID) {
        setLoading(false);
        return;
      }

      // Consulta simplificada (si ya está funcionando, podemos reintroducir las uniones)
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          total,
          status,
          created_at,
          user_id
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar pedidos:", error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    // ... (Tu función updateStatus original)
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;

  // Mensaje de error ajustado para UID
  if (!user || user.id !== ADMIN_UID)
    return <p>❌ No tienes permiso para ver esta página.</p>;

  return (
    <div className={styles.container}>
      <h2>📦 Panel de Pedidos (Revisión de JS)</h2>
      {orders.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <h3>Pedido #{order.id}</h3>
              <p>
                <strong>ID de Usuario:</strong> {order.user_id}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> ${order.total}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span className={styles.status}>{order.status}</span>
              </p>
              <div className={styles.actions}>
                <button onClick={() => updateStatus(order.id, "pagado")}>
                  💳 Marcar como Pagado
                </button>
                <button onClick={() => updateStatus(order.id, "enviado")}>
                  🚚 Marcar como Enviado
                </button>
                <button onClick={() => updateStatus(order.id, "completado")}>
                  ✅ Completar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;