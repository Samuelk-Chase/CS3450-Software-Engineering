from openai import OpenAI
import json
import os

system_prompt = """    You are a story-generation assistant, and your job is to generate interesting story lines based on the context that is given at the beginning of each user prompt. The user will prompt you with a history of several previous prompts and responses, and you should generate an interesting new event in the story based on the most recent user prompt. The prompts will be from a first-person perspective, as if the user were the main character of the story. The reponses should be written from a thrid person perspective, as if they were coming from you, the omniscient narrator. The responses should be roughly one paragraph in length, and your goal should be to not force the player to commit to any one action, but rather to leave each response open-ended so the player can creatively explore their options."""
other =    """
    Depending on the content of the response, you should respond with certain key phrases included between asterisks, placed at the end of the response. The possible phrases are: 

    1. 'Combat begins.'
    2. 'Receive card reward.'
    3. 'Boss combat begins.'

    Combat beginning is a generally negative event, and should occur if the user is being threatened by an element of the story.

    Receiving a card reward is a positive event, and should only occur if the user has done some action that deserves or would result in a reward in the context of the story. This action deserving a reward could be something like discovering a secret through observation and exploration, solving a puzzle, opening a chest or locked container, or receiving a gift from a character in the story.

    Boss combat is a very negative event, and should only occur if the user is being severely threatened by an element of the story that is very powerful.

    Only use one key phrase per response, and vary the key phrase used. Use 'Boss combat begins.' significantly less frequently than the others. Also, not every sample response should include a key phrase, only about one in every 3 responses should include a key phrase. Base which key phrase is used on the context of the user prompt, and the logical outcome of the action indicated by it. Also base which key phrase is used on the rest of the generated response, and the logical results of such a story event occurring. 
    """

def generate_intro(prompt, client, model="gpt-4o-mini", max_tokens=1000, temperature=0.7):
    """
    Generates text using OpenAI's API with the specified prompt.
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a story-generation assistant, and your job is to generate interesting introductory story lines based on the given user prompt."}, 
                {"role": "user", "content": prompt},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
            n=1,
            stop=None,
        )
        text = response.choices[0].message.content.strip()
        return text
    except Exception as e:
        print(f"Error generating text: {e}")
        return ""

def generate_text(prompt, client, model="gpt-4o-mini", max_tokens=1000, temperature=0.7):
    """
    Generates text using OpenAI's API with the specified prompt.
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt}, 
                {"role": "user", "content": prompt},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
            n=1,
            stop=None,
        )
        text = response.choices[0].message.content.strip()
        return text
    except Exception as e:
        print(f"Error generating text: {e}")
        return ""

def build_context(introduction, conversation_history):
    """
    Builds a context string using up to the last five conversation turns.
    If there are fewer than five turns, the introduction is included.
    Each turn is formatted with the user and assistant (with key phrase).
    """
    context_parts = []
    # If fewer than 5 conversation sets are available, include the introduction.
    if len(conversation_history) < 5:
        context_parts.append(f"Introduction: {introduction}")
    # Add up to the last 5 conversation turns.
    for turn in conversation_history[-5:]:
        part = f"User: {turn['user']}\nAssistant: {turn['assistant']} [Key phrase: {turn['key_phrase']}]"
        context_parts.append(part)
    return "\n".join(context_parts)

def main():
    # Set your OpenAI API key (ensure the environment variable is set).
    client = OpenAI()
    if not client.api_key:
        print("Please set your OPENAI_API_KEY environment variable.")
        return

    combat_won = False
    training_data = []      # List to hold all training data entries.
    conversation_history = []  # To store each valid conversation turn.

    # Ask for the story theme and generate an introductory paragraph.
    theme = input("Enter the story theme: ")
    intro_prompt = f"Write a short introductory paragraph for a story with the theme: {theme}"
    introduction = generate_intro(intro_prompt, client)
    print("\nGenerated Introduction:")
    print(introduction)
    print("\n---\n")

    while True:
        if combat_won:
            user_prompt_prefix = "Assume that I just won that combat. "
            combat_won = False
        else:
            user_prompt_prefix = ""
        
        user_prompt = input("Enter your prompt (or type 'exit' to finish): ")
        if user_prompt.lower() == 'exit':
            break
        
        user_prompt = user_prompt_prefix + user_prompt

        # Build the context for the generation call.
        context = build_context(introduction, conversation_history)
        generation_prompt = (
            f"{context}\n"
            f"Most Recent User Prompt: {user_prompt}\n"
        )
        ai_response = generate_text(generation_prompt, client)
        print("\nAI Response:")
        print(ai_response)
        print("\n---\n")

        rating_input = input(
            "Rate the response by selecting a key phrase:\n"
            "0. Combat begins\n"
            "1. Receive reward\n"
            "2. Boss combat begins\n"
            "3. Throw away response (because it was bad)\n"
            "4. No key phrase\n"
            "Your choice: "
        ).strip()
        if rating_input not in ["0", "1", "2", "3", "4"]:
            print("Invalid rating. Please try again.")
            continue

        if rating_input == "3":
            print("Response discarded, not logged.\n")
            continue

        rating_mapping = {"0": "Combat begins", "1": "Receive reward", "2": "Boss combat begins", "4": ""}
        key_phrase = rating_mapping[rating_input]

        # Save the current conversation turn into history.
        conversation_turn = {
            "user": user_prompt,
            "assistant": ai_response,
            "key_phrase": key_phrase
        }
        conversation_history.append(conversation_turn)

        # Build context for the training data entry: use previous turns (if any)
        # so that the current turn (prompt/response) is saved separately.
        previous_context = build_context(introduction, conversation_history[:-1])
        # If there are no previous turns, the context is simply the introduction.
        if not previous_context.strip():
            previous_context = f"Introduction: {introduction}"
        training_entry = {
            "context": previous_context,
            "user": user_prompt,
            "assistant": ai_response,
            "key_phrase": key_phrase
        }
        training_data.append(training_entry)
        print("Turn logged.\n")

    # Save the collected training data to a JSON file.
    output_filename = "training_data.json"
    try:
        with open(output_filename, "w") as f:
            json.dump(training_data, f, indent=4)
        print(f"Training data saved to {output_filename}")
    except Exception as e:
        print(f"Error saving training data: {e}")

if __name__ == "__main__":
    main()
