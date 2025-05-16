import { Select, TextField } from '@shopify/polaris';
import { useCallback } from 'react';

const Triggers = ({ data, handleCheckbox }) => {
  const handleSelectChange = useCallback(
    (value) => {
      handleCheckbox('allowShow', value);
    },
    [handleCheckbox]
  );

  return (
    <div>
      <Select
        label="Page Registric"
        options={[
          { label: 'All pages', value: 'all' },
          { label: 'Specific pages', value: 'specific' }
        ]}
        onChange={handleSelectChange}
        value={data.allowShow}
      />

      <TextField
        label="Excluded page"
        value={data.excludedUrls}
        onChange={(newValue) => handleCheckbox('excludedUrls', newValue)}
        multiline={4}
        autoComplete="off"
        helpText="Enter one URL per line"
      />

      {data.allowShow === 'specific' && (
        <TextField
          label="Included page"
          value={data.includedUrls}
          onChange={(newValue) => handleCheckbox('includedUrls', newValue)}
          multiline={4}
          autoComplete="off"
          helpText="Enter one URL per line"
        />
      )}
    </div>
  );
};

export default Triggers;
