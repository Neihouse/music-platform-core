"use client";

import { Tabs } from "@mantine/core";
import { ReactNode } from "react";

interface Tab {
  key: string;
  label: string;
  content: ReactNode;
}

interface ContentTabsProps {
  tabs: Tab[];
  activeTab: string | null;
  onTabChange: (value: string | null) => void;
  minHeight?: string;
}

const ContentTabs = ({
  tabs,
  activeTab,
  onTabChange,
  minHeight = "600px"
}: ContentTabsProps) => {
  return (
    <Tabs 
      value={activeTab} 
      onChange={onTabChange} 
      mt="xl"
      styles={{
        root: {
          borderBottom: '1px solid var(--mantine-color-dark-4)',
        },
        tab: {
          color: 'var(--mantine-color-dimmed)',
          borderBottom: '3px solid transparent',
          '&[dataActive]': {
            color: 'var(--mantine-color-gray-0)',
            borderBottomColor: 'var(--mantine-color-blue-6)',
            backgroundColor: 'transparent',
          },
          '&:hover': {
            color: 'var(--mantine-color-gray-0)',
            borderBottomColor: 'var(--mantine-color-dark-4)',
            backgroundColor: 'transparent',
          }
        }
      }}
    >
      <Tabs.List justify="center" style={{ borderBottom: 'none' }}>
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.key} value={tab.key}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Panel key={tab.key} value={tab.key} pt="xl" style={{ minHeight }}>
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default ContentTabs;
