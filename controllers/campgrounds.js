const Campground=require('../models/campground.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//next 3 lines for geocoding
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geoCoder=mbxGeocoding({accessToken:mapBoxToken});//this contains 2method forward and reverse geocoding
const {cloudinary}=require("../cloudinary");

module.exports.index=async (req,res)=>{
    const campgrounds=await Campground.find({});
   res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground=async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid campground data',400);
    const geoData=await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    
    const campground=new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));//we are storing image details url and filename from the object we got from multer after saving that is stored in req object
    campground.author=req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success','Successfuly created a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground=async(req,res)=>{
    const {id}=req.params;
    const result=await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    })
        .populate('author');
        
    if(!result)
    {
        req.flash('error','Campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{result});
}

module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const result=await Campground.findById(id);
    if(!result)
    {
        req.flash('error','Campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{result});
}

module.exports.updateCampground=async(req,res)=>{
    const {id}=req.params;
    console.log(req.body);
    const updateCamp=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    updateCamp.images.push(...imgs);//we dont want to push an entire to existing array as req.files.map creates an array, so we will spread the contents and then push only data to existing array
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages)
        {
            cloudinary.uploader.destroy(filename);//for deleting images from cloudinary
        }
    await updateCamp.updateOne({$pull:{images:{filename: {$in:req.body.deleteImages}}}});
    console.log(updateCamp);
    }
    await updateCamp.save();
    req.flash('success','Successfuly updated this campground');
    res.redirect(`/campgrounds/${updateCamp.id}`);
}

module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}