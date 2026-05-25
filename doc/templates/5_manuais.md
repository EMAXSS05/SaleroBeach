# Manuais


## Manual técnico do proxecto

## Instalación
No habrá que instalarla desde ningun lado, ya que es una aplicación web y por lo tanto para acceder a ella se necesitará el enlace hacia el sitio,para eso se dispone de un subdomino gratuito que provee Render y ese enlace será compartido con los trabajadores del establecimiento para que puedan darle uso.

Link para acceder a la app web: [SaleroBeach.com](https://salerobeach-1.onrender.com)

## Manual de Usuario

Se divide en 3 partes,una para cada rol del empleado en el establecimiento Salero Bar
### Barra, Camarero y Cocina
### 1. login
Deberá introducir los credenciales proporcionadas por el admin (la barra)

![](../img/loginSalerobeach.png)
## Barra
Credenciales para iniciar sesión en la barra(admin): [credenciales admin](../templates/4_codificacion_probas.md)

### Apartura de la Caja
Al hacer login se abrirá un modal donde deberá introducir el saldo inicial antes de comenzar la jornada.

![](../img/apertura-caja.png)
## Gestion de pedidos:
en la sección "Inicio" se podrán visualizar los pedidos que son enviados por los camareros, cada pedido muestra:
- Número de pedido.
- Alertas de la mesa.
- Los productos que contiene
- Notas de los platos, si los hay.
- Cantidad de cada producto.
- Número de mesa y el Total a cobrar.
- Un icono con singo de exlamación que es para resaltar que hay una alerta o nota en el pedido. 

![](../img/barra-pedidos.png)
 ## Cobrar pedidos
Para cobrar los pedidos se debe pulsar en cobrar y seleccionar el método con el cual el cliente paga.

 ![](../img/metodosDePago.png)

## Eliminar productos
Para eliminar productos se debe pulsar el siguiente botón el cual resta 1 a la cantidad de dicho producto del pedido.

 ![](../img/quitarProducto.png)

## Cancelar pedido
Debe pulsar el botón de cancelar, a continuación aparecerá un pop up en la parte superior,pulse en aceptar para confirmar la cancelación del pedido, al aceptar, este se moverá al historial de pedidos y aparecerá como CANCELADO

![](../img/cancelarPedido.png)

## Imprimir facturas

###  Factura Proforma:
1. Hacer clic en "Ticket"

![](../img/seleccionFacturaProforma.png)

2. Seleccionar la mesa de la cual se desea imprimir la factura y hacer clic en Imprimir

![](../img/seleccionMesaImprimir-proforma.png)

3. A continuacion se abrirá una pestaña en el navegador con la vista previa de la impresión, personalize las configuraciones a gusto y finalmente haga clic en Imprimir.
![](../img//vistaPreviaImpresion-proforma.png)

## Ticket Cocina
1. Hacer clic en el botón cocina.

![](../img/seleccionTicketCocina.png)

2. Seleccionar una mesa que tenga platos de comida o entrantes y hacer clic en Imprimir

![](../img/seleccionMesaImprimir-cocina.png)

3. Se abrirá la vista previa de la impresión, personalize las configuraciones para la impresión y haga clic en Imprimir.

![](../img/vistaPreviaTicketCocina.png)

## Historial de Ventas
En esta sección se podrá visualizar el registro de todos los pedidos completados y cancelados, se puede filtrar por una fecha en concreto o por el numero de mesa, también se podrá ver la recaudación de dinero.

![](../img/HistorialPedidos-vista.png)
## Imprimir Z
1. Debe hacer clic en Z-Cierre de Caja

![](../img/btnZ.png)

2. A continuación se le abrirá una vista previa del ticket con datos como el saldo inicial, los cobros que se hicieron con tarjeta y efectivo,etc.

![](../img/ejemploZ.png)

3. Hacer clic en imprimir para abrir la pestaña de la impresión:

![](../img/btnImprimirZ.png)

4. Personlizar la configuracion de la impresión y finalmente clic en imprimir

![](../img/vistaPreviaImpresion-z.png)

5. Una vez en imprimido el informe Z puede hacer clic en cerrar Caja, esto cerrará automáticamente la sesión, y reiniciará todos los datos para el comienzo de la próxima jornada

![](../img/btnCerrarCaja.png)


# Promoción
Esta aplicación o sistema se promocionará a través de redes sociales, en este caso escogí 3, Linkedin como la principal, secundarias serán Instagram y Facebook donde se publicará contenido sobre el uso de la aplicación e información para contactarme por si algun negocio se interesa y requiere este mismo sistema. 


# Modelo de Negocio

El modelo de negocio elegido para el desarrollo de este proyecto es un **modelo híbrido** que combina el **Desarrollo a Medida** con el **Modelo de Suscripción por Mantenimiento**.

Esta combinación es la que mejor se adapta a la realidad económica y operativa de un programador autónomo junior, garantizando la viabilidad del proyecto desde el primer momento. A continuación, se justifican detalladamente los motivos de esta elección.

---

## 1. Desarrollo a Medida

Este proyecto no nace como un producto comercial masivo, sino como una solución de software específica para un cliente directo. Por ello, se descartan modelos basados en publicidad o freemium, y se opta por el desarrollo a medida.

- **Financiación integral de los costes:** Al cerrar un precio de venta final de **3.490,00 €**, el cliente asume el coste total del desarrollo. Esto permite cubrir de forma inmediata los **1.750,00 €** correspondientes a la mano de obra propia (70 horas a 25 €/h), así como los costes operativos derivados de la actividad (alquiler de local, electricidad, internet, amortización del equipo y la cuota de autónomo).

- **Mitigación del riesgo y obtención de beneficio:** Como programador autónomo, el riesgo de imprevistos o períodos sin actividad es elevado. La aplicación del margen del 25% (+697,88 €) sobre los costes directos justifica el riesgo asumido y asegura un resultado económico positivo directo de **698,50 €** tras la entrega del producto.

- **Coste de adquisición cero:** Como se refleja en el presupuesto, el gasto en publicidad es de **0,00 €**. Al tratarse de un modelo B2B con un cliente ya fidelizado, no hay dilución de ingresos en estrategias de marketing.

---

## 2. Modelo de Suscripción

Una vez finalizado y entregado el software, el modelo de negocio evoluciona hacia una suscripción de servicios de soporte y mantenimiento.

- **Creación de ingresos recurrentes:** Se establece una cuota mensual de **20 €/mes**, lo que supone un ingreso anual de **240,00 €**. Para el autónomo, este modelo es clave, ya que ayuda a construir una base de ingresos predecibles y estables a lo largo del año, reduciendo la dependencia exclusiva de nuevos proyectos.

- **Valor añadido para el cliente:** El cliente no queda desatendido tras la entrega. Esta suscripción se justifica por ofrecer un servicio de resolución de errores (bugs), soporte técnico ante incidencias y optimización del sistema (aprovechando que los costes de infraestructura en la nube son actualmente de **0,00 €** gracias a los planes gratuitos de MongoDB Atlas y Render).

---

## Conclusión

En resumen, el modelo elegido transfiere el coste y el beneficio del desarrollo al cliente final mediante un **pago único por producto (In-house)**, y asegura la continuidad del servicio y la estabilidad financiera del autónomo a largo plazo mediante un **pago recurrente (Suscripción)**. Esta estructura garantiza que el proyecto sea rentable desde el mes uno, alcanzando un resultado económico total de **938,50 €** al cabo del primer año.




## Melloras futuras
Esta aplicación puede dar un salto en cuanto a automatizar la toma de pedidos, pienso en implementar la tercera vista, que sería para el cliente, donde él mismo desde su mesa al escanear el qr, pueda visualizar la carta completa y de este modo pueda realizar sus pedidos y que la barra y cocina, automáticamente los visualizen en su pantalla, además creo que no vendria mal una sección de estadísticas para ver más a detalle las ganacias del día, actualmente está en la sección de historial y por último me gustaría hacer que la aplicación funcione offline, ya que puede pasar que un día por algún motivo no haya wifi y se necesite acceder a la aplicación.
