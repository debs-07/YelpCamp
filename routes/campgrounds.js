const express=require('express');
const router=express.Router();
// const {campgroundSchema}=require('../schemas.js');not used here shofted to middleware.js
const campgrounds=require('../controllers/campgrounds');
const ExpressError=require('../utils/ExpressError');
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware');
const multer  = require('multer');
const {storage}=require('../cloudinary');//no need to mention index.js becasue node automatically looks for index files
const upload = multer({ storage});

const Campground=require('../models/campground.js');


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground));
   

router.get('/new',isLoggedIn,campgrounds.renderNewForm);//always keep new form first otherwise the new text in url is taken as edit id

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));

    router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

// router.get('/', catchAsync(campgrounds.index));

// router.get('/new',isLoggedIn,campgrounds.renderNewForm);

// router.post('/',isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground));

// router.get('/:id',catchAsync(campgrounds.showCampground));

// router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

// router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground));

// router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));


module.exports=router;