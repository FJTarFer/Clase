document.addEventListener('DOMContentLoaded', function() {
    cargarAlergenos();
    configurarFormulario();
});

let alergenosSeleccionados = [];

async function cargarAlergenos() {
    try {
        const response = await fetch('http://localhost:3000/alergenos');
        if (!response.ok) throw new Error('Error al cargar alérgenos');
        
        const alergenos = await response.json();
        poblarSelectAlergenos(alergenos);
    } catch (error) {
        console.error('Error:', error);
        const alergenosDefecto = [
            { id: 1, nombre: 'Gluten' },
            { id: 2, nombre: 'Lácteos' },
            { id: 3, nombre: 'Huevos' },
            { id: 4, nombre: 'Pescado' },
            { id: 5, nombre: 'Cacahuetes' }
        ];
        poblarSelectAlergenos(alergenosDefecto);
    }
}

function poblarSelectAlergenos(alergenos) {
    const selectAlergenos = document.getElementById('alergens');
    if (!selectAlergenos) return;
    
    selectAlergenos.innerHTML = '<option value="">Selecciona un al·lèrgen</option>';
    
    alergenos.forEach(alergeno => {
        const option = document.createElement('option');
        option.value = alergeno.id;
        option.textContent = alergeno.nombre;
        option.setAttribute('data-desc', alergeno.descripcion || '');
        selectAlergenos.appendChild(option);
    });
}

function configurarFormulario() {
    const form = document.getElementById('formPlat');
    const btnAfegirAlergen = document.getElementById('btnAfegirAlergen');
    const listaAlergenos = document.getElementById('listaAlergenos');
    
    if (!form) return;
    
    if (btnAfegirAlergen) {
        btnAfegirAlergen.addEventListener('click', function() {
            const select = document.getElementById('alergens');
            const selectedOption = select.options[select.selectedIndex];
            
            if (!selectedOption.value) {
                alert('Selecciona un al·lèrgen primer');
                return;
            }
            
            const alergenoId = selectedOption.value;
            const alergenoNombre = selectedOption.textContent;
            
            if (!alergenosSeleccionados.some(a => a.id == alergenoId)) {
                alergenosSeleccionados.push({
                    id: alergenoId,
                    nombre: alergenoNombre
                });
                actualizarListaAlergenos();
            } else {
                alert('Aquest al·lèrgen ja està afegit');
            }
        });
    }
    
    if (listaAlergenos) {
        listaAlergenos.addEventListener('click', function(e) {
            if (e.target.classList.contains('eliminar-alergeno')) {
                const index = parseInt(e.target.dataset.index);
                alergenosSeleccionados.splice(index, 1);
                actualizarListaAlergenos();
            }
        });
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) return;
        
        const datosPlat = {
            nombre: document.getElementById('nomPlat').value.trim(),
            principal: document.getElementById('principal').value,
            acompanyament: document.getElementById('acompanyament').value,
            precio: parseFloat(document.getElementById('preu').value),
            descripcion: document.getElementById('descripcion')?.value || '',
            alergenos: alergenosSeleccionados.map(a => a.id)
        };
        
        try {
            const response = await fetch('http://localhost:3000/platos-combinados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosPlat)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error del servidor');
            }
            
            const resultado = await response.json();
            
            alert(`Plat combinat guardat correctament!\nID: ${resultado.id}`);
            
            form.reset();
            alergenosSeleccionados = [];
            actualizarListaAlergenos();
            
        } catch (error) {
            console.error('Error al guardar:', error);
            alert(`Error: ${error.message}`);
        }
    });
}

function actualizarListaAlergenos() {
    const listaAlergenos = document.getElementById('listaAlergenos');
    if (!listaAlergenos) return;
    
    listaAlergenos.innerHTML = '';
    
    if (alergenosSeleccionados.length === 0) {
        listaAlergenos.innerHTML = '<li class="sin-alergenos">No s\'han afegit al·lèrgens</li>';
        return;
    }
    
    alergenosSeleccionados.forEach((alergeno, index) => {
        const li = document.createElement('li');
        li.className = 'alergeno-item';
        li.innerHTML = `
            <span>${alergeno.nombre}</span>
            <button type="button" class="eliminar-alergeno" data-index="${index}">
                Eliminar
            </button>
        `;
        listaAlergenos.appendChild(li);
    });
}

function validarFormulario() {
    limpiarErrores();
    
    let esValido = true;
    
    const nomPlat = document.getElementById('nomPlat').value.trim();
    const principal = document.getElementById('principal').value;
    const acompanyament = document.getElementById('acompanyament').value;
    const preu = document.getElementById('preu').value;
    
    if (!nomPlat) {
        mostrarError('errorNomPlat', 'El nom del plat és obligatori');
        esValido = false;
    }
    
    if (!principal) {
        mostrarError('errorPrincipal', 'Has de seleccionar un principal');
        esValido = false;
    }
    
    if (!acompanyament) {
        mostrarError('errorAcompanyament', 'Has de seleccionar un acompanyament');
        esValido = false;
    }
    
    if (!preu || preu <= 0) {
        mostrarError('errorPreu', 'El preu ha de ser un número positiu');
        esValido = false;
    } else if (isNaN(preu)) {
        mostrarError('errorPreu', 'El preu ha de ser un número vàlid');
        esValido = false;
    }
    
    return esValido;
}

function mostrarError(elementoId, mensaje) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.textContent = mensaje;
    }
}

function limpiarErrores() {
    const errores = document.querySelectorAll('.error');
    errores.forEach(error => error.textContent = '');
}