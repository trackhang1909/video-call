const mongoose = require('mongoose');

let DatabaseSingleton = (function () {

    let instance;

    async function connect() {
        try {
            let result = await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            });
            console.log('MongoDB connected.');
            return result;
        }
        catch (error) {
            console.log('MongoDB not connected. Error: ' + error);
            return error;
        }
    }

    function createInstance() {
        return connect();
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports = function () {
    return DatabaseSingleton.getInstance();
};