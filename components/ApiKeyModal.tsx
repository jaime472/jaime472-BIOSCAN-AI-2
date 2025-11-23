import React, { useState } from 'react';
import NeonButton from './NeonButton';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onSave(inputKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-dark-card border-2 border-neon p-8 rounded-xl max-w-md w-full shadow-neon-strong relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{backgroundImage: 'linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
        </div>

        <h2 className="text-2xl font-bold text-neon mb-4 text-center tracking-widest uppercase">Acesso BioScan</h2>
        
        <p className="text-gray-300 text-sm mb-6 text-center leading-relaxed">
          Para utilizar o sistema de análise laboratorial 3D, é necessário uma chave de API do Google Gemini.
          <br/><br/>
          <span className="text-xs text-gray-500">Sua chave será salva apenas no seu navegador.</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-neon text-xs font-bold mb-2 uppercase">Google Gemini API Key</label>
            <input 
              type="password" 
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Cole sua chave aqui (Ex: AIzaSy...)"
              className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-neon focus:shadow-neon outline-none transition-all font-mono text-sm"
              required
            />
          </div>

          <NeonButton className="w-full" onClick={() => {}} disabled={!inputKey}>
            Acessar Sistema
          </NeonButton>
        </form>

        <div className="mt-6 text-center">
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-neon underline decoration-dotted">
            Não tem uma chave? Gere uma aqui gratuitamente
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;