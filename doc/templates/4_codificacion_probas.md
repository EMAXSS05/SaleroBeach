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
## Probas
Use thunder Client que es una extension del visual que me permitió probar los endpoints.

## Prototipo 2
## Data de entrega: 05 de Mayo
## Funcionalidades implementadas:
- **RF1 Sistema Multimesa Dinámico:** Migración del modelo de datos de mesa única a un array de mesas, permitiendo vincular un pedido a varias ubicaciones físicas. 
- **RF2 Control de Acceso (Login):** Implementación de un sistema de autenticación centralizado que redirige automáticamente a cada usuario a su terminal correspondiente (Barra, Cocina o Camarero) según su rol asignado.
- **RF3 Panel de Gestión de Usuarios:** Interfaz exclusiva para el perfil de Barra que permite dar de alta, asignar un rol, eliminar, en el prototipo final se podrá cambiar la contraseña de estos usuarios.
- **RF4 Gestión de Mesas:** Módulo para configurar el mapa de sala, añadir una meza eligiendo el nímero la zona y la capacidad, se puede desactivar y eliminar mesas, en el prototipo final se podrá editar la capacidad de cada mesa.
- **RF5 Módulo de Unión de Mesas:** Interfaz interactiva para agrupar mesas en tiempo real en el Terminal del Camarero. 
- **RF6 Historial de Pedidos:** Registro completo de comandas finalizadas, permitiendo consultar su estado, puede ser cancelado o completado y se puede filtrar segun la fecha.
- **RF7 Terminal de Cocinero:** Se hizo la interfaz del cocinero donde solo puede visualizar los platos de comida y avisar al camarero cuando el pedido del cliente esté listo.

- **RF8 Método de pago:** Implementé un pop up para que en la barra al momento de cobrar el pedido eligiera el método de pago, ya sea en efectivo o con tarjeta.

## Probas
Probé el flujo completo: desde el inicio de sesión, la creación de un pedido unido, su paso por cocina y su almacenamiento final en el Historial de Pedidos, verificando que los datos se mantienen íntegros en cada paso del ciclo de vida de la comanda.