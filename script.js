// Preguntas del juego
const preguntas = [
    {
        pregunta: "¿Uno de los alimentos para hacer germinados es?",
        respuestaCorrecta: "Lentejas",
        opciones: ["Lentejas", "Yuca", "Batata", "Ninguna de las anteriores"],
        datoCurioso: "¿Sabias que? Las lentejas combinadas con arroz forman una proteína completa comparable a la carne.",
        imagen: "imagenes-png/lentejas.png",
    },
    {
        pregunta: "¿La leche materna que aporta?",
        respuestaCorrecta: "Todos los nutrientes que necesita el bebe",
        opciones: ["No aporta nutrientes", "Todos los nutrientes que necesita el bebe", "Solo grasas", "Ninguna de las anteriores"],
        datoCurioso: "¿Sabias que? La leche materna contiene células vivas y anticuerpos que pueden adaptarse a las necesidades del bebé.",
        imagen: "imagenes-png/madre.png",
    },
    {
        pregunta: "¿Las fruta y vegetales aportan?",
        respuestaCorrecta: "Antioxidantes",
        opciones: ["Antioxidantes", "Grasas", "Azucares", "Sal"],
        datoCurioso: "¿Sabias que? Los tomates, aguacates y pepinos son considerados frutas botánicamente.",
        imagen: "imagenes-png/vegetales.png",
    },
    {
        pregunta: "¿El azucar aumenta el riesgo de?",
        respuestaCorrecta: "Todas las anteriores",
        opciones: ["Caries Dental", "Aumento de peso", "Aumento de enfermedades cardiovasculares", "Todas las anteriores"],
        datoCurioso: "¿Sabias que? El exceso de azúcar puede llevar a obesidad e inflamación.",
        imagen: "imagenes-png/azucar.png",
    },
    {
        pregunta: "¿El Huevo debe consumirse porque?",
        respuestaCorrecta: "Todas las anteriores",
        opciones: ["Es una excelente proteina", "Contiene vitaminas y oligoelementos", "Todas las anteriores", "Es económica"],
        datoCurioso: "¿Sabias que? El color de la cáscara del huevo depende de la raza de la gallina.",
        imagen: "imagenes-png/huevo.png",
    },
    {
        pregunta: "¿Cuál es el porcentaje de agua en el cuerpo humano?",
        respuestaCorrecta: "50-70%",
        opciones: ["50-70%", "10-20%", "100%", "Ninguna de las anteriores"],
        datoCurioso: "¿Sabias que? Los recién nacidos tienen hasta 78% de agua en su cuerpo que disminuye con la edad.",
        imagen: "imagenes-png/agua.png",
    },
    {
        pregunta: "¿Un ejemplo de transformación de alimentos es?",
        respuestaCorrecta: "Harina de yuca",
        opciones: ["Quesos", "Harina de yuca", "Huevos", "Manzana"],
        datoCurioso: "¿Sabias que? La harina de yuca es naturalmente libre de gluten.",
        imagen: "imagenes-png/yuca.png",
    }
];

// Íconos para las preguntas
const iconosPreguntas = [
    "imagenes-png/lenteja.png",
    "imagenes-png/materna.png",
    "imagenes-png/zanahoria.png",
    "imagenes-png/cubo-de-azucar.png",
    "imagenes-png/huevos.png",
    "imagenes-png/gota-de-agua.png",
    "imagenes-png/yucas.png"
];

// Variables del juego
let aciertos = 0;
let errores = 0;
let preguntasMostradas = [];
let preguntaActual = null;
let interaccionInicial = false;
let sonidosHabilitados = false;
let juegoEnCurso = false;

// Botón de reinicio
const botonReinicio = document.createElement('button');
botonReinicio.textContent = 'Jugar Nuevamente';
botonReinicio.className = 'btn-primary';
botonReinicio.addEventListener('click', reiniciarJuego);

