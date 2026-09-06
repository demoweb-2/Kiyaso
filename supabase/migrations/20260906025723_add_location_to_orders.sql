/*
# Add location columns to orders table

1. Changes
- Adds `latitude` (double precision, nullable) to `orders` — stores the customer's pinned map latitude.
- Adds `longitude` (double precision, nullable) to `orders` — stores the customer's pinned map longitude.
- Adds `map_url` (text, nullable) to `orders` — stores a full Google Maps link for the pinned location.

2. Security
- No RLS policy changes needed; the orders table already has anon+authenticated CRUD policies.
- The new columns inherit the existing table-level RLS.

3. Notes
- All three columns are nullable so existing orders are unaffected.
- Uses a DO $$ block with IF NOT EXISTS to be idempotent.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'latitude') THEN
    ALTER TABLE orders ADD COLUMN latitude double precision;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'longitude') THEN
    ALTER TABLE orders ADD COLUMN longitude double precision;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'map_url') THEN
    ALTER TABLE orders ADD COLUMN map_url text;
  END IF;
END $$;
