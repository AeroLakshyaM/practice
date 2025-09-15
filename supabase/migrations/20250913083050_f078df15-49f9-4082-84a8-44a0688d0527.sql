-- Create a table for featured apartments
CREATE TABLE public.apartments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  capacity INTEGER NOT NULL,
  size INTEGER NOT NULL,
  image TEXT NOT NULL,
  location TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since apartments are publicly viewable)
CREATE POLICY "Apartments are viewable by everyone" 
ON public.apartments 
FOR SELECT 
USING (true);

-- Create policies for authenticated admin users to manage apartments
CREATE POLICY "Authenticated users can insert apartments" 
ON public.apartments 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update apartments" 
ON public.apartments 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete apartments" 
ON public.apartments 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_apartments_updated_at
BEFORE UPDATE ON public.apartments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add some sample data
INSERT INTO public.apartments (name, description, price, capacity, size, image, location, features) VALUES 
('Luxury Beach Villa', 'Stunning oceanfront villa with private beach access and panoramic sea views', 299.99, 6, 150, '/placeholder.svg', 'Beachfront', ARRAY['Private Beach', 'Ocean View', 'Wi-Fi', 'Kitchen', 'Bathroom', 'Balcony']),
('Mountain Retreat', 'Cozy mountain cabin surrounded by nature with hiking trails nearby', 189.99, 4, 100, '/placeholder.svg', 'Mountain View', ARRAY['Mountain View', 'Hiking Trails', 'Wi-Fi', 'Kitchen', 'Bathroom', 'Fireplace']),
('City Center Loft', 'Modern loft in the heart of the city with easy access to restaurants and shops', 249.99, 2, 80, '/placeholder.svg', 'City Center', ARRAY['City View', 'Modern Design', 'Wi-Fi', 'Kitchen', 'Bathroom', 'Parking']);