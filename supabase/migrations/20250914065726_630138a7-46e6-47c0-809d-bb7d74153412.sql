-- Update apartments table to better support packages
ALTER TABLE public.apartments RENAME TO packages;

-- Add package-specific columns
ALTER TABLE public.packages 
ADD COLUMN package_type TEXT DEFAULT 'tour' CHECK (package_type IN ('tour', 'pilgrimage', 'adventure', 'cultural')),
ADD COLUMN duration INTEGER DEFAULT 1,
ADD COLUMN includes TEXT[] DEFAULT '{}',
ADD COLUMN excludes TEXT[] DEFAULT '{}',
ADD COLUMN itinerary JSONB DEFAULT '{}';

-- Update RLS policies for the renamed table
DROP POLICY "Apartments are viewable by everyone" ON public.packages;
DROP POLICY "Authenticated users can insert apartments" ON public.packages;  
DROP POLICY "Authenticated users can update apartments" ON public.packages;
DROP POLICY "Authenticated users can delete apartments" ON public.packages;

-- Create new RLS policies for packages
CREATE POLICY "Packages are viewable by everyone" 
ON public.packages 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert packages" 
ON public.packages 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can update packages" 
ON public.packages 
FOR UPDATE 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can delete packages" 
ON public.packages 
FOR DELETE 
USING (auth.role() = 'authenticated'::text);

-- Insert sample package data
INSERT INTO public.packages (id, name, description, price, capacity, size, image, location, features, package_type, duration, includes, excludes, is_featured) VALUES
('pkg-1', 'Divine Char Dham Yatra', 'Complete spiritual journey covering all four sacred Dhams with comfortable accommodation and guided tours.', 25000, 12, 0, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop', 'Uttarakhand', 
 ARRAY['Accommodation', 'Meals', 'Transportation', 'Guide', 'Temple Visits'], 
 'pilgrimage', 12, 
 ARRAY['4-star hotel accommodation', 'All meals (breakfast, lunch, dinner)', 'AC transportation', 'Professional guide', 'Temple entry tickets', 'Medical assistance'],
 ARRAY['Personal expenses', 'Tips', 'Travel insurance', 'Extra meals not mentioned'], 
 true),

('pkg-2', 'Golden Triangle Tour', 'Explore the majestic heritage of Delhi, Agra, and Jaipur with luxury accommodations and cultural experiences.', 18000, 8, 0, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', 'Delhi-Agra-Jaipur', 
 ARRAY['Luxury Hotels', 'Cultural Sites', 'Shopping', 'Local Cuisine', 'Photography'], 
 'cultural', 7,
 ARRAY['5-star hotel stays', 'Daily breakfast and dinner', 'AC vehicle with driver', 'Monument entry fees', 'Cultural show tickets', 'Local shopping assistance'],
 ARRAY['Lunch (unless specified)', 'Personal shopping', 'Camera fees at monuments', 'Tips for guide and driver'],
 true),

('pkg-3', 'Himalayan Adventure Trek', 'Thrilling trekking experience in the Himalayas with breathtaking views and adventure activities.', 15000, 6, 0, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop', 'Himachal Pradesh', 
 ARRAY['Trekking', 'Mountain Views', 'Adventure Sports', 'Camping', 'Nature Photography'], 
 'adventure', 8,
 ARRAY['Camping equipment', 'Professional trek guide', 'All meals during trek', 'Safety equipment', 'First aid support', 'Transportation to base camp'],
 ARRAY['Personal trekking gear', 'Travel to starting point', 'Personal medical expenses', 'Tips for guides and porters'],
 true);