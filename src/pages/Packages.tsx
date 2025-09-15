import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  location: string;
  features: string[];
  package_type?: string;
  duration?: number;
  includes?: string[];
  excludes?: string[];
  is_featured?: boolean;
}

export default function Packages() {
  const { t } = useLanguage();
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestFilter, setGuestFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data as any || []);
      setFilteredPackages(data as any || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter packages based on current filter settings
  useEffect(() => {
    let result = packages;

    // Filter by guests (capacity)
    if (guestFilter !== "all") {
      const minGuests = parseInt(guestFilter);
      result = result.filter(pkg => pkg.capacity >= minGuests);
    }

    // Filter by location
    if (locationFilter !== "all") {
      result = result.filter(pkg => pkg.location === locationFilter);
    }

    // Filter by package type
    if (typeFilter !== "all") {
      result = result.filter(pkg => pkg.package_type === typeFilter);
    }

    // Filter by price range
    result = result.filter(pkg => pkg.price >= priceRange[0] && pkg.price <= priceRange[1]);

    setFilteredPackages(result);
  }, [packages, guestFilter, locationFilter, typeFilter, priceRange]);

  const locations = ["all", ...new Set(packages.map(pkg => pkg.location))];
  const packageTypes = ["all", ...new Set(packages.map(pkg => pkg.package_type || 'tour'))];

  const resetFilters = () => {
    setGuestFilter("all");
    setLocationFilter("all");
    setTypeFilter("all");
    setPriceRange([0, 50000]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading packages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Travel Packages
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our curated collection of travel experiences, from spiritual journeys to cultural adventures.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                {/* Guests Filter */}
                <div className="min-w-[150px]">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Guests
                  </label>
                  <Select value={guestFilter} onValueChange={setGuestFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any number of guests</SelectItem>
                      <SelectItem value="1">1+ guests</SelectItem>
                      <SelectItem value="2">2+ guests</SelectItem>
                      <SelectItem value="3">3+ guests</SelectItem>
                      <SelectItem value="4">4+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div className="min-w-[150px]">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Location
                  </label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All locations</SelectItem>
                      {locations.slice(1).map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Package Type Filter */}
                <div className="min-w-[150px]">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Package Type
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Package Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {packageTypes.slice(1).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="min-w-[200px]">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredPackages.length} of {packages.length} packages
                </p>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="text-sm"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredPackages.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg, index) => (
                  <PackageCard
                    key={pkg.id}
                    {...pkg}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No packages match your filters</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filter criteria to see more options.</p>
                <Button 
                  onClick={resetFilters}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
