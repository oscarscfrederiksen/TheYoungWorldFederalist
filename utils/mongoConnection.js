const mongoose = require("mongoose")
const { database_path } = require("./../config.json").meta

module.exports = async () => {
    await mongoose.connect(database_path, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose
}