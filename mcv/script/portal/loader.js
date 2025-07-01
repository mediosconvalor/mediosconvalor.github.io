// loader.js
document.addEventListener('DOMContentLoaded', () => {
  const loader  = document.getElementById('page-loader');
  const content = document.getElementById('page-content');

  window.addEventListener('load', () => {
    // Inicia la animación de desvanecimiento
    loader.classList.add('fade-out');

    // Tras la transición, ocultamos loader y mostramos contenido
    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
      content.classList.remove('hidden');
    });
  });
});
