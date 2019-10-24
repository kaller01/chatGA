var anchorme = require("anchorme").default; // if installed via NPM
var someText = "this is a text with a link www.github.com ..";
var result = anchorme(someText);
console.log(result);

const stripHtml = require("string-strip-html");
// it does not assume the output must be always HTML and detects legit brackets:
console.log(stripHtml("a < b and c > d")); // => 'a < b and c > d'
// leaves content between tags:
console.log(stripHtml("Some text <b>and</b> text.")); // => 'Some text and text.'
// adds spaces to prevent accidental string concatenation
console.log(stripHtml("aaa<div>bbb</div>ccc")); // => 'aaa bbb ccc'