import { ContactSection, AboutSection, FAQSection, LegalSection } from './FooterLinks';
import FeedbackForm from './FeedbackForm';
import FooterSocial from './FooterSocial';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <ContactSection />
          <AboutSection />
          <FAQSection />
          <LegalSection />
          <div className="md:col-span-2 lg:col-span-1">
            <FeedbackForm />
          </div>
        </div>
        <FooterSocial />
      </div>
    </footer>
  );
}