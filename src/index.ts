//* Libraries imports
import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import z from 'zod';

//* Environment variables
import { env } from './env';

const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'http://localhost:1234/v1',
});

const model = lmstudio("google/gemma-4-e4b");

const app = new Elysia()
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .post(
    "/chat",
    async (req) => {
      const modelResponse = await generateText({
        model,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that can answer questions and help with tasks.",
          },
          {
            role: "user",
            content: req.body.message,
          }
        ],
        maxRetries: 3, //* Max retries for the model
      });

      return modelResponse.text;
    },
    {
      body: z.object({
        message: z.string(),
      }),
    }
  )
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
