const Restaurant = require('../models/restaurant');
// to update images in cloudinary
const { cloudinary } = require('../cloudinary');
// Mapboc forward geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const restaurants = await Restaurant.find({})
    res.render('restaurants/index', { restaurants })
};

module.exports.renderNewForm = (req, res) => {
    res.render('restaurants/new');
};

module.exports.createRestaurant = async (req, res, next) => {
   const geoData = await geoCoder.forwardGeocode({
        query: req.body.restaurant.location,
        limit: 1
    }).send()
    res.send(geoData.body.features[0].geometry.coordinates);
    // res.send('okkkkkkk')
    // const restaurants = new Restaurant(req.body.restaurant);
    // restaurants.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // restaurants.author = req.user._id;
    // await restaurants.save();
    // console.log(restaurants);
    // req.flash('success', 'Created New Restaurant');
    // res.redirect(`/restaurants/${restaurants._id}`);
}

module.exports.showRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurants = await (await Restaurant.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })).populate('author');
    console.log(restaurants);
    if (!restaurants) {
        req.flash('error', 'Cannot Find That Restaurant!');
        res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurants })
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findById(id);
    if (!restaurants) {
        req.flash('error', 'Cannot Find That Restaurant!');
        res.redirect('/restaurants');
    }
    res.render('restaurants/edit', { restaurants });
};

module.exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurants = await Restaurant.findByIdAndUpdate(id, {
        ...req.body.restaurant
    })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    restaurants.images.push(...imgs);
    await restaurants.save();
    if (req.body.deleteImages) {
        // updating and deleting imgs in cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await restaurants.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(restaurants);
    }
    req.flash('success', 'Succesfully Updated!');
    res.redirect(`/restaurants/${restaurants._id}`);
};

module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Restaurant!')
    res.redirect('/restaurants');
};
