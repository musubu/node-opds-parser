var OpdsParser = require('../lib/opds-parser')
  , util = require('util')
  , assert = require('assert');

// Utility function for recursively comparing objects.
var recursiveCompare = function(data, expected) {
  for (ii in expected) {
    if (typeof expected[ii] == "object") {
      recursiveCompare(data[ii], expected[ii]);
    } else {
      assert.ok(data[ii] === expected[ii], ii + " has an unexpected value (" + data[ii] + ") expected (" + expected[ii] + ")");
    }
  }
}

console.log("Checking module");
assert.ok(typeof OpdsParser === 'function', 'OpdsParser failed to load');

parser = new OpdsParser();

console.log("Testing navigation feed.");

parser.parseFile(__dirname + '/navigation.opds', function(err, result) {
  if (!err) {
    
    var expected = { '@': [ { xmlns: 'http://www.w3.org/2005/Atom' } ],
      title: 'OPDS Catalog Root Example',
      updated: '2010-01-10T10:03:10Z',
      author: { name: 'Spec Writer', email: null, uri: 'http://opds-spec.org' },
      links: [ { '@': 
           { rel: 'self',
             href: '/opds-catalogs/root.xml',
             type: 'application/atom+xml;profile=opds-catalog;kind=navigation' } },
        { '@': 
           { rel: 'start',
             href: '/opds-catalogs/root.xml',
             type: 'application/atom+xml;profile=opds-catalog;kind=navigation' } } ],
      icon: null,
      entries: 
       [ { id: 'urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56e',
           title: 'Popular Publications',
           updated: '2010-01-10T10:01:01Z',
           links: [ { '@': 
                { rel: 'http://opds-spec.org/sort/popular',
                  href: '/opds-catalogs/popular.xml',
                  type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' } } ],
           authors: [],
           rights: null,
           summary: null,
           content: 'Popular publications from this catalog based on downloads.',
           categories: [],
           'dc:issued': null,
           identifiers: [],
           published: null,
           contributors: [],
           'dc:language': null,
           'dc:publisher': null,
           'dc:subtitle': null } ] }
    
    recursiveCompare(result, expected);
    
    console.log("Passed.");
    
  } else {
    console.log(err);
  }
})


console.log("Testing acquisition feed.");

parser = new OpdsParser();

parser.parseFile(__dirname + '/acquisition.opds', function(err, result) {
  if (!err) {

    var expected = { '@': 
       [ { xmlns: 'http://www.w3.org/2005/Atom' },
         { 'xmlns:dc': 'http://purl.org/dc/terms/' },
         { 'xmlns:opds': 'http://opds-spec.org/2010/catalog' } ],
      title: 'Unpopular Publications',
      updated: '2010-01-10T10:01:11Z',
      author: { name: 'Spec Writer', email: null, uri: 'http://opds-spec.org' },
      links: 
       [ { '@': 
            { rel: 'related',
              href: '/opds-catalogs/vampire.farming.xml',
              type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' } },
         { '@': 
            { rel: 'self',
              href: '/opds-catalogs/unpopular.xml',
              type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' } },
         { '@': 
            { rel: 'start',
              href: '/opds-catalogs/root.xml',
              type: 'application/atom+xml;profile=opds-catalog;kind=navigation' } },
         { '@': 
            { rel: 'up',
              href: '/opds-catalogs/root.xml',
              type: 'application/atom+xml;profile=opds-catalog;kind=navigation' } } ],
      icon: null,
      entries: 
       [ { id: 'urn:uuid:6409a00b-7bf2-405e-826c-3fdff0fd0734',
           title: 'Bob, Son of Bob',
           updated: '2010-01-10T10:01:11Z',
           links: 
            [ { '@': 
                 { rel: 'http://opds-spec.org/image',
                   href: '/covers/4561.lrg.png',
                   type: 'image/png' } },
              { '@': 
                 { rel: 'http://opds-spec.org/image/thumbnail',
                   href: '/covers/4561.thmb.gif',
                   type: 'image/gif' } },
              { '@': 
                 { rel: 'alternate',
                   href: '/opds-catalogs/entries/4571.complete.xml',
                   type: 'application/atom+xml;type=entry;profile=opds-catalog',
                   title: 'Complete Catalog Entry for Bob, Son of Bob' } },
              { '@': 
                 { rel: 'http://opds-spec.org/acquisition',
                   href: '/content/free/4561.epub',
                   type: 'application/epub+zip' } },
              { '@': 
                 { rel: 'http://opds-spec.org/acquisition',
                   href: '/content/free/4561.mobi',
                   type: 'application/x-mobipocket-ebook' } } ],
           authors: 
            [ { name: 'Bob the Recursive',
                email: null,
                uri: 'http://opds-spec.org/authors/1285' } ],
           rights: null,
           summary: 'The story of the son of the Bob and the gallant part he played in the lives of a man and a woman.',
           content: null,
           categories: 
            [ { term: 'FIC020000',
                scheme: 'http://www.bisg.org/standards/bisac_subject/index.html',
                label: 'FICTION / Men\'s Adventure' } ],
           'dc:issued': '1917',
           identifiers: [],
           published: null,
           contributors: [],
           'dc:language': 'en',
           'dc:publisher': null,
           'dc:subtitle': null } ] }

    recursiveCompare(result, expected);

    console.log("Passed.");

  } else {
    console.log(err);
  }
})