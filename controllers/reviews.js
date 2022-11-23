const Winning = require('../models/winning');
const Review = require('../models/review');

module.exports.createReview = async(req,res) =>{
    const winning = await Winning.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    winning.reviews.push(review);
    await review.save();
    await winning.save();
    req.flash('success','Atsauksme pievienota!' );
    res.redirect(`/laimesti/${winning._id}`);
}

module.exports.deleteReview = async(req,res) =>{
    const {id, reviewId} = req.params;
    await Review.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Atsauksme izdzēsta!')
    res.redirect(`/laimesti/${id}`);
}

