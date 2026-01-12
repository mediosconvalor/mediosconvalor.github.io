const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbxXGFR1jFX6Cw-exXyo-edqGshnRrSAy-wDGfuFo07fTb5CTurUWOMdI8ILcEqUv3SM/exec';

const branchInfo = {
  queretaro: { city: 'Querétaro, México', phone: '524424710760' },
  aguascalientes: { city: 'Aguascalientes, México', phone: '524492656569' },
  monterrey: { city: 'Monterrey, México', phone: '528123204104' }
};

const contenedoresPorSucursal = {
  aguascalientes: {
    "1.1m³": { medidas:"134×107×137 cm", carga:"Carga Manual", material:"Plástico",   imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Ags/1_1.png`,  minimoVisitas:1 },
    "1.5m³": { medidas:"160x135x100 cm",  carga:"Carga Trasera",material:"Acero",      imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Ags/1_5.jpg`,  minimoVisitas:1 },
    "3m³":   { medidas:"152x125x135 cm",  carga:"Carga Trasera",material:"Acero",      imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Ags/3.jpg`,    minimoVisitas:1 },
    "6m³":   { medidas:"160x195x255 cm",  carga:"Carga Trasera",material:"Metal",     imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Ags/6.jpg`,    minimoVisitas:2 }
  },
  queretaro: {
    "1.1m³": { medidas:"134.4×107.4×137 cm", carga:"Carga Manual", material:"Plástico", imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Qro/1_1.jpg`, bolsas:"6–8 bolsas",  minimoVisitas:2 },
    "3m³":   { medidas:"185×120×125 cm",     carga:"Carga Manual", material:"Acero",    imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Qro/3.jpg`,   bolsas:"16–18 bolsas", minimoVisitas:2 },
    "6m³":   { medidas:"190×200×150 cm",     carga:"Carga Manual", material:"Metal",    imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Qro/6.jpg`,   bolsas:"32–36 bolsas", minimoVisitas:2 }
  },
  monterrey: {
    "1.1m³": { medidas:"134.4×107.4×137 cm", carga:"Carga Manual", material:"Plástico", imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Mty/1_1.jpg`, bolsas:"6–8 bolsas",  minimoVisitas:2 },
    "1.5m³": { medidas:"140×110×140 cm",     carga:"Carga Manual", material:"Acero",    imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Mty/1_5.jpg`, bolsas:"8–10 bolsas",  minimoVisitas:2 },
    "3m³":   { medidas:"185×120×125 cm",     carga:"Carga Manual", material:"Acero",    imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Mty/3.jpg`,   bolsas:"16–18 bolsas", minimoVisitas:2 },
    "6m³":   { medidas:"190×200×150 cm",     carga:"Carga Manual", material:"Metal",    imagen:`https://mediosconvalor.github.io/mcv/img/contenedores/Mty/6.jpg`,   bolsas:"32–36 bolsas", minimoVisitas:2 }
  }
};

// --- Helper Functions ---
function formatTitleCase(event) {
  const input = event.target;
  let value = input.value;
  if (value) {
      input.value = value.trim().split(/\s+/).map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join(' ');
  }
}

function formatLowerCase(event) {
  const input = event.target;
  if (input.value) {
      input.value = input.value.split(',').map(email => email.trim().toLowerCase()).join(',');
  }
}

