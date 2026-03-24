# Análise: Requirimentos do sistema

## Descrición xeral

## Funcionalidades
## 1. Requerimientos Funcionales

| Acción                | Actor               | Descripción del Proceso                                                                 | Datos de Entrada                          | Datos de Salida                          |
|----------------------|--------------------|------------------------------------------------------------------------------------------|-------------------------------------------|------------------------------------------|
| Autenticación        | Barra / Camarero   | El sistema valida las credenciales y otorga acceso según el rol del usuario.           | Usuario, Contraseña                       | Acceso al Panel / Token                  |
| Alta de Producto     | Administrador      | Se registra un nuevo ítem en la base de datos para que aparezca en el menú.             | Nombre, Precio, Categoría, Imagen         | Producto guardado en BD                  |
| Modificar Producto   | Barra      | Se actualizan los datos (precio, stock o disponibilidad) de un producto existente.     | ID Producto, Nuevos datos                 | Confirmación de actualización            |
| Apertura de Mesa     | Camarero           | Se inicia un servicio en una mesa libre, creando un documento de pedido vinculado.      | Nº de Mesa                                | Pedido Creado (Estado: Abierto)          |
| Pedido por QR        | Cliente            | El cliente selecciona productos desde su móvil y los envía al sistema del bar.          | Selección de ítems, Mesa                  | Pedido en Cola de Barra                  |
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

Disponibilidad: Persistencia de datos en MongoDB para evitar pérdida de pedidos por fallos de red.

Accesibilidad: Uso de Código de Colores (Naranja/Verde/Gris) para una lectura rápida en condiciones de estrés.

Rendimiento: Sincronización rápida para que los 3 camareros vean los cambios de estado al instante.

## Tipos de usuarios

## Normativa
