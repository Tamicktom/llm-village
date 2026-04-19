//* Libraries imports
import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import z from 'zod';

//* Environment variables
import { env } from './env';

//* Village
import { runVillagerDialogue } from './village/dialogue-loop';
import { appendDialogueToDialogsFile } from './village/dialogue-storage';

//* Villagers
import type { AbstractVillager } from './village/villagers/base';
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
      const leader = villagers[0];
      return leader.getResponse(req.body.message, model);
    },
    {
      body: z.object({
        message: z.string(),
      }),
    }
  )
  .post(
    "/village/dialogue",
    async (req) => {
      const turns = await runVillagerDialogue({
        model,
        villagers,
        seed: req.body.seed,
        maxTurns: req.body.maxTurns,
        startSpeakerIndex: req.body.startSpeakerIndex,
      });

      try {
        await appendDialogueToDialogsFile(req.body.seed, turns);
      } catch (err) {
        console.error("Failed to append dialogue to dialogs.md:", err);
      }

      return turns;
    },
    {
      body: z.object({
        seed: z.string(),
        maxTurns: z.number().int().min(1).max(100),
        startSpeakerIndex: z.number().int().min(0).optional(),
      }),
    }
  )
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
