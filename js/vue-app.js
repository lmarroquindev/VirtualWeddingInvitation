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
        const deseos = ref([]);            // Lista de deseos enviados (opcional)
        const loadingEventos = ref(false); // Estado de carga de eventos
        const loadingLinks = ref(false);   // Estado de carga de links
        const loadingPreguntas = ref(false); // Estado de carga de preguntas
        const error = ref(null);           // Error global si algo falla

        // Tomamos el parámetro de la URL
        const params = new URLSearchParams(window.location.search);
        const invitationId = params.get("i");

        console.log("🎟️ Invitación actual:", invitationId);

        // ===========================
        // Confirmar reservacion
        // ===========================
        const asistenciaInvitado1 = ref("");
        const asistenciaInvitado2 = ref("");
        const comentario = ref("");

        // countdown se importa y es reactivo
        // no necesitas volver a ref, Vue lo reconoce
        const countdownState = countdown;
        
        // ===========================
        // FUNCIONES PARA CARGAR DATOS
        // ===========================

        // Cargar eventos
        const fetchEventos = async () => {
            loadingEventos.value = true;
            error.value = null;
            try {
                const raw = await getEventos();
                console.log("🚀 ~ fetchEventos ~ raw:", raw)
                if (raw && Array.isArray(raw)) {
                    eventos.value = raw.map(e => new Evento(e));
                } else {
                    eventos.value = []; // vacío si la API devuelve null
                }

                if (eventos.value.length > 0) {
                    console.log("🚀 ~ fetchEventos ~ eventos.value:", eventos.value)

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
                console.log("🚀 ~ fetchLinks ~ raw:", raw)
                // link.value = reactive(new Link(raw));
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
                
                console.log("🚀 ~ fetchLinks ~ links:", link.value)
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
                console.log("🚀 ~ confirmarAsistencia antes ~ link.value:", link.value)

                const updated = await confirmarReserva(
                    link.value.id,
                    asistenciaInvitado1.value,
                    asistenciaInvitado2.value,
                    comentario.value
                );
                // Actualizamos directamente el objeto reactivo
                link.value = new Link(updated);
                console.log("✅ Asistencia confirmada:", link.value);
                alert("✅ ¡Gracias por confirmar tu asistencia!");
            } catch (err) {
                console.error('Error confirmar asistencia:', err);
                alert("❌ Ocurrió un error al confirmar tu asistencia.");
            }
        };

        // Enviar un nuevo deseo
        const enviarDeseo = async (comentario, idLink, idEvento) => {
            try {
                const nuevoDeseo = new Deseo({ comentario, idLink, idEvento });
                const saved = await postDeseo(nuevoDeseo);
                deseos.value.push(new Deseo(saved)); // Guardamos localmente
                console.log('Deseo guardado:', saved);
            } catch (err) {
                console.error('Error enviar deseo:', err);
            }
        };

        // ===========================
        // Eventos OnClick
        // ===========================
        const handlerEnviarConfirmacion = async () => {
            try {
                // Aquí puedes combinar la información de ambos invitados
                const payload = {
                    idLink: link.value.id,
                    asistenciaInvitado1: asistenciaInvitado1.value,
                    asistenciaInvitado2: asistenciaInvitado2.value || null,
                    comentario: comentario.value
                };

                console.log("📨 Enviando confirmación:", payload);

                // Llamamos a la función que guarda la asistencia
                await confirmarAsistencia(link.value.id);

                // (Opcional) muestra mensaje o marca como confirmada
                alert("✅ ¡Gracias por confirmar tu asistencia!");
            } catch (err) {
                console.error("Error al enviar confirmación:", err);
                alert("❌ Ocurrió un error al confirmar tu asistencia.");
            }
        };

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
            handlerEnviarConfirmacion,
            confirmarAsistencia,
            enviarDeseo
        };
    }
});

app.mount('#app-container');
