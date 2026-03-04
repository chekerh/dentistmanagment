import { useState } from 'react';

// Tooth numbering: Universal (FDI) system
// Permanent: 11-18 (upper right), 21-28 (upper left), 31-38 (lower left), 41-48 (lower right)
// Deciduous: 51-55 (upper right), 61-65 (upper left), 71-75 (lower left), 81-85 (lower right)

interface ToothData {
  number: number;
  status: 'healthy' | 'treated' | 'cavity' | 'missing' | 'crown';
  notes?: string;
}

interface DentalChartProps {
  selectedToothNumber?: number;
  onToothSelect?: (toothNumber: number) => void;
  toothData?: ToothData[];
}

export default function DentalChart({ selectedToothNumber, onToothSelect, toothData = [] }: DentalChartProps) {
  const [chartType, setChartType] = useState<'permanent' | 'deciduous'>('permanent');

  const permanentTeeth = {
    upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
    upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
    lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
    lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
  };

  const deciduousTeeth = {
    upperRight: [55, 54, 53, 52, 51],
    upperLeft: [61, 62, 63, 64, 65],
    lowerLeft: [71, 72, 73, 74, 75],
    lowerRight: [85, 84, 83, 82, 81],
  };

  const teeth = chartType === 'permanent' ? permanentTeeth : deciduousTeeth;

  const getToothStatus = (toothNumber: number): ToothData['status'] => {
    const data = toothData.find(t => t.number === toothNumber);
    return data?.status || 'healthy';
  };

  const getToothColor = (status: ToothData['status'], isSelected: boolean) => {
    if (isSelected) return 'fill-primary stroke-primary';
    
    switch (status) {
      case 'treated':
        return 'fill-green-500/40 stroke-green-500';
      case 'cavity':
        return 'fill-red-500/40 stroke-red-500';
      case 'crown':
        return 'fill-yellow-500/40 stroke-yellow-500';
      case 'missing':
        return 'fill-slate-700 stroke-slate-500';
      default:
        return 'fill-slate-800/30 stroke-slate-600 hover:fill-primary/20 hover:stroke-primary';
    }
  };

  const ToothSVG = ({ number, position }: { number: number; position: { x: number; y: number } }) => {
    const status = getToothStatus(number);
    const isSelected = selectedToothNumber === number;
    const colorClass = getToothColor(status, isSelected);

    return (
      <g
        onClick={() => onToothSelect?.(number)}
        className="cursor-pointer transition-all duration-200"
      >
        {/* Simplified tooth shape */}
        <rect
          x={position.x}
          y={position.y}
          width="24"
          height="36"
          rx="4"
          className={colorClass}
          strokeWidth="2"
        />
        {/* Tooth number */}
        <text
          x={position.x + 12}
          y={position.y + 22}
          className="text-[9px] fill-slate-300 font-medium"
          textAnchor="middle"
        >
          {number}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-4 md:p-6">
      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Dental Chart</h3>
        <div className="flex gap-1 bg-background-dark rounded-lg p-1 border border-border-dark">
          <button
            onClick={() => setChartType('permanent')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              chartType === 'permanent'
                ? 'bg-primary text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Permanent
          </button>
          <button
            onClick={() => setChartType('deciduous')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              chartType === 'deciduous'
                ? 'bg-primary text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Deciduous
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="flex items-center justify-center py-4 md:py-8">
        <svg
          viewBox="0 0 700 400"
          className="w-full max-w-3xl"
          style={{ maxHeight: '400px' }}
        >
          {/* Upper teeth */}
          <g>
            {/* Upper Right */}
            {teeth.upperRight.map((num, i) => (
              <ToothSVG key={num} number={num} position={{ x: 50 + i * 36, y: 50 }} />
            ))}
            {/* Upper Left */}
            {teeth.upperLeft.map((num, i) => (
              <ToothSVG key={num} number={num} position={{ x: 370 + i * 36, y: 50 }} />
            ))}
          </g>

          {/* Center line */}
          <line x1="350" y1="40" x2="350" y2="360" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

          {/* Lower teeth */}
          <g>
            {/* Lower Left */}
            {teeth.lowerLeft.map((num, i) => (
              <ToothSVG key={num} number={num} position={{ x: 370 + i * 36, y: 310 }} />
            ))}
            {/* Lower Right */}
            {teeth.lowerRight.map((num, i) => (
              <ToothSVG key={num} number={num} position={{ x: 50 + i * 36, y: 310 }} />
            ))}
          </g>

          {/* Labels */}
          <text x="180" y="30" className="text-xs fill-slate-400" textAnchor="middle">Upper Right</text>
          <text x="520" y="30" className="text-xs fill-slate-400" textAnchor="middle">Upper Left</text>
          <text x="520" y="380" className="text-xs fill-slate-400" textAnchor="middle">Lower Left</text>
          <text x="180" y="380" className="text-xs fill-slate-400" textAnchor="middle">Lower Right</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-border-dark text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-800/30 border border-slate-600"></div>
          <span className="text-slate-400">Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500/40 border border-green-500"></div>
          <span className="text-slate-400">Treated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500/40 border border-red-500"></div>
          <span className="text-slate-400">Decay</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500/40 border border-yellow-500"></div>
          <span className="text-slate-400">Crown</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-700 border border-slate-500"></div>
          <span className="text-slate-400">Missing</span>
        </div>
      </div>
    </div>
  );
}
