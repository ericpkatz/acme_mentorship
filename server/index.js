const app = require('./app');
const port = process.env.PORT || 3000;
const db = require('./db');

if(process.env.SEED){
  db.seed()
    .then(()=> console.log('seeded'))
    .catch(ex => {
      throw Error(ex)
    });

}

app.listen(port, ()=> console.log(`listening on port ${port}`));
