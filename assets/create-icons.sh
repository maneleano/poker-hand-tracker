#!/bin/bash
# Script para crear íconos placeholder PNG desde SVG
# Nota: Requiere ImageMagick o similar. Si no está disponible, usar íconos temporales.

echo "Creando íconos PNG desde SVG..."

# Verificar si convert (ImageMagick) está disponible
if command -v convert &> /dev/null; then
    convert icon.svg -resize 180x180 icon-180.png
    convert icon.svg -resize 167x167 icon-167.png
    convert icon.svg -resize 152x152 icon-152.png
    convert icon.svg -resize 192x192 icon-192.png
    convert icon.svg -resize 512x512 icon-512.png
    echo "✅ Íconos creados exitosamente"
else
    echo "⚠️  ImageMagick no disponible"
    echo "Los íconos SVG funcionarán temporalmente"
    echo "Puedes agregar íconos PNG manualmente después"
fi
