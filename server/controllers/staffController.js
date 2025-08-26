const bcrypt = require("bcryptjs");
const db = require("../config/db");

/**
 * Register staff
 * - Creates new staff or reactivates if they were inactive
 */
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

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    let user_id;

    // 1. Check if user exists
    const [existingUser] = await connection.query(
      `SELECT id, role FROM users WHERE email = ?`,
      [email]
    );

    if (existingUser.length > 0) {
      user_id = existingUser[0].id;

      // Upgrade role to staff if not already
      if (existingUser[0].role !== "staff") {
        await connection.query(`UPDATE users SET role = ? WHERE id = ?`, [
          "staff",
          user_id,
        ]);
      }
    } else {
      // New user → must provide password
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

    // 2. Check if staff exists but inactive in this business → reactivate
    const [inactiveStaff] = await connection.query(
      `SELECT id, login_id 
       FROM staff 
       WHERE user_id = ? AND business_id = ? AND is_active = 0`,
      [user_id, business_id]
    );

    if (inactiveStaff.length > 0) {
      await connection.query(
        `UPDATE staff 
         SET is_active = 1, hire_date = ? 
         WHERE id = ?`,
        [hire_date, inactiveStaff[0].id]
      );

      await connection.commit();
      return res.status(200).json({
        message: "Staff reactivated successfully",
        login_id: inactiveStaff[0].login_id,
      });
    }

    // 3. Generate next business_staff_no
    const [[{ next_no }]] = await connection.query(
      `SELECT COALESCE(MAX(business_staff_no), 0) + 1 AS next_no 
       FROM staff 
       WHERE business_id = ?`,
      [business_id]
    );

    // 4. Generate login_id (unique per business)
    const login_id = `BUS${String(business_id).padStart(3, "0")}-S${String(
      next_no
    ).padStart(3, "0")}`;

    // 5. Insert new staff record
    await connection.query(
      `INSERT INTO staff 
        (user_id, business_id, business_staff_no, login_id, proffession, national_id, kra_pin, pay_commission, hire_date) 
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

    await connection.commit();

    res.status(201).json({
      message: "Staff registered successfully",
      login_id,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error registering staff:", error);
    res.status(500).json({ error: error.message || "Failed to register staff" });
  } finally {
    connection.release();
  }
};

/**
 * Fetch staff (active + inactive)
 */
const fetchStaff = async (req, res) => {
  try {
    const businessIds = req.params.ids
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter(Boolean);

    if (businessIds.length === 0) {
      return res.status(400).json({ error: "No valid business IDs provided" });
    }

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
        s.is_active,
        u.name AS staff_name,
        u.email AS staff_email,
        u.phone AS staff_phone
       FROM staff s
       JOIN businesses b ON s.business_id = b.id
       JOIN users u ON s.user_id = u.id
       WHERE s.business_id IN (?)`,
      [businessIds]
    );

    res.status(200).json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

/**
 * Update staff (and linked user info)
 */
const updateStaff = async (req, res) => {
  const {id} = req.params;
 
  const {
    name,
    email,
    phone,
    proffession,
    national_id,
    kra_pin,
    pay_commission,
    hire_date,
    password,
  } = req.body;

  try {
    const [staffRows] = await db.query(`SELECT * FROM staff WHERE id = ?`, [
      id,
    ]);
    if (staffRows.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    const staff = staffRows[0];
    const userId = staff.user_id;

    // Prevent duplicate emails
    if (email) {
      const [duplicate] = await db.query(
        `SELECT id FROM users WHERE email = ? AND id != ?`,
        [email, userId]
      );
      if (duplicate.length > 0) {
        return res
          .status(409)
          .json({ error: "Another user with this email exists." });
      }
    }

    // Update users table
    if (name || email || phone || password) {
      let passwordHash = null;
      if (password) {
        passwordHash = await bcrypt.hash(password, 10);
      }

      await db.query(
        `UPDATE users SET 
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          password = COALESCE(?, password)
         WHERE id = ?`,
        [name, email, phone, passwordHash, userId]
      );
    }

    // Update staff table
    await db.query(
      `UPDATE staff SET 
        proffession = COALESCE(?, proffession),
        national_id = COALESCE(?, national_id),
        kra_pin = COALESCE(?, kra_pin),
        pay_commission = COALESCE(?, pay_commission),
        hire_date = COALESCE(?, hire_date)
       WHERE id = ?`,
      [proffession, national_id, kra_pin, pay_commission, hire_date, id]
    );

    res.status(200).json({ message: "Staff updated successfully" });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ error: "Failed to update staff" });
  }
};

/**
 * Soft delete staff (mark inactive)
 */
const deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const [staffRows] = await db.query(`SELECT * FROM staff WHERE id = ?`, [
      id,
    ]);
    if (staffRows.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    await db.query(`UPDATE staff SET is_active = 0 WHERE id = ?`, [id]);

    res.status(200).json({ message: "Staff marked as inactive successfully" });
  } catch (error) {
    console.error("Error marking staff inactive:", error);
    res.status(500).json({ error: "Failed to mark staff inactive" });
  }
};

/**
 * Reactivate staff explicitly (via route)
 */
const reactivateStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const [staffRows] = await db.query(`SELECT * FROM staff WHERE id = ?`, [
      id,
    ]);
    if (staffRows.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    await db.query(`UPDATE staff SET is_active = 1 WHERE id = ?`, [id]);

    res.status(200).json({ message: "Staff reactivated successfully" });
  } catch (error) {
    console.error("Error reactivating staff:", error);
    res.status(500).json({ error: "Failed to reactivate staff" });
  }
};

module.exports = {
  registerStaff,
  fetchStaff,
  updateStaff,
  deleteStaff,
  reactivateStaff,
};
