import openai
import json

# Define input and output file paths
INPUT_FILE = "training_data.jsonl"
OUTPUT_FILE = "moderation_results.jsonl"

def check_moderation(text):
    """Runs text through OpenAI's Moderation API and returns the results as a dictionary."""
    response = openai.moderations.create(input=text)
    return response.results[0].model_dump()  # Convert to a serializable dictionary

def process_jsonl(input_file, output_file):
    """Reads a JSONL file, runs moderation checks, and writes results to a new JSONL file."""
    with open(input_file, "r", encoding="utf-8") as infile, open(output_file, "w", encoding="utf-8") as outfile:
        for line in infile:
            entry = json.loads(line)
            text_to_check = entry.get("messages", "")  # Adjust based on your JSONL format
            moderation_result = check_moderation(str(text_to_check))
            
            # Store original data with moderation result
            entry["moderation"] = moderation_result
            outfile.write(json.dumps(entry) + "\n")
            
            # Print flagged cases for immediate review
            if moderation_result["flagged"]:
                print("Flagged Entry:", json.dumps(entry, indent=2))

if __name__ == "__main__":
    process_jsonl(INPUT_FILE, OUTPUT_FILE)
    print(f"Moderation results saved to {OUTPUT_FILE}")
