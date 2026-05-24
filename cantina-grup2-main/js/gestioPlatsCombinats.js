let platsData = [];
let paginaActual = 1;
const platsPerPagina = 5;

let productesSeleccionats = [];
let alergensSeleccionats = [];

function carregarAlergens() {
    const selectAlergens = document.getElementById('alergens');
    
    fetch('http://localhost:3000/alergenos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar alérgenos');
            }
            return response.json();
        })
        .then(data => {
            selectAlergens.innerHTML = '<option value="">Selecciona un al·lergen</option>';
            
            data.forEach(alergeno => {
                const option = document.createElement('option');
                option.value = alergeno.id;
                option.textContent = alergeno.nombre || alergeno.alergeno;
                option.setAttribute('data-descripcion', alergeno.descripcion || '');
                selectAlergens.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error cargando alérgenos:', error);
            carregarAlergensEstatics();
        });
}

function carregarAlergensEstatics() {
    const selectAlergens = document.getElementById('alergens');
    const alergenosEstaticos = [
        { id: 1, nombre: 'Gluten', descripcion: 'Cereales que contienen gluten' },
        { id: 2, nombre: 'Lácteos', descripcion: 'Leche y productos lácteos' },
        { id: 3, nombre: 'Huevos', descripcion: 'Huevos y productos derivados' },
        { id: 4, nombre: 'Pescado', descripcion: 'Pescado y productos derivados' },
        { id: 5, nombre: 'Cacahuetes', descripcion: 'Cacahuetes y productos derivados' },
        { id: 6, nombre: 'Soja', descripcion: 'Soja y productos derivados' },
        { id: 7, nombre: 'Frutos secos', descripcion: 'Frutos de cáscara' },
        { id: 8, nombre: 'Moluscos', descripcion: 'Mariscos y moluscos' }
    ];
    
    selectAlergens.innerHTML = '<option value="">Selecciona un al·lergen</option>';
    
    alergenosEstaticos.forEach(alergeno => {
        const option = document.createElement('option');
        option.value = alergeno.id;
        option.textContent = alergeno.nombre;
        selectAlergens.appendChild(option);
    });
}

function carregarProductos() {
    const selectProductos = document.getElementById('productos');
    
    fetch('http://localhost:3000/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            return response.json();
        })
        .then(data => {
            selectProductos.innerHTML = '<option value="">Selecciona un producte</option>';
            
            data.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.id;
                option.textContent = `${producto.nombre} - ${parseFloat(producto.precio).toFixed(2)}€`;
                option.setAttribute('data-precio', producto.precio);
                option.setAttribute('data-nombre', producto.nombre);
                selectProductos.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error cargando productos:', error);
        });
}

function afegirAlergen() {
    const selectAlergens = document.getElementById('alergens');
    const selectedOption = selectAlergens.options[selectAlergens.selectedIndex];
    
    if (!selectedOption.value) {
        alert("Selecciona un al·lergen per afegir-lo.");
        return;
    }
    
    const alergenId = parseInt(selectedOption.value);
    const alergenNombre = selectedOption.textContent;
    
    const existe = alergensSeleccionats.some(a => a.id === alergenId);
    if (!existe) {
        alergensSeleccionats.push({
            id: alergenId,
            nombre: alergenNombre
        });
        actualitzarLlistaAlergens();
    } else {
        alert("Aquest al·lergen ja està afegit.");
    }
}

function eliminarAlergen(index) {
    alergensSeleccionats.splice(index, 1);
    actualitzarLlistaAlergens();
}

function actualitzarLlistaAlergens() {
    const llista = document.getElementById('listaAlergenos');
    
    if (alergensSeleccionats.length === 0) {
        llista.innerHTML = '<div class="empty-state-small">No s\'han afegit al·lèrgens</div>';
        return;
    }
    
    llista.innerHTML = '';
    
    alergensSeleccionats.forEach((alergen, index) => {
        const div = document.createElement('div');
        div.className = 'ingrediente-item';
        div.innerHTML = `
            <span>${alergen.nombre}</span>
            <button type="button" class="btn-eliminar" data-index="${index}">Eliminar</button>
        `;
        llista.appendChild(div);
    });
    
    llista.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            eliminarAlergen(index);
        });
    });
}

