document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  document.querySelectorAll('.error').forEach(e => e.textContent = '');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) return;

  fetch('/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Guardamos usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redirigimos al index
      window.location.href = '/';
    })
    .catch(err => console.error(err));
});
