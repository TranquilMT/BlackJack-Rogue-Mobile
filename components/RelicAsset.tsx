
import React from 'react';
import { RelicId } from '../types';

interface RelicAssetProps {
  id: RelicId;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const RelicAsset: React.FC<RelicAssetProps> = ({ id, className, width = 64, height = 64 }) => {
  const commonProps = {
    width,
    height,
    className,
    viewBox: "0 0 100 100",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  const renderIcon = () => {
    switch (id) {
        case RelicId.GoldenKnuckles:
            return (
                <g>
                    <defs>
                        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fcd34d" />
                            <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                    </defs>
                    <path d="M20 40 C20 30 30 20 40 20 H60 C70 20 80 30 80 40 V50 H90 V70 H80 V80 H20 V70 H10 V50 H20 Z" fill="url(#goldGrad)" stroke="#78350f" strokeWidth="3" />
                    <circle cx="30" cy="40" r="6" fill="#78350f" />
                    <circle cx="50" cy="35" r="6" fill="#78350f" />
                    <circle cx="70" cy="40" r="6" fill="#78350f" />
                    <rect x="25" y="60" width="50" height="10" rx="2" fill="#92400e" />
                </g>
            );
        case RelicId.GamblersChip:
            return (
                <g>
                    <circle cx="50" cy="50" r="40" fill="#1f2937" stroke="#eab308" strokeWidth="4" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="10 5" />
                    <path d="M50 30 L55 45 H45 Z" fill="#eab308" />
                    <path d="M50 70 L55 55 H45 Z" fill="#eab308" transform="rotate(180 50 70)" />
                    <path d="M30 50 L45 45 V55 Z" fill="#eab308" />
                    <path d="M70 50 L55 45 V55 Z" fill="#eab308" transform="rotate(180 70 50)" />
                </g>
            );
        case RelicId.FirstAidKit:
            return (
                <g>
                    <rect x="20" y="30" width="60" height="50" rx="5" fill="#f87171" stroke="#991b1b" strokeWidth="3" />
                    <path d="M40 30 V20 H60 V30" fill="none" stroke="#991b1b" strokeWidth="4" />
                    <rect x="42" y="45" width="16" height="20" fill="white" />
                    <rect x="30" y="52" width="40" height="6" fill="white" />
                </g>
            );
        case RelicId.SplittersCharm:
            return (
                <g>
                    <path d="M50 15 L80 40 L50 85 L20 40 Z" fill="#a855f7" stroke="#581c87" strokeWidth="3" />
                    <path d="M50 15 L50 85" stroke="#fcd34d" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="50" cy="40" r="10" fill="#fcd34d" stroke="#b45309" strokeWidth="2" />
                </g>
            );
        case RelicId.RubyLense:
            return (
                <g>
                    <circle cx="50" cy="50" r="35" fill="#dc2626" stroke="#7f1d1d" strokeWidth="4" opacity="0.8" />
                    <circle cx="65" cy="35" r="10" fill="white" opacity="0.3" />
                    <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50" stroke="#fcd34d" strokeWidth="3" />
                </g>
            );
        case RelicId.Hourglass:
            return (
                <g>
                    <path d="M30 10 H70 L55 50 L70 90 H30 L45 50 L30 10 Z" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="3" opacity="0.6" />
                    <path d="M30 10 H70" stroke="#b45309" strokeWidth="4" />
                    <path d="M30 90 H70" stroke="#b45309" strokeWidth="4" />
                    <circle cx="50" cy="70" r="5" fill="#fcd34d" />
                </g>
            );
        case RelicId.SharpeningStone:
            return (
                <g>
                    <rect x="25" y="30" width="50" height="40" fill="#57534e" stroke="#292524" strokeWidth="3" rx="2" />
                    <path d="M10 70 L90 70 L80 90 H20 Z" fill="#44403c" stroke="#292524" strokeWidth="2" />
                    <path d="M30 40 L70 60" stroke="#a8a29e" strokeWidth="2" />
                </g>
            );
        case RelicId.JadeFigurine:
            return (
                <g>
                    <path d="M35 80 L65 80 L60 30 L50 20 L40 30 Z" fill="#10b981" stroke="#064e3b" strokeWidth="3" />
                    <circle cx="50" cy="20" r="8" fill="#34d399" stroke="#064e3b" strokeWidth="2" />
                    <path d="M40 30 L30 50 L40 55" fill="none" stroke="#064e3b" strokeWidth="3" />
                    <path d="M60 30 L70 50 L60 55" fill="none" stroke="#064e3b" strokeWidth="3" />
                </g>
            );
        case RelicId.ReflectiveShield:
            return (
                <g>
                    <path d="M50 10 L85 25 V50 C85 75 50 90 50 90 C50 90 15 75 15 50 V25 L50 10 Z" fill="url(#silverGrad)" stroke="#1e40af" strokeWidth="3" />
                    <defs>
                        <linearGradient id="silverGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#e5e7eb" />
                            <stop offset="100%" stopColor="#9ca3af" />
                        </linearGradient>
                    </defs>
                    <path d="M50 20 L75 40 L60 70" fill="none" stroke="white" strokeWidth="3" opacity="0.6" />
                </g>
            );
        case RelicId.CardCountersGuide:
            return (
                <g>
                    <rect x="25" y="20" width="50" height="60" fill="#78350f" stroke="#451a03" strokeWidth="3" rx="2" />
                    <line x1="30" y1="35" x2="70" y2="35" stroke="#fbbf24" strokeWidth="2" />
                    <line x1="30" y1="45" x2="60" y2="45" stroke="#fbbf24" strokeWidth="2" />
                    <line x1="30" y1="55" x2="65" y2="55" stroke="#fbbf24" strokeWidth="2" />
                    <rect x="40" y="30" width="20" height="40" fill="none" stroke="#fbbf24" strokeWidth="1" />
                </g>
            );
        case RelicId.CursedCoin:
            return (
                <g>
                    <circle cx="50" cy="50" r="35" fill="#4b5563" stroke="#111827" strokeWidth="3" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke="#111827" strokeWidth="1" />
                    <path d="M40 40 L45 55 L35 60 M60 40 L55 55 L65 60" stroke="#7f1d1d" strokeWidth="2" fill="none" />
                    <circle cx="43" cy="45" r="2" fill="#7f1d1d" />
                    <circle cx="57" cy="45" r="2" fill="#7f1d1d" />
                    <path d="M42 65 Q50 55 58 65" stroke="#7f1d1d" strokeWidth="2" fill="none" />
                </g>
            );
        case RelicId.VampiricFangs:
            return (
                <g>
                    <path d="M20 30 Q50 10 80 30 Q80 50 65 70 Q50 90 35 70 Q20 50 20 30" fill="#f3f4f6" stroke="#991b1b" strokeWidth="2" />
                    <path d="M35 30 L40 60 L45 30" fill="white" stroke="#991b1b" strokeWidth="1" />
                    <path d="M55 30 L60 60 L65 30" fill="white" stroke="#991b1b" strokeWidth="1" />
                    <circle cx="40" cy="65" r="3" fill="#ef4444" />
                </g>
            );
        case RelicId.SoulShard:
            return (
                <g>
                    <path d="M50 10 L80 40 L50 90 L20 40 Z" fill="#34d399" stroke="#064e3b" strokeWidth="2" opacity="0.8" />
                    <circle cx="50" cy="45" r="10" fill="#6ee7b7" opacity="0.6" />
                    <path d="M40 35 L60 55 M60 35 L40 55" stroke="white" strokeWidth="2" opacity="0.5" />
                </g>
            );
        case RelicId.DealersSleeve:
            return (
                <g>
                    <rect x="20" y="20" width="60" height="60" rx="10" fill="#1e1b4b" stroke="#312e81" strokeWidth="3" />
                    <rect x="40" y="10" width="30" height="40" fill="white" stroke="black" transform="rotate(-15 40 10)" />
                    <circle cx="50" cy="50" r="5" fill="#fbbf24" />
                    <circle cx="50" cy="70" r="5" fill="#fbbf24" />
                </g>
            );
        case RelicId.BlackCatCollar:
            return (
                <g>
                    <path d="M20 40 Q50 70 80 40" fill="none" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="50" cy="60" r="8" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                    <path d="M48 58 L52 62 M52 58 L48 62" stroke="#b45309" strokeWidth="1" />
                </g>
            );
        case RelicId.AlchemistsRing:
            return (
                <g>
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#fbbf24" strokeWidth="6" />
                    <rect x="40" y="10" width="20" height="20" transform="rotate(45 50 20)" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
                </g>
            );
        case RelicId.GildedDeck:
            return (
                <g>
                    <rect x="30" y="20" width="40" height="50" fill="#fbbf24" stroke="#b45309" strokeWidth="2" transform="rotate(-10 50 50)" />
                    <rect x="35" y="25" width="40" height="50" fill="#fbbf24" stroke="#b45309" strokeWidth="2" transform="rotate(0 50 50)" />
                    <rect x="40" y="30" width="40" height="50" fill="#fbbf24" stroke="#b45309" strokeWidth="2" transform="rotate(10 50 50)" />
                </g>
            );
        case RelicId.PhoenixFeather:
            return (
                <g>
                    <path d="M50 10 Q80 20 80 60 Q50 90 20 60 Q20 20 50 10 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
                    <path d="M50 10 Q50 50 50 90" fill="none" stroke="#fca5a5" strokeWidth="2" />
                    <path d="M50 30 L70 20 M50 50 L75 45 M50 70 L70 65" fill="none" stroke="#fdba74" strokeWidth="1" />
                </g>
            );
        case RelicId.ObsidianDice:
            return (
                <g>
                    <rect x="30" y="30" width="40" height="40" rx="5" fill="#111827" stroke="#4b5563" strokeWidth="2" />
                    <circle cx="40" cy="40" r="3" fill="#ef4444" />
                    <circle cx="60" cy="60" r="3" fill="#ef4444" />
                    <circle cx="50" cy="50" r="3" fill="#ef4444" />
                </g>
            );
        case RelicId.StoneSkin:
            return (
                <g>
                    <path d="M20 40 L40 20 L80 30 L90 60 L60 90 L30 80 Z" fill="#78716c" stroke="#44403c" strokeWidth="3" />
                    <path d="M40 20 L50 50 L90 60" fill="none" stroke="#44403c" strokeWidth="1" />
                    <path d="M30 80 L50 50 L60 90" fill="none" stroke="#44403c" strokeWidth="1" />
                </g>
            );
        case RelicId.LuckyHorseshoe:
            return (
                <g>
                    <path d="M25 30 V60 C25 80 75 80 75 60 V30" fill="none" stroke="#9ca3af" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="25" cy="45" r="2" fill="black" />
                    <circle cx="75" cy="45" r="2" fill="black" />
                    <circle cx="50" cy="75" r="2" fill="black" />
                </g>
            );
        case RelicId.LoadedDice:
            return (
                <g>
                    <rect x="30" y="30" width="40" height="40" rx="5" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                    <circle cx="50" cy="50" r="5" fill="white" />
                    <path d="M30 70 H70 V65 H30 Z" fill="#991b1b" opacity="0.5" />
                </g>
            );
        case RelicId.MerchantsMonocle:
            return (
                <g>
                    <circle cx="40" cy="40" r="20" fill="#bfdbfe" stroke="#fbbf24" strokeWidth="3" opacity="0.6" />
                    <path d="M60 40 Q70 60 70 90" fill="none" stroke="#fbbf24" strokeWidth="2" />
                    <circle cx="40" cy="40" r="5" fill="white" opacity="0.5" />
                </g>
            );
        case RelicId.ScryingOrb:
            return (
                <g>
                    <circle cx="50" cy="50" r="30" fill="#818cf8" stroke="#4338ca" strokeWidth="2" opacity="0.9" />
                    <ellipse cx="50" cy="85" rx="20" ry="5" fill="#312e81" opacity="0.5" />
                    <path d="M40 40 Q50 30 60 40" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
                </g>
            );
        case RelicId.VikingHelmet:
            return (
                <g>
                    <path d="M30 60 Q50 20 70 60 L70 80 H30 Z" fill="#9ca3af" stroke="#374151" strokeWidth="3" />
                    <path d="M30 60 L10 30" fill="none" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" />
                    <path d="M70 60 L90 30" fill="none" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" />
                    <line x1="50" y1="20" x2="50" y2="80" stroke="#374151" strokeWidth="2" />
                </g>
            );
        case RelicId.GamblersFallacy:
            return (
                <g>
                    <path d="M20 50 L50 20 L80 50 L50 80 Z" fill="#4c1d95" stroke="#a78bfa" strokeWidth="3" />
                    <text x="50" y="60" textAnchor="middle" fill="#a78bfa" fontSize="30" fontWeight="bold">21</text>
                    <path d="M20 50 H80" stroke="#a78bfa" strokeWidth="1" opacity="0.3" />
                </g>
            );
        case RelicId.FOUR_LEAF_CLOVER:
            return (
                <g>
                    <path d="M50 35 C40 25, 30 35, 40 45 C30 55, 40 65, 50 55 C60 65, 70 55, 60 45 C70 35, 60 25, 50 35 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
                    <line x1="50" y1="55" x2="50" y2="85" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
                </g>
            );
        case RelicId.SHATTERED_SOUL:
             return (
                <g>
                    <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" opacity="0.8" />
                    <path d="M30 30 L70 70 M70 30 L30 70" stroke="#ef4444" strokeWidth="3" opacity="0.6" />
                    <circle cx="50" cy="50" r="15" fill="#4338ca" opacity="0.4" />
                </g>
            );
        case RelicId.SANDALS_OF_HERMES:
            return (
                <g>
                    <path d="M20 70 L60 70 C75 70 80 60 70 50 L50 30" fill="none" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 30 L30 50" fill="none" stroke="#ca8a04" strokeWidth="4" />
                    <path d="M70 50 L90 40 M75 55 L95 45" fill="none" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
                </g>
            );
        default:
            return <circle cx="50" cy="50" r="40" fill="#6b7280" />;
    }
  };

  return (
    <svg {...commonProps} style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}>
      {renderIcon()}
    </svg>
  );
};

export default RelicAsset;
