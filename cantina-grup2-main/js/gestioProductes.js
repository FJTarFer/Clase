let productes = [];
let alergenosAñadidos = [];

const form = document.getElementById("formProducte");
const nomInput = document.getElementById("nom");
const preuInput = document.getElementById("preu");
const categoriaInput = document.getElementById("categoria");
const indexEdit = document.getElementById("indexEdit");

const errorNom = document.getElementById("errorNom");
const errorPreu = document.getElementById("errorPreu");
const errorCategoria = document.getElementById("errorCategoria");

// Configurar gestión de alérgenos
const selectAlergenos = document.getElementById('alergenos');
const listaAlergenosSeleccionados = document.getElementById('listaAlergenosSeleccionados');

function actualizarListaAlergenos() {
    listaAlergenosSeleccionados.innerHTML = '';
    
    if (alergenosAñadidos.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No hi ha característiques seleccionades.';
        listaAlergenosSeleccionados.appendChild(li);
    } else {
        alergenosAñadidos.forEach((alergeno, index) => {
            const li = document.createElement('li');
            li.textContent = alergeno;
            
            const spanEliminar = document.createElement('span');
            spanEliminar.textContent = 'eliminar';
            spanEliminar.style.color = 'red';
            spanEliminar.style.fontSize = '12px';
            spanEliminar.style.marginLeft = '10px';
            spanEliminar.style.cursor = 'pointer';
            spanEliminar.style.textDecoration = 'underline';
            spanEliminar.addEventListener('click', function() {
                alergenosAñadidos.splice(index, 1);
                actualizarListaAlergenos();
            });
            
            li.appendChild(spanEliminar);
            listaAlergenosSeleccionados.appendChild(li);
        });
    }
}

document.getElementById('btnAfegirAlergen').addEventListener('click', function() {
    const selectedIndex = selectAlergenos.selectedIndex;
    if (selectedIndex === -1) {
        alert("Selecciona una característica per afegir-la.");
        return;
    }
    
    const selected = selectAlergenos.options[selectedIndex];
    const nombreAlergeno = selected.textContent;
    
    if (!alergenosAñadidos.includes(nombreAlergeno)) {
        alergenosAñadidos.push(nombreAlergeno);
        actualizarListaAlergenos();
    }
});

document.getElementById('btnEditaAlergen').addEventListener('click', function() {
    const selectedIndex = selectAlergenos.selectedIndex;
    if (selectedIndex === -1) {
        alert("Selecciona una característica per editar-la.");
        return;
    }
    
    const selected = selectAlergenos.options[selectedIndex];
    const nouNom = prompt("Edita el nom de la característica:", selected.textContent);
    if (nouNom && nouNom.trim() !== '') {
        selected.textContent = nouNom;
        selected.value = nouNom.toLowerCase().replace(/\s+/g, '_');
    }
});

// Gestión de productos
form.addEventListener("submit", function(e) {
  e.preventDefault();
  
  // Validación
  let valid = true;
  errorNom.textContent = "";
  errorPreu.textContent = "";
  errorCategoria.textContent = "";

  if(nomInput.value.trim() === "") {
    errorNom.textContent = "El nom és obligatori.";
    valid = false;
  }
  if(preuInput.value === "" || preuInput.value <= 0) {
    errorPreu.textContent = "El preu ha de ser positiu.";
    valid = false;
  }
  if(categoriaInput.value === "") {
    errorCategoria.textContent = "Selecciona una categoria.";
    valid = false;
  }

  if(!valid) return;

  const producte = {
    nom: nomInput.value.trim(),
    preu: parseFloat(preuInput.value).toFixed(2),
    categoria: categoriaInput.value,
    caracteristiques: [...alergenosAñadidos]
  };

  if(indexEdit.value === "") {
    // Afegir
    productes.push(producte);
  } else {
    // Editar
    productes[indexEdit.value] = producte;
    indexEdit.value = "";
  }

  form.reset();
  alergenosAñadidos = [];
  actualizarListaAlergenos();
  mostrarProductes();
  alert('Producte guardat correctament');
});

function mostrarProductes() {
  // En una aplicación real, aquí mostraríamos los productos en una tabla
  console.log('Productes guardats:', productes);
}

// Inicializar
actualizarListaAlergenos();