import React, { useState } from 'react';
import { ExamItem } from '../types';

interface ExamCardProps {
  item: ExamItem;
  index: number;
}

const ExamCard: React.FC<ExamCardProps> = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL': return 'text-neon border-neon shadow-[0_0_10px_#39ff14]';
      case 'ALTERADO': return 'text-yellow-400 border-yellow-400 shadow-[0_0_10px_#facc15]';
      case 'CRITICO': return 'text-red-500 border-red-500 shadow-[0_0_15px_#ef4444]';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const statusColorClass = getStatusColor(item.status);
  
  // Animation delay for staggered appearance
  const delayStyle = { animationDelay: `${index * 100}ms` };

  return (
    <div 
      style={delayStyle}
      className={`relative mb-6 group perspective-container animate-[fadeInUp_0.5s_ease-out_forwards] opacity-0 translate-y-4`}
    >
      <div 
        className={`
          relative bg-dark-card border-l-4 p-6 transition-all duration-300 transform 
          hover:translate-x-2 hover:bg-slate-900
          ${statusColorClass.replace('text-', 'border-').split(' ')[1]} 
          ${item.status === 'NORMAL' ? 'border-l-neon' : item.status === 'CRITICO' ? 'border-l-red-500' : 'border-l-yellow-400'}
        `}
      >
        {/* Header Section of Card */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">{item.nomeExame}</h3>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${statusColorClass} bg-opacity-10 bg-black mt-2 inline-block`}>
              {item.status}
            </span>
          </div>
          <div className="text-right font-mono">
            <div className="text-2xl font-bold text-white">
              {item.valorMedido} <span className="text-sm text-gray-500">{item.unidade}</span>
            </div>
            <div className="text-xs text-gray-500">
              Ref: {item.valorReferencia}
            </div>
          </div>
        </div>

        {/* Action to Expand */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-400 hover:text-white underline decoration-dotted mb-2 focus:outline-none"
        >
          {isExpanded ? '- Recolher Análise' : '+ Ver Análise Profunda'}
        </button>

        {/* Detailed Content */}
        <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="min-h-0 space-y-4 border-t border-gray-800 pt-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meaning */}
              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h4 className="text-neon text-sm font-bold uppercase mb-2 flex items-center">
                  <span className="w-2 h-2 bg-neon rounded-full mr-2"></span>
                  Significado Clínico
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.significadoClinico}
                </p>
              </div>

              {/* Explanation */}
              <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h4 className={`text-sm font-bold uppercase mb-2 flex items-center ${item.status === 'NORMAL' ? 'text-blue-400' : 'text-yellow-400'}`}>
                   <span className={`w-2 h-2 rounded-full mr-2 ${item.status === 'NORMAL' ? 'bg-blue-400' : 'bg-yellow-400'}`}></span>
                   Interpretação
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.explicacaoDetalhada}
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-neon/5 p-4 rounded border border-neon/20">
              <h4 className="text-white text-sm font-bold uppercase mb-1">Dica de Saúde</h4>
              <p className="text-gray-400 text-sm italic">
                "{item.recomendacaoGeral}"
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
