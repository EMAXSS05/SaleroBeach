# Codificación e Probas

## Codificación

## Prototipos
## Prototipo 1
## Data de entrega: 14 de abril
## Requerimientos a implementar:
 


- **RF1 - Endpoints de Carta y Comandas:** Programar la comunicación del backend para enviar productos al cliente y recibir pedidos, asegurando que cada venta quede registrada.

- **RF2 - Diseño de Modelos de Datos:** Definición de esquemas en Mongoose para productos, usuarios, mesas y pedidos, asegurando la integridad de la información.

- **RF3 - Consumo de API en el Frontend:** Configurar React para que realice peticiones al backend 
y reciba los datos correctamente, verificando que la comunicación entre ambos servicios funciona.

- **RF4 - Módulo de Gestión de Comandas y Carta Digital:**
Desarrollo de una interfaz interactiva que permite la exploración del catálogo de productos, personalización de pedidos mediante notas para la cocina y gestión del carrito de ventas en tiempo real.

- **RF5 - Carga Inicial de Datos:** Introducir en la base de datos los primeros productos, pedidos, mesas y usuarios 
del bar mediante un script de inicialización, para que la aplicación no arranque con la carta vacía.

- **RF6 - Procesamiento de Pedidos:** Funcionalidad para confirmar la comanda, registrarla en la base de datos y actualizar el estado de la mesa automáticamente.




## Innovación
Para este prototipo decidí arriesgar un poco y utilizar React y Node.js, tecnologías que no hemos visto en el ciclo, pero que ya sabía lo básico por cursos que hize por internet y más que nada por la forma en que se trabaja con react es decir con componentes porque ya veia yo que iba a tener demasiados html y con react solo tengo uno y admeñas que estas tecnologias son muy demandadas con el stack MERN. Los principales retos que tuve que resolver fueron: Al principio fue un lío pasar de la forma tradicional de programar a la lógica de componentes. El reto fue aprender a organizar la app para que, al pulsar un botón en un sitio como el mapa de las mesas, se enterase otro componente distinto como la carta sin que la página se recargase. Lo solucioné usando estados y pasando funciones entre los archivos.
Segundo reto fue pelearme con las esperas del servidor Al principio me daba errores porque intentaba usar los datos antes de que llegaran de la base de datos. Aprendí a usar async y await para que la app esperase a que el pedido se guardara de verdad antes de mandarme de vuelta al mapa de mesas.
## Pruebas
Use thunder Client que es una extension del visual que me permitió probar los endpoints.

## Prototipo 2
### Data de entrega: 05 de Mayo
### Credenciales para hacer login en la app como administrador:
**nombre de usuario: Admin_barra**\
**contraseña:** abc123.

## Funcionalidades implementadas:
- **RF1 Sistema Multimesa Dinámico:** Migración del modelo de datos de mesa única a un array de mesas, permitiendo vincular un pedido a varias ubicaciones físicas. 
- **RF2 Control de Acceso (Login):** Implementación de un sistema de autenticación centralizado que redirige automáticamente a cada usuario a su terminal correspondiente (Barra, Cocina o Camarero) según su rol asignado.
- **RF3 Panel de Gestión de Usuarios:** Interfaz exclusiva para el perfil de Barra que permite dar de alta, asignar un rol, eliminar, en el prototipo final se podrá cambiar la contraseña de estos usuarios.
- **RF4 Gestión de Mesas:** Módulo para configurar el mapa de sala, añadir una meza eligiendo el nímero la zona y la capacidad, se puede desactivar y eliminar mesas, en el prototipo final se podrá editar la capacidad de cada mesa.
- **RF5 Módulo de Unión de Mesas:** Interfaz interactiva para agrupar mesas en tiempo real en el Terminal del Camarero. 
- **RF6 Historial de Pedidos:** Registro completo de comandas finalizadas, permitiendo consultar su estado, puede ser cancelado o completado y se puede filtrar segun la fecha.
- **RF7 Terminal de Cocinero:** Se hizo la interfaz del cocinero donde solo puede visualizar los platos de comida y avisar al camarero cuando el pedido del cliente esté listo.

- **RF8 Método de pago:** Implementé un pop up para que en la barra al momento de cobrar el pedido eligiera el método de pago, ya sea en efectivo o con tarjeta.

## Pruebas
Probé el flujo completo: desde el inicio de sesión, la creación de un pedido unido, su paso por cocina y su almacenamiento final en el Historial de Pedidos, verificando que los datos se mantienen íntegros en cada paso del ciclo de vida de la comanda.

