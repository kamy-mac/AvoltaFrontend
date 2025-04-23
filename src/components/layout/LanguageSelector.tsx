import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'nl', name: 'Nederlands' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    void i18n.changeLanguage(langCode);
  };

  return (
    <div className="relative group">
      <button className="p-2 rounded-full hover:bg-gray-100">
        <Globe className="w-5 h-5 text-[#6A0DAD]" />
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                i18n.language === lang.code
                  ? 'bg-[#6A0DAD] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}