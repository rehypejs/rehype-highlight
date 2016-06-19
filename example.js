// Dependencies:
var rehype = require('rehype');
var highlight = require('./index.js');

// Transform:
var file = rehype().use(highlight).process([
    '<h1>Hello World!</h1>',
    '',
    '<pre><code class="language-js">var name = "World";',
    'console.warn("Hello, " + name + "!")</code></pre>'
].join('\n'));

// Yields:
console.log('html', file.toString());
