(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (__dirname){
var config = {};

var sites = {
  'familysearch': require(__dirname + '/sites/familysearch.js')
};

var search = module.exports = function(site, person){
  return sites[site](config, person);
};

search.config = function(newConfig){
  config = newConfig;
};

}).call(this,"/")
},{}],2:[function(require,module,exports){
(function (__dirname){
var utils = require(__dirname + '/../utils.js');
    
var defaultConfig = {
  FS_YEAR_PLUS_MINUS: 2
};

module.exports = function(config, data){

  config = utils.defaults(config, defaultConfig);

  var fsURL = 'https://familysearch.org/search/record/results#count=20&query=';
  var query = '';
  
  // Simple mappings from the person data object to fs params
  // These don't need any special processing
  var simpleMappings = [
    ['givenname', 'givenName'],
    ['surname', 'familyName'],
    ['birth_place', 'birthPlace'],
    ['death_place', 'deathPlace'],
    ['father_givenname', 'fatherGivenName'],
    ['father_surname', 'fatherFamilyName'],
    ['mother_givenname', 'motherGivenName'],
    ['mother_surname', 'motherFamilyName'],
    ['spouse_givenname', 'spouseGivenName'],
    ['spouse_surname', 'spouseFamilyName'],
    ['marriage_place', 'marriagePlace']
  ];
  utils.each(simpleMappings, function(map) {
    if( data[map[1]] ) {
      query = addQueryParam(query, map[0], data[map[1]]);
    }
  });
  
  // Process the birth year 
  if(data.birthDate){
    var birthYear = utils.getYearInt(data.birthDate);
    if( birthYear ) {
      query = addQueryParam(query, 'birth_year', (birthYear - config.FS_YEAR_PLUS_MINUS)+'-'+(birthYear + config.FS_YEAR_PLUS_MINUS));
    }
  }
  
  // Process the death year
  if(data.deathDate){
    var deathYear = utils.getYearInt(data.deathDate);
    if( deathYear ) {
      query = addQueryParam(query, 'death_year', (deathYear - config.FS_YEAR_PLUS_MINUS)+'-'+(deathYear + config.FS_YEAR_PLUS_MINUS));
    }
  }

  // Process the marriage year
  if(data.marriageDate){
    var marriageYear = utils.getYearInt(data.marriageDate);
    if( marriageYear ) {
      query = addQueryParam(query, 'marriage_year', (marriageYear - config.FS_YEAR_PLUS_MINUS)+'-'+(marriageYear + config.FS_YEAR_PLUS_MINUS));
    }
  }
  
  return fsURL + encodeURIComponent(query);

};

/**
 * Add a query parameter to the current query
 */
function addQueryParam(query, queryParam, paramValue) {
  if(paramValue){
    if(query) {
      query += ' ';
    }
    query += '+' + queryParam + ':';
    // if the value has a space, wrap it in quotes      
    if(paramValue.indexOf(' ') >= 0) {
      query += '"' + paramValue + '"~';
    } else {
      query += paramValue + '~';
    }
  }
  return query;
};
}).call(this,"/sites")
},{}],3:[function(require,module,exports){
var utils = {};

/**
 * Extract the year from a date.
 * Capture the special case of just a year because
 * javascript will consider it as the first second
 * of that year in GMT then convert it to the current
 * timezone which could be the previous year.
 */
utils.getYear = function(date){
  return /^\d{4}$/.test(date) ? date : new Date(date).getFullYear();
};

/**
 * Extract the year from a date and return as an integer.
 */
utils.getYearInt = function(date){
  return parseInt(utils.getYear(date));
};

/**
 * Functions lifted from underscore
 */
 
utils.isObject = function(obj) {
  return obj === Object(obj);
}; 
 
utils.each = function(obj, iterator, context) {
  if (obj == null) return obj;
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker) return;
    }
  } else {
    var keys = utils.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
    }
  }
  return obj;
};

utils.keys = function(obj) {
  if (!utils.isObject(obj)) return [];
  if (Object.keys) return Object.keys(obj);
  var keys = [];
  for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
  return keys;
};
 
utils.defaults = function(obj) {
  utils.each(Array.prototype.slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

module.exports = utils;

},{}]},{},[2,3,1])