//* Libraries imports
import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import z from 'zod';

//* Environment variables
import { env } from './env';

//* Villagers
import { Leader } from './village/villagers/leader';

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
      const leader = new Leader();
      return leader.getResponse(req.body.message, model);
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
