# 🎤 Text-to-Speech App en Español

Aplicación web para convertir texto a voz utilizando las voces oficiales de Google Cloud Text-to-Speech API 2025, enfocada específicamente en español.

## 🌟 Características

- **Voces oficiales 2025**: Neural2, WaveNet, Studio y Chirp 3 HD
- **Múltiples regiones**: España (es-ES), México (es-MX), Argentina (es-AR)
- **Controles avanzados**: Velocidad y tono ajustables
- **Interfaz moderna**: Diseñada con Tailwind CSS
- **Descarga de audio**: Guarda el audio generado en formato MP3
- **Reproductor integrado**: Controles de audio completos

## 🚀 Instalación

1. **Clona o descarga** los archivos del proyecto

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura la API de Google**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto o selecciona uno existente
   - Habilita la API de Text-to-Speech
   - Crea credenciales (Service Account Key)
   - Descarga el archivo JSON de credenciales

4. **Configura las variables de entorno**:
   - Edita el archivo `.env`
   - Añade la ruta a tu archivo de credenciales:
     ```
     GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
     ```

5. **Inicia la aplicación**:
   ```bash
   npm start
   ```

6. **Abre tu navegador** en `http://localhost:3000`

## 🎯 Uso

1. **Escribe el texto** que quieres convertir a voz
2. **Selecciona una voz** de las opciones disponibles (España, México, Argentina)
3. **Ajusta controles** de velocidad y tono (opcional)
4. **Haz clic en "Generar Voz"** para crear el audio
5. **Reproduce** el audio generado
6. **Descarga** el archivo MP3 si lo deseas

## 🗣️ Voces Disponibles

### España (es-ES)
- Neural2-A, B, C, D, E, F (femenino/masculino)
- WaveNet-B, C, D (premium)

### México (es-MX)
- Neural2-A, B, C (femenino/masculino)
- WaveNet-A, B, C (premium)

### Argentina (es-AR)
- Neural2-A, B (femenino/masculino)
- WaveNet-A, B (premium)

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + Tailwind CSS + JavaScript
- **API**: Google Cloud Text-to-Speech
- **Audio**: MP3 con controles HTML5

## 📂 Estructura del Proyecto

```
/
├── package.json          # Dependencias y scripts
├── .env                 # Variables de entorno
├── server.js            # Servidor Express
├── public/
│   ├── index.html       # Frontend principal
│   ├── script.js        # Lógica del cliente
│   └── style.css        # Estilos adicionales
└── README.md            # Documentación
```

## 🔧 Configuración Avanzada

### Variables de Entorno Disponibles

```env
# Credenciales de Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# Puerto del servidor (opcional)
PORT=3000
```

### Personalización de Voces

Puedes modificar las voces disponibles editando el array `spanishVoices` en `server.js`.

## 🚨 Solución de Problemas

### Error de Autenticación
- Verifica que el archivo de credenciales existe
- Comprueba que la ruta en `.env` es correcta
- Asegúrate de que la API está habilitada en Google Cloud

### Error al Generar Audio
- Verifica tu conexión a internet
- Comprueba que tienes créditos en Google Cloud
- Revisa que el texto no supere los 5000 caracteres

### Audio No Se Reproduce
- Verifica que tu navegador soporta MP3
- Comprueba que no hay bloqueadores de audio
- Intenta con otro navegador

## 📊 Límites de la API

- **Texto**: Máximo 5000 caracteres por solicitud
- **Gratuito**: 1M caracteres/mes para WaveNet, 4M para Standard
- **Velocidad**: 0.25x a 4.0x
- **Tono**: -20.0 a +20.0

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la sección de solución de problemas
2. Consulta la [documentación oficial de Google Cloud TTS](https://cloud.google.com/text-to-speech/docs)
3. Abre un issue en el repositorio

---

🚀 **¡Disfruta convirtiendo texto a voz en español!**