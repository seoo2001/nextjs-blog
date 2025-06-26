export const Footer = () => {
    return (
        <footer className="py-8">
            <div className="flex">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} DongJoon Seo
                </p>
                <div className="flex-1"></div>
                <div className="flex">
                <p className="text-sm mr-4">
                    <a href="mailto:seoo2001@gmail.com" target="_blank" rel="noreferrer" className="underline">
                        Contact
                    </a>
                </p>
                </div>
                <div className="flex">
                <p className="text-sm mr-4">
                    <a href="https://github.com/seoo2001" target="_blank" rel="noreferrer" className="underline">
                        GitHub
                    </a>
                </p>
                </div>
            </div>
        </footer>
    );
};
