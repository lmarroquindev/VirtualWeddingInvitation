// Creamos la cuenta regresiva como un objeto reactivo independiente
const countdown = Vue.ref({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
});

/**
 * Inicializa la cuenta regresiva a partir de la fecha del evento
 * @param {string} eventDateStr - fecha en formato ISO con offset
 */
const startCountdown = (eventDateStr) => {
    console.log("🚀 ~ startCountdown ~ eventDateStr:", eventDateStr)
    if (!eventDateStr) return;

    const eventDate = new Date(eventDateStr);

    // Ajuste a hora de El Salvador (UTC-6)
    const elSalvadorOffset = -6 * 60; // en minutos
    const localOffset = eventDate.getTimezoneOffset(); // offset del navegador
    const diffOffset = (elSalvadorOffset + localOffset) * 60 * 1000;
    const eventDateElSalvador = new Date(eventDate.getTime() + diffOffset);

    // Limpiar cualquier intervalo previo para evitar múltiples timers
    if (startCountdown.interval) clearInterval(startCountdown.interval);

    const updateCountdown = () => {
        const now = new Date();
        const diff = eventDateElSalvador - now;

        if (diff <= 0) {
            countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' };
            clearInterval(startCountdown.interval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        countdown.value = {
            days: String(days).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0')
        };
    };

    updateCountdown();
    startCountdown.interval = setInterval(updateCountdown, 1000);
};

// Exportamos
export { countdown, startCountdown };
