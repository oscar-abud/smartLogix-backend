const mongoose = require("mongoose");

const EnviosSchema = new mongoose.Schema(
  {
    // --- DATOS PROVENIENTES DE LA ORDEN (API JSON) ---
    orderId: { 
      type: Number, 
      required: true,
      unique: true
    },
    totalProductsQuantity: { 
      type: Number, 
      required: true
    },
    orderCreatedAt: { 
      type: Date, 
      required: true 
      // Almacena la fecha original en que el cliente creó la orden (2026-06-12T09:45:36.944Z)
    },

    // --- DATOS RECOLECTADOS MANUALMENTE EN EL MODAL ---
    recipientName: { 
      type: String, 
      required: true,
      trim: true
    },
    shippingAddress: { 
      type: String, 
      required: true,
      trim: true
    },
    shippingDistrict: { 
      type: String, 
      required: true,
      trim: true
    },
    shippingCity: { 
      type: String, 
      required: true,
      trim: true
    },

    // --- CONTROL INTERNO LOGÍSTICO DEL MICROSERVICIO ---
    shippingStatus: {
      type: String,
      enum: ["PREPARING", "IN_TRANSIT", "DELIVERED", "FAILED"],
      default: "PREPARING"
    }
  },
  {
    // Genera automáticamente los campos createdAt y updatedAt para saber cuándo se creó el registro del envío en MongoDB
    timestamps: true 
  }
);

const Envios = mongoose.model("Envios", EnviosSchema);

module.exports = Envios;