document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    configurarFiltros();
    actualizarEstadisticas();
});

function cargarUsuarios(filtroRol = 'tots', busqueda = '') {
    fetch('/usuarios/lista')
        .then(res => res.json())
        .then(data => {
            let usuariosFiltrados = data;

            if (filtroRol !== 'tots') {
                usuariosFiltrados = usuariosFiltrados.filter(u => u.rol === filtroRol);
            }

            if (busqueda) {
                const busquedaLower = busqueda.toLowerCase();
                usuariosFiltrados = usuariosFiltrados.filter(u =>
                    u.nom.toLowerCase().includes(busquedaLower) ||
                    u.cognoms.toLowerCase().includes(busquedaLower) ||
                    u.email.toLowerCase().includes(busquedaLower)
                );
            }

            const cuerpoTabla = document.getElementById('cuerpoTablaUsuarios');
            cuerpoTabla.innerHTML = '';

            if (usuariosFiltrados.length === 0) {
                cuerpoTabla.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hi ha usuaris que coincideixin amb els filtres</td></tr>';
                return;
            }

            usuariosFiltrados.forEach(usuario => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${usuario.nom}</td>
                    <td>${usuario.cognoms}</td>
                    <td>${usuario.email}</td>
                    <td><span class="rol-badge rol-${usuario.rol}">${obtenerTextoRol(usuario.rol)}</span></td>
                    <td>-</td>
                    <td><span class="estado-badge estado-actiu">Actiu</span></td>
                    <td>
                        <button class="btn-primario btn-pequeno" onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button class="btn-peligro btn-pequeno" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                        <button class="btn-secundario btn-pequeno" onclick="toggleEstadoUsuario(${usuario.id}, 'inactiu')">Desactivar</button>
                    </td>
                `;
                cuerpoTabla.appendChild(fila);
            });

            actualizarEstadisticas(data);
        })
        .catch(err => console.error('Error cargando usuarios:', err));
}

function configurarFiltros() {
    document.getElementById('btnAplicarFiltros').addEventListener('click', () => {
        const filtroRol = document.getElementById('filtroRol').value;
        const busqueda = document.getElementById('filtroBusqueda').value;
        cargarUsuarios(filtroRol, busqueda);
    });

    document.getElementById('btnResetFiltros').addEventListener('click', () => {
        document.getElementById('filtroRol').value = 'tots';
        document.getElementById('filtroBusqueda').value = '';
        cargarUsuarios();
    });

    document.getElementById('filtroBusqueda').addEventListener('input', function () {
        const filtroRol = document.getElementById('filtroRol').value;
        cargarUsuarios(filtroRol, this.value);
    });
}

function actualizarEstadisticas(usuarios = []) {
    document.getElementById('totalUsuarios').textContent = usuarios.length;
    document.getElementById('totalAlumnes').textContent = usuarios.filter(u => u.rol === 'alumne').length;
    document.getElementById('totalPersonal').textContent = usuarios.filter(u => u.rol === 'personal').length;
    document.getElementById('usuariosActivos').textContent = usuarios.length;
}

function editarUsuario(id) {
    fetch(`/usuarios/lista`)
        .then(res => res.json())
        .then(data => {
            const usuario = data.find(u => u.id === id);
            if (!usuario) return;

            const modal = document.createElement('div');
            modal.className = 'modal-edicion';
            modal.style.cssText = `
                position: fixed; top:0; left:0; width:100%; height:100%;
                background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000;
            `;

            const contenidoModal = document.createElement('div');
            contenidoModal.style.cssText = `
                background-color:white; padding:30px; border-radius:8px; width:90%; max-width:500px;
            `;

            contenidoModal.innerHTML = `
                <h2>Editar Usuari</h2>
                <form id="formEditarUsuario">
                    <div class="campo-formulario">
                        <label for="editNom">Nom:</label>
                        <input type="text" id="editNom" value="${usuario.nom}" required>
                    </div>
                    <div class="campo-formulario">
                        <label for="editCognoms">Cognoms:</label>
                        <input type="text" id="editCognoms" value="${usuario.cognoms}" required>
                    </div>
                    <div class="campo-formulario">
                        <label for="editEmail">Email:</label>
                        <input type="email" id="editEmail" value="${usuario.email}" required>
                    </div>
                    <div class="campo-formulario">
                        <label for="editRol">Rol:</label>
                        <select id="editRol" required>
                            <option value="alumne" ${usuario.rol === 'alumne' ? 'selected' : ''}>Alumne</option>
                            <option value="personal" ${usuario.rol === 'personal' ? 'selected' : ''}>Personal</option>
                            <option value="admin" ${usuario.rol === 'admin' ? 'selected' : ''}>Administrador</option>
                        </select>
                    </div>
                    <div class="botones-formulario">
                        <button type="submit" class="btn-primario">Guardar Canvis</button>
                        <button type="button" class="btn-secundario" id="btnCancelar">Cancel·lar</button>
                    </div>
                </form>
            `;
            modal.appendChild(contenidoModal);
            document.body.appendChild(modal);

            const estilos = document.createElement('style');
            estilos.textContent = `
                .campo-formulario { margin-bottom:15px; }
                .campo-formulario label { display:block; margin-bottom:5px; font-weight:bold; }
                .campo-formulario input, .campo-formulario select { width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; }
                .botones-formulario { display:flex; justify-content:space-between; margin-top:20px; }
                .botones-formulario button { padding:10px 20px; border:none; border-radius:4px; cursor:pointer; }
            `;
            document.head.appendChild(estilos);

            document.getElementById('formEditarUsuario').addEventListener('submit', e => {
                e.preventDefault();
                const nom = document.getElementById('editNom').value;
                const cognoms = document.getElementById('editCognoms').value;
                const email = document.getElementById('editEmail').value;
                const rol = document.getElementById('editRol').value;

                fetch(`/usuarios/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nom, cognoms, email, rol })
                })
                    .then(res => res.json())
                    .then(resData => {
                        if (resData.success) {
                            document.body.removeChild(modal);
                            document.head.removeChild(estilos);
                            cargarUsuarios();
                            alert('Usuari actualitzat correctament');
                        }
                    });
            });

            document.getElementById('btnCancelar').addEventListener('click', () => {
                document.body.removeChild(modal);
                document.head.removeChild(estilos);
            });

            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    document.head.removeChild(estilos);
                }
            });
        });
}

function eliminarUsuario(id) {
    if (confirm('Estàs segur que vols eliminar aquest usuari?')) {
        fetch(`/usuarios/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    cargarUsuarios();
                    alert('Usuari eliminat correctament');
                }
            });
    }
}

function toggleEstadoUsuario(id, estado) {
    fetch(`/usuarios/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
    })
        .then(res => res.json())
        .then(resData => {
            if (resData.success) {
                cargarUsuarios();
                alert('Estat actualitzat correctament');
            }
        });
}

function obtenerTextoRol(rol) {
    const roles = { 
        'alumne': 'Alumne', 
        'personal': 'Personal',
        'admin': 'Administrador'
    };
    return roles[rol] || rol;
}