# Análise: Requirimentos do sistema

## Descrición xeral
El proyecto consiste en una solución integral para establecimientos de hostelería pequeños y medianos, diseñada específicamente para las necesidades del Bar Salero Beach de Carnota. El sistema optimiza el flujo de trabajo agilizando el servicio, ya que permite que el cliente realice pedidos directamente desde su mesa mediante códigos QR y para garantizar la inclusión de usuarios que no deseen o no sepan utilizar esta tecnología, se ha desarrollado una terminal móvil para los camareros, eliminando así el uso de cuadernillos de papel y los errores de transcripción. Todo el ecosistema está sincronizado en tiempo real, permitiendo que la barra y la cocina visualicen las comandas casi al instante.

## Requerimientos  




## Tipos de usuarios
Usuario Anónimo (Cliente): Usuario que accede sin credenciales a través del escaneo del código QR de su mesa. Su acceso está limitado exclusivamente a la visualización de la carta y al envío de pedidos para su mesa específica.

Usuario Registrado (Camarero): Personal con credenciales de acceso (username y/contraseña). Tiene permisos para gestionar todas las mesas, tomar pedidos manualmente, modificar comandas existentes y cambiar el estado de ocupación del local.

Administrador (barra): Perfil con acceso total. Además de las funciones de camarero, puede editar los productos de la carta (precios, fotos, disponibilidad), gestionar las mesas es decir habilitarlas o deshabilitarlas y gestionar usuarios.


## Normativa
## Normativa Vigente y Cumplimiento Legal
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
