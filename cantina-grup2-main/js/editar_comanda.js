let comandaEditando = null;
let platosCombinados = [];
let productosLista = [];
let todasLasComandas = [];

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const idComanda = urlParams.get('id');
    
    if (idComanda) {
        cargarDatosIniciales(idComanda);
    } else {
        mostrarSelectorComandas();
    }
});

function mostrarSelectorComandas() {
    fetch('http://localhost:3000/comandas/lista')
        .then(res => res.json())
        .then(comandas => {
            todasLasComandas = comandas;
            
            if (comandas.length === 0) {
                mostrarMensajeSinComandas();
                return;
            }
            
            crearSelectorComandas(comandas);
        })
        .catch(error => {
            console.error('Error cargando comandas:', error);
            mostrarMensajeError();
        });
}

function mostrarMensajeSinComandas() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>Editar Comanda</h1>
            <nav>
                <a href="llista_comandas.html">Tornar a Llista de Comandes</a>
                <a href="admin_dashboard.html">Tornar al Menu</a>
            </nav>
        </header>
        
        <div class="mensaje-info">
            <h3>No hi ha comandes disponibles</h3>
            <p>No s'ha trobat cap comanda per editar.</p>
            <button onclick="window.location.href='llista_comandas.html'" class="btn-primario">
                Veure totes les comandes
            </button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .mensaje-info {
            text-align: center;
            padding: 40px 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-top: 30px;
        }
        
        .mensaje-info h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        
        .mensaje-info p {
            color: #6c757d;
            margin-bottom: 20px;
        }
    `;
    document.head.appendChild(style);
}

function mostrarMensajeError() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>Editar Comanda</h1>
            <nav>
                <a href="llista_comandas.html">Tornar a Llista de Comandes</a>
                <a href="admin_dashboard.html">Tornar al Menu</a>
            </nav>
        </header>
        
        <div class="mensaje-error">
            <h3>Error carregant comandes</h3>
            <p>Ha ocorregut un error al cargar les comandes. Torna-ho a provar.</p>
            <button onclick="location.reload()" class="btn-primario">Tornar a provar</button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .mensaje-error {
            text-align: center;
            padding: 40px 20px;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            margin-top: 30px;
        }
        
        .mensaje-error h3 {
            color: #721c24;
            margin-bottom: 15px;
        }
        
        .mensaje-error p {
            color: #721c24;
            margin-bottom: 20px;
        }
    `;
    document.head.appendChild(style);
}

