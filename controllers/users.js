const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register');
}

module.exports.register=async(req,res,next)=>{
    try{//as basic catchAsync redirects to a page with all we define try catch here to show errors in the page itself 
    const {email,username,password}=req.body;
    const user=new User({email:email,username:username});
    const registeredUser=await User.register(user,password);
    req.login(registeredUser,(err)=>{
        if(err) return next(err);
        console.log(registeredUser);
        req.flash('success','Welcome To Yelpcamp');
        res.redirect('/campgrounds');
    })
    }
    catch(e){
        req.flash('error','User Exists');
        res.redirect('/register');
    }
    
}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login');
}

module.exports.login=async(req,res)=>{//middleware of passport verifys username and password with db and does all work
    req.flash('success','welcome Back');
    const redirectUrl=req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout();
    req.flash('success','Successfull');
    res.redirect('/campgrounds');
}