const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (role !== "customer") {
    return res.status(403).json({
      message: "You are only allowed to register as a customer.",
    });
  }
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "User already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    try {
      
          const [userResult] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, passwordHash, role]
    );
    db.query(
      "INSERT INTO customers (user_id) VALUES(?)",
      [userResult.insertId]
    )
    res.status(201).json({
      message: "Customer registered successfully",
      userId: userResult.insertId,
    });
    } catch (error) {
      console.log("Cant register the customer:", error);
    }


  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //first checking business email
    const [businessRows] = await db.query(
      "SELECT * FROM businesses WHERE email = ?",
      [email]
    );
    let user = null;
    let isBusinessLogin = false;
    let customerId = null;
    
    if (businessRows.length > 0) {
      const business = businessRows[0];
      isBusinessLogin = true;
      const [userRows] = await db.query("SELECT * FROM users WHERE id = ?", [
        business.owner_id,
      ]);
      if (userRows.length > 0) {
        user = userRows[0];
      }
    } else {
      const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      if (userRows.length > 0) {
        user = userRows[0];
        if(user.role === "customer"){
          const[customerRows] = await db.query(
            "SELECT id FROM customers WHERE user_id = ? LIMIT 1 ",
            [user.id]
          );
          if(customerRows.length>0){
            customerId = customerRows[0].id;
          }else{
            console.log("User is customer but no customer record found.")
          }
        }
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // fetching specific business related to the staff and manager
    let businessId = null;
    let businesses = [];
    if (user.role === "manager") {
      try {
        const [staffRows] = await db.query(
          "SELECT business_id FROM staff WHERE user_id = ? LIMIT 1",
          [user.id]
        );
        console.log("Staff query results:", staffRows);
        if (staffRows.length > 0) {
          businessId = staffRows[0].business_id;
          console.log("Found business ID for manager:", businessId);
        } else {
          console.log("No staff record found for user ID:", user.id);
        }
      } catch (error) {
        console.error("Error fetching business ID for manager:", error);
      }
    }
   

    if (user.role === "owner") {
      [businesses] = await db.query(
        "SELECT * FROM businesses WHERE owner_id = ?",
        [user.id]
      );

      if (businesses && businesses.length > 0) {
        businessId = businesses[0].id;
      }
    }

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: isBusinessLogin ? email : user.email,
        role: user.role,
        businessId,
        customerId,
      },
      businesses,
      isBusinessLogin,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login Failed" });
  }
};


//update customer
const updateCustomerProfile =async(req,res)=>{
  const userId = req.user.id;
  const {
    phone,
    address,
    city,
    postal_code,
    gender,
    preferred_contact
  }=req.body;
  try {
    const [result] = await db.query(
      `UPDATE customers SET phone = ?, address = ?, preferred_contact = ?, update_at = NOW() WHERE user_id = ?`,
      [phone,address,city,postal_code,gender,preferred_contact,userId]
    );
    if(result.affectedRows ===0){
      await db.query(
        "INSERT INTO customers (user_id, phone,address,preferred_contact,gender,city,postal_code) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [userId,phone,address,preferred_contact,gender,city,postal_code]
      );
    }
    res.status(200).json({
    message:"Profile Updated Successfully!"
    });
  } catch (error) {
    console.error("Update profile error:",error);
    res.status(500).json({
      message:"Failed to update profile!"
    });
  };
}
const getCustomerProfile =async(req,res)=>{
  const userId= req.user.id;
try {
  const [results]= await db.query(
    `SELECT c.*, u.name, u.email.u.role FROM customers c JOIN users u ON c.user_id =  u.id WHERE c.user_id = ?`,
    [userId]
  );
  if(rows.length ===0){
    return res.status(404).json({
      message:"Customer profile not found."
    });
  }
  res.status(200).json(rows[0]);
} catch (error) {
  console.error("Error getting customer profile:", error);
  res.status(500).json({
    message:"Failed to fetch profile"
  });
  
}
}

module.exports = {
  registerUser,
  loginUser,
  updateCustomerProfile,
  getCustomerProfile
};
