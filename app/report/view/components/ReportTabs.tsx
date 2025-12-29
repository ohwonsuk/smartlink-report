'use client';

import { useState } from 'react';

type Tab = 'summary' | 'detail';

type Props = {
  onTabChange: (tab: Tab) => void;
  defaultTab?: Tab;
};

export default function ReportTabs({ onTabChange, defaultTab = 'summary' }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const tabs = [
    { id: 'summary' as Tab, label: '요약', icon: '📊' },
    { id: 'detail' as Tab, label: '상세', icon: '📋' },
  ];

  return (
    <div className="mb-6 border-b border-gray-200 bg-white">
      <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium
              ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
          >
            <span className="mr-2 text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

