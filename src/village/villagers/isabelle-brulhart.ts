//* Libraries imports
import { AbstractVillager, Gender, Villager } from "./base";

export class IsabelleBrulhart extends Villager {
    name = "Isabelle Brulhart";
    description = "Isabelle Brulhart is the wife of Alex Brulhart. She is a hard worker who is always willing to help her husband.";
    personality = "Hard worker, supportive wife and dedicated mother";
    gender = Gender.FEMALE;
    memory: string[] = [
        "You has requested your husband to help you with the garden.",
        "You are in the garden (2, 0).",
    ];
    location: { x: number; y: number } = {
        x: 2,
        y: 0,
    };
    age = 26;
    goals: string[] = ["Help her husband", "Take care of the children", "Take care of the house", "Take care of the garden"];
}