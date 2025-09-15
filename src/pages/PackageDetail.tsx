import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Calendar, Star, ArrowLeft, Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  itinerary?: any;
  is_featured?: boolean;
}

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('packages' as any)
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPackageData(data as any);
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleBookNow = () => {
    if (user) {
      navigate('/booking');
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Package Not Found</h2>
            <p className="text-muted-foreground mb-4">The package you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/packages')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Packages
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={packageData.image} 
            alt={packageData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <div className="text-white">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/packages')}
                  className="text-white hover:bg-white/20 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Packages
                </Button>
                
                <div className="flex items-center gap-2 mb-2">
                  {packageData.package_type && (
                    <Badge variant="secondary" className="capitalize">
                      {packageData.package_type}
                    </Badge>
                  )}
                  {packageData.is_featured && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold mb-2">{packageData.name}</h1>
                <div className="flex items-center text-lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  {packageData.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Package</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {packageData.description}
                  </p>
                </CardContent>
              </Card>

              {/* Includes & Excludes */}
              <div className="grid md:grid-cols-2 gap-6">
                {packageData.includes && packageData.includes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600 flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {packageData.includes.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {packageData.excludes && packageData.excludes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600 flex items-center">
                        <X className="w-5 h-5 mr-2" />
                        What's Not Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {packageData.excludes.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Package Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {packageData.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="justify-center p-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="text-center">
                    <CardTitle className="text-3xl font-bold text-primary">
                      ₹{packageData.price.toLocaleString()}
                    </CardTitle>
                    <CardDescription>per person</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Max {packageData.capacity} people</span>
                    </div>
                    {packageData.duration && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{packageData.duration} {packageData.duration === 1 ? 'day' : 'days'}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                  >
                    {user ? 'Book Now' : 'Sign In to Book'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Free cancellation up to 24 hours before the trip
                  </p>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package Type:</span>
                    <span className="capitalize font-medium">{packageData.package_type || 'Tour'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{packageData.duration || 1} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Group Size:</span>
                    <span className="font-medium">Up to {packageData.capacity} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{packageData.location}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PackageDetail;