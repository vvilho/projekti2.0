'use strict';
// catRoute
const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const multer = require('multer')
const catController = require('../controllers/catController');


const fileFilter = (req, file, cb) => {
    if(file.mimetype.includes('image')){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({dest: './uploads/', fileFilter});

const injectFile = (req, res, next) => {
    if (req.file) {
        req.body.mimetype = req.file.mimetype;
    }

    next();
}


router.get('/', catController.cat_list_get);

router.get('/:id', catController.cat_get);


router.post('/', upload.single('cat'), injectFile, catController.make_thumbnail, [
    body('name', 'vaadittu kenttä').isLength({min: 1}),
    body('age', 'syötä numero').isLength({min: 1}).isNumeric(),
    body('weight', 'syötä numero').isLength({min: 1}).isNumeric(),
    body('owner', 'syötä numero').isLength({min: 1}).isNumeric(),
    body('mimetype', 'ei ole kuva').contains('image'),
], catController.cat_create_post);


router.put('/', [
    body('name', 'nimi pakollinen').isLength({min: 1}),
    body('age', 'anna arvo').isNumeric().isLength({min: 1}),
    body('weight', 'anna arvo').isNumeric().isLength({min: 1}),
    body('owner', 'anna arvo').isNumeric().isLength({min: 1})
], catController.cat_update_put);

router.delete('/:id', catController.cat_delete);

module.exports = router;

