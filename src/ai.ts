import { Configuration, OpenAIApi } from 'openai';
import { Color, log } from './util/util';

export async function prompt(prompt: string) {
  log('Waiting for OpenAI...');
  const startingTime = Date.now();

  const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0.7,
    max_tokens: Math.floor(prompt.length * 1.2),
    top_p: 1,
    stream: false,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  const result = response.data.choices[0].text;
  log(
    `OpenAI response received in ${Date.now() - startingTime}ms`,
    Color.Green
  );
  return result;
}
