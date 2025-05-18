import {
  BlockStack,
  Card,
  LegacyStack,
  Page,
  ResourceItem,
  ResourceList,
  Text
} from '@shopify/polaris';
import React, { useEffect, useState } from "react";
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import useFetchApi from '../../hooks/api/useFetchApi';
import moment from 'moment';
import usePaginate from '../../hooks/api/usePaginate';
import useDeleteApi from '../../hooks/api/useDeleteApi';
export default function Notifications() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortValue, setSortValue] = useState('createdAt:desc');
  const {
    data: items,
    loading,
    fetched,
    pageInfo,
    count,
    nextPage,
    prevPage,
    onQueryChange
  } = usePaginate({
    url: '/notifications',
    defaultSort: sortValue,
    defaultLimit: 10,
  });

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  const sortOptions = [
    { label: 'Newest update', value: 'createdAt:desc' },
    { label: 'Oldest update', value: 'createdAt:asc' }
  ];

  const renderItem = item => {
    const { id, firstName, city, country, productName, timestamp, productImage } = item;

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
            <Text>From {moment(timestamp).format('MMM DD')},</Text>
            <Text>{moment(timestamp).format('YYYY')}</Text>
          </BlockStack>
        </LegacyStack>
      </ResourceItem>
    );
  };

  return (
    <Page title="Notifications" subtitle="List of sales notifcation from Shopify" fullWidth>
      <Card>
        <ResourceList
          resourceName={resourceName}
          items={items}
          renderItem={renderItem}
          selectedItems={selectedProducts}
          onSelectionChange={setSelectedProducts}
          sortOptions={sortOptions}
          sortValue={sortValue}
          onSortChange={selected => {
            setSortValue(selected);
            onQueryChange('sort', selected, true);
          }}
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