## Prototipo final 
## Data de entrega: 01 de Junio
## Funcionalidades implementadas:
- **RF1 Seguridad y Encriptación de Contraseñas (Backend):** Implementación de la librería `bcrypt` en `usuarios.js` para asegurar el cifrado hash de las contraseñas en la base de datos, eliminando por completo el almacenamiento en texto plano.
- **RF2 Migración a Base de Datos Cloud:** Migración de toda la infraestructura de datos desde un entorno local hacia **MongoDB Atlas**, garantizando la disponibilidad del servicio en red.
- **RF3 Módulo de Gestión de Productos Completo:** Interfaz CRUD que permite añadir nuevos elementos, controlar su disponibilidad en tiempo real, gestión asíncrona de imágenes y edición rápida de precios en línea directamente en la tabla.
- **RF4 Control de Flujo y Orden de Mesas:** Optimización del mapa de sala; las mesas se muestran ahora ordenadas secuencialmente por su número para facilitar el trabajo de barra y camareros.
- **RF5 Modelo de Negocio de Caja (`CajaSesion`):** Creación de un nuevo modelo de datos en MongoDB y sus rutas de API (`GET` y `POST`) para el control de apertura y cierre de cajas. El sistema valida el estado de la caja en `App.jsx` de forma global.
- **RF6 Seguridad Avanzada con JWT y CORS:** - Implementación de jsonwebtoken en el backend con variables de entorno protegidas (JWT_SECRET) y restricción del middleware de CORS para aceptar únicamente peticiones desde el origen de producción y localhost.
- **RF7 Dockerización y Variables de Entorno:** Migración de URLs estáticas (`localhost:5000`) a variable de entorno (`VITE_API_URL`). Se eliminaron credenciales expuestas en el archivo `docker-compose.yml` y se configuró correctamente la red Docker para producción.
- **RF8 Interfaz de Cocina Avanzada:** Modificación de la función `confirmarPedido` para que los cocineros puedan marcar de manera interactiva e individual los platos de comida que ya han sido terminados.
- **RF9 Sistema de Impresión de Tickets en Barra:** Incorporación de botones específicos en el Header para la generación y simulación de impresión de facturas simplificadas (tickets de 80mm) y comandas internas.
- **RF10 Flujo de Cierre de Caja Integrado:** Automatización del flujo de trabajo donde el botón de cierre de caja finaliza la sesión activa del usuario de forma segura y limpia el estado global de la aplicación.
## Pruebas
- **Cifrado:** Validación del registro de usuarios nuevos, verificando que en MongoDB Atlas la contraseña se almacena como un hash irreversible. 
- **Ciclo de Comanda y Ticket:** Creación de un pedido desde la terminal, procesamiento en cocina plato por plato, recepción en barra, cierre de caja con la correspondiente impresión simulada del ticket y redirección automática al Login.

## Observaciones tras la realización del prototipo final

### 1. Modificaciones sobre la planificación inicial de los requerimientos:
- **Cambio en el Modelo de Datos:** Inicialmente no se contemplaba el control fiscal y diario de las sesiones de caja. Fue necesario reestructurar la base de datos a mitad del sprint para introducir el modelo `CajaSesion` y sincronizarlo con el ciclo de vida del usuario en `App.jsx`.
- **Refactorización de Seguridad Urgente:** Al principio se permitía el acceso abierto por CORS para facilitar las pruebas, pero para el despliegue final se decidió restringir el tráfico estrictamente a los orígenes del proyecto y proteger el archivo Docker eliminando credenciales explícitas en las variables de entorno visibles.

### 2. Aprendizaje realizado 
- **Bcrypt y JWT (Seguridad):** Aprendizaje práctico sobre el ciclo de generación de tokens de sesión y cifrado de datos en Node.js.
- **Gestión de Variables de Entorno en Docker y Vite:** He aprendido a separar los datos de configuración (como la dirección de la API) mediante archivos .env. De esta forma, la aplicación sabe conectarse de forma automática cuando trabajo en mi ordenador (local) o cuando arranco el sistema en el servidor final (producción) con Docker, sin tener que cambiar el código a mano.
- **MongoDB Atlas:** He aprendido a mover la base de datos de mi ordenador a la nube para que el TPV funcione a cualquier hora.
- **Ciclo de vida y Polling en React:** He profundizado en el uso avanzado de los Hooks (useEffect, useState) para implementar un sistema de polling asíncrono. Esto me ha enseñado a gestionar la sincronización de estados en tiempo real para que la cocina y la barra compartan la misma información sin saturar el servidor.

- **Lógica del Negocio:** Desarrollar estos sistemas uno para barra, cocina y camarero me ha aportado un entendimiento de cómo funciona un negocio de hostelería a nivel fiscal, desde el control estricto de apertura/cierre de caja hasta el desglose de impuestos (IVA) y la maquetación de tickets bajo estándares físicos de 80mm.
