const Winning = require('../models/winning');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const winnings = await Winning.find({});
    res.render('laimesti/index', {winnings})
}

module.exports.renderNewForm = (req, res) => {
    res.render('laimesti/jauns');
}

module.exports.createWinning = async (req,res,next) => {
    const winning = new Winning(req.body.winning);
    winning.image = req.files.map(f => ({url: f.path, filename: f.filename })); //req.files works because of multer(middleware)
    winning.author = req.user._id;
    await winning.save();
    req.flash('success', 'Laimests veiksmīgi izveidots!');
    res.redirect(`/laimesti/${winning._id}`)
}

module.exports.showWinning = async (req, res) => {
    const winning = await Winning.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!winning){
        req.flash('error','Nevar atrast laimestu!' );
        return res.redirect('/laimesti');
    }
    res.render('laimesti/paradit', { winning});
}

module.exports.renderEditForm = async(req,res)=> {
    const {id} = req.params;
    const winning = await Winning.findById(id)
    if(!winning){
        req.flash('error','Nevar atrast laimestu!' );
        return res.redirect('/laimesti');
    }
    res.render('laimesti/labot', { winning});
}

module.exports.updateWinning = async (req,res)=> {
    const {id} = req.params;
    const winning = await Winning.findByIdAndUpdate(id, {...req.body.winning});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename }));
    winning.image.push(...imgs) // (...imgs) uses spread ... operator. Do not pass the array, just take data from the array and pass that into push.
    //with push you do not overwrite the images, you add them additionally
    await winning.save();
    if(req.body.deleteImages){  // those 3 lines below to delete images!!!
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await winning.updateOne({$pull:{image: {filename: {$in: req.body.deleteImages }}} })
    }
    req.flash('success', 'Informācija par laimestu izlabota!');
    res.redirect(`/laimesti/${winning._id}`)
}

module.exports.deleteWinning = async (req,res) => {
    const {id} = req.params;
    await Winning.findByIdAndDelete(id);
    req.flash('success', 'Laimests ir izdzēsts!')
    res.redirect('/laimesti');
}

