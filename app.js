var express=require("express"),
 mongoose=require("mongoose"),
  passport = require("passport"),
 bodyParser = require("body-parser"),
 User = require("./models/user"),
 LocalStrategy=require("passport-local"),
 passportLocalMongoose=require("passport-local-mongoose")
  


var app = express();
app.use(bodyParser.urlencoded({extended: true}));

var port=3000;
app.use(express.static('public'));

mongoose.connect("mongodb://localhost/hope_foundation_of_organ_donation");

app.set("view engine","ejs");

app.use(require("express-session")({
    secret:"any message can be written",
    resave:false,
    saveUninitialized:false
}));

app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//SCHEMA
var registrationDonorsSchema=new mongoose.Schema({
donor_id: String,
fname: String,
lname: String,
gender: String,
email: String,
DOB: Date,
bloodgrp:String,
drno:String,
street:String,
area:String,
city:String,
pincode:String,
state:String,
phnno:String,
organs:[String,String,String,String,String,String]
});

var Registrationdonors=mongoose.model("Registrationdonor",registrationDonorsSchema);

/*var mahesh=new Registrationdonors({
donor_id: "564738967543",
fname: "bunny",
lname: "vunda",
gender: "male",
email: "bunny@gmail.com",
DOB:("1998-08-04T00:00:00Z"),
bloodgrp:"O+ve",
drno:"6/3/10",
street:"dwarak colony",
area:"madhapur",
city:"hyderabad",
pincode:"500082",
state:"telangana",
phnno:"7013644607",
organs:["heart","eyes"]
})
mahesh.save(function(err,don){
if(err){
console.log("error");
console.log(err);
}else{
console.log("we just saved");
console.log(don);
}
});*/


var registrationkinSchema=new mongoose.Schema({
donor_id: String,
name_of_kin: String,
email_of_kin: String,
phnno_of_kin: String
});

var Registrationkin=mongoose.model("Registrationkin",registrationkinSchema);

/*var gowtham=new Registrationkin({
donor_id: "564738967543",
name_of_kin: "surya",
email_of_kin: "surya@gmail.com",
phnno_of_kin: "8886535628"
})
gowtham.save(function(err,don){
if(err){
console.log("error");
console.log(err);
}else{
console.log("we just saved");
console.log(don);
}
});*/


var historyOfDonorsSchema=new mongoose.Schema({
donor_id: String,
d_name: String,
organs_donated: String,
hospital_name: String,
status: String
});

var historyOfDonors=mongoose.model("HistoryOfDonors",historyOfDonorsSchema);

/*var sitara=new historyOfDonors({
donor_id: "285643297856",
d_name: "bindiya",
organs_donated: "eyes",
hospital_name: "rainbow",
status: "alive"
})
sitara.save(function(err,don){
if(err){
console.log("error");
console.log(err);
}else{
console.log("we just saved");
console.log(don);
}
});*/

var recipientSchema=new mongoose.Schema({
donor_id: String,
donor_name: String,
organs_name: String,
hospital_name: String,
phone_number: String,
recipient_name: String
});

var recipients=mongoose.model("recipients",recipientSchema);

/*var namrata=new recipients({
donor_name: "bindiya",
organs_name: "eyes",
hospital_name: "rainbow",
phone_number: "7538882552",
recipient_name: "aravinda"
})
namrata.save(function(err,don){
if(err){
console.log("error");
console.log(err);
}else{
console.log("we just saved");
console.log(don);
}
});*/

//fetching username

app.use(function (req,res,next){
res.locals.currentUser = req.user;
next();
})

 

app.get("/registration",function(req,res){
res.render("home");
});
  
app.get("/about",function(req,res){
res.render("about");
}); 

app.get("/why%20should%20u%20donate",function(req,res){
res.render("why should u donate");
});   

app.get("/what%20do%20i%20need%20to%20do",function(req,res){
res.render("what do i need to do");
});  

app.get("/register",function(req,res){
res.render("register");
});  

app.get("/login",function(req,res){
res.render("login");
}); 

app.get("/success",function(req,res){
res.render("success");
});  

app.get("/home",function(req,res){
res.render("home");
});

app.get("/details",isLoggedIn,function(req,res){

res.render("details");
});

app.get("/member",function(req,res){
res.render("member");
});

app.get("/signup",function(req,res){
    res.render("member");
});

//report generation

/*app.post("/why%20should%20u%20donate",function(req,res){
var name=req.body.donor_name;
console.log(name);
    recipients.find({donor_name:req.body.donor_name},function(err,ListOfRecipients){
        if(err){
        console.log(err);
        }
        else
        {
            console.log(ListOfRecipients);
            res.render("report",{ListOfRecipients:ListOfRecipients})
        }
     })
});*/

