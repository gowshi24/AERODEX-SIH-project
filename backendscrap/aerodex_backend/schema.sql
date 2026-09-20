-- ===================================================
-- AERODEX DATABASE SCHEMA (PostgreSQL / Supabase)
-- ===================================================

CREATE TABLE IF NOT EXISTS airports (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS airlines (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(3) NOT NULL,
    color VARCHAR(20) DEFAULT '#0052cc',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('AIRLINE', 'OTA', 'REFERENCE')),
    collection_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'DEMO_DATA',
    coverage VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flights (
    id VARCHAR(50) PRIMARY KEY,
    airline_code VARCHAR(3) REFERENCES airlines(code),
    flight_number VARCHAR(20) NOT NULL,
    departure_code VARCHAR(3) REFERENCES airports(code),
    arrival_code VARCHAR(3) REFERENCES airports(code),
    departure_time VARCHAR(10) NOT NULL,
    arrival_time VARCHAR(10) NOT NULL,
    duration VARCHAR(20) NOT NULL,
    stops INT DEFAULT 0,
    aircraft VARCHAR(100),
    fare_class VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fare_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_id VARCHAR(50) REFERENCES flights(id),
    source_name VARCHAR(100) NOT NULL,
    travel_date DATE NOT NULL,
    advance_purchase_days INT NOT NULL,
    base_fare DECIMAL(10, 2) NOT NULL,
    taxes DECIMAL(10, 2) NOT NULL,
    fees DECIMAL(10, 2) NOT NULL,
    total_fare DECIMAL(10, 2) NOT NULL,
    is_cheapest BOOLEAN DEFAULT FALSE,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS airfare_index (
    id SERIAL PRIMARY KEY,
    calculation_date DATE NOT NULL UNIQUE,
    index_value DECIMAL(8, 2) NOT NULL,
    baseline_value DECIMAL(8, 2) DEFAULT 100.00,
    cpi_reference DECIMAL(8, 2),
    mom_change_percent DECIMAL(5, 2),
    yoy_change_percent DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fare_anomalies (
    id VARCHAR(50) PRIMARY KEY,
    route VARCHAR(20) NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    source_name VARCHAR(100) NOT NULL,
    observed_fare DECIMAL(10, 2) NOT NULL,
    expected_fare DECIMAL(10, 2) NOT NULL,
    deviation_percent DECIMAL(6, 2) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('High', 'Medium', 'Low')),
    reason TEXT NOT NULL,
    anomaly_type VARCHAR(30) NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED INITIAL METRO AIRPORTS
INSERT INTO airports (code, name, city) VALUES
('DEL', 'Indira Gandhi International Airport', 'Delhi'),
('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai'),
('BLR', 'Kempegowda International Airport', 'Bengaluru'),
('CCU', 'Netaji Subhash Chandra Bose International Airport', 'Kolkata'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad'),
('MAA', 'Chennai International Airport', 'Chennai'),
('GOI', 'Manohar International Airport', 'Goa')
ON CONFLICT (code) DO NOTHING;
