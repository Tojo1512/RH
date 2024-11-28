require("dotenv").config();

module.exports = {
  aiConfig: {
    baseUrl: process.env.OFFLINE_AI_URL,
    model: "gemma:2b",
    options: {
      temperature: 0.7,
      top_p: 0.9,
      num_predict: 150,
    },
  },
};
