# Diario de Emociones V2 – Bitácora de Evolución 🌱

Bienvenido a la bitácora de desarrollo. Aquí documentamos el crecimiento de nuestro refugio digital, no sólo con cambios técnicos, sino con la intención detrás de cada actualización. Hemos construido este espacio pensando en la empatía, el diseño consciente y la privacidad.

## [v2.0.0] - 2026-02-22 (El Gran Salto a la Nube)

*Hemos rediseñado la forma en que tus datos descansan, priorizando que tu refugio sea accesible desde cualquier lugar sin sacrificar la seguridad de tu mente.*

### 🌟 Cambios Principales

- **Arquitectura 100% en la Nube:** Le dijimos adiós al almacenamiento local (`localStorage`). Ahora, todos tus pensamientos y configuraciones viajan de forma segura a bóvedas personales usando **Supabase**. Lo que escribes en tu teléfono, ahora te espera en tu computadora.
- **El Guardián en la Puerta (Sistema de Autenticación):** Implementamos un modal de inicio de sesión fluido. Ahora, para entrar a las áreas sensibles del Diario (Refugio, Mapa de Herramientas, Configuración), se requiere una llave única (tu cuenta). Si no estás listo para entrar, el manifiesto de la página de inicio sigue ahí para ti.
- **Rediseño de la Portada:** Cambiamos la fotografía principal por un bosque orgánico y sereno, estableciendo un tono visual mucho más envolvente y Premium desde el primer segundo.

### 🎨 Refinamiento de la Interfaz (UX)

- **Claridad en el Refugio:** Escuchamos que identificar las emociones a veces no era intuitivo. Ahora, los selectores de emociones tienen instrucciones claras ("Paso 1: Identifica tu emoción"), sutiles etiquetas al pasar el mouse (tooltips) y un efecto de desenfoque de vidrio (glassmorphism) al escribir en el lienzo en blanco para enmarcar tus pensamientos.
- **Limpieza Visual en la Entrada:** Arreglamos un pequeño tropiezo donde las tarjetas de instrucciones (Respira, Identifica, Escribe) se amontonaban al hacer scroll. Ahora se desvanecen suavemente como hojas en el viento.
- **Configuración Intuitiva:** Al mudarnos a la nube, retiramos los viejos interruptores de "Guardado Rápido Local" y las opciones de borrado manual. La sección de Configuración ahora refleja fielmente tu conexión segura con la bóveda.

### 🛠️ Para los Constructores (Backend)

- Estructura de base de datos SQL (`supabase_schema.sql`) creada para las tablas `profiles` y `entries`.
- Implementación estricta de **Políticas de Seguridad de Nivel de Fila (RLS)**, asegurando matemáticamente que nadie, aparte de ti, pueda siquiera consultar tus entradas.

---

## [v1.0.0] - 2026-02-21 (Génesis del Proyecto)

*El primer respiro. La creación de un espacio donde no hay contadores de palabras, ni métricas de productividad. Sólo tú.*

### 🌟 Características Fundamentales

- **El Manifiesto de la Empatía:** Una declaración de principios sobre crear un software que respete el ritmo de la mente humana.
- **Refugio de Pensamientos (Editor Zen):** Un lienzo que desaparece el ruido externo mientras escribes. Incluye guardado suave y anclajes emocionales basados en la teoría del color.
- **Mapa Estelar:** Una visualización temporal de tu estado de ánimo, trazado como constelaciones en lugar de gráficas matemáticas frías.
- **Botón de Ancla (Pausa Activa):** Una herramienta omnipresente de primeros auxilios emocionales, incluyendo el ejercicio de respiración 4-7-8 y la técnica de grounding 5-4-3-2-1.
- Construcción inicial usando React, Vite y GSAP para animaciones que simulan el ritmo de la respiración.
