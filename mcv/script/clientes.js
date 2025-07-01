document.addEventListener('DOMContentLoaded', function() {
  let current = null;
  const submitBtn = document.getElementById('submit');

  // 1) Al hacer clic en "INGRESAR"
  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    submitBtn.value = 'INGRESANDO…';
    submitBtn.disabled = true;

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const url = 'https://script.google.com/macros/s/AKfycbxOlTBr5B57ehzwa0c3Ju2j98LnOv8XjXuo-HX5imTl3QSZzHSMhzqPUDm6duQGHF8/exec';
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(result => {
      if (result !== 'null') {
        window.location.href = result;
      } else {
        alert('Nombre de usuario o contraseña incorrectos');
        submitBtn.value = 'INGRESAR';
        submitBtn.disabled = false;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      submitBtn.value = 'INGRESAR';
      submitBtn.disabled = false;
    });
  });

  // 2) "¿Olvidó su contraseña?"
  const forgotLink = document.getElementById('forgot-password');
  forgotLink.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Favor de comunicarse con sistemas@mediosconvalor.com para realizar el cambio');
  });

  // 3) Animaciones con anime.js
  document.querySelector('#username').addEventListener('focus', function() {
    if (current) current.pause();
    current = anime({
      targets: 'path',
      strokeDashoffset: { value: 0, duration: 700, easing: 'easeOutQuart' },
      strokeDasharray:  { value: '240 1386', duration: 700, easing: 'easeOutQuart' }
    });
  });

  document.querySelector('#password').addEventListener('focus', function() {
    if (current) current.pause();
    current = anime({
      targets: 'path',
      strokeDashoffset: { value: -336, duration: 700, easing: 'easeOutQuart' },
      strokeDasharray:  { value: '240 1386', duration: 700, easing: 'easeOutQuart' }
    });
  });

  document.querySelector('#submit').addEventListener('focus', function() {
    if (current) current.pause();
    current = anime({
      targets: 'path',
      strokeDashoffset: { value: -730, duration: 700, easing: 'easeOutQuart' },
      strokeDasharray:  { value: '530 1386', duration: 700, easing: 'easeOutQuart' }
    });
  });
});
