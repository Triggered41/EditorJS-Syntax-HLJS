import 'highlight.js/styles/atom-one-dark.css';
import './SyntaxBlock.css';
interface Idata {
    code?: string;
    language?: string;
    lineOffset?: number;
}
interface Iconfig {
    defaultLanguage?: string;
    languages?: Array<string>;
    separateBox?: boolean;
    lineNumber?: 'checked' | '' | undefined;
    lineOffset?: number;
}
export default class Syntax {
    data: any;
    config: any;
    language: any;
    languages: any;
    separateBox: any;
    lineNumber: string;
    lineOffset: number;
    readOnly: boolean;
    static get isReadOnlySupported(): boolean;
    static get enableLineBreaks(): boolean;
    constructor({ data, config, readOnly }: {
        data?: Idata;
        config?: Iconfig;
        readOnly: boolean;
    });
    /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
    static get toolbox(): {
        title: string;
        icon: string;
    };
    preview: HTMLElement | null;
    inp: HTMLTextAreaElement | null;
    lineNum: HTMLSpanElement | null;
    render(): HTMLPreElement;
    toogleLineNumber(): void;
    onOffsetLine(val: number): void;
    renderSettings(): (HTMLInputElement | {
        onActivate: () => void;
        icon: string;
        label: string;
        closeOnActivate: boolean;
    })[];
    setLanguage: (lang: string) => void;
    save(block: HTMLPreElement): {
        code: string;
        language: any;
        lineOffset: number;
    };
}
export {};
