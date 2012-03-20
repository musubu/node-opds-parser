var OpdsParser = require('../lib/opds-parser')
  , util = require('util')
  , parser;

parser = new OpdsParser();

var url = 'http://www.oreilly.co.jp/ebook/new.opds';

parser.parseUrl(url, {}, function(err, result) {
  if (!err) {
    console.log(util.inspect(result, showHidden=false, depth=6));
  } else {
    console.log(err);
  }
})
