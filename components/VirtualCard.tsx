
import React, { useState, useEffect } from 'react';
import { GoldIcon, EyeIcon, EyeOffIcon } from './icons/Icons';

interface VirtualCardProps {
  userName: string;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ userName }) => {
  const [cvv, setCvv] = useState('***');
  const [isCvvVisible, setIsCvvVisible] = useState(false);

  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with a browser-compatible timer handling
    // and corrected the logic to only set/clear timeout when CVV is visible.
    if (isCvvVisible) {
      const newCvv = Math.floor(100 + Math.random() * 900).toString();
      setCvv(newCvv);
      const timerId = setTimeout(() => {
        setIsCvvVisible(false);
        setCvv('***');
      }, 5000); // Hide CVV after 5 seconds
      return () => clearTimeout(timerId);
    }
  }, [isCvvVisible]);

  return (
    <div className="w-full aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-2xl p-6 flex flex-col justify-between text-white shadow-lg shadow-yellow-500/10 border border-yellow-500/30 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 rounded-full filter blur-2xl"></div>
      <div className="flex justify-between items-start">
        <GoldIcon />
        <span className="font-mono text-lg tracking-widest">VCN</span>
      </div>
      <div className="z-10">
        <p className="font-mono text-2xl tracking-wider">
          4000 1234 5678 9010
        </p>
      </div>
      <div className="flex justify-between items-end z-10">
        <div>
          <p className="text-xs text-gray-400">Card Holder</p>
          <p className="font-medium uppercase tracking-wider">{userName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Expires</p>
          <p className="font-medium">12/28</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">CVV</p>
          <div className="flex items-center space-x-2">
            <p className="font-mono text-lg w-12 text-center">{cvv}</p>
            <button onClick={() => setIsCvvVisible(!isCvvVisible)} className="text-gray-400 hover:text-white">
              {isCvvVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
