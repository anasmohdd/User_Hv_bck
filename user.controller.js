const User = require("./models/user.model.js");

// const getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
//     const limit = 20; // Number of users per page
//     const startIndex = (page - 1) * limit; // Start index of users for the current page

//     const users = await User.find().skip(startIndex).limit(limit);
//     const totalUsers = await User.countDocuments();

//     const totalPages = Math.ceil(totalUsers / limit);

//     res.status(200).json({ users, totalPages });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const startIndex = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query.$or = [
        { first_name: { $regex: req.query.search, $options: "i" } },
        { last_name: { $regex: req.query.search, $options: "i" } },
      ];
    }
    if (req.query.domain) {
      const domains = req.query.domain
        .split(",")
        .filter((domain) => domain.trim() !== "");
      query.domain = { $in: domains };
    }
    if (req.query.gender) {
      query.gender = { $in: req.query.gender.split(",") };
    }
    if (req.query.available !== undefined) {
      query.available = req.query.available === "true";
    }
    if (req.query.unavailable !== undefined) {
      query.available = req.query.unavailable === "false";
    }

    const users = await User.find(query).skip(startIndex).limit(limit);
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({ users, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 20;
//     const startIndex = (page - 1) * limit;

//     let query = {};
//     if (req.query.search) {
//       query.$or = [
//         { first_name: { $regex: req.query.search, $options: "i" } },
//         { last_name: { $regex: req.query.search, $options: "i" } },
//       ];
//     }
//     if (req.query.domain) {
//       const domains = req.query.domain
//         .split(",")
//         .filter((domain) => domain.trim() !== "");
//       query.domain = { $in: domains };
//     }
//     if (req.query.gender) {
//       query.gender = { $in: req.query.gender.split(",") };
//     }
//     if (req.query.available) {
//       // Add condition to include "available" filter
//       query.available = req.query.available === "true";
//     }

//     const users = await User.find(query).skip(startIndex).limit(limit);
//     const totalUsers = await User.countDocuments(query);
//     const totalPages = Math.ceil(totalUsers / limit);

//     res.status(200).json({ users, totalPages });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
//     const limit = 20; // Number of users per page
//     const startIndex = (page - 1) * limit; // Start index of users for the current page

//     let users;
//     let totalUsers;

//     // If there's a search query, filter users by first name or last name
//     if (req.query.search) {
//       users = await User.find({
//         $or: [
//           { first_name: { $regex: req.query.search, $options: "i" } },
//           { last_name: { $regex: req.query.search, $options: "i" } },
//         ],
//       })
//         .skip(startIndex)
//         .limit(limit);
//       totalUsers = await User.countDocuments({
//         $or: [
//           { first_name: { $regex: req.query.search, $options: "i" } },
//           { last_name: { $regex: req.query.search, $options: "i" } },
//         ],
//       });
//     } else {
//       // If no search query, get all users
//       users = await User.find().skip(startIndex).limit(limit);
//       totalUsers = await User.countDocuments();
//     }

//     const totalPages = Math.ceil(totalUsers / limit);

//     res.status(200).json({ users, totalPages });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     // console.log(users);
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    // Get the highest id from existing users
    const highestIdUser = await User.findOne().sort({ id: -1 });
    let newId = 1; // Default id for the first user

    if (highestIdUser) {
      newId = highestIdUser.id + 1;
    }

    // Create a new user with incremented id
    const userData = { ...req.body, id: newId };
    const user = new User(userData);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const createUser = async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

// const addUser = async (newUser) => {
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
// };

// module.exports = addUser;

// const User = require("./models/user.model.js");

// const add = () => {
//   const jsonData = [
//     {
//       id: 1,
//       first_name: "Anet",
//       last_name: "Doe",
//       email: "adoe0@comcast.net",
//       gender: "Female",
//       avatar: "https://robohash.org/sintessequaerat.png?size=50x50&set=set1",
//       domain: "Sales",
//       available: false,
//     },
//     {
//       id: 2,
//       first_name: "Honoria",
//       last_name: "Caughte",
//       email: "hcaughte1@google.com.br",
//       gender: "Female",
//       avatar:
//         "https://robohash.org/temporibusporrolaboriosam.png?size=50x50&set=set1",
//       domain: "Finance",
//       available: true,
//     },
//     {
//       id: 3,
//       first_name: "Wiley",
//       last_name: "Boarder",
//       email: "wboarder2@xing.com",
//       gender: "Male",
//       avatar:
//         "https://robohash.org/laboriosamdolorepossimus.png?size=50x50&set=set1",
//       domain: "Marketing",
//       available: false,
//     },
//   ];
//   return User.insertMany(jsonData)
//     .then(() => {
//       console.log("Data inserted successfully");
//       mongoose.connection.close();
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// };
