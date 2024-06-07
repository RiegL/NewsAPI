const mongoose = require("../../config/mongo.js");//importa o mongoose
const { Schema } = mongoose;//importa o Schema do mongoose

const noticiaSchema = new Schema({
  titulo: String, 
  img : String,
  texto: String,
},
{
    timestamps: true,
}
);

const NoticiaModel = mongoose.model('noticias', noticiaSchema);//exporta o noticiaSchema para o noticia.model.js

module.exports = NoticiaModel;