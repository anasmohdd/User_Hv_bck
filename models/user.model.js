const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  avatar: { type: String, required: true },
  domain: { type: String, required: true },
  available: { type: Boolean, required: true },
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;

// Function to add a new user
// async function addUser(newUser) {
//   try {
//     // Find the highest ID value
//     const highestIdUser = await User.findOne().sort({ id: -1 });
//     let highestId = 0;
//     if (highestIdUser) {
//       highestId = highestIdUser.id;
//     }

//     // Increment the highest ID value to generate new ID
//     newUser.id = highestId + 1;

//     // Create and save the new user
//     const user = new User(newUser);
//     await user.save();
//     console.log("New user created successfully.");
//   } catch (error) {
//     console.error("Error creating new user:", error);
//   }
// }

// Example usage:
// const newUser = {
//   id: 0, // This will be overwritten with the incremented ID before saving
//   first_name: "New",
//   last_name: "User",
//   email: "newuser@example.com",
//   gender: "Male",
//   avatar: "https://robohash.org/newuser.png?size=50x50&set=set1",
//   domain: "IT",
//   available: true,
// };

// addUser(newUser);
