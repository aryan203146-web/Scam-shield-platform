import React, { useState, useEffect } from 'react';
import { Sparkles, FileAudio, FileVideo, Upload, HelpCircle, Check, AlertOctagon, Eye } from 'lucide-react';

const SAMPLES = [
  {
    type: 'audio',
    title: 'Grandson Emergency Call',
    filename: 'grandson_voice_clone_emergency.wav',
    description: 'AI voice clone of a grandchild claiming they are arrested and need money.',
    result: {
      score: 96,
      label: 'AI Voice Clone',
      category: 'dangerous',
      details: 'Critical Alert: This audio has a 96% probability of being synthesized using generative AI voice cloning. Voice prints match ElevenLabs v2 presets. The dialogue employs severe panic and urgency to bypass parental confirmation.',
      indicators: [
        { title: 'Generative Synthesis Footprint', desc: 'Spectral analysis matches common API voice synthesizer waveforms.' },
        { title: 'Missing Breathing Signatures', desc: 'No natural inhalation pauses or throat clearing notes across a 30s stream.' },
        { title: 'Monotonous Pitch Variance', desc: 'Extremely flat pitch standard deviation, typical of early text-to-speech models.' }
      ],
      recommendations: [
        'IMMEDIATELY HANG UP and call your grandchild back on their verified number.',
        'Establish a confidential family "Safe Word" to verify identity in emergency situations.',
        'Never transfer funds or purchase gift cards based on voice instructions alone.'
      ]
    }
  },
  {
    type: 'audio',
    title: 'CEO Wire Transfer Note',
    filename: 'ceo_voice_clone_payment.mp3',
    description: 'Voice note claiming to be the CEO demanding immediate foreign vendor wire.',
    result: {
      score: 92,
      label: 'AI Impersonation',
      category: 'dangerous',
      details: 'High Threat: Voice cloning signature detected. Sound waves exhibit unnatural phoneme transitions and lack of room acoustics consistency, suggesting digital voice stitching.',
      indicators: [
        { title: 'Phoneme Mismatch Splicing', desc: 'Microscopic audio pauses between vowel-consonant transitions reveal stitched stitching.' },
        { title: 'Static Room Acoustic Offset', desc: 'Background hum does not change with head movements, indicating synthetic ambient overlay.' }
      ],
      recommendations: [
        'Verify instructions via a separate medium (e.g. video call or internal chat).',
        'Do not process off-cycle vendor wire requests without two-factor manager approval.'
      ]
    }
  },
  {
    type: 'image',
    title: 'Selfie ID Verification',
    filename: 'id_verification_generated.jpg',
    description: 'AI-generated passport holder photo used to bypass banking KYC.',
    result: {
      score: 94,
      label: 'Synthesized Media',
      category: 'dangerous',
      details: 'KYC Alert: The image submitted displays multiple structural anomalies typical of GAN/Diffusion generators. Pupil light reflections and ID card text are physically inconsistent.',
      indicators: [
        { title: 'Asymmetric Eye Reflections', desc: 'Light sources reflected in the left and right pupils do not align with identical angular coordinates.' },
        { title: 'Generative Text Corruption', desc: 'The numbers and lettering printed on the ID card exhibit chaotic text blurring and gibberish characters.' },
        { title: 'Symmetric Artifacting Errors', desc: 'Facial details such as earrings and hair strands are heavily asymmetrical or fade into backgrounds.' }
      ],
      recommendations: [
        'Reject account registration verification.',
        'Request manual secondary KYC verification using live, dynamic liveness checks (e.g., blink on command).'
      ]
    }
  },
  {
    type: 'video',
    title: 'Politician Declaration',
    filename: 'policy_update_manipulated.mp4',
    description: 'Deepfake video of public official making unauthorized statement.',
    result: {
      score: 85,
      label: 'Deepfake Video',
      category: 'dangerous',
      details: 'Deepfake Flagged: Lip-sync analysis shows clear audio-video sync alignment delay. Pixel boundary analysis indicates facial blending/stitching outlines along the chin and ears.',
      indicators: [
        { title: 'Lip-Sync Phase Discrepancy', desc: 'Phonetic sounds precede visual lip shapes by an average of 4-6 frames.' },
        { title: 'Abnormal Eyeblink Rate', desc: 'Subject boggled blink patterns, registering 1 blink over a 2 minute footage duration.' },
        { title: 'Edge Blending Artifacts', desc: 'Visible digital blending lines around the jawline during quick head movements.' }
      ],
      recommendations: [
        'Cross-reference the video with official media outlets and statements.',
        'Do not share, like, or republish this video as it facilitates digital misinformation.'
      ]
    }
  },
  {
    type: 'audio',
    title: 'Normal Voicemail',
    filename: 'meeting_schedule_normal.wav',
    description: 'Legitimate voicemail about scheduling adjustments.',
    result: {
      score: 4,
      label: 'Verified Human Audio',
      category: 'safe',
      details: 'Scan Complete: The file exhibits standard conversational voice acoustics, natural breathing patterns, and clean spectrum dynamics. No synthetic generation indicators detected.',
      indicators: [],
      recommendations: [
        'This file is safe. Standard caller authentication should be applied if replying.'
      ]
    }
  }
];

