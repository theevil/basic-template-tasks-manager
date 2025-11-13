import React from 'react';
import './MainLayout.scss';

export interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title = 'Task Manager' }) => {
  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <div className="main-layout__container">
          <h1 className="main-layout__title">{title}</h1>
        </div>
      </header>
      <main className="main-layout__main">
        <div className="main-layout__container">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
