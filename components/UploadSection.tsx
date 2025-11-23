import React, { ChangeEvent, useState } from 'react';
import NeonButton from './NeonButton';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect, isProcessing }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 animate-fade-in perspective-container">
      <div className="relative group transform transition-transform duration-500 hover:rotate-x-12 p-10 border border-neon/30 bg-dark-card/50 backdrop-blur-sm rounded-xl shadow-neon text-center max-w-lg w-full">
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-neon"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-neon"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-neon"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-neon"></div>

        <h2 className="text-2xl font-bold text-neon mb-4 tracking-wider">UPLOAD DO EXAME</h2>
        <p className="text-gray-400 mb-8 font-mono text-sm">
          Selecione o arquivo PDF do seu exame laboratorial. Nossa IA fará a decodificação completa.
        </p>

        <NeonButton component="label" htmlFor="file-upload" disabled={isProcessing}>
          {isProcessing ? 'PROCESSANDO...' : 'ESCOLHER ARQUIVO PDF'}
        </NeonButton>
        
        <input 
          id="file-upload" 
          type="file" 
          accept="application/pdf" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={isProcessing}
        />

        {fileName && (
          <div className="mt-6 p-2 bg-neon/10 border border-neon/20 rounded text-neon font-mono text-sm">
            ARQUIVO SELECIONADO: {fileName}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
