/*
# Empresa Plana Admin Intranet Schema

## Overview
Creates the full database schema for the Empresa Plana administrative intranet.
This covers fleet management, routes, schedules, drivers, bookings, incidents, and maintenance.

## New Tables

1. **vehicles** - The bus/coach fleet
   - id (uuid PK)
   - plate (text, unique) - license plate
   - model (text) - bus model
   - capacity (int) - passenger seats
   - fuel_type (text) - diesel/electric/hybrid
   - year (int) - manufacture year
   - status (text) - active / maintenance / retired
   - last_service_date (date) - last maintenance
   - mileage (int) - total km

2. **routes** - Bus lines and services
   - id (uuid PK)
   - name (text) - route name
   - origin (text) - departure city
   - destination (text) - arrival city
   - distance_km (numeric) - route distance
   - duration_min (int) - estimated duration
   - type (text) - regular / transfer / excursion / private
   - status (text) - active / inactive
   - base_price (numeric) - base ticket price

3. **schedules** - Timetables linked to routes
   - id (uuid PK)
   - route_id (uuid FK -> routes)
   - departure_time (time) - departure
   - arrival_time (time) - arrival
   - days_of_week (text[]) - which days it runs
   - vehicle_id (uuid FK -> vehicles, nullable)
   - driver_id (uuid FK -> drivers, nullable)

4. **drivers** - Bus drivers
   - id (uuid PK)
   - name (text)
   - email (text)
   - phone (text)
   - license_type (text) - license class
   - status (text) - active / off / sick
   - hire_date (date)

5. **bookings** - Customer reservations
   - id (uuid PK)
   - customer_name (text)
   - customer_email (text)
   - customer_phone (text)
   - route_id (uuid FK -> routes, nullable)
   - travel_date (date)
   - passengers (int)
   - status (text) - pending / confirmed / cancelled / completed
   - total_price (numeric)
   - notes (text)
   - created_at (timestamptz)

6. **incidents** - Operational incidents
   - id (uuid PK)
   - vehicle_id (uuid FK -> vehicles, nullable)
   - driver_id (uuid FK -> drivers, nullable)
   - incident_date (date)
   - description (text)
   - severity (text) - low / medium / high
   - status (text) - open / resolved

7. **maintenance** - Vehicle maintenance records
   - id (uuid PK)
   - vehicle_id (uuid FK -> vehicles)
   - service_date (date)
   - type (text) - preventive / corrective
   - description (text)
   - cost (numeric)
   - status (text) - scheduled / in_progress / completed

## Security
- RLS enabled on all tables.
- Single-tenant (no auth): policies use TO anon, authenticated so the anon-key frontend can operate.
- All data is intentionally shared within the admin intranet.
*/

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text UNIQUE NOT NULL,
  model text NOT NULL,
  capacity int NOT NULL DEFAULT 50,
  fuel_type text NOT NULL DEFAULT 'diesel',
  year int NOT NULL DEFAULT 2020,
  status text NOT NULL DEFAULT 'active',
  last_service_date date,
  mileage int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_vehicles" ON vehicles;
CREATE POLICY "anon_select_vehicles" ON vehicles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_vehicles" ON vehicles;
CREATE POLICY "anon_insert_vehicles" ON vehicles FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_vehicles" ON vehicles;
CREATE POLICY "anon_update_vehicles" ON vehicles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_vehicles" ON vehicles;
CREATE POLICY "anon_delete_vehicles" ON vehicles FOR DELETE TO anon, authenticated USING (true);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  license_type text NOT NULL DEFAULT 'D',
  status text NOT NULL DEFAULT 'active',
  hire_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_drivers" ON drivers;
CREATE POLICY "anon_select_drivers" ON drivers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_drivers" ON drivers;
CREATE POLICY "anon_insert_drivers" ON drivers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_drivers" ON drivers;
CREATE POLICY "anon_update_drivers" ON drivers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_drivers" ON drivers;
CREATE POLICY "anon_delete_drivers" ON drivers FOR DELETE TO anon, authenticated USING (true);

-- Routes
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  distance_km numeric DEFAULT 0,
  duration_min int DEFAULT 0,
  type text NOT NULL DEFAULT 'regular',
  status text NOT NULL DEFAULT 'active',
  base_price numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_routes" ON routes;
CREATE POLICY "anon_select_routes" ON routes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_routes" ON routes;
CREATE POLICY "anon_insert_routes" ON routes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_routes" ON routes;
CREATE POLICY "anon_update_routes" ON routes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_routes" ON routes;
CREATE POLICY "anon_delete_routes" ON routes FOR DELETE TO anon, authenticated USING (true);

-- Schedules
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  departure_time time NOT NULL,
  arrival_time time NOT NULL,
  days_of_week text[] DEFAULT ARRAY['mon','tue','wed','thu','fri'],
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_schedules" ON schedules;
CREATE POLICY "anon_select_schedules" ON schedules FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_schedules" ON schedules;
CREATE POLICY "anon_insert_schedules" ON schedules FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_schedules" ON schedules;
CREATE POLICY "anon_update_schedules" ON schedules FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_schedules" ON schedules;
CREATE POLICY "anon_delete_schedules" ON schedules FOR DELETE TO anon, authenticated USING (true);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  route_id uuid REFERENCES routes(id) ON DELETE SET NULL,
  travel_date date NOT NULL,
  passengers int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  total_price numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE TO anon, authenticated USING (true);

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  incident_date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_incidents" ON incidents;
CREATE POLICY "anon_select_incidents" ON incidents FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_incidents" ON incidents;
CREATE POLICY "anon_insert_incidents" ON incidents FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_incidents" ON incidents;
CREATE POLICY "anon_update_incidents" ON incidents FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_incidents" ON incidents;
CREATE POLICY "anon_delete_incidents" ON incidents FOR DELETE TO anon, authenticated USING (true);

-- Maintenance
CREATE TABLE IF NOT EXISTS maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  service_date date NOT NULL DEFAULT CURRENT_DATE,
  type text NOT NULL DEFAULT 'preventive',
  description text NOT NULL,
  cost numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_maintenance" ON maintenance;
CREATE POLICY "anon_select_maintenance" ON maintenance FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_maintenance" ON maintenance;
CREATE POLICY "anon_insert_maintenance" ON maintenance FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_maintenance" ON maintenance;
CREATE POLICY "anon_update_maintenance" ON maintenance FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_maintenance" ON maintenance;
CREATE POLICY "anon_delete_maintenance" ON maintenance FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedules_route_id ON schedules(route_id);
CREATE INDEX IF NOT EXISTS idx_bookings_route_id ON bookings(route_id);
CREATE INDEX IF NOT EXISTS idx_incidents_vehicle_id ON incidents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle_id ON maintenance(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