function afegirProducte() {
    const selectProductos = document.getElementById('productos');
    const cantidadInput = document.getElementById('cantidadProducto');
    
    const selectedOption = selectProductos.options[selectProductos.selectedIndex];
    const cantidad = parseInt(cantidadInput.value) || 1;
    
    if (!selectedOption.value) {
        alert("Selecciona un producte per afegir-lo.");
        return;
    }
    
    if (cantidad < 1) {
        alert("La quantitat ha de ser almenys 1.");
        return;
    }
    
    const producteId = parseInt(selectedOption.value);
    const producteNombre = selectedOption.getAttribute('data-nombre') || selectedOption.textContent.split(' - ')[0];
    const productePreu = parseFloat(selectedOption.getAttribute('data-precio')) || 0;
    
    const existeIndex = productesSeleccionats.findIndex(p => p.id === producteId);
    if (existeIndex !== -1) {
        productesSeleccionats[existeIndex].cantidad += cantidad;
    } else {
        productesSeleccionats.push({
            id: producteId,
            nombre: producteNombre,
            precio: productePreu,
            cantidad: cantidad
        });
    }
    
    actualitzarLlistaProductes();
    cantidadInput.value = 1;
}

function eliminarProducte(index) {
    productesSeleccionats.splice(index, 1);
    actualitzarLlistaProductes();
}

function actualitzarLlistaProductes() {
    const llista = document.getElementById('listaProductosSeleccionados');
    
    if (productesSeleccionats.length === 0) {
        llista.innerHTML = '<div class="empty-state-small">No s\'han afegit productes</div>';
        return;
    }
    
    llista.innerHTML = '';
    let total = 0;
    
    productesSeleccionats.forEach((producte, index) => {
        const subtotal = producte.precio * producte.cantidad;
        total += subtotal;
        
        const div = document.createElement('div');
        div.className = 'ingrediente-item';
        div.innerHTML = `
            <span>${producte.cantidad}x ${producte.nombre} - ${subtotal.toFixed(2)}€</span>
            <button type="button" class="btn-eliminar" data-index="${index}">Eliminar</button>
        `;
        llista.appendChild(div);
    });
    
    const totalDiv = document.createElement('div');
    totalDiv.className = 'ingrediente-item total';
    totalDiv.innerHTML = `<strong>Total ingredients: ${total.toFixed(2)}€</strong>`;
    llista.appendChild(totalDiv);
    
    llista.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            eliminarProducte(index);
        });
    });
}

function validarFormulario() {
    limpiarErrores();
    let esValid = true;

    const nom = document.getElementById('nomPlat').value.trim();
    const principal = document.getElementById('principal').value;
    const acompanyament = document.getElementById('acompanyament').value;
    const preu = parseFloat(document.getElementById('preu').value);

    if (!nom) {
        mostrarError('errorNomPlat', 'El nom del plat és obligatori');
        esValid = false;
    }

    if (!principal) {
        mostrarError('errorPrincipal', 'Has de seleccionar un principal');
        esValid = false;
    }

    if (!acompanyament) {
        mostrarError('errorAcompanyament', 'Has de seleccionar un acompanyament');
        esValid = false;
    }

    if (isNaN(preu) || preu <= 0) {
        mostrarError('errorPreu', 'El preu ha de ser un número positiu');
        esValid = false;
    }

    return esValid;
}

function mostrarError(id, msg) {
    const errorElement = document.getElementById(id);
    if (errorElement) {
        errorElement.textContent = msg;
    }
}

function limpiarErrores() {
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
}

function carregarPlats() {
    fetch('http://localhost:3000/plats-combinats')
        .then(res => {
            if (!res.ok) {
                throw new Error('Error carregant plats');
            }
            return res.json();
        })
        .then(data => {
            platsData = data;
            renderitzarPlats();
            actualitzarPaginacio();
        })
        .catch(err => {
            console.error('Error:', err);
            const llista = document.getElementById('listaPlatos');
            if (llista) {
                llista.innerHTML = `
                    <tr>
                        <td colspan="7">
                            <div class="error">Error carregant plats</div>
                        </td>
                    </tr>`;
            }
        });
}

