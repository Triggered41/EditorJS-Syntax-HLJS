"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
import highlight_js_1 from "highlight.js"
// import 'highlight.js/styles/atom-one-dark-reasonable.css'
import "highlight.js/styles/atom-one-dark.css"
import "./SyntaxBlock.css"
// console.log(renderToString(<FaRegClipboard />))
var clipboard_svg = "<svg stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" viewBox=\"0 0 384 512\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm144 418c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V118c0-3.3 2.7-6 6-6h42v36c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12v-36h42c3.3 0 6 2.7 6 6z\"></path></svg>";
var clipboardCheck_svg = "<svg stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" viewBox=\"0 0 384 512\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm121.2 231.8l-143 141.8c-4.7 4.7-12.3 4.6-17-.1l-82.6-83.3c-4.7-4.7-4.6-12.3.1-17L99.1 285c4.7-4.7 12.3-4.6 17 .1l46 46.4 106-105.2c4.7-4.7 12.3-4.6 17 .1l28.2 28.4c4.7 4.8 4.6 12.3-.1 17z\"></path></svg>";
var currentCodeBlock;
var Syntax = /** @class */ (function () {
    function Syntax(_a) {
        var data = _a.data, config = _a.config;
        var _this = this;
        this.lineNumber = '';
        this.lineOffset = 1;
        this.preview = null;
        this.inp = null;
        this.lineNum = null;
        this.setLanguage = function (lang) {
            _this.language = lang;
        };
        currentCodeBlock = this;
        this.data = data;
        this.config = config;
        this.separateBox = config.separateBox;
        if (config.lineNumber)
            this.lineNumber = config === null || config === void 0 ? void 0 : config.lineNumber;
        if (config.lineOffset)
            this.lineOffset = config === null || config === void 0 ? void 0 : config.lineOffset;
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
    Object.defineProperty(Syntax, "enableLineBreaks", {
        get: function () {
            const preview = currentCodeBlock.preview
            const inp = currentCodeBlock.inp
            const lineNum = currentCodeBlock.lineNum
            const lineNumber = currentCodeBlock.lineNumber
            const lineOffset = currentCodeBlock.lineOffset

        if (inp.value.substring(inp.value.length-3) == '\n\n\n'){
            inp.value = inp.value.substring(0, inp.value.length-3)
            const code = highlight_js_1.highlight(inp.value+'\n', {language: currentCodeBlock.language})
            preview.innerHTML = code.value
            lineNum.innerText = lineNumber=='checked' ? inp.value.split('\n').map((_val,i)=>i+lineOffset).join('\n'):''
            return false
            }
            else {
                return true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Syntax, "toolbox", {
        /**
       * Get Tool toolbox settings
       * icon - Tool icon's SVG
       * title - title to show in toolbox
       *
       * @returns {{icon: string, title: string}}
       */
        get: function () {
            return {
                title: "CodeBlock",
                icon: '{;}'
            };
        },
        enumerable: false,
        configurable: true
    });
    Syntax.prototype.render = function () {
        var _this = this;
        var _a, _b;
        var container = document.createElement('pre');
        var copy = document.createElement('button');
        var select = document.createElement('select');
        this.lineNum = document.createElement('span');
        this.preview = document.createElement('code');
        this.inp = document.createElement('textarea');
        copy.innerHTML = clipboard_svg;
        var op = document.createElement('option');
        op.innerText = 'Plain';
        op.value = 'plaintext';
        select.appendChild(op);
        if (this.languages === undefined) {
            var op_1 = document.createElement('option');
            var op1 = document.createElement('option');
            select.appendChild(op_1);
            select.appendChild(op1);
            op_1.innerText = 'html';
            op1.innerText = 'python';
            op_1.value = 'html';
            op1.value = 'python';
        }
        (_a = this.languages) === null || _a === void 0 ? void 0 : _a.forEach(function (lang) {
            var opt = document.createElement('option');
            opt.value = lang.key;
            opt.innerText = lang.label;
            select.appendChild(opt);
        });
        // Select the current language 
        select.value = this.language;
        // following was copied from sackoverflow credit goes to: Renan Le Caro
        function supportTabIndentation(textarea) {
            var offsetToLineAndOffset = function (lines, offset) {
                var line = 0;
                while (offset > lines[line].length && line < lines.length - 1) {
                    offset = offset - lines[line].length - 1;
                    line++;
                }
                return { line: line, offset: offset };
            };
            var LineAndOffsetToOffset = function (lines, line, offset) {
                for (var i = 0; i < line; i++)
                    offset += lines[i].length + 1;
                return offset;
            };
            textarea.addEventListener('keydown', function (e) {
                if (e.key == 'Tab') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (textarea.selectionStart == textarea.selectionEnd && !e.shiftKey) {
                        var end = textarea.selectionEnd + 4;
                        textarea.value = textarea.value.substring(0, textarea.selectionStart) + '    ' + textarea.value.substring(textarea.selectionStart);
                        updateHighlight();
                        textarea.selectionEnd = end;
                        return;
                    }
                    var lines = e.target.value.split('\n');
                    var selection = [offsetToLineAndOffset(lines, textarea.selectionStart),
                        offsetToLineAndOffset(lines, textarea.selectionEnd)];
                    var _loop_1 = function () {
                        var originalLength = lines[l].length;
                        if (e.shiftKey) {
                            lines[l] = lines[l].replace(/^ {0,4}/, '');
                        }
                        else {
                            lines[l] = '    ' + lines[l];
                        }
                        // How much the line moved
                        var delta = lines[l].length - originalLength;
                        // Update the user selection if it's on this line
                        selection.forEach(function (sel) {
                            if (sel.line == l) {
                                sel.offset = Math.max(0, sel.offset + delta);
                            }
                        });
                    };
                    for (var l = selection[0].line; l <= selection[1].line; l++) {
                        _loop_1();
                    }
                    textarea.value = lines.join('\n');
                    textarea.selectionStart = LineAndOffsetToOffset(lines, selection[0].line, selection[0].offset);
                    textarea.selectionEnd = LineAndOffsetToOffset(lines, selection[1].line, selection[1].offset);
                    updateHighlight();
                }
            });
        }
        supportTabIndentation(this.inp);
        var updateHighlight = function () {
            var code = highlight_js_1.default.highlight(_this.inp.value + '\n', { language: _this.language });
            _this.preview.innerHTML = code.value;
            _this.inp.style.height = (_this.preview.getBoundingClientRect().height) + 'px';
            _this.inp.style.width = (_this.preview.getBoundingClientRect().width) + 'px';
        };
        setTimeout(function () {
            _this.inp.style.height = (_this.preview.getBoundingClientRect().height) + 'px';
            _this.inp.style.width = (_this.preview.getBoundingClientRect().width) + 'px';
        }, 10);
        this.inp.addEventListener('input', function () {
            _this.inp.classList.toggle('syntax-inputBox-empty', _this.inp.value === '');
            _this.lineNum.innerText = _this.lineNumber == 'checked' ? _this.inp.value.split('\n').map(function (_val, i) { return i + _this.lineOffset; }).join('\n') : '';
            updateHighlight();
        });
        this.inp.onscroll = function (e) {
            var _a;
            console.log(e.currentTarget.scrollLeft);
            _this.preview.scroll(_this.inp.scrollLeft, _this.inp.scrollTop);
            (_a = _this.lineNum) === null || _a === void 0 ? void 0 : _a.scroll(_this.inp.scrollLeft, _this.inp.scrollTop);
        };
        select.onchange = function () {
            console.log(select.value);
            _this.language = select.value;
            updateHighlight();
        };
        copy.onclick = function () {
            navigator.clipboard.writeText(_this.inp.value);
            copy.innerHTML = clipboardCheck_svg;
            setTimeout(function () {
                copy.innerHTML = clipboard_svg;
            }, 1000);
        };
        //  
        // Load the data back
        // @ts-ignore
        this.inp.textContent = this.data.code;
        // Set line number visibility basedon config setting
        this.lineNum.style.display = this.lineNumber == 'checked' ? 'block' : 'none';
        // Update line numbering if enabled
        this.lineNum.innerText = this.lineNumber == 'checked' ? this.inp.value.split('\n').map(function (_val, i) { return i + _this.lineOffset; }).join('\n') : '';
        // Update the code block with highlighted html
        updateHighlight();
        // 
        this.preview.classList.add('hljs', 'syntax-previewBox');
        if ((_b = this.config) === null || _b === void 0 ? void 0 : _b.separateBox)
            this.inp.classList.add('syntax-separateBox');
        container.classList.add('syntax-code-block');
        this.inp.classList.add('syntax-inputBox');
        copy.classList.add('syntax-copy-btn');
        select.classList.add('syntax-lang-select');
        var padTop = '3rem';
        var padLeft = '2.25rem';
        this.preview.style.paddingTop = padLeft;
        this.inp.style.paddingTop = padLeft;
        this.lineNum.style.paddingTop = padLeft;
        this.preview.style.paddingLeft = padTop;
        this.inp.style.paddingLeft = padTop;
        this.inp.placeholder = 'Code Here...';
        this.lineNum.classList.add('syntax-line-number');
        this.preview.spellcheck = false;
        this.inp.spellcheck = false;
        this.inp.wrap = 'off';
        container.appendChild(this.preview);
        container.appendChild(select);
        container.appendChild(copy);
        container.appendChild(this.inp);
        container.appendChild(this.lineNum);
        select.classList.add('hljs');
        copy.classList.add('hljs');
        this.preview.classList.add('hljs');
        this.preview.style.overflow = 'hidden';
        return container;
    };
    Syntax.prototype.toogleLineNumber = function () {
        var _this = this;
        // const this.lineNum!:HTMLSpanElement|null = document.querySelector<HTMLSpanElement>('.syntax-line-number')
        // const inp:HTMLTextAreaElement|null = document.querySelector<HTMLTextAreaElement>('.syntax-this.inp!utBox')
        this.lineNumber = this.lineNumber == 'checked' ? '' : 'checked';
        this.lineNum.style.display = this.lineNumber == 'checked' ? 'block' : 'none';
        this.lineNum.innerText = this.lineNumber == 'checked' ? this.inp.value.split('\n').map(function (_val, i) { return i + _this.lineOffset; }).join('\n') : '';
    };
    Syntax.prototype.renderSettings = function () {
        var _this = this;
        return {
            onActivate: function () { return _this.toogleLineNumber(); },
            icon: "{1}",
            label: "<input type='checkbox' ".concat(this.lineNumber, " >Line Number"),
            closeOnActivate: !0,
            // isActive: false
        };
    };
    Syntax.prototype.save = function (block) {
        var codeBlock = block.querySelector('code');
        return {
            'code': codeBlock === null || codeBlock === void 0 ? void 0 : codeBlock.textContent,
            'language': this.language
        };
    };
    return Syntax;
}());
export default Syntax;
setTimeout(function () {
    var color = window.getComputedStyle(document.querySelector('.hljs')).color;
    // const inps: any = document.querySelectorAll('.syntax-inputBox')
    // // console.log(elements)
    // // console.log("Color: ", window.getComputedStyle(elements).getPropertyValue('color'))
    // // return
    // inps.forEach((inp:HTMLAreaElement, i:number)=>{
    //     window.getComputedStyle(inp).color = color
    //     // inp.style.webkitTextFillColor = color
    // })
    // // inps[0].style.webkitTextFillColor = pres[0].style.webkitTextFillColor
    document.body.style.setProperty('--hljs-base-color', color);
}, 350);
