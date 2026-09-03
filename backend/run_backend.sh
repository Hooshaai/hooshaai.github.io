#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Activate environment if available
if [ -d "/Users/tahamajs/Documents/uni/Project/.venv" ]; then
    source "/Users/tahamajs/Documents/uni/Project/.venv/bin/activate"
fi

python manage.py migrate
python manage.py runserver 0.0.0.0:8000