// Sistema de sonidos
const sonidos = {
    click: new Audio('sonidos/click.mp3'),
    ruleta: new Audio('sonidos/ruleta.mp3'),
    win: new Audio('sonidos/win.mp3'),
    lose: new Audio('sonidos/lose.mp3'),
    victory: new Audio('sonidos/victory.mp3')
};

// Configuración de volúmenes
Object.values(sonidos).forEach(audio => {
    audio.volume = 0.6;
});

// Precargar sonidos
function precargarSonidos() {
    Object.values(sonidos).forEach(audio => {
        audio.load().catch(e => console.log("Error precargando sonido:", e));
    });
}

function playSonido(tipo) {
    if (!sonidosHabilitados) {
        console.log("Sonidos no habilitados");
        return;
    }
    
    const audio = sonidos[tipo];
    if (!audio) {
        console.log("Sonido no encontrado:", tipo);
        return;
    }
    
    // Detener y rebobinar
    audio.pause();
    audio.currentTime = 0;
    
    // Intentar reproducir
    audio.play()
        .then(() => console.log(`Reproduciendo sonido: ${tipo}`))
        .catch(e => {
            console.log(`Error al reproducir ${tipo}:`, e);
            activarSonidos();
            setTimeout(() => audio.play().catch(e => console.log("Reintento fallido:", e)), 300);
        });
}

// Activar sonidos
function activarSonidos() {
    if (sonidosHabilitados) return;
    
    const unlockAudio = () => {
        const sound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...');
        sound.volume = 0;
        sound.play()
            .then(() => {
                sonidosHabilitados = true;
                console.log("Audio desbloqueado");
                document.getElementById('boton-sonido').textContent = "🔊 ON";
                document.getElementById('boton-sonido').classList.add('active');
                sound.remove();
            })
            .catch(e => {
                console.log("Error al desbloquear audio:", e);
            });
    };
    
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0;
        gainNode.connect(audioContext.destination);
        const buffer = audioContext.createBuffer(1, 1, 22050);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        source.start(0);
        sonidosHabilitados = true;
        document.getElementById('boton-sonido').textContent = "🔊 ON";
        document.getElementById('boton-sonido').classList.add('active');
        console.log("AudioContext activado");
    } catch (e) {
        console.log("Error con AudioContext:", e);
        unlockAudio();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    precargarSonidos();
    
    document.addEventListener('click', function primeraInteraccion() {
        if (!interaccionInicial) {
            interaccionInicial = true;
            activarSonidos();
            document.removeEventListener('click', primeraInteraccion);
        }
    });
});

// Event Listeners
document.getElementById('boton-empezar').addEventListener('click', iniciarJuego);
document.getElementById('boton-siguiente').addEventListener('click', function() {
    playSonido('click');
    obtenerPreguntaAleatoria();
});

// Controlador para el botón de sonido
document.getElementById('boton-sonido').addEventListener('click', function() {
    sonidosHabilitados = !sonidosHabilitados;
    this.textContent = sonidosHabilitados ? "🔊 ON" : "🔇 OFF";
    this.classList.toggle('active', sonidosHabilitados);
    
    if (sonidosHabilitados) {
        playSonido('click');
    }
});

// Ajustar altura en móviles cuando aparece el teclado
window.addEventListener('resize', () => {
    if (window.visualViewport) {
        document.documentElement.style.height = `${window.visualViewport.height}px`;
    }
});

// Función para iniciar el juego
function iniciarJuego() {
    console.log("Iniciando juego...");
    juegoEnCurso = true;
    aciertos = 0;
    errores = 0;
    preguntasMostradas = [];
    
    playSonido('click');
    document.getElementById('inicio').classList.add('hidden');
    mostrarRuleta();
}

function obtenerPreguntaAleatoria() {
    mostrarRuleta();
}

