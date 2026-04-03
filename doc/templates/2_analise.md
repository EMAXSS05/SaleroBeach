# Análise: Requirimentos do sistema

## Descrición xeral
El proyecto consiste en una solución integral para establecimientos de hostelería pequeños y medianos, diseñada específicamente para las necesidades del Bar Salero Beach de Carnota. El sistema optimiza el flujo de trabajo agilizando el servicio, ya que permite que el cliente realice pedidos directamente desde su mesa mediante códigos QR y para garantizar la inclusión de usuarios que no deseen o no sepan utilizar esta tecnología, se ha desarrollado una terminal móvil para los camareros, eliminando así el uso de cuadernillos de papel y los errores de transcripción. Todo el ecosistema está sincronizado en tiempo real, permitiendo que la barra y la cocina visualicen las comandas casi al instante.

## Requerimientos  


## Requerimientos Funcionales

| Acción                | Actor               | Descripción del Proceso                                                                 | Datos de Entrada                          | Datos de Salida                          |
|----------------------|--------------------|------------------------------------------------------------------------------------------|-------------------------------------------|------------------------------------------|
| Autenticación        | Barra / Camarero   | El sistema valida las credenciales y otorga acceso según el rol del usuario.           | Usuario, Contraseña                       | Acceso al Panel / Token                  |
| Alta de Producto     | Administrador      | Se registra un nuevo ítem en la base de datos para que aparezca en el menú.             | Nombre, Precio, Categoría, Imagen         | Producto guardado en BD                  |
| Modificar Producto   | Barra      | Se actualizan los datos (precio, stock o disponibilidad) de un producto existente.     | ID Producto, Nuevos datos                 | Confirmación de actualización            |
| Apertura de Mesa     | Camarero           | Se inicia un servicio en una mesa libre, creando un documento de pedido vinculado.      | Nº de Mesa                                | Pedido Creado (Estado: Abierto)          |
| Pedido por QR        | Cliente            | El cliente selecciona productos desde su móvil y los envía al sistema del bar.(Opcional)          | Selección de ítems, Mesa                  | Pedido en Cola de Barra                  |
| Añadir Ítems         | Camarero           | El staff añade consumiciones extra a una mesa que ya está siendo atendida.              | ID Pedido, Nuevos productos               | Pedido actualizado en tiempo real        |
| Asignar Camarero     | Camarero           | Uno de los camareros se "adueña" de un pedido pendiente para gestionarlo.               | ID Pedido, ID Camarero                    | Pedido vinculado al Camarero             |
| Cambio de Estado     | Camarero / Barra   | Se marca un producto como "Listo" o "Entregado" al cliente.                             | ID Ítem, Nuevo Estado                     | Actualización visual (Badges)            |
| Cierre de Cuenta     | Camarero/barra           | Se calcula el total de los ítems y se libera la mesa en el sistema.                     | ID Pedido                                 | Total a pagar / Mesa Libre               |
| Eliminar Usuario     | Barra      | Se elimina un perfil de camarero de la base de datos por fin de contrato o error.       | ID Usuario                                | Usuario eliminado                        |
|Alta de Mesa | Barra |Crear una nueva mesa física en el sistema| Número de Mesa, Zona | Nueva Mesa en Interfaz|
Deshabilitar Mesa| Barra | Marcar una mesa como deshabilitada para que nadie pida en ella.| ID Mesa | Mesa bloqueada|
Eliminar Mesa | Barra | Borrar definitivamente una mesa del sistema si ya no existe físicamente.| ID Mesa | Mesa eliminada de la Bd.|


## Requerimientos No Funcionales  
Seguridad: Las contraseñas se almacenan mediante hash con Bcrypt.

Dispositivos: Interfaz Responsive compatible con Tablets, Móviles y PC.


Accesibilidad: Uso de Código de Colores (Naranja/Verde/Gris) para una lectura rápida en condiciones de estrés.

Rendimiento: Sincronización rápida para que los 3 camareros vean los cambios de estado al instante.

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
