//* Local imports
import type { DialogueTurn } from "./dialogue-types";

const MAX_UTTERANCES = 10;

const pairHistories = new Map<string, DialogueTurn[]>();

export function pairKey(nameA: string, nameB: string): string {
    return [nameA, nameB].sort().join("|");
}

export function getRecentPairHistory(nameA: string, nameB: string, limit = MAX_UTTERANCES): DialogueTurn[] {
    const key = pairKey(nameA, nameB);
    const stored = pairHistories.get(key);
    if (!stored || stored.length === 0) {
        return [];
    }
    const sliceStart = Math.max(0, stored.length - limit);
    return stored.slice(sliceStart).map((turn) => ({ ...turn }));
}

export function recordPairExchange(
    addressedName: string,
    responderName: string,
    lastMessage: string,
    reply: string,
): void {
    const key = pairKey(addressedName, responderName);
    let list = pairHistories.get(key);
    if (!list) {
        list = [];
        pairHistories.set(key, list);
    }
    list.push({ speaker: addressedName, text: lastMessage });
    list.push({ speaker: responderName, text: reply });
    while (list.length > MAX_UTTERANCES) {
        list.shift();
    }
}
