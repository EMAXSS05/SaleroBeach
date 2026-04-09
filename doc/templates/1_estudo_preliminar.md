# Estudo preliminar

## 1. Descrición do proxecto
Salero Beach es una solución multiplataforma, diseñada para funcionar operativamente como una aplicación móvil nativa en el punto de venta. El sistema centraliza y sincroniza en tiempo real a clientes (vía móvil), camareros (vía terminal de mano) y barra/cocina (panel de control), eliminando el uso de papel y agilizando todo el ciclo de vida de un pedido.

### 1.1. Xustificación do proxecto
La necesidad del proyecto surge al detectar ineficiencias en el modelo analógico actual como la pérdida de tiempo en desplazamientos del personal, errores en comandas manuscritas y saturación en cocina durante horas punta. La elección de una Web App adaptable permite que el sistema sea accesible al instante mediante códigos QR, eliminando la barrera de descarga desde la Play Store para los clientes, pero manteniendo la experiencia de una aplicación móvil fluida y rápida.

### 1.2. Funcionalidades do proxecto

#### Autogestión para Clientes vía QR:

* Acceso instantáneo: Al escanear el código QR de la mesa, el cliente accede directamente a la carta sin necesidad de descargar ninguna aplicación.

* Carta Digital Interactiva: Visualización de productos, precios y detalles en tiempo real.

* Envío de Comandas: El cliente puede confeccionar su pedido y enviarlo directamente a cocina, agilizando el servicio en momentos de alta ocupación.

#### Terminal de Gestión para Camareros:

* Toma de pedidos móvil: Los camareros utilizan sus propios dispositivos como terminales de mano para registrar pedidos de clientes que no deseen usar el QR.

* Control de Comandas en Tiempo Real: Capacidad para modificar, añadir o cancelar platos de una mesa de forma inmediata, sincronizándose automáticamente con la barra.

* Gestión de Estados de Mesa: Visualización del estado del local (mesas libres, ocupadas o con pedidos pendientes de pago).

#### Panel de Control de Barra y Cocina:

* Monitor de Pedidos: Visualización centralizada de todas las comandas entrantes, organizadas por orden de llegada y número de mesa.

* Gestión de Cuentas: Herramienta para calcular el total de la consumición y gestionar el cierre de la mesa tras el pago.

* Histórico Operativo: Registro de las ventas realizadas durante la jornada para facilitar el arqueo de caja final.  
### 1.3. Estudio de necesidades (Análisis de la competencia)
Para el desarrollo de **Salero Beach**, se han analizado las principales soluciones de gestión de hostelería (TPV) existentes en el mercado, evaluando sus fortalezas y justificando la creación de una nueva solución:

* **Storyous / Revo (Sistemas TPV Líderes):**
    * **¿En qué medida lo consiguen?:** Ofrecen un control integral (inventario, facturación y gestión de personal).
    * **Limitaciones:** Requieren una inversión alta en hardware específico (como iPads) y el pago de licencias mensuales costosas. Además, su flujo de trabajo está muy centrado en el camarero, dejando en segundo plano la autogestión del cliente vía QR.
    * **Posición:** Referentes en medianas y grandes empresas de restauración.

* **GloriaFood (Plataforma de pedidos online):**
    * **¿En qué medida lo consiguen?:** Muy buena gestión de menús digitales y recepción de pedidos remotos.
    * **Limitaciones:** Su enfoque principal es el *delivery* (reparto a domicilio). No están optimizados para la gestión interna de mesas ni para la comunicación directa en tiempo real entre la sala y la cocina de un local físico.
    * **Posición:** Líder en pedidos para llevar.

