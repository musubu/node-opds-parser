var OpdsParser = require('../lib/opds-parser')
  , parser;

parser = new OpdsParser();

var url = 'http://www.oreilly.co.jp/ebook/new.opds';

parser.parseUrl(url, {});

parser.on('entry', function(entry) {
  console.log('Got entry: %s', JSON.stringify(entry));
});

