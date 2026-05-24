document.addEventListener('DOMContentLoaded', function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || usuario.rol !== 'admin') {
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('userName').textContent = usuario.nom;
    document.getElementById('userEmail').textContent = usuario.email;
    const iniciales = usuario.nom.charAt(0).toUpperCase();
    document.getElementById('userAvatar').textContent = iniciales;
    cargarEstadisticas();
});

function logout() {
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
}

async function cargarEstadisticas() {
    try {
        const productosRes = await fetch('/productos').then(r => r.json());
        document.getElementById('totalProductos').textContent = productosRes.length || 0;
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}