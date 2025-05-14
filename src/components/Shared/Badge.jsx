import React from 'react';
import { 
  FiZap,
  FiStar,
  FiShield,
  FiTrendingUp,
  FiHeart,
  FiCalendar,
  FiBookmark
} from 'react-icons/fi';
import { Tooltip } from './Tooltip';

const BADGE_TYPES = {
  STAFF: {
    label: 'Staff',
    icon: <FiShield />,
    description: 'Membro da equipe',
    bgClass: 'bg-purple-900/30',
    textClass: 'text-purple-400',
    adminOnly: true
  },
  OWNER: {
    label: 'Dono',
    icon: <FiStar />,
    description: 'Dono da plataforma',
    bgClass: 'bg-amber-900/30',
    textClass: 'text-amber-400'
  },
  BETA: {
    label: 'Beta',
    icon: <FiZap />,
    description: 'Beta Tester',
    bgClass: 'bg-blue-900/30',
    textClass: 'text-blue-400'
  },
  EARLY: {
    label: 'Early Adopter',
    icon: <FiTrendingUp />,
    description: 'Usuário desde o início',
    bgClass: 'bg-green-900/30',
    textClass: 'text-green-400'
  },
  ONE_YEAR: {
    label: '1 Ano',
    icon: <FiCalendar />,
    description: 'Usuário há 1 ano',
    bgClass: 'bg-indigo-900/30',
    textClass: 'text-indigo-400'
  },
  PREMIUM: {
    label: 'Premium',
    icon: <FiHeart />,
    description: 'Assinante Premium',
    bgClass: 'bg-pink-900/30',
    textClass: 'text-pink-400'
  },
  CONTRIBUTOR: {
    label: 'Colaborador',
    icon: <FiBookmark />,
    description: 'Contribuidor ativo',
    bgClass: 'bg-emerald-900/30',
    textClass: 'text-emerald-400'
  }
};

export const Badge = ({ type, user, size = 'medium', className = '' }) => {
  if (!BADGE_TYPES[type]) return null

  const badgeConfig = BADGE_TYPES[type]

  if (badgeConfig.adminOnly && !user?.isAdmin) {
    return null;
  }
  
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  };

  const iconSize = {
    small: 14,
    medium: 16,
    large: 18
  };

  return (
    <Tooltip content={`${badgeConfig.label}: ${badgeConfig.description}`}>
      <div className={`
        inline-flex items-center rounded-full
        ${badgeConfig.bgClass}
        ${sizeClasses[size]}
        ${className}
      `}>
        <span className={`mr-2 ${badgeConfig.textClass}`}>
          {React.cloneElement(badgeConfig.icon, { size: iconSize[size] })}
        </span>
        <span className={`font-medium ${badgeConfig.textClass}`}>
          {badgeConfig.label}
        </span>
      </div>
    </Tooltip>
  );
};

export const BadgeList = ({ badges, user, size = 'medium', className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge, index) => (
        <Badge 
        key={index} 
        type={badge} 
        size={size} 
        user={user}
        />
      ))}
    </div>
  );
};