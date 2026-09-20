import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import RightDrawer from './components/RightDrawer';
import AdminDashboard from './components/AdminDashboard';
import SecurityDashboard from './components/SecurityDashboard';
import AnalystDashboard from './components/AnalystDashboard';
import OperatorDashboard from './components/OperatorDashboard';
import DocumentViewerModal from './components/DocumentViewerModal';
import { fetchHealthStatus } from './services/api';
import './landing.css';
import './login.css';
import './workbench.css';

export default function App() {
  // Screen flow: 'landing' → 'login' → 'workbench'
  const [screen, setScreen] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeDashboard, setActiveDashboard] = useState('maintenance');
  const [activeWorkspace, setActiveWorkspace] = useState('Maintenance Intelligence');
  const [activeModel, setActiveModel] = useState('Llama 3.1 8B');
  const [systemHealth, setSystemHealth] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [activeTab, setActiveTab] = useState('context');
  const [injectedChatQuery, setInjectedChatQuery] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  useEffect(() => {
    fetchHealthStatus().then((data) => {
      if (data) setSystemHealth(data);
    });
  }, []);

  // Landing page
  if (screen === 'landing') {
    return <LandingPage onEnter={() => setScreen('login')} />;
  }

  // Login page
  if (screen === 'login') {
    return (
      <LoginPage
        onLogin={(user) => {
          if (
            user?.clearance === 'RESTRICTED' ||
            user?.isRestricted ||
            user?.status === 'restricted' ||
            user?.restricted
          ) {
            console.warn('[AegisAI RBAC] Access denied for restricted user:', user?.username);
            return;
          }
          setCurrentUser(user);
          setActiveDashboard(user.dashboard || 'maintenance');
          setScreen('workbench');
        }}
      />
    );
  }

  // Workbench and Role Dashboards
  return (
    <div className="app-container">
      <Header
        systemHealth={systemHealth}
        currentUser={currentUser}
        activeDashboard={activeDashboard}
        setActiveDashboard={setActiveDashboard}
        onLogout={() => {
          setCurrentUser(null);
          setActiveDashboard('maintenance');
          setScreen('login');
        }}
        onSearch={(q) => {
          setActiveTab('context');
        }}
      />

      {/* Role View: Maintenance Engineer Workbench */}
      {activeDashboard === 'maintenance' && (
        <div className="workbench-layout">
          <Sidebar
            activeWorkspace={activeWorkspace}
            setActiveWorkspace={setActiveWorkspace}
            activeModel={activeModel}
            setActiveModel={setActiveModel}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
          <ChatWindow
            activeWorkspace={activeWorkspace}
            activeModel={activeModel}
            setActiveModel={setActiveModel}
            onNewResponse={(resp) => setCurrentResponse(resp)}
            currentUser={currentUser}
            onOpenHitl={(tab) => setActiveTab(tab || 'context')}
            injectedQuery={injectedChatQuery}
            onClearInjectedQuery={() => setInjectedChatQuery(null)}
            onOpenDoc={(item) => setViewingItem(item)}
          />
          <RightDrawer
            response={currentResponse}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onSendToChat={(data) => {
              setInjectedChatQuery(data.query);
            }}
            onOpenItem={(item) => setViewingItem(item)}
          />
        </div>
      )}

      {/* Role View: System Administrator (Rajesh Kumar) */}
      {activeDashboard === 'admin' && (
        <AdminDashboard currentUser={currentUser} />
      )}

      {/* Role View: Security Officer (Arun Menon) */}
      {activeDashboard === 'security' && (
        <SecurityDashboard currentUser={currentUser} />
      )}

      {/* Role View: Data Analyst (Sneha Iyer) */}
      {activeDashboard === 'analyst' && (
        <AnalystDashboard currentUser={currentUser} />
      )}

      {/* Role View: Plant Operator (Vikram Singh) */}
      {activeDashboard === 'operator' && (
        <OperatorDashboard currentUser={currentUser} />
      )}

      {/* Modal: Fullscreen Document & Drawing Viewer */}
      {viewingItem && (
        <DocumentViewerModal
          item={viewingItem}
          onClose={() => setViewingItem(null)}
          onQueryInChat={(q) => {
            setInjectedChatQuery(q);
          }}
        />
      )}
    </div>
  );
}
