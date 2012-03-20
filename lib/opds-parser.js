var sax = require('sax')
  , request = require('request')
  , fs = require('fs')
  , url = require('url')
  , events = require('events')
  , util = require('util');

if(!Object.merge) Object.merge = function(a, b, force){
  if (a && b) {
    if (a !== Object(a) || b !== Object(b)) {
      throw new TypeError('Object.merge called on non-object');
    }
    for (var key in b) {
      if(force || !a.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
  }
  return a;
};

function getValue(obj, subkey) {
  if (!subkey)
    subkey = '#';
  if (obj && obj[subkey])
    return obj[subkey];
  else
    return null;
}

function handleMeta (node) {
  if (!node) return {};
  
  var meta = {
    id: null
    , title: null
    , updated: null
    , author: null
    , links: []
    , icon: null
  };

  Object.keys(node).forEach(function(name) {
    var el = node[name];
    
    switch(name) {
      case 'id':
        meta.id = getValue(el);
        break;
      case 'title':
        meta.title = getValue(el);
        break;
      case 'updated':
        meta.updated = getValue(el);
        break;
      case 'author':
        function getAuthor (el, callback) {
          var author = {};

          ['name', 'email', 'uri'].forEach(function(p) {
            if (el.hasOwnProperty(p)) {
              author[p] = el[p]['#'];
            } else {
              author[p] = null;
            }
          });

          callback(author);
        }

        getAuthor(el, function(author) {
          meta.author = author;
        })
        break;
      case 'link':
        if (Array.isArray(el)) {
          meta.links = el;
        } else {
          meta.links.push(el);
        }
        break;
      case 'icon':
        meta.icon = getValue(el);
        break;
    }
  })
  
  return meta;
}

function handleEntry (node) {
  if (!node) return {};
  
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
  
  Object.keys(node).forEach(function(name) {
    var el = node[name];
    
    switch (name) {
      case 'id':
        entry.id = getValue(el);
        break;
      case 'title':
        entry.title = getValue(el);
      case 'updated':
        entry.updated = getValue(el);
        break;
      case 'link':
        if (Array.isArray(el)) {
          entry.links = el;
        } else {
          entry.links.push(el);
        }
        break;
      case 'author':
        function getAuthor (el, callback) {
          var author = {};

          ['name', 'email', 'uri'].forEach(function(p) {
            if (el.hasOwnProperty(p)) {
              author[p] = el[p]['#'];
            } else {
              author[p] = null;
            }
          });

          callback(author);
        }

        if (Array.isArray(el)) {
          el.forEach(function(o) {
            getAuthor(o, function(author) {
              entry.authors.push(author);
            })
          })
        } else {
          getAuthor(el, function(author) {
            entry.authors.push(author);
          })
        }
        break;
      case 'rights':
        entry.rights = getValue(el);
        break;
      case 'summary':
        entry.summary = getValue(el);
        break;
      case 'content':
        entry.content = el['#'];
        break;
      case 'category':
        function getCategory (el, callback) {
          var category = {};
          ['term', 'scheme', 'label'].forEach(function(p) {
            if (el['@'].hasOwnProperty(p)) {
              category[p] = el['@'][p];
            } else {
              category[p] = null;
            }
          })
          callback(category);
        }

        if (Array.isArray(el)) {
          el.forEach(function(o) {
            getCategory(o, function(category) {
              entry.categories.push(category);
            })
          })
        } else {
          getCategory(el, function(category) {
            entry.categories.push(category);
          })
        }
        break;
      case 'dc:issued':
        entry['dc:issued'] = getValue(el);
        break;
      case 'dc:identifier':
        if (Array.isArray(el)) {
          el.forEach(function(e) {
            entry.identifiers.push(getValue(e));
          })
        } else {
          entry.identifiers.push(getValue(el));
        }
        break;
      case 'published':
        entry.published = getValue(el);
        break;
      case 'contributor':
        function getContributor (el, callback) {
          var contributor = {};

          ['name', 'email', 'uri'].forEach(function(p) {
            if (el.hasOwnProperty(p)) {
              contributor[p] = el[p]['#'];
            } else {
              contributor[p] = null;
            }
          });

          callback(contributor);
        }

        if (Array.isArray(el)) {
          el.forEach(function(o) {
            getContributor(o, function(contributor) {
              entry.contributors.push(contributor);
            })
          })
        } else {
          getContributor(o, function(contributor) {
            entry.contributors.push(contributor);
          })
        }
        break;
      case 'dc:language':
        entry['dc:language'] = getValue(el);
        break;
      case "dc:publisher":
        entry['dc:publisher'] = getValue(el);
        break;
      case "dc:subtitle":
        entry["dc:subtitle"] = getValue(el);
        break;
    }
  });

  return entry;
}

function OpdsParser () {
  var self = this;
  
  self._reset();
  
  self.stream = sax.createStream(false, {lowercasetags: true, normalize: true, trim: true});
  
  self.stream.on('error', function(e) {
    self.handleSaxError(e, self);
  });
  self.stream.on('opentag', function(n) {
    self.handleOpenTag(n, self);
  });
  self.stream.on('closetag', function(el) {
    self.handleCloseTag(el, self);
  });
  self.stream.on('text', function(text) {
    self.handleText(text, self);
  })
  self.stream.on('cdata', function(text) {
    self.handleText(text, self);
  });
  self.stream.on('end', function() {
    self.handleEnd(self);
  });
  events.EventEmitter.call(this);
}

util.inherits(OpdsParser, events.EventEmitter);

OpdsParser.prototype.handleOpenTag = function(node, scope) {
  var self = scope
    , n = {
      '#name': node.name
      , '@': {}
      , '#': ''
    }
  
  if (self.stack.length == 0) {
    if (!(node.name == 'feed' || node.name == 'entry')) {
      self.handleError('not an atom.', scope);
    }
  }
  
  function handleAttributes (attrs, el) {
    Object.keys(attrs).forEach(function(name) {
      if (self.xmlbase.length && (name == 'href' || name == 'src' || name == 'uri')) {
        attrs[name] = url.resolve(self.xmlbase[0]['#'], attrs[name]);
      } else if (name == 'xml:base') {
        if (self.xmlbase.length) {
          attrs[name] = url.resolve(self.xmlbase[0]['#'], attrs[name]);
        }
        self.xmlbase.unshift({ '#name': el, '#': attrs[name]});
      } else if (name == 'type' && (attrs['type'] == 'xhtml' || attrs['type'] == 'html')) {
        self.inHtml = true;
        self.html = {'#name': el, '#': ''};
      }
    })
    
    return attrs;
  }
  
  if (Object.keys(node.attributes).length) {
    n['@'] = handleAttributes(node.attributes, n['#name']);
  }

  if (self.inHtml && self.html['#name'] != n['#name']) {
    self.html['#'] += '<' + n['#name'];
    Object.keys(n['@']).forEach(function(name) {
      self.html['#'] += ' ' + name + '="' + n['@'][name] + '"';
    });
    self.html['#'] += '>';
  } else if (self.stack.length == 0) {
    self.meta['@'] = [];
    Object.keys(n['@']).forEach(function(name) {
      var o = {};
      o[name] = n['@'][name];
      self.meta['@'].push(o);
    })
  }

  self.stack.unshift(n);
}

OpdsParser.prototype.handleText = function(text, scope) {
  var self = scope;
  
  if (self.inHtml) {
    self.html['#'] += text;
  } else {
    if (self.stack.length) {
      if ('#' in self.stack[0]) {
        self.stack[0]['#'] += text;
      } else {
        self.stack[0]['#'] = text;
      }
    }
  }
}

OpdsParser.prototype.handleCloseTag = function(el, scope) {
  var self = scope
    , n = self.stack.shift();
  
  delete n['#name'];
  
  if (self.xmlbase.length) {
    if (el == 'logo' || el == 'icon') {
      n['#'] = url.resolve(self.xmlbase[0]['#'], n['#']);
    }
    if (el == self.xmlbase[0]['#name']) {
      void self.xmlbase.shift();
    }
  }
  
  if (self.inHtml) {
    if (el == self.html['#name']) {
      n['#'] += self.html['#'].trim();
      for (var key in n) {
        if (key != '@' && key != '#') {
          delete n[key];
        }
      }
      
      self.html = {};
      self.inHtml = false;
    } else {
      self.html['#'] += '</' + el + '>';
    }
  }
  
  if ('#' in n) {
    if (n['#'].match(/^\s*$/)) {
      delete n['#'];
    } else {
      n['#'] = n['#'].trim();
      if (Object.keys(n).length === 1) {
        n = n['#'];
      }
    }
  }
  
  if (el == 'entry') {
    var entry = handleEntry(n);
    self.emit('entry', entry);
    self.entries.push(entry);
  } else if (el == 'feed') {
    Object.merge(self.meta, handleMeta(n), true);
  }
  
  if (self.stack.length > 0) {
    if (!self.stack[0].hasOwnProperty(el)) {
      self.stack[0][el] = n;
    } else if (self.stack[0][el] instanceof Array) {
      self.stack[0][el].push(n);
    } else {
      self.stack[0][el] = [self.stack[0][el], n];
    }
  } else {
    self.nodes = n;
  }
}

OpdsParser.prototype.handleEnd = function(scope) {
  var self = scope
    , feed = self.meta
    , entries = self.entries;
  
  feed.entries = self.entries;
  
  self.emit('end', feed);
  
  if ('function' == typeof self.callback) {
    if (self.errors.length) {
      var error = self.errors.pop();
      if (self.errors.length) {
        error.errors = self.errors;
      }
      self.callback(error);
    } else {
      self.callback(null, feed);
    }
  }
  self._reset();
}

OpdsParser.prototype.handleSaxError = function(e, scope) {
  var self = scope;
  self.handleError(e, self);
  if (self._parser) {
    self._parser.error = null;
    self._parser.resume();
  }
}

OpdsParser.prototype.handleError = function(e, scope) {
  var self = scope;
  
  self.errors.push(e);
  this.handleEnd(scope);
}

OpdsParser.prototype._setCallback = function(callback) {
  this.callback = ('function' == typeof callback) ? callback : undefined;
}

OpdsParser.prototype._reset = function() {
  this.meta = {};
  this.entries = [];
  this.xmlbase = [];
  this.stack = [];
  this.nodes = {};
  this.inHtml = false;
  this.html = {};
  this.errors = [];
  this.callback = undefined;
}

OpdsParser.prototype.parseUrl = function(url, options, callback) {
  var self = this
    , defaultOptions = {
        url: url
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
    , requestOptions = Object.merge(defaultOptions, options, true);
  
  
  self._setCallback(callback);
  
  request(requestOptions)
    .on('error', function(e) {
      self.handleError(e, self);
    })
    .pipe(self.stream);
}

OpdsParser.prototype.parseFile = function(file, callback) {
  var self = this;
  
  self._setCallback(callback);
  
  fs.createReadStream(file)
    .on('error', function(e) {
      self.handleError(e, self);
    })
    .pipe(self.stream);
}

exports = module.exports = OpdsParser;
