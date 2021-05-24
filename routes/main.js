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
            res.render('./main/home', {
                postagens
            });
        }).catch(() => {
            req.flash('error_msg', "Houve um erro interno.");
            res.redirect('/404');
        });
});

router.get('/404', (req, res) => {
    res.render('./erros/404');
});

router.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({
            slug: req.params.slug
        }).lean()
        .then((postagem) => {
            if (postagem) {
                res.render('postagem/postagem', {
                    postagem
                })
            } else {
                req.flash('error_msg', 'Esta postagem não existe');
                res.redirect('/');
            };
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno');
            res.redirect('/');
        })
});

router.get('/categoria/:slug', (req, res) => {
    Categoria.findOne({
            slug: req.params.slug
        }).lean()
        .then((categoria) => {
            if (categoria) {
                Postagem.find({
                        categoria: categoria._id
                    }).lean()
                    .then((postagens) => {
                        res.render('categorias/postagens', {
                            postagens,
                            categoria
                        });

                    }).catch(() => {
                        req.flash('error_msg', 'Houve um erro ao listar as publicações.');
                        res.redirect('/');
                    });
            } else {
                req.flash('error_msg', 'Esta categoria não existe');
                res.redirect('/');
            }
        }).catch(() => {
            req.flash('error_msg', 'Não foi possível listar as publicações');
            res.redirect('/');
        });
});

module.exports = router;