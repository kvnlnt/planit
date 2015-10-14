var Router = function(paths){
    this.serialize(paths);
    this.currentHash = null; // must be null to trigger hash change
    this.interval = null;
    this.intervalTime = 100;
    return this;
};

/**
 * translate route paths into a regex with each capture group value mapped to a key
 */
Router.prototype.serialize = function(paths){

    // regexes
    var intRegex = '(\\d+)';
    var stringRegex = '(\\w+)';
    var tokenRegex = new RegExp('<(.*:(int|string))>');

    // serialize paths
    var paths = paths.map(function(path){

        // tokenize path
        var tokens = path.route.split('/');
        var keys = [];

        // create regex pattern based on route
        var regex = tokens.map(function(token){

            // is this token a url param?
            var isParam = tokenRegex.test(token);

            // if yes, parse what type of token it is and return
            // the corresponding regex pattern
            if(isParam){
                var parseToken = tokenRegex.exec(token)[1].split(':');
                keys.push(parseToken[0]);
                return parseToken[1] === 'string' ? stringRegex : intRegex;

            // else just return the static token
            } else {
                return token;
            }
        });

        // the default route should be an empty string
        // if it is, it won't use an opening slca
        var re = path.route === '' ? '^$' : '^#' + regex.join('/') + '$';

        // serialized path
        return {
            re: re,
            keys: keys,
            controller: path.controller
        }

    });

    this.paths = paths;

    return this;
};

/** 
 * look for a matching path
 * collect url params and run controller
 * else run error controller
 */
Router.prototype.changePath = function(){

    // look for a matching path
    var path = this.paths.find(function(path, i){
        var re = new RegExp(path.re);
        return re.test(window.location.hash);
    });

    if(path){
        var re = new RegExp(path.re, 'gi');
        var values = re.exec(window.location.hash).slice(1);
        var params = {};
        path.keys.forEach(function(key, i){
            params[key] = values[i];
        });

        // run controller with params
        path.controller(params);
    }  else {

        // run error controller
        window.location.hash = '/error';
    }

    return this;

};

/**
 * check if the hash has changed
 * @return {object} Router
 */
Router.prototype.checkHash = function(){
    if(window.location.hash !== this.currentHash){
        this.currentHash = window.location.hash;
        console.log(this.currentHash);
        this.changePath();
    }
    return this;
};

/**
 * start monitoring hash
 * @return {object} Router
 */
Router.prototype.start = function(){
    var that = this;
    this.interval = setInterval(function(){ that.checkHash(); }, this.intervalTime);
    return this;
};

module.exports = Router;