function crearSelectorComandas(comandas) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>Seleccionar Comanda per Editar</h1>
            <nav>
                <a href="llista_comandas.html">Tornar a Llista de Comandes</a>
                <a href="admin_dashboard.html">Tornar al Menu</a>
            </nav>
        </header>
        
        <div class="selector-comanda">
            <h3>Selecciona una comanda</h3>
            <div class="tabla-comandas-selector">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Total</th>
                            <th>Estat</th>
                            <th>Acció</th>
                        </tr>
                    </thead>
                    <tbody id="listaComandasSelector">
                        <!-- Se llenará dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    const lista = document.getElementById('listaComandasSelector');
    
    comandas.forEach(comanda => {
        const fila = document.createElement('tr');
        
        let estadoClass = '';
        switch(comanda.estado) {
            case 'pendent':
                estadoClass = 'estado-pendiente';
                break;
            case 'preparant':
                estadoClass = 'estado-preparando';
                break;
            case 'llest':
                estadoClass = 'estado-listo';
                break;
            case 'completat':
                estadoClass = 'estado-completado';
                break;
            case 'cancel·lat':
                estadoClass = 'estado-cancelado';
                break;
            default:
                estadoClass = 'estado-pendiente';
        }
        
        fila.innerHTML = `
            <td>${comanda.id}</td>
            <td>${comanda.cliente_nombre || 'Client no registrat'}</td>
            <td>${comanda.fecha || ''}</td>
            <td>${comanda.hora || ''}</td>
            <td>${comanda.total ? parseFloat(comanda.total).toFixed(2) + '€' : '0.00€'}</td>
            <td><span class="badge-estado ${estadoClass}">${comanda.estado || 'pendent'}</span></td>
            <td>
                <button class="btn-seleccionar" data-id="${comanda.id}">Seleccionar</button>
            </td>
        `;
        
        lista.appendChild(fila);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .selector-comanda {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-top: 20px;
        }
        
        .selector-comanda h3 {
            margin-top: 0;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        .tabla-comandas-selector table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .tabla-comandas-selector th {
            background-color: #f8f9fa;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
            color: #495057;
            font-weight: 600;
        }
        
        .tabla-comandas-selector td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
        }
        
        .tabla-comandas-selector tbody tr:hover {
            background-color: #f8f9fa;
        }
        
        .badge-estado {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .estado-pendiente {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .estado-preparando {
            background-color: #d1ecf1;
            color: #0c5460;
        }
        
        .estado-listo {
            background-color: #d4edda;
            color: #155724;
        }
        
        .estado-completado {
            background-color: #c3e6cb;
            color: #155724;
        }
        
        .estado-cancelado {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .btn-seleccionar {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        }
        
        .btn-seleccionar:hover {
            background-color: #2980b9;
        }
    `;
    document.head.appendChild(style);
    
    document.querySelectorAll('.btn-seleccionar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            window.location.href = `editar_comanda.html?id=${id}`;
        });
    });
}

function cargarDatosIniciales(idComanda) {
    Promise.all([
        fetch(`http://localhost:3000/comandas/${idComanda}`).then(res => res.json()),
        fetch('http://localhost:3000/plats-combinats').then(res => res.json()),
        fetch('http://localhost:3000/productos').then(res => res.json())
    ])
    .then(([comandaData, platosData, productosData]) => {
        if (comandaData.error) {
            throw new Error(comandaData.error);
        }
        
        comandaEditando = {
            id: comandaData.id,
            cliente: {
                nombre: comandaData.cliente_nombre || 'Client no registrat',
                email: comandaData.cliente_email || 'Sense email',
                rol: comandaData.cliente_rol || 'Sense rol'
            },
            fecha: comandaData.fecha ? comandaData.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
            hora: comandaData.hora || '12:00',
            elementos: Array.isArray(comandaData.productos) ? comandaData.productos : [],
            total: parseFloat(comandaData.total) || 0,
            estado: comandaData.estado || 'pendent'
        };
        
        platosCombinados = platosData;
        productosLista = productosData;
        
        cargarDatosComanda();
        configurarEventos();
        cargarSelects();
    })
    .catch(error => {
        console.error('Error cargando datos:', error);
        alert('Error carregant les dades de la comanda: ' + error.message);
        window.location.href = 'llista_comandas.html';
    });
}

function cargarDatosComanda() {
    document.getElementById('numeroComanda').textContent = comandaEditando.id;
    document.getElementById('clienteNombre').textContent = comandaEditando.cliente.nombre;
    document.getElementById('clienteEmail').textContent = comandaEditando.cliente.email;
    document.getElementById('clienteRol').textContent = comandaEditando.cliente.rol;
    document.getElementById('comandaFecha').textContent = formatearFecha(comandaEditando.fecha);
    document.getElementById('comandaHora').textContent = comandaEditando.hora;
    document.getElementById('estadoComanda').value = comandaEditando.estado;
    
    cargarElementosComanda();
    actualizarTotalComanda();
}

function cargarElementosComanda() {
    const cuerpoTabla = document.getElementById('cuerpoElementosComanda');
    cuerpoTabla.innerHTML = '';
    
    if (!comandaEditando.elementos || comandaEditando.elementos.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">
                    No hi ha elements en aquesta comanda
                </td>
            </tr>
        `;
        return;
    }
    
    comandaEditando.elementos.forEach((elemento, index) => {
        const fila = document.createElement('tr');
        const subtotal = (elemento.cantidad || 1) * (elemento.precio || 0);
        
        fila.innerHTML = `
            <td>${elemento.nombre || elemento.nom || 'Producte sense nom'}</td>
            <td>${obtenerTipoTexto(elemento.tipo || elemento.categoria || 'producto')}</td>
            <td>
                <input type="number" min="1" value="${elemento.cantidad || 1}" 
                       onchange="actualizarCantidad(${index}, this.value)" 
                       style="width: 60px;">
            </td>
            <td>${(elemento.precio || 0).toFixed(2)}€</td>
            <td>${subtotal.toFixed(2)}€</td>
            <td>
                <button class="btn-peligro btn-pequeno" onclick="eliminarElemento(${index})">Eliminar</button>
            </td>
        `;
        
        cuerpoTabla.appendChild(fila);
    });
}

function cargarSelects() {
    const selectPlat = document.getElementById('selectPlat');
    selectPlat.innerHTML = '<option value="">Selecciona un plat</option>';
    platosCombinados.forEach(plat => {
        if (plat.activo !== 0) {
            const option = document.createElement('option');
            option.value = plat.id;
            option.textContent = `${plat.nombre} - ${parseFloat(plat.precio).toFixed(2)}€`;
            option.setAttribute('data-precio', plat.precio);
            option.setAttribute('data-nombre', plat.nombre);
            selectPlat.appendChild(option);
        }
    });
    
    const selectProducto = document.getElementById('selectProducto');
    selectProducto.innerHTML = '<option value="">Selecciona un producte</option>';
    productosLista.forEach(producto => {
        if (producto.activo !== 0) {
            const option = document.createElement('option');
            option.value = producto.id;
            option.textContent = `${producto.nombre} - ${parseFloat(producto.precio).toFixed(2)}€`;
            option.setAttribute('data-precio', producto.precio);
            option.setAttribute('data-nombre', producto.nombre);
            option.setAttribute('data-tipo', producto.tipo);
            selectProducto.appendChild(option);
        }
    });
}

function configurarEventos() {
    document.getElementById('btnAgregarElemento').addEventListener('click', function() {
        document.getElementById('formAgregarElemento').style.display = 'block';
    });
    
    document.getElementById('btnCancelarAgregar').addEventListener('click', function() {
        document.getElementById('formAgregarElemento').style.display = 'none';
        document.getElementById('formNuevoElemento').reset();
        document.getElementById('grupoPlat').style.display = 'none';
        document.getElementById('grupoProducto').style.display = 'none';
    });
    
    document.getElementById('tipoElemento').addEventListener('change', function() {
        const tipo = this.value;
        
        document.getElementById('grupoPlat').style.display = 'none';
        document.getElementById('grupoProducto').style.display = 'none';
        
        if (tipo === 'plat') {
            document.getElementById('grupoPlat').style.display = 'block';
        } else if (['beguda', 'snack', 'brioixeria'].includes(tipo)) {
            document.getElementById('grupoProducto').style.display = 'block';
            filtrarProductosPorTipo(tipo);
        }
    });
    
    document.getElementById('formNuevoElemento').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarElementoComanda();
    });
    
    document.getElementById('btnGuardarCambios').addEventListener('click', function() {
        guardarCambiosComanda();
    });
    
    document.getElementById('btnCancelarComanda').addEventListener('click', function() {
        if (confirm('Estàs segur que vols cancel·lar aquesta comanda?')) {
            comandaEditando.estado = 'cancel·lat';
            guardarCambiosComanda();
        }
    });
    
    document.getElementById('btnEliminarComanda').addEventListener('click', function() {
        if (confirm('Estàs segur que vols eliminar aquesta comanda? Aquesta acció no es pot desfer.')) {
            eliminarComanda();
        }
    });
}

function filtrarProductosPorTipo(tipo) {
    const selectProducto = document.getElementById('selectProducto');
    const options = selectProducto.querySelectorAll('option');
    
    options.forEach(option => {
        if (option.value === '') return;
        
        const productoTipo = option.getAttribute('data-tipo');
        option.style.display = productoTipo === tipo ? '' : 'none';
    });
    
    selectProducto.value = '';
}

function agregarElementoComanda() {
    const tipo = document.getElementById('tipoElemento').value;
    const cantidad = parseInt(document.getElementById('cantidadElemento').value);
    
    if (cantidad < 1) {
        alert('La quantitat ha de ser almenys 1');
        return;
    }
    
    let elemento = null;
    
    if (tipo === 'plat') {
        const platId = document.getElementById('selectPlat').value;
        const platSeleccionado = platosCombinados.find(p => p.id == platId);
        
        if (!platSeleccionado) {
            alert('Selecciona un plat vàlid');
            return;
        }
        
        elemento = {
            id: platSeleccionado.id,
            tipo: 'plat',
            nombre: platSeleccionado.nombre,
            cantidad: cantidad,
            precio: parseFloat(platSeleccionado.precio)
        };
    } else {
        const productoId = document.getElementById('selectProducto').value;
        const producteSeleccionat = productosLista.find(p => p.id == productoId);
        
        if (!producteSeleccionat) {
            alert('Selecciona un producte vàlid');
            return;
        }
        
        elemento = {
            id: producteSeleccionat.id,
            tipo: tipo,
            nombre: producteSeleccionat.nombre,
            cantidad: cantidad,
            precio: parseFloat(producteSeleccionat.precio)
        };
    }
    
    if (!comandaEditando.elementos) {
        comandaEditando.elementos = [];
    }
    
    const existeIndex = comandaEditando.elementos.findIndex(e => 
        e.id === elemento.id && e.tipo === elemento.tipo
    );
    
    if (existeIndex !== -1) {
        comandaEditando.elementos[existeIndex].cantidad += cantidad;
    } else {
        comandaEditando.elementos.push(elemento);
    }
    
    cargarElementosComanda();
    actualizarTotalComanda();
    
    document.getElementById('formAgregarElemento').style.display = 'none';
    document.getElementById('formNuevoElemento').reset();
    document.getElementById('grupoPlat').style.display = 'none';
    document.getElementById('grupoProducto').style.display = 'none';
}

function actualizarCantidad(index, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    if (cantidad < 1) {
        alert('La quantitat ha de ser almenys 1');
        return;
    }
    
    comandaEditando.elementos[index].cantidad = cantidad;
    actualizarTotalComanda();
}

function eliminarElemento(index) {
    if (confirm('Estàs segur que vols eliminar aquest element de la comanda?')) {
        comandaEditando.elementos.splice(index, 1);
        cargarElementosComanda();
        actualizarTotalComanda();
    }
}

function actualizarTotalComanda() {
    if (!comandaEditando.elementos || comandaEditando.elementos.length === 0) {
        comandaEditando.total = 0;
        document.getElementById('totalComanda').textContent = '0.00€';
        return;
    }
    
    const total = comandaEditando.elementos.reduce((sum, elemento) => {
        return sum + ((elemento.cantidad || 1) * (elemento.precio || 0));
    }, 0);
    
    comandaEditando.total = total;
    document.getElementById('totalComanda').textContent = total.toFixed(2) + '€';
}

function guardarCambiosComanda() {
    comandaEditando.estado = document.getElementById('estadoComanda').value;
    
    const comandaData = {
        estado: comandaEditando.estado,
        productos: comandaEditando.elementos,
        total: comandaEditando.total
    };
    
    fetch(`http://localhost:3000/comandas/${comandaEditando.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comandaData)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.error); });
        }
        return res.json();
    })
    .then(data => {
        alert('Comanda actualitzada correctament');
        window.location.href = 'llista_comandas.html';
    })
    .catch(error => {
        console.error('Error guardando comanda:', error);
        alert('Error guardant la comanda: ' + error.message);
    });
}

function eliminarComanda() {
    fetch(`http://localhost:3000/comandas/${comandaEditando.id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.error); });
        }
        return res.json();
    })
    .then(data => {
        alert('Comanda eliminada correctament');
        window.location.href = 'llista_comandas.html';
    })
    .catch(error => {
        console.error('Error eliminando comanda:', error);
        alert('Error eliminant la comanda: ' + error.message);
    });
}

function obtenerTipoTexto(tipo) {
    const tipos = {
        'plat': 'Plat Combinat',
        'beguda': 'Beguda',
        'snack': 'Snack',
        'brioixeria': 'Brioxeria',
        'producto': 'Producte',
        'carn': 'Carn',
        'peix': 'Peix',
        'vegetaria': 'Vegetarià'
    };
    
    return tipos[tipo] || tipo;
}

function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
        return fecha;
    }
    
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return fechaObj.toLocaleDateString('ca-ES', opciones);
}