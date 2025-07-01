const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbxgE8DXFAJWNBF4-uFMte45j33DIiUk8FhFTx2TvksWbqJEc3m4Hp3-ojMuT2nTuKrg/exec';

const branchInfo = {
  queretaro: { city: 'Querétaro, México', phone: '524424710760' },
  aguascalientes: { city: 'Aguascalientes, México', phone: '524492656569' },
  monterrey: { city: 'Monterrey, México', phone: '528123575710' }
};

window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.innerHTML = `.map-container:empty { display: none; } #waToggle i { font-size: 28px; }`;
  document.head.appendChild(style);

  function previewStateMap(formId, mapId) {
    const sel = document.querySelector(`#${formId} select[name="sucursal"]`);
    const mapContainer = document.getElementById(mapId);
    const city = branchInfo[sel.value]?.city;
    if (!city) return;
    mapContainer.innerHTML = `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(city)}&z=6&output=embed" width="100%" height="200" frameborder="0" style="border:0" allowfullscreen></iframe>`;
  }

  function setupWizard(formId, startBtnId = null) {
    const bienvenida = document.getElementById('bienvenida');
    const form = document.getElementById(formId);
    const steps = Array.from(form.querySelectorAll('.step'));
    let current = 0;

    function show(i) {
      steps.forEach((s, j) => s.classList.toggle('active', j === i));
      current = i;
      if (i === 5) {
        const mapId = formId === 'formOrdinario' ? 'mapaDireccion' : 'mapaDireccionExtra';
        previewStateMap(formId, mapId);
      }
    }

    if (startBtnId) {
      document.getElementById(startBtnId).onclick = () => {
        bienvenida.classList.remove('active');
        form.classList.add('active');
        show(0);
      };
    } else {
      form.classList.add('active');
      show(0);
    }

    form.querySelectorAll('.next').forEach(btn => {
      btn.onclick = () => {
        const campos = steps[current].querySelectorAll('input, select');
        for (let campo of campos) {
          if (!campo.checkValidity()) {
            campo.reportValidity();
            return;
          }
        }
        if (current < steps.length - 1) show(current + 1);
      };
    });

    form.querySelectorAll('.back').forEach(btn => {
      btn.onclick = () => {
        if (current > 0) show(current - 1);
      };
    });
  }

  setupWizard('formOrdinario', 'btnOrdinaria');
  setupWizard('formExtraordinaria', 'btnExtraordinaria');

  fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(d => {
      document.getElementById('ipUsuario').value = d.ip;
      document.getElementById('ipExtra').value = d.ip;
    });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      ['latitudUsuario', 'latitudUsuario', 'latExtra'].forEach(id => document.getElementById(id).value = lat);
      ['longitudUsuario', 'longitudUsuario', 'lonExtra'].forEach(id => document.getElementById(id).value = lon);

      let detected = '';
      if (lat > 20 && lat < 21) detected = 'queretaro';
      else if (lat > 21 && lat < 23) detected = 'aguascalientes';
      else if (lat > 24 && lat < 26) detected = 'monterrey';

      document.querySelectorAll('select[name="sucursal"]').forEach(sel => {
        sel.value = detected;
        sel.dispatchEvent(new Event('change'));
      });
    });
  }

  document.querySelectorAll('select[name="sucursal"]').forEach(sel => {
    const map = sel.closest('form').querySelector('.map-container');
    sel.addEventListener('change', () => map.innerHTML = '');
  });

  const dirOrd = document.getElementById('direccionServicio');
  const mapOrd = document.getElementById('mapaDireccion');
  dirOrd.addEventListener('input', () => {
    const sel = document.querySelector('#formOrdinario select[name="sucursal"]');
    const city = branchInfo[sel.value]?.city;
    const addr = dirOrd.value.trim();
    if (!addr) {
      previewStateMap('formOrdinario','mapaDireccion');
    } else {
      const full = `${addr}, ${city}`;
      mapOrd.innerHTML = `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(full)}&z=13&output=embed" width="100%" height="200" frameborder="0" style="border:0" allowfullscreen></iframe>`;
    }
  });

  const dirExt = document.getElementById('direccionExtra');
  const mapExt = document.getElementById('mapaDireccionExtra');
  dirExt.addEventListener('input', () => {
    const sel = document.querySelector('#formExtraordinaria select[name="sucursal"]');
    const city = branchInfo[sel.value]?.city;
    const addr = dirExt.value.trim();
    if (!addr) {
      previewStateMap('formExtraordinaria','mapaDireccionExtra');
    } else {
      const full = `${addr}, ${city}`;
      mapExt.innerHTML = `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(full)}&z=13&output=embed" width="100%" height="200" frameborder="0" style="border:0" allowfullscreen></iframe>`;
    }
  });

  const formO = document.getElementById('formOrdinario');
  const formE = document.getElementById('formExtraordinaria');

  formO.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = formO.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    enviarFormulario(Object.fromEntries(new FormData(formO)));
  });

  formE.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = formE.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  
    const file = fileInExtra.files[0];
    if (!file) {
      alert('Por favor sube una imagen.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Solicitud';
      return;
    }
  
    const data = Object.fromEntries(new FormData(formE));
    data.ip = document.getElementById('ipExtra').value || '';
    data.latitud = document.getElementById('latExtra').value || '';
    data.longitud = document.getElementById('lonExtra').value || '';
    data.tipoResiduos = data.tipoResiduos || 'Otros';
  
    const reader = new FileReader();
    reader.onload = () => {
      data.imagen = reader.result;
      enviarFormulario(data);
    };
    reader.readAsDataURL(file);
  });  

  const waToggle = document.getElementById('waToggle');
  const waList = document.getElementById('waList');
  const defaultMsg = encodeURIComponent('Te escribo por el tema de una cotización');

  waToggle.onclick = () => {
    waList.style.display = waList.style.display === 'block' ? 'none' : 'block';
  };

  waList.querySelectorAll('li').forEach(li => {
    li.onclick = () => {
      const info = branchInfo[li.dataset.key];
      if (info) {
        window.open(`https://wa.me/${info.phone}?text=${defaultMsg}`, '_blank');
      }
    };
  });
});

