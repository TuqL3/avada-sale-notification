import { Checkbox } from '@shopify/polaris';

export default function CheckboxComponent({ handleCheckbox, data }) {
  const checkboxes = [
    { label: "Hide time ago", field: "hideTimeAgo" },
    { label: "Truncate product name", field: "truncateProductName" }
  ];

  return (
    <>
      {
        checkboxes.map(checkbox => {
          return (
            <Checkbox
              label={checkbox.label}
              key={checkbox.label}
              checked={data[checkbox.field]}
              onChange={checked => handleCheckbox(checkbox.field, checked)}
            />
          )
        })
      }
    </>
  );
}
