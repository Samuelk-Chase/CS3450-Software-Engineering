import openai

sys_message = """You are a creative writer with an expertise in fantasy, history, and powerful entities. Your job is to analyze the text of a short segment of a story and create an interesting and unique enemy that is confronting the protagonist of the story. Ideally, the enemy should be directly named in the segment of story being analyzed.

Once you think of the enemy, you should respond to the user with the following information about the enemy you just created in JSON format: 

{
    "name": "*A suitable name for the enemy*",
    "description": "*A description of the enemy and their characteristics*",
    "health": *An integer defining the maximum health of the enemy*,
    "mana": *An integer defining the maximum mana of the enemy*
}

Here's an example of a correct response for an enemy:

{
    "name": "Balrog",
    "description": "A demonic being of pure evil, shrouded in fire, and holding a long, flaming whip.",
    "health": 150,
    "mana": 12
}

You should also create an attack that such an enemy would be capable of performing, with the following attributes defined in JSON:
{
    "atk_name": "*A suitable name for the attack*",
    "atk_description": "*A description of the capabilities of the attack*",
    "atk_cost": *An integer defining the mana cost of the attack*
}


When you are writing the description of the capabilities of the attack, you should be very specific and concise, making sure not to make it too long or eloquent. Every description should include the phrase, 'Deal x damage.', where x is the amount of damage you think such an attack would deal to an enemy. Additionally, it is absolutely necessary that the description includes at least one keyphrase from the list below. When including a keyphrase, replace 'x' with an integer that signifies how strong the effect is; usually between 1 and 3.

Here is the list of keyphrases and corresponding meanings: 
[
  {
    "keyphrase": "Apply x Stunned",
    "meaning": "The target will lose their next x turns."
  },
  {
    "keyphrase": "Apply x Confused",
    "meaning": "The target has a 50% chance to miss any attack for x turns."
  },
  {
    "keyphrase": "Apply x Exposed",
    "meaning": "The target takes 25% more damage for x turns."
  },
  {
    "keyphrase": "Apply x Weakened",
    "meaning": "The target deals 25% less damage for x turns."
  },
  {
    "keyphrase": "Apply x Slowed",
    "meaning": "The target gains 25% less block for x turns."
  }
]

Here are 2 examples of correct attack data, the first for 'Wood Elves' and the second for a 'Balrog':
[
  {
    "name": "Woodland Magic",
    "description": "Deal 2 damage. Apply 3 Blind.",
    "cost": 3
  },
  {
    "name": "Fire Whip",
    "description": "Deal 17 damage. Apply 3 Slowed.",
    "cost": 4
  }
]

Finally, the two JSON objects should be separated by the '|' delimiter, like so:
{
  JSON_1
}
|
{
  JSON_2
}
"""

usr_prompt = "With the weight of the satchel filled with stolen riches slung over your shoulder, you decide to make your stand in the vault, adrenaline surging through your body. You position yourself strategically, ensuring that the vault door is partially closed to give you cover while allowing you a clear view of the entrance. The muffled sounds of the guards' footsteps grow louder, and the tension in the air thickens as you brace yourself for the confrontation ahead.\n\nThe teller's eyes widen in disbelief as he realizes your intentions, and he opens his mouth to protest, but you shoot him a warning glance, silencing him instantly. It\u2019s clear that you\u2019re prepared to fight tooth and nail to defend what you\u2019ve taken. As the door to the vault creaks open wider, revealing the silhouettes of the guards, you can see the confusion etched on their faces as they realize they\u2019ve stumbled into a situation far more dangerous than they anticipated.\n\nThe guards exchange quick glances, hands resting on their holsters, ready to draw at a moment\u2019s notice. You can feel the weight of their scrutiny, and the room seems to hold its breath. In this moment, you have the upper hand\u2014surrounded by gold and armed with the element of surprise. As they step into the vault, you take a deep breath, ready to unleash your fury, knowing that this fight may determine not just your fate, but the legacy you leave behind in Red Rock. The air crackles with unspoken tension as you prepare to make your stand, ready to face whatever comes through that doorway. *Combat begins*"
client = openai.OpenAI()

# Define messages with a system prompt
messages = [
    {"role": "system", "content": sys_message},
    {"role": "user", "content": usr_prompt}
]

# Create a chat completion request
response = client.chat.completions.create(
    model="gpt-4o-mini",  # Use the model you need (e.g., "gpt-3.5-turbo")
    messages=messages,
    max_tokens=1000,
    temperature=0.7,
    n=1
)

# Print the assistant's response
print(response.choices[0].message.content)
