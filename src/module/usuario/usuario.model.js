const mongoose = require("../../config/mongo.js")//importa o mongoose
const { Schema } = mongoose;//


const usuarioSchema = new Schema({
  nome: String, 
  email: String,
  senha: String,
},
{
    timestamps: true,
}
);

const UsuarioModel = mongoose.model('usuarios', usuarioSchema);//exporta o usuarioSchema para o usuario.model.js

module.exports = UsuarioModel;