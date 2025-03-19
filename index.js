const express = require('express')
const morgan = require('morgan')
const path = require('path')
const Person = require('./note') // Importar modelo de MongoDB

const app = express()

// Middleware
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.static(path.join(__dirname, 'dist')))






// Servir el frontend
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));

// Ruta para enviar el index.html al acceder a la raíz
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})



// **1️⃣ Información general**
app.get('/info', (req, res, next) => {
  Person.countDocuments()
    .then(totalPersons => {
      const currentTime = new Date()
      res.send(`<p>Phonebook has info for ${totalPersons} people</p><p>${currentTime}</p>`)
    })
    .catch(error => next(error))
})

// **2️⃣ Obtener un contacto por ID**
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).json({ error: 'Person not found' })
    })
    .catch(error => next(error)) // Manejo de errores centralizado
})

// **3️⃣ Eliminar un contacto por ID**
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) res.status(204).end()
      else res.status(404).json({ error: 'Person not found' })
    })
    .catch(error => next(error)) 
})

// **4️⃣ Agregar un nuevo contacto**
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' })
  }

  // Buscar si la persona ya existe en la base de datos
  Person.findOne({ name })
    .then(existingPerson => {
      if (existingPerson) {
        // Si ya existe, actualizar su número con PUT
        Person.findByIdAndUpdate(
          existingPerson._id,
          { number },
          { new: true, runValidators: true }
        )
          .then(updatedPerson => res.json(updatedPerson))
          .catch(error => next(error))
      } else {
        // Si no existe, crear un nuevo contacto
        const person = new Person({ name, number })
        person.save()
          .then(savedPerson => res.status(201).json(savedPerson))
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

// **5️⃣ Actualizar un contacto existente (PUT)**
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' })
  }

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})


app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message }) // Enviar el mensaje de error de validación
  }
  next(error) // Si no es un error de validación, lo pasamos al siguiente middleware
})

// **6️⃣ Middleware de "Unknown Endpoint" (Debe ir al final de las rutas)**
app.use((req, res) => {
  res.status(404).json({ error: 'Unknown endpoint' })
})

// **7️⃣ Middleware para manejar errores**
app.use((error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted ID' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  res.status(500).json({ error: 'Internal Server Error' })
})

// **8️⃣ Servir el frontend en producción**
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// **9️⃣ Iniciar el servidor**
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
