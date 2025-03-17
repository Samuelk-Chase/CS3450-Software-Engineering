from openai import OpenAI
import ollama  # Assuming you have an Ollama client library
import json
import os

system_prompt = "You are a story-generation assistant, and your job is to generate interesting \
story lines based on the previous user prompts and assistant responses. You should \
generate an interesting new event in the story, assuming the user's prompt is the most recent action \
taken by the main character. The \
prompts will be written in a first-person perspective, as if the user were the main character of \
the story. The reponses should be written from a thrid person perspective, as if they were coming \
from you, the omniscient narrator. The responses should be roughly one paragraph in length, and \
your goal should be to not force the user to commit to any one action, but rather to leave \
each response open-ended so the user can creatively explore their options. Don't give the user \
any specific choices, but rather describe the situation and let the user decide what to do. When \
referring to the main character (the user), use the the pronoun 'you'. \
If the user's prompt contains the words, 'I fight in the combat.', you should respond with a \
short paragraph describing the combat, as if the user had just beaten all of their enemies."
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

COMBAT_PROMPT = "I fight in the combat."
HISTORY_LEN = 2

def generate_intro(prompt, client, api="openai", model="gpt-4o-mini", max_tokens=1000, temperature=0.7):
    """
    Generates an introductory paragraph using the specified API with the given prompt.
    """
    try:
        if api == "openai":
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a story-generation assistant, and your job is to generate interesting introductory story lines based on the given user prompt. You should define the setting, the main character, and a clear initial goal for the main character. When defining the main character, assume that the user will be playing the role of the main character, and refer to the main character as 'you' after defining them."}, 
                    {"role": "user", "content": prompt},
                ],
                max_tokens=max_tokens,
                temperature=temperature,
                n=1,
                stop=None,
            )
            text = response.choices[0].message.content.strip()
        elif api == "ollama":
            response = client.generate(
                model="deepseek-r1:1.5b",
                prompt=prompt,
            )
            text = response.response.strip()
        return text
    except Exception as e:
        print(f"Error generating text: {e}")
        return ""

def generate_text(prompt, client, introduction, conversation_history, api="openai", model="gpt-4o-mini", max_tokens=1000, temperature=0.7):
    """
    Generates text using the specified API with the given prompt.
    """
    try:
        # Construct the messages list for the API call
        messages = [{"role": "system", "content": system_prompt}]
        if (len(conversation_history) < HISTORY_LEN):
            messages.append({"role": "assistant", "content": introduction}) 
        for turn in conversation_history[-HISTORY_LEN:]:
            messages.append({"role": "user", "content": turn["user"]})
            messages.append({"role": "assistant", "content": turn["assistant"] + f" {turn['key_phrase']}"})
        messages.append({"role": "user", "content": prompt})

        if api == "openai":
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                n=1,
                stop=None,
            )
            text = response.choices[0].message.content.strip()
        elif api == "ollama":
            response = client.chat(
                model="deepseek-r1:1.5b",
                messages=messages,
            )
            text = response.message.content.strip()
        return text
    except Exception as e:
        print(f"Error generating text: {e}")
        return ""

def get_key_phrase(ai_response):
    """
    Gets key phrase from user.
    """
    rating_input = input(
            "Rate the response by selecting a key phrase:\n"
            "0. No key phrase\n"
            "1. Combat begins\n"
            "2. Receive reward\n"
            "3. Boss combat begins\n"
            "4. Throw away response (because it was bad)\n"
            "Your choice: "
        ).strip()
    if rating_input not in ["0", "1", "2", "3", "4"]:
        print("Invalid rating. Please try again.")
        return None

    if rating_input == "4":
        print("Response discarded, not logged.\n")
        return None

    rating_mapping = {"0": "", "1": "*Combat begins*", "2": "*Receive reward*", "3": "*Boss combat begins*", "4": "Discard"}
    return rating_mapping[rating_input]

def check_moderation(content, client):
    """
    Checks the content using OpenAI's moderation API.
    """
    try:
        response = client.moderations.create(input=content)
        if response.results[0].flagged:
            print("Content flagged by moderation API. Not logging this turn.")
            return False
        print (response.results[0].model_dump())
        return True
    except Exception as e:
        print(f"Error checking moderation: {e}")
        return False

