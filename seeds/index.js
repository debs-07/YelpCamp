const mongoose=require('mongoose');
const cities=require('./cities');
const {places ,descriptors}=require('./seedHelpers');
const Campground=require('../models/campground.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const sample= array=>array[Math.floor(Math.random()*array.length)];


const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
})

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<=300;i++){
       const rand=Math.floor(Math.random()*1000);
       const camp=new Campground({
           location:`${cities[rand].city},${cities[rand].state}`,
           title:`${sample(descriptors)} ${sample(places)}`,
           author:'60741b7b931b5d23505a48ec',
           geometry:{
             "type":"Point",
             "coordinates":[
               cities[rand].longitude,
               cities[rand].latitude
             ]
            },
           images:[
            {
              url: 'https://res.cloudinary.com/dvs8rsvvr/image/upload/v1619167153/YelpCamp/ibecrwpzvtcaoynacvye.jpg',   
              filename: 'YelpCamp/ibecrwpzvtcaoynacvye'
            },
            {
              url: 'https://res.cloudinary.com/dvs8rsvvr/image/upload/v1619167156/YelpCamp/syyjlub5rhxiswwdbcj9.jpg',   
              filename: 'YelpCamp/syyjlub5rhxiswwdbcj9'
            }
          ],
           description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus perspiciatis aut nam eveniet dicta cupiditate rem sequi hic, quod corrupti optio saepe aliquam vel exercitationem? Quos repudiandae explicabo ipsum minus.    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus perspiciatis aut nam eveniet dicta cupiditate rem sequi hic, quod corrupti optio saepe aliquam vel exercitationem? Quos repudiandae explicabo ipsum minus.',
           price:Math.floor(Math.random()*40)+10
        })
       await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
});