# OPDS Parser for node

Parses OPDS Catalog Feed to JSON using Isaac Schlueter's sax parser.


## Installation

    npm install opds-parser

## Requirements

- [request](https://github.com/mikeal/request)
- [sax](https://github.com/isaacs/sax-js)

## Speed

Roughly 45,000 entries/s on 2.4 GHz Core i5 MacBook Pro.

Try <code>examples/bench.js</code> yourself.

## Examples

### Parse from file

    var OpdsParser = require('opds-parser')
      , parser;

    parser = new OpdsParser();

    parser.parseFile('./navigation.opds', function(err, result) {
      if (!err) {
        console.log(result);
      } else {
        console.log(err);
      }
    })

### Parse from URL

    var OpdsParser = require('opds-parser')
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

To change http agent's option, pass options to parseUrl method.

    var OpdsParser = require('opds-parser')
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

The options default to below.

    defaultOptions = {
      , method: 'GET'
      , followRedirect: true
      , followAllRedirects: false
      , maxRedirects: 3
      , timeout: 30 * 1000
      , jar: false
      , headers: {
        'User-Agent': 'node-opds-parser'
      }
    }

### Use as an EventEmitter

    var OpdsParser = require('opds-parser')
      , parser;

    parser = new OpdsParser();

    parser.parseFile('./navigation.opds');

    parser.on('entry', function(entry) {
      console.log('Got entry: %s', JSON.stringify(entry));
    });

### Distinguish feed type

    var OpdsParser = require('opds-parser')
      , parser = new OpdsParser();

    parser.parseFile('examples/navigation.opds', function(err, result) {
      if (!err) {
        parser.getFeedType(result, function(err, type) {
          if (!err) {
            console.log(type);
            // expected value
            // 'navigation'
          } else {
            console.log(err);
          }
        })
      } else {
        console.log(err);
      }
    });

## Parsed Output

### Navigation feed

Sample navigation feed from opds-spec.org (http://opds-spec.org/specs/opds-catalog-1-1-20110627/#Feed_Examples)

    <?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <id>urn:uuid:2853dacf-ed79-42f5-8e8a-a7bb3d1ae6a2</id>
      <link rel="self"  
            href="/opds-catalogs/root.xml" 
            type="application/atom+xml;profile=opds-catalog;kind=navigation"/>
      <link rel="start" 
            href="/opds-catalogs/root.xml" 
            type="application/atom+xml;profile=opds-catalog;kind=navigation"/>
      <title>OPDS Catalog Root Example</title>
      <updated>2010-01-10T10:03:10Z</updated>
      <author>
        <name>Spec Writer</name>
        <uri>http://opds-spec.org</uri>
      </author>
 
      <entry>
        <title>Popular Publications</title>
        <link rel="http://opds-spec.org/sort/popular" 
              href="/opds-catalogs/popular.xml"
              type="application/atom+xml;profile=opds-catalog;kind=acquisition"/>
        <updated>2010-01-10T10:01:01Z</updated>
        <id>urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56e</id>
        <content type="text">Popular publications from this catalog based on downloads.</content>
      </entry>
      <entry>
        <title>New Publications</title>
        <link rel="http://opds-spec.org/sort/new" 
              href="/opds-catalogs/new.xml"
              type="application/atom+xml;profile=opds-catalog;kind=acquisition"/>
        <updated>2010-01-10T10:02:00Z</updated>
        <id>urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56c</id>
        <content type="text">Recent publications from this catalog.</content>
      </entry>
      <entry>
        <title>Unpopular Publications</title>
        <link rel="subsection" 
              href="/opds-catalogs/unpopular.xml"
              type="application/atom+xml;profile=opds-catalog;kind=acquisition"/>
        <updated>2010-01-10T10:01:00Z</updated>
        <id>urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56d</id>
        <content type="text">Publications that could use some love.</content>
      </entry>
      <entry>
        <title>Relative link test entry</title>
        <link href="/somewhere/test.opds" rel="http://opds-spec.org/sort/popular" type="application/atom+xml;profile=opds-catalog;kind=acquisition" />
        <updated>2010-01-10T10:02:00Z</updated>
        <id>urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56e</id>
      </entry>
    </feed>

Feed above will be parsed to JSON below.

    { '@': [ { xmlns: 'http://www.w3.org/2005/Atom' } ],
      id: 'urn:uuid:2853dacf-ed79-42f5-8e8a-a7bb3d1ae6a2',
      title: 'OPDS Catalog Root Example',
      updated: '2010-01-10T10:03:10.000Z',
      author: { name: 'Spec Writer', email: null, uri: 'http://opds-spec.org' },
      links: 
       [ { '@': 
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
           updated: '2010-01-10T10:01:01.000Z',
           links: 
            [ { '@': 
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
           'dc:subtitle': null },
         { id: 'urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56c',
           title: 'New Publications',
           updated: '2010-01-10T10:02:00.000Z',
           links: 
            [ { '@': 
                 { rel: 'http://opds-spec.org/sort/new',
                   href: '/opds-catalogs/new.xml',
                   type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' } } ],
           authors: [],
           rights: null,
           summary: null,
           content: 'Recent publications from this catalog.',
           categories: [],
           'dc:issued': null,
           identifiers: [],
           published: null,
           contributors: [],
           'dc:language': null,
           'dc:publisher': null,
           'dc:subtitle': null },
         { id: 'urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56d',
           title: 'Unpopular Publications',
           updated: '2010-01-10T10:01:00.000Z',
           links: 
            [ { '@': 
                 { rel: 'subsection',
                   href: '/opds-catalogs/unpopular.xml',
                   type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' } } ],
           authors: [],
           rights: null,
           summary: null,
           content: 'Publications that could use some love.',
           categories: [],
           'dc:issued': null,
           identifiers: [],
           published: null,
           contributors: [],
           'dc:language': null,
           'dc:publisher': null,
           'dc:subtitle': null },
         { id: 'urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56e',
           title: 'Relative link test entry',
           updated: '2010-01-10T10:02:00.000Z',
           links: 
            [ { '@': 
                 { href: '/somewhere/test.opds',
                   rel: 'http://opds-spec.org/sort/popular',
                   type: 'application/atom+xml;profile=opds-catalog;kind=acquisition' } } ],
           authors: [],
           rights: null,
           summary: null,
           content: null,
           categories: [],
           'dc:issued': null,
           identifiers: [],
           published: null,
           contributors: [],
           'dc:language': null,
           'dc:publisher': null,
           'dc:subtitle': null } ] }

### Acquisition feed

Sample acquisition feed from opds-spec.org (http://opds-spec.org/specs/opds-catalog-1-1-20110627/#Feed_Examples)

    <?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom"
          xmlns:dc="http://purl.org/dc/terms/"
          xmlns:opds="http://opds-spec.org/2010/catalog">
      <id>urn:uuid:433a5d6a-0b8c-4933-af65-4ca4f02763eb</id>
 
      <link rel="related" 
            href="/opds-catalogs/vampire.farming.xml" 
            type="application/atom+xml;profile=opds-catalog;kind=acquisition"/>
      <link rel="self"    
            href="/opds-catalogs/unpopular.xml"
            type="application/atom+xml;profile=opds-catalog;kind=acquisition"/>
      <link rel="start"   
            href="/opds-catalogs/root.xml"
            type="application/atom+xml;profile=opds-catalog;kind=navigation"/>
      <link rel="up"      
            href="/opds-catalogs/root.xml"
            type="application/atom+xml;profile=opds-catalog;kind=navigation"/>
 
      <title>Unpopular Publications</title>
      <updated>2010-01-10T10:01:11Z</updated>
      <author>
        <name>Spec Writer</name>
        <uri>http://opds-spec.org</uri>
      </author>
 
      <entry>
        <title>Bob, Son of Bob</title>
        <id>urn:uuid:6409a00b-7bf2-405e-826c-3fdff0fd0734</id>
        <updated>2010-01-10T10:01:11Z</updated>
        <author>
          <name>Bob the Recursive</name>
          <uri>http://opds-spec.org/authors/1285</uri>
        </author>
        <dc:language>en</dc:language>
        <dc:issued>1917</dc:issued>
        <category scheme="http://www.bisg.org/standards/bisac_subject/index.html"
                  term="FIC020000"
                  label="FICTION / Men's Adventure"/>
        <summary>The story of the son of the Bob and the gallant part he played in
          the lives of a man and a woman.</summary>
        <link rel="http://opds-spec.org/image"     
              href="/covers/4561.lrg.png"
              type="image/png"/> 
        <link rel="http://opds-spec.org/image/thumbnail" 
              href="/covers/4561.thmb.gif"
              type="image/gif"/>
 
        <link rel="alternate"
              href="/opds-catalogs/entries/4571.complete.xml"
              type="application/atom+xml;type=entry;profile=opds-catalog" 
              title="Complete Catalog Entry for Bob, Son of Bob"/>
 
        <link rel="http://opds-spec.org/acquisition" 
              href="/content/free/4561.epub"
              type="application/epub+zip"/>
        <link rel="http://opds-spec.org/acquisition" 
              href="/content/free/4561.mobi"
              type="application/x-mobipocket-ebook"/>
      </entry>
 
      <entry>
        <title>Modern Online Philately</title>
        <id>urn:uuid:7b595b0c-e15c-4755-bf9a-b7019f5c1dab</id>
        <author>
          <name>Stampy McGee</name>
          <uri>http://opds-spec.org/authors/21285</uri>
        </author>
        <author>
          <name>Alice McGee</name>
          <uri>http://opds-spec.org/authors/21284</uri>
        </author>
        <author>
          <name>Harold McGee</name>
          <uri>http://opds-spec.org/authors/21283</uri>
        </author>
        <updated>2010-01-10T10:01:10Z</updated>
        <rights>Copyright (c) 2009, Stampy McGee</rights>
        <dc:identifier>urn:isbn:978029536341X</dc:identifier>
        <dc:publisher>StampMeOnline, Inc.</dc:publisher>
        <dc:language>en</dc:language>
        <dc:issued>2009-10-01</dc:issued>
        <content type="text">The definitive reference for the web-curious
          philatelist.</content>
        <link rel="http://opds-spec.org/image"     
              href="/covers/11241.lrg.jpg"
              type="image/jpeg"/> 
 
        <link rel="http://opds-spec.org/acquisition/buy" 
              href="/content/buy/11241.epub"
              type="application/epub+zip">
          <opds:price currencycode="USD">18.99</opds:price>
          <opds:price currencycode="GBP">11.99</opds:price>
        </link>
      </entry>
    </feed>

Feed above will be parsed to JSON below.

    { '@': 
       [ { xmlns: 'http://www.w3.org/2005/Atom' },
         { 'xmlns:dc': 'http://purl.org/dc/terms/' },
         { 'xmlns:opds': 'http://opds-spec.org/2010/catalog' } ],
      id: 'urn:uuid:433a5d6a-0b8c-4933-af65-4ca4f02763eb',
      title: 'Unpopular Publications',
      updated: '2010-01-10T10:01:11.000Z',
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
           updated: '2010-01-10T10:01:11.000Z',
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
           'dc:issued': '1917-01-01T00:00:00.000Z',
           identifiers: [],
           published: null,
           contributors: [],
           'dc:language': 'en',
           'dc:publisher': null,
           'dc:subtitle': null },
         { id: 'urn:uuid:7b595b0c-e15c-4755-bf9a-b7019f5c1dab',
           title: 'Modern Online Philately',
           updated: '2010-01-10T10:01:10.000Z',
           links: 
            [ { '@': 
                 { rel: 'http://opds-spec.org/image',
                   href: '/covers/11241.lrg.jpg',
                   type: 'image/jpeg' } },
              { '@': 
                 { rel: 'http://opds-spec.org/acquisition/buy',
                   href: '/content/buy/11241.epub',
                   type: 'application/epub+zip' },
                'opds:price': 
                 [ { '@': { currencycode: 'USD' }, '#': '18.99' },
                   { '@': { currencycode: 'GBP' }, '#': '11.99' } ] } ],
           authors: 
            [ { name: 'Stampy McGee',
                email: null,
                uri: 'http://opds-spec.org/authors/21285' },
              { name: 'Alice McGee',
                email: null,
                uri: 'http://opds-spec.org/authors/21284' },
              { name: 'Harold McGee',
                email: null,
                uri: 'http://opds-spec.org/authors/21283' } ],
           rights: 'Copyright (c) 2009, Stampy McGee',
           summary: null,
           content: 'The definitive reference for the web-curious philatelist.',
           categories: [],
           'dc:issued': '2009-10-01T00:00:00.000Z',
           identifiers: [ 'urn:isbn:978029536341X' ],
           published: null,
           contributors: [],
           'dc:language': 'en',
           'dc:publisher': 'StampMeOnline, Inc.',
           'dc:subtitle': null } ] }

### Parseable elements

node-opds-parser can parse all elements specified in OPDS spec (http://opds-spec.org/specs/opds-catalog-1-1-20110627/#OPDS_Catalog_Entry_Documents). In addition to that, the parser can parse some elements commonly appeared in real world OPDS feeds such as dc:publisher.

For a skelton object for entry, see below.

    // Entry elements specified in OPDS spec.
    // See http://opds-spec.org/specs/opds-catalog-1-1-20110627/#OPDS_Catalog_Entry_Documents
    var entry = {
      // MUST
      id: null
      , title: ''
      , updated: null
      , links: []
      // SHOULD
      , authors: []
      , rights: null
      , summary: null
      , content: null
      , categories: []
      , "dc:issued": null
      , identifiers: []
      // MAY
      , published: null
      , contributors: []
      // Not specified in opds-spec
      // but appears in real world feeds
      , "dc:language": null
      , "dc:publisher": null
      , "dc:subtitle": null
    }


## License

(The MIT License)

Copyright (c) 2011 Musubu Inc. &lt;dev@musubu.co.jp&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

