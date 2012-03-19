var OpdsParser = require('../lib/opds-parser')
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
    console.log(result);
  } else {
    console.log(err);
  }
})
