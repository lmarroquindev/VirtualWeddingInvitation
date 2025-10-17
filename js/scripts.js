// ========================================================
// ESTRUCTURA PRINCIPAL: Asegura que el DOM esté cargado
// ========================================================
document.addEventListener("DOMContentLoaded", function () {
  const music = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("music-toggle");
  const overlay = document.getElementById("intro-overlay");

  music.volume = 0.5;
  let musicStarted = false;

  function updateIcon() {
    const icon = toggleBtn.querySelector("i");

    // Agregamos clase temporal para animar salida
    icon.classList.add("switching");

    // Esperamos a que termine la transición (300ms)
    setTimeout(() => {
      if (!music.paused) {
        icon.classList.remove("fa-volume-mute");
        icon.classList.add("fa-music");
        toggleBtn.classList.add("playing");
        toggleBtn.setAttribute("aria-pressed", "true");
        toggleBtn.setAttribute("title", "Pausar música");
      } else {
        icon.classList.remove("fa-music");
        icon.classList.add("fa-volume-mute");
        toggleBtn.classList.remove("playing");
        toggleBtn.setAttribute("aria-pressed", "false");
        toggleBtn.setAttribute("title", "Reproducir música");
      }

      // Quitamos la clase de animación para hacer fade-in
      icon.classList.remove("switching");
    }, 150); // La mitad de la transición CSS para sincronizar entrada y salida
  }

  function tryStartMusic() {
    if (musicStarted) return;
    musicStarted = true;
    music.play()
      .then(() => {
        // no hace falta updateIcon() aquí porque el evento 'play' lo actualizará
      })
      .catch(err => console.log("Autoplay bloqueado:", err));
  }

    const musicMutedCookie = getCookie("music_muted");
    if (musicMutedCookie) {
    // Si existe la cookie, ocultamos y removemos el overlay inmediatamente
    overlay.remove()
    music.pause(); // opcional, asegurarse que no se reproduzca
    updateIcon();  // actualiza icono según estado
    } else {
    // Si no hay cookie, se muestra normalmente
    overlay.classList.remove("hidden");
    overlay.addEventListener("click", () => {
        overlay.classList.add("hidden");
        setTimeout(() => overlay.remove(), 600);
        tryStartMusic();
    });
    }


  // ESCUCHAR eventos nativos del audio para mantener el icono sincronizado
  music.addEventListener("play", updateIcon);
  music.addEventListener("pause", updateIcon);
  // También en caso de que el audio acabe o se reinicie
  music.addEventListener("ended", updateIcon);
  music.addEventListener("volumechange", updateIcon);

  // Control de música manual
   toggleBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play()
      .then(() => {
        deleteCookie("music_muted"); // si activa audio, borramos cookie
      })
      .catch(err => console.log("No se pudo reproducir:", err));
    } else {
      music.pause();
      setCookie("music_muted", "true", 0.5); // si pausa audio, guardamos cookie
    }
  });

  // Accesibilidad: permitir activar con Enter o Space
  toggleBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBtn.click();
    }
  });

    // Detectar si la pestaña se oculta o se vuelve visible
  document.addEventListener("visibilitychange", () => {
    const wasPlaying = !music.paused;
    if (document.hidden && wasPlaying) {
      music.pause();
      toggleBtn.dataset.wasPlaying = "true";
    } else if (!document.hidden && toggleBtn.dataset.wasPlaying === "true") {
      music.play().catch(() => {});
      delete toggleBtn.dataset.wasPlaying;
    }
  });

  // Detectar pérdida y recuperación de foco de la ventana (móvil y escritorio)
  window.addEventListener("blur", () => {
    if (!music.paused) {
      music.pause();
      toggleBtn.dataset.wasPlaying = "true";
    }
  });

  window.addEventListener("focus", () => {
    if (toggleBtn.dataset.wasPlaying === "true") {
      music.play().catch(() => {});
      delete toggleBtn.dataset.wasPlaying;
    }
  });

  // Inicializa el icono según el estado inicial del audio
  updateIcon();
});

// Guardar cookie simple
function setCookie(name, value, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

// Leer cookie
function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '');
}

// Borrar cookie
function deleteCookie(name) {
  setCookie(name, '', -1);
}


