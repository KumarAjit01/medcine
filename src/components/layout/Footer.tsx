const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} PillPal. All rights reserved.</p>
        <p className="text-xs mt-1">Your Health, Our Priority.</p>
      </div>
    </footer>
  );
};

export default Footer;
