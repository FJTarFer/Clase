document.addEventListener('DOMContentLoaded', function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '../index.html';
        return;
    }
    document.getElementById('userGreeting').textContent = `Hola, ${usuario.nom}!`;
    cargarCarrito();
    cargarComandasRecientes();
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });
});

function cargarCarrito() {
    const comanda = JSON.parse(localStorage.getItem('comandaCliente')) || [];
    if (comanda.length > 0) {
        const totalItems = comanda.reduce((sum, item) => sum + item.cantidad, 0);
        const totalPrice = comanda.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        document.getElementById('cartInfo').style.display = 'flex';
        document.getElementById('cartCount').textContent = totalItems;
        document.getElementById('cartTotal').textContent = totalPrice.toFixed(2) + '€';
    }
}

async function cargarComandasRecientes() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await fetch(`/comandas/usuario/${usuario.id}`);
        if (response.ok) {
            const comandas = await response.json();
            const ordersList = document.getElementById('ordersList');
            if (comandas.length > 0) {
                ordersList.innerHTML = '';
                comandas.slice(0, 3).forEach(comanda => {
                    const orderDiv = document.createElement('div');
                    orderDiv.className = 'order-item';
                    orderDiv.innerHTML = `
                        <div class="order-header">
                            <div>
                                <strong>Comanda #${comanda.id}</strong>
                                <p class="order-date">${new Date(comanda.fecha).toLocaleDateString('ca-ES')}</p>
                            </div>
                            <div style="text-align: right;">
                                <span class="order-status" style="background: ${getEstadoColor(comanda.estado)};">
                                    ${getEstadoTexto(comanda.estado)}
                                </span>
                                <p class="order-total">${comanda.total}€</p>
                            </div>
                        </div>
                    `;
                    ordersList.appendChild(orderDiv);
                });
                if (comandas.length > 3) {
                    const verMas = document.createElement('div');
                    verMas.className = 'view-all-link';
                    verMas.innerHTML = `<a href="javascript:void(0)" onclick="irAMisComandas()">Veure totes les comandes</a>`;
                    ordersList.appendChild(verMas);
                }
            }
        }
    } catch (error) {
        console.error('Error cargando comandas:', error);
    }
}

function getEstadoColor(estado) {
    const colores = {
        'pendent': '#ffc107',
        'preparant': '#17a2b8',
        'llest': '#28a745',
        'completat': '#6c757d',
        'cancel·lat': '#dc3545'
    };
    return colores[estado] || '#6c757d';
}

function getEstadoTexto(estado) {
    const textos = {
        'pendent': 'Pendent',
        'preparant': 'En preparació',
        'llest': 'Llest',
        'completat': 'Completat',
        'cancel·lat': 'Cancel·lat'
    };
    return textos[estado] || estado;
}

function irACarta() {
    window.location.href = 'carta_client.html';
}

function irAMisComandas() {
    window.location.href = 'meves_comandes.html';
}

function logout() {
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
}