import React from "react";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

interface FooterProps {
  currentLanguage: "en" | "fr";
}

const Footer: React.FC<FooterProps> = ({ currentLanguage }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-teal-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Casa Wonders</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {currentLanguage === "en"
                ? "Discover the authentic experiences and hidden gems of Casablanca with our curated platform."
                : "Découvrez les expériences authentiques et les joyaux cachés de Casablanca avec notre plateforme organisée."}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {currentLanguage === "en" ? "Quick Links" : "Liens Rapides"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {currentLanguage === "en" ? "Home" : "Accueil"}
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {currentLanguage === "en" ? "Explore" : "Explorer"}
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {currentLanguage === "en" ? "Wishlist" : "Favoris"}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {currentLanguage === "en" ? "About Us" : "À Propos"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-accent" />
              <span>
                {currentLanguage === "en" ? "Partners" : "Partenaires"}
              </span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/partner/register"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {currentLanguage === "en"
                    ? "Become a Partner"
                    : "Devenir Partenaire"}
                </Link>
              </li>
              <li>
                <Link
                  href="/partner/login"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {currentLanguage === "en"
                    ? "Partner Login"
                    : "Connexion Partenaire"}
                </Link>
              </li>
              <li>
                <Link
                  href="/partner"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {currentLanguage === "en"
                    ? "Partner Dashboard"
                    : "Tableau de Bord"}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:partners@casawonders.com"
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {currentLanguage === "en"
                    ? "Partner Support"
                    : "Support Partenaire"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {currentLanguage === "en" ? "Contact" : "Contact"}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-accent" />
                <a
                  href="mailto:hello@casawonders.com"
                  className="hover:text-accent transition-colors"
                >
                  hello@casawonders.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-accent" />
                <span>+212 522 123 456</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 text-accent mt-1" />
                <span>
                  Boulevard Mohammed V<br />
                  Casablanca, Morocco
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Casa Wonders.{" "}
              {currentLanguage === "en"
                ? "All rights reserved."
                : "Tous droits réservés."}
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-accent transition-colors text-sm"
              >
                {currentLanguage === "en"
                  ? "Privacy Policy"
                  : "Politique de Confidentialité"}
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-accent transition-colors text-sm"
              >
                {currentLanguage === "en"
                  ? "Terms of Service"
                  : "Conditions d'Utilisation"}
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-accent transition-colors text-sm"
              >
                {currentLanguage === "en"
                  ? "Cookie Policy"
                  : "Politique des Cookies"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
