#!/bin/bash
# Starter nettsiden lokalt og åpner den i nettleseren. Stopp med Ctrl+C.
cd "$(dirname "$0")"
PORT=8000
(sleep 1 && open "http://localhost:$PORT") &
python3 -m http.server "$PORT"
