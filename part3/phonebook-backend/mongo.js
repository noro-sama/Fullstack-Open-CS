const mongoose = require("mongoose");
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://chudo:${password}@cluster0.d4efefb.mongodb.net/phoneBook?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// const contact = new Contact({
//   name: name,
//   number: number,
// });

// contact.save().then((result) => {
//   console.log(`added ${name} number ${number} to phonebook`);
//   mongoose.connection.close();
// });

Contact.find({}).then((result) => {
  console.log("phonebook:");
  result.forEach((person) => {
    console.log(person.name, person.number);
  });
  mongoose.connection.close();
});