function renderitzarPlats() {
    const llista = document.getElementById('listaPlatos');
    if (!llista) return;

    const inici = (paginaActual - 1) * platsPerPagina;
    const fi = inici + platsPerPagina;
    const platsPagina = platsData.slice(inici, fi);

    if (platsPagina.length === 0) {
        llista.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">No hi ha plats combinats registrats</div>
                </td>
            </tr>`;
        return;
    }

    llista.innerHTML = platsPagina.map(plat => `
        <tr>
            <td>${plat.id}</td>
            <td>${plat.nombre}</td>
            <td>${plat.principal || 'No especificado'}</td>
            <td>${plat.acompanyament || 'No especificado'}</td>
            <td>${parseFloat(plat.precio).toFixed(2)} €</td>
            <td>
                <span class="status-badge ${plat.activo ? 'status-active' : 'status-inactive'}">
                    ${plat.activo ? 'Actiu' : 'Inactiu'}
                </span>
            </td>
            <td>
                <button onclick="editarPlat(${plat.id})" class="btn btn-accion">Editar</button>
                <button onclick="eliminarPlat(${plat.id})" class="btn btn-accion btn-eliminar">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function actualitzarPaginacio() {
    document.getElementById('currentPage').textContent = paginaActual;
    document.getElementById('totalPlatos').textContent = platsData.length;
    document.getElementById('mostrados').textContent = Math.min(paginaActual * platsPerPagina, platsData.length);
    
    const totalPagines = Math.ceil(platsData.length / platsPerPagina);
    document.getElementById('btnPrev').disabled = paginaActual === 1;
    document.getElementById('btnNext').disabled = paginaActual === totalPagines || totalPagines === 0;
}

function eliminarPlat(id) {
    if (!confirm('Segur que vols eliminar aquest plat?')) return;

    fetch(`http://localhost:3000/plats-combinats/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error eliminant plat');
        }
        return res.json();
    })
    .then(() => {
        alert('Plat eliminat correctament');
        carregarPlats();
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Error eliminant el plat');
    });
}

function editarPlat(id) {
    fetch(`http://localhost:3000/plats-combinats/${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Error carregant plat');
            }
            return res.json();
        })
        .then(plat => {
            document.getElementById('platId').value = plat.id;
            document.getElementById('nomPlat').value = plat.nombre;
            document.getElementById('principal').value = plat.principal || '';
            document.getElementById('acompanyament').value = plat.acompanyament || '';
            document.getElementById('preu').value = plat.precio;
            document.getElementById('descripcion').value = plat.descripcion || '';
            
            document.getElementById('tituloForm').textContent = 'Editar Plat Combinat';
            document.getElementById('btnGuardarTexto').textContent = 'Actualitzar Plat';
            
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Error carregant el plat per editar');
        });
}

function resetFormulari() {
    document.getElementById('formPlat').reset();
    document.getElementById('platId').value = '';
    document.getElementById('tituloForm').textContent = 'Nou Plat Combinat';
    document.getElementById('btnGuardarTexto').textContent = 'Guardar Plat';
    
    alergensSeleccionats = [];
    productesSeleccionats = [];
    actualitzarLlistaAlergens();
    actualitzarLlistaProductes();
    
    limpiarErrores();
}

function mostrarPreview() {
    const nom = document.getElementById('nomPlat').value.trim() || '[Nom del plat]';
    const principal = document.getElementById('principal').value || '[Principal]';
    const acompanyament = document.getElementById('acompanyament').value || '[Acompanyament]';
    const preu = parseFloat(document.getElementById('preu').value) || 0;
    const descripcio = document.getElementById('descripcion').value.trim() || '[Descripció del plat]';
    
    let alergensText = 'Cap';
    if (alergensSeleccionats.length > 0) {
        alergensText = alergensSeleccionats.map(a => a.nombre).join(', ');
    }
    
    let productesText = 'Cap';
    if (productesSeleccionats.length > 0) {
        productesText = productesSeleccionats.map(p => `${p.cantidad}x ${p.nombre}`).join(', ');
    }
    
    const previewContent = `
        <h3>Vista prèvia del plat</h3>
        <div class="preview-info">
            <p><strong>Nom:</strong> ${nom}</p>
            <p><strong>Principal:</strong> ${principal}</p>
            <p><strong>Acompanyament:</strong> ${acompanyament}</p>
            <p><strong>Preu:</strong> ${preu.toFixed(2)}€</p>
            <p><strong>Descripció:</strong> ${descripcio}</p>
            <p><strong>Al·lèrgens:</strong> ${alergensText}</p>
            <p><strong>Ingredients/Productes:</strong> ${productesText}</p>
        </div>
    `;
    
    document.getElementById('previewContent').innerHTML = previewContent;
    document.getElementById('modalPreview').style.display = 'flex';
}

