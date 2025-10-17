const { createApp, ref, onMounted } = Vue;
import { countdown, startCountdown } from './countdown.js';
import { Evento, Link, PreguntaRespuesta, Deseo } from './models.js';
const app = createApp({
    setup() {
        // ===========================
        // ESTADOS PRINCIPALES (data)
        // ===========================
        const eventos = ref([]);           // Lista de eventos
        const link = ref(null);            // Lista de links para RSVP
        const preguntas = ref([]);         // Lista de preguntas y respuestas
        const activeIndex = ref(null);
        const deseos = ref(null);            // Lista de deseos enviados (opcional)
        const loadingEventos = ref(false); // Estado de carga de eventos
        const loadingLinks = ref(false);   // Estado de carga de links
        const loadingPreguntas = ref(false); // Estado de carga de preguntas
        const error = ref(null);           // Error global si algo falla

        // Tomamos el parámetro de la URL
        const params = new URLSearchParams(window.location.search);
        const invitationId = params.get("i");

        // ===========================
        // Confirmar reservacion
        // ===========================
        const asistenciaInvitado1 = ref("");
        const asistenciaInvitado2 = ref("");
        const comentario = ref("");

        // ===========================
        // Formulario deseos
        // ===========================
        const nombreDeseos = ref("");
        const comentarioDeseos = ref("");

        // ===========================
        // Mostrar confirmaciones
        // ===========================
        const mostrarConfirmacionDeseos = ref(false);

        // countdown se importa y es reactivo
        // no necesitas volver a ref, Vue lo reconoce
        const countdownState = countdown;
        
        const loadingConfirmacion = ref(false);
        const progress = ref(0);

        const loadingDeseos = ref(false);
        const progressDeseos = ref(0);
        // ===========================
        // FUNCIONES PARA CARGAR DATOS
        // ===========================

        // Cargar eventos
        const fetchEventos = async () => {
            loadingEventos.value = true;
            error.value = null;
            try {
                const raw = await getEventos();
                if (raw && Array.isArray(raw)) {
                    eventos.value = raw.map(e => new Evento(e));
                } else {
                    eventos.value = []; // vacío si la API devuelve null
                }

                if (eventos.value.length > 0) {
                    startCountdown(eventos.value[0].fechaHoraEvento);
                }
            } catch (err) {
                console.error('Error eventos:', err);
                error.value = 'No se pudieron cargar los eventos.';
            } finally {
                loadingEventos.value = false;
            }
        };

        // Cargar links
        const fetchLinks = async () => {
            loadingLinks.value = true;
            error.value = null;
            try {
                const raw = await getLinks(invitationId);
                if (raw) {
                    link.value = new Link(raw);
                } else {
                    link.value = null; // no crear instancia si raw es null
                }

                if (link.value?.confirmacionAsistenciaEnviada) {
                    asistenciaInvitado1.value = link.value.asistencia1Confirmada ? "si" : "no";
                    asistenciaInvitado2.value = link.value.asistencia2Confirmada ? "si" : "no";
                    comentario.value = link.value.comentario || "";
                }
            } catch (err) {
                console.error('Error links:', err);
                error.value = 'No se pudieron cargar los links.';
            } finally {
                loadingLinks.value = false;
            }
        };

        // Cargar preguntas
        const fetchPreguntas = async () => {
            loadingPreguntas.value = true;
            error.value = null;
            try {
                const raw = await getPreguntas();
                if (raw && Array.isArray(raw)) {
                    preguntas.value = raw.map(p => new PreguntaRespuesta(p));
                } else {
                    preguntas.value = [];
                }
            } catch (err) {
                console.error('Error preguntas:', err);
                error.value = 'No se pudieron cargar las preguntas.';
            } finally {
                loadingPreguntas.value = false;
            }
        };

        // ===========================
        // FUNCIONES DE ACCIÓN
        // ===========================

        // Confirmar asistencia de un link
        const confirmarAsistencia = async () => {
            try {
                const updated = await confirmarReserva(
                    link.value.id,
                    asistenciaInvitado1.value,
                    asistenciaInvitado2.value,
                    comentario.value
                );
                // Actualizamos directamente el objeto reactivo
                link.value = new Link(updated);
            } catch (err) {
                console.error('Error confirmar asistencia:', err);
            }
        };

        //Mock COnfirmar asistencia
        // const confirmarAsistencia = async () => {
        //     try {
        //         console.log("Iniciando mock de confirmación de asistencia...");

        //         // Simulamos una request a la base que tarda más de 10 segundos
        //         const updated = await new Promise((resolve) => {
        //         setTimeout(() => {
        //             console.log("Simulación de respuesta del servidor completada (mock).");
        //             // Datos simulados de respuesta
        //             resolve({
        //             id: link.value.id,
        //             asistenciaInvitado1: asistenciaInvitado1.value,
        //             asistenciaInvitado2: asistenciaInvitado2.value,
        //             comentario: comentario.value,
        //             confirmado: true,
        //             fechaConfirmacion: new Date().toISOString()
        //             });
        //         }, 10500); // 10.5 segundos de retardo simulado
        //         });

        //         // Actualizamos el objeto reactivo como lo haría la request real
        //         // link.value = new Link(updated);

        //     } catch (err) {
        //         console.error("Error confirmar asistencia (mock):", err);
        //     }
        //     finally{
        //             console.log("TERMINO Simulación de respuesta del servidor completada (mock).");

        //     }
        //     };

        // Enviar un nuevo deseo
        const enviarDeseo = async (idLink,nombre,comentario) => {
            try {
                const nuevoDeseo = new Deseo({ comentario, idLink, nombre });
                const saved = await postDeseo(nuevoDeseo);

                if(saved?.id)
                {
                    nombreDeseos.value = '';
                    comentarioDeseos.value = '';
                    deseos.value = null;
                    // deseos.value =null;
                    mostrarConfirmacionDeseos.value = true;
                    setTimeout(() => {
                        mostrarConfirmacionDeseos.value = false;
                    }, 10000);
                }
            } catch (err) {
                console.error('Error enviar deseo:', err);
            }
        };

        //Mock enviarDeseo
        // const enviarDeseo = async (idLink, nombre, comentario) => {
        //     return new Promise((resolve, reject) => {
        //         console.log('Simulando envío del deseo...');
        //         setTimeout(() => {
        //             // simulamos que todo salió bien
        //             console.log('Deseo enviado correctamente.');
                    
        //             // limpiar campos
        //             nombreDeseos.value = '';
        //             comentarioDeseos.value = '';
        //             deseos.value = null;
        //             mostrarConfirmacionDeseos.value = true;

        //             // Ocultar confirmación después de 10s
        //             setTimeout(() => {
        //                 mostrarConfirmacionDeseos.value = false;
        //             }, 10000);

        //             resolve({ id: 1 }); // simulamos respuesta del servidor
        //         }, 3000); // <--- 3 segundos
        //     });
        // };


        // ===========================
        // Eventos OnClick
        // ===========================
        const handlerEnviarConfirmacion = async () => {
             if (loadingConfirmacion.value) return; // evitar doble click
             triggerProgressBar("btn-send-confirmation");
             loadingConfirmacion.value = true;
             progress.value = 0;
 
           // Simulamos progreso hasta el 90%
            const interval = setInterval(() => {
                if (progress.value < 95) {
                progress.value += Math.random() * 5; // avanza de forma natural
                if (progress.value > 95) progress.value = 95;
                }
            }, 200);

            try {
                // Llamamos a la función que guarda la asistencia
                await confirmarAsistencia(link.value.id);
                // Al terminar, completamos la barra
                progress.value = 100;
            } catch (err) {
                console.error("Error al enviar confirmación:", err);
            }
            finally {
                 clearInterval(interval);
                // Mantenemos el 100% visible un momento
                setTimeout(() => {
                loadingConfirmacion.value = false;
                progress.value = 0;
                }, 800);
            }
        };

        const handlerEnviarDeseos = async () => {

            if (loadingDeseos.value) return; // evitar doble click
             triggerProgressBar("btn-send-wishes");
             loadingDeseos.value = true;
             progressDeseos.value = 0;

            const interval = setInterval(() => {
                if (progressDeseos.value < 95) {
                progressDeseos.value += Math.random() * 5; // avanza de forma natural
                if (progressDeseos.value > 95) progressDeseos.value = 95;
                }
            }, 200);
            try {
                const payload = {
                    idLink: link.value.id,
                    nombre: nombreDeseos.value,
                    comentario: comentarioDeseos.value,
                };
                // Llamamos a la función que guarda la asistencia
                await enviarDeseo(payload.idLink, payload.nombre, payload.comentario);

                progressDeseos.value = 100;
            } catch (err) {
                console.error("Error al enviar confirmación:", err);
            }
            finally {
                clearInterval(interval);
                setTimeout(() => {
                    loadingDeseos.value = false;        // Vue reactive ref
                    progressDeseos.value = 0;           // reset barra
                    const button = document.getElementById('btn-send-wishes');
                    if (button) button.classList.remove('loading', 'active'); // quitar clases
                }, 800);
            }
        };

        function triggerProgressBar(buttonId) {
            const button = document.getElementById(buttonId);
            if (!button) return;

            if (!button.classList.contains("active")) {
                button.classList.add("active", "loading"); // agregamos clase loading

                // Limpiar la barra si estaba en algún estado anterior
                const progress = button.querySelector('.progress');
                if (progress) progress.style.width = '0%';
            }

            return button.querySelector('.progress'); // retornamos la barra para manipularla
        }

        function toggle(index) {
            activeIndex.value = activeIndex.value === index ? null : index;
        }

        // ===========================
        // CICLO DE VIDA
        // ===========================
        onMounted(() => {
            fetchEventos();
            fetchLinks();
            fetchPreguntas();
        });

        // ===========================
        // RETORNO A TEMPLATE
        // ===========================
        return {
            eventos,
            countdownState,
            link,
            preguntas,
            deseos,
            loadingEventos,
            loadingLinks,
            loadingPreguntas,
            error,
            asistenciaInvitado1,
            asistenciaInvitado2,
            comentario,
            nombreDeseos,
            comentarioDeseos,
            mostrarConfirmacionDeseos,
            activeIndex,
            loadingConfirmacion,
            progress,
            loadingDeseos,
            progressDeseos,
            handlerEnviarConfirmacion,
            handlerEnviarDeseos,
            toggle
        };
    }
});

app.mount('#app-container');
