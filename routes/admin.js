const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');
require('../models/Postagem');
const Postagem = mongoose.model('postagens');

// router.get('/', (req, res) => {
//     res.render('admin/index');
// });

// router.get('/posts', (req, res) => {
//     res.send('Página de posts');
// });

router.get('/categorias', (req, res) => {
    Categoria.find().sort({
            date: 'desc'
        }).lean()
        .then((categorias) => {
            res.render('admin/categorias', {
                categorias
            });
        }).catch(e => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias.')
            res.redirect('/admin');
        });
});

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias');
});

router.post('/categorias/nova', (req, res) => {

    var erros = [];
    if (!req.body.nome) {
        erros.push({
            texto: 'Nome inválido'
        });
    }

    if (!req.body.slug) {
        erros.push({
            texto: 'Slug inválido'
        });
    }

    if (erros.length > 0)
        res.render('admin/addcategorias', {
            erros
        });
    else {
        if (req.body.id) { // Se houver um id, o item deve ser editado.
            Categoria.findOne({
                    _id: req.body.id
                })
                .then((categoria) => {
                    categoria.nome = req.body.nome;
                    categoria.slug = req.body.slug;

                    categoria.save().then(() => {
                        req.flash('success_msg', 'Categoria editada com sucesso');
                        res.redirect('/admin/categorias');
                    }).catch(err => {
                        req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria.');
                        res.redirect('/admin/categorias');
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao editar a categoria');
                    res.redirect('/admin/categorias');
                })

        } else { // Caso não haja id, um novo item é criado.
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }

            new Categoria(novaCategoria).save()
                .then(() => {
                    req.flash('success_msg', 'Categoria criada com sucesso!');
                    res.redirect('/admin/categorias');
                })
                .catch(() => {
                    req.flash('error_msg', 'Houve um erro ao salvar a categoria. Tente novamente.');
                    res.redirect('/admin');
                });
        }
    };
});

router.post('/categorias/deletar', (req, res) => {
    Categoria.findOneAndDelete({
            _id: req.body.id
        })
        .then(() => {
            req.flash('success_msg', 'Categoria deletada com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao deletar a categoria');
            res.redirect('/admin/categorias');
        });
})

router.get('/categorias/edit/:id', (req, res) => {
    const {
        id
    } = req.params;
    Categoria.findOne({
            _id: id
        }).lean()
        .then((categoria) => {
            res.render('admin/addcategorias', {
                categoria
            });
        }).catch(() => {
            req.flash('error_msg', 'Esta categoria não existe.');
            res.redirect('/admin/categorias');
        });

});

// postagens

router.get('/postagens', (req, res) => {
    res.render('admin/postagens');
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().lean()
        .then((categorias) => {
            res.render('admin/addpostagem', {
                categorias
            });
        }).catch((e) => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulário');
            req.redirect('/admin');
        });
});

router.post('/postagens/nova', (req, res) => {

    var erros = [];
    if (!req.body.titulo) {
        erros.push({
            texto: 'Informe um título.'
        });
    }

    if (!req.body.slug) {
        erros.push({
            texto: 'Slug inválido.'
        });
    }

    if (!req.body.descricao) {
        erros.push({
            texto: 'Descrição inválida.'
        });
    }

    if (erros.length > 0) {
        Categoria.find().lean()
        .then((categorias) => {
            res.render('admin/addpostagem', {
                categorias, erros
            });
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulário');
            req.redirect('/admin');
        });
    }
    else {
        if (req.body.id) { // Se houver um id, o item deve ser editado.
            Postagem.findOne({
                    _id: req.body.id
                })
                .then((postagem) => {
                    postagem.nome = req.body.nome;
                    postagem.slug = req.body.slug;

                    postagem.save().then(() => {
                        req.flash('success_msg', 'Postagem editada com sucesso');
                        res.redirect('/admin/postagens');
                    }).catch(() => {
                        req.flash('error_msg', 'Houve um erro interno ao salvar a edição da postagem.');
                        res.redirect('/admin/postagens');
                    })
                }).catch(() => {
                    req.flash('error_msg', 'Houve um erro ao editar a postagem');
                    res.redirect('/admin/postagens');
                })

        } else { // Caso não haja id, um novo item é criado.
            const novaPostagem = {
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria
            }

            new Postagem(novaPostagem).save()
                .then(() => {
                    req.flash('success_msg', 'Postagem criada com sucesso!');
                    res.redirect('/admin/postagens');
                })
                .catch(() => {
                    req.flash('error_msg', 'Houve um erro ao salvar a postagem. Tente novamente.');
                    res.redirect('/admin');
                });
        }
    };
});


module.exports = router;