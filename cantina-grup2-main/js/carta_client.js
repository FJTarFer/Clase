let comanda = [];
let productosCargados = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Documento cargado, iniciando vista cliente...');
    
    cargarComandaLocal();
    configurarInterfaz();
    cargarProductosDelBackend();
});

function cargarComandaLocal() {
    try {
        const comandaGuardada = localStorage.getItem('comandaCliente');
        if (comandaGuardada) {
            comanda = JSON.parse(comandaGuardada);
            console.log(`Comanda cargada: ${comanda.length} productos`);
        } else {
            comanda = [];
            console.log('No hay comanda guardada');
        }
    } catch (error) {
        console.error('Error cargando comanda de localStorage:', error);
        comanda = [];
    }
    
    actualizarContadorComanda();
}

function configurarInterfaz() {
    configurarNavegacionCategorias();
    configurarModalComanda();
    configurarDelegacionEventos();
}

function configurarNavegacionCategorias() {
    const botonesCategoria = document.querySelectorAll('.categoria-btn');
    
    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            
            botonesCategoria.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.categoria-section').forEach(seccion => {
                seccion.classList.remove('active');
            });
            
            const seccionMostrar = document.getElementById(`seccion-${categoria}`);
            if (seccionMostrar) {
                seccionMostrar.classList.add('active');
            }
        });
    });
}

function configurarDelegacionEventos() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-agregar')) {
            manejarAgregarProducto(event.target);
        }
    });
}

function manejarAgregarProducto(boton) {
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));
    const tipo = boton.getAttribute('data-tipo');
    
    if (!id || !nombre || !precio || !tipo) {
        console.error('Datos incompletos en botón:', {id, nombre, precio, tipo});
        return;
    }
    
    if (nombre.toLowerCase().includes('frankfurt')) {
        cargarSalsasParaProducto(id, nombre, precio, tipo, boton);
    } else {
        agregarProductoComanda(id, nombre, precio, tipo, []);
        
        boton.textContent = 'Afegit!';
        boton.style.backgroundColor = '#28a745';
        boton.disabled = true;
        
        setTimeout(() => {
            boton.textContent = 'Afegir a Comanda';
            boton.style.backgroundColor = '';
            boton.disabled = false;
        }, 1000);
    }
}

