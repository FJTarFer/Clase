function mostrarToast(mensaje, duracion = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.style.backgroundColor = '#f8d7da';
    toast.style.color = '#721c24';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duracion);
}

document.addEventListener('DOMContentLoaded', () => {
    const sessionDiv = document.getElementById('sessionMessage');

    fetch('/session')
        .then(res => res.json())
        .then(data => {
            if (data.activa) {
                sessionDiv.textContent = 'Sessió iniciada';
                sessionDiv.classList.remove('session-inactiva');
                sessionDiv.classList.add('session-activa');

                const tiempoSesion = data.tiempo || 60;
                setTimeout(() => {
                    sessionDiv.textContent = 'Sessió no iniciada';
                    sessionDiv.classList.remove('session-activa');
                    sessionDiv.classList.add('session-inactiva');
                    mostrarToast(`Sessió tancada després de ${tiempoSesion} segons`);
                }, tiempoSesion * 1000);

            } else {
                sessionDiv.textContent = 'Sessió no iniciada';
                sessionDiv.classList.remove('session-activa');
                sessionDiv.classList.add('session-inactiva');
            }
        })
        .catch(err => console.error(err));
});
