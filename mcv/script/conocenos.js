// script.js
window.addEventListener('DOMContentLoaded', () => {
    // Año en el footer
    document.getElementById('year').textContent = new Date().getFullYear();
  
    // Toggle ubicaciones
    const btnLoc = document.getElementById('btn-locations');
    const locs   = document.getElementById('locations');
    btnLoc.addEventListener('click', () => {
      locs.classList.toggle('hidden');
    });
  
    // Toggle cotiza
    const btnCot = document.getElementById('btn-cotiza');
    const cots   = document.getElementById('cotiza-options');
    btnCot.addEventListener('click', () => {
      cots.classList.toggle('hidden');
    });
  
    // Toggle WhatsApp
    const btnWa = document.getElementById('btn-whatsapp');
    const was   = document.getElementById('whatsapp-options');
    btnWa.addEventListener('click', () => {
      was.classList.toggle('hidden');
    });
  });
