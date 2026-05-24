const selectAlergens = document.getElementById('alergens');
const llistaAlergensSeleccionats = document.getElementById('llistaAlergensSeleccionats');

let alergensAfegits = [];

function actualitzarLlistaProductes() {
    llistaAlergensSeleccionats.innerHTML = '';

    if (!alergensAfegits.length) {
        const li = document.createElement('li');
        li.textContent = 'No hi ha al·lèrgens seleccionats.';
        llistaAlergensSeleccionats.appendChild(li);
    } else {
        alergensAfegits.forEach((alergen, index) => {
            const li = document.createElement('li');
            li.textContent = alergen;

            const spanEliminar = document.createElement('span');
            spanEliminar.textContent = 'eliminar';
            spanEliminar.style.cssText = 'color:red; font-size:12px; margin-left:10px; cursor:pointer; text-decoration:underline;';
            spanEliminar.addEventListener('click', () => {
                alergensAfegits.splice(index, 1);
                actualitzarLlistaProductes();
            });

            li.appendChild(spanEliminar);
            llistaAlergensSeleccionats.appendChild(li);
        });
    }
}

document.getElementById('btnAfegirAlergen').addEventListener('click', () => {
    const selected = selectAlergens.options[selectAlergens.selectedIndex];
    if (!selected) return alert("Selecciona un al·lergen per afegir-lo.");
    if (!alergensAfegits.includes(selected.textContent)) {
        alergensAfegits.push(selected.textContent);
        actualitzarLlistaProductes();
    }
});

document.getElementById('btnEditaAlergen').addEventListener('click', () => {
    const selected = selectAlergens.options[selectAlergens.selectedIndex];
    if (!selected) return alert("Selecciona un al·lergen per editar-lo.");
    const nouNom = prompt("Edita el nom de l'al·lergen:", selected.textContent);
    if (nouNom?.trim()) {
        selected.textContent = nouNom;
        selected.value = nouNom.toLowerCase().replace(/\s+/g, '_');
    }
});

function netejarAlergens() {
    alergensAfegits = [];
    actualitzarLlistaProductes();
}

actualitzarLlistaProductes();
