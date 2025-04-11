#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables, ignoring comments
while IFS= read -r line; do
    if [[ $line != \#* ]] && [[ -n $line ]]; then
        export "$line"
    fi
done < internal/config/.env

echo -e "${BLUE}Starting tests...${NC}"
echo "----------------------------------------"

# Run tests with custom output format
go test -v ./internal/db 2>&1 | awk -v yellow="$YELLOW" -v nc="$NC" -v green="$GREEN" -v red="$RED" '
BEGIN {
    total_tests = 29  # Total number of test functions including subtests (23 original + 6 new story tests)
    current_test = 0
    last_percentage = 0
}
/=== RUN   Test/ {
    current_test++
    test_name = substr($0, index($0, "Test"))
    percentage = (current_test/total_tests)*100
    if (percentage > 100) { percentage = 100 }
    if (percentage != last_percentage) {
        printf "\n%sTest Progress: [%-50s] %.1f%%%s\n", yellow, substr("##################################################", 1, percentage/2), percentage, nc
        last_percentage = percentage
    }
    printf "%sRunning: %-60s%s\n", yellow, test_name, nc
}
/--- PASS/ {
    sub(/---/, "✓", $0)
    printf "%s%s%s\n", green, $0, nc
}
/--- FAIL/ {
    sub(/---/, "✗", $0)
    printf "%s%s%s\n", red, $0, nc
}
/FAIL.*\[build failed\]/ {
    printf "%s%s%s\n", red, $0, nc
    exit 1
}
/ok.*beanboys-lastgame-backend/ {
    printf "\n%s%s%s\n", green, $0, nc
    printf "%sAll tests completed successfully!%s\n", green, nc
}' 