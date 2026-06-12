const Envios = require("../model/envios.model");

const EnviosController = {
  /**
   * Obtiene el listado histórico de todos los envíos
   */
  getAll: async (req, res) => {
    try {
      const envios = await Envios.find().sort({ createdAt: -1 });
      return res.status(200).json(envios);
    } catch (error) {
      console.error("Error al listar envíos:", error);
      return res.status(500).send("Error interno del servidor");
    }
  },

  /**
   * Busca el despacho asociado a una orden específica mediante su ID numérico
   */
  getByOrderId: async (req, res) => {
    try {
      const { orderId } = req.params;
      
      // Control preventivo: Si el parámetro NO es un número (es el hash de Mongo),
      // pasamos el control al siguiente validador o avisamos al cliente.
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "El ID de la orden debe ser un valor numérico válido." });
      }

      const envio = await Envios.findOne({ orderId: Number(orderId) });

      if (!envio) {
        return res.status(404).json({ error: `No se encontró ningún despacho asociado a la orden #${orderId}` });
      }

      return res.status(200).json(envio);
    } catch (error) {
      console.error("Error al buscar envío por ID de orden:", error);
      return res.status(500).send("Error interno del servidor");
    }
  },

  /**
   * Busca el despacho por el _id hexadecimal nativo de MongoDB
   */
  getByShippingId: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Buscamos directamente usando findById (más óptimo que findOne con _id)
      const envio = await Envios.findById(id);

      if (!envio) {
        return res.status(404).json({ error: `No se encontró ningún despacho asociado al id: #${id}` });
      }

      return res.status(200).json(envio);
    } catch (error) {
      console.error("Error al buscar envío por ID físico de MongoDB:", error);
      // Protegemos el servidor si envían un ID con formato de texto incorrecto
      if (error.name === "CastError") {
        return res.status(400).json({ message: "El ID de envío proporcionado no tiene un formato hexadecimal válido." });
      }
      return res.status(500).send("Error interno del servidor");
    }
  },

  /**
   * Genera un nuevo registro de despacho en MongoDB Atlas
   */
  create: async (req, res) => {
    try {
      const { order, formManualData } = req.body;

      if (!order || !order.id || !order.items || !order.createdAt) {
        return res.status(400).json({ 
          error: "Estructura de la orden inválida. Se requieren los datos del JSON de la orden." 
        });
      }

      if (!formManualData || !formManualData.recipientName || !formManualData.shippingAddress || !formManualData.shippingDistrict || !formManualData.shippingCity) {
        return res.status(400).json({ 
          error: "Faltan datos logísticos obligatorios del formulario (Nombre, Dirección, Comuna o Ciudad)." 
        });
      }

      const unidadesTotales = order.items.reduce((sum, item) => sum + item.quantity, 0);

      const nuevoEnvio = new Envios({
        orderId: order.id,
        totalProductsQuantity: unidadesTotales,
        orderCreatedAt: new Date(order.createdAt),
        recipientName: formManualData.recipientName.trim(),
        shippingAddress: formManualData.shippingAddress.trim(),
        shippingDistrict: formManualData.shippingDistrict.trim(),
        shippingCity: formManualData.shippingCity.trim(),
        shippingStatus: "PREPARING"
      });

      const envioGuardado = await nuevoEnvio.save();
      
      return res.status(201).json({
        message: "¡Registro de despacho creado y agendado con éxito!",
        data: envioGuardado
      });

    } catch (error) {
      console.error("Error al crear el envío:", error);
      if (error.code === 11000) {
        return res.status(400).json({ 
          error: `Ya existe un despacho registrado para la orden #${req.body?.order?.id}. No se puede duplicar.` 
        });
      }
      return res.status(500).send("Error interno del servidor");
    }
  },

  /**
   * Actualiza el estado logístico del envío
   */
  updateStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const estadosValidos = ["PREPARING", "IN_TRANSIT", "DELIVERED", "FAILED"];
      if (!status || !estadosValidos.includes(status)) {
        return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${estadosValidos.join(", ")}` });
      }

      const envioActualizado = await Envios.findOneAndUpdate(
        { orderId: Number(orderId) },
        { shippingStatus: status },
        { new: true }
      );

      if (!envioActualizado) {
        return res.status(404).json({ error: `No se pudo actualizar. No existe despacho para la orden #${orderId}` });
      }

      return res.status(200).json({
        message: "Estado de envío actualizado con éxito",
        data: envioActualizado
      });
    } catch (error) {
      console.error("Error al actualizar estado del envío:", error);
      return res.status(500).send("Error interno del servidor");
    }
  },

  /**
   * Eliminar un envío de forma atómica
   */
  destroy: async (req, res) => {
    try {
      const { id } = req.params;

      const envioEliminado = await Envios.findByIdAndDelete(id);

      if (!envioEliminado) {
        return res.status(404).json({ message: `¡Envío con ID ${id} no existe!` });
      }

      return res.status(200).json({ message: "¡Envío eliminado correctamente!" });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "El ID de envío proporcionado no tiene un formato válido." });
      }
      return res.status(500).json({ message: "Error interno del servidor al procesar la eliminación." });
    }
  }
};

module.exports = { EnviosController };