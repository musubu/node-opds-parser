var OpdsParser = require('../lib/opds-parser')
  , parser;

parser = new OpdsParser();

parser.parseFile('./navigation.opds');

parser.on('entry', function(entry) {
  console.log('Got entry: %s', JSON.stringify(entry));
});
