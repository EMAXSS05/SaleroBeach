# Deseño

## Diagrama da arquitectura
![Diagrma de arquitectura](../img/diagramaDeArquitectura.png)

## Diagrama de Base de Datos
```mermaid
classDiagram
    class Usuarios {
        +ObjectId _id
        +String username
        +String password
        +String nombreReal
        +String rol
        +String turno
    }

    class Productos {
        +ObjectId _id
        +String id
        +String nombre
        +Number precio
        +String categoria
        +String sub
        +String descripcionLarga
        +String imagen
        +Boolean disponible
        +Boolean activo
    }

    class Pedidos {
        +ObjectId _id
        +String mesa
        +Number total
        +String estadoGeneral
        +String camareroAsignado
        +Date fecha_apertura
        +Date fecha_cierre
        +Array items
    }

    class ItemDetalle {
        +String nombre
        +Number precio
        +Number cantidad
        +String imagen
        +String sub
        +String nota
        +String estadoItem
        +Date hora_inicio_cocina
        +Date hora_fin_cocina
    }

    class Mesa {
        +ObjectId _id
        +String numero
        +String zona
        +Boolean activa
        +String estado
        +Number capacidad
        +Array alertas
    }

    %% Relaciones
    Pedidos "1" *-- "n" ItemDetalle : contiene
    Usuarios "1" --o "n" Pedidos : gestiona
    Pedidos "n" --> "1" Mesa : ubicado en
```
Para el proyecto Salero Beach, se ha optado por un sistema de base de datos NoSQL orientado a documentos (MongoDB). A diferencia de los modelos relacionales tradicionales (MariaDB/MySQL), este modelo posibilita una flexibilidad y escalabilidad superiores, ya que se adecúa más eficazmente a la naturaleza cambiante de un menú de restaurante y a la rapidez que necesita el servicio de comandas.


## Deseño de interface de usuarios

### Interfaz para barra/cocina
### Login  
![login](../img/login.png)  
### Home-Barra  
![home-barra](../img/home-Barra.png)
### Historial de pedidos  
![HistorialPedios](../img/historialPedidos.png)
### Gestion de productos  
![GestionDeProductos](../img/productos.png)
### Gestion de mesas  
![]()
### Home-Cocina  
![homeCocina](../img/home-Cocina.png)
## Interfaz del Comensal  
### Principal  
![principalComensal](../img/principal-comensal.png)
### Ver Todo
![verTodo](../img/verTodo.png)
### Carrito
![](../img/carrito.png)
## Interfaz del camarero
### Principal
![](../img/principalCamarero.png)
### Mesa seleccionada
![](../img/mesaSeleccion.png)



