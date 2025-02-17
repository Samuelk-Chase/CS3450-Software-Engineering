# AI Finetuning
The AI that will be used to dynamically generate the content for *The Last Game* must be capable of producing a consistent, highly structured output for the following purposes:

1. **Story Generation**
2. **Card Description Generation**
3. **Card Image Generation**
4. **Enemy Generation**
5. **Boss Generation**

Together, these four types of AI generated content will result in a complete toolset for AI generation of *Last Game*'s content.

## Finetuned Generation
We will finetune several AI models to perform some of these tasks, while others shouldn't require finetuning. This is an example of the finetuning process (according to GPT-4o):

1. Define Output Structure
- Determine the exact format you need (e.g., JSON, XML, Markdown, tables).
- Create a schema or template to ensure consistency.
2. Prepare Training Data
- Collect high-quality examples of structured outputs.
- Format the data in a way that aligns with the intended output.
- Use diverse examples covering edge cases.
3. Preprocess Data
- Tokenize and clean the data to remove inconsistencies.
- Convert outputs into prompt-response pairs for supervised fine-tuning.
- Label the dataset clearly with proper separators or delimiters.
4. Fine-Tune the Model
- Use LoRA (Low-Rank Adaptation) or full fine-tuning with OpenAI’s fine-tuning API.
- Implement reinforcement learning (RLHF) to refine structured output adherence.
- Train with loss functions that emphasize structure adherence (e.g., token-level constraints).
5. Implement Prompt Engineering
- Design few-shot examples to guide the model toward structured responses.
- Use system instructions and templates for predictable outputs.
- Experiment with temperature and top-k/top-p sampling for consistency.
6. Validate and Evaluate
- Run the model on test prompts and compare against expected structured outputs.
- Measure precision, recall, and F1 scores for structure adherence.

This is just an example of the process that will be used to finetune each model, but more generally speaking, we will need to prepare data sets that include examples of correctly structured prompts and responses. Once we have these, we can use them to produce an AI model that is much more consistent at creating correctly structured output.

The following generative tasks will require finetuned models. They are each listed with examples of finetuning data: 
### Story Generation
#### Structure of Story Content
- The AI generated story must respond with several types of content:
  - The story must be able to produce card rewards to build the player's deck.
  - The story must produce enemy descriptions to be passed to the enemy generation model.
  - The story must define when the user goes into combat.
- In order to parse the AI generated content and correctly trigger game events and update the game engine state, the output of the story generation AI must be concise and use specific words when certain events should be triggered.

#### Example Story Data

**Example 1**

    Context: You see before you a path branching in two directions through the dark forest. Down the left fork of the path, you can hear distant, eerie chattering, as if there is something waiting for you. Down the right fork, you see faint lights drifting through the trees, obscured by the foliage just enough that it is impossible to tell what exactly is producing them.

    Prompt: I carefully take the left path, making sure to watch for enemies.

    Output: Despite your best efforts to be careful, you inadvertently stumble upon several [angry wood elves]. They immediately draw their knives and move towards you. **Combat begins.**
**Analysis:**
- The AI used the provided context to produce a logical outcome to the player's action.
- The AI used the words, `**Combat begins.**` to indicate to the game engine that combat should be initiated.
- The AI generated a short description of the enemy, indicated by square brackets: `[angry wood elves]`.
  - This description can be saved and passed into the enemy generator as input.

### Card Description Generation
#### Structure of Card Description
- This model is possibly the most important finetuning operation for *Last Game*.
- It is vital to the functioning of the game that the card descriptions be extremely concise and parsable so that the game engine will be able to understand how to interact with the game state.
- The AI generated card descriptions must follow these conventions:
  - The description must include parsable keywords that have consistent meanings.
    - Most keywords will be directly followed by a numerical value, indicating the duration or intensity of the previous keyword's effect.
  - The description must not hallucinate by telling the user that a certain effect will take place when the game engine is incapable of correctly parsing and carrying out said effect.
  - The AI should be able to consistently match the theme of the current game through the tone and word choice in the card descriptions.

#### Example Card Description Data

