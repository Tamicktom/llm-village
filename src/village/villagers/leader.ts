//* Libraries imports
import { generateText, tool, type LanguageModel, type ToolSet } from "ai";
import { z } from "zod";

//* Local imports
import { AbstractVillager, Gender, Villager } from "./base";

export class Leader extends Villager {
    name = "Alex Brulhart";
    description = "Alex Brulhart is the leader of the village. He is a wise and compassionate leader who is always willing to help his people. He is married to Isabelle Brulhart and has two children, Emma and Ethan.";
    personality = "Wise and compassionate leader";
    gender = Gender.MALE;
    memory: string[] = [
        "Your wife has requested you to help her with the garden. She is in the garden (2, 0).",
    ];
    location: { x: number; y: number } = {
        x: 0,
        y: 0,
    };
    age = 30;
    goals: string[] = ["Help the people of the village", "Make the village a better place"];

}