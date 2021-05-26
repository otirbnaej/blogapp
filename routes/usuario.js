const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');
require('../models/Postagem');
const Postagem = mongoose.model('postagens');
require("../models/Usuario");
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');

router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
});

router.post('/registro', (req, res) => {
    const {
        nome,
        email,
        senha,
        senha2
    } = req.body;
    const erros = [];
    if (!nome) erros.push({
        texto: "Nome inválido"
    });
    if (!email) erros.push({
        texto: "Email inválido"
    });
    if (!senha || !senha2) erros.push({
        texto: "Senha inválida"
    });
    if ((senha.length || senha2.length) < 6) erros.push({
        texto: "A senha deve conter mais de 6 caracteres."
    });
    if (senha != senha2) erros.push({
        texto: "As senhas são diferentes. Tente novamente!"
    });

    if (erros.length > 0) {
        res.render('usuarios/registro', {
            erros
        });
    } else {
        Usuario.findOne({
            email: req.body.email
        }).then((usuario) => {
            if (usuario) {
                req.flash('error_msg', 'Email já cadastrado.');
                res.redirect('/usuarios/registro');
            } else {

                const novoUsuario = new Usuario({
                    nome,
                    email,
                    senha
                });

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash('error_msg', 'Houve um erro durante o cadastro');
                            res.redirect('/');
                        }
                        novoUsuario.senha = hash;
                        novoUsuario.save().then(() => {
                            req.flash('success_msg', 'Usuário criado com sucesso');
                            res.redirect('/');
                        }).catch((e) => {
                            req.flash('error_msg', 'Houve um erro ao criar usuário. Tente novamente!');
                            res.redirect('/usuarios/registro');
                        });
                    });
                });
            };
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno');
            res.redirect('/');
        });
    };
});

router.get('/login', (req, res) => {
    res.render('usuarios/login');
})

module.exports = router;