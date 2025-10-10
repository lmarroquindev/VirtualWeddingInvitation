// ========================================================
// 1. SCROLL ANIMADO (Smooth Scroll)
// Ahora apunta al BODY/HTML para manejar el scroll globalmente
// ========================================================
document.querySelectorAll('.mobile-menu a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // 1. Cierra el menú móvil
            document.getElementById('mobile-menu').classList.remove('open');
            document.querySelector('.menu-toggle').classList.remove('open');
            
            // 2. Determina el elemento que hace el scroll (Body/HTML)
            const scrollContainer = document.querySelector('.content-panel');
            
            // 3. Calcula la posición del elemento objetivo
            // Usamos scrollIntoView en el elemento objetivo (targetElement)
            // Esto es más simple y efectivo que calcular offsetTop y funciona en el content-panel
            
            scrollContainer.scrollTo({
                top: targetElement.offsetTop, // Usamos la posición del elemento dentro del panel
                behavior: 'smooth'
            });
        }
    });
});

// ========================================================
// 2. ACORDEÓN (FAQ)
// ========================================================
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        
        // Cierra todas las otras respuestas
        document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
            if (openAnswer !== answer) {
                openAnswer.classList.remove('open');
            }
        });

        // Alternar (abrir/cerrar) la respuesta actual
        answer.classList.toggle('open');
    });
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
// 6. BOTÓN EXPLORAR MAPA
// ========================================================
document.querySelector('.btn-map-explore').addEventListener('click', function() {
    const iframe = this.nextElementSibling;
    
    if (iframe.style.display === 'none') {
        iframe.style.display = 'block';
        this.textContent = 'Ocultar Mapa';
    } else {
        iframe.style.display = 'none';
        this.textContent = 'Explorar en Mapa';
    }
});