🦎 Tienda de Reptiles Exóticos (con Supabase)

Proyecto de E-commerce desarrollado con React y Supabase, enfocado en la venta de reptiles, garantizando seguridad y escalabilidad mediante el uso avanzado de Políticas de Seguridad a Nivel de Fila (RLS).


1. Configuración Local y Ejecución
Sigue estos pasos para levantar la aplicación en tu entorno de desarrollo.

Requisitos:
  - Node.js (versión 18 o superior)
  - Git
  - Una cuenta activa en Supabase.
Pasos:
  - Clonar el Repositorio:
    git clone https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories
    cd tienda-de-reptiles
  - Instalar Dependencias:
    npm install
  - Configurar Variables de Entorno: Añade las siguientes variables, reemplazando los corchetes con tus claves de Supabase:
   # Variables de Entorno
      REACT_APP_SUPABASE_URL="[TU_URL_DEL_PROYECTO_SUPABASE]"
      REACT_APP_SUPABASE_ANON_KEY="[TU_CLAVE_ANON_PUBLIC_SUPABASE]"
  - Iniciar la Aplicación:
    npm start
La aplicación se abrirá en tu navegador en http://localhost:3000.


2. Arquitectura y Stack Tecnológico

Componente                  Tecnología                Uso Principal
Frontend(UI)                React.js                  Interfaz de usuario dinámica y gestión de estados.
Estilos                     CSS Modules               Estilos encapsulados para evitar conflictos globales.
Base de Datos / Backend     Supabase (PostgreSQL)     Base de datos relacional, Auth (Autenticación), y RLS.
Routing                     React Router DOM          Navegación entre las vistas de Inicio, Catálogo, Carrito y Panel Admin.


4. Usuarios de Prueba
Utiliza estos usuarios para validar los diferentes roles y escenarios de RLS.

Rol                 Correo Electrónico            ContraseñaUID                           
Administrador       admin@tiendareptil.com        404abf2f-7efe-4ef8-8d40-19116492c53f
Cliente Estándar    cliente@test.com              test12349fe9399e-ffl0-4f


5. Políticas de RLS Clave (Seguridad)
La seguridad se basa en permitir acciones solo si el auth.uid() (ID del usuario logueado) coincide con el propietario del recurso, con una excepción clave para el Administrador.

Tabla          Política (Extracto SQL)                                            Función de Seguridad

orders          USING ( (auth.uid() = user_id) OR (auth.uid() = '404ab-...')      Visibilidad de Pedidos: Permite a los                                                                                           clientes ver SÓLO sus pedidos, O al                                                                                             Administrador ver TODOS los pedidos.

carts          FOR ALL USING (auth.uid() = user_id)                               Aislamiento de Carritos: Garantiza que un                                                                                       usuario solo pueda leer, actualizar o e                                                                                         liminar SU propio carrito y sus items.

products       FOR SELECT USING (is_active = true)                                Visibilidad Pública: Permite a CUALQUIER                                                                                        usuario (autenticado o no) ver solo los                                                                                         productos que estén marcados como activos.

products       FOR ALL USING (auth.uid() = '404abf2f-...')                        Control Admin: Da control total (CREATE,                                                                                        UPDATE, DELETE) al administrador sobre la                                                                                       tabla de productos.
