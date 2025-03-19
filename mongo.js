const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}



const personSchema  = new mongoose.Schema({
  name: String,
  number: String,
})

const Person  = mongoose.model('Person', personSchema )


if(process.argv.length > 3 ){

    const name = process.argv[3]
    const number = process.argv[4]



    const person = new Person({
        name,
        number,
      })



      

person.save().then(result =>{
    console.log(`Added : ${name} , ${number}`)
    mongoose.connection.close()
})



}else{
    console.log('Full contact list')

    Person.find({})
        .then(result => {
          if (result.length > 0) {
            result.forEach(person => {
              console.log(`${person.name}: ${person.number}`);
            });
          } else {
            console.log('No contacts found.');
          }
          mongoose.connection.close()
    })

   
}


