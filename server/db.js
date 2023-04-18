const mongoose = require("mongoose")
module.exports = () => {

    //link do połączenia się z klastrem mongodb
    const CONNECTION_URL = 'mongodb+srv://student:student@cluster.pt0oz.mongodb.net/szkielety?retryWrites=true&w=majority';

    //próba połączenie się z bazą danych
    try {
        mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("Połączono z bazą danych")
    } catch (error) {
        console.log(error);
        console.log("Problem z połączeniem do bazy!")
    }
}
