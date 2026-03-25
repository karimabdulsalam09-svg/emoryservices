
DROP POLICY "Admins can insert plans" ON public.client_plans;
DROP POLICY "Admins can update plans" ON public.client_plans;
DROP POLICY "Admins can delete plans" ON public.client_plans;

CREATE POLICY "Anyone can insert plans" ON public.client_plans
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update plans" ON public.client_plans
FOR UPDATE TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can delete plans" ON public.client_plans
FOR DELETE TO anon, authenticated
USING (true);
