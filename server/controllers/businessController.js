const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const businessRegistration = async (req, res) => {
  const {
    business_name,
    email,
    phone,
    business_type,
    city,
    owner_name,
    owner_email,
    owner_phone,
    password,
    user_role,
  } = req.body;

  try {
    const [existingBusiness] = await db.query(
      `SELECT id FROM businesses WHERE business_name = ?  AND city = ? OR email = ? OR phone = ? `,
      [business_name, city, email, phone]
    );
    if (existingBusiness.length > 0) {
      return res.status(400).json({ message: "Business already registered" });
    }
    let owner_id;
    const [existingUser] = await db.query(
      `SELECT id FROM users WHERE email = ?`,
      [owner_email]
    );
    if (existingUser.length > 0) {
      // reuse the same user
      owner_id = existingUser[0].id;
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const [userResult] = await db.query(
        `INSERT INTO users (name,email,phone,password,role) VALUES (?, ?, ?, ?, ?)`,
        [owner_name, owner_email, owner_phone, passwordHash, user_role]
      );
      owner_id = userResult.insertId;
    }
    await db.query(
      `INSERT INTO businesses (business_name,email,phone,business_type,city,owner_id) VALUES(?, ?, ?, ?, ?, ?)`,
      [business_name, email, phone, business_type, city, owner_id]
    );

    res.status(201).json({
      message: "Business registered successfully",
      owner_id: owner_id,
    });
  } catch (error) {
    console.error("Error creating business with owner:", error);
    res.status(500).json({ error: "Failed to create business and owner" });
  }
};

const fetchBusiness = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*,
            u.id AS owner_id,
            u.name AS owner_name,
            u.email AS owner_email,
            u.phone AS  owner_phone
            FROM businesses b
            JOIN users u ON b.owner_id =u.id
            `
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching buiness details info:", error);
    res.status(500).json({ message: "Failed to fetch businesses" });
  }
};
const adminUpdateBusiness = async (req, res) => {
  const businessId = req.params.id;
  const {
    business_name,
    email,
    phone,
    business_type,
    city,
    owner_name,
    owner_email,
    owner_phone,
    password,
    user_role,
    is_active,
    is_verified,
  } = req.body;

  try {
    // Fetch business to get owner_id
    const [existing] = await db.query(`SELECT * FROM businesses WHERE id = ?`, [
      businessId,
    ]);
    if (!existing.length) {
      return res.status(404).json({ message: "Business not found" });
    }
    const owner_id = existing[0].owner_id;

    // --- Update Business Table ---
    const businessFields = [];
    const businessValues = [];
    if (business_name) {
      businessFields.push("business_name = ?");
      businessValues.push(business_name);
    }
    if (email) {
      businessFields.push("email = ?");
      businessValues.push(email);
    }
    if (phone) {
      businessFields.push("phone = ?");
      businessValues.push(phone);
    }
    if (business_type) {
      businessFields.push("business_type = ?");
      businessValues.push(business_type);
    }
    if (city) {
      businessFields.push("city = ?");
      businessValues.push(city);
    }
    if (typeof is_active !== "undefined") {
      businessFields.push("is_active = ?");
      businessValues.push(is_active);
    }
    if (typeof is_verified !== "undefined") {
      businessFields.push("is_verified = ?");
      businessValues.push(is_verified);
    }

    if (businessFields.length > 0) {
      businessValues.push(businessId);
      const sql = `UPDATE businesses SET ${businessFields.join(
        ", "
      )} WHERE id = ?`;
      await db.query(sql, businessValues);
    }

    // --- Update Users Table (Owner) ---
    const userFields = [];
    const userValues = [];
    if (owner_name) {
      userFields.push("name = ?");
      userValues.push(owner_name);
    }
    if (owner_email) {
      userFields.push("email = ?");
      userValues.push(owner_email);
    }
    if (owner_phone) {
      userFields.push("phone = ?");
      userValues.push(owner_phone);
    }
    if (user_role) {
      userFields.push("role = ?");
      userValues.push(user_role);
    }
    if (password && password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userFields.push("password = ?");
      userValues.push(hashedPassword);
    }

    if (userFields.length > 0) {
      userValues.push(owner_id);
      const sqlUser = `UPDATE users SET ${userFields.join(", ")} WHERE id = ?`;
      await db.query(sqlUser, userValues);
    }

    return res.json({ message: "Business and owner updated successfully" });
  } catch (error) {
    console.error("Error updating business:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//business owner
const ownerFetchAllBusinesses = async (req, res) => {
  const userId = req.params.id;
  const owner_id = userId;
  try {
    const [rows] = await db.query(
      `SELECT * FROM businesses WHERE owner_id = ?`,
      [owner_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Failed tofetch businesses:", error);
    req.status(500).json({
      message: "Falied to fetch the businesses registered to the owner",
    });
  }
};
const getBusinessById = async (req, res) => {
  const businessId = req.params.businessId;
  try {
    const [business] = await db.query(
      `
      SELECT * FROM businesses WHERE id = ?`,
      [businessId]
    );
    if (business.length === 0) {
      return res.status(404).json({ message: "No business found" });
    }
    const [hours] = await db.query(
      `SELECT id, day_of_week, open_time, close_time FROM business_hours WHERE business_id = ? 
      ORDER BY FIELD (day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')`,
      [businessId]
    );
    res.status(200).json({
            ...business[0],
      hours,
    });
  } catch (error) {
    console.error("Failed to fetch business:", error);
    res.status(500).json({ message: "Failed to fetch the business" });
  }
};
const ownerUpdateBusiness = async (req, res) => {
  const businessId = req.params.businessId;

  const {
    business_name,
    email,
    phone,
    city,
    description,
    license_number,
    location,
    logo,
    tax_number,
    business_gallery,
  } = req.body;

  try {
    const [existing] = await db.query(`SELECT * FROM businesses WHERE id = ?`, [
      businessId,
    ]);
    if (!existing.length) {
      return res.status(404).json({ message: "Business not found" });
    }
    const [result] = await db.query(
      `UPDATE businesses 
       SET business_name = ?, email = ?, phone = ?, city = ?, 
           description = ?, license_number = ?, location = ?, logo = ?, 
           tax_number = ?, business_gallery = ? 
       WHERE id = ?`,
      [
        business_name,
        email,
        phone,
        city,
        description,
        license_number,
        location,
        logo,
        tax_number,
        business_gallery,
        businessId,
      ]
    );
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "No changes were made to the business profile" });
    }

    res.status(200).json({ message: "Business updated successfully" });
  } catch (error) {
    console.error("Failed to update business profile:", error);
    res.status(500).json({ message: "Falied to Update the business profile." });
  }
};
//business hours
const busines_hours= async(req,res)=>{
const {businessId} = req.params;
const {hours} = req.body;

if(!Array.isArray(hours) || hours.length ===0){
  return res.status(400).json({message:"Invalid hours payload"});
}
try {
  await db.query("DELETE FROM business_hours WHERE business_id = ?",[businessId])

  //insert new rows
  const values = hours.map((h)=>[
    businessId,
    h.day_of_week,
    h.open_time,
    h.close_time,
    h.is_closed ? 1 : 0,
  ]);
  await db.query(
         `INSERT INTO business_hours (business_id, day_of_week, open_time, close_time, is_closed)
       VALUES ?`,
      [values]
  );
  res.json({message:"Business hours updated successfully"});
} catch (error) {
  console.error("Error updating the business hours:", error);
  res.status(500).json({
    message:"Failed to update business hours..."
    });
  
}

}

