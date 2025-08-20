const jwt  = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db =require("../config/db");

const businessRegistration=async(req,res)=>{

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
        user_role
    } =req.body;
    
    try {
        const [existingBusiness]=await db.query(
            `SELECT id FROM businesses WHERE business_name = ?  AND city = ? OR email = ? OR phone = ? `,
            [business_name,city,email,phone]
        );
        if(existingBusiness.length>0){
            return res.status(400).json({message:"Business already registered"});
        }
        let owner_id;
        const[existingUser] =await db.query(
            `SELECT id FROM users WHERE email = ?`,
        [owner_email]
        );
        if(existingUser.length>0){
            // reuse the same user
            owner_id = existingUser[0].id;
        }else{
              const passwordHash =await bcrypt.hash(password,10);
              const [userResult] = await db.query(
                `INSERT INTO users (name,email,phone,password,role) VALUES (?, ?, ?, ?, ?)`,
                [owner_name,owner_email,owner_phone,passwordHash,user_role]
              );
              owner_id = userResult.insertId;
        }
        await db.query(
            `INSERT INTO businesses (business_name,email,phone,business_type,city,owner_id) VALUES(?, ?, ?, ?, ?, ?)`,
            [business_name,email,phone,business_type,city,owner_id]
        );

        res.status(201).json({
            message:"Business registered successfully",
            owner_id:owner_id,
        });
        
    } catch (error) {
        console.error("Error creating business with owner:",error);
        res.status(500).json({error:"Failed to create business and owner"});
    }
}
module.exports={businessRegistration};