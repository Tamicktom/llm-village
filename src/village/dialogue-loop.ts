//* Libraries imports
import type { LanguageModel } from "ai";

//* Local imports
import type { DialogueTurn } from "./dialogue-types";
import { getRecentPairHistory, recordPairExchange } from "./pair-conversation-history";
import type { AbstractVillager } from "./villagers/base";

export type { DialogueTurn } from "./dialogue-types";

export type RunVillagerDialogueOptions = {
    model: LanguageModel;
    villagers: AbstractVillager[];
    seed: string;
    maxTurns: number;
    /** Index of the villager who speaks first in reply; the seed is treated as said by the next villager in the ring. Default 0. */
    startSpeakerIndex?: number;
};

export async function runVillagerDialogue(options: RunVillagerDialogueOptions): Promise<DialogueTurn[]> {
    const villagers = options.villagers;
    const n = villagers.length;

    if (n < 2) {
        throw new Error("runVillagerDialogue requires at least 2 villagers");
    }

    const startSpeakerIndex = options.startSpeakerIndex ?? 0;
    if (startSpeakerIndex < 0 || startSpeakerIndex >= n) {
        throw new Error("startSpeakerIndex is out of range");
    }

    const turns: DialogueTurn[] = [];
    let lastMessage = options.seed;
    /** Who uttered `lastMessage` (so the responder replies to them). */
    let speakerWhoSaidLast = (startSpeakerIndex + 1) % n;
    let responderIdx = startSpeakerIndex;

    let stepsRemaining = options.maxTurns;

    console.log("Starting dialogue loop with " + n + " villagers");
    console.log("Starting speaker: " + villagers[startSpeakerIndex].name);
    console.log("Responder: " + villagers[responderIdx].name);
    console.log("Last message: " + lastMessage);

    while (stepsRemaining > 0) {
        stepsRemaining -= 1;
        const responder = villagers[responderIdx];
        const addressed = villagers[speakerWhoSaidLast];
        const recentHistory = getRecentPairHistory(responder.name, addressed.name);
        const reply = await responder.respondTo(addressed, lastMessage, options.model, recentHistory);
        recordPairExchange(addressed.name, responder.name, lastMessage, reply);

        console.log("Reply from " + responder.name + " to " + addressed.name + ": " + reply);

        turns.push({
            speaker: responder.name,
            text: reply,
        });

        lastMessage = reply;
        speakerWhoSaidLast = responderIdx;
        responderIdx = (responderIdx + 1) % n;
    }

    return turns;
}

