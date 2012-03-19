var OpdsParser = require('../lib/opds-parser')
  , parser;

parser = new OpdsParser();

parser.parseFile('./navigation.opds', function(err, result) {
  if (!err) {
    console.log(result);
  } else {
    console.log(err);
  }
})
