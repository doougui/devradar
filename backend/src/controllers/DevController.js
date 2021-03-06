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

      return res
        .status(201)
        .json({ dev, message: 'Dev cadastrado com sucesso.' });
    }

    return res
      .status(409)
      .json({ message: 'Este dev já está cadastrado.' });
  },

  async update(req, res) {
    const { github_username } = req.params;
  
    let { name, bio, techs, latitude, longitude } = req.body;

    if (techs) techs = parseStringAsArray(techs);

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return res
        .status(400)
        .json({ message: 'Informe uma localização válida.' });
    }

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    const newValues = { name, bio, techs, location };

    for (value of Object.values(newValues)) {
      if (!value.coordinates && !value.length) {
        return res
          .status(400)
          .json({ message: 'Preencha todos os campos para continuar.' });
      }
    }
    
    const dev = await Dev.findOneAndUpdate(
      { github_username }, 
      newValues,
      { new: true },
    );

    if (!dev || dev.nModified === 0) {
      return res
        .status(400)
        .json({ message: 'Não foi possível editar este dev.' });
    }

    return res
      .status(200)
      .json({ dev, message: 'Dev editado com sucesso.' });
  },

  async destroy(req, res) {
    const { github_username } = req.params;

    const destroy = await Dev.deleteOne({ github_username });

    if (destroy.deletedCount === 0) {
      return res
        .status(400)
        .json({ message: 'Não foi possível deletar este dev.' });
    }

    return res.json({ message: 'Dev excluido com sucesso.' });
  }
};
