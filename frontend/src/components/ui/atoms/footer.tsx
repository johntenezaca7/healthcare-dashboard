const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="px-4 py-6 md:ml-64">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Healthcare Dashboard. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
