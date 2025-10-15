// ========================================================
// ESTRUCTURA PRINCIPAL: Asegura que el DOM esté cargado
// ========================================================
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