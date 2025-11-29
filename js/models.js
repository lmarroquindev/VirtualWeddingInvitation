// ========================================================
// Modelos / Clases para manejar los objetos de la API
// ========================================================

class Evento {
    constructor({ id = null, nombre = "", fechaHoraEvento = "", photoUrl="" } = {}) {
        this.id = id;
        this.nombre = nombre;
        this.fechaHoraEvento = fechaHoraEvento; // string en formato ISO
        this.photoUrl = photoUrl;
    }
}

class Link {
    constructor({
        id = null,
        idEvento = null,
        mostrarConfirmarInvitacion = false,
        invitado1 = "",
        invitado2 = "",
        mostrarSeccionDeseos = false,
        confirmacionAsistenciaEnviada = false,
        asistencia1Confirmada = false,
        asistencia2Confirmada = false,
        fechaCreacion = "",
        fechaConfirmacion = null,
        comentario = "",
        activo = true,
        dedicatoriaInvitado1 = "",
        dedicatoriaInvitado2 = "",
        mostrarSeccionCompartirFotos = false,
        mostrarSeccionQA = false
    } = {}) {
        this.id = id;
        this.idEvento = idEvento;
        this.mostrarConfirmarInvitacion = mostrarConfirmarInvitacion;
        this.invitado1 = invitado1;
        this.invitado2 = invitado2;
        this.mostrarSeccionDeseos = mostrarSeccionDeseos;
        this.confirmacionAsistenciaEnviada = confirmacionAsistenciaEnviada
        this.asistencia1Confirmada = asistencia1Confirmada;
        this.asistencia2Confirmada = asistencia2Confirmada;
        this.fechaCreacion = fechaCreacion;
        this.fechaConfirmacion = fechaConfirmacion;
        this.comentario = comentario;
        this.activo = activo;
        this.dedicatoriaInvitado1 = dedicatoriaInvitado1,
        this.dedicatoriaInvitado2 = dedicatoriaInvitado2,
        this.mostrarSeccionCompartirFotos = mostrarSeccionCompartirFotos,
        this.mostrarSeccionQA = mostrarSeccionQA
    }
}

class PreguntaRespuesta {
    constructor({ id = null, idEvento = null, pregunta = "", respuesta = "", activo = true } = {}) {
        this.id = id;
        this.idEvento = idEvento;
        this.pregunta = pregunta;
        this.respuesta = respuesta;
        this.activo = activo;
    }
}

class Deseo {
    constructor({ id = null, idLink = null, nombre = null, comentario = ""} = {}) {
        this.id = id;
        this.idLink = idLink;
        this.nombre = nombre;
        this.comentario = comentario;
    }
}

export { Evento, Link, PreguntaRespuesta, Deseo };
