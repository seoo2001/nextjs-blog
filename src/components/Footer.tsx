export const Footer = () => {
  return (
    <footer className="py-8">
      <div className="flex items-center text-sm">
        <p>&copy; {new Date().getFullYear()} DongJoon Seo</p>
        <div className="flex-1" />
        <a
          href="mailto:seoo2001@gmail.com"
          className="mr-4 underline hover:opacity-70 transition-opacity"
        >
          Contact
        </a>
        <a
          href="https://github.com/seoo2001"
          target="_blank"
          rel="noreferrer"
          className="underline hover:opacity-70 transition-opacity"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};
