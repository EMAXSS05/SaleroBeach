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
    }

    class Productos {
        +ObjectId _id
        +String id
        +String nombre
        +Number precio
        +String categoria
        +String sub
        +String imagen
        +Boolean disponible
    }

    class Pedidos {
        +ObjectId _id
        +String mesa
        +Number total
        +String estado
        +String camareroAsignado
        +Date fecha
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
    }

    class Mesa {
        +ObjectId _id
        +String numero
        +String zona
        +Boolean activa
        +String estado
    }

    %% Relaciones
    Pedidos "1" *-- "n" ItemDetalle : contiene
    Usuarios "1" --o "n" Pedidos : gestiona
    Pedidos "n" --> "1" Mesa : ubicado en

```


## Deseño de interface de usuarios

### Interfaz para barra/cocina
### Login  
![login](../img/login.png)  
### Home-Barra  
![home-barra] (../img/home-Barra.png)
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
![](../img/mesaSeleccionada.png)



