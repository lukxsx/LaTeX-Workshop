import * as vscode from 'vscode'
import type { ICompletionItem } from '../completion'

export interface CmdSignature {
    readonly name: string, // name without leading `\`
    readonly args: string // {} for mandatory args and [] for optional args
}

/**
 * Return {name, args} from a signature string `name` + `args`
 */
 export function splitSignatureString(signature: string): CmdSignature {
    const i = signature.search(/[[{]/)
    if (i > -1) {
        return {
            name: signature.substring(0, i),
            args: signature.substring(i, undefined)
        }
    } else {
        return {
            name: signature,
            args: ''
        }
    }
}

export class CmdEnvSuggestion extends vscode.CompletionItem implements ICompletionItem {
    label: string
    package: string
    signature: CmdSignature

    constructor(label: string, pkg: string, signature: CmdSignature, kind: vscode.CompletionItemKind) {
        super(label, kind)
        this.label = label
        this.package = pkg
        this.signature = signature
    }

    /**
     * Return the signature, ie the name + {} for mandatory arguments + [] for optional arguments.
     * The leading backward slash is not part of the signature
     */
    signatureAsString(): string {
        return this.signature.name + this.signature.args
    }

    /**
     * Return the name without the arguments
     * The leading backward slash is not part of the signature
     */
    name(): string {
        return this.signature.name
    }

    hasOptionalArgs(): boolean {
        return this.signature.args.includes('[')
    }
}

export function filterNonLetterSuggestions(suggestions: ICompletionItem[], typedText: string, pos: vscode.Position): ICompletionItem[] {
    if (typedText.match(/[^a-zA-Z]/)) {
        const exactSuggestion = suggestions.filter(entry => entry.label.startsWith(typedText))
        if (exactSuggestion.length > 0) {
            return exactSuggestion.map(item => {
                item.range = new vscode.Range(pos.translate(undefined, -typedText.length), pos)
                return item
            })
        }
    }
    return suggestions
}

export function computeFilteringRange(document: vscode.TextDocument, position: vscode.Position): vscode.Range | undefined {
    const line = document.lineAt(position).text
    const curlyStart = line.lastIndexOf('{', position.character)
    const commaStart = line.lastIndexOf(',', position.character)
    const startPos = Math.max(curlyStart, commaStart)
    if (startPos >= 0) {
        return new vscode.Range(position.line, startPos + 1, position.line, position.character)
    }
    return undefined
}