#!/bin/sh
# Une los archivos de src/ en index.html
cd "$(dirname "$0")"
{
echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
echo '<title>OperatorlZ</title>'
echo '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=Marcellus+SC&display=swap">'
echo '<style>'; cat src/style.css; echo '</style></head><body>'
echo '<div id="root"></div>'
echo '<script>'; cat src/data.js src/spells.js src/catalog.js src/core.js src/shell.js src/keep.js src/views2.js src/maps.js src/init.js; echo '</script></body></html>'
} > index.html
