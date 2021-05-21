const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Postagem');
const Postagem = mongoose.model('postagens');

router.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({data: 'desc'}).lean()
        .then((postagens) => {
            res.render('./main/home', postagens);
        }).catch((e) => {
            req.flash('error_msg', "Houve um erro interno.");
            res.render('./erros/404');
        });
});

module.exports = router;