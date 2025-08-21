// Variables globales
let currentAudio = null;
let currentAudioBlob = null;
let voices = [];

// Elementos DOM
const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const voiceInfo = document.getElementById('voiceInfo');
const speedRange = document.getElementById('speedRange');
const pitchRange = document.getElementById('pitchRange');
const speedValue = document.getElementById('speedValue');
const pitchValue = document.getElementById('pitchValue');
const synthesizeBtn = document.getElementById('synthesizeBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadBtn = document.getElementById('downloadBtn');
const audioContainer = document.getElementById('audioContainer');
const audioPlayer = document.getElementById('audioPlayer');
const loadingIndicator = document.getElementById('loadingIndicator');
const statusMessage = document.getElementById('statusMessage');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadVoices();
    setupEventListeners();
});

// Cargar voces disponibles
async function loadVoices() {
    try {
        const response = await fetch('/api/voices');
        voices = await response.json();
        
        populateVoiceSelect();
        showStatus('Voces cargadas correctamente', 'success');
    } catch (error) {
        console.error('Error cargando voces:', error);
        showStatus('Error al cargar las voces disponibles', 'error');
    }
}

// Poblar selector de voces
function populateVoiceSelect() {
    voiceSelect.innerHTML = '<option value="">Selecciona una voz...</option>';
    
    // Agrupar por región
    const regions = {};
    voices.forEach(voice => {
        if (!regions[voice.region]) {
            regions[voice.region] = [];
        }
        regions[voice.region].push(voice);
    });
    
    // Crear optgroups por región
    Object.keys(regions).forEach(region => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = region;
        
        regions[region].forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.code;
            option.textContent = voice.name;
            option.dataset.gender = voice.gender;
            option.dataset.region = voice.region;
            optgroup.appendChild(option);
        });
        
        voiceSelect.appendChild(optgroup);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Actualizar valores de controles
    speedRange.addEventListener('input', function() {
        speedValue.textContent = this.value;
    });
    
    pitchRange.addEventListener('input', function() {
        pitchValue.textContent = this.value;
    });
    
    // Cambio de voz
    voiceSelect.addEventListener('change', function() {
        updateVoiceInfo();
    });
    
    // Botones
    synthesizeBtn.addEventListener('click', synthesizeText);
    stopBtn.addEventListener('click', stopAudio);
    downloadBtn.addEventListener('click', downloadAudio);
    
    // Tecla Enter en textarea (con Ctrl/Cmd)
    textInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            synthesizeText();
        }
    });
}

// Actualizar información de voz
function updateVoiceInfo() {
    const selectedOption = voiceSelect.selectedOptions[0];
    
    if (!selectedOption || !selectedOption.value) {
        voiceInfo.textContent = 'Selecciona una voz para ver la información';
        return;
    }
    
    const voice = voices.find(v => v.code === selectedOption.value);
    if (voice) {
        const genderIcon = voice.gender === 'FEMALE' ? '♀️' : '♂️';
        const tech = voice.code.includes('Neural2') ? 'Neural2' : 
                    voice.code.includes('WaveNet') ? 'WaveNet' : 
                    voice.code.includes('Studio') ? 'Studio' : 'Estándar';
        
        voiceInfo.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-lg">${genderIcon}</span>
                <div>
                    <div class="font-medium">${voice.region} - ${voice.gender === 'FEMALE' ? 'Femenino' : 'Masculino'}</div>
                    <div class="text-xs text-gray-500">Tecnología: ${tech}</div>
                </div>
            </div>
        `;
    }
}

// Sintetizar texto
async function synthesizeText() {
    const text = textInput.value.trim();
    const voiceCode = voiceSelect.value;
    const speed = parseFloat(speedRange.value);
    const pitch = parseFloat(pitchRange.value);
    
    // Validaciones
    if (!text) {
        showStatus('Por favor, ingresa algún texto para convertir', 'warning');
        textInput.focus();
        return;
    }
    
    if (!voiceCode) {
        showStatus('Por favor, selecciona una voz', 'warning');
        voiceSelect.focus();
        return;
    }
    
    if (text.length > 5000) {
        showStatus('El texto es demasiado largo (máximo 5000 caracteres)', 'warning');
        return;
    }
    
    try {
        // Mostrar loading
        setLoading(true);
        showStatus('Generando audio...', 'info');
        
        const response = await fetch('/api/synthesize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                voiceCode: voiceCode,
                speed: speed,
                pitch: pitch
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error en la síntesis');
        }
        
        if (data.success && data.audio) {
            // Convertir base64 a blob para descarga
            const audioData = data.audio.split(',')[1];
            const audioBytes = atob(audioData);
            const arrayBuffer = new ArrayBuffer(audioBytes.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            
            for (let i = 0; i < audioBytes.length; i++) {
                uint8Array[i] = audioBytes.charCodeAt(i);
            }
            
            currentAudioBlob = new Blob([arrayBuffer], { type: 'audio/mp3' });
            
            // Configurar reproductor
            audioPlayer.src = data.audio;
            audioContainer.classList.remove('hidden');
            
            // Habilitar botones
            stopBtn.disabled = false;
            downloadBtn.disabled = false;
            
            // Auto-reproducir
            audioPlayer.play();
            
            showStatus(`Audio generado correctamente con ${data.voiceUsed}`, 'success');
        } else {
            throw new Error('Respuesta inválida del servidor');
        }
        
    } catch (error) {
        console.error('Error en síntesis:', error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
}

// Detener audio
function stopAudio() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    
    stopBtn.disabled = true;
    showStatus('Reproducción detenida', 'info');
}

// Descargar audio
function downloadAudio() {
    if (!currentAudioBlob) {
        showStatus('No hay audio para descargar', 'warning');
        return;
    }
    
    const url = URL.createObjectURL(currentAudioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `texto-a-voz-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showStatus('Audio descargado', 'success');
}

// Mostrar/ocultar loading
function setLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
        synthesizeBtn.disabled = true;
        synthesizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    } else {
        loadingIndicator.classList.add('hidden');
        synthesizeBtn.disabled = false;
        synthesizeBtn.innerHTML = '<i class="fas fa-play"></i> Generar Voz';
    }
}

// Mostrar mensajes de estado
function showStatus(message, type = 'info') {
    const colors = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    statusMessage.className = `p-4 rounded-md mb-4 border ${colors[type]}`;
    statusMessage.innerHTML = `
        <div class="flex items-center">
            <i class="${icons[type]} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    statusMessage.classList.remove('hidden');
    
    // Auto-ocultar después de 5 segundos (excepto errores)
    if (type !== 'error') {
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    }
}

// Event listeners para reproductor de audio
document.addEventListener('DOMContentLoaded', function() {
    if (audioPlayer) {
        audioPlayer.addEventListener('ended', function() {
            stopBtn.disabled = true;
            showStatus('Reproducción finalizada', 'info');
        });
        
        audioPlayer.addEventListener('play', function() {
            stopBtn.disabled = false;
        });
        
        audioPlayer.addEventListener('error', function() {
            showStatus('Error al reproducir el audio', 'error');
        });
    }
});