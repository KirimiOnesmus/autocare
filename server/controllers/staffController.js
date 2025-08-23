const bcrypt = require("bcryptjs");
const db = require("../config/db");

const registerStaff = async (req, res) => {
  const {
    name,
    email,
    phone,
    proffession,
    national_id,
    kra_pin,
    pay_commission,
    hire_date,
    business_id,
    password, // Only required for new users
  } = req.body;

  const connection = await db.getConnection(); // Get a connection for transaction
  await connection.beginTransaction(); // Start transaction

  try {
    let user_id;

    // 1. Check if user already exists
    const [existingUser] = await connection.query(
      `SELECT id, role FROM users WHERE email = ?`,
      [email]
    );

    if (existingUser.length > 0) {
      // Existing user → may be a customer
      user_id = existingUser[0].id;

      // Update role to "staff" if not already
      if (existingUser[0].role !== "staff") {
        await connection.query(`UPDATE users SET role = ? WHERE id = ?`, [
          "staff",
          user_id,
        ]);
      }
    } else {
      // New user → create as staff
      if (!password) {
        throw new Error("Password is required for new users");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const [userResult] = await connection.query(
        `INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`,
        [name, email, phone, passwordHash, "staff"]
      );
      user_id = userResult.insertId;
    }

    // 2. Generate business_staff_no
    const [[{ next_no }]] = await connection.query(
      `SELECT COALESCE(MAX(business_staff_no), 0) + 1 AS next_no 
       FROM staff 
       WHERE business_id = ?`,
      [business_id]
    );

    // 3. Generate login_id (unique per business)
    const login_id = `BUS${String(business_id).padStart(3, "0")}-S${String(
      next_no
    ).padStart(3, "0")}`;

    // 4. Insert into staff table
    await connection.query(
      `INSERT INTO staff (user_id, business_id, business_staff_no, login_id, proffession, national_id, kra_pin, pay_commission, hire_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        business_id,
        next_no,
        login_id,
        proffession,
        national_id,
        kra_pin,
        pay_commission,
        hire_date,
      ]
    );

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      message: "Staff registered successfully",
      login_id,
    });
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error("Error registering staff:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to register staff" });
  } finally {
    connection.release();
  }
};

const fetchStaff = async (req, res) => {
  const ownerId = req.params.id;
 
  try {
    const [staff] = await db.query(
      `SELECT 
        s.id AS staff_id,
         s.login_id,
         s.proffession,
         s.national_id,
         s.kra_pin,
         s.pay_commission,
         s.hire_date,
         s.business_id,
         u.name AS staff_name,
         u.email AS staff_email,
         u.phone AS staff_phone
           FROM staff s
       JOIN businesses b ON s.business_id = b.id
       JOIN users u ON s.user_id = u.id
       WHERE b.owner_id = ?`,
      [ownerId]
    );
    res.status(200).json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

module.exports = { registerStaff ,fetchStaff};
