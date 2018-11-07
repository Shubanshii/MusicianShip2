"use strict";

const mongoose = require("mongoose");

const contributionsSchema = mongoose.Schema({
  amount: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

contributionsSchema.methods.serialize = function() {
  return {
    id: this._id,
    amount: this.amount,
    user: this.user
  }
};

module.exports = mongoose.model('Contribution', contributionsSchema);
