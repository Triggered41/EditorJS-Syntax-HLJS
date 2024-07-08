
import Syntax from './Syntax.js';
// import Syntax from '../src';
// import Syntax from '../src';

// import Syntax from 'editorjs-syntax-hljs'

console.log("Hello: ", Syntax)

const editor = new EditorJS({
    holder: 'EditorID',
    tools:{
        code: {
            class: Syntax,
            config: {

                languages: [
                    {key: 'xml', label: 'HTML/XML'},
                    {key: 'python', label: 'Python'},
                    {key: 'java', label: 'Java'},
                    {key: 'csharp', label: 'C#'},
                    {key: 'javascript', label: 'Javascript'},
                    {key: 'rust', label: 'Rust'},
                    {key: 'bash', label: 'Bash'},
                ]
            }
        }
    }
})