//* Libraries imports
import type { Tool, LanguageModel, ToolSet } from "ai";

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export abstract class Villager {
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
}

export function getVillagerSystemPrompt(villager: Villager): string {
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
    </goals>`;
}