const mongoose = require('mongoose');
const {brands, things} = require('./seedHelpers');
const Winning = require('../models/winning');

mongoose.connect('mongodb://localhost:27017/konkursi', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];


const seedDB = async ()=> {
    await Winning.deleteMany({});
    for(let i = 0; i<50; i++) {
        const win = new Winning({
          //YOUR USER ID
            author: '635786dae627c437ffd91bb8', //  this from yelpcamp for campgrounds '6345147096209a317563a346',
            title: `${sample(things)}`,
            brand: `${sample(brands)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi ratione molestias, tenetur fuga, labore deserunt quod nisi provident illum eum nam officia facere explicabo ex nemo reiciendis aut quidem quas?',
            image:  [
              {
                url: 'https://res.cloudinary.com/dfjnipy1g/image/upload/v1666766506/KaLaimet/u8rjjtj8k7znfrzl3ynm.jpg',
                filename: 'KaLaimet/u8rjjtj8k7znfrzl3ynm'
              },
              {
                url: 'https://res.cloudinary.com/dfjnipy1g/image/upload/v1666770818/KaLaimet/xuuy2u3r4hgfaxpw9ctj.jpg',
                filename: 'KaLaimet/xuuy2u3r4hgfaxpw9ctj'             
              }
            ]
        })
        await win.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})