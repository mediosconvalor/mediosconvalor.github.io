document.addEventListener('DOMContentLoaded', () => {
  const btnOpen   = document.querySelector('.hamburger');
  const btnClose  = document.querySelector('.sidebar__close');
  const sidebar   = document.querySelector('.sidebar');
  const body      = document.body;

  function openSidebar() {
    sidebar.classList.add('open');
    body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    body.classList.remove('sidebar-open');
  }

  // Abrir con hamburguesa
  btnOpen.addEventListener('click', openSidebar);

  // Cerrar con “X”
  btnClose.addEventListener('click', closeSidebar);

  // Cerrar al hacer clic fuera del sidebar
  document.addEventListener('click', (e) => {
    if (
      body.classList.contains('sidebar-open') &&
      !sidebar.contains(e.target) &&
      !btnOpen.contains(e.target)
    ) {
      closeSidebar();
    }
  });

  // Cerrar al pulsar Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('sidebar-open')) {
      closeSidebar();
    }
  });
});