const fileInExtra = document.querySelector('#formExtraordinaria input[name="imagen"]');
const labelInExtra = document.getElementById('labelImagenExtra');

fileInExtra.addEventListener('change', () => {
  if (fileInExtra.files.length > 0) {
    const fileName = fileInExtra.files[0].name;
    labelInExtra.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Subiendo imagen...`;
    
    const reader = new FileReader();
    reader.onload = () => {
      labelInExtra.innerHTML = `📄 Se adjuntó: ${fileName}`;
    };
    reader.readAsDataURL(fileInExtra.files[0]);
  }
});


function enviarFormulario(data) {
  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(data)
  })
  .then(() => mostrarPopup(true))
  .catch(() => mostrarPopup(false));
}

function mostrarPopup(ok) {
  const pop = document.getElementById('popup'),
        emoji = document.getElementById('popupEmoji'),
        mensaje = document.getElementById('popupMensaje'),
        opts = document.getElementById('popupOpciones');
  emoji.textContent = ok ? '✅' : '❌';
  mensaje.textContent = ok ? '¡Formulario enviado correctamente!' : 'Error al enviar. Intenta más tarde.';
  opts.innerHTML = '<button id="cerrarPopup">Cerrar</button>';
  document.getElementById('cerrarPopup').onclick = () => window.location.href = window.location.href;
  pop.style.display = 'flex';
}

// Base de URL para imágenes
const BASE_IMG_URL = 'https://raw.githubusercontent.com/mediosconvalor/mcv/refs/heads/main/img/contenedores';

const contenedoresPorSucursal = {
    aguascalientes: {
      "1.1m³": { medidas:"134×107×137 cm", carga:"Carga Manual", material:"Plástico",   imagen:`${BASE_IMG_URL}/Ags/1_1.png`,  minimoVisitas:1 },
      "1.5m³": { medidas:"160x135x100 cm",  carga:"Carga Trasera",material:"Acero",      imagen:`${BASE_IMG_URL}/Ags/1_5.jpg`,  minimoVisitas:1 },
      "3m³":   { medidas:"152x125x135 cm",  carga:"Carga Trasera",material:"Acero",      imagen:`${BASE_IMG_URL}/Ags/3.jpg`,    minimoVisitas:1 },
      "6m³":   { medidas:"160x195x255 cm",  carga:"Carga Trasera",material:"Metal",     imagen:`${BASE_IMG_URL}/Ags/6.jpg`,    minimoVisitas:2 }
    },
    queretaro: {
      "1.1m³": { medidas:"134.4×107.4×137 cm", carga:"Carga Manual", material:"Plástico", imagen:`${BASE_IMG_URL}/Qro/1_1.jpg`, bolsas:"6–8 bolsas",  minimoVisitas:2 },
      "3m³":   { medidas:"185×120×125 cm",     carga:"Carga Manual", material:"Acero",    imagen:`${BASE_IMG_URL}/Qro/3.jpg`,   bolsas:"16–18 bolsas", minimoVisitas:2 },
      "6m³":   { medidas:"190×200×150 cm",     carga:"Carga Manual", material:"Metal",    imagen:`${BASE_IMG_URL}/Qro/6.jpg`,   bolsas:"32–36 bolsas", minimoVisitas:2 }
    },
    monterrey: {
      "1.1m³": { medidas:"134.4×107.4×137 cm", carga:"Carga Manual", material:"Plástico", imagen:`${BASE_IMG_URL}/Mty/1_1.jpg`, bolsas:"6–8 bolsas",  minimoVisitas:2 },
      "1.5m³": { medidas:"140×110×140 cm",     carga:"Carga Manual", material:"Acero",    imagen:`${BASE_IMG_URL}/Mty/1_5.jpg`, bolsas:"8–10 bolsas",  minimoVisitas:2 },
      "3m³":   { medidas:"185×120×125 cm",     carga:"Carga Manual", material:"Acero",    imagen:`${BASE_IMG_URL}/Mty/3.jpg`,   bolsas:"16–18 bolsas", minimoVisitas:2 },
      "6m³":   { medidas:"190×200×150 cm",     carga:"Carga Manual", material:"Metal",    imagen:`${BASE_IMG_URL}/Mty/6.jpg`,   bolsas:"32–36 bolsas", minimoVisitas:2 }
    }
  };  

const selSucO   = document.querySelector('#formOrdinario select[name="sucursal"]');
const selContO  = document.querySelector('#formOrdinario select[name="contenedor"]');
const infoContO = document.getElementById('infoContenedorOrdi');
const selFreqO  = document.querySelector('#formOrdinario select[name="frecuencia"]');

function fillContenedores() {
    selContO.innerHTML = '<option value="">Selecciona un contenedor</option>';
    const suc = selSucO.value;
    const conts = contenedoresPorSucursal[suc] || {};
    Object.entries(conts).forEach(([tamaño, info]) => {
      let text = tamaño;
      if (suc==='aguascalientes' && tamaño==='6m³');
      selContO.append(new Option(text, tamaño));
    });
  }
  
  function actualizarVisitas() {
    selFreqO.innerHTML = '<option value="">Selecciona visitas</option>';
    const suc = selSucO.value;
    const tam = selContO.value;
    if(!tam) return;
    const info = (contenedoresPorSucursal[suc]||{})[tam];
    const min = info?.minimoVisitas||1;
    for(let i=min;i<=6;i++) selFreqO.append(new Option(i,i));
  }
  
  function mostrarInfoContenedor() {
    infoContO.innerHTML = '';
    const suc = selSucO.value;
    const tam = selContO.value;
    const info = (contenedoresPorSucursal[suc]||{})[tam];
    if(!info) return;
  
    let html = `
      <strong>Medidas:</strong> ${info.medidas}<br>
      <strong>Tipo de carga:</strong> ${info.carga}<br>
      <strong>Material:</strong> ${info.material}<br>
    `;
    if(info.bolsas) html+=`<strong>Estimado de bolsas:</strong> ${info.bolsas}<br>`;
    infoContO.innerHTML = html;
  
    const img = document.createElement('img');
    img.src           = info.imagen;
    img.alt           = `Contenedor ${tam}`;
    img.style.display = 'block';
    img.style.margin  = '10px auto 0';
    img.style.height  = '2.5in';
    img.style.width   = 'auto';
    infoContO.appendChild(img);
  }
  
  selSucO.addEventListener('change', ()=>{
    fillContenedores();
    infoContO.innerHTML='';
    selFreqO.innerHTML='<option value="">Selecciona visitas</option>';
  });
  selContO.addEventListener('change', ()=>{
    actualizarVisitas();
    mostrarInfoContenedor();
  });
  
  // Inicializar
  fillContenedores();
  actualizarVisitas();