#### Propuesta de Salero Beach frente al mercado:
A diferencia de las soluciones mencionadas, este proyecto se posiciona en un nicho de **digitalización de bajo coste**. La necesidad cubierta es la de una herramienta que:
1.  **No requiere hardware costoso:** Aprovecha los smartphones que ya tienen el personal y los clientes.
2.  **Sin contratos complejos:** Elimina cuotas de mantenimiento y licencias.
3.  **Simplicidad total:** Se centra exclusivamente en la rapidez de uso dentro del local para negocios familiares o pequeños.

### 1.4. Persoas destinatarias  
La aplicación **Salero Beach** está dirigida a un público objetivo mixto, diferenciando entre el sector empresarial y el usuario final:

* **Sector Empresarial (Hostelería):** El cliente principal es el **Bar Salero**, un pequeño negocio que busca modernizar su gestión interna sin realizar grandes inversiones en hardware. Es aplicable a cualquier pequeño-mediano restaurante o cafetería que quiera optimizar el flujo entre sala y cocina.
* **Personal del local (Camareros y Cocina):** Profesionales que necesiten una herramienta sencilla e intuitiva para reducir la carga de tareas mecánicas, evitar errores de comunicación y gestionar comandas de forma ágil.
* **Usuarios finales (Clientes del local):** Público general, principalmente personas familiarizadas con el uso de smartphones y el escaneo de códigos QR. El diseño prioriza la usabilidad para que cualquier cliente, independientemente de su destreza tecnológica, pueda realizar un pedido sin dificultad.
### 1.5. Modelo de negocio
El modelo de negocio elegido es el de **Desarrollo a medida ** con posibilidad de **escalabilidad horizontal**:

* **Justificación:** El proyecto nace como una solución personalizada para el Bar Salero, eliminando costes fijos de suscripción y comisiones por pedido. El beneficio para el desarrollador se establece mediante un pago único por implantación y puesta en marcha del sistema.
* **Reutilización y Escalabilidad:** El software ha sido diseñado de forma modular. Esto permite que el núcleo del sistema (gestión de pedidos, base de datos y panel de cocina) sea fácilmente reutilizable para otros establecimientos del sector hostelería. 
* **Personalización:** Mediante ajustes en la capa de estilos (CSS) y la configuración de la base de datos, el sistema puede adaptarse visualmente a la identidad corporativa de nuevos clientes, permitiendo al desarrollador ofrecer la solución a otros negocios locales con un tiempo de despliegue mínimo.

## 2. Requirimentos
**Lenguajes y técnicas**
* Javascript: Lenguaje base tanto para el desenvolvimiento del cliente como del servidor.
* Html y css: Para la estrutura de la aplicación y el diseño visual. 
* Fetch Api: Para enviar los pedidos desde el móvil a la base de datos sin que la página tenga que recargarse por completo.
* Diseño Responsivo: Uso de Media Queries y unidades relativas para asegurar que la interfaz sea cómoda de usar en los móviles de los clientes y camareros.    
* Docker (Herramienta de virtualización): Plataforma basada en contenedores que permite empaquetar la aplicación con todas sus dependencias, garantizando que funcione correctamente en cualquier entorno (local o servidor).
#### **Librerías y frameworks**
* Node js: Entorno de ejecución para el servidor.
* Express js: Framework de backend para gestionar las rutas, la lógica de negocio y la comunicación con los dispositivos.
React.js: Librería de frontend basada en componentes para construir la interfaz de usuario de forma dinámica, rápida y reactiva.
* Mongoose Librería para el modelaje de objetos de MongoDB, facilitando la gestión de los esquemas de datos de pedidos y usuarios.  
#### **Base de Datos y servicio**  
* MongoDB Atlas: Base de datos NoSQL documental alojada en la nube. Es la pieza clave del sistema donde se almacenan los productos de la carta, los pedidos activos de cada mesa y el histórico de ventas. Se ha elegido por su flexibilidad para manejar pedidos con múltiples opciones y personalizaciones.

* Render: Plataforma utilizada para el despliegue del servidor en la nube, permitiendo que la aplicación sea accesible mediante una URL pública.