function cargarSalsasParaProducto(productoId, productoNombre, productoPrecio, productoTipo, botonOriginal) {
    fetch(`http://localhost:3000/producto/${productoId}/salsas`)
        .then(response => response.json())
        .then(salsas => {
            if (salsas.length === 0) {
                agregarProductoComanda(productoId, productoNombre, productoPrecio, productoTipo, []);
                mostrarFeedbackBoton(botonOriginal);
                return;
            }
            
            const modalSalsas = document.createElement('div');
            modalSalsas.className = 'modal-salsas';
            modalSalsas.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.3);
                z-index: 1000;
                min-width: 300px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
            `;
            
            let html = `
                <h3 style="margin-top: 0; color: #333;">Tria les salses per al ${productoNombre}</h3>
                <div class="salsas-lista" style="margin: 15px 0;">
            `;
            
            salsas.forEach(salsa => {
                html += `
                    <div style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px;">
                        <label style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <input type="checkbox" 
                                       class="salsa-checkbox" 
                                       value="${salsa.id}" 
                                       data-nombre="${salsa.nombre}"
                                       data-precio="${salsa.precio_extra}"
                                       style="margin-right: 10px;">
                                <span style="font-weight: 500;">${salsa.nombre}</span>
                            </div>
                            ${salsa.precio_extra > 0 ? 
                                `<span style="color: #4CAF50; font-weight: bold;">+${salsa.precio_extra}€</span>` : 
                                '<span style="color: #666;">Gratis</span>'}
                        </label>
                    </div>
                `;
            });
            
            html += `
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
                    <button id="cancelarSalsas" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        Cancel·lar
                    </button>
                    <button id="confirmarSalsas" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        Afegir al carrito
                    </button>
                </div>
            `;
            
            modalSalsas.innerHTML = html;
            document.body.appendChild(modalSalsas);
            
            modalSalsas.dataset.productoId = productoId;
            modalSalsas.dataset.productoNombre = productoNombre;
            modalSalsas.dataset.productoPrecio = productoPrecio;
            modalSalsas.dataset.productoTipo = productoTipo;
            modalSalsas.dataset.botonOriginal = botonOriginal;
            
            document.getElementById('cancelarSalsas').onclick = () => {
                document.body.removeChild(modalSalsas);
                mostrarFeedbackBoton(botonOriginal, true);
            };
            
            document.getElementById('confirmarSalsas').onclick = () => {
                const salsasSeleccionadas = [];
                const checkboxes = modalSalsas.querySelectorAll('.salsa-checkbox:checked');
                
                checkboxes.forEach(checkbox => {
                    salsasSeleccionadas.push({
                        id: parseInt(checkbox.value),
                        nombre: checkbox.dataset.nombre,
                        precio_extra: parseFloat(checkbox.dataset.precio)
                    });
                });
                
                const precioBase = parseFloat(modalSalsas.dataset.productoPrecio);
                const precioExtra = salsasSeleccionadas.reduce((sum, salsa) => sum + salsa.precio_extra, 0);
                const precioTotal = precioBase + precioExtra;
                
                agregarProductoComanda(
                    parseInt(modalSalsas.dataset.productoId),
                    modalSalsas.dataset.productoNombre,
                    precioTotal,
                    modalSalsas.dataset.productoTipo,
                    salsasSeleccionadas
                );
                
                document.body.removeChild(modalSalsas);
                mostrarFeedbackBoton(botonOriginal);
                mostrarNotificacion(`${modalSalsas.dataset.productoNombre} afegit al carrito amb ${salsasSeleccionadas.length} salsa(s)`);
            };
        })
        .catch(error => {
            console.error('Error cargando salsas:', error);
            agregarProductoComanda(productoId, productoNombre, productoPrecio, productoTipo, []);
            mostrarFeedbackBoton(botonOriginal);
        });
}

function mostrarFeedbackBoton(boton, cancelado = false) {
    if (!boton) return;
    
    if (!cancelado) {
        boton.textContent = 'Afegit!';
        boton.style.backgroundColor = '#28a745';
        boton.disabled = true;
        
        setTimeout(() => {
            boton.textContent = 'Afegir a Comanda';
            boton.style.backgroundColor = '';
            boton.disabled = false;
        }, 1000);
    } else {
        boton.textContent = 'Afegir a Comanda';
        boton.style.backgroundColor = '';
        boton.disabled = false;
    }
}

function configurarModalComanda() {
    const modal = document.getElementById('modalComanda');
    const btnVerComanda = document.getElementById('btnVerComanda');
    const spanClose = document.querySelector('.close');
    const btnCancelar = document.getElementById('btnCancelarComanda');
    const btnConfirmar = document.getElementById('btnConfirmarComanda');
    const btnVaciar = document.getElementById('btnVaciarComanda');

    if (btnVerComanda) {
        btnVerComanda.addEventListener('click', function() {
            mostrarComandaModal();
            modal.style.display = 'block';
        });
    }

    if (spanClose) {
        spanClose.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    if (btnVaciar) {
        btnVaciar.addEventListener('click', function() {
            if (comanda.length === 0) {
                alert('La comanda ja està buida.');
                return;
            }
            
            if (confirm('Estàs segur que vols buidar tota la comanda? Aquesta acció no es pot desfer.')) {
                comanda = [];
                localStorage.removeItem('comandaCliente');
                actualizarContadorComanda();
                mostrarComandaModal();
                modal.style.display = 'none';
                alert('Comanda buidada correctament');
            }
        });
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', async function() {
            await confirmarComandaConSalsas(modal);
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

async function cargarProductosDelBackend() {
    try {
        console.log('Iniciando carga de productos desde el servidor...');
        mostrarEstadoCarga('Cargando productos desde la base de datos...');
        
        // Cargar platos combinados desde la ruta correcta
        const [platosResponse, productosResponse] = await Promise.all([
            fetch('http://localhost:3000/plats-combinats'),
            fetch('http://localhost:3000/productos')
        ]);
        
        if (!platosResponse.ok) {
            throw new Error(`Error al cargar platos: ${platosResponse.status}`);
        }
        
        if (!productosResponse.ok) {
            throw new Error(`Error al cargar productos: ${productosResponse.status}`);
        }
        
        const platos = await platosResponse.json();
        const productos = await productosResponse.json();
        
        console.log(`Platos cargados: ${platos.length}`);
        console.log(`Productos cargados: ${productos.length}`);
        
        productosCargados = true;
        organizarYMostrarProductos(platos, productos);
        ocultarEstadoCarga();
        
    } catch (error) {
        console.error('Error crítico al cargar productos:', error);
        mostrarErrorCarga('Error al cargar productos. Mostrando datos de ejemplo.');
        
        setTimeout(() => {
            mostrarProductosEjemplo();
        }, 1000);
    }
}

function mostrarEstadoCarga(mensaje) {
    const grids = document.querySelectorAll('.productos-grid');
    grids.forEach(grid => {
        grid.innerHTML = `<div class="cargando">${mensaje}</div>`;
    });
}

function ocultarEstadoCarga() {
    const elementosCarga = document.querySelectorAll('.cargando, .error-carga');
    elementosCarga.forEach(el => el.remove());
}

function mostrarErrorCarga(mensaje) {
    const grids = document.querySelectorAll('.productos-grid');
    grids.forEach(grid => {
        grid.innerHTML = `
            <div class="error-carga">
                <p>${mensaje}</p>
                <button onclick="location.reload()">Reintentar</button>
            </div>
        `;
    });
}

function organizarYMostrarProductos(platos, productos) {
    // Convertir platos a formato similar a productos para mostrar
    const platosFormateados = platos.map(plat => ({
        id: plat.id,
        nombre: plat.nombre,
        descripcion: plat.descripcion || 'Plat combinat',
        precio: parseFloat(plat.precio),
        tipo: 'plat',
        activo: plat.activo,
        alergenos: [] // Los platos combinados no tienen alergenos en tu estructura actual
    }));
    
    const productosPorCategoria = {
        plats: platosFormateados.filter(p => p.activo !== 0),
        begudes: productos.filter(p => p.tipo === 'beguda' && p.activo !== 0),
        snacks: productos.filter(p => p.tipo === 'snack' && p.activo !== 0),
        brioixeria: productos.filter(p => p.tipo === 'brioixeria' && p.activo !== 0)
    };
    
    actualizarSeccionProductos('plats', productosPorCategoria.plats);
    actualizarSeccionProductos('begudes', productosPorCategoria.begudes);
    actualizarSeccionProductos('snacks', productosPorCategoria.snacks);
    actualizarSeccionProductos('brioixeria', productosPorCategoria.brioixeria);
}

function actualizarSeccionProductos(categoriaId, productos) {
    const seccion = document.getElementById(`seccion-${categoriaId}`);
    if (!seccion) {
        console.error(`No se encontró la sección: ${categoriaId}`);
        return;
    }
    
    const grid = seccion.querySelector('.productos-grid');
    if (!grid) {
        console.error(`No se encontró grid en sección: ${categoriaId}`);
        return;
    }
    
    grid.innerHTML = '';
    
    if (!productos || productos.length === 0) {
        grid.innerHTML = '<p class="sin-productos">No hay productos disponibles en esta categoría</p>';
        return;
    }
    
    productos.forEach(producto => {
        const tarjeta = crearTarjetaProducto(producto);
        grid.appendChild(tarjeta);
    });
}

function crearTarjetaProducto(producto) {
    const div = document.createElement('div');
    div.className = 'producto-card';
    
    let alergenosArray = [];
    if (producto.alergenos) {
        if (Array.isArray(producto.alergenos)) {
            alergenosArray = producto.alergenos.map(alergeno => {
                if (typeof alergeno === 'object' && alergeno !== null) {
                    return alergeno.nombre || alergeno.nom || JSON.stringify(alergeno);
                }
                return String(alergeno);
            });
        } else if (typeof producto.alergenos === 'string') {
            try {
                const parsed = JSON.parse(producto.alergenos);
                if (Array.isArray(parsed)) {
                    alergenosArray = parsed.map(alergeno => {
                        if (typeof alergeno === 'object' && alergeno !== null) {
                            return alergeno.nombre || alergeno.nom || JSON.stringify(alergeno);
                        }
                        return String(alergeno);
                    });
                } else {
                    alergenosArray = [String(producto.alergenos)];
                }
            } catch (e) {
                console.warn('Error parseando alergenos:', e);
                alergenosArray = [String(producto.alergenos)];
            }
        } else {
            alergenosArray = [String(producto.alergenos)];
        }
    }
    
    const alergenosHTML = alergenosArray.length > 0 
        ? `<div class="alergenos">${alergenosArray.map(a => `<span class="alergeno">${a}</span>`).join('')}</div>`
        : '';
    
    const imagenHTML = producto.imagen 
        ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">`
        : '';
    
    div.innerHTML = `
        ${imagenHTML}
        <h3>${producto.nombre}</h3>
        <p class="descripcion">${producto.descripcion || 'Sense descripció'}</p>
        <p class="precio">${parseFloat(producto.precio).toFixed(2)}€</p>
        ${alergenosHTML}
        <button class="btn-agregar" 
                data-id="${producto.id}"
                data-nombre="${producto.nombre}"
                data-precio="${producto.precio}"
                data-tipo="${producto.tipo}">
            Afegir a Comanda
        </button>
    `;
    
    return div;
}

function mostrarProductosEjemplo() {
    const platosEjemplo = [
        {id: 1, nombre: "Pollastre amb Patates", tipo: "plat", precio: 6.50, descripcion: "Suculent pollastre a la planxa", activo: 1},
        {id: 2, nombre: "Pasta amb Verdures", tipo: "plat", precio: 5.80, descripcion: "Pasta integral amb verdures", activo: 1}
    ];
    
    const productosEjemplo = [
        {id: 1, nombre: "Aigua Mineral", tipo: "beguda", precio: 1.20, descripcion: "Aigua mineral natural 500ml", alergenos: [], activo: 1},
        {id: 2, nombre: "Croissant", tipo: "brioixeria", precio: 1.20, descripcion: "Croissant de mantega", alergenos: ["Gluten", "Lactosa"], activo: 1},
        {id: 3, nombre: "Refresc de Cola", tipo: "beguda", precio: 1.80, descripcion: "Refresc de cola 330ml", alergenos: [], activo: 1},
        {id: 4, nombre: "Patates Xips", tipo: "snack", precio: 1.50, descripcion: "Bossa de patates xips", alergenos: [], activo: 1},
        {id: 5, nombre: "Frankfurt", tipo: "snack", precio: 1.50, descripcion: "Frankfurt amb salses a triar", alergenos: ["Gluten", "Lactosa"], activo: 1}
    ];
    
    organizarYMostrarProductos(platosEjemplo, productosEjemplo);
    ocultarEstadoCarga();
}

function agregarProductoComanda(id, nombre, precio, tipo, salsas = []) {
    const index = comanda.findIndex(item => 
        item.id == id && 
        JSON.stringify(item.salsas) === JSON.stringify(salsas)
    );
    
    if (index !== -1) {
        comanda[index].cantidad += 1;
        comanda[index].subtotal = comanda[index].cantidad * comanda[index].precio;
    } else {
        comanda.push({
            id: id,
            nombre: nombre,
            precio: precio,
            tipo: tipo,
            cantidad: 1,
            subtotal: precio,
            salsas: salsas 
        });
    }
    
    guardarComandaLocal();
    actualizarContadorComanda();
    mostrarNotificacion(`${nombre} afegit a la comanda`);
}

function guardarComandaLocal() {
    try {
        localStorage.setItem('comandaCliente', JSON.stringify(comanda));
    } catch (error) {
        console.error('Error guardando comanda en localStorage:', error);
    }
}

function actualizarContadorComanda() {
    const totalElementos = comanda.reduce((total, item) => total + item.cantidad, 0);
    const totalPrecio = calcularTotal();
    
    const contador = document.getElementById('contadorComanda');
    const total = document.getElementById('totalComanda');
    
    if (contador) {
        contador.textContent = `${totalElementos} element${totalElementos !== 1 ? 's' : ''}`;
    }
    
    if (total) {
        total.textContent = `${totalPrecio.toFixed(2)}€`;
    }
}

function calcularTotal() {
    return comanda.reduce((total, item) => total + item.subtotal, 0);
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 2000);
}

