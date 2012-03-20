var OpdsParser = require('../lib/opds-parser')
  , parser;

parser = new OpdsParser();

parser.parseFile('./navigation.opds');

parser.on('entry', function(entry) {
  console.log('Got entry: %s', JSON.stringify(entry));
});

// expected output.

// Got entry: {"id":"urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56e","title":"Popular Publications","updated":"2010-01-10T10:01:01Z","links":[{"@":{"rel":"http://opds-spec.org/sort/popular","href":"/opds-catalogs/popular.xml","type":"application/atom+xml;profile=opds-catalog;kind=acquisition"}}],"authors":[],"rights":null,"summary":null,"content":"Popular publications from this catalog based on downloads.","categories":[],"dc:issued":null,"identifiers":[],"published":null,"contributors":[],"dc:language":null,"dc:publisher":null,"dc:subtitle":null}
// Got entry: {"id":"urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56c","title":"New Publications","updated":"2010-01-10T10:02:00Z","links":[{"@":{"rel":"http://opds-spec.org/sort/new","href":"/opds-catalogs/new.xml","type":"application/atom+xml;profile=opds-catalog;kind=acquisition"}}],"authors":[],"rights":null,"summary":null,"content":"Recent publications from this catalog.","categories":[],"dc:issued":null,"identifiers":[],"published":null,"contributors":[],"dc:language":null,"dc:publisher":null,"dc:subtitle":null}
// Got entry: {"id":"urn:uuid:d49e8018-a0e0-499e-9423-7c175fa0c56d","title":"Unpopular Publications","updated":"2010-01-10T10:01:00Z","links":[{"@":{"rel":"subsection","href":"/opds-catalogs/unpopular.xml","type":"application/atom+xml;profile=opds-catalog;kind=acquisition"}}],"authors":[],"rights":null,"summary":null,"content":"Publications that could use some love.","categories":[],"dc:issued":null,"identifiers":[],"published":null,"contributors":[],"dc:language":null,"dc:publisher":null,"dc:subtitle":null}