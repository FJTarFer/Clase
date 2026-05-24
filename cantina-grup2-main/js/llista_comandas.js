document.addEventListener('DOMContentLoaded', function () {
    cargarComandas();
    configurarFiltros();
    actualizarEstadisticas();
});

function cargarComandas(filtroEstado = 'tots', filtroData = '') {
    fetch('/comandas/lista')
        .then(res => {
            if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return res.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Los datos recibidos no son válidos');
            }

            let comandasFiltradas = data;

            if (filtroEstado !== 'tots') {
                comandasFiltradas = comandasFiltradas.filter(c => c.estado === filtroEstado);
            }

            if (filtroData) {
                comandasFiltradas = comandasFiltradas.filter(c => {
                    const fechaComanda = c.fecha || (c.fecha_hora ? c.fecha_hora.split('T')[0] : '');
                    return fechaComanda === filtroData;
                });
            }

            mostrarComandasEnTabla(comandasFiltradas);
            actualizarEstadisticas(data);
        })
        .catch(error => {
            console.error('Error al cargar comandas:', error);
            const cuerpoTabla = document.getElementById('cuerpoTablaComandas');
            cuerpoTabla.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: red;">
                        Error al cargar las comandas. Verifica la conexión con el servidor.
                    </td>
                </tr>
            `;
        });
}

function mostrarComandasEnTabla(comandas) {
    const cuerpoTabla = document.getElementById('cuerpoTablaComandas');
    cuerpoTabla.innerHTML = '';

    if (comandas.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    No hi ha comandes que coincideixin amb els filtres
                </td>
            </tr>
        `;
        return;
    }

    comandas.forEach(comanda => {
        const fila = document.createElement('tr');
        
        const elementosResumen = obtenerResumenProductos(comanda.productos);
        const clienteNombre = obtenerNombreCliente(comanda);
        const { fecha, hora } = obtenerFechaHora(comanda);
        const total = comanda.total || 0;
        const estado = comanda.estado || 'pendent';

        fila.innerHTML = `
            <td>${comanda.id}</td>
            <td>${clienteNombre}</td>
            <td>${fecha} ${hora}</td>
            <td>${elementosResumen}</td>
            <td>${total.toFixed(2)}€</td>
            <td><span class="estado-badge estado-${estado}">${obtenerTextoEstado(estado)}</span></td>
            <td>
                <button class="btn-primario btn-pequeno" onclick="editarComanda('${comanda.id}')">Editar</button>
                <button class="btn-peligro btn-pequeno" onclick="eliminarComanda('${comanda.id}')">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

function obtenerResumenProductos(productos) {
    if (!productos) return 'Sense productes';
    
    // Si productos ya es un texto (no array)
    if (typeof productos === 'string') {
        return productos;
    }
    
    if (Array.isArray(productos)) {
        return productos.map(p => {
            if (typeof p === 'object') {
                return `${p.cantidad || 1}x ${p.nombre || p.nom || 'Producte'}`;
            }
            return p;
        }).join(', ');
    }
    
    return 'Productes no disponibles';
}

function obtenerNombreCliente(comanda) {
    if (comanda.cliente_nombre) return comanda.cliente_nombre;
    if (comanda.nom) return comanda.nom;
    if (comanda.nombre_cliente) return comanda.nombre_cliente;
    return 'Client no registrat';
}

function obtenerFechaHora(comanda) {
    let fecha = '';
    let hora = '';
    
    if (comanda.fecha && comanda.hora) {
        fecha = formatearFecha(comanda.fecha);
        hora = comanda.hora.substring(0, 5);
    } else if (comanda.fecha_hora) {
        const fechaObj = new Date(comanda.fecha_hora);
        fecha = formatearFecha(fechaObj.toISOString().split('T')[0]);
        hora = fechaObj.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (comanda.fecha) {
        fecha = formatearFecha(comanda.fecha);
    }
    
    return { fecha, hora };
}

function configurarFiltros() {
    document.getElementById('btnAplicarFiltros').addEventListener('click', function () {
        const filtroEstado = document.getElementById('filtroEstado').value;
        const filtroData = document.getElementById('filtroData').value;
        cargarComandas(filtroEstado, filtroData);
    });

    document.getElementById('btnResetFiltros').addEventListener('click', function () {
        document.getElementById('filtroEstado').value = 'tots';
        document.getElementById('filtroData').value = '';
        cargarComandas();
        actualizarEstadisticas();
    });
}

function actualizarEstadisticas() {
    fetch('/comandas/lista')
        .then(res => res.json())
        .then(comandas => {
            const totalComandas = comandas.length;
            const comandasPendientes = comandas.filter(c => c.estado === 'pendent').length;
            const comandasPreparacion = comandas.filter(c => c.estado === 'preparant').length;
            const hoy = new Date().toISOString().split('T')[0];
            
            const ingresosHoy = comandas
                .filter(c => {
                    const fechaComanda = c.fecha || (c.fecha_hora ? c.fecha_hora.split('T')[0] : '');
                    return fechaComanda === hoy && c.estado === 'completat';
                })
                .reduce((total, c) => total + (c.total || 0), 0);

            document.getElementById('totalComandas').textContent = totalComandas;
            document.getElementById('comandasPendientes').textContent = comandasPendientes;
            document.getElementById('comandasPreparacion').textContent = comandasPreparacion;
            document.getElementById('ingresosHoy').textContent = ingresosHoy.toFixed(2) + '€';
        })
        .catch(error => {
            console.error('Error al actualizar estadísticas:', error);
        });
}

// En llista_comandas.js, en la función de editar:
function editarComanda(id) {
    window.location.href = `editar_comanda.html?id=${id}`;
}

function eliminarComanda(idComanda) {
    if (confirm(`Estàs segur que vols eliminar la comanda ${idComanda}?`)) {
        fetch(`/comandas/${idComanda}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    cargarComandas();
                    actualizarEstadisticas();
                    alert('Comanda eliminada correctament');
                }
            })
            .catch(error => {
                console.error('Error al eliminar comanda:', error);
                alert('Error al eliminar la comanda');
            });
    }
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fecha + 'T00:00:00').toLocaleDateString('ca-ES', opciones);
}

function obtenerTextoEstado(estado) {
    const estados = {
        'pendent': 'Pendent',
        'preparant': 'En preparació',
        'llest': 'Llest per recollir',
        'completat': 'Completat',
        'cancel·lat': 'Cancel·lat'
    };
    return estados[estado] || estado;
}