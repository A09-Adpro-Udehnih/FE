import { Link } from "react-router";
import { FOOTER_LINKS } from "./const";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="px-20 flex items-center justify-between w-screen">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Udehnih</h3>
            <p className="text-sm text-muted-foreground">
              Empowering education through innovative learning solutions for
              teachers and students.
            </p>
          </div>


          {/* Social Links */}
          <div className="items-end">
            <h4 className="mb-4 text-sm font-semibold">Connect</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground w-screen">
          <p>© {new Date().getFullYear()} Udehnih. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