function mostrarComandaModal() {
    const listaComanda = document.getElementById('listaComanda');
    const totalModal = document.getElementById('totalModal');
    
    if (!listaComanda || !totalModal) return;
    
    if (comanda.length === 0) {
        listaComanda.innerHTML = '<div class="comanda-vacia">La comanda està buida</div>';
        totalModal.textContent = '0.00';
        return;
    }
    
    let html = '';
    comanda.forEach((item, index) => {
        let salsasHTML = '';
        if (item.salsas && item.salsas.length > 0) {
            salsasHTML = `<div class="item-salsas"><small>Salses: ${item.salsas.map(s => s.nombre).join(', ')}</small></div>`;
        }
        
        html += `
            <div class="item-comanda">
                <div class="item-info">
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-tipo">${obtenerTextoPorTipo(item.tipo)}</div>
                    <div class="item-precio-unitario">${item.precio.toFixed(2)}€/unit</div>
                    ${salsasHTML}
                </div>
                <div class="item-controls">
                    <button class="btn-cantidad" onclick="modificarCantidad(${index}, -1)">−</button>
                    <span class="cantidad">${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="modificarCantidad(${index}, 1)">+</button>
                    <span class="subtotal">${item.subtotal.toFixed(2)}€</span>
                    <button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    listaComanda.innerHTML = html;
    totalModal.textContent = calcularTotal().toFixed(2);
}

async function confirmarComandaConSalsas(modal) {
    if (comanda.length === 0) {
        alert('La comanda està buida. Afegeix productes abans de confirmar.');
        return;
    }
    
    const total = calcularTotal();
    const confirmacion = confirm(`Confirmar comanda de ${comanda.length} productes?\nTotal: ${total.toFixed(2)}€`);
    
    if (!confirmacion) return;
    
    try {
        // Verificar sesión del usuario
        const sesionResponse = await fetch('http://localhost:3000/session');
        const sesion = await sesionResponse.json();
        
        const salsas_por_producto = {};
        comanda.forEach(item => {
            if (item.salsas && item.salsas.length > 0) {
                salsas_por_producto[item.id] = item.salsas.map(s => s.id);
            }
        });
        
        const comandaData = {
            productos: comanda.map(item => ({
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad,
                tipo: item.tipo,
                salsas: item.salsas
            })),
            total: total,
            id_usuario: sesion.activa ? sesion.id : null,
            estado: 'pendent'
        };
        
        console.log('Enviando comanda al servidor:', comandaData);
        
        const response = await fetch('http://localhost:3000/comandas/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comandaData)
        });
        
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        
        const resultado = await response.json();
        
        alert(`Comanda enviada correctament!\nID: ${resultado.id}\nTotal: ${total.toFixed(2)}€`);
        
        comanda = [];
        localStorage.removeItem('comandaCliente');
        actualizarContadorComanda();
        
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Actualizar dashboard del usuario
        setTimeout(() => {
            if (window.opener) {
                window.opener.location.reload();
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error al confirmar comanda:', error);
        alert(`Error: ${error.message}\n\nLa comanda se ha guardado localmente.`);
    }
}

function obtenerTextoPorTipo(tipo) {
    const tipos = {
        'plat': 'Plat Combinat',
        'beguda': 'Beguda',
        'snack': 'Snack',
        'brioixeria': 'Brioxeria'
    };
    return tipos[tipo] || tipo;
}

window.modificarCantidad = function(index, cambio) {
    if (index < 0 || index >= comanda.length) return;
    
    const item = comanda[index];
    const nuevaCantidad = item.cantidad + cambio;
    
    if (nuevaCantidad <= 0) {
        eliminarProducto(index);
        return;
    }
    
    item.cantidad = nuevaCantidad;
    item.subtotal = nuevaCantidad * item.precio;
    
    guardarComandaLocal();
    actualizarContadorComanda();
    mostrarComandaModal();
}

window.eliminarProducto = function(index) {
    if (index < 0 || index >= comanda.length) return;
    
    const productoNombre = comanda[index].nombre;
    
    if (confirm(`Eliminar "${productoNombre}" de la comanda?`)) {
        comanda.splice(index, 1);
        guardarComandaLocal();
        actualizarContadorComanda();
        mostrarComandaModal();
        
        if (comanda.length === 0) {
            setTimeout(() => {
                const modal = document.getElementById('modalComanda');
                if (modal) modal.style.display = 'none';
            }, 500);
        }
    }
}