// Función para cargar alérgenos desde la API
function cargarAlergenos() {
    fetch('http://localhost:3000/alergenos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar alérgenos');
            }
            return response.json();
        })
        .then(data => {
            const selectAlergens = document.getElementById('alergens');
            selectAlergens.innerHTML = '<option value="">Selecciona un al·lergen</option>';
            
            data.forEach(alergeno => {
                const option = document.createElement('option');
                option.value = alergeno.id;
                option.textContent = alergeno.nombre;
                option.setAttribute('data-descripcion', alergeno.descripcion || '');
                selectAlergens.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);

            cargarAlergenosEstaticos();
        });
}

function cargarAlergenosEstaticos() {
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
    
    const selectAlergens = document.getElementById('alergens');
    selectAlergens.innerHTML = '<option value="">Selecciona un al·lergen</option>';
    
    alergenosEstaticos.forEach(alergeno => {
        const option = document.createElement('option');
        option.value = alergeno.id;
        option.textContent = alergeno.nombre;
        option.setAttribute('data-descripcion', alergeno.descripcion || '');
        selectAlergens.appendChild(option);
    });
}

let alergensSeleccionados = [];

function afegirAlergen() {
    const selectAlergens = document.getElementById('alergens');
    const selectedOption = selectAlergens.options[selectAlergens.selectedIndex];
    
    if (!selectedOption.value) {
        alert("Selecciona un al·lergen per afegir-lo.");
        return;
    }
    
    const alergenId = selectedOption.value;
    const alergenNombre = selectedOption.textContent;

    if (!alergensSeleccionados.find(a => a.id === alergenId)) {
        alergensSeleccionados.push({
            id: alergenId,
            nombre: alergenNombre
        });
        actualitzarLlistaAlergens();
    }
}

function actualitzarLlistaAlergens() {
    const llista = document.getElementById('listaAlergenos');
    
    if (alergensSeleccionados.length === 0) {
        llista.innerHTML = '<div class="empty-state-small">No s\'han afegit al·lèrgens</div>';
        return;
    }
    
    llista.innerHTML = '';
    
    alergensSeleccionados.forEach((alergen, index) => {
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

function eliminarAlergen(index) {
    alergensSeleccionados.splice(index, 1);
    actualitzarLlistaAlergens();
}

function getAlergensSeleccionados() {
    return alergensSeleccionados.map(a => a.id);
}

function resetAlergens() {
    alergensSeleccionados = [];
    actualitzarLlistaAlergens();
}

document.addEventListener('DOMContentLoaded', function() {
    cargarAlergenos();

    document.getElementById('btnAfegirAlergen').addEventListener('click', afegirAlergen);
});