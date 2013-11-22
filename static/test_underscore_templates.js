var _ = require('./lib/underscore.js');
var fs = require('fs');

var templHTML = fs.readFileSync('test_underscore_template.html');

console.log(_.template(templHTML,{"tree":{
                            "children": [],
                            "item": "a",
                            "text": "The name and address of the permittee."
                        }}));