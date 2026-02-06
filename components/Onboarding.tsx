
import React, { useState, useRef, useEffect } from 'react';
import useLocation from '../hooks/useLocation';
import { GoldIcon, CheckCircleIcon, ArrowRightIcon } from './icons/Icons';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [curp, setCurp] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  const { location, error, requesting, getLocation } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access is required for biometric verification.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  useEffect(() => {
    if (step === 3) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);


  const handleBiometricScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setStep(4);
      setIsScanning(false);
    }, 2000);
  };
  
  const renderStep = () => {
    switch (step) {
      case 1: // Geolocation
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Geolocation Verification</h2>
            <p className="text-gray-300 mb-6">We need to confirm you are in Mexico to proceed.</p>
            <button
              onClick={getLocation}
              disabled={requesting || !!location}
              className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors disabled:bg-gray-600 flex items-center justify-center"
            >
              {requesting && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-3"></div>}
              {location ? 'Location Verified' : 'Verify Location'}
            </button>
            {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
            {location && (
              <div className="mt-4 text-green-400 flex items-center justify-center space-x-2">
                <CheckCircleIcon />
                <span>Successfully verified location in Mexico.</span>
              </div>
            )}
            {location && (
              <button onClick={() => setStep(2)} className="mt-6 text-yellow-400 font-semibold flex items-center justify-center w-full">
                Next <ArrowRightIcon />
              </button>
            )}
          </div>
        );
      case 2: // CURP
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Personal Information</h2>
            <p className="text-gray-300 mb-6">Please enter your CURP.</p>
            <input
              type="text"
              value={curp}
              onChange={(e) => setCurp(e.target.value.toUpperCase())}
              placeholder="Enter your 18-digit CURP"
              maxLength={18}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white text-center tracking-widest focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
            />
            <button
              onClick={() => setStep(3)}
              disabled={curp.length !== 18}
              className="mt-6 w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors disabled:bg-gray-600"
            >
              Next
            </button>
          </div>
        );
      case 3: // Biometrics
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Facial Biometrics</h2>
            <p className="text-gray-300 mb-4">Center your face in the frame.</p>
            <div className="w-64 h-64 mx-auto bg-gray-800 rounded-full overflow-hidden border-4 border-gray-600">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]"></video>
            </div>
            <button
              onClick={handleBiometricScan}
              disabled={isScanning}
              className="mt-6 w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors disabled:bg-gray-600 flex items-center justify-center"
            >
              {isScanning && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-3"></div>}
              {isScanning ? 'Scanning...' : 'Scan Face'}
            </button>
          </div>
        );
      case 4: // Complete
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 text-green-400">
              <CheckCircleIcon />
            </div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Onboarding Complete</h2>
            <p className="text-gray-300 mb-6">Welcome to GoldPayments. Your $1,000.00 MXN bonus is now available.</p>
            <button
              onClick={onComplete}
              className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto text-center mb-12">
        <GoldIcon className="mx-auto h-12 w-12" />
        <h1 className="text-4xl font-bold text-yellow-400 tracking-wider mt-4">GoldPayments</h1>
        <p className="text-gray-400 mt-2">The future of premium finance.</p>
      </div>
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/5 animate-fade-in">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