function formatPhoneNumber(event) {
  const input = event.target;
  let value = input.value.replace(/\D/g, ''); 
  const hiddenInput = input.nextElementSibling; 

  if (hiddenInput && hiddenInput.name === 'celular') {
      hiddenInput.value = value;
  }

  if (value.length > 0) {
      if (value.length <= 3) {
          input.value = `(${value}`;
      } else if (value.length <= 6) {
          input.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else {
          input.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
      }
  } else {
      input.value = '';
  }
}

const triggerInput = (elem) => {
  if (!elem) return;
  const event = new Event('input', { bubbles: true });
  elem.dispatchEvent(event);
};

const markManualInput = (e) => {
  if (e.isTrusted) { 
      e.target.dataset.autoFilled = 'false';
  }
};

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Inject Styles
  const style = document.createElement('style');
  style.innerHTML = `.map-container:empty { display: none; } #waToggle i { font-size: 28px; }`;
  document.head.appendChild(style);

  // Set current year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
  }

  // --- Format Listeners ---
  document.querySelectorAll('input[name="nombreComercial"], input[name="nombre"]').forEach(input => {
      input.addEventListener('blur', formatTitleCase);
  });
  document.querySelectorAll('input[name="correo"]').forEach(input => {
      input.addEventListener('blur', formatLowerCase);
  });
  document.querySelectorAll('.celular-visible').forEach(input => {
      input.addEventListener('input', formatPhoneNumber);
      input.addEventListener('blur', formatPhoneNumber);
  });

  // --- Global Keydown (Enter/Escape) ---
  document.addEventListener('keydown', function(event) {
    if (event.target.tagName.toLowerCase() === 'textarea') return;

    const popup = document.getElementById('popup');
    const isPopupVisible = popup && window.getComputedStyle(popup).display !== 'none';

    if (event.key === 'Escape') {
      if (isPopupVisible) {
        const closeBtn = document.getElementById('cerrarPopup');
        if (closeBtn) closeBtn.click();
        return;
      }
      const activeForm = document.querySelector('form.card:not([style*="display: none"])');
      if (activeForm) {
        const activeStep = activeForm.querySelector('.step.active');
        if (activeStep) {
          const backButton = activeStep.querySelector('.back');
          if (backButton) backButton.click();
        }
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault(); 
      const activeForm = document.querySelector('form.card.active'); // Changed selector to be more specific
      if (activeForm) {
        const activeStep = activeForm.querySelector('.step.active');
        if (activeStep) {
          const nextButton = activeStep.querySelector('.next') || activeStep.querySelector('[type="submit"]');
          if (nextButton) nextButton.click();
        }
      }
    }
  });

  // --- Wizard Logic ---
  function setupWizard(formId, startBtnId = null) {
    const bienvenida = document.getElementById('bienvenida');
    const form = document.getElementById(formId);
    if (!form) return;

    const steps = Array.from(form.querySelectorAll('.step'));
    let current = 0;

    function show(i) {
      steps.forEach((s, j) => s.classList.toggle('active', j === i));
      current = i;
      
      // Auto-focus logic
      if (i >= 0 && i < steps.length) {
          setTimeout(() => {
              const firstInput = steps[i].querySelector('input:not([type="hidden"]), select, textarea');
              if (firstInput) {
                  firstInput.focus();
              }
          }, 100); // Small delay to ensure transition is done
      }
    }

    if (startBtnId) {
      const startBtn = document.getElementById(startBtnId);
      if (startBtn) {
        startBtn.onclick = () => {
          if (bienvenida) bienvenida.classList.remove('active');
          form.classList.add('active');
          show(0);
        };
      }
    } else {
      form.classList.add('active');
      show(0);
    }

    form.querySelectorAll('.next').forEach(btn => {
      btn.onclick = () => {
        const campos = steps[current].querySelectorAll('input, select');
        
        // Custom validation for address fields
        for (let campo of campos) {
            if (campo.name === 'direccion') {
                const val = campo.value.trim();
                campo.setCustomValidity(''); // Reset

                if (val.length > 0) {
                    // Check if input is coordinates (Lat, Long)
                    const isCoordinates = /^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/.test(val);

                    if (!isCoordinates) {
                        // Heuristic 1: Length check (relaxed)
                        if (val.length < 5) {
                            campo.setCustomValidity('La dirección es muy breve. Por favor incluye calle, número y colonia.');
                        } 
                        // Heuristic 2: Removed digit check to allow business names
                        // else if (!/\d/.test(val)) { ... }
                        
                        // Heuristic 3: Word count (avoid single words)
                        else if (val.split(/\s+/).length < 2) {
                            campo.setCustomValidity('Por favor escribe la dirección completa.');
                        }
                    }
                }
            }
        }

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

  // --- IP Fetch ---
  fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(d => {
      const ipUser = document.getElementById('ipUsuario');
      const ipExtra = document.getElementById('ipExtra');
      if (ipUser) ipUser.value = d.ip;
      if (ipExtra) ipExtra.value = d.ip;
    })
    .catch(err => console.error('Error fetching IP:', err));


  // --- Geolocation ---
  document.querySelectorAll('#direccionServicio, #direccionExtra').forEach(input => {
      input.addEventListener('input', markManualInput);
  });

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const coordString = `${lat}, ${lon}`;

          ['latitudUsuario', 'latitudUsuario', 'latExtra'].forEach(id => {
              const el = document.getElementById(id);
              if(el) el.value = lat;
          });
          ['longitudUsuario', 'longitudUsuario', 'lonExtra'].forEach(id => {
              const el = document.getElementById(id);
              if(el) el.value = lon;
          });

          let detected = '';
          if (lat > 20 && lat < 21) detected = 'queretaro';
          else if (lat > 21 && lat < 23) detected = 'aguascalientes';
          else if (lat > 24 && lat < 26) detected = 'monterrey';

          if(detected) {
              document.querySelectorAll('select[name="sucursal"]').forEach(sel => {
                  sel.value = detected;
                  sel.dispatchEvent(new Event('change'));
              });
          }

          const inputs = [
              document.getElementById('direccionServicio'),
              document.getElementById('direccionExtra')
          ];

          inputs.forEach(input => {
              if (input) {
                  if (!input.value || input.dataset.autoFilled === 'true') {
                      input.value = coordString;
                      input.dataset.autoFilled = 'true';
                      triggerInput(input);
                  }
              }
          });
      }, (error) => {
          console.log("Geolocalización no autorizada o error:", error);
      });
  }

  // --- Fallback Logic ---
  const setupFallback = (formId, nameInputName, branchInputName, addrInputId) => {
      const form = document.getElementById(formId);
      if (!form) return;
      const nameInput = form.querySelector(`input[name="${nameInputName}"]`);
      const branchInput = form.querySelector(`select[name="${branchInputName}"]`);
      const addrInput = document.getElementById(addrInputId);

      if (!addrInput) return;

      const updateAddress = () => {
          const hasCoords = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(addrInput.value);
          if (hasCoords) return;
          if (addrInput.value.trim() !== "" && addrInput.dataset.autoFilled !== 'true') return;

          const name = nameInput ? nameInput.value.trim() : '';
          const branch = branchInput ? branchInput.value : ''; 
          
          if (name && branch) {
              const branchName = branch.charAt(0).toUpperCase() + branch.slice(1);
              addrInput.value = `${name} ${branchName}`;
              addrInput.dataset.autoFilled = 'true'; 
              triggerInput(addrInput);
          }
      };

      if (nameInput) nameInput.addEventListener('blur', updateAddress);
      if (branchInput) branchInput.addEventListener('change', updateAddress);
  };

  setupFallback('formOrdinario', 'nombreComercial', 'sucursal', 'direccionServicio');
  setupFallback('formExtraordinaria', 'nombreComercial', 'sucursal', 'direccionExtra');

  // --- Map Contexts ---
  const mapContexts = {
    queretaro: "Querétaro, México",
    aguascalientes: "Aguascalientes, México",
    monterrey: "Nuevo León, México"
  };

  const getMapContext = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return '';
    const sel = form.querySelector('select[name="sucursal"]');
    if (!sel) return '';
    const val = sel.value;
    return mapContexts[val] || '';
  };

  // --- Google Maps Iframe Logic ---
  const updateIframeMap = (iframeId, query, searchContext = '') => {
      const iframe = document.getElementById(iframeId);
      if (!iframe) return;

      const container = iframe.parentElement;
      if (!query) {
          // Si no hay query, ocultar el mapa para evitar errores visuales o de carga
          if(container) container.style.display = 'none';
          return;
      }
      
      // Asegurar que el contenedor sea visible si hay query
      if(container) container.style.display = 'block';

      const coordsMatch = query.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
      
      let finalQuery = query;
      // Only append context if it's not a coordinate pair and context exists
      if (!coordsMatch && searchContext) {
          finalQuery = `${query}, ${searchContext}`;
      }

      let mapUrl;
      if (coordsMatch) {
          mapUrl = `https://maps.google.com/maps?q=${query}&z=16&output=embed`;
      } else {
          mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(finalQuery)}&z=16&output=embed`;
      }
      
      if (iframe.src !== mapUrl) {
          iframe.src = mapUrl;
      }
  };

  // Timers separados para evitar conflicto
  let debounceTimerOrd;
  let debounceTimerExtra;

  const debouncedUpdateMapOrd = (query) => {
      clearTimeout(debounceTimerOrd);
      debounceTimerOrd = setTimeout(() => {
          const context = getMapContext('formOrdinario');
          updateIframeMap('mapaDireccion', query, context);
      }, 1000); 
  };

  const debouncedUpdateMapExtra = (query) => {
      clearTimeout(debounceTimerExtra);
      debounceTimerExtra = setTimeout(() => {
          const context = getMapContext('formExtraordinaria');
          updateIframeMap('mapaDireccionExtra', query, context);
      }, 1000); 
  };

  const inputOrd = document.getElementById('direccionServicio');
  if (inputOrd) {
      inputOrd.addEventListener('input', (e) => debouncedUpdateMapOrd(e.target.value));
      if (inputOrd.value) {
          const context = getMapContext('formOrdinario');
          updateIframeMap('mapaDireccion', inputOrd.value, context);
      }
  }
  const inputExtra = document.getElementById('direccionExtra');
  if (inputExtra) {
      inputExtra.addEventListener('input', (e) => debouncedUpdateMapExtra(e.target.value));
      if (inputExtra.value) {
          const context = getMapContext('formExtraordinaria');
          updateIframeMap('mapaDireccionExtra', inputExtra.value, context);
      }
  }

  // Update map on sucursal change if address exists
  const sucursalOrd = document.querySelector('#formOrdinario select[name="sucursal"]');
  if (sucursalOrd) {
      sucursalOrd.addEventListener('change', () => {
          if (inputOrd && inputOrd.value) {
              debouncedUpdateMapOrd(inputOrd.value);
          }
      });
  }

  const sucursalExtra = document.querySelector('#formExtraordinaria select[name="sucursal"]');
  if (sucursalExtra) {
      sucursalExtra.addEventListener('change', () => {
          if (inputExtra && inputExtra.value) {
              debouncedUpdateMapExtra(inputExtra.value);
          }
      });
  }

  // --- Form Submit Logic ---
  const formO = document.getElementById('formOrdinario');
  const formE = document.getElementById('formExtraordinaria');

  if (formO) {
      formO.addEventListener('submit', e => {
        e.preventDefault();
        const submitBtn = formO.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        enviarFormulario(Object.fromEntries(new FormData(formO)));
      });
  }

  if (formE) {
      formE.addEventListener('submit', e => {
        e.preventDefault();
        const submitBtn = formE.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      
        // Use processed collage if available, otherwise check file input (fallback)
        // const fileInput = document.querySelector('#formExtraordinaria input[name="imagen"]'); // Legacy check
        
        if (!processedCollage && accumulatedFiles.length === 0) {
          alert('Por favor sube al menos una imagen.');
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Enviar Solicitud';
          return;
        }
      
        const data = Object.fromEntries(new FormData(formE));
        const ipEl = document.getElementById('ipExtra');
        const latEl = document.getElementById('latExtra');
        const lonEl = document.getElementById('lonExtra');

        data.ip = ipEl ? ipEl.value : '';
        data.latitud = latEl ? latEl.value : '';
        data.longitud = lonEl ? lonEl.value : '';
        data.tipoResiduos = data.tipoResiduos || 'Otros';
      
        // If collage exists, use it. Else read single file (legacy/fallback)
        if (processedCollage) {
             data.imagen = processedCollage;
             enviarFormulario(data);
        } else {
             // Fallback for single file if logic failed
             const reader = new FileReader();
             reader.onload = () => {
               data.imagen = reader.result;
               enviarFormulario(data);
             };
             reader.readAsDataURL(fileInput.files[0]);
        }
      });
  }

  // --- File Input Logic (Collage) ---
  const fileInExtra = document.querySelector('#formExtraordinaria input[name="imagen"]');
  const textInExtra = document.getElementById('textoImagenExtra');
  const fileListExtra = document.getElementById('fileListExtra'); // Container for thumbnails
  
  let processedCollage = null; // Store the final base64 image
  let accumulatedFiles = [];   // Store files in memory

  if (fileInExtra && textInExtra) { 
      fileInExtra.addEventListener('change', async () => {
        const newFiles = Array.from(fileInExtra.files);
        
        // Add new files to accumulated list (up to 4)
        for(const f of newFiles) {
            if (accumulatedFiles.length < 4) {
                // Optional: Check duplicates by name/size if needed
                accumulatedFiles.push(f);
            }
        }

        // Reset input so same file can be selected again if needed
        fileInExtra.value = '';

        updateThumbnails();
        await processImages();
      });
  }

  function updateThumbnails() {
      if (!fileListExtra) return;
      fileListExtra.innerHTML = '';
      
      accumulatedFiles.forEach((file, index) => {
          const div = document.createElement('div');
          div.className = 'thumb-item';
          div.style.display = 'inline-block';
          div.style.margin = '5px';
          div.style.position = 'relative';

          const img = document.createElement('img');
          img.style.width = '60px';
          img.style.height = '60px';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '5px';
          
          const reader = new FileReader();
          reader.onload = e => img.src = e.target.result;
          reader.readAsDataURL(file);

          const removeBtn = document.createElement('div');
          removeBtn.innerHTML = '×';
          removeBtn.style.position = 'absolute';
          removeBtn.style.top = '-5px';
          removeBtn.style.right = '-5px';
          removeBtn.style.background = 'red';
          removeBtn.style.color = 'white';
          removeBtn.style.borderRadius = '50%';
          removeBtn.style.width = '18px';
          removeBtn.style.height = '18px';
          removeBtn.style.textAlign = 'center';
          removeBtn.style.lineHeight = '18px';
          removeBtn.style.cursor = 'pointer';
          removeBtn.style.fontSize = '12px';
          
          removeBtn.onclick = async () => {
              accumulatedFiles.splice(index, 1);
              updateThumbnails();
              await processImages();
          };

          div.appendChild(img);
          div.appendChild(removeBtn);
          fileListExtra.appendChild(div);
      });
  }

  async function processImages() {
      if (accumulatedFiles.length > 0) {
          textInExtra.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Procesando ${accumulatedFiles.length} imagen(es)...`;
          try {
              processedCollage = await createCollage(accumulatedFiles);
              textInExtra.innerHTML = `✅ ${accumulatedFiles.length} imagen(es) lista(s) (Máx 4)`;
          } catch (e) {
              console.error(e);
              textInExtra.innerHTML = `❌ Error al procesar imágenes`;
              processedCollage = null;
          }
      } else {
          textInExtra.innerHTML = '<i class="fas fa-upload"></i> Seleccionar imágenes (Máx 4)';
          processedCollage = null;
      }
  }

  function createCollage(files) {
      return new Promise((resolve, reject) => {
          const images = [];
          let loaded = 0;

          files.forEach(file => {
              const img = new Image();
              const reader = new FileReader();
              
              reader.onload = (e) => {
                  img.onload = () => {
                      images.push(img);
                      loaded++;
                      if (loaded === files.length) {
                          drawCanvas();
                      }
                  };
                  img.src = e.target.result;
              };
              reader.readAsDataURL(file);
          });

          function drawCanvas() {
              const size = 1200; // Output size
              const canvas = document.createElement('canvas');
              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext('2d');
              
              // White background
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, size, size);

              const count = images.length;
              let grid = []; // {x, y, w, h}

              if (count === 1) {
                  grid.push({x:0, y:0, w:size, h:size});
              } else if (count === 2) {
                  // Split vertical
                  grid.push({x:0, y:0, w:size/2, h:size});
                  grid.push({x:size/2, y:0, w:size/2, h:size});
              } else if (count === 3 || count === 4) {
                  // 2x2 Grid
                  const half = size/2;
                  grid.push({x:0, y:0, w:half, h:half});
                  grid.push({x:half, y:0, w:half, h:half});
                  grid.push({x:0, y:half, w:half, h:half});
                  if(count === 4) grid.push({x:half, y:half, w:half, h:half});
              }

              images.forEach((img, i) => {
                  if (i >= grid.length) return;
                  const box = grid[i];
                  drawImageProp(ctx, img, box.x, box.y, box.w, box.h);
              });

              resolve(canvas.toDataURL('image/jpeg', 0.8));
          }
      });
  }

  // Helper to simulate object-fit: cover
  function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
      if (arguments.length < 2) throw new Error('drawImageProp requires context and image');
      x = x || 0; y = y || 0; w = w || ctx.canvas.width; h = h || ctx.canvas.height;
      offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
      offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

      if (offsetX < 0) offsetX = 0;
      if (offsetX > 1) offsetX = 1;
      if (offsetY < 0) offsetY = 0;
      if (offsetY > 1) offsetY = 1;

      var iw = img.width, ih = img.height,
          r = Math.min(w / iw, h / ih),
          nw = iw * r,   // new prop. width
          nh = ih * r,   // new prop. height
          cx, cy, cw, ch, ar = 1;

      // Decide which gap to fill
      if (nw < w) ar = w / nw;                             
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
      nw *= ar;
      nh *= ar;

      // Calc source rectangle
      cw = iw / (nw / w);
      ch = ih / (nh / h);

      cx = (iw - cw) * offsetX;
      cy = (ih - ch) * offsetY;

      // make sure source rectangle is valid
      if (cx < 0) cx = 0;
      if (cy < 0) cy = 0;
      if (cw > iw) cw = iw;
      if (ch > ih) ch = ih;

      ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
  }

  // --- WhatsApp Logic ---
  const waToggle = document.getElementById('waToggle');
  const waList = document.getElementById('waList');
  const defaultMsg = encodeURIComponent('Te escribo por el tema de una cotización');

  if (waToggle && waList) {
      waToggle.onclick = () => {
        // Find active form
        const activeForm = document.querySelector('form.card.active');
        let selectedBranch = null;

        if (activeForm) {
            const branchSelect = activeForm.querySelector('select[name="sucursal"]');
            if (branchSelect && branchSelect.value) {
                selectedBranch = branchSelect.value;
            }
        }

        if (selectedBranch && branchInfo[selectedBranch]) {
             const info = branchInfo[selectedBranch];
             window.open(`https://wa.me/${info.phone}?text=${defaultMsg}`, '_blank');
             waList.style.display = 'none'; 
        } else {
             waList.style.display = waList.style.display === 'block' ? 'none' : 'block';
        }
      };

      waList.querySelectorAll('li').forEach(li => {
        li.onclick = () => {
          const info = branchInfo[li.dataset.key];
          if (info) {
            window.open(`https://wa.me/${info.phone}?text=${defaultMsg}`, '_blank');
          }
        };
      });
  }

  // --- Contenedores Logic ---
  const selSucO   = document.querySelector('#formOrdinario select[name="sucursal"]');
  const selContO  = document.querySelector('#formOrdinario select[name="contenedor"]');
  const infoContO = document.getElementById('infoContenedorOrdi');
  const selFreqO  = document.querySelector('#formOrdinario select[name="frecuencia"]');

  const branchEmails = {
    queretaro: "calidadqro@mediosconvalor.com",
    aguascalientes: "ventasags@mediosconvalor.com",
    monterrey: "facturasmty@mediosconvalor.com"
  };

  function updateContactInfo() {
      if (!selSucO) return;
      const suc = selSucO.value;
      const email = branchEmails[suc] || "contacto@mediosconvalor.com";
      const phone = branchInfo[suc] ? branchInfo[suc].phone : "";
      
      const emailLink = `<a href="mailto:${email}" style="color: inherit; text-decoration: underline;">${email}</a>`;
      const waLink = phone ? ` o <a href="https://wa.me/${phone}?text=${encodeURIComponent('Hola, necesito ayuda con el volumen/frecuencia de recolección')}" target="_blank" style="color: #25D366; text-decoration: none;"><i class="fab fa-whatsapp"></i> WhatsApp</a>` : '';

      const msgContent = `${emailLink}${waLink}`;

      const msgContenedor = document.getElementById('mensajeContenedorOrdi');
      const spanContenedor = document.getElementById('correoContenedorOrdi');
      if (msgContenedor && spanContenedor) {
          spanContenedor.innerHTML = msgContent;
          msgContenedor.style.display = suc ? 'block' : 'none';
      }

      const msgVisitas = document.getElementById('mensajeVisitas');
      const spanVisitas = document.getElementById('correoVisitas');
      if (msgVisitas && spanVisitas) {
          spanVisitas.innerHTML = msgContent;
          msgVisitas.style.display = suc ? 'block' : 'none';
      }
  }

  function fillContenedores() {
    if (!selContO || !selSucO) return;
    selContO.innerHTML = '<option value="">Selecciona un contenedor</option>';
    const suc = selSucO.value;
    
    updateContactInfo();

    const conts = contenedoresPorSucursal[suc] || {};
    Object.entries(conts).forEach(([tamaño, info]) => {
      selContO.append(new Option(tamaño, tamaño));
    });
  }
  
  function actualizarVisitas() {
    if (!selFreqO || !selSucO || !selContO) return;
    selFreqO.innerHTML = '<option value="">Selecciona visitas</option>';
    const suc = selSucO.value;
    const tam = selContO.value;
    if(!tam) return;
    const info = (contenedoresPorSucursal[suc]||{})[tam];
    const min = info?.minimoVisitas||1;
    for(let i=min;i<=6;i++) selFreqO.append(new Option(i,i));
  }
  
  function mostrarInfoContenedor() {
    if (!infoContO || !selSucO || !selContO) return;
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
  
  if (selSucO && selContO) {
      selSucO.addEventListener('change', ()=>{
        fillContenedores();
        if (infoContO) infoContO.innerHTML='';
        if (selFreqO) selFreqO.innerHTML='<option value="">Selecciona visitas</option>';
      });
      selContO.addEventListener('change', ()=>{
        actualizarVisitas();
        mostrarInfoContenedor();
      });
      
      // Inicializar
      fillContenedores();
      actualizarVisitas();
  }

  // --- Leaflet Logic (Interactive Map Selection) ---
  const cityCoords = {
    queretaro: [20.5888, -100.3899],
    aguascalientes: [21.8818, -102.2916],
    monterrey: [25.6866, -100.3161]
  };

  function setupLeaflet(btnId, mapContainerId, inputId, iframeContainerId, branchSelectName) {
      const btn = document.getElementById(btnId);
      const mapDiv = document.getElementById(mapContainerId);
      const input = document.getElementById(inputId);
      const iframeDiv = document.getElementById(iframeContainerId);
      
      if (!btn || !mapDiv || !input) return;

      let map = null;
      let marker = null;

      btn.addEventListener('click', () => {
          // Toggle visibility
          if (mapDiv.style.display === 'none') {
              mapDiv.style.display = 'block';
              if(iframeDiv) iframeDiv.style.display = 'none'; // Hide Google Map
              btn.innerHTML = '<i class="fas fa-times"></i> Cancelar selección manual';
              btn.style.background = '#e74c3c'; // Red color for cancel
              
              if (!map) {
                  // Init Map
                  map = L.map(mapContainerId).setView([20.5888, -100.3899], 13);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      attribution: '&copy; OpenStreetMap contributors'
                  }).addTo(map);

                  // Click Event
                  map.on('click', (e) => {
                      const { lat, lng } = e.latlng;
                      const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                      
                      input.value = coords;
                      input.dataset.autoFilled = 'true'; 
                      triggerInput(input); // Updates Google Map logic

                      // Switch back
                      mapDiv.style.display = 'none';
                      if(iframeDiv) iframeDiv.style.display = 'block';
                      btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Seleccionar ubicación exacta en el mapa';
                      btn.style.background = '#2c3e50';
                  });
              }

              // Set View based on current input or branch
              const currentVal = input.value;
              const coordsMatch = currentVal.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
              
              if (coordsMatch) {
                   const lat = parseFloat(coordsMatch[1]);
                   const lon = parseFloat(coordsMatch[3]);
                   map.setView([lat, lon], 16);
                   if(marker) marker.setLatLng([lat, lon]);
                   else marker = L.marker([lat, lon]).addTo(map);
              } else {
                  // Try to find branch
                  const form = input.closest('form');
                  const branchSel = form ? form.querySelector(`select[name="${branchSelectName}"]`) : null;
                  const branch = branchSel ? branchSel.value : '';
                  
                  if (branch && cityCoords[branch]) {
                      map.setView(cityCoords[branch], 13);
                  }
              }
              
              // Leaflet needs invalidatesize after becoming visible
              setTimeout(() => { map.invalidateSize(); }, 100);

          } else {
              // Cancel
              mapDiv.style.display = 'none';
              if(iframeDiv) iframeDiv.style.display = 'block'; // Show Google Map back
              btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Seleccionar ubicación exacta en el mapa';
              btn.style.background = '#2c3e50';
          }
      });
  }

  setupLeaflet('btnMapSelectOrd', 'leafletMapOrd', 'direccionServicio', 'mapaDireccionContainer', 'sucursal');
  setupLeaflet('btnMapSelectExtra', 'leafletMapExtra', 'direccionExtra', 'mapaDireccionExtraContainer', 'sucursal');

});

// --- Submission Helper Functions ---
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
  
  if (!pop) return;

  if (emoji) emoji.textContent = ok ? '✅' : '❌';
  if (mensaje) mensaje.textContent = ok ? '¡Formulario enviado correctamente!' : 'Error al enviar. Intenta más tarde.';
  if (opts) {
      opts.innerHTML = '<button id="cerrarPopup">Cerrar</button>';
      const closeBtn = document.getElementById('cerrarPopup');
      if (closeBtn) closeBtn.onclick = () => window.location.href = window.location.href;
  }
  pop.style.display = 'flex';
}
