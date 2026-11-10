#!/bin/sh
# Une los archivos de src/ en index.html
cd "$(dirname "$0")"
{
echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
echo '<title>OperatorlZ</title><meta name="description" content="Pantalla del DM para D&D: combate, personajes, PNJ, mapas y wiki."><meta name="theme-color" content="#110f17">'
echo '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Crect width=%2240%22 height=%2240%22 rx=%229%22 fill=%22%23110f17%22/%3E%3Cpath d=%22M20 4 34 12v16L20 36 6 28V12z M20 4 12 19h16z M12 19l8 17 8-17%22 fill=%22none%22 stroke=%22%23d9a64e%22 stroke-width=%221.8%22/%3E%3C/svg%3E">'
echo '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=Marcellus+SC&display=swap">'
echo '<style>'; python3 -c "import re,sys;s=open('src/style.css').read();s=re.sub(r'/\\*.*?\\*/','',s,flags=re.S);s=re.sub(r'\\s*\\n\\s*','',s);print(s)"; echo '</style></head><body>'
echo '<div id="root"></div>'
echo '<script>'; cat src/data.js src/spells.js src/catalog.js src/core.js src/shell.js src/keep.js src/views2.js src/manuals.js src/maps.js src/init.js; echo '</script></body></html>'
} > index.html
