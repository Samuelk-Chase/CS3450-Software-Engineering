- use 3 stacks, one for assistant responses, one for user prompts, and one for keyword tags
- When compiling JSON data at the end, take the 4 previous assistant responses, and the 5 corresponding prompts
  - If there aren't enough responses, incorporate the intro text

## Example JSON data:

    {"messages": [
        {"role": "system", "content": "*system prompt data*"},
        {"role": "user", "content": "Prompt 1"}, 
        {"role": "assistant", "content": "Response 1 + Keyword 1"},
        {"role": "user", "content": "Prompt 2"}, 
        {"role": "assistant", "content": "Response 2 + Keyword 2"},
        ...
        {"role": "assistant", "content": "Response 5 + Keyword 5"}
    ]}