document.addEventListener('DOMContentLoaded', function() {
    // ========================================================
    // 1. SCROLL ANIMADO (Smooth Scroll) - SOLUCIÓN DEFINITIVA
    // ========================================================
    document.querySelectorAll('.mobile-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const scrollContainer = document.querySelector('.content-panel'); // Tu contenedor de scroll

            if (targetElement && scrollContainer) {
                // 1. Cierra el menú móvil
                document.getElementById('mobile-menu').classList.remove('open');
                document.querySelector('.menu-toggle').classList.remove('open');

                // 2. Cálculo de la posición (la parte que fallaba)
                
                // a) Obtiene la posición vertical del elemento destino (relativa a la ventana)
                const targetRect = targetElement.getBoundingClientRect();
                
                // b) Obtiene la posición vertical del contenedor de scroll (relativa a la ventana)
                const containerRect = scrollContainer.getBoundingClientRect();
                
                // c) Calcula la posición del elemento relativa al scroll top del contenedor
                // Es decir: (Distancia del elemento al borde superior de la ventana) - (Distancia del contenedor al borde superior) + (Cuánto se ha scrolleado el contenedor)
                const offsetTop = targetRect.top - containerRect.top + scrollContainer.scrollTop;

                // 3. Realiza el scroll suave
                scrollContainer.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth' // Esta propiedad ahora sí debe funcionar
                });
            }
        });
    });

    // ========================================================
    // 2. ACORDEÓN (FAQ)
    // ========================================================
    // document.querySelectorAll('.faq-question').forEach(button => {
    //     button.addEventListener('click', () => {
    //         const answer = button.nextElementSibling;
            
    //         // Cierra todas las otras respuestas
    //         document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
    //             if (openAnswer !== answer) {
    //                 openAnswer.classList.remove('open');
    //             }
    //         });

    //         // Alternar (abrir/cerrar) la respuesta actual
    //         answer.classList.toggle('open');
    //     });
    // });
    document.addEventListener('click', (e) => {
        const question = e.target.closest('.faq-question');
        if (!question) return;
        question.classList.toggle('active');
    });


    // ========================================================
    // 3. CARRUSEL AUTOMÁTICO DE IMÁGENES
    // ========================================================
    const slides = document.querySelectorAll('.image-carousel .carousel-slide');
    let currentSlide = 0;

    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Inicia el carrusel para que cambie automáticamente cada 5 segundos
    setInterval(showNextSlide, 5000); 
    if (slides.length > 0) {
        slides[0].classList.add('active'); // Asegura que la primera se muestre al inicio
    }


    // ========================================================
    // 4. BOTÓN DE MENÚ MÓVIL (HAMBURGUESA)
    // ========================================================
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        this.classList.toggle('open');
        menu.classList.toggle('open');
    });


    // ========================================================
    // 5. MANEJO DE FORMULARIOS (Simulación)
    // ========================================================
    document.querySelectorAll('.form-container').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formId = this.closest('section').id;

            if (formId === 'rsvp') {
                alert('¡Gracias por confirmar tu asistencia! (Datos enviados)');
            } else if (formId === 'deseos') {
                alert('¡Mensaje enviado! Les agradecemos sus buenos deseos.');
            }
            
            this.reset();
        });
    });

    // ========================================================
    // 6. BOTÓN EXPLORAR MAPA (LA SOLUCIÓN A TU PROBLEMA)
    // ========================================================
    const mapButton = document.getElementById('btn-map-explore'); 
    const mapFrame = document.getElementById('map-frame');         

    // Verificamos que los elementos existan. Si el script se ejecuta a tiempo, SÍ existirán aquí.
    if (mapButton && mapFrame) {
        mapButton.addEventListener('click', function() {
            // Este console.log AHORA DEBERÍA APARECER
            console.log("🚀 ~ Evento Click del Mapa Recibido. MapFrame:", mapFrame);
            
            // Lógica para mostrar/ocultar
            if (mapFrame.style.display === 'none') {
                mapFrame.style.display = 'block';
                this.textContent = 'Ocultar Mapa'; 
            } else {
                mapFrame.style.display = 'none';
                this.textContent = 'Explorar en Mapa'; 
            }
        });
    } else {
         // (Opcional) Esto te ayuda a saber si el error es de ID en el HTML
         console.error("Error: Los IDs 'btn-map-explore' o 'map-frame' no se encontraron en el DOM.");
    }
}); 



// ========================================================
// FIN DEL DOMContentLoaded
// ========================================================