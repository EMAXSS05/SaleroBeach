# Análise: Requirimentos do sistema

## Descrición xeral
El proyecto consiste en una solución integral para establecimientos de hostelería pequeños y medianos, diseñada específicamente para las necesidades del Bar Salero Beach de Carnota. El sistema optimiza el flujo de trabajo agilizando el servicio, ya que permite que el cliente realice pedidos directamente desde su mesa mediante códigos QR y para garantizar la inclusión de usuarios que no deseen o no sepan utilizar esta tecnología, se ha desarrollado una terminal móvil para los camareros, eliminando así el uso de cuadernillos de papel y los errores de transcripción. Todo el ecosistema está sincronizado en tiempo real, permitiendo que la barra y la cocina visualicen las comandas casi al instante.

## Requerimientos  


## 2. Requisitos funcionales del prototipo

| Acción | Actor | Descripción del proceso | Datos de entrada | Datos de salida |

|------|------|------|------|------|

| Autenticación | Personal (Bar/Camarero) | El sistema valida las credenciales y otorga acceso según el rol (administración o camarero). | Usuario, Contraseña | Acceso al panel / Token de sesión |

| Registro de producto | Administrador / Bar | Registro de nuevos artículos en el menú, definiendo su lugar de preparación (Cocina o Bar). | Nombre, Precio, Categoría, Destino | Producto guardado en la base de datos |

| Modificar producto | Bar / Administrador | Actualización de precios, stock o disponibilidad de un producto existente. | ID del producto, Nuevos datos | Confirmación de actualización |

| Apertura de mesa | Camarero | Inicio del servicio en una mesa libre, creando un documento de pedido vinculado. | Número de mesa | Pedido creado (Estado: Abierto) |

| Agregar artículos | Camarero | El personal agrega bebidas a una mesa libre desde su terminal portátil. | ID del pedido, Lista de productos | Pedido actualizado en tiempo real |

| Gestión de pedidos | Cocina / Bar | Interfaz para ver los pedidos pendientes filtrados por destino (solo platos de cocina). | ID del artículo del pedido | Notificación de "Listo para servir" |

| Cambio de estado | Camarero / Bar | Marcar los productos como "Servidos" para controlar el flujo en la mesa. | ID del artículo, nuevo estado | Actualización visual en la interfaz |

| Cierre de cuenta | Bar / Camarero | Cálculo del total acumulado, impresión de un ticket (simulado) y liberación de la mesa. | ID del pedido | Total a pagar / Mesa libre |

| Gestión de mesas | Bar | Creación, edición o desactivación de mesas físicas en el plano del local. | N.º de mesa, zona, estado | Base de datos de mesas actualizada |

| Pedido por QR (opcional) | Cliente | Futura mejora: El cliente solicita productos desde su móvil tras escanear un código QR. | Selección de artículos, ID de mesa | Pedido registrado en el sistema |

## Requirimentos No Funcionais
* Seguridad y privacidad: Las credenciales de acceso nunca se almacenan en texto plano, sino que se utiliza cifrado hash (Bcrypt) para garantizar su persistencia. Además, la configuración confidencial (claves de la base de datos) se gestiona mediante variables de entorno (.env) para evitar fugas de información en el repositorio.

* Disponibilidad e implementación: El sistema debe empaquetarse utilizando Docker y Docker Compose, lo que garantiza que la aplicación funcione de forma idéntica tanto en el ordenador del instituto como en el de desarrollo, sin necesidad de instalar dependencias manualmente.

* Persistencia de datos: Se utilizará una base de datos NoSQL en la nube (MongoDB Atlas) para asegurar que la información sea accesible y persistente, independientemente de dónde se ejecute el contenedor.

Usabilidad e interfaz: La interfaz debe ser adaptable y de carga rápida, optimizada especialmente para tabletas y dispositivos móviles, que son los que utilizarán los camareros en sus desplazamientos. El uso de códigos de color (semáforos) facilitará la lectura rápida del estado de los pedidos.

## Tipos de usuarios
Usuario Anónimo (Cliente): Usuario que accede sin credenciales a través del escaneo del código QR de su mesa. Su acceso está limitado exclusivamente a la visualización de la carta y al envío de pedidos para su mesa específica.

Usuario Registrado (Camarero): Personal con credenciales de acceso (username y/contraseña). Tiene permisos para gestionar todas las mesas, tomar pedidos manualmente, modificar comandas existentes y cambiar el estado de ocupación del local.

Administrador (barra): Perfil con acceso total. Además de las funciones de camarero, puede editar los productos de la carta (precios, fotos, disponibilidad), gestionar las mesas es decir habilitarlas o deshabilitarlas y gestionar usuarios.


## Normativa
Dada la naturaleza técnica del sistema de información, el proyecto se adapta a la Ley Orgánica 3/2018 (LOPDGDD) y al Reglamento General de Protección de Datos (RGPD) de la Unión Europea.

## Tratamiento de Datos Personales
El sistema distingue entre dos tipos de usuarios, aplicando la normativa de forma diferenciada:

## Trabajadores (Camareros y Cocineros):
* Finalidad: Los datos (nombre de usuario y contraseña) se recogen únicamente con fines de autenticación, control de acceso y trazabilidad de las operaciones (saber qué camarero atendió cada mesa).

* Seguridad: Cumpliendo con el principio de integridad, las contraseñas se almacenan cifradas mediante el algoritmo Bcrypt, siendo ilegibles incluso para el administrador del sistema.

* Derechos: El personal tiene derecho de acceso y rectificación de sus perfiles a través del panel de Administración.

## Clientes (Comensales):

Anonimato: El sistema garantiza el anonimato total del cliente. Al realizar un pedido mediante código QR, no se requiere registro, email ni nombre.

Datos de Sesión: Solo se vincula el pedido a un número de mesa físico. No se recogen datos personales del dispositivo del cliente más allá de los técnicos necesarios para la comunicación con el servidor.

## Mecanismos de Cumplimiento (Implementación Técnica)
Para asegurar que el proyecto cumple con la legalidad vigente, se han establecido los siguientes mecanismos:

* Aviso Legal y Privacidad: La aplicación cuenta con un apartado accesible donde se identifica al responsable del sistema y se explica que los datos de los pedidos se borran o archivan sin vinculación a personas físicas tras el cierre de caja.

* Política de Cookies/Storage: Se informa de que el uso de localStorage tiene una finalidad puramente técnica (mantener la sesión del trabajador abierta), lo cual está exento de consentimiento según la LSSI, pero se documenta por transparencia.

* Principio de Minimización: El sistema solo maneja los datos mínimos viables para que el bar funcione (Quién sirve y qué mesa pide).
