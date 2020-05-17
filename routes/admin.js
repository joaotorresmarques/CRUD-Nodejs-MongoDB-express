const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Categoria')
const Categoria = mongoose.model("categorias")

require('../models/Postagens')
const Postagem = mongoose.model("postagens")

router.get('/', (req, res) => {
    Postagem.find().then((postagens)=>{
        res.render("admin/index",{postagens: postagens.map(post => post.toJSON())})
    })
})
//+++POSTAGENS+++

router.get('/postagens', (req, res) => {
    Postagem.find().populate("categoria").then((postagens) => {
        res.render("admin/postagens", { postagens: postagens.map(post => post.toJSON()) }) //{ postagens: postagens.map(post => post.toJSON())}
    })
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("admin/addpostagens", { categorias: categorias.map(category => category.toJSON()) })
        console.log(categorias)
    }).catch((err) => {
        console.log(err)
    })
})

router.post('/postagens/add/nova', (req, res) => {

    const novaPostagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }

    //ACTION DO FORM
    new Postagem(novaPostagem).save().then(() => {
        //req.flash("success_msg", "categoria criada com sucesso")
        console.log("Postagem cadastrada com sucesso")
        res.redirect('/admin')
    }).catch((err) => {
        //req.flash("error_msg", "ocorreu um erro em cadastrar")
        res.redirect("/admin")
        console.log("erro no form:  " + err)
    })
})

router.get("/postagens/edit/:id", (req, res) => {
    Postagem.findOne({ _id: req.params.id }).populate("categoria").lean().then((postagens) => {
        Categoria.find().lean().then((categorias) =>{
            res.render("admin/editpostagens", { postagem: postagens,categoria: categorias })
        })
    }).catch((err) => {
    })
})

router.get("/categorias/excluir/:id", (req, res) => {
    Categoria.findOneAndDelete({ _id: req.params.id }).then((categoria) => {
        req.flash("success_msg", "excluido")
        res.render("admin/categorias")
        //req.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Erro em excluir")
        res.render("admin/categorias")
    })
})

router.get("/postagens/excluir/:id", (req,res)=>{
    Postagem.findOneAndDelete({_id: req.params.id}).then((categoria)=>{
        res.render("admin/postagens")
    })
})


//+++CATEGORIAS+++

router.get('/categorias', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("admin/categorias", { categorias: categorias.map(category => category.toJSON()) })
    })
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategorias", { categoria: categoria })
        console.log(categoria)
    }).catch((err) => {
        req.flash("error_msg", "esta categoria nao existe")
        res.redirect("/admin/categorias")
    })
})

router.get("/categorias/excluir/:id", (req, res) => {
    Categoria.findOneAndDelete({ _id: req.params.id }).then((categoria) => {
        req.flash("success_msg", "excluido")
        res.render("admin/categorias")
        //req.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Erro em excluir")
        res.render("admin/categorias")
    })
})

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "alterado ok!")
            res.redirect("/admin/categorias")
        })
    }).catch((err) => {
        req.flash("error_msg", "Erro em editar")
        res.redirect("/admin/categorias")
    })
})

router.post('/categorias/add/nova', (req, res) => {

    //validação formulario de forma manual - existe bibliotecas que cuidam disso
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'nome invalido' })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: 'slug invalido' })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: 'nome da categoria muito pequena' })
    }

    //SE EXISTIR NO ARRAY ALGO, ENTAO CONTEM ALGUM ERRO ACIMA
    if (erros.length > 0) {
        res.render("admin/categorias", { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "categoria criada com sucesso")
            console.log("categoria cadastrada com sucesso")
            res.redirect('/admin')
        }).catch((err) => {
            req.flash("error_msg", "ocorreu um erro em cadastrar")
            res.redirect("admin/categorias")
            console.log("erro no form:  " + err)
        })
    }



})
module.exports = router