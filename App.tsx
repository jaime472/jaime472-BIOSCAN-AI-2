import React, { useState, useEffect } from 'react';
import UploadSection from './components/UploadSection';
import ExamCard from './components/ExamCard';
import NeonButton from './components/NeonButton';
import ApiKeyModal from './components/ApiKeyModal';
import { analyzeExamPdf } from './services/geminiService';
import { AnalysisResponse } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tenta recuperar a chave do localStorage ao iniciar
    const storedKey = localStorage.getItem('bioscan_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem('bioscan_api_key', key);
    setApiKey(key);
  };

  const handleFileSelect = async (file: File) => {
    if (!apiKey) return;

    setIsProcessing(true);
    setError(null);
    setAnalysis(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64String = reader.result as string;
        // Remove data url prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(',')[1];

        try {
          // Passamos a apiKey dinamicamente aqui
          const result = await analyzeExamPdf(base64Content, apiKey);
          setAnalysis(result);
        } catch (err: any) {
          setError("Falha ao analisar o documento com a IA. " + (err.message || "Verifique se o PDF é válido e legível."));
          // Se o erro for de permissão, talvez a chave seja inválida
          if (err.message && (err.message.includes('403') || err.message.includes('key'))) {
             localStorage.removeItem('bioscan_api_key');
             setApiKey(null);
             setError("Chave de API inválida. Por favor, insira novamente.");
          }
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setError("Erro ao ler o arquivo.");
        setIsProcessing(false);
      };

    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      setIsProcessing(false);
    }
  };

  const resetApp = () => {
    setAnalysis(null);
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem('bioscan_api_key');
    setApiKey(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 selection:bg-neon selection:text-black overflow-x-hidden flex flex-col">
      
      {/* Modal para pedir a chave se não existir */}
      {!apiKey && <ApiKeyModal onSave={handleSaveKey} />}

      {/* Background Mesh/Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10" 
           style={{
             backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg)',
             transformOrigin: 'top center'
           }}>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10 flex-grow w-full">
        
        {/* Header */}
        <header className="text-center mb-16 perspective-container relative">
          {apiKey && (
            <button 
              onClick={logout} 
              className="absolute top-0 right-0 text-xs text-gray-600 hover:text-red-500 uppercase tracking-wider border border-gray-800 p-1 rounded hover:border-red-500 transition-colors"
            >
              Trocar Chave API
            </button>
          )}
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            BIOSCAN <span className="text-neon drop-shadow-[0_0_15px_rgba(57,255,20,0.8)]">AI</span>
          </h1>
          <div className="h-1 w-32 bg-neon mx-auto mb-6 shadow-[0_0_15px_#39ff14]"></div>
          <p className="text-xl text-gray-400 font-light tracking-widest uppercase">
            Sistema Avançado de Interpretação Laboratorial
          </p>
        </header>

        {/* Main Content Area */}
        <main>
          {apiKey && !analysis && !isProcessing && (
             <UploadSection onFileSelect={handleFileSelect} isProcessing={isProcessing} />
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8">
              {/* Custom Neon Spinner */}
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-neon border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin shadow-[0_0_15px_#39ff14]"></div>
                <div className="absolute inset-4 border-4 border-gray-800 rounded-full"></div>
                <div className="absolute inset-4 border-4 border-t-transparent border-r-transparent border-b-neon border-l-transparent rounded-full animate-spin-reverse opacity-70"></div>
              </div>
              <p className="text-neon font-mono animate-pulse text-lg">ANALISANDO DADOS BIOMÉTRICOS...</p>
              <div className="text-xs text-gray-500 font-mono w-64 text-center">
                Decodificando parâmetros sanguíneos e correlacionando com padrões clínicos.
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-lg mx-auto p-6 border border-red-500 bg-red-500/10 rounded-lg text-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <h3 className="text-red-500 font-bold text-xl mb-2">ERRO NO SISTEMA</h3>
              <p className="text-gray-300 mb-6">{error}</p>
              <NeonButton onClick={resetApp} className="!border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white hover:!shadow-[0_0_15px_#ef4444]">
                Tentar Novamente
              </NeonButton>
            </div>
          )}

          {analysis && (
            <div className="animate-fade-in-up">
              
              {/* Patient Info Bar */}
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-4">
                 <div>
                    <h2 className="text-neon text-sm uppercase font-bold mb-1">Paciente</h2>
                    <div className="text-2xl text-white font-mono">{analysis.paciente || "Não Identificado"}</div>
                 </div>
                 <div className="text-right mt-4 md:mt-0">
                    <h2 className="text-gray-500 text-xs uppercase font-bold mb-1">Data da Análise</h2>
                    <div className="text-lg text-gray-300 font-mono">{analysis.dataExame || new Date().toLocaleDateString()}</div>
                 </div>
              </div>

              {/* General Summary */}
              <div className="bg-gradient-to-r from-gray-900 to-black border-l-4 border-neon p-6 mb-12 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-neon/10 transition-colors"></div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Resumo Clínico da IA
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {analysis.resumoGeral}
                </p>
              </div>

              {/* List of Results */}
              <div className="space-y-4">
                <h3 className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-6 border-b border-gray-800 pb-2">
                  Detalhamento Parâmetro a Parâmetro
                </h3>
                
                {analysis.exames.map((item, index) => (
                  <ExamCard key={index} item={item} index={index} />
                ))}
              </div>

              {/* Reset */}
              <div className="mt-16 text-center border-t border-gray-800 pt-8 pb-10">
                <NeonButton onClick={resetApp}>
                  Analisar Novo Documento
                </NeonButton>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* Developer Footer */}
      <footer className="w-full bg-black/80 border-t border-gray-900 py-6 text-center relative z-20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center space-y-2">
          <p className="text-gray-500 text-sm font-mono tracking-widest">
            DESENVOLVIDO POR <span className="text-neon font-bold">JAIME EDUARDO</span>
          </p>
          <div className="flex items-center space-x-2 text-gray-600 text-xs">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
               <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Whats: 51985502897</span>
          </div>
          <p className="text-xs text-gray-700 mt-2 max-w-lg">
            AVISO LEGAL: Este sistema utiliza IA. Resultados para fins informativos.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;