function guardarPlat(e) {
    e.preventDefault();
    
    if (!validarFormulario()) {
        return;
    }
    
    const platData = {
        nombre: document.getElementById('nomPlat').value.trim(),
        principal: document.getElementById('principal').value,
        acompanyament: document.getElementById('acompanyament').value,
        precio: parseFloat(document.getElementById('preu').value),
        descripcion: document.getElementById('descripcion').value.trim(),
        alergenos: alergensSeleccionats.map(a => a.id),
        productos: productesSeleccionats.map(p => ({
            id: p.id,
            nombre: p.nombre,
            cantidad: p.cantidad,
            precio: p.precio
        }))
    };
    
    const platId = document.getElementById('platId').value;
    const url = platId ? 
        `http://localhost:3000/plats-combinats/${platId}` : 
        'http://localhost:3000/plats-combinats';
    const method = platId ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(platData)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.error || 'Error guardant plat'); });
        }
        return res.json();
    })
    .then(data => {
        alert(platId ? 'Plat actualitzat correctament' : 'Plat creat correctament');
        resetFormulari();
        carregarPlats();
    })
    .catch(err => {
        console.error('Error:', err);
        alert(err.message || 'Error guardant el plat');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    carregarAlergens();
    carregarProductos();
    carregarPlats();
    
    document.getElementById('btnAfegirAlergen').addEventListener('click', afegirAlergen);
    document.getElementById('btnAfegirProducto').addEventListener('click', afegirProducte);
    document.getElementById('formPlat').addEventListener('submit', guardarPlat);
    
    document.getElementById('btnPrev').addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderitzarPlats();
            actualitzarPaginacio();
        }
    });
    
    document.getElementById('btnNext').addEventListener('click', () => {
        const totalPagines = Math.ceil(platsData.length / platsPerPagina);
        if (paginaActual < totalPagines) {
            paginaActual++;
            renderitzarPlats();
            actualitzarPaginacio();
        }
    });
    
    document.getElementById('buscarPlatos').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm) {
            const filtered = platsData.filter(plat => 
                plat.nombre.toLowerCase().includes(searchTerm) ||
                (plat.principal && plat.principal.toLowerCase().includes(searchTerm)) ||
                (plat.acompanyament && plat.acompanyament.toLowerCase().includes(searchTerm))
            );
            
            const llista = document.getElementById('listaPlatos');
            if (filtered.length === 0) {
                llista.innerHTML = `
                    <tr>
                        <td colspan="7">
                            <div class="empty-state">No s'han trobat plats</div>
                        </td>
                    </tr>`;
            } else {
                llista.innerHTML = filtered.map(plat => `
                    <tr>
                        <td>${plat.id}</td>
                        <td>${plat.nombre}</td>
                        <td>${plat.principal || 'No especificado'}</td>
                        <td>${plat.acompanyament || 'No especificado'}</td>
                        <td>${parseFloat(plat.precio).toFixed(2)} €</td>
                        <td>
                            <span class="status-badge ${plat.activo ? 'status-active' : 'status-inactive'}">
                                ${plat.activo ? 'Actiu' : 'Inactiu'}
                            </span>
                        </td>
                        <td>
                            <button onclick="editarPlat(${plat.id})" class="btn btn-accion">Editar</button>
                            <button onclick="eliminarPlat(${plat.id})" class="btn btn-accion btn-eliminar">Eliminar</button>
                        </td>
                    </tr>
                `).join('');
            }
        } else {
            renderitzarPlats();
        }
    });
    
    document.getElementById('btnPreview').addEventListener('click', mostrarPreview);
    
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('modalPreview').style.display = 'none';
    });
    
    document.getElementById('modalPreview').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
});

function canviarEstatPlat(id, actual) {
    const nouEstat = !actual;
    
    if (!confirm(`Vols ${nouEstat ? 'activar' : 'desactivar'} aquest plat?`)) return;
    
    fetch(`http://localhost:3000/plats-combinats/${id}/estado`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activo: nouEstat })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error canviant estat');
        }
        return res.json();
    })
    .then(() => {
        alert(`Plat ${nouEstat ? 'activat' : 'desactivat'} correctament`);
        carregarPlats();
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Error canviant l\'estat del plat');
    });
}