# EditorJS-Syntax-HLJS
Syntax highlighting for EditorJS using HLJS (highlight.js)

**Note: Requires Highlight.js**

# Usage

```
import Syntax from 'editorjs-syntax-hljs'

// import any custom style from highlight.js to use it, default is atom-one-dark
import 'highlight.js/styles/atom-one-light.css' 

const editor = new EditorJS({
    // rest of the stuff
    code: {
        class: Syntax,
        shortcut: 'CTRL+SHIFT+C',
        config: {
            lineNumber: '', // 'checked' | ''  Disable/Enable line number
            lineOffset: 1, //Default line number to start from
            defaultLanguage: 'plaintext', // Default language for Syntax Highlight etc.
            languages: {
                // Provide in similar format { key: 'languageName in hljs', label: 'Name to display in dropdown' }
                { key: 'python', label: 'Python'},
                { key: 'java', label: 'Java'},
                { key: 'xml', label: 'HTML/XML'},
            }
        }
    }
})
```