// modules loading 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // 데이터 처리 미들웨어
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport'); //인증, 로그인 등에 사용. 로컬 전략 가져옴.
var util = require('./util');
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// 여기까지 Deprecation warnning 방지 설정.
// https://mongoosejs.com/docs/deprecations.html

mongoose.connect(process.env.MONGO_DB);
// console.log(process.env.MONGO_DB); // Environment variable check
var db = mongoose.connection;

// DB접속에 성공 - 단 한번만 일어나는 이벤트이므로 once 사용
db.once('open', function(){
  console.log('DB connected');
});

// DB 접속에 실패 - 접속시 뿐 아니라 다양한 경우에 발생할 수 있으므로 on사용
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other middlewares settings
// 미들웨어에 대하여 >>> https://baked-corn.tistory.com/48
app.set('view engine', 'ejs'); //ejs로 뷰잉 엔진을 설정
app.use(express.static(__dirname+'/public')); //정적 파일들이 모인 폴더 설정
app.use(bodyParser.json()); // 데이터는 JSON 형식으로 받음. 이래야 route의 callback함수(function(req, res, next){...})의 req.body에서 form으로 입력받은 데이터를 사용할 수 있음.
app.use(bodyParser.urlencoded({extended:true})); // urlencoded 데이터를 extended 알고리즘으로 분석
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
// 이렇게 설정하면 Path와 상관없이 요청할때 마다 실행된다.
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.util = util;
  next();
});

// Routes
app.use('/', require('./routes/mobile'));
app.use('/admin', require('./routes/home'));
app.use('/admin/posts', util.getPostQueryString, require('./routes/posts'));
app.use('/admin/users', require('./routes/users'));
app.use('/admin/comments', util.getPostQueryString, require('./routes/comments'));
app.use('/admin/files', require('./routes/files'));

// Server ON
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