//report generation 1
app.post("/why%20should%20u%20donate",function(req,res){
//var name=req.body.donor_name;
//console.log(name);
    recipients.find({},{'req.body.details':true}).count(function(err,count_donors){
        if(err){
        console.log(err);
        }
        else
        {
            console.log(count_donors);
            res.render("reporter",{count_donors:count_donors})
        }
     });
});




//handling request

app.post("/signup",function(req,res){
var userobj=new User({
   name:req.body.name,


});

User.create(userobj,function(err,newuser){
if(err){
console.log(err);
}
else{
console.log("new user created");
console.log(newuser);
}
});

    User.register(new User({username: req.body.username1}),req.body.password1,function(err,user){
        if(err){
            console.log(err);
            return res.render('member');
        }
        
       //passport.authenticate("local")(req,res,function(){
        console.log("successfully signed up");
            res.redirect("/member");
        //});
    });
});
    
    
    app.post("/register",function(req,res){
    var donor_id=req.body.donor_id;
    var fname=req.body.fname;
    var lname=req.body.lname;
    var gender=req.body.gender;
    var email=req.body.email;
    var DOB=req.body.DOB;
    var bloodgrp=req.body.bloodgrp;
    var drno=req.body.drno;
    var street=req.body.street;
    var area=req.body.area;
    var city=req.body.city;
    var pincode=req.body.pincode;
    var state=req.body.state;
    var phnno=req.body.phnno;
    var organs=req.body.organs;
    var name_of_kin=req.body.name_of_kin;  
    var email_of_kin=req.body.email_of_kin;
    var phnno_of_kin=req.body.phnno_of_kin;
    
    var newregistrationdon={donor_id:donor_id,fname:fname,lname:lname,gender:gender,email:email,DOB:DOB,bloodgrp:bloodgrp,drno:drno,street:street,area:area,city:city,pincode:pincode,state:state,phnno:phnno,organs:organs};
    var newregistrationkin={donor_id:donor_id,name_of_kin:name_of_kin,email_of_kin:email_of_kin,phnno_of_kin:phnno_of_kin};
    
    Registrationdonors.create(newregistrationdon,function(err,newlyCreated){
    if(err){
    console.log(err);
    }else{
    console.log("new registration created");
    console.log(newlyCreated);
    //res.redirect("/registration");
    
    }
    });
    
     Registrationkin.create(newregistrationkin,function(err,newlyCreated){
    if(err){
    console.log(err);
    }else{
    console.log("new registration created");
    console.log(newlyCreated);
    
    
    }
    });
    res.redirect("/success");
    });
    
    app.post("/details",function(req,res){
    var donor_id=req.body.donor_id;
    var d_name=req.body.Donorname;
    var organs_donated=req.body.OrgansDonated;
    var status=req.body.Status;
    var recipient_name=req.body.Recipientname;
    var donor_name=req.body.Donorname;
    var phone_number=req.body.Mobile_Number;
    var organs_name=req.body.OrgansDonated;
    var hospital_name=req.user.name;
    
    var newhistoryOfDonors={donor_id:donor_id,d_name:d_name,organs_donated:organs_donated,status:status};
    var newrecipient={donor_id:donor_id,recipient_name:recipient_name,organs_name:organs_name,phone_number:phone_number,donor_name:donor_name,hospital_name:hospital_name};
    
    historyOfDonors.create(newhistoryOfDonors,function(err,newlyCreated){
    if(err){
    console.log(err);
    }else{
    console.log("new history of donors created");
    console.log(newlyCreated);
    //res.redirect("/registration");
    
    }
    });
    
     recipients.create(newrecipient,function(err,newlyCreated){
    if(err){
    console.log(err);
    }else{
    console.log("new recipient created");
    console.log(newlyCreated);
    
    
    }
    });
    res.redirect("/details");
    });
    
   
    
    //login logic
//middlewarw
app.post("/member",passport.authenticate("local",{
    successRedirect:"/details",
    failureRedirect:"/member"
    }),function(req,res){
    
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/member");
});
    
    function isLoggedIn(req,res,next){
    console.log("hlo");
    if(req.isAuthenticated()){
    console.log("hello");
        return next();
    }
    res.redirect("/member");
}
//password updation
app.post("/updatepassword", function (req, res) {
var pw = req.body.curr_password;
var pw1 = req.body.new_password;
var pw2 = req.body.new_password_confirm;
if (pw1 === pw2) {
User.findOne({username: req.body.username2},function(err, updateUser){
if(err) {
console.log(err);
} else {
updateUser.changePassword(pw,pw1,function(err){
if(err){
console.log(err);
} else {
console.log("PASSWORD UPDATED!");
}
});
}
});
res.render("member");
console.log("hi");
} else {
res.render("member");
}
});
    
     app.listen(port, function(){
     console.log("Server listening on port " + port);
    });  