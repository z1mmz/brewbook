const mongoose = require("mongoose");

const beanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roaster: {
      type: String,
      required: true,
    },
    process: {
      type: String,
    },
    variety: {
      type: String,
    },
    tastingNotes: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

beanSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Bean = mongoose.model("Bean", beanSchema);

module.exports = Bean;
