var OpdsParser = require('../lib/opds-parser')
  , util = require('util')
  , parser;

parser = new OpdsParser();

var url = 'http://www.oreilly.co.jp/ebook/new.opds'
  , options = {
    maxRedirects: 5
    , timeout: 5 * 1000
    , headers: {
      'User-Agent': 'your-own-user-agent'
    }
  }

parser.parseUrl(url, options, function(err, result) {
  if (!err) {
    console.log(util.inspect(result, showHidden=false, depth=6));
  } else {
    console.log(err);
  }
})
