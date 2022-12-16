const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/h_250,w_300');
});

ImageSchema.virtual('cardImage').get(function(){
    return this.url.replace('/upload', '/upload/ar_4:3,c_crop');
});

const WinningSchema = new Schema ({
    title: String,
    brand: String,
    image: [ImageSchema],
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// below the way to delete winning with its reviews
WinningSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Winning', WinningSchema);