//Customer fetching businesses
const getAllBusiness = async(req,res)=>{
  try {
    const [businesses] = await db.query(
      `SELECT b.*,
      AVG (r.rating) as rating,
      COUNT (r.id) as review_count,
      JSON_ARRAYAGG(
      JSON_OBJECT(
      'id', s.id,
      'service_name', s.service_name,
      'price', s.price,
      'duration', s.duration
      )
      ) as services
       FROM businesses b
       LEFT JOIN services s ON b.id =  s.business_id
       LEFT JOIN reviews r ON b.id = r.business_id
       WHERE b.is_verified = 1
       GROUP BY b.id
       `
    )
    res.json(businesses);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({error:"Failed to fetch businesses"});
    
  }
}
const getCustomerBussinessById =async(req,res)=>{
  try {
    const {id} =req.params;

    //get general business details
    const [business] = await db.query(`
      SELECT 
        b.*,
        AVG(r.rating) as rating,
        COUNT(r.id) as review_count
      FROM businesses b
      LEFT JOIN reviews r ON b.id = r.business_id
      WHERE b.id = ? AND b.is_verified = 1
      GROUP BY b.id
    `, [id]);

    if (business.length === 0) {
      return res.status(404).json({
        message: "Business not found"
      });
    }

    // Get services separately
    const [services] = await db.query(`
      SELECT 
        id,
        service_name,
        description,
        price,
        duration,
        status,
        subscription_type
      FROM services
      WHERE business_id = ? AND status = 'active'
    `, [id]);

    // Get staff separately
    const [staff] = await db.query(`
      SELECT 
        st.id,
        u.name,
        st.proffession,
        u.email as contact
      FROM staff st
      LEFT JOIN users u ON st.user_id = u.id
      WHERE st.business_id = ?
    `, [id]);

    // Get business hours separately
    const [businessHours] = await db.query(`
      SELECT 
        id,
        day_of_week,
        open_time,
        close_time,
        is_closed
      FROM business_hours
      WHERE business_id = ?
      ORDER BY day_of_week
    `, [id]);

    // Get reviews separately
    const [reviews] = await db.query(`
      SELECT 
        r.*,
        u.name as customer_name,
        b.booking_date
      FROM reviews r
      LEFT JOIN users u ON r.customer_id = u.id
      LEFT JOIN bookings b ON r.booking_id = b.id
      WHERE r.business_id = ?
      ORDER BY r.create_at DESC
    `, [id]);

    // Combine all data
    const businessData = {
      ...business[0],
      services: services,
      staff: staff,
      business_hours: businessHours,
      reviews: reviews
    };

    res.json(businessData);

  } catch (error) {
    console.error("Error fetching the business:", error);
    res.status(500).json({ message: "Failed to fetch business" });
  }
}

module.exports = {
  businessRegistration,
  fetchBusiness,
  adminUpdateBusiness,
  ownerFetchAllBusinesses,
  getBusinessById,
  ownerUpdateBusiness,
  busines_hours,
  getAllBusiness,
  getCustomerBussinessById
};
