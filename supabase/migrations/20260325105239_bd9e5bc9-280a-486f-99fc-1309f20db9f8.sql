
CREATE TABLE public.client_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text,
  access_code text NOT NULL UNIQUE,
  raw_plan_text text,
  plan_data jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.client_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plans by access code"
ON public.client_plans
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert plans"
ON public.client_plans
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update plans"
ON public.client_plans
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete plans"
ON public.client_plans
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
