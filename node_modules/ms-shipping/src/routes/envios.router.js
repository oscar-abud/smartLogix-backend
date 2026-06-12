const express = require("express");
const router = express.Router();
const { EnviosController } = require("../controller/envios.controller");

// Definición de endpoints mapeados al controlador estructurado
router.get("/", EnviosController.getAll);
router.get("/order/:orderId", EnviosController.getByOrderId);
router.get("/id/:id", EnviosController.getByShippingId);
router.post("/", EnviosController.create);
router.patch("/:orderId/status", EnviosController.updateStatus);
router.delete("/:id", EnviosController.destroy);

module.exports = router;