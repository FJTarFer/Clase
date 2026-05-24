document.getElementById('formLoginAdmin').addEventListener('submit', function(e) {
    e.preventDefault();
    
    limpiarErrores();
    
    let esValido = true;
    
    const usuari = document.getElementById('usuari').value.trim();
    const contrasenya = document.getElementById('contrasenya').value;
    
    // Validar usuari (email)
    if (!usuari) {
        mostrarError('errorUsuari', 'L\'usuari és obligatori');
        esValido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuari)) {
        mostrarError('errorUsuari', 'Format d\'email invàlid');
        esValido = false;
    }
    
    // Validar contrasenya
    if (!contrasenya) {
        mostrarError('errorContrasenya', 'La contrasenya és obligatòria');
        esValido = false;
    } else if (contrasenya.length < 6) {
        mostrarError('errorContrasenya', 'La contrasenya ha de tenir com a mínim 6 caràcters');
        esValido = false;
    }
    
    if (esValido) {
        alert('Login correcte. Accedint a l\'administració...');
        // Aquí aniria la redirecció a la pàgina d'administració
        // window.location.href = 'admin_dashboard.html';
    }
});

function mostrarError(elementoId, mensaje) {
    document.getElementById(elementoId).textContent = mensaje;
}

function limpiarErrores() {
    const errores = document.querySelectorAll('.error');
    errores.forEach(error => error.textContent = '');
}