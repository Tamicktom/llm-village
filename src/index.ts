//* Libraries imports
import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import z from 'zod';

//* Environment variables
import { env } from './env';

//* Villagers
import { AbstractVillager } from './village/villagers/base';
import { Leader } from './village/villagers/leader';
import { IsabelleBrulhart } from './village/villagers/isabelle-brulhart';

const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'http://localhost:1234/v1',
});

const model = lmstudio("google/gemma-4-e4b");

const villagers: AbstractVillager[] = [
  new Leader(),
  new IsabelleBrulhart(),
]

const app = new Elysia()
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .post(
    "/chat",
    async (req) => {
      const leader = new Leader();
      const isabelle = new IsabelleBrulhart();

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
