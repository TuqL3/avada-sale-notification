import { LegacyCard, RangeSlider } from '@shopify/polaris';
import { useState, useCallback } from 'react';

const Timing = ({ handleCheckbox, data }) => {

  const slices = [
    {
      field: 'displayDuration',
      label: 'Display durable',
      helpText: 'How long each pop will display on your page',
    },
    {
      field: 'firstDelay',
      label: 'Time before the first pop',
      helpText: 'How long each pop will display on your page',
    },
    {
      field: 'popsInterval',
      label: 'Gap time between two pops',
      helpText: 'How long each pop will display on your page',
    },
    {
      field: 'maxPopsDisplay',
      label: 'Maximum of popups',
      helpText: 'How long each pop will display on your page',
    },

  ];

  return (
    <>
      {
        slices.map(slice => {
          return (
            <LegacyCard key={slice.field} sectioned title="Text color">
              <RangeSlider
                output
                label={slice.label}
                min={0}
                max={360}
                value={data[slice.field]}
              onChange={value => handleCheckbox(slice.field, value)}
                helpText={slice.helpText}
                suffix={
                  <p
                    style={{
                      minWidth: '24px',
                      textAlign: 'right',
                    }}
                  >
                    {data[slice.field]}
                  </p>
                }
              />
            </LegacyCard>
          )
        })
      }
    </>

  );
}

export default Timing;
