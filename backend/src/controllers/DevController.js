const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;
  
    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
  
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray,
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev);

      return res.json(dev);
    }

    return res.json({ error: 'Este dev já está cadastrado' });
  },

  async update(req, res) {
    try {
      const { github_username } = req.params;
      
      if (req.body.github_username || req.body._id) {
        throw new Error('Você enviou informações que não podem ser alteradas.');
      }

      let techs = req.body.techs;

      if (techs) req.body.techs = parseStringAsArray(techs);

      const update = await Dev.updateOne({ github_username }, req.body);

      if (update.nModified === 0) {
        throw new Error('Não foi possível atualizar as informações.');
      }

      return res.send();
    } catch (err) {
      return res.status(400).send({ error: `${err}` });
    }
  },

  async destroy(req, res) {
    try {
      const { github_username } = req.params;
  
      const destroy = await Dev.deleteOne({ github_username });

      if (destroy.deletedCount === 0) {
        throw new Error('Dev não encontrado.');
      }

      return res.send();
    } catch (err) {
      return res.status(400).send({ error: `${err}` });
    }
  }
};
