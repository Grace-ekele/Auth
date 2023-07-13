require('./Config/config')
PORT = process.env.PORT
const app = require('./app')

app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)
});