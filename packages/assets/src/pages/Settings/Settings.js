import {Page, Layout, LegacyCard, Button} from '@shopify/polaris';
import React, {useEffect, useState} from 'react';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import LegacyTabs from '../../components/LegacyTabs/LegacyTabs';
import useCreateApi from '../../hooks/api/useCreateApi';
import useFetchApi from '../../hooks/api/useFetchApi';
import useEditApi from '../../hooks/api/useEditApi';

export default function Settings() {
  const item = {
    firstName: 'Tung',
    city: 'MJ',
    country: 'VietNam',
    productName: 'Shopify product',
    productImage: 'aa'
  };

  const [data1, setData] = useState({
    position: 'bottom-left',
    hideTimeAgo: true,
    truncateProductName: false,
    displayDuration: 5,
    firstDelay: 10,
    popsInterval: 2,
    maxPopsDisplay: 20,
    includedUrls: '',
    excludedUrls: '',
    allowShow: 'all'
  });

  const {data: fetchedSettings, fetched} = useFetchApi({
    url: '/settings',
    defaultData: {},
    initLoad: true
  });

  useEffect(() => {
    if (fetched && Object.keys(fetchedSettings).length > 0) {
      setData(fetchedSettings);
    }
  }, [fetched, fetchedSettings]);

  const defaultOptions = [
    {label: 'Bottom left', value: 'bottom-left'},
    {label: 'Bottom right', value: 'bottom-right'},
    {label: 'Top left', value: 'top-left'},
    {label: 'Top right', value: 'top-right'}
  ];

  const handleSelectPositon = position => {
    setData(prev => ({
      ...prev,
      position: position
    }));
  };

  const handleCheckbox = (field, state) => {
    setData(prev => ({
      ...prev,
      [field]: state
    }));
  };

  const {editing, handleEdit} = useEditApi({
    url: '/settings',
    successMsg: 'Cập nhật thành công!',
    errorMsg: 'Cập nhật thất bại!',
    useToast: true,
    successCallback: resp => {
      console.log('API response:', resp);
    }
  });
  return (
    <Page
      title="Settings"
      fullWidth
      subtitle="Decide how your notifications will display"
      primaryAction={{
        content: 'Save',
        onAction: async () => {
          await handleEdit(data1);
        },
        loading: editing
      }}
    >
      <Layout>
        <Layout.Section variant="oneThird">
          <LegacyCard title="Tags" sectioned>
            <NotificationPopup
              city={item.city}
              country={item.country}
              productName={item.productName}
              productImage={item.productImage}
              firstName={item.firstName}
            />
          </LegacyCard>
        </Layout.Section>

        <Layout.Section>
          <LegacyCard title="Order details" sectioned>
            <LegacyTabs
              defaultOptions={defaultOptions}
              handleSelectPositon={handleSelectPositon}
              data={data1}
              handleCheckbox={handleCheckbox}
            />
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