def main():
    # Ask the user to choose the API
    api_choice = input("Choose the AI API to use (openai/ollama): ").strip().lower()
    if api_choice not in ["openai", "ollama"]:
        print("Invalid choice. Please choose either 'openai' or 'ollama'.")
        return

    # Initialize the client based on the chosen API
    if api_choice == "openai":
        client = OpenAI()
        if not client.api_key:
            print("Please set your OPENAI_API_KEY environment variable.")
            return
    elif api_choice == "ollama":
        client = ollama.Client()

    # Define vars
    conversation_history = []  # To store each valid conversation turn.

    # Ask for the story theme and generate an introductory paragraph.
    theme = input("Enter the story theme: ")
    intro_prompt = f"Write a short introductory paragraph for a story with the theme: {theme}"
    introduction = generate_intro(intro_prompt, client, api=api_choice)
    print("\nGenerated Introduction:")
    print(introduction)
    print("\n---\n")

    while True:    
        user_prompt = input("Enter your prompt (or type 'exit' to finish): ")
        if user_prompt.lower() == 'exit':
            break
        
        # generate ai response
        ai_response = generate_text(user_prompt, client, introduction, conversation_history, api=api_choice)
        print("\nAI Response:")
        print(ai_response)
        print("\n---\n")

        # Ask the user to rate the response with a key phrase.
        while True:
            key_phrase = get_key_phrase(ai_response)
            if key_phrase is not None:
                break
        if key_phrase == "Discard":
            continue

        # Check moderation for user prompt and ai response individually
        if not check_moderation(user_prompt, client):
            user_prompt = ""
        if not check_moderation(ai_response, client):
            ai_response = ""

        # Save the current conversation turn into history.
        conversation_turn = {
            "user": user_prompt,
            "assistant": ai_response,
            "key_phrase": key_phrase
        }

        conversation_history.append(conversation_turn)

        # Construct the messages list for the training entry
        if user_prompt != "" and ai_response != "":
            messages = [{"role": "system", "content": system_prompt}]
            if (len(conversation_history) < HISTORY_LEN):
                messages.append({"role": "assistant", "content": introduction})            
            for turn in conversation_history[-HISTORY_LEN:]:
                messages.append({"role": "user", "content": turn["user"]})
                messages.append({"role": "assistant", "content": turn["assistant"] + f" {turn['key_phrase']}"})
            
            training_entry = {"messages": messages}

            # Append the training entry to the jsonl file
            output_filename = "training_data.jsonl"
            try:
                with open(output_filename, "a") as f:
                    f.write(json.dumps(training_entry) + "\n")
                print(f"Turn logged and saved to {output_filename}.\n")
            except Exception as e:
                print(f"Error saving training data: {e}")

        # Handle the case where the key phrase is "Combat begins"
        if key_phrase == "*Combat begins*":
            combat_response = generate_text(COMBAT_PROMPT, client, introduction, conversation_history, api=api_choice)
            print("\nCombat Response:")
            print(combat_response)
            combat_turn = {
                "user": COMBAT_PROMPT,
                "assistant": combat_response,
                "key_phrase": ""
            }

            # Check moderation before logging combat turn
            if not check_moderation(combat_response, client):
                combat_turn["assistant"] = ""
            if not check_moderation(combat_turn["user"], client):
                combat_turn["user"] = ""

            conversation_history.append(combat_turn)
            
            if combat_response != "" and combat_turn["user"] != "":

                # Construct the messages list for the combat training entry
                messages = [{"role": "system", "content": system_prompt}]
                if (len(conversation_history) < HISTORY_LEN):
                    messages.append({"role": "assistant", "content": introduction})            
                for turn in conversation_history[-HISTORY_LEN:]:
                    messages.append({"role": "user", "content": turn["user"]})
                    messages.append({"role": "assistant", "content": turn["assistant"] + f" {turn['key_phrase']}"})
                
                combat_training_entry = {"messages": messages}

                # Append the combat training entry to the jsonl file
                try:
                    with open(output_filename, "a") as f:
                        f.write(json.dumps(combat_training_entry) + "\n")
                    print(f"Combat turn logged and saved to {output_filename}.\n")
                except Exception as e:
                    print(f"Error saving combat training data: {e}")

if __name__ == "__main__":
    main()
