import React from 'react';
import PropTypes from 'prop-types';
import './NotifiPosition.scss';
import {Labelled, LegacyStack} from '@shopify/polaris';

const NotifiPosition = ({defaultOptions, handleSelectPositon, data}) => {
  return (
    <Labelled label={defaultOptions.label}>
      <LegacyStack>
        {defaultOptions.map(option => {
          const isSelected = data.position === option.value;
          return (
            <div
              key={option.value}
              className={`NotiBox-Item ${isSelected ? 'NotiBox-Item--selected' : ''}`}
              onClick={() => handleSelectPositon(option.value)}
            >
              <div className={`NotiBox-Indicator NotiBox-Indicator--${option.value}`} />
            </div>
          );
        })}
      </LegacyStack>
    </Labelled>
  );
};

NotifiPosition.propTypes = {
  defaultOptions: PropTypes.array.isRequired,
  handleSelectPositon: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default NotifiPosition;