**Example 1**

    Context: You hack into the secure weapon storage room of the Federation trading vessel. As the electronic lock disengages and the door opens, you see a pedestal in the center of the small room holding a:

    Prompt (internal): Generate 3 card descriptions that fit an item that could be found given the provided context.

    Output: 
    Title: **Laser Gun**
    Description: Deal 10 damage. Apply 2 Blind.
    Cost: 2

    Title: **Plasma Blade**
    Description: Deal 24 damage.
    Cost: 3

    Title: **Impulse Grenade**
    Description: Deal 7 damage to all enemies. Apply 1 Stunned to all enemies.
    Cost: 2

**Analysis:**
- The AI used the context provided by the story generation AI to understand that it should create a sci-fi themed card, and that it should be some type of weapon.
- The AI generated three options for the user that all had:
  - A title for the card.
  - A description with keywords such as `Deal 10 damage` or `Apply 1 Stunned to all enemies`
  - An associated mana cost, based on the usefulness of the card.
    - This could potentially be calculated based on the numerical values in the card description.

### Enemy Generation
#### Structure of Enemy Generation
- This model needs to take a short description of the enemy and generate a short list of moves that the enemy will rotate through during combat. 
- Each move should have a description, just like cards do.
  - The move should be generated with the same set of keywords that we defined for cards.

#### Example Enemy Generation

**Example 1**

    Prompt: Generate the moveset and health of [angry wood elves]

    Output: 
    Health: 18

    Title: **Stab**
    Description: Deal 3 damage.

    Title: **Woodland Magic*
    Description: Apply 3 Blind to all enemies.

**Analysis:**
- The AI generated two attacks that an angry wood elf might perform.
- Each attack had:
  - A title
  - A description with appropriate keyword usage and numerical values.
- Even if the prompt is given with an enemy description that implies a plurality of enemies, the AI should only generate one moveset per prompt. In this case, the [angry wood elves] would act as one entity in combat.

### Boss Generation
#### Structure of Boss Generation
- This model is essentially the same as the enemy generator, and in fact we could potentially use the same model. Our prompt would have to include a parameter that signals the AI that the moveset and health should be more suited to a boss.
- Bosses should have longer movesets and more health than typical enemies.

####

**Example 1**

    Prompt: Generate the moveset, description, and health of [Balrog] as a Boss.

    Output:
    Health: 100
    Description: A demonic being of pure evil, shrouded in fire, and holding a long, flaming whip.

    Title: **Fire Whip**
    Description: Deal 17 damage. Apply 3 Slowed.

    Title: **Infernal Rage**
    Description: Gain 5 Strength.

    Title: **Evil Incarnate**
    Description: Deal 10 damage to all enemies. Apply 3 Weakened to all enemies.

    Title: **Death Grip**
    Description Deal 25 damage.

**Analysis:**
- The AI generated a boss type enemy with extra health and more powerful moves at a higher quantity than a typical enemy.
- The move titles fit the theme of the enemy's name.

## Non-finetuned Generation
The following categories of AI generated content will not require finetuning:

### Image Generation
#### Structure of Image Generation
- Images should be generated based on the context for story-related images.
- Card images should be generated based on the name and description of the card.
  - Card images will just be artwork, they won't have any of the numerical or text-based information embedded in the image.
- Boss images should be generated based on the description and name of the boss.

#### Examples of Image Generation

**Example 1**

`Prompt: Generate an image of a [plasma blade] that has the description: [Deal 24 damage.]`
![`Output:`](../doc/images/Plasma_Blade.png)

**Example 2**

`Prompt: Generate an image of this moment in a story: [You see before you a path branching in two directions through the dark forest. Down the left fork of the path, you can hear distant, eerie chattering, as if there is something waiting for you. Down the right fork, you see faint lights drifting through the trees, obscured by the foliage just enough that it is impossible to tell what exactly is producing them.]`
![`Output:`](../doc/images/Branching_Paths.png)

**Example 3**

`Prompt: Generate an image of a [Balrog] boss. It is described as: [A demonic being of pure evil, shrouded in fire, and holding a long, flaming whip.]`
![`Output:`](../doc/images/Balrog.png)


## Finetuning technologies
There are several options that we have for finetuning models. If we decide to use GPT-4o, they have a user-friendly interface on their [website](https://platform.openai.com/docs/guides/fine-tuning#when-to-use-fine-tuning) to finetune any number of models. Otherwise, we can use `huggingface.co` and a repository called `Unsloth` to finetune a model such as Deepseek R1 on one of our own computers.

Once the AI model to be used is finalized, the example data sets will need to be created for each finetuned model. Each data set should ideally have more than 10 example prompts and responses. 