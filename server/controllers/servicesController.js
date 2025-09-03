const db = require("../config/db");

const registerService = async (req, res) => {
  const { name, description, price, duration, status, subscription_type, business_id } =
    req.body;

  try {
    if (
      !business_id ||
      !name ||
      !price ||
      !duration ||
      !status ||
      !subscription_type
    ) {
      return res.status(400).json({ error: "Missing required field." });
    }
    const [existingService] = await db.query(
      `SELECT id FROM services WHERE business_id = ? AND service_name = ?`,
      [business_id, name]
    );
    if (existingService.length > 0) {
      return res
        .status(500)
        .json({ error: "Service already exists for this business." });
    }
    const [result] = await db.query(
      `INSERT INTO  services (business_id,service_name,description,price,duration,status,subscription_type)
            VALUE (?, ?, ?, ?, ?, ?, ?)`,
      [
        business_id,
        name,
        description || null,
        price,
        duration,
        status,
        subscription_type,
      ]
    );
    return res
      .status(201)
      .json({ message: "Service registered successfully !" });
  } catch (error) {
    console.error("Error registering service:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
const getServices= async(req,res) =>{
    const { businessId } = req.params;
      if (!businessId) {
      return res.status(400).json({ error: "No valid business IDs provided" });
    }
    try {
    
        const [services]= await db.query("SELECT * FROM services WHERE business_id = ?",[businessId]);

        if(services.length ===0){
            return res.status(400).json({ error:"No serices found"});
        }
        return res.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        return res.status(500).json({error: "Server error"});
        
    }

}

const updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration, status, subscription_type } =
    req.body;
  try {
    const [service] = await db.query(`SELECT * FROM services WHERE id= ?`, [
      id
    ]);
    if (service.length === 0) {
      return res.status(404).json({
        error: "Service not found",
      });
    }
    if (name) {
      const [duplicate] = await db.query(
        `SELECT id FROM services WHERE business_id = ? AND service_name = ? AND id !=? `,
        [service[0].business_id, name, id]
      );
      if (duplicate.length > 0) {
        return res
          .status(409)
          .json({ error: "Another services with this name already exists." });
      }
    }
    await db.query(
      `UPDATE services SET service_name = COALESCE(?, service_name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           duration = COALESCE(?, duration),
           status = COALESCE(?, status),
           subscription_type = COALESCE(?, subscription_type),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, price, duration, status, subscription_type, id]
    );
    return res.json({ message: "Service updated successfully" });
  } catch (error) {
    console.error("Error updating service:", error);
    return res
      .status(500)
      .json({ error: "Server error while updating service" });
  }
};


const deleteServices =async(req,res) =>{
    const { id } = req.params;

  try {
    const [service] = await db.query(`SELECT * FROM services WHERE id = ?`, [id]);
    if (service.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    await db.query(`DELETE FROM services WHERE id = ?`, [id]);
    return res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ error: "Server error while deleting service" });
  }
}
module.exports = { registerService, getServices, updateService,deleteServices };
