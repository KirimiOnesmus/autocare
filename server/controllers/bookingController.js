const db = require("../config/db");

const generateBookingReference = async () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let isUnique = false;
  let reference = "";
  while (!isUnique) {
    reference = "";
    for (let i = 0; i < 8; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    try {
      const [rows] = await db.query(
        `SELECT id FROM bookings WHERE booking_reference = ?`,
        [reference]
      );
      if (rows.length === 0) {
        isUnique = true;
      }
    } catch (error) {
      console.log("Error finding reference number:", error);
      throw error;
    }
  }
  return reference;
};
const createBooking = async (req, res) => {
  const {
    service_id,
    business_id,
    booking_date,
    booking_time,
    estimated_duration,
    original_price,
    final_price,
    customer_notes,
    license_plate,
    car_model,
    customer_id,
  } = req.body;
  try {
    if (
      !service_id ||
      !business_id ||
      !booking_date ||
      !booking_time ||
      !estimated_duration ||
      !original_price ||
      !final_price ||
      !customer_notes ||
      !license_plate ||
      !car_model ||
      !customer_id
    ) {
      return res.status(400).json({
        message: "Fill the blank fields! ",
      });
    }
    const booking_reference = await generateBookingReference();

    const [result] = await db.query(
      `INSERT INTO bookings(
        booking_reference,service_id,customer_id,business_id,
        booking_date, booking_time, estimated_duration, original_price,
        final_price,status,payment_status,customer_notes,
        license_plate,car_model) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking_reference,
        service_id,
        customer_id,
        business_id,
        booking_date,
        booking_time,
        estimated_duration,
        original_price,
        final_price,
        "pending",
        "pending",
        customer_notes || "",
        license_plate,
        car_model,
      ]
    );
    const [serviceRows] = await db.query(
      "SELECT service_name FROM services WHERE id = ?",
      [service_id]
    );
    const [businessRows] = await db.query(
      "SELECT business_name FROM businesses WHERE id =?",
      [business_id]
    );
    res.status(201).json({
      message: "Service booked successfully!",
      booking: {
        id: result.insertId,
        reference: booking_reference,
        service: serviceRows[0]?.service_name || "Unknown Service",
        business: businessRows[0]?.business_name || "Unknown Business",
        date: booking_date,
        time: booking_time,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Booking failed.", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getCustomerBookings = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const [bookings] = await db.query(
      `SELECT b.*,
            s.service_name,
            s.price as service_price,
            bs.business_name,
            bs.location as business_address FROM bookings b
            LEFT JOIN services s ON b.service_id = s.id
            LEFT JOIN businesses bs ON b.business_id = bs.id
            WHERE b.customer_id =?
            ORDER BY b.created_at DESC`,
      [customer_id]
    );
    res.json({
      bookings,
    });
  } catch (error) {
    console.error("Get bookings errors:", error);
    res.status(500).json({
      message: "Failed to fetch customers bookings.",
    });
  }
};
const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    const [bookings] = await db.query(
      `SELECT 
        b.*,
        s.service_name,
        s.description as service_description,
        s.price as service_price,
        bs.business_name,
        bs.address as business_address,
        bs.phone as business_phone,
        bs.email as business_email,
        u.name as customer_name,
        u.phone as customer_phone,
        u.email as customer_email
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN businesses bs ON b.business_id = bs.id
      LEFT JOIN users u ON b.customer_id = u.id
      WHERE b.booking_reference = ?`,
      [reference]
    );
    if (bookings.length === 0) {
      res.status(404).json({
        message: "Booking not found.",
      });
      return;
    }
    const booking = bookings[0];
    if (booking.customer_id !== req.user_id && !req.user.isAdmin) {
      return res.status(403).json({
        message: "Unauthorized to view this booking",
      });
    }
    res.json({
      booking,
    });
  } catch (error) {
    console.error("Failed to fetch the booking.", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, staff_notes, cancellation_reason } = req.body;
    const validStatus = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
      "rescheduled",
    ];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }
    let updateQuery = "UPDATE bookings SET status = ?";
    const queryParams = [status];

    if (status === "confirmed") {
      updateQuery += ", confirmed_at = NOW()";
    } else if (status === "in_progress") {
      updateQuery += ",started_at = NOW()";
    } else if (status === "completed") {
      updateQuery += ",complted_at = NOW()";
    } else if (status === "cancelled") {
      updateQuery += ",cancelled_at = NOW(), cancellation_reason = ?";
      queryParams.splice(1, 0, cancellation_reason || "");
    }

    if (staff_notes) {
      updateQuery += ",staff_notes =?";
      queryParams.push(staff_notes);
    }
    updateQuery += "WHERE id = ?";
    queryParams.push(id);

    const [result] = await db.query(updateQuery, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking status updated successfully",
    });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({
      message: "Failed Update!",
    });
  }
};

const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, staff } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        message: "Date and time are required for rescheduling"
      });
    }

    let updateFields = ["booking_date = ?", "booking_time = ?", "status = 'rescheduled'"];
    let queryParams = [date, time];

    if (staff && staff !== "Select Staff") {
      updateFields.push("assigned_staff = ?");
      queryParams.push(staff);
    }

    queryParams.push(id);

    const [result] = await db.query(
      `UPDATE bookings SET ${updateFields.join(", ")} WHERE id = ?`,
      queryParams
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.json({
      message: "Booking rescheduled successfully"
    });

  } catch (error) {
    console.error("Reschedule booking error:", error);
    res.status(500).json({
      message: "Failed to reschedule booking"
    });
  }
};


const cancelBooking = async (req, res) => {
  try {
    const { reference } = req.params;
    const { cancellation_reason } = req.body;
    const [bookingRows] = await db.query(
      "SELECT customer_id,status FROM bookings WHERE booking_reference = ?",
      [reference]
    );
    if (bookingRows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }
    const booking = bookingRows[0];

    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized to cancel this booking.",
      });
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return res.status(400).json({
        message: `Booking is already${booking.status}`,
      });
    }
    const [result] = await db.query(
      `UPDATE bookings SET status = 'cancelled', cancelled_at = NOW(), cancellation_reason = ?
WHERE booking_reference = ?`,
      [cancellation_reason || "Cancelled by customer", reference]
    );

    res.json({
      message: "Booking cancelled successfully",
      booking: {
        reference: reference,
        status: "cancelled",
      },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// bookings per business

const getBookingByBusiness = async (req,res) => {
  const business_id = req.params.businessId;
  try {
    const [bookings] = await db.query(
      `SELECT 
        u.name AS customer_name,
        s.service_name,
        DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS date,  -- Format as YYYY-MM-DD
        TIME(b.booking_time) AS time,
        b.status AS status,
        b.payment_status AS payment,
        b.id AS id,
        b.booking_reference AS reference
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE b.business_id = ?`,
      [business_id]
    );
    
    if(bookings.length === 0){
      res.status(400).json({
        message: "No bookings found"
      });
      return;
    }
    
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching the business bookings:", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = {
  createBooking,
  getBookingByReference,
  getCustomerBookings,
  updateBookingStatus,
  rescheduleBooking,
  cancelBooking,
  getBookingByBusiness
};
