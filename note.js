const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

// Conectar a la base de datos


const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error.message))

// Definir esquema y modelo de contacto
const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: [3, 'Name must be at least 3 characters long'],
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Expresión regular para validar el número de teléfono
          return /^\d{2,3}-\d{6,}$/.test(v);
        },
        message: 'Invalid phone number format. The correct format is XX-XXXXXXX or XXX-XXXXXXXX.',
      },
    },
  });
  
  // Crear el modelo de la persona
  const Person = mongoose.model('Person', personSchema)
  

module.exports = Person