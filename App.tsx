import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import ExamCard from './components/ExamCard';
import NeonButton from './components/NeonButton';
import { analyzeExamPdf } from './services/geminiService';
import { AnalysisResponse } from './types';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
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
          const result = await analyzeExamPdf(base64Content);
          setAnalysis(result);
        } catch (err) {
          setError("Falha ao analisar o documento com a IA. Verifique se o PDF é válido e legível.");
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

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 selection:bg-neon selection:text-black overflow-x-hidden">
      
      {/* Background Mesh/Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10" 
           style={{
             backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg)',
             transformOrigin: 'top center'
           }}>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        
        {/* Header */}
        <header className="text-center mb-16 perspective-container">
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
          {!analysis && !isProcessing && (
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

              {/* Footer / Reset */}
              <div className="mt-16 text-center border-t border-gray-800 pt-8 pb-20">
                <NeonButton onClick={resetApp}>
                  Analisar Novo Documento
                </NeonButton>
                
                <p className="mt-8 text-xs text-gray-600 max-w-2xl mx-auto">
                  AVISO LEGAL: Este sistema utiliza Inteligência Artificial para interpretar dados. 
                  As informações aqui apresentadas são apenas para fins educativos e informativos. 
                  NÃO substituem o diagnóstico ou aconselhamento de um médico profissional. 
                  Consulte sempre seu médico para interpretação oficial dos exames.
                </p>
              </div>

            </div>
          )}
        </main>
      </div>

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
