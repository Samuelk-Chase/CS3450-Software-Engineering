#!/bin/bash

# File to watch
WATCH_FILE="Requirements.md"
OUTPUT_FILE="Requirements.pdf"

# Render command
RENDER_COMMAND="pandoc ${WATCH_FILE} -o ${OUTPUT_FILE} --pdf-engine=xelatex -F mermaid-filter"

# Ensure the file exists before running
if [ ! -f "$WATCH_FILE" ]; then
    echo "Error: $WATCH_FILE does not exist."
    exit 1
fi

# Watch for changes and rerun the render command
echo "Rendering PDF initially..."
$RENDER_COMMAND
echo "Watching $WATCH_FILE for changes..."
fswatch -o "$WATCH_FILE" | while read -r event; do
    echo "Detected change in $WATCH_FILE. Re-rendering PDF..."
    $RENDER_COMMAND
    if [ $? -eq 0 ]; then
        echo "PDF rendered successfully."
    else
        echo "Error during rendering. Check the logs above."
    fi
done
