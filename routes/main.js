const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');
require('../models/Postagem');
const Postagem = mongoose.model('postagens');

router.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({
        date: 'desc'
    }).lean()
        .then((postagens) => {
            res.render('./main/home', { postagens });
        }).catch(() => {
            req.flash('error_msg', "Houve um erro interno.");
            res.redirect('/404');
        });
});

router.get('/404', (req, res) => {
    res.render('./erros/404');
});

module.exports = router;