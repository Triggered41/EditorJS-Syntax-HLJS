import hljs from "highlight.js";
// import 'highlight.js/styles/atom-one-dark-reasonable.css'
import 'highlight.js/styles/atom-one-dark.css';
import './SyntaxBlock.css';
// console.log(renderToString(<FaRegClipboard />))
const clipboard_svg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm144 418c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V118c0-3.3 2.7-6 6-6h42v36c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12v-36h42c3.3 0 6 2.7 6 6z"></path></svg>`;
const clipboardCheck_svg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm121.2 231.8l-143 141.8c-4.7 4.7-12.3 4.6-17-.1l-82.6-83.3c-4.7-4.7-4.6-12.3.1-17L99.1 285c4.7-4.7 12.3-4.6 17 .1l46 46.4 106-105.2c4.7-4.7 12.3-4.6 17 .1l28.2 28.4c4.7 4.8 4.6 12.3-.1 17z"></path></svg>`;
let currentCodeBlock;
export default class Syntax {
    data;
    config;
    language;
    languages;
    separateBox;
    lineNumber = '';
    lineOffset = 1;
    readOnly = false;
    static get isReadOnlySupported() {
        return true;
    }
    // If line breaks (enter pressed) then enter new line if 3 consecutive line found then exit CodeBlock
    static get enableLineBreaks() {
        const preview = currentCodeBlock.preview;
        const inp = currentCodeBlock.inp;
        const lineNum = currentCodeBlock.lineNum;
        const lineNumber = currentCodeBlock.lineNumber;
        const lineOffset = currentCodeBlock.lineOffset;
        if (inp.value.substring(inp.value.length - 3) == '\n\n\n') {
            inp.value = inp.value.substring(0, inp.value.length - 3);
            const code = hljs.highlight(inp.value + '\n', { language: currentCodeBlock.language });
            preview.innerHTML = code.value;
            lineNum.innerText = lineNumber == 'checked' ? inp.value.split('\n').map((_val, i) => i + lineOffset).join('\n') : '';
            return false;
        }
        else {
            return true;
        }
    }
    constructor({ data, config, readOnly }) {
        currentCodeBlock = this;
        this.data = data;
        this.config = config;
        this.separateBox = config.separateBox;
        if (config.lineNumber)
            this.lineNumber = config?.lineNumber;
        if (config.lineOffset)
            this.lineOffset = config?.lineOffset;
        if (data.lineOffset)
            this.lineOffset = data?.lineOffset;
        this.readOnly = readOnly;
        if (data && data.language) {
            this.language = data.language;
        }
        else if (config && config.defaultLanguage) {
            this.language = config.defaultLanguage;
        }
        else {
            this.language = 'plaintext';
        }
        if (config && config.languages) {
            this.languages = config.languages;
        }
    }
    /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
    static get toolbox() {
        return {
            title: "CodeBlock",
            icon: '{;}'
        };
    }
    preview = null;
    inp = null;
    lineNum = null;
    render() {
        const container = document.createElement('pre');
        const copy = document.createElement('button');
        const select = document.createElement('select');
        this.lineNum = document.createElement('span');
        this.preview = document.createElement('code');
        this.inp = document.createElement('textarea');
        if (this.readOnly) {
            container.contentEditable = 'false';
            this.preview.contentEditable = 'false';
            this.inp.readOnly = true;
        }
        copy.innerHTML = clipboard_svg;
        const op = document.createElement('option');
        op.innerText = 'Plain';
        op.value = 'plaintext';
        select.appendChild(op);
        // if langugages aren't given set 2 default (html and python)
        if (this.languages === undefined) {
            const op = document.createElement('option');
            const op1 = document.createElement('option');
            select.appendChild(op);
            select.appendChild(op1);
            op.innerText = 'html';
            op1.innerText = 'python';
            op.value = 'html';
            op1.value = 'python';
        }
        // If languages are given then create the UI option for each
        this.languages?.forEach((lang) => {
            const opt = document.createElement('option');
            opt.value = lang.key;
            opt.innerText = lang.label;
            select.appendChild(opt);
        });
        // Select the current language 
        select.value = this.language;
        // following was copied from sackoverflow credit goes to: Renan Le Caro
        function supportTabIndentation(textarea) {
            const offsetToLineAndOffset = (lines, offset) => {
                let line = 0;
                while (offset > lines[line].length && line < lines.length - 1) {
                    offset = offset - lines[line].length - 1;
                    line++;
                }
                return { line, offset };
            };
            const LineAndOffsetToOffset = (lines, line, offset) => {
                for (let i = 0; i < line; i++)
                    offset += lines[i].length + 1;
                return offset;
            };
            textarea.addEventListener('keydown', (e) => {
                if (e.key == 'Tab') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (textarea.selectionStart == textarea.selectionEnd && !e.shiftKey) {
                        const end = textarea.selectionEnd + 4;
                        textarea.value = textarea.value.substring(0, textarea.selectionStart) + '    ' + textarea.value.substring(textarea.selectionStart);
                        updateHighlight();
                        textarea.selectionEnd = end;
                        return;
                    }
                    const lines = e.target.value.split('\n');
                    const selection = [offsetToLineAndOffset(lines, textarea.selectionStart),
                        offsetToLineAndOffset(lines, textarea.selectionEnd)];
                    for (var l = selection[0].line; l <= selection[1].line; l++) {
                        const originalLength = lines[l].length;
                        if (e.shiftKey) {
                            lines[l] = lines[l].replace(/^ {0,4}/, '');
                        }
                        else {
                            lines[l] = '    ' + lines[l];
                        }
                        // How much the line moved
                        const delta = lines[l].length - originalLength;
                        // Update the user selection if it's on this line
                        selection.forEach((sel) => {
                            if (sel.line == l) {
                                sel.offset = Math.max(0, sel.offset + delta);
                            }
                        });
                    }
                    textarea.value = lines.join('\n');
                    textarea.selectionStart = LineAndOffsetToOffset(lines, selection[0].line, selection[0].offset);
                    textarea.selectionEnd = LineAndOffsetToOffset(lines, selection[1].line, selection[1].offset);
                    updateHighlight();
                }
            });
        }
        supportTabIndentation(this.inp);
        // Update the preview Box  from input textarea
        const updateHighlight = () => {
            const code = hljs.highlight(this.inp.value + '\n', { language: this.language });
            this.preview.innerHTML = code.value;
            this.inp.style.height = (this.preview.getBoundingClientRect().height) + 'px';
            this.inp.style.width = (this.preview.getBoundingClientRect().width) + 'px';
        };
        // Delay to change the size of input textarea on initial load of code(without delay won't work)
        setTimeout(() => {
            this.inp.style.height = (this.preview.getBoundingClientRect().height) + 'px';
            this.inp.style.width = (this.preview.getBoundingClientRect().width) + 'px';
        }, 10);
        // On code change
        this.inp.addEventListener('input', () => {
            this.inp.classList.toggle('syntax-inputBox-empty', this.inp.value === '');
            this.lineNum.innerText = this.lineNumber == 'checked' ? this.inp.value.split('\n').map((_val, i) => i + this.lineOffset).join('\n') : '';
            updateHighlight();
        });
        // on input textarea scroll, scroll preview box and lineNumber element as well
        this.inp.onscroll = (e) => {
            this.preview.scroll(this.inp.scrollLeft, this.inp.scrollTop);
            this.lineNum?.scroll(this.inp.scrollLeft, this.inp.scrollTop);
            console.log("Val: ", this.inp.scrollTop, ', ', this.inp.scrollTop < 15);
            select.classList.toggle('syntax-lang-select-reveal', this.inp.scrollTop < 20);
        };
        // On language select
        select.onchange = () => {
            console.log(select.value);
            this.language = select.value;
            updateHighlight();
        };
        // Copy the code to clipboard and change to check for 1 second
        copy.onclick = () => {
            navigator.clipboard.writeText(this.inp.value);
            copy.innerHTML = clipboardCheck_svg;
            setTimeout(() => {
                copy.innerHTML = clipboard_svg;
            }, 1000);
        };
        // Load the data back
        // @ts-ignore
        this.inp.textContent = this.data.code;
        // Set line number visibility basedon config setting
        this.lineNum.style.display = this.lineNumber == 'checked' ? 'block' : 'none';
        // Update line numbering if enabled
        this.lineNum.innerText = this.lineNumber == 'checked' ? this.inp.value.split('\n').map((_val, i) => i + this.lineOffset).join('\n') : '';
        // Update the code block with highlighted html
        updateHighlight();
        // Ignore this feature, Was added cuz of some problem I had, solved the problem,
        // but still kept the separate box feature
        if (this.config?.separateBox)
            this.inp.classList.add('syntax-separateBox');
        // CSS Classes setup, hljs added to get the base color of the theme
        this.preview.classList.add('hljs', 'syntax-previewBox');
        this.inp.classList.add('syntax-inputBox');
        this.lineNum.classList.add('syntax-line-number');
        this.preview.classList.add('hljs');
        this.preview.style.overflow = 'hidden';
        container.classList.add('syntax-code-block');
        copy.classList.add('syntax-copy-btn');
        select.classList.add('syntax-lang-select');
        select.classList.add('hljs');
        select.classList.add('syntax-lang-select-reveal');
        copy.classList.add('hljs');
        // important CSS, without which the illusion would probably break
        const padTop = '3rem';
        const padLeft = '2.25rem';
        this.preview.style.paddingTop = padLeft;
        this.inp.style.paddingTop = padLeft;
        this.lineNum.style.paddingTop = padLeft;
        this.preview.style.paddingLeft = padTop;
        this.inp.style.paddingLeft = padTop;
        this.inp.placeholder = 'Code Here...';
        // Element settings?
        this.preview.spellcheck = false;
        this.inp.spellcheck = false;
        this.inp.wrap = 'off';
        container.appendChild(this.preview);
        container.appendChild(select);
        container.appendChild(copy);
        container.appendChild(this.inp);
        container.appendChild(this.lineNum);
        return container;
    }
    toogleLineNumber() {
        this.lineNumber = this.lineNumber == 'checked' ? '' : 'checked';
        this.lineNum.style.display = this.lineNumber == 'checked' ? 'block' : 'none';
        this.lineNum.innerText = this.lineNumber == 'checked' ? this.inp.value.split('\n').map((_val, i) => i + this.lineOffset).join('\n') : '';
    }
    onOffsetLine(val) {
        this.lineOffset = val;
        this.lineNum.innerText = this.lineNumber == 'checked' ? this.inp.value.split('\n').map((_val, i) => i + this.lineOffset).join('\n') : '';
    }
    renderSettings() {
        const lineOffsetElem = document.createElement('input');
        lineOffsetElem.type = 'number';
        lineOffsetElem.placeholder = 'Line Offset Number';
        lineOffsetElem.oninput = () => { this.onOffsetLine(parseInt(lineOffsetElem.value)); };
        return [{
                onActivate: () => this.toogleLineNumber(),
                icon: `1.`,
                label: `<input type='checkbox' ${this.lineNumber} >Line Number`,
                closeOnActivate: !0,
            },
            lineOffsetElem
        ];
    }
    setLanguage = (lang) => {
        this.language = lang;
    };
    save(block) {
        const codeBlock = block.querySelector('code');
        return {
            'code': codeBlock?.textContent,
            'language': this.language,
            'lineOffset': this.lineOffset
        };
    }
}
// Set the color of the cursor (caret) according to hljs theme loaded
setTimeout(() => {
    const color = window.getComputedStyle(document.querySelector('.hljs')).color;
    document.body.style.setProperty('--hljs-base-color', color);
}, 350);
