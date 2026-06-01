import React,{useState} from 'react';
import { MdLogout, MdPrint, MdRestaurant, MdReceipt } from 'react-icons/md';
import styles from './Header.module.css';

const Header = ({ usuario, onCerrarSesion,pedidos=[],mostrarBotonesPrint = false }) => {
    const [modalImpresion, setModalImpresion] = useState(null); 
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const pedidosActivos = pedidos;
    const abrirModal = (tipo) => {
        setModalImpresion(tipo);
        setPedidoSeleccionado(null);
    };
    const cerrarModal = () => {
        setModalImpresion(null);
        setPedidoSeleccionado(null);
    };
   /**
     * Filtra el pedido para extraer únicamente la comida (Entrantes y Segundos).
     * Agrupa los productos idénticos,mismo nombre y misma nota de cocina sumando sus cantidades
     * para evitar duplicados en el ticket. Finalmente, genera un documento HTML 
     * formateado en formato estándar de 80mm y lanza el comando de impresión nativo del navegador.
     */
    const imprimirCocina = (pedido) => {
        const itemsComida = pedido.items.filter(i => i.sub === 'Entrantes' || i.sub === 'Segundos');
        const itemsAgrupados = itemsComida.reduce((acc, item) => {
            const existe = acc.find(i => i.nombre === item.nombre && i.nota === item.nota);
            if (existe) { existe.cantidad += item.cantidad; }
            else { acc.push({ ...item }); }
            return acc;
        }, []);

        const fecha = new Date(pedido.fecha).toLocaleString('es-ES');
        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <html><head><title>Comanda Cocina</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Courier New', monospace; width: 80mm; padding: 8px; font-size: 13px; }
                .center { text-align: center; }
                .bold { font-weight: bold; }
                .big { font-size: 18px; font-weight: bold; }
                .separator { border-top: 1px dashed #000; margin: 6px 0; }
                .separator-solid { border-top: 2px solid #000; margin: 6px 0; }
                .stars { text-align: center; letter-spacing: 2px; font-size: 11px; }
                .item-row { display: flex; justify-content: space-between; margin: 4px 0; font-size: 14px; }
                .cantidad { font-size: 18px; font-weight: bold; min-width: 24px; }
                .categoria { text-align: center; font-style: italic; margin: 6px 0; }
                .nota { font-size: 11px; color: #333; margin-left: 24px; font-style: italic; }
                @page {size: 80mm auto; margin: 0;}
            </style>
            </head><body>
            <div class="stars">********************************</div>
            <div class="center bold" style="font-size:16px; margin: 4px 0;">COCINA</div>
            <div class="separator"></div>
            <div class="big">Mesa: ${pedido.mesas?.join(' + ') || 'S/N'}</div>
            <div class="separator"></div>
            <div>Camarero: ${pedido.camarero || '-'}</div>
            <div>Fecha: ${fecha}</div>
            <div class="stars">********************************</div>
            <br/>
            ${['Entrantes', 'Segundos'].map(cat => {
                const items = itemsAgrupados.filter(i => i.sub === cat);
                if (items.length === 0) return '';
                return `
                    <div class="categoria">.. ${cat} ..</div>
                    ${items.map(i => `
                        <div class="item-row">
                            <span class="cantidad">${i.cantidad}</span>
                            <span class="bold" style="flex:1">${i.nombre.toUpperCase()}</span>
                        </div>
                        ${i.nota ? `<div class="nota">→ ${i.nota}</div>` : ''}
                    `).join('')}
                `;
            }).join('')}
            <br/>
            <div class="stars">********************************</div>
            </body></html>
        `);
        ventana.document.close();
        ventana.print();
        cerrarModal();
    };
    /**
     * Genera el ticket de cuenta (Factura Proforma) para el cliente.
     * Agrupa los productos, calcula el importe por línea (cantidad * precio) y renderiza
     * un diseño de ticket limpio con datos fiscales del negocio (CIF, dirección).
     */
    const imprimirTicket = (pedido) => {
        const itemsAgrupados = pedido.items.reduce((acc, item) => {
            const existe = acc.find(i => i.nombre === item.nombre && i.nota === item.nota);
            if (existe) { existe.cantidad += item.cantidad; }
            else { acc.push({ ...item }); }
            return acc;
        }, []);

        const fecha = new Date(pedido.fecha).toLocaleString('es-ES');
        // Abre una nueva ventana en blanco en el navegador para meter el layout del ticket
        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <html><head><title>Ticket Cliente</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Courier New', monospace; width: 80mm; padding: 8px; font-size: 12px; }
                .center { text-align: center; }
                .bold { font-weight: bold; }
                .separator { border-top: 1px dashed #000; margin: 6px 0; }
                .separator-solid { border-top: 2px solid #000; margin: 6px 0; }
                .header { text-align: center; margin-bottom: 8px; line-height: 1.6; }
                .item-row { display: flex; justify-content: space-between; margin: 3px 0; }
                .col-uds { width: 20px; }
                .col-nombre { flex: 1; padding: 0 6px; }
                .col-precio { width: 45px; text-align: right; }
                .col-importe { width: 50px; text-align: right; }
                .total-row { display: flex; justify-content: space-between; font-size: 15px; font-weight: bold; margin-top: 4px; }
                .th { font-size: 10px; color: #555; }
                .nota { font-size: 10px; font-style: italic; margin-left: 26px; }
                .pendiente { font-size: 16px; font-weight: bold; text-align: center; letter-spacing: 1px; }
                @page {size: 80mm auto; margin: 0;}
            </style>
            </head><body>
            <div class="header">
                <div class="bold" style="font-size:14px">SALERO BEACH BAR</div>
                <div>CIF: 32973715H</div>
                <div>A Raña 35, 15293 Carnota</div>
                <div>Playa de Carnota</div>
            </div>
            <div class="separator-solid"></div>
            <div class="center bold" style="font-size:13px; margin: 4px 0;">FACTURA PROFORMA</div>
            <div class="separator"></div>
            <div style="display:flex; justify-content:space-between;">
                <span>Nº Op.: <b>[Pendiente]</b></span>
                <span>Mesa ${pedido.mesas?.join('/')}</span>
            </div>
            <div>${fecha}</div>
            <div class="separator-solid"></div>
            <div class="item-row th">
                <span class="col-uds">Uds</span>
                <span class="col-nombre">Producto</span>
                <span class="col-precio">Precio</span>
                <span class="col-importe">Importe</span>
            </div>
            <div class="separator"></div>
            ${itemsAgrupados.map(i => `
                <div class="item-row">
                    <span class="col-uds">${i.cantidad}</span>
                    <span class="col-nombre">${i.nombre}</span>
                    <span class="col-precio">${i.precio.toFixed(2)}</span>
                    <span class="col-importe">${(i.precio * i.cantidad).toFixed(2)}</span>
                </div>
                ${i.nota ? `<div class="nota">(${i.nota})</div>` : ''}
            `).join('')}
            <div class="separator-solid"></div>
            <div class="total-row">
                <span>Total (Impuestos Incl.)</span>
                <span>${pedido.total?.toFixed(2)} €</span>
            </div>
            <div class="separator"></div>
            <div class="center" style="margin-top: 8px; font-size: 11px;">GRACIAS POR SU VISITA</div>
            </body></html>
        `);
        ventana.document.close();
        ventana.print();
        cerrarModal();
    };

    return (
        <>
        <header className={styles.header}>
            {/* Botones de impresión */}
            {mostrarBotonesPrint ? (
            <div className={styles.printButtons}>
                <button className={styles.btnPrint} onClick={() => abrirModal('cocina')} title="Imprimir comanda cocina">
                    <MdRestaurant className={styles.printIcon} />
                    <span>Cocina</span>
                </button>
                <button className={styles.btnPrint} onClick={() => abrirModal('ticket')} title="Imprimir ticket cliente">
                    <MdReceipt className={styles.printIcon} />
                    <span>Ticket</span>
                </button>
            </div>
            ): ( 
            <div/>)}
            <div className={styles.spacer}></div>

            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>{usuario?.nombreReal || usuario?.username || 'Usuario'}</span>
                    <span className={styles.userRole}>{usuario?.rol || 'Admin'}</span>
                </div>
                <div className={styles.userAvatar}>
                    {usuario?.nombreReal?.charAt(0).toUpperCase() || usuario?.username.charAt(0).toUpperCase() || 'D' }
                </div>

                <button className={styles.logoutBtn} title="Cerrar sesión" onClick={onCerrarSesion}>
                    <MdLogout />
                </button>
            </div>
        </header>
        {/* MODAL DE SELECCIÓN DE PEDIDO */}
                  {modalImpresion && (
                      <div className={styles.modalOverlay} onClick={cerrarModal}>
                          <div className={styles.modalSelect} onClick={e => e.stopPropagation()}>
                              <div className={styles.modalSelectHeader}>
                                  <div className={styles.modalSelectIcon}>
                                      {modalImpresion === 'cocina' ? <MdRestaurant /> : <MdReceipt />}
                                  </div>
                                  <div>
                                      <h3 className={styles.modalSelectTitle}>
                                          {modalImpresion === 'cocina' ? 'Comanda de Cocina' : 'Ticket Cliente'}
                                      </h3>
                                      <p className={styles.modalSelectSubtitle}>Selecciona el pedido a imprimir</p>
                                  </div>
                              </div>
      
                              <div className={styles.pedidosList}>
                                  {pedidosActivos.length === 0 ? (
                                      <p className={styles.sinPedidos}>No hay pedidos activos</p>
                                  ) : (
                                      pedidosActivos.map(p => (
                                          <div
                                              key={p._id}
                                              className={`${styles.pedidoOption} ${pedidoSeleccionado?._id === p._id ? styles.pedidoOptionActivo : ''}`}
                                              onClick={() => setPedidoSeleccionado(p)}
                                          >
                                              <div className={styles.pedidoOptionLeft}>
                                                  <span className={styles.pedidoMesa}>Mesa {p.mesas?.join(' + ')}</span>
                                                  <span className={styles.pedidoCamarero}>por {p.camarero}</span>
                                              </div>
                                              <div className={styles.pedidoOptionRight}>
                                                 {pedidoSeleccionado?._id === p._id && (
                                                  <div className={styles.checkMark}>✓</div>
                                              )}
                                                  <span className={styles.pedidoTotal}>{p.total?.toFixed(2)}€</span>
                                                  <span className={styles.pedidoItems}>{p.items.length} items</span>
                                              </div>
                                             
                                          </div>
                                      ))
                                  )}
                              </div>
      
                              <div className={styles.modalSelectActions}>
                                  <button className={styles.btnCancelarModal} onClick={cerrarModal}>
                                      Cancelar
                                  </button>
                                  <button
                                      className={styles.btnImprimirModal}
                                      disabled={!pedidoSeleccionado}
                                      onClick={() => modalImpresion === 'cocina'
                                          ? imprimirCocina(pedidoSeleccionado)
                                          : imprimirTicket(pedidoSeleccionado)
                                      }
                                  >
                                      <MdPrint /> Imprimir
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}
              </>
          );
      };

export default Header;