const db = require( '../config/db')

const addReview = async(req,res) =>{
    try{
        const {booking_id, customer_id,business_id,staff_id,rating,review_text}= req.body;
        const [existingReview] = await db.query(
            "SELECT * FROM reviews WHERE booking_id=?",
        [booking_id]
        );
        if(existingReview.length>0){
            return res.status(400).json({
                message: "Review alaredy exists for this booking."
            });
        }
        const [result] = await db.query(
            `INSERT INTO reviews (booking_id,customer_id,business_id,staff_id,rating,review_text,created_at) 
            VALUES(?, ?, ?, ?, ?, ?, NOW())`,
            [booking_id ,customer_id,business_id,staff_id,rating,review_text]
        )

        res.status(201).json({
            message: "Review added successfully",
            review_id: result.insertId
        });
    }catch(error){
        console.error("Error adding review:", error);
        res.status(500).json({
            message: "Failed to add review"
        });

    }
}