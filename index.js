const express = require('express');
var morgan = require('morgan')
const app = express();



console.log("Morgan middleware is active!");
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.json());

const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]




app.get('/api/persons',(req, res) =>{
    res.json(persons);
});


app.get('/info',(req, res) =>{
    const totalPerson  = persons.length;
    const currentTime = new Date();



    res.send(`<p>Phonebook has info for ${totalPerson} people</p>
        
        <P>${currentTime}</P>`

                
    )
})


app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    res.json(person)
})



app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = persons.findIndex(person => person.id === id);

  
  if (index === -1) {
      return res.status(404).json({ error: "Person not found" });
  }

  
  persons.splice(index, 1);

  
  res.status(204).end();
});

  

  app.post('/api/persons',(req, res) =>{
    const {name, number} = req.body

    if(!name || !number){
      return res.status(400).json({error:"Name and number are required"})
    }

    if(persons.some(person => person.name === name)){
      return res.status(400).json({error:"Name must be unique"})
    }


    const id = Math.floor(Math.random() * 1000)

    const newPerson = {id, name, number}

    persons.push(newPerson);
    res.status(201).json(newPerson);
    
  });


  const PORT = process.env.PORT || 3002;

app.listen(PORT, () =>{
    console.log(`server runing in ${PORT}`);
});



