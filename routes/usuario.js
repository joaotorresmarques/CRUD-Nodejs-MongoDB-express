const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require('bcryptjs')

router.get("/registro",(req,res)=>{
  res.render("usuarios/registro")
})

router.post("/registro/add", (req,res)=>{
  const novoUsuario = new Usuario({
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha
  })

  //encriptar a senha
  bcrypt.genSalt(10,(error,salt)=>{
    bcrypt.hash(novoUsuario.senha,salt,(error,hash) => {
      if(error){
        console.log('encriptar senha: '+error)
        res.redirect("/")
      }

      novoUsuario.senha = hash

      novoUsuario.save().then(()=>{
        console.log("user criado com sucesso")
        res.redirect("/")
      })
    })
  })
})



module.exports = router