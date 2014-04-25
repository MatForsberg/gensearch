var config = {};

var sites = {
  'ancestry': require('./sites/ancestry.js'),
  'familysearch': require('./sites/familysearch.js')
};

var search = module.exports = function(site, person){
  return sites[site](config, person);
};

search.config = function(newConfig){
  config = newConfig;
};
