# 📱 Instrucciones de Instalación - iPhone

## 🎯 Guía Paso a Paso para Instalar Poker Hand Tracker en tu iPhone

---

## 📋 Requisitos Previos

- ✅ iPhone 13 Pro listo
- ✅ Mac con la carpeta poker-hand-tracker
- ✅ AirDrop activado en ambos dispositivos
- ✅ Safari instalado en iPhone (viene por defecto)

---

## 🚀 PASO 1: Preparar Archivos en Mac

### Opción A: Usar iCloud Drive (RECOMENDADO)

1. **Abrir Finder en Mac**
2. **Ir a iCloud Drive**
   - Finder → iCloud Drive (en la barra lateral)
3. **Crear carpeta**
   - Click derecho → Nueva Carpeta
   - Nombrar: `poker-hand-tracker`
4. **Copiar archivos**
   - Seleccionar TODOS los archivos del proyecto:
     ```
     ✅ index.html
     ✅ manifest.json
     ✅ INSTALL_INSTRUCTIONS.md
     ✅ README.md
     ✅ css/ (carpeta completa)
     ✅ js/ (carpeta completa)
     ✅ assets/ (carpeta completa)
     ```
   - Arrastrar a la carpeta en iCloud Drive
5. **Esperar sincronización**
   - Verás un ícono de nube con flecha
   - Cuando desaparezca, está sincronizado

### Opción B: Usar AirDrop

1. **Comprimir carpeta**
   - Click derecho en `poker-hand-tracker`
   - Seleccionar "Comprimir"
   - Se creará `poker-hand-tracker.zip`

2. **Enviar por AirDrop**
   - Click derecho en el ZIP
   - Compartir → AirDrop
   - Seleccionar tu iPhone 13 Pro
   - Aceptar en el iPhone

---

## 📱 PASO 2: Abrir en iPhone

### Si usaste iCloud Drive:

1. **Abrir app "Archivos"** en iPhone
2. **Ir a iCloud Drive**
3. **Buscar carpeta** `poker-hand-tracker`
4. **Tocar** `index.html`
5. **Seleccionar** "Safari" (si pregunta)

### Si usaste AirDrop:

1. **Abrir app "Archivos"** en iPhone
2. **Ir a "Descargas"**
3. **Tocar** `poker-hand-tracker.zip`
4. **Esperar** que se descomprima automáticamente
5. **Entrar** a la carpeta descomprimida
6. **Tocar** `index.html`
7. **Seleccionar** "Safari"

---

## 🎨 PASO 3: Instalar en Pantalla de Inicio

1. **La app se abre en Safari**
   - Verás la interfaz de Poker Hand Tracker

2. **Tocar botón "Compartir"**
   - Es el ícono del cuadro con flecha ↑
   - Está en la parte inferior de Safari

3. **Scroll hacia abajo** en el menú

4. **Tocar "Agregar a pantalla de inicio"**
   - Tiene un ícono de + dentro de un cuadrado

5. **Personalizar (opcional)**
   - Nombre: "Poker Tracker" (o el que prefieras)
   - El ícono se muestra automáticamente

6. **Tocar "Agregar"** (esquina superior derecha)

---

## ✅ PASO 4: Verificar Instalación

1. **Salir de Safari**
   - Botón Home o swipe up

2. **Buscar el ícono**
   - Debería estar en tu pantalla de inicio
   - Ícono verde con símbolo de poker

3. **Tocar el ícono**
   - La app se abre en pantalla completa
   - SIN barra de Safari
   - Parece app nativa

4. **Probar funcionalidad básica**
   - Crear una sesión de prueba
   - Verificar que se guarda
   - Cerrar y reabrir
   - Verificar que los datos persisten

---

## 🎯 PASO 5: Primera Prueba (UAT)

### Crear Sesión de Prueba:

1. **Tocar "Start Session"**
2. **Llenar formulario:**
   - Date: Hoy
   - Place: "Test Casino"
   - Buy-in: $100
   - Start Time: Hora actual
3. **Tocar "Start Session"**
4. **Verificar mensaje de éxito**
5. **Tocar "Go to Track Hand"**

### Registrar Mano de Prueba:

1. **Seleccionar cartas del héroe**
   - Ejemplo: As, Ks (Ace-King suited)
2. **Verificar auto-scroll** a "Effective Stack"
3. **Llenar Effective Stack:** $100
4. **Seleccionar posiciones en la mesa:**
   - Primera tap: Tu posición (Hero)
   - Segunda tap: Posición del villano
5. **Verificar que los números sean correctos:**
   - Seat 4 = UTG
   - Seat 6 = MP
6. **Verificar botón Dealer** frente a BTN
7. **Continuar con el resto del formulario**
8. **Guardar mano**

### Verificar Persistencia:

1. **Cerrar la app** (swipe up)
2. **Reabrir desde ícono**
3. **Ir a "History"**
4. **Verificar** que la mano aparece
5. **Verificar** que la sesión sigue activa

---

## 🔧 Solución de Problemas

### Problema: No aparece "Agregar a pantalla de inicio"

**Solución:**
- Asegúrate de abrir con Safari (no Chrome)
- Verifica que estés en la página principal (index.html)
- Intenta recargar la página

### Problema: El ícono no se ve bien

**Solución:**
- Es normal, usamos un ícono placeholder
- Funciona perfectamente
- Podemos mejorarlo después

### Problema: Los datos no se guardan

**Solución:**
- Verifica que Safari tenga permisos de almacenamiento
- Ajustes → Safari → Avanzado → Datos de sitios web
- No borres datos de Safari

### Problema: La app se ve rara en el iPhone

**Solución:**
- Verifica que sea iPhone 13 Pro
- Intenta rotar el dispositivo
- Cierra y reabre la app

---

## 📊 Checklist de Instalación

```
[ ] Archivos copiados a iCloud Drive o enviados por AirDrop
[ ] index.html abierto en Safari
[ ] App agregada a pantalla de inicio
[ ] Ícono visible en pantalla de inicio
[ ] App abre en modo standalone (sin barra Safari)
[ ] Sesión de prueba creada exitosamente
[ ] Mano de prueba registrada exitosamente
[ ] Datos persisten después de cerrar/abrir
[ ] Layout de mesa se ve correcto
[ ] Botón Dealer en posición correcta
[ ] Números de asientos correctos (4=UTG, 6=MP)
```

---

## 🎉 ¡Listo para UAT!

Una vez completados todos los pasos, la app está lista para pruebas reales.

### Próximos Pasos:

1. **Usar en sesión real de poker**
2. **Reportar cualquier bug o mejora**
3. **Iterar y mejorar**
4. **Eventualmente migrar a hosting en nube**

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía paso a paso
2. Verifica la sección de solución de problemas
3. Consulta con Bob en tu Mac

---

## 🔄 Actualizaciones Futuras

Cuando haya actualizaciones:
1. Bob actualizará archivos en Mac
2. Si usas iCloud: Se sincroniza automáticamente
3. Si usas AirDrop: Enviar nuevo ZIP
4. Recargar la app (pull down to refresh)

---

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Dispositivo:** iPhone 13 Pro  
**Navegador:** Safari