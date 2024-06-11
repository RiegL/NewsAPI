const express = require("express");//importa o express
const bcrypt = require("bcrypt");//importa o bcrypt
const jwt = require("jsonwebtoken");//importa o jwt
const cors = require("cors");//importa o cors
const usuarioModel = require("./src/module/usuario/usuario.model");
const noticiaModel = require("./src/module/noticia/noticia.model");
const app = express();//exporta o express para o app.js
app.use(express.json());//exporta o express.json para o app.js
app.use(cors());//exporta o cors para o app.js

app.post("/login", async (req, res) => {
  if (!req.body.email) {
    //verifica se o campo email esta preenchido
    return res.status(400).json({ message: "O campo email é obrigatório" });
  }
  if (!req.body.senha) {
    //verifica se o campo senha esta preenchido
    return res.status(400).send({ message: "O campo senha é obrigatório" });
  }

  const usuarioExistente = await usuarioModel.findOne({email: req.body.email,}); //verifica se o email esta cadastrado no banco de dados

  if (!usuarioExistente) {
    //verifica se o email esta cadastrado no banco de dados
    return res.status(400).json({ message: "Usuário não encontrado" }); //se o email nao estiver cadastrado no banco de dados
  }

  const senhaVerificada = bcrypt.compareSync(req.body.senha,usuarioExistente.senha); //verifica se a senha digitada esta correta

  if (!senhaVerificada) {
    //verifica se a senha digitada esta correta
    return res.status(400).json({ message: "E-mail ou senha incorretos" }); //se a senha digitada nao estiver correta
  }

  const token = jwt.sign({_id: usuarioExistente._id}, "dnc");//
  
  res.status(200).json({ message: "Login realizado com sucesso",token });
});

app.get("/usuarios", async (req, res) => {
  //busca todos os usuarios
  const usuarios = await usuarioModel.find({});
  return res.status(200).json([usuarios]); //retorna os usuarios
});

app.post("/usuarios", async (req, res) => {
  //cria um usuario no banco de dados
  if (!req.body.email) {
    //verifica se o campo email esta preenchido
    return res.status(400).json({ message: "O campo email é obrigatório" });
  }
  if (!req.body.senha) {
    //verifica se o campo senha esta preenchido
    return res.status(400).send({ message: "O campo senha é obrigatório" });
  }

  //TODO verificar se os usuarios estao na base de dados
  const usuarioExistente = await usuarioModel.find({ email: req.body.email }); //verifica se o email ja esta cadastrado no banco de dados

  if (usuarioExistente.length) {
    return res.status(400).json({ message: "O email já está cadastrado" }); //se o email ja esta cadastrado no banco de dados
  }

  const senhaCriptocrafada = bcrypt.hashSync(req.body.senha, 10); //criptografa a senha
  const usuario = await usuarioModel.create({
    //cria um usuario no banco de dados
    nome: req.body.nome, //cria o nome do usuario
    email: req.body.email, //cria o email do usuario
    senha: senhaCriptocrafada, //cria a senha criptografada
  });

  return res.status(201).json(usuario);
});

app.get("/noticias", async (req, res) => {
  let filtroCategoria = {};
  if (req.query.categoria) {
    filtroCategoria = { categoria: req.query.categoria };
  }
  //busca todas as noticias no banco de dados
  const noticias = await noticiaModel.find(filtroCategoria); //busca todas as noticias
  return res.status(200).json([noticias]); //retorna as noticias
});

app.post("/noticias", async (req, res) => {
  if(!req.body.titulo){
    return res.status(400).json({ message: "O campo titulo é obrigatório" });
  }
  if(!req.body.img){
    return res.status(400).json({ message: "O campo imagem é obrigatório" });
  }
  if(!req.body.texto){
    return res.status(400).json({ message: "O campo texto é obrigatório" });
  }
  if(!req.body.categoria){
    return res.status(400).json({ message: "O campo categoria é obrigatório" });
  }
 
  const noticia = await noticiaModel.create({
    titulo: req.body.titulo,
    img: req.body.img,
    texto: req.body.texto,
    categoria: req.body.categoria,
  })
  return res.status(201).json([noticia]);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
