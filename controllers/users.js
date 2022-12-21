const User = require('../models/user');

module.exports.renderRegister = (req,res) => {
    res.render('lietotaji/registreties');
}

module.exports.register = async(req,res, next) =>{
    try{
    const {email, username, password} = req.body; //here we grab those 3 things
    const user = new User({email, username});    //then we pass email, username in an object and save it to variable
    const registeredUser = await User.register(user, password); //this takes the new user we just made and password (all salt and password things included) and saves it to the new user
    req.login(registeredUser, err => {  //we need to add this so when register, you already are logged in
        if(err) return next(err);
        req.flash('success', "Laipni lūgti Kā laimēt!");
        res.redirect('/laimesti');
        })
    } catch (e){
        req.flash('error', e.message);
        res.redirect('registreties');
    }
}

module.exports.renderLogin = (req,res) => {
    res.render('lietotaji/pierakstities');
}

module.exports.login =  (req,res) => {
    req.flash('success', 'Prieks Tevi atkal redzēt!');
    const redirectUrl = req.session.returnTo || '/laimesti';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res, next) => {
    req.logout(function(err){
        if(err) {
            return next(err)
        }
        req.flash('success', "Uz drīzu tikšanos!");
        res.redirect('/laimesti');
    })
}