//* Node imports
import { appendFile } from "node:fs/promises";
import { join } from "node:path";

//* Local imports
import type { DialogueTurn } from "./dialogue-types";

const DIALOGS_FILENAME = "dialogs.md";

function formatDialogueBlock(seed: string, turns: DialogueTurn[]): string {
    const iso = new Date().toISOString();
    const body = turns
        .map((turn, index) => `${index + 1}. **${turn.speaker}:** ${turn.text}`)
        .join("\n\n");

    return `

## Dialogue — ${iso}

**Seed:** ${seed}

${body}

---

`;
}

export async function appendDialogueToDialogsFile(seed: string, turns: DialogueTurn[]): Promise<void> {
    const path = join(process.cwd(), DIALOGS_FILENAME);
    const content = formatDialogueBlock(seed, turns);
    await appendFile(path, content, "utf8");
}