function mostrarRuleta() {
    console.log("Mostrando ruleta...");
    document.getElementById('pregunta').classList.add('hidden');
    document.getElementById('opciones').classList.add('hidden');
    document.getElementById('resultado').classList.add('hidden');
    
    // Desactivar scroll en móviles durante la animación
    document.body.style.overflow = 'hidden';
    
    const ruletaContainer = document.getElementById('ruleta-container');
    const ruletaPlato = document.querySelector('.ruleta-plato');
    const ruletaIconos = document.querySelector('.ruleta-iconos');
    
    ruletaPlato.innerHTML = '';
    ruletaIconos.innerHTML = '';
    
    const preguntasDisponibles = preguntas.filter((_, index) => !preguntasMostradas.includes(index));
    
    if (preguntasDisponibles.length === 0) {
        mostrarResultados();
        return;
    }
    
    ruletaContainer.classList.remove('hidden');
    const totalSecciones = preguntas.length;
    const anguloSeccion = 360 / totalSecciones;
    
    // Crear secciones de colores
    for (let i = 0; i < totalSecciones; i++) {
        const seccion = document.createElement('div');
        seccion.className = `ruleta-seccion seccion-${i+1}`;
        seccion.style.transform = `rotate(${i * anguloSeccion}deg)`;
        
        if (preguntasMostradas.includes(i)) {
            seccion.classList.add('respondida');
        }
        
        ruletaPlato.appendChild(seccion);
    }
    
    // Crear iconos en ruleta transparente
    for (let i = 0; i < totalSecciones; i++) {
        const iconoContenedor = document.createElement('div');
        iconoContenedor.className = 'icono-seccion';
        iconoContenedor.style.transform = `rotate(${i * anguloSeccion + anguloSeccion/2}deg) translateY(-120px)`;
        
        const icono = document.createElement('img');
        icono.className = 'icono-ruleta';
        icono.src = iconosPreguntas[i];
        icono.alt = `Ícono ${i+1}`;
        icono.onerror = function() {
            console.error("Error al cargar icono:", iconosPreguntas[i]);
            this.style.border = "2px dashed red";
        };
        
        iconoContenedor.appendChild(icono);
        ruletaIconos.appendChild(iconoContenedor);
    }
    
    const rotacionesCompletas = 5;
    const seccionAleatoria = Math.floor(Math.random() * preguntasDisponibles.length);
    const preguntaIndex = preguntas.indexOf(preguntasDisponibles[seccionAleatoria]);
    const anguloFinal = (rotacionesCompletas * 360) + (preguntaIndex * anguloSeccion) + (anguloSeccion / 2);
    
    ruletaPlato.style.transform = 'rotate(0deg)';
    ruletaIconos.style.transform = 'rotate(0deg)';
    void ruletaPlato.offsetWidth;
    
    playSonido('ruleta');
    ruletaPlato.style.transform = `rotate(${-anguloFinal}deg)`;
    ruletaIconos.style.transform = `rotate(${-anguloFinal}deg)`;
    
    setTimeout(() => {
        if (!juegoEnCurso) return;
        
        ruletaContainer.classList.add('hidden');
        preguntaActual = preguntasDisponibles[seccionAleatoria];
        preguntasMostradas.push(preguntas.indexOf(preguntaActual));
        mostrarPregunta(preguntaActual);
        
        // Restaurar scroll en móviles
        document.body.style.overflow = '';
    }, 3000);
}

function mostrarPregunta(pregunta) {
    console.log("Mostrando pregunta:", pregunta.pregunta);
    const preguntaDiv = document.getElementById('pregunta');
    const animaciones = ['animacion-flotar', 'animacion-latido', 'animacion-aparecer'];
    const animacionAleatoria = animaciones[Math.floor(Math.random() * animaciones.length)];
    
    preguntaDiv.innerHTML = `
        <div class="pregunta-contenedor">
            <img src="${pregunta.imagen}" alt="Imagen ilustrativa" 
                 class="pregunta-imagen ${animacionAleatoria}">
            <p class="texto-pregunta">${pregunta.pregunta}</p>
        </div>
    `;
    preguntaDiv.classList.remove('hidden');
    
    const opcionesDiv = document.querySelector('.options-grid');
    opcionesDiv.innerHTML = '';
    
    pregunta.opciones.forEach((opcion, index) => {
        const button = document.createElement('button');
        button.textContent = opcion;
        button.addEventListener('click', function() {
            playSonido('click');
            verificarRespuesta(opcion);
        });
        opcionesDiv.appendChild(button);
    });
    
    document.getElementById('opciones').classList.remove('hidden');
}

