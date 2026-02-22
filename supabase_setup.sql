-- 1. Create the profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name text,
  pronouns text,
  color text,
  emotions text[],
  notifications jsonb,
  updated_at timestamp with time zone,
  PRIMARY KEY (id)
);

-- 2. Create the entries table
CREATE TABLE public.entries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content text NOT NULL,
  emotion text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for profiles
-- Users can read their own profile
CREATE POLICY "Users can view own profile."
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- Users can update their own profile
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 5. Create RLS Policies for entries
-- Users can read their own entries
CREATE POLICY "Users can view own entries."
  ON public.entries FOR SELECT
  USING ( auth.uid() = user_id );

-- Users can insert their own entries
CREATE POLICY "Users can insert own entries."
  ON public.entries FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Users can update their own entries
CREATE POLICY "Users can update own entries."
  ON public.entries FOR UPDATE
  USING ( auth.uid() = user_id );

-- Users can delete their own entries
CREATE POLICY "Users can delete own entries."
  ON public.entries FOR DELETE
  USING ( auth.uid() = user_id );

-- 6. Set up a trigger to automatically create a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, pronouns, color, emotions, notifications)
  VALUES (
    NEW.id,
    'Anonymous',
    '',
    '#E5A9A9',
    ARRAY['Joy', 'Anxiety', 'Grateful', 'Exhausted'],
    '{"enabled": false, "hour": "20", "minute": "00"}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
