const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    objective: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    targetAudience: {
      type: String,
      required: true,
    },
    isNewProject: {
      type: Boolean,
      required: true,
    },
    backgroundInfo: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
    },
    projectName: {
      type: String,
    },
    stakeHolders: {
      type: String,
    },
    services: {
      type: String,
    },
    competition: {
      type: String,
    },
    strengths: {
      type: String,
    },
    weaknesses: {
      type: String,
    },
    brandInfo: {
      type: String,
    },
    primaryContact: {
      type: String,
    },
  },
  { timeseries: true }
);

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;