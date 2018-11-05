"use strict";

const mongoose = require("mongoose");

const contributionsSchema = mongoose.Schema({
  amount: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

contributionsSchema.methods.serialize = function() {
  return {
    id: this._id,
    amount: this.amount
  }
};

module.exports = mongoose.model('Contribution', contributionsSchema);
