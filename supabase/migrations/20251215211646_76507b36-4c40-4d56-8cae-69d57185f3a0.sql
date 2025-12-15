-- Add missing RLS policies for user_roles management
-- Allow admins to insert new roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create bootstrap function to create the first admin (only works when no admins exist)
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(admin_user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if no admins exist yet
  IF EXISTS (SELECT 1 FROM user_roles WHERE role = 'admin') THEN
    RETURN false;
  END IF;
  
  INSERT INTO user_roles (user_id, role)
  VALUES (admin_user_id, 'admin');
  
  RETURN true;
END;
$$;