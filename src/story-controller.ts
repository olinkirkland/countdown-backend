import { prompt } from './ai';

export let title = 'The Three Little Pigs';

export let lastUpdated = new Date();

const storyPrompt = `
Generate a "Madlibs" object in a valid JSON format with the following characteristics:

- The story should be in the 'text' key: An array of paragraphs (strings)
- Variables for word replacements should be in the 'variables' key as an object
- Variables should be described in simple terms without giving clues to their original meaning or context beyond the type of word
- Make sure to include character names and important places as variables whenever possible
- Write the entire traditional fairy-tale story of %title%

Example:
{
  "text": ["Once upon a time, there was a little girl named %name%.", "She lived in a %adj_1% house in the %adj_2% woods..."],
  "variables": {
    "name": "A person's name",
    "food_1": "A type of food",
    "adj_1": "An adjective",
    "noun_2": "A noun",
    "noun_3": "A noun",
    "place_1": "A location"
    ...
  }
}
`;

export async function getStory() {
  let story;

  // If the story hasn't been generated yet, generate it
  if (!story) story = await prompt(storyPrompt.replace('%title%', title));

  return story;
}
