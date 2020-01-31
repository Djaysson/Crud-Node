const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

//Function middleware que checa se o projeto existe

function checkprojectExiste(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

//Function middleware que dá log no número de requisições

function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

//Retorna todos os projetos

server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Cadastro do novo project.

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

//Altera o título do projeto com o id presente nos parâmetros da rota.

server.put("/projects/:id", checkprojectExiste, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Deleta o projeto associado ao id presente nos parâmetros da rota.

server.delete("/projects/:id", checkprojectExiste, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//Adiciona uma nova tarefa no projeto escolhido via id;
server.post("/projects/:id/tasks", checkprojectExiste, (req, res) => {
  const { id } = req.params;

  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3333);
