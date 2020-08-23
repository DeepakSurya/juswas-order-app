var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var passport=require('passport');
var passportLocalMongoose=require('passport-local-mongoose');
var LocalStrategy=require('passport-local');
var session=require('express-session');
var cookieParser=require('cookie-parser');


var User=require('./models/user');
var userId;

mongoose.connect('mongodb://localhost/orderapp');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


app.use(session({
    secret:"My name is Deepak Surya",
    resave:false,
    saveUninitialized:false,
    maxAge: Date.now() + (30 * 86400 * 1000)
  //  cookie: { maxAge: 60000 }
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', function(req, res){
 
    res.send('welcome');

});

app.get('/login',function(req,res){
    //console.log(req.user);

    res.render('login');

});


app.post('/login',passport.authenticate('local'),function(req,res){

    User.findOne({username:req.body.username},function(err,found){
        if(err){
            //console.log(err);
        }else{
            res.send('success')
           // res.redirect('/home/'+found._id);
            userId=found._id;
        }

    });
});


app.get('/logout', function(req, res){
                req.logout();
               res.redirect('/');
             });
            

app.get('/register',function(req,res){
    res.render('register');
});


app.post('/register',function(req,res){
 
    User.register(new User({username:req.body.username}),req.body.password,function(err,newCreatedUser){
        if(err){
            //console.log(err);
            return res.render('register');
        }else{

            newCreatedUser.phone=null;
            newCreatedUser.email=null;
            newCreatedUser.gender=null;
            newCreatedUser.address=null;

            //console.log(newCreatedUser);

            passport.authenticate("local")(req,res,function(){
                res.redirect('/login');
            });

      
            
        }
      });
    
});

app.listen(5050,function(){
    console.log('server on');
});