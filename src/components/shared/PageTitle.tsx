import type { LucideIcon } from 'lucide-react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

const PageTitle = ({ title, subtitle, icon: Icon }: PageTitleProps) => {
  return (
    <div className="mb-8 text-center md:text-left">
      <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
        {Icon && <Icon className="h-8 w-8 text-primary" />}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
      </div>
      {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default PageTitle;
