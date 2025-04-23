import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactSection = () => (
  <div>
    <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
    <ul className="space-y-3">
      <li className="flex items-center">
        <Mail className="w-5 h-5 mr-2" />
        <a href="mailto:contact@avolta.be" className="hover:text-white">contact@avolta.be</a>
      </li>
      <li className="flex items-center">
        <Phone className="w-5 h-5 mr-2" />
        <a href="tel:+32123456789" className="hover:text-white">+32 123 456 789</a>
      </li>
      <li className="flex items-center">
        <MapPin className="w-5 h-5 mr-2" />
        <span>Brussels Airport, Belgium</span>
      </li>
    </ul>
  </div>
);

export const AboutSection = () => (
  <div>
    <h3 className="text-white text-lg font-semibold mb-4">À propos de nous</h3>
    <ul className="space-y-2">
      <li>
        <Link to="/about" className="hover:text-white">Notre histoire</Link>
      </li>
      <li>
        <Link to="/mission" className="hover:text-white">Notre mission</Link>
      </li>
      <li>
        <Link to="/team" className="hover:text-white">Notre équipe</Link>
      </li>
      <li>
        <Link to="/careers" className="hover:text-white">Carrières</Link>
      </li>
    </ul>
  </div>
);

export const FAQSection = () => (
  <div>
    <h3 className="text-white text-lg font-semibold mb-4">FAQ</h3>
    <ul className="space-y-2">
      <li>
        <Link to="/faq/general" className="hover:text-white">Questions générales</Link>
      </li>
      <li>
        <Link to="/faq/services" className="hover:text-white">Nos services</Link>
      </li>
      <li>
        <Link to="/faq/partnership" className="hover:text-white">Partenariats</Link>
      </li>
      <li>
        <Link to="/support" className="hover:text-white">Support</Link>
      </li>
    </ul>
  </div>
);

export const LegalSection = () => (
  <div>
    <h3 className="text-white text-lg font-semibold mb-4">Légal</h3>
    <ul className="space-y-2">
      <li>
        <Link to="/privacy" className="hover:text-white">Politique de confidentialité</Link>
      </li>
      <li>
        <Link to="/cookies" className="hover:text-white">Politique des cookies</Link>
      </li>
      <li>
        <Link to="/terms" className="hover:text-white">Conditions d'utilisation</Link>
      </li>
      <li>
        <Link to="/rgpd" className="hover:text-white">RGPD</Link>
      </li>
    </ul>
  </div>
);