-- Allow anon role to read service_events for the analytics dashboard
CREATE POLICY "Allow anon select on service_events"
  ON service_events
  FOR SELECT
  TO anon
  USING (true);
