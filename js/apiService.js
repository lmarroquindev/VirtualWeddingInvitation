// ========================================================
// Funciones para consumir la API
// ========================================================

async function getEventos() {
    const res = await fetch(`${API_BASE_URL}/eventos`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function getLinks(idLink) {
    const res = await fetch(`${API_BASE_URL}/link/${idLink}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function updateLink(idLink, data) {
    const res = await fetch(`${API_BASE_URL}/link/${idLink}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function confirmarReserva(idLink, asistencia1, asistencia2, comentario) {
    const res = await fetch(`${API_BASE_URL}/link/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idLink: idLink,
            Asistencia1Confirmada: asistencia1 === "si",
            Asistencia2Confirmada: asistencia2 === "si",
            Comentario: comentario
        })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function getPreguntas() {
    const res = await fetch(`${API_BASE_URL}/preguntas`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function postDeseo(deseo) {
    const res = await fetch(`${API_BASE_URL}/deseos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deseo)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
