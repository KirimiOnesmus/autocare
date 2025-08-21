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

module.exports = { businessRegistration, fetchBusiness, adminUpdateBusiness };
