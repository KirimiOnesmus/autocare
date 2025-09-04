create table users(
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
phone VARCHAR(20) NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role ENUM ('customer','owner', 'staff', 'manager', 'super_admin') NOT NULL DEFAULT 'customer',
email_verified BOOLEAN DEFAULT FALSE,
phone_verified BOOLEAN DEFAULT FALSE,
is_active BOOLEAN DEFAULT TRUE,
profile_image VARCHAR(255) NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
last_login TIMESTAMP NULL
)

CREATE TABLE businesses (
	id INT PRIMARY KEY AUTO_INCREMENT,
    business_name VARCHAR(150) NOT NULL,
    owner_id INT NOT NULL,
    business_type ENUM("car_wash_detailing","garage", "accessories_customization","multi_service"),
    location TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    description TEXT NULL,
    business_hours JSON NULL,
    is_mobile BOOLEAN DEFAULT FALSE,
    is_stationary BOOLEAN DEFAULT TRUE,
    logo VARCHAR(255) NULL,
    business_gallery JSON NULL,
    license_number VARCHAR(100) NULL,
    tax_number VARCHAR(100) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT TRUE,
    subscription_plan ENUM('basic','premium', 'enterprise') DEFAULT 'basic',
    subscription_expires_at DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

CREATE TABLE business_hours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  day_of_week ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);


CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    login_id VARCHAR(50) UNIQUE,
    business_staff_no INT NOT NULL,           -- staff ID unique inside business
    role VARCHAR(50) NOT NULL,
    national_id VARCHAR(20) NOT NULL,
    kra_pin VARCHAR(50) NOT NULL,
    pay_commission DECIMAL(5,2),              -- % of service pay
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    max_concurrent_jobs INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    UNIQUE (business_id, business_staff_no)   -- ensures per-business unique staff number
);


CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    business_id INT NOT NULL,
    category_id INT NULL,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INT NOT NULL, -- store in minutes instead of TIME for flexibility
    price DECIMAL(10,2) NOT NULL, -- better than INT for money values
    status ENUM('active', 'inactive') DEFAULT 'active',
    subscription_type ENUM('basic', 'premium') DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
);

-- service categories
CREATE TABLE service_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Customers table

CREATE TABLE customers(
id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT UNIQUE NOT NULL,
address TEXT NULL,
city VARCHAR(50) NULL,
postal_code VARCHAR (20) NULL,
gender ENUM ('male', 'female') NULL,
preferred_contact ENUM ('email','phone','both') DEFAULT 'both',
loyalty_points INT DEFAULT 0,
total_bookings INT DEFAULT 0,
total_spent DECIMAL(10,2) DEFAULT 0.00,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)


-- REVIEW TABLE
CREATE TABLE bookings ( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    booking_reference VARCHAR(20) UNIQUE NOT NULL, -- Auto-generated unique reference 
    service_id INT NOT NULL, 
    customer_id INT NOT NULL, 
    staff_id INT NULL, 
    business_id INT NOT NULL, -- Denormalized for faster queries 
    booking_date DATE NOT NULL, 
    booking_time TIME NOT NULL, 
    estimated_duration INT NOT NULL, -- in minutes 
    service_location TEXT NULL, 
    service_coordinates POINT NULL, -- GPS coordinates 
    original_price DECIMAL(10,2) NOT NULL, 
    discount_amount DECIMAL(10,2) DEFAULT 0.00, 
    final_price DECIMAL(10,2) NOT NULL, 
     status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled') DEFAULT 
'pending', 
    payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'partial') DEFAULT 'pending', 
    customer_notes TEXT NULL, 
    staff_notes TEXT NULL, 
    cancellation_reason TEXT NULL, 
    confirmed_at TIMESTAMP NULL, 
    started_at TIMESTAMP NULL, 
    completed_at TIMESTAMP NULL, 
    cancelled_at TIMESTAMP NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,     
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT, 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE, 
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL, 
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE 
); 


--

CREATE TABLE bookings ( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    booking_reference VARCHAR(20) UNIQUE NOT NULL, 
    service_id INT NOT NULL, 
    customer_id INT NOT NULL, 
    staff_id INT NULL, 
    business_id INT NOT NULL, -- Denormalized for faster queries 
    booking_date DATE NOT NULL, 
    booking_time TIME NOT NULL, 
    estimated_duration INT NOT NULL,  
    service_location TEXT NULL, 
    original_price DECIMAL(10,2) NOT NULL, 
    discount_amount DECIMAL(10,2) DEFAULT 0.00, 
    final_price DECIMAL(10,2) NOT NULL, 
	status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled') DEFAULT 
'pending', 
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending', 
    customer_notes TEXT NULL, 
    staff_notes TEXT NULL, 
    cancellation_reason TEXT NULL, 
    confirmed_at TIMESTAMP NULL, 
    started_at TIMESTAMP NULL, 
    completed_at TIMESTAMP NULL, 
    cancelled_at TIMESTAMP NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,     
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT, 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE, 
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL, 
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE 
); 

