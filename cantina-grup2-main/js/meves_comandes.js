let todasLasComandas = [];
let comandasFiltradas = [];
let paginaActual = 1;
const comandasPorPagina = 5;

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
    cargarComandasUsuario();
    configurarEventos();
});

function verificarAutenticacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('userGreeting').textContent = `Hola, ${usuario.nom}!`;
}

async function cargarComandasUsuario() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await fetch(`http://localhost:3000/comandas/usuario/${usuario.id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar comandas');
        }
        
        const comandas = await response.json();
        todasLasComandas = comandas;
        comandasFiltradas = [...comandas];
        
        actualizarEstadisticas();
        renderizarComandas();
        actualizarPaginacion();
        
        document.getElementById('loadingComandas').style.display = 'none';
        
        if (comandas.length === 0) {
            document.getElementById('sinComandas').style.display = 'block';
            document.getElementById('listaComandas').style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingComandas').innerHTML = `
            <p style="color: #dc3545;">Error carregant les comandes. Torna-ho a provar.</p>
            <button onclick="cargarComandasUsuario()" class="btn-primario">Tornar a intentar</button>
        `;
    }
}

function filtrarComandas() {
    const filtroEstado = document.getElementById('filtroEstado').value;
    const filtroFecha = document.getElementById('filtroFecha').value;
    
    comandasFiltradas = todasLasComandas.filter(comanda => {
        let cumpleFiltro = true;
        
        if (filtroEstado !== 'tots' && comanda.estado !== filtroEstado) {
            cumpleFiltro = false;
        }
        
        if (filtroFecha) {
            const fechaComanda = new Date(comanda.fecha).toISOString().split('T')[0];
            if (fechaComanda !== filtroFecha) {
                cumpleFiltro = false;
            }
        }
        
        return cumpleFiltro;
    });
    
    paginaActual = 1;
    renderizarComandas();
    actualizarPaginacion();
}

function resetFiltros() {
    document.getElementById('filtroEstado').value = 'tots';
    document.getElementById('filtroFecha').value = '';
    comandasFiltradas = [...todasLasComandas];
    paginaActual = 1;
    renderizarComandas();
    actualizarPaginacion();
}

function renderizarComandas() {
    const lista = document.getElementById('listaComandas');
    
    if (comandasFiltradas.length === 0) {
        lista.innerHTML = `
            <div class="sin-comandas-filtro">
                <p>No s'han trobat comandes amb aquests filtres.</p>
                <button onclick="resetFiltros()" class="btn-primario">Netejar filtres</button>
            </div>
        `;
        return;
    }
    
    const inicio = (paginaActual - 1) * comandasPorPagina;
    const fin = inicio + comandasPorPagina;
    const comandasPagina = comandasFiltradas.slice(inicio, fin);
    
    lista.innerHTML = comandasPagina.map(comanda => {
        const fechaFormateada = new Date(comanda.fecha).toLocaleDateString('ca-ES');
        const horaFormateada = comanda.hora ? comanda.hora.substring(0, 5) : '';
        
        let productosTexto = 'No hi ha productes';
        if (comanda.productos && Array.isArray(comanda.productos)) {
            productosTexto = comanda.productos.map(p => 
                `${p.cantidad || 1}x ${p.nombre || p.nom || 'Producte'}`
            ).join(', ');
        } else if (comanda.productos_texto) {
            productosTexto = comanda.productos_texto;
        }
        
        const estadoClass = obtenerClaseEstado(comanda.estado);
        const estadoTexto = obtenerTextoEstado(comanda.estado);
        
        return `
            <div class="comanda-card">
                <div class="comanda-header">
                    <div class="comanda-info">
                        <span class="comanda-numero">Comanda #${comanda.id}</span>
                        <span class="comanda-fecha">${fechaFormateada} ${horaFormateada ? 'a les ' + horaFormateada : ''}</span>
                    </div>
                    <div class="comanda-total">${parseFloat(comanda.total).toFixed(2)}€</div>
                </div>
                
                <div class="comanda-body">
                    <div class="comanda-productos">
                        <p><strong>Productes:</strong> ${productosTexto}</p>
                    </div>
                    
                    <div class="comanda-estado">
                        <span class="badge-estado ${estadoClass}">${estadoTexto}</span>
                    </div>
                    
                    <div class="comanda-acciones">
                        <button onclick="verDetallesComanda(${comanda.id})" class="btn-detalles">
                            Veure detalls
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function actualizarEstadisticas() {
    const totalComandas = todasLasComandas.length;
    const gastTotal = todasLasComandas.reduce((total, comanda) => 
        total + parseFloat(comanda.total || 0), 0);
    
    document.getElementById('totalComandas').textContent = totalComandas;
    document.getElementById('gastTotal').textContent = gastTotal.toFixed(2);
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(comandasFiltradas.length / comandasPorPagina);
    
    document.getElementById('paginaActual').textContent = paginaActual;
    document.getElementById('btnAnterior').disabled = paginaActual === 1;
    document.getElementById('btnSiguiente').disabled = paginaActual === totalPaginas || totalPaginas === 0;
}

function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(comandasFiltradas.length / comandasPorPagina);
    
    if (direccion === 'siguiente' && paginaActual < totalPaginas) {
        paginaActual++;
    } else if (direccion === 'anterior' && paginaActual > 1) {
        paginaActual--;
    }
    
    renderizarComandas();
    actualizarPaginacion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function verDetallesComanda(id) {
    try {
        const response = await fetch(`http://localhost:3000/comandas/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar detalles');
        }
        
        const comanda = await response.json();
        
        const fecha = new Date(comanda.fecha);
        const fechaFormateada = fecha.toLocaleDateString('ca-ES');
        const horaFormateada = comanda.hora ? comanda.hora.substring(0, 5) : '';
        
        document.getElementById('modalNumeroComanda').textContent = comanda.id;
        document.getElementById('modalFecha').textContent = fechaFormateada;
        document.getElementById('modalHora').textContent = horaFormateada;
        document.getElementById('modalEstado').textContent = obtenerTextoEstado(comanda.estado);
        document.getElementById('modalTotal').textContent = `${parseFloat(comanda.total).toFixed(2)}€`;
        
        const cuerpoProductos = document.getElementById('modalCuerpoProductos');
        cuerpoProductos.innerHTML = '';
        
        let productos = [];
        if (Array.isArray(comanda.productos)) {
            productos = comanda.productos;
        } else if (comanda.productos) {
            try {
                productos = JSON.parse(comanda.productos);
                if (!Array.isArray(productos)) productos = [productos];
            } catch (e) {
                productos = [{ nombre: comanda.productos, cantidad: 1, precio: 0 }];
            }
        }
        
        productos.forEach(producto => {
            const subtotal = (producto.cantidad || 1) * (producto.precio || 0);
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.nombre || producto.nom || 'Producte'}</td>
                <td>${producto.cantidad || 1}</td>
                <td>${(producto.precio || 0).toFixed(2)}€</td>
                <td>${subtotal.toFixed(2)}€</td>
            `;
            cuerpoProductos.appendChild(fila);
        });
        
        const btnCancelar = document.getElementById('btnCancelarComandaModal');
        if (comanda.estado === 'pendent' || comanda.estado === 'preparant') {
            btnCancelar.style.display = 'inline-block';
            btnCancelar.onclick = () => cancelarComanda(id);
        } else {
            btnCancelar.style.display = 'none';
        }
        
        document.getElementById('modalDetalles').style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error carregant els detalls de la comanda');
    }
}

