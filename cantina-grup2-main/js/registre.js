document.getElementById('registerForm').addEventListener('submit', function (event) {
  event.preventDefault();
  document.querySelectorAll('.error').forEach(e => e.textContent = '');

  let valid = true;
  const nom = document.getElementById('nom').value.trim();
  const cognoms = document.getElementById('cognoms').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const rol = document.getElementById('rol').value;

  const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,7}$/i;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (nom === "") {
    document.getElementById('nomError').textContent = "El nom és obligatori.";
    valid = false;
  }

  if (cognoms === "") {
    document.getElementById('cognomsError').textContent = "Els cognoms són obligatoris.";
    valid = false;
  }

  if (!emailRegex.test(email)) {
    document.getElementById('emailError').textContent = "Introdueix un correu electrònic vàlid.";
    valid = false;
  }

  if (!passwordRegex.test(password)) {
    document.getElementById('passwordError').textContent = "Ha de tenir almenys 8 caràcters, una majúscula i un número.";
    valid = false;
  }

  if (rol === "") {
    document.getElementById('rolError').textContent = "Selecciona un rol.";
    valid = false;
  }

  if (valid) {
    fetch('http://localhost:3000/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, cognoms, email, password, rol })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          const confirm = document.createElement('p');
          confirm.textContent = "Registre completat correctament!";
          confirm.style.color = "green";
          confirm.style.textAlign = "center";
          confirm.style.marginTop = "15px";
          this.appendChild(confirm);
          setTimeout(() => confirm.remove(), 3000);
          this.reset();
        }
      })
      .catch(err => console.error(err));
  }
});
