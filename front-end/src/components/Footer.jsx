const Footer = () => {
  return (
    <footer className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 text-center">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} DevMarket. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
