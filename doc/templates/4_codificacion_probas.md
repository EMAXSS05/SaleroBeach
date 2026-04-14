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
Para este prototipo decidí arriesgar un poco y utilizar React y Node.js, tecnologías que no hemos visto en el ciclo, pero que ya sabía lo básico por cursos que hize por internet y más que nada por la forma en que se trabaja con react es decir con componentes porque ya veia yo que iba a tener demasiados html y con react solo tengo uno y admeñas que estas tecnologias son muy demandadas con el stack MERN. Los principales retos que tuve que resolver fueron: Al principio fue un lío pasar de la forma tradicional de programar a la lógica de componentes. El reto fue aprender a organizar la app para que, al pulsar un botón en un sitio como el mapa de las mesas, se enterase otro componente distinto (como la carta) sin que la página se recargase. Lo solucioné usando estados y pasando funciones entre los archivos.
Segundo reto fue pelearme con las esperas del servidor Al principio me daba errores porque intentaba usar los datos antes de que llegaran de la base de datos. Aprendí a usar async y await para que la app esperase a que el pedido se guardara de verdad antes de mandarme de vuelta al mapa de mesas.
## Probas
