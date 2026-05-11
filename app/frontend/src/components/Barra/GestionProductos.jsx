import React, { useState, useEffect } from 'react'
import styles from './GestionProductos.module.css';
import iconoLapiz from '../../assets/iconos/lapiz.png'


const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: '',
        precio: '',
        categoria: 'Cocina',
        sub: 'Starters',
        imagen: '',
        disponible: true
    });
    const [filtro, setFiltro] = useState('');
    const [editandoPrecio, setEditandoPrecio] = useState(null);
    const [nuevoPrecio, setNuevoPrecio] = useState('');

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    //función para cambiar Precio
    const cambiarPrecio = async (id) => {
        if (!nuevoPrecio || isNaN(nuevoPrecio)) return;
        await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ precio: parseFloat(nuevoPrecio) })
        });
        setEditandoPrecio(null);
        setNuevoPrecio('');
        obtenerProductos();
    };

    // Obtiene todos los productos de la BD
    const obtenerProductos = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`);
            const data = await res.json();
            setProductos(data.sort((a, b) => a.nombre.localeCompare(b.nombre)));
            setCargando(false);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    useEffect(() => { obtenerProductos(); }, []);

    // Crea un nuevo producto
    const handleCrear = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...nuevoProducto,
                    precio: parseFloat(nuevoProducto.precio)
                })
            });
            if (res.ok) {
                setNuevoProducto({ id: '', nombre: '', precio: '', categoria: 'Cocina', sub: 'Starters', imagen: '', disponible: true });
                obtenerProductos();
            } else {
                alert("Error al crear producto");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Activa o desactiva un producto
    const toggleDisponible = async (producto) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${producto._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ disponible: !producto.disponible })
            });
            obtenerProductos();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Cambia la imagen de un producto
    const cambiarImagen = async (id, nuevaImagen) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imagen: nuevaImagen })
            });
            obtenerProductos();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Elimina un producto
    const eliminarProducto = async (id, nombre) => {
        if (window.confirm(`¿Seguro que quieres eliminar ${nombre}?`)) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, { method: 'DELETE' });
            obtenerProductos();
        }
    };

    const subirImagen = async (archivo) => {
        const formData = new FormData();
        formData.append('imagen', archivo);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/upload-imagen`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        return data.nombreArchivo;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>GESTIÓN DE PRODUCTOS</h1>

            {/* Formulario para añadir nuevo producto */}
            <form className={styles.form} onSubmit={handleCrear}>
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={nuevoProducto.nombre}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Precio"
                    step="0.01"
                    value={nuevoProducto.precio}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                    required
                />
                <select
                    value={nuevoProducto.categoria}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                >
                    <option value="Cocina">Cocina</option>
                    <option value="Barra">Barra</option>
                </select>
                <select
                    value={nuevoProducto.sub}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, sub: e.target.value })}
                >
                    <option value="Starters">Entrantes</option>
                    <option value="Food">Segundos</option>
                    <option value="Drinks">Bebidas</option>
                    <option value="Desserts">Postres</option>
                </select>
                <label className={styles.labelFile}>
                    {nuevoProducto.imagen ? '✓ Imagen seleccionada' : 'Seleccionar imagen'}
                    <input
                        type="file"
                        accept="image/*"
                        className={styles.inputFile}
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                            const archivo = e.target.files[0];
                            if (archivo) {
                                const nombreArchivo = await subirImagen(archivo);
                                setNuevoProducto({ ...nuevoProducto, imagen: nombreArchivo });
                            }
                        }}
                    />
                </label>
                <button type="submit" className={styles.btnAdd}>+ Añadir</button>
            </form>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Tabla de productos */}
            {cargando ? <p>Cargando...</p> : (

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map(p => (
                            <tr key={p._id} className={!p.disponible ? styles.rowDesactivada : ''}>
                                <td>
                                    {p.imagen ? (
                                        <img src={`${import.meta.env.VITE_API_URL}/imgMenu/${p.imagen}`} alt={p.nombre} className={styles.imgProducto} />
                                    ) : (
                                        <span className="material-icons">restaurant</span>
                                    )}
                                </td>
                                <td>{p.nombre}</td>
                                <td>
                                    {editandoPrecio === p._id ? (
                                        <div className={styles.editPrecio}>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={nuevoPrecio}
                                                onChange={(e) => setNuevoPrecio(e.target.value)}
                                                className={styles.inputPrecio}
                                                autoFocus
                                            />
                                            <button className={styles.btnSave} onClick={() => cambiarPrecio(p._id)}>✓</button>
                                            <button className={styles.btnCancel} onClick={() => setEditandoPrecio(null)}>✕</button>
                                        </div>
                                    ) : (
                                        <span
                                            className={styles.precioEditable}
                                            onClick={() => { setEditandoPrecio(p._id); setNuevoPrecio(p.precio); }}
                                        >
                                            {p.precio?.toFixed(2)}€
                                            <img src={iconoLapiz} alt="editar" width={20} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                                        </span>
                                    )}
                                </td>
                                <td>{p.categoria}</td>
                                <td>
                                    <span className={`${styles.badge} ${styles[p.sub]}`}>
                                        {p.sub}
                                    </span>
                                </td>
                                <td>
                                    <span className={p.disponible ? styles.badgeActivo : styles.badgeInactivo}>
                                        {p.disponible ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        {/* Toggle disponible */}
                                        <button
                                            className={p.disponible ? styles.btnDesactivar : styles.btnActivar}
                                            onClick={() => toggleDisponible(p)}
                                        >
                                            {p.disponible ? 'Desactivar' : 'Activar'}
                                        </button>
                                        {/* Cambiar imagen */}
                                        <button
                                            className={styles.btnImagen}
                                            onClick={() => document.getElementById(`file-${p._id}`).click()}
                                        >
                                            Cambiar Imagen
                                        </button>
                                        <input
                                            id={`file-${p._id}`}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                const archivo = e.target.files[0];
                                                if (archivo) {
                                                    const nombreArchivo = await subirImagen(archivo);
                                                    cambiarImagen(p._id, nombreArchivo);
                                                }
                                            }}
                                        />
                                        {/* Eliminar */}
                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => eliminarProducto(p._id, p.nombre)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GestionProductos;