const db = require ("../config/db")


const fetchUsers=async(req,res)=>{
    try {
        const [rows] =await db.query(
            `SELECT * FROM users`
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching users:",error)
        res.status(500).json({
            message:"Failed to fetch system users!"
        })
    }
}

module.exports={fetchUsers};