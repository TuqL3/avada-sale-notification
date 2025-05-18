import {
  BlockStack,
  Card,
  LegacyStack,
  Page,
  ResourceItem,
  ResourceList,
  Text
} from '@shopify/polaris';
import React, {useCallback, useMemo, useState} from 'react';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import moment from 'moment';
import usePaginate from '../../hooks/api/usePaginate';

export default function Notifications() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('createdAt:desc');

  const {data: notifications, loading, pageInfo, nextPage, prevPage, onQueryChange} = usePaginate({
    url: '/notifications',
    defaultSort: sortOrder,
    defaultLimit: 10
  });

  const resourceName = useMemo(
    () => ({
      singular: 'notification',
      plural: 'notifications'
    }),
    []
  );

  const sortOptions = useMemo(
    () => [
      {label: 'Newest update', value: 'createdAt:desc'},
      {label: 'Oldest update', value: 'createdAt:asc'}
    ],
    []
  );

  const handleSortChange = useCallback(
    selected => {
      setSortOrder(selected);
      onQueryChange('sort', selected, true);
    },
    [onQueryChange]
  );

  const renderNotificationItem = useCallback(notification => {
    const {id, firstName, city, country, productName, timestamp, productImage} = notification;

    return (
      <ResourceItem id={id}>
        <LegacyStack>
          <LegacyStack.Item fill>
            <NotificationPopup
              key={id}
              city={city}
              country={country}
              firstName={firstName}
              productImage={productImage}
              productName={productName}
              timestamp={timestamp}
            />
          </LegacyStack.Item>
          <BlockStack inlineAlign="end">
            <Text>From {moment(timestamp).format('MMM DD')}</Text>
            <Text>{moment(timestamp).format('YYYY')}</Text>
          </BlockStack>
        </LegacyStack>
      </ResourceItem>
    );
  }, []);

  return (
    <Page title="Notifications" subtitle="List of sales notifications from Shopify" fullWidth>
      <Card>
        <ResourceList
          resourceName={resourceName}
          items={notifications}
          renderItem={renderNotificationItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          sortOptions={sortOptions}
          sortValue={sortOrder}
          onSortChange={handleSortChange}
          loading={loading}
          selectable
        />
        <div style={{display: 'flex', justifyContent: 'space-between', padding: 16}}>
          <button disabled={!pageInfo?.hasPre} onClick={prevPage}>
            Previous
          </button>
          <button disabled={!pageInfo?.hasNext} onClick={nextPage}>
            Next
          </button>
        </div>
      </Card>
    </Page>
  );
}
