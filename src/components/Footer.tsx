export const Footer = () => {
    return (
        <footer className="py-8">
            <div className="flex justify-between items-center">
            <p className="text-sm">
                &copy; {new Date().getFullYear()} DongJoon Seo
            </p>
            <p className="text-sm">
                <a href="https://github.com/seoo2001" target="_blank" rel="noreferrer">
                    GitHub
                </a>
            </p>
            </div>
        </footer>
    );
};