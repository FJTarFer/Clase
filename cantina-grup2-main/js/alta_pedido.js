document.getElementById('formAltaPedido').addEventListener('submit', function (e) {
    e.preventDefault();

    limpiarErrores();

    const fechaInput = document.getElementById('fecha').value;
    const horaInput = document.getElementById('hora').value;
    const fechaHora = fechaInput + ' ' + horaInput;
    const comentario = document.getElementById('comentario').value;

    if (!fechaInput) {
        mostrarError('errorFecha', 'La fecha es obligatoria');
        return;
    }
    if (!horaInput) {
        mostrarError('errorHora', 'La hora es obligatoria');
        return;
    }
    if (!productosAñadidos || productosAñadidos.length === 0) {
        mostrarError('errorProductos', 'Debe añadir al menos un producto');
        return;
    }

    fetch('http://localhost:3000/comandes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fecha: fechaHora,
            productos: productosAñadidos,
            alergenos: alergenosAñadidos,
            comentario: comentario
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.mensaje) alert(data.mensaje);
            this.reset();
            limpiarAlergenos();
            limpiarProductos();
        })
        .catch(err => console.error(err));
});

function mostrarError(elementoId, mensaje) {
    document.getElementById(elementoId).textContent = mensaje;
}

function limpiarErrores() {
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
}

function limpiarAlergenos() {
    if (typeof alergenosAñadidos !== 'undefined') {
        alergenosAñadidos = [];
        actualizarLista();
    }
}

function limpiarProductos() {
    if (typeof productosAñadidos !== 'undefined') {
        productosAñadidos = [];
        actualizarListaProductos();
        document.getElementById('cantidadProducto').value = 1;
    }
}
