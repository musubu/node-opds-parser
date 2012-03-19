var OpdsParser = require('../lib/opds-parser')
  , util = require('util');

function BenchParser () {
  var parser = new OpdsParser();
  this.parse = function(file) {
    parser.parseFile(file);
  }
}

var p = new BenchParser();
p.parse('./navigation.opds');
var n = 0;
function d() {
  p.parse('./navigation.opds');
  n++;
  setTimeout(d, 0);
}
d();

var its = [];
setInterval(function() {
  // navigation.opds has 3 entries
  util.puts(n * 3 + " entries/s");
  its.push(n);
  n = 0;
}, 1000);

process.on('SIGINT', function() {
  var average = 0;
  its.forEach(function(v) {
    average += v;
  });
  average /= its.length;
  util.puts("Average: " + average + " el/s");
  process.exit(0);
})
