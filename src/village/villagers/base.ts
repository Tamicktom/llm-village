//* Libraries imports
import { tool, type LanguageModel, type ToolSet, generateText, type Tool } from "ai";
import { z } from "zod";

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export abstract class AbstractVillager {
    abstract name: string;
    abstract description: string;
    abstract personality: string;
    abstract gender: Gender;
    abstract age: number;
    abstract memory: string[];
    abstract tools: ToolSet;
    abstract goals: string[];
    abstract location: {
        x: number;
        y: number;
    };

    abstract getResponse(message: string, model: LanguageModel): Promise<string>;
    abstract respondTo(villager: AbstractVillager, message: string, model: LanguageModel): Promise<string>;
}

function getVillagerSystemPrompt(villager: AbstractVillager): string {
    const goals = villager.goals.join("\n");

    return `You are ${villager.name}, ${villager.gender} and ${villager.age} years old.
    
    <description>
    ${villager.description}
    </description>
    <personality>
    ${villager.personality}
    </personality>
    <goals>
    ${goals}
    </goals>
    <location>
    You are at ${villager.location.x}, ${villager.location.y}.
    </location>`;
}

export class Villager extends AbstractVillager {
    name = "Alex";
    description = "";
    personality = "";
    gender = Gender.MALE;
    memory: string[] = [];
    location = {
        x: 0,
        y: 0,
    };
    age = 0;
    goals: string[] = [];
    tools: ToolSet = {
        retrieveMemory: tool({
            description: "Retrieve the memory of the villager.",
            inputSchema: z.object({}),
            execute: async () => {
                return this.retrieveMemory();
            },
        }),
        addMemory: tool({
            description: "Add a memory to the villager.",
            inputSchema: z.object({
                memory: z.string(),
            }),
            execute: async (args) => {
                return this.addMemory(args.memory);
            },
        }),
        lookAround: tool({
            description: "Look around the villager.",
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
        return `I am at ${this.location.x}, ${this.location.y}, center of the village.
        I see a forest (1, 0), a river (0, 1) and a mountain (1, 1).
        My house is at (2, 0).`;
    }

    async goTo(x: number, y: number): Promise<void> {
        this.location.x = x;
        this.location.y = y;
    }

    addTool(name: string, tool: Tool): void {
        this.tools = {
            ...this.tools,
            [name]: tool,
        };
    }

    removeTool(name: string): void {
        const hasTheToolToRemove: boolean = Object.keys(this.tools).includes(name);
        if (hasTheToolToRemove) {
            const newToolsWithoutTheToolToRemove: ToolSet = Object.fromEntries(Object.entries(this.tools).filter(([key]) => key !== name));
            this.tools = newToolsWithoutTheToolToRemove;
        }
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

    async respondTo(villager: AbstractVillager, message: string, model: LanguageModel): Promise<string> {
        let systemPrompt = getVillagerSystemPrompt(villager);
        systemPrompt += `
        ${villager.name} has requested you to respond to the following message:

        <message>
        ${message}
        </message>

        Respond only with the message to send to ${villager.name}.
        `;
        const modelResponse = await generateText({
            model,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                }
            ],
            // tools: this.tools,
        });

        return modelResponse.text;
    }
}