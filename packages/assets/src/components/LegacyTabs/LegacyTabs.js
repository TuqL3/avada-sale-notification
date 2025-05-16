import { LegacyCard, Tabs } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import Display from '../Display/Display';
import Triggers from '../Triggers/Trigger';

export default function LegacyTabs({defaultOptions, handleSelectPositon, data, handleCheckbox}) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(selectedTabIndex => setSelected(selectedTabIndex), []);

  const tabs = [
    {
      id: 'display-1',
      content: 'Display',
      accessibilityLabel: 'Display',
      panelID: 'display-content-1',
    },
    {
      id: 'triggers-1',
      content: 'Triggers',
      panelID: 'triggers-content-1',
    },
  ];

  return (
    <LegacyCard>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <LegacyCard.Section title={tabs[selected].content}>
          {selected === 0 &&
            (
              <Display
                defaultOptions={defaultOptions}
                handleSelectPositon={handleSelectPositon}
                data={data}
                handleCheckbox={handleCheckbox}
              />
            )
          }
          {selected === 1 && <Triggers data={data} handleCheckbox={handleCheckbox} />}
        </LegacyCard.Section>
      </Tabs>
    </LegacyCard>
  );
}