async function cancelarComanda(id) {
    if (!confirm('Estàs segur que vols cancel·lar aquesta comanda? Aquesta acció no es pot desfer.')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/comandas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estado: 'cancel·lat',
                productos: [],
                total: 0
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al cancelar comanda');
        }
        
        alert('Comanda cancel·lada correctament');
        cerrarModal();
        cargarComandasUsuario();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error cancel·lant la comanda');
    }
}

function cerrarModal() {
    document.getElementById('modalDetalles').style.display = 'none';
}

function obtenerClaseEstado(estado) {
    const clases = {
        'pendent': 'estado-pendiente',
        'preparant': 'estado-preparando',
        'llest': 'estado-listo',
        'completat': 'estado-completado',
        'cancel·lat': 'estado-cancelado'
    };
    return clases[estado] || 'estado-pendiente';
}

function obtenerTextoEstado(estado) {
    const textos = {
        'pendent': 'Pendent',
        'preparant': 'En preparació',
        'llest': 'Llest per recollir',
        'completat': 'Completat',
        'cancel·lat': 'Cancel·lat'
    };
    return textos[estado] || estado;
}

function configurarEventos() {
    document.addEventListener('click', function(event) {
        if (event.target === document.getElementById('modalDetalles')) {
            cerrarModal();
        }
    });
}

function logout() {
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
}