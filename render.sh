#!/bin/bash

RENDER_ONCE=false
WATCH_FILE="Requirements.md"
OUTPUT_FILE="Requirements.pdf"

# Function to display help
usage() {
    echo "Usage: $0 [-i input_file] [-o output_file] [-1|--once] [--help]"
    echo "  -i input_file     Specify the input Markdown file (default: Requirements.md)."
    echo "  -o output_file    Specify the output PDF file (default: Requirements.pdf)."
    echo "  -1, --once        Render the PDF once and exit."
    echo "  --help            Display this help message."
}

# Check for arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -i) WATCH_FILE="$2"; shift ;;
        -o) OUTPUT_FILE="$2"; shift ;;
        -1|--once) RENDER_ONCE=true ;;
        --help) usage; exit 0 ;;
        *) echo "Invalid option: $1"; usage; exit 1 ;;
    esac
    shift
done

# If only input file is specified, set output file based on it
if [[ -z "$OUTPUT_FILE" && -n "$WATCH_FILE" ]]; then
    OUTPUT_FILE="${WATCH_FILE%.md}.pdf"
fi

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is not installed. Use your package manager to install it."
    exit 1
fi

# Check if mermaid-filter is installed via npm
if ! npm list -g mermaid-filter &> /dev/null; then
    echo "Error: mermaid-filter is not installed. Use \"npm i -g mermaid-filter\" to install it globally."
    exit 1
fi

# Check OS to decide whether to use fswatch or inotifywait
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if ! command -v fswatch &> /dev/null; then
        echo "Error: fswatch is not installed. You can install it using 'brew install fswatch'."
        exit 1
    fi
    FILE_WATCHER="fswatch -1"
else
    # Linux (probably)
    if ! command -v inotifywait &> /dev/null; then
        echo "Error: inotifywait is not installed. Use your package manager to install it."
        exit 1
    fi
    FILE_WATCHER="inotifywait -e close_write"
fi

# Check if the input file exists
if [ ! -f "$WATCH_FILE" ]; then
    echo "Error: $WATCH_FILE does not exist."
    exit 1
fi

# Render command
RENDER_COMMAND="pandoc ${WATCH_FILE} -o ${OUTPUT_FILE} --pdf-engine=xelatex -F mermaid-filter"

# Initial render
echo "Rendering PDF..."
$RENDER_COMMAND
if [ $? -ne 0 ]; then
    echo "Error during rendering. Check the logs above."
    exit 1
else
    echo "PDF rendered successfully to $OUTPUT_FILE."
fi

# Exit if --once is specified
if $RENDER_ONCE; then
    exit 0
fi

# Watch for changes
echo "Watching $WATCH_FILE for changes..."
while $FILE_WATCHER "$WATCH_FILE" >/dev/null; do
    echo "Detected change in $WATCH_FILE. Re-rendering PDF..."
    $RENDER_COMMAND
    if [ $? -eq 0 ]; then
        echo "PDF rendered successfully to $OUTPUT_FILE."
    else
        echo "Error during rendering. Check the logs above."
    fi
done