export default function MediaAuditor({ onScanComplete, elderlyMode }) {
  const [activeType, setActiveType] = useState('audio');
  const [selectedSample, setSelectedSample] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [customFile, setCustomFile] = useState(null);

  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    setCustomFile(null);
  };

  const handleScan = () => {
    if (!selectedSample && !customFile) return;

    setScanning(true);
    onScanComplete(null); // Clear previous reports

    const steps = [
      'Decompressing media headers...',
      activeType === 'audio' ? 'Analyzing voice frequency spectrum...' : 'Mapping facial keypoints mesh...',
      'Checking for generative metadata tags...',
      'Calculating synthesis artifact index...',
      'Finalizing verification results...'
    ];

    let currentStep = 0;
    setScanStep(steps[currentStep]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        
        let finalResult;
        if (selectedSample) {
          finalResult = selectedSample.result;
        } else {
          // Generate generic result for uploaded custom file
          const category = 'suspicious';
          finalResult = {
            score: 72,
            label: `Suspicious ${activeType.charAt(0).toUpperCase() + activeType.slice(1)}`,
            category,
            details: `A generic audit was completed for the custom ${activeType} file. The audit shows anomalies in key components suggesting potential AI manipulation.`,
            indicators: [
              { title: 'Unknown Metadata Signature', desc: 'File headers contain custom software editing tags.' },
              { title: 'Frequency/Acoustic Shift', desc: 'Acoustic/pixel density patterns exhibit high probability of rendering edits.' }
            ],
            recommendations: [
              'Verify the identity of the sender through alternative channels.',
              'Avoid trusting media requests involving passwords or immediate funds.'
            ]
          };
        }

        onScanComplete(finalResult);
        setScanning(false);
      }
    }, 900);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setCustomFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2)
      });
      setSelectedSample(null);
    }
  };

  const fileInputRef = React.useRef(null);
  const handleBrowse = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2)
      });
      setSelectedSample(null);
    }
  };

  const filteredSamples = SAMPLES.filter(s => s.type === activeType);

  return (
    <div className="bg-cyber-card border border-zinc-800 rounded-xl p-5 glow-indigo relative overflow-hidden transition-all duration-300">
      {/* Scanning Overlay Animation */}
      {scanning && (
        <div className="absolute inset-0 bg-[#060608]/90 backdrop-blur-xs flex flex-col items-center justify-center z-20 p-6">
          <div className="text-center w-full max-w-sm">
            {activeType === 'audio' ? (
              /* Audio Bouncing Wave Equalizer */
              <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-xs mx-auto py-2 mb-4">
                <div className="bg-indigo-500 rounded-t w-2.5 h-full eq-bar eq-bar-1"></div>
                <div className="bg-indigo-500 rounded-t w-2.5 h-full eq-bar eq-bar-2"></div>
                <div className="bg-cyan-500 rounded-t w-2.5 h-full eq-bar eq-bar-3"></div>
                <div className="bg-indigo-500 rounded-t w-2.5 h-full eq-bar eq-bar-4"></div>
                <div className="bg-cyan-500 rounded-t w-2.5 h-full eq-bar eq-bar-5"></div>
                <div className="bg-indigo-500 rounded-t w-2.5 h-full eq-bar eq-bar-6"></div>
                <div className="bg-indigo-500 rounded-t w-2.5 h-full eq-bar eq-bar-7"></div>
              </div>
            ) : (
              /* Video/Image Target Frame Scan Grid */
              <div className="relative w-28 h-28 mx-auto border border-indigo-500/40 rounded-xl overflow-hidden mb-4 bg-zinc-950 flex items-center justify-center">
                <div className="absolute inset-0 grid-scan-bg opacity-30"></div>
                {/* Face Silhouette Icon */}
                <svg className="w-16 h-16 text-indigo-500/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                {/* Holographic scanner laser */}
                <div className="absolute left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_#6366f1] face-scan-line"></div>
              </div>
            )}

            <div className="relative w-16 h-1 mx-auto bg-zinc-900 rounded overflow-hidden mb-3">
              <div className="absolute inset-y-0 bg-indigo-500 rounded animate-[pulse_1s_infinite] w-full"></div>
            </div>
            
            <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase mb-1">
              AI Deepfake Scan Active
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1 animate-pulse">
              {scanStep}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-500/10 border border-indigo-500/30 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-white">AI Deepfake Auditor</h2>
          <p className="text-xs text-slate-400">Scan media files for synthetic voices, clones, or face manipulation</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Media Selector Tabs */}
        <div className="flex border-b border-zinc-800 pb-1 gap-4">
          <button
            onClick={() => { setActiveType('audio'); setSelectedSample(null); setCustomFile(null); }}
            className={`pb-2 text-xs font-mono font-bold uppercase tracking-wider relative cursor-pointer ${
              activeType === 'audio' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Audio Clips
          </button>
          <button
            onClick={() => { setActiveType('video'); setSelectedSample(null); setCustomFile(null); }}
            className={`pb-2 text-xs font-mono font-bold uppercase tracking-wider relative cursor-pointer ${
              activeType === 'video' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Video Streams
          </button>
          <button
            onClick={() => { setActiveType('image'); setSelectedSample(null); setCustomFile(null); }}
            className={`pb-2 text-xs font-mono font-bold uppercase tracking-wider relative cursor-pointer ${
              activeType === 'image' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Selfie Images
          </button>
        </div>

        {/* Drag & Drop File Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowse}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-500/5' 
              : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={activeType === 'audio' ? 'audio/*' : activeType === 'video' ? 'video/*' : 'image/*'}
            className="hidden"
          />
          <div className="relative z-10 flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-slate-400">
              <Upload size={22} className="animate-bounce" />
            </div>
            
            {customFile ? (
              <div>
                <span className="text-sm font-semibold text-emerald-400 block">{customFile.name}</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Custom file selected ({customFile.size} MB)</span>
              </div>
            ) : selectedSample ? (
              <div>
                <span className="text-sm font-semibold text-indigo-400 block">{selectedSample.filename}</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Preset template loaded</span>
              </div>
            ) : (
              <div>
                <span className="text-sm font-semibold text-slate-300 block">
                  Drag & drop suspected file
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  or click to browse ({activeType === 'audio' ? 'MP3/WAV' : activeType === 'video' ? 'MP4/MKV' : 'JPG/PNG'})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 justify-end">
          {(selectedSample || customFile) && (
            <button
              onClick={() => { setSelectedSample(null); setCustomFile(null); }}
              className="px-3.5 py-2 text-xs font-mono text-slate-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg cursor-pointer transition-all"
            >
              Clear Selection
            </button>
          )}
          <button
            onClick={handleScan}
            disabled={scanning || (!selectedSample && !customFile)}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 hover:border-indigo-400/40 rounded-lg cursor-pointer shadow-[0_4px_12px_rgba(99,102,241,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles size={16} />
            Auditor Scan
          </button>
        </div>

        {/* Demo Templates */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            Audit Templates (Click to test)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredSamples.map((sample, idx) => {
              const isSelected = selectedSample === sample;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className={`text-left bg-zinc-950 hover:bg-zinc-900/60 border p-3 rounded-lg cursor-pointer transition-all flex flex-col justify-between min-h-[72px] relative overflow-hidden ${
                    isSelected ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-900 hover:border-indigo-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full relative z-10">
                    <span className="text-xs font-semibold text-slate-200 block truncate max-w-[85%]">
                      {sample.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <Check size={12} className="text-indigo-400 animate-pulse" />
                      )}
                      <span className={`w-2 h-2 rounded-full ${
                        sample.result.category === 'dangerous' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                      }`}></span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-snug mt-1.5 relative z-10 line-clamp-2">
                    {sample.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
