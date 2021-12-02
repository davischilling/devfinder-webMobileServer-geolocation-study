const Dev = require("../models/Dev");
const axios = require("axios");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

exports.devCreate = async (req, res) => {
  try {
    const { github_username, techs, longitude, latitude } = req.body;
    if (!github_username || !longitude || !latitude) {
      return res.status(400).json({ error: "Missing param" });
    } else if (techs.length === 0) {
      return res.status(400).json({ error: "Missing techs" });
    } else {
      const techsArray = parseStringAsArray(techs);
      const existingUsername = await Dev.findOne({ github_username });
      if (existingUsername) {
        return res.status(400).json({ error: "This user already exists" });
      }
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );
      let { avatar_url, bio, name, login, html_url } = response.data;
      !name ? (name = login) : null;
      const location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      const dev = await Dev.create({
        github_username,
        techs: techsArray,
        avatar_url,
        bio,
        name,
        location,
        html_url,
      });

      // Connections filter to emit info to the frontend using websockets
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "new-dev", dev);

      return res.json({ dev });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.devGetAll = async (req, res) => {
  try {
    const devs = await Dev.find();
    return res.status(200).json(devs);
  } catch (err) {
    console.log(err);
  }
};

exports.devGetByLocationAndTechs = async (req, res) => {
  try {
    const { longitude, latitude, techs } = req.query;
    let techsArray;
    if (techs && longitude && latitude) {
      techsArray = parseStringAsArray(techs);
      const devs = await Dev.find({
        techs: {
          $in: techsArray,
        },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 100000,
          },
        },
      });
      return res.status(200).json(devs);
    }
    return res.status(200).json([]);
  } catch (err) {
    console.log(err);
  }
};

exports.devGetById = async (req, res) => {
  try {
    const dev = await Dev.findById({ _id: req.params.id });
    !dev ? res.status(404).json({ Error: "Resource not found" }) : null;
    return res.status(200).json(dev);
  } catch (err) {
    console.log(err);
  }
};

exports.devUpdateById = async (req, res) => {
  try {
    const { _id, github_username, html_url } = req.body;
    if (_id || github_username || html_url) {
      return res.status(400).json({ error: "Wrong params to update" });
    } else {
      const dev = await Dev.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body
      );
      return res.status(200).json(dev);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.devDeleteById = async (req, res) => {
  try {
    await Dev.findOneAndRemove({
      _id: req.params.id,
    });
    return res.status(200).json({ message: "Dev removed" });
  } catch (err) {
    console.log(err);
  }
};
