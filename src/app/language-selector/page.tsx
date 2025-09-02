import Link from 'next/link';

export default function LanguageSelector() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">
          André Filipe de Moraes Goulart
        </h1>
        <p className="text-xl mb-8">Senior Software Engineer</p>
        <p className="text-gray-400 mb-8">Escolha seu idioma / Choose your language</p>
        
        <div className="flex gap-6 justify-center">
          <Link 
            href="/pt" 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            🇧🇷 Português
          </Link>
          <Link 
            href="/en" 
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
          >
            🇺🇸 English
          </Link>
        </div>
      </div>
    </div>
  );
}