var OpdsParser = require('../lib/opds-parser')
  , parser;

parser = new OpdsParser();

var url = 'http://www.oreilly.co.jp/ebook/new.opds';

parser.parseUrl(url, {}, function(err, result) {
  if (!err) {
    console.log(result);
  } else {
    console.log(err);
  }
})
