//* Libraries imports
import { generateText, tool, type LanguageModel, type ToolSet } from "ai";
import { z } from "zod";

//* Local imports
import { Villager, Gender, getVillagerSystemPrompt } from "./base";

export class Leader extends Villager {
    name = "Alex";
    description = "Alex is the leader of the village. He is a wise and compassionate leader who is always willing to help his people.";
    personality = "Wise and compassionate leader";
    gender = Gender.MALE;
    memory: string[] = [];
    location = {
        x: 0,
        y: 0,
    };
    age = 30;
    goals = ["Help the people of the village", "Make the village a better place"];
    tools: ToolSet = {
        retrieveMemory: tool({
            description: "Retrieve the memory of the leader",
            inputSchema: z.object({}),
            execute: async () => {
                return this.retrieveMemory();
            },
        }),
        addMemory: tool({
            description: "Add a memory to the leader",
            inputSchema: z.object({
                memory: z.string(),
            }),
            execute: async (args) => {
                return this.addMemory(args.memory);
            },
        }),
        lookAround: tool({
            description: "Look around the leader",
            inputSchema: z.object({}),
            execute: async () => {
                return this.lookAround();
            },
        }),
        goTo: tool({
            description: "Go to a location",
            inputSchema: z.object({
                x: z.number(),
                y: z.number(),
            }),
            execute: async (args) => {
                return this.goTo(args.x, args.y);
            },
        }),
    }

    async retrieveMemory(): Promise<string> {
        return this.memory.join("\n");
    }

    async addMemory(memory: string): Promise<void> {
        this.memory.push(memory);
    }

    async lookAround(): Promise<string> {
        return `I am at ${this.location.x}, ${this.location.y}. I see a forest (1, 0), a river (0, 1) and a mountain (1, 1).`;
    }

    async goTo(x: number, y: number): Promise<void> {
        this.location.x = x;
        this.location.y = y;
    }

    async getResponse(message: string, model: LanguageModel): Promise<string> {
        const modelResponse = await generateText({
            model,
            messages: [
                {
                    role: "system",
                    content: getVillagerSystemPrompt(this)
                }
            ],
            tools: this.tools,
            stopWhen: (step) => step.steps.length > 10,
        });

        console.log(modelResponse.steps.map((step) => JSON.stringify(step.toolCalls, null, 2)));

        return modelResponse.text;
    }
}