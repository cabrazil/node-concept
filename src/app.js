const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { response } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // Lista os repositórios
  return response.json(repositories);  
});

app.post("/repositories", (request, response) => {
  // Cria um repositório com likes = 0
  const { title, url, techs} = request.body;

  const repositoy = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repositoy);
  return response.json(repositoy);
});

app.put("/repositories/:id", (request, response) => {
  // Obter o ID e demais campos
  const { id } = request.params;
  const { title, url, techs } = request.body;

  // Encontrar o respositório solicitado
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  // Se não encontrar, exibe status
  if (repoIndex < 0) {
        return response.status(400).send();
  }

  // Atualiza repositório, mas mantém valor original de likes
  const likes = repositories[repoIndex].likes;
  const repository = {
      id,
      title,
      url,
      techs,
      likes
  };

  repositories[repoIndex] = repository;
  return response.json(repository);

  // Devolver status de sucesso
  return response.status(204).send();

});

app.delete("/repositories/:id", (request, response) => {
  // Obter o ID
  const { id } = request.params;

  // Encontrar o respositório solicitado
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  // Se não encontrar, exibe status
  if (repoIndex < 0) {
        return response.status(400).send();
  }

  // Excluir o repositório encontrado
  repositories.splice(repoIndex, 1);

  // Devolver status de sucesso
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  // Obter o Id
  const { id } = request.params;
  
  // Encontrar o repositório para like
  const repository = repositories.find(repository => repository.id === id);

  // Se não encontrar, exibe status
  if (!repository) {
        return response.status(400).send();
  }

  // Adiciona like
  repository.likes++;
  return response.json(repository);

});

module.exports = app;
