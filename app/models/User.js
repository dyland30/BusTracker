// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        email: String,
        password: String,
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    idOrganizacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizacion'
    },
    nombres: String,
    docId: String,
    direccion: [String],
    rol: {
        type: String,
        default: 'user'
    }, //  user,companyAdmin, sysadmin
    estado: {
        type: String,
        default: 'A'
    }, // A -> Activo, E -> Eliminado
    fch_modificado: {
        type: Date,
        default: Date.now
    },
    usuarioModificador:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
