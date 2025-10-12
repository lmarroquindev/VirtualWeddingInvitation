const { createApp, ref, onMounted } = Vue;
import { countdown, startCountdown } from './countdown.js';
import { Evento, Link, PreguntaRespuesta, Deseo } from './models.js';
const app = createApp({
    setup() {
        // ===========================
        // ESTADOS PRINCIPALES (data)
        // ===========================
        const eventos = ref([]);           // Lista de eventos
        const links = ref([]);             // Lista de links para RSVP
        const preguntas = ref([]);         // Lista de preguntas y respuestas
        const deseos = ref([]);            // Lista de deseos enviados (opcional)
        const loadingEventos = ref(false); // Estado de carga de eventos
        const loadingLinks = ref(false);   // Estado de carga de links
        const loadingPreguntas = ref(false); // Estado de carga de preguntas
        const error = ref(null);           // Error global si algo falla
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
                eventos.value = raw.map(e => new Evento(e));

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
                const raw = await getLinks();
                links.value = raw.map(l => new Link(l));
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
                preguntas.value = raw.map(p => new PreguntaRespuesta(p));
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
        const confirmarAsistencia = async (idLink) => {
            try {
                const updated = await confirmarReserva(idLink);
                const index = links.value.findIndex(l => l.id === idLink);
                if (index !== -1) links.value[index] = new Link(updated);
            } catch (err) {
                console.error('Error confirmar asistencia:', err);
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
            links,
            preguntas,
            deseos,
            loadingEventos,
            loadingLinks,
            loadingPreguntas,
            error,
            confirmarAsistencia,
            enviarDeseo
        };
    }
});

app.mount('#app-container');
