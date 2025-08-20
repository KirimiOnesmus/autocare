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
    updateed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

