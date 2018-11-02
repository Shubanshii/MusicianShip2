"use strict";

const mongoose = require("mongoose");

const campaignSchema = mongoose.Schema({
  artist: String,
  title: String,
  description: String,
  files: String,
  financialGoal: Number,
  contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {type: String, default: 'current'},
  createdAt: { type: Date, default: Date.now }
});

campaignSchema.pre('find', function(next) {
  this.populate('contributions');
  next();
});

campaignSchema.pre('findOne', function(next) {
  this.populate('contributions');
  next();
});

campaignSchema.methods.serialize = function() {
  return {
    id: this._id,
    artist: this.artist,
    title: this.title,
    description: this.description,
    files: this.files,
    financialGoal: this.financialGoal,
    contributions: this.contributions,
    user: this.user,
    status: this.status,
    createdAt: this.createdAt
  }
}

module.exports = mongoose.model('Campaign', campaignSchema);
