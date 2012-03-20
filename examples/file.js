var OpdsParser = require('../lib/opds-parser')
  , util = require('util')
  , parser;

parser = new OpdsParser();

parser.parseFile('./navigation.opds', function(err, result) {
  if (!err) {
    console.log(util.inspect(result, showHidden=false, depth=6));
  } else {
    console.log(err);
  }
})

// expected output.

// { '@': [ { xmlns: 'http://www.w3.org/2005/Atom' } ],
//   title: 'OPDS Catalog Root Example',
//   updated: '2010-01-10T10:03:10Z',
//   author: { name: 'Spec Writer', email: null, uri: 'http://opds-spec.org' },
//   links: 
//    [ { '@': 
//         { rel: 'self',
//           href: '/opds-catalogs/root.xml',
//           type: 'application/atom+xml;profile=opds-catalog;kind=navigation' } },
//      { '@': 
//         { rel: 'start',
//           href: '/opds-catalogs/root.xml',
//           type: 'application/atom+xml;profile=opds-catalog;kind=navigation' } } ],
//   icon: null,
//   entries: 
//    [ { id: 'urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56e',
//        title: 'Popular Publications',
//        updated: '2010-01-10T10:01:01Z',
//        links: 
//         [ { '@': 
//              { rel: 'http://opds-spec.org/sort/popular',
//                href: '/opds-catalogs/popular.xml',
//                type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' } } ],
//        authors: [],
//        rights: null,
//        summary: null,
//        content: 'Popular publications from this catalog based on downloads.',
//        categories: [],
//        'dc:issued': null,
//        identifiers: [],
//        published: null,
//        contributors: [],
//        'dc:language': null,
//        'dc:publisher': null,
//        'dc:subtitle': null },
//      { id: 'urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56c',
//        title: 'New Publications',
//        updated: '2010-01-10T10:02:00Z',
//        links: 
//         [ { '@': 
//              { rel: 'http://opds-spec.org/sort/new',
//                href: '/opds-catalogs/new.xml',
//                type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' } } ],
//        authors: [],
//        rights: null,
//        summary: null,
//        content: 'Recent publications from this catalog.',
//        categories: [],
//        'dc:issued': null,
//        identifiers: [],
//        published: null,
//        contributors: [],
//        'dc:language': null,
//        'dc:publisher': null,
//        'dc:subtitle': null },
//      { id: 'urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56d',
//        title: 'Unpopular Publications',
//        updated: '2010-01-10T10:01:00Z',
//        links: 
//         [ { '@': 
//              { rel: 'subsection',
//                href: '/opds-catalogs/unpopular.xml',
//                type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' } } ],
//        authors: [],
//        rights: null,
//        summary: null,
//        content: 'Publications that could use some love.',
//        categories: [],
//        'dc:issued': null,
//        identifiers: [],
//        published: null,
//        contributors: [],
//        'dc:language': null,
//        'dc:publisher': null,
//        'dc:subtitle': null } ] }