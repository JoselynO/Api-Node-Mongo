const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect('mongodb://admin:admin123@mongo-db:27017/despliegue?authSource=admin',{
});

const nombreSchema = new mongoose.Schema({
    nombre: String,
});

const Nombre = mongoose.model('Nombre', nombreSchema);

app.use(express.static("web"));

app.post('/guardarNombre', async (req, res) => {
    try {
        const {nombre} = req.body;
        const nuevoNombre = new Nombre({ nombre });
        await nuevoNombre.save();
        res.send("Se ha guardado el nombre " + nuevoNombre.nombre);
    } catch (error) {
        res.status(500).send('Error al guardar el nombre en la base de datos.');
    }
});

app.get('/recuperarNombre', async (req, res) =>{
    try{
        const nombreABuscar = req.query.nombreEncontrar;
        const nombreEncontrado = await Nombre.findOne({nombre : nombreABuscar});

        if(nombreEncontrado != undefined){
            res.send(nombreEncontrado);
        } else {
            res.send("El nombre " + nombreABuscar + " no esta registrado");
        }
    }catch(error){
        res.status(500).send("Error al intentar recuperar el nombre de la base de datos.")
    }
});

app.listen(port, () => {
    console.log("Escuchando en puerto : " + port);
});



