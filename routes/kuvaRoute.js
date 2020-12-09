'use strict';
// kuvaRoute
const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const multer = require('multer')
const kuvaController = require('../controllers/kuvaController');


const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes('image')) {
        cb(null, true);
    } else {
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


router.get('/', kuvaController.kuva_list_get);

router.get('/tokencheck', kuvaController.tokencheck);

//router.get('/:id', kuvaController.kuva_get);

router.get('/:omistaja', kuvaController.kuva_get_haku);


router.post('/',
    upload.single('kuva'),
    injectFile, kuvaController.make_thumbnail,
    [
        body('kuvaus', 'vaadittu kenttä').isLength({min: 1}),
        body('mimetype', 'ei ole kuva').contains('image'),
    ],
    kuvaController.kuva_create_post);


router.put('/',
    [
        body('kuvaus', 'kuvaus pakollinen').isLength({min: 1}),
    ],
    kuvaController.kuva_update_put);

router.delete('/:id', kuvaController.kuva_delete);

module.exports = router;

