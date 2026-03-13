import React from 'react';

export interface CardProps {
  /** card header text; omit for no header */
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /** optional class names applied to outer container */
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={"card " + className}>
      {title !== undefined && (
        <div className="card-header">
          {icon && <span className="card-icon">{icon}</span>}
          <span className="card-title">{title}</span>
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};
