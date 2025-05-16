import React from 'react';
import PropTypes from 'prop-types';
import './NotifiPosition.scss';
import { Labelled, LegacyStack, Text } from '@shopify/polaris';

const NotifiPosition = ({ defaultOptions, handleSelectPositon, data }) => {
  return (
    <Labelled label={defaultOptions.label}>
      <LegacyStack>
        {defaultOptions.map((option, key) => (
          <div
            key={key}
            className={`Avada-DesktopPosition ${data.position === option.value ? 'Avada-DesktopPosition--selected' : ''
            }`}
            onClick={() => handleSelectPositon(option.value)}
          >
            <div
              className={`Avada-DesktopPosition__Input Avada-DesktopPosition__Input--${option.value}`}
            ></div>
          </div>
        ))}
      </LegacyStack>
      {/* <Text variation="subdued">{helpText}</Text> */}
    </Labelled>
  );
};

export default NotifiPosition;
