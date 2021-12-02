const {
  devCreate,
  devGetByLocationAndTechs,
  devGetById,
  devGetAll,
  devUpdateById,
  devDeleteById,
} = require("./controllers/devCtrl");
const { Router } = require("express");
const routes = Router();

routes.post("/devs", devCreate);
routes.get("/devs/all", devGetAll);
routes.get("/devs", devGetByLocationAndTechs);
routes.get("/devs/:id", devGetById);
routes.patch("/devs/:id", devUpdateById);
routes.delete("/devs/:id", devDeleteById);

module.exports = routes;