function verificarRespuesta(respuestaSeleccionada) {
    console.log("Verificando respuesta:", respuestaSeleccionada);
    const resultadoDiv = document.getElementById('resultado');
    const mensajeResultados = document.getElementById('mensaje-resultados');
    const imagenResultados = document.getElementById('imagen-resultados');

    document.getElementById('opciones').classList.add('hidden');
    document.getElementById('pregunta').classList.add('hidden');
    resultadoDiv.classList.remove('hidden');

    if (respuestaSeleccionada === preguntaActual.respuestaCorrecta) {
        aciertos++;
        mensajeResultados.innerHTML = `✅ <strong>¡Correcto!</strong><br>${preguntaActual.datoCurioso}`;
        imagenResultados.src = "imagenes-png/8888205.png";
        imagenResultados.className = "result-icon trofeo-animado";
        playSonido('win');
        lanzarConfeti();
    } else {
        errores++;
        mensajeResultados.innerHTML = `❌ <strong>Incorrecto.</strong> La respuesta correcta es: <strong>${preguntaActual.respuestaCorrecta}</strong><br>${preguntaActual.datoCurioso}`;
        imagenResultados.src = "imagenes-png/16206622.png";
        imagenResultados.className = "result-icon cara-triste";
        playSonido('lose');
    }

    document.getElementById('boton-siguiente').classList.remove('hidden');
}

function mostrarResultados() {
    console.log("Mostrando resultados finales");
    const resultadoDiv = document.getElementById('resultado');
    const mensajeResultados = document.getElementById('mensaje-resultados');
    const imagenResultados = document.getElementById('imagen-resultados');

    document.getElementById('pregunta').classList.add('hidden');
    document.getElementById('opciones').classList.add('hidden');
    document.getElementById('boton-siguiente').classList.add('hidden');

    resultadoDiv.classList.remove('hidden');
    if (aciertos === preguntas.length) {
        playSonido('victory');
        imagenResultados.src = "imagenes-png/625398.png";
        mensajeResultados.innerHTML = `
            <h3>¡Perfecto! 🏆</h3>
            <p>Aciertos: <strong>${aciertos}/${preguntas.length}</strong></p>
            <p class="mensaje-final">¡Estás totalmente en la onda 4S!</p>
        `;
        lanzarConfetiExplosivo();
    } else if (aciertos >= Math.ceil(preguntas.length / 2)) {
        playSonido('win');
        imagenResultados.src = "imagenes-png/166522.png";
        mensajeResultados.innerHTML = `
            <h3>¡Bien hecho! 👍</h3>
            <p>Aciertos: <strong>${aciertos}/${preguntas.length}</strong></p>
            <p class="mensaje-final">Vas por buen camino hacia la onda 4S</p>
        `;
    } else {
        playSonido('lose');
        imagenResultados.src = "imagenes-png/166527.png";
        mensajeResultados.innerHTML = `
            <h3>¡Sigue practicando! 😊</h3>
            <p>Aciertos: <strong>${aciertos}/${preguntas.length}</strong></p>
            <p class="mensaje-final">La nutrición es un aprendizaje continuo. ¡Sigue así!</p>
        `;
    }

    resultadoDiv.appendChild(botonReinicio);
}

function reiniciarJuego() {
    console.log("Reiniciando juego...");
    juegoEnCurso = false;
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('inicio').classList.remove('hidden');
}

function lanzarConfeti() {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

function lanzarConfetiExplosivo() {
    confetti({ particleCount: 300, spread: 100, origin: { y: 0.5 } });
}
