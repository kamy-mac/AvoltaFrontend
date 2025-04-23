import { useState } from 'react';
import { Send, Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import TeamGrid from '../components/home/TeamGrid';

export default function ContactContainer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Préparer les données pour Formspree
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Envoyer le formulaire via Formspree
      const response = await fetch('https://formspree.io/f/xvojrwzl', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Succès
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        // Erreur
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset le statut après 5 secondes
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto my-12">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Section d'informations de contact */}
        <div className="bg-[#8F53F0]/30 text-white p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>
          <p className="text-white mb-8">
            Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question ou demande.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-[#8F53F0] p-3 rounded-full mr-4">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-white mt-1">reception-airport@autogrill.net</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#8F53F0] p-3 rounded-full mr-4">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Téléphone</h3>
                <p className="text-white mt-1">+32 499 393 695</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#8F53F0] p-3 rounded-full mr-4">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Adresse</h3>
                <p className="text-white mt-1"> Autogrill Belgie,<br/> Luchthaven Brussel Nationaal 1M, Compass Building 1930 Zaventem</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="font-medium mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-[#8F53F0] p-3 rounded-full hover:bg-[#8F53F0] transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-[#8F53F0] p-3 rounded-full hover:bg-[#8F53F0] transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="bg-[#8F53F0] p-3 rounded-full hover:bg-[#8F53F0] transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Formulaire de contact */}
        <div className="col-span-2 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Envoyez-nous un message</h2>
          
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Votre message a été envoyé avec succès à kamyteukam@yahoo.com
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Une erreur s'est produite. Veuillez réessayer ou nous contacter directement par email ou par télephone .
            </div>
          )}
          
          {/* Formulaire Formspree */}
          <form 
            action="https://formspree.io/f/xvojrwzl" 
            method="POST"
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {/* Champs cachés pour Formspree */}
            <input type="hidden" name="_subject" value="Nouveau message du site Avolta" />
            <input type="hidden" name="_replyto" value={formData.email} />
            <input type="hidden" name="_cc" value="reception-airport@autogrill.net" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] focus:border-transparent"
                placeholder="Sujet de votre message"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] focus:border-transparent resize-none"
                placeholder="Votre message..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                inline-flex items-center px-6 py-3 bg-[#8F53F0] text-white rounded-md font-medium
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#8F53F0]'} 
                transition-colors duration-300
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Envoyer
                </>
              )}
            </button>
          </form>
          <TeamGrid/>
        </div>
      </div>
      {/* Decorative Elements  */}
      {/* <!-- Container Avolta Journey avec Tailwind CSS --> */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            {/* <!-- Text Content --> */}
            <div className="w-full lg:w-2/5 pr-0 lg:pr-8 mb-8 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold  mb-6 leading-tight">
                Continuez votre voyage.
              </h2>
              <div className="text-white text-opacity-90 mb-8">
                <p>
                  Chez Avolta, nous plaçons les voyageurs au cœur de notre
                  activité. Réactifs face à l'évolution de leurs besoins, nous
                  offrons une valeur inégalée à chaque étape de leur voyage,
                  avec pour mission ultime de réinventer le voyage ensemble.
                  Nous faisons de chaque voyage une expérience aussi
                  enrichissante que la destination.
                </p>
              </div>
              
               <a href="https://www.avoltaworld.com/en/meet-avolta"
                className="inline-flex items-center px-6 py-2 border border-primary rounded-full text-sm font-medium text-white bg-[#8F53F0] hover:bg-black hover:bg-opacity-75 transition-colors duration-200"
              >
                Découvrez notre histoire
              </a>
            </div>

            {/* <!-- Images Container --> */}
            <div className="w-full lg:w-3/5 grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden h-48 sm:h-64 md:h-72">
                <img
                  src="public\images\image decouvre histoire container.jpg"
                  alt="Femme avec des écouteurs et des lunettes de soleil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden h-48 sm:h-64 md:h-72">
                <img
                  src="public\images\continuez votre voyage container.jpg"
                  alt="Fenêtre d'avion vue de l'intérieur"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  
  );
}