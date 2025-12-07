import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  description: string | ReactNode;
}

const ServiceCard = ({ icon: Icon, title, subtitle, description }: ServiceCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm font-medium text-muted-foreground mt-2">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
