exports = module.exports = function(app, mongoose) {

    var periodoPlanSchema = new mongoose.Schema({
        plan : {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Plan'
        },
        organizacion: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Organizacion'
        },
        fch_inicio: {
          type: Date,
          default : Date.now
        },
        fch_fin: {
          type: Date
        }

    });
    mongoose.model('PeriodoPlan', periodoPlanSchema);

};
