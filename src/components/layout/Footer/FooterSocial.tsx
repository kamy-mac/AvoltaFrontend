import { Facebook, Linkedin, Twitter } from 'lucide-react';

export default function FooterSocial() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-8 h-8 bg-[#6A0DAD] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-white font-semibold">Avolta</span>
        </div>

        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Twitter className="w-6 h-6" />
          </a>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Avolta Belgique. Tous droits réservés.
      </div>
    </div>
  );
}