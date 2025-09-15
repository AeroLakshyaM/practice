import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export interface PackageProps {
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
  is_featured?: boolean;
}

const PackageCard = ({ id, name, description, price, capacity, image, location, features, package_type, duration, includes, is_featured }: PackageProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleViewDetails = () => {
    navigate(`/packages/${id}`);
  };

  return (
    <Card className="group overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {is_featured && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {package_type && (
          <Badge variant="secondary" className="absolute top-2 left-2 capitalize">
            {package_type}
          </Badge>
        )}
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">₹{price.toLocaleString()}</p>
            {duration && <p className="text-sm text-muted-foreground">{duration} days</p>}
          </div>
        </div>
        <CardDescription className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>Capacity: {capacity}</span>
          </div>
          {duration && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{duration} {duration === 1 ? 'day' : 'days'}</span>
            </div>
          )}
        </div>

        {includes && includes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground">Includes:</h4>
            <div className="space-y-1">
              {includes.slice(0, 3).map((item, index) => (
                <p key={index} className="text-xs text-muted-foreground flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                  {item}
                </p>
              ))}
              {includes.length > 3 && (
                <p className="text-xs text-muted-foreground italic">
                  +{includes.length - 3} more included
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{features.length - 3}
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={handleViewDetails}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default PackageCard;