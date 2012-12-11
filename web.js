var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , util = require('util');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.cookieParser(process.env.SESSION_SECRET || 'secret123'));
  app.use(express.session());
  app.use(require('faceplate').middleware({
    app_id: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_SECRET,
    scope:  'user_likes,user_photos,user_videos'
  }));

  app.use(function(req, res, next) {
    res.locals.host = req.headers['host'];
    res.locals.scheme = req.headers['x-forwarded-proto'] || 'http';
    res.locals.url = function(path) {
      return res.locals.scheme + res.locals.url_no_scheme(path);
    };
    res.locals.url_no_scheme = function(path) {
      return '://' + res.locals.host + (path || '');
    };
    next();
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', routes.index);
app.post('/', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
