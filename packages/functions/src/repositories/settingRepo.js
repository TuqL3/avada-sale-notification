import {Firestore} from '@google-cloud/firestore';

/**
 * @documentation
 *
 * Only use one repository to connect to one collection
 * do not connect more than one collection from one repository
 */
const firestore = new Firestore();
/** @type CollectionReference */
const settingRef = firestore.collection('settings');

/**
 * @param {string} shopId
 * @param {Object} data
 * @returns
 */
export async function addNewSetting(shopId, data) {
  const setting = await getSetting(shopId);
  if (!setting) {
    return settingRef.add({
      ...data,
      shopId: shopId
    });
  }
}

/**
 *
 * @param {string} shopId
 * @returns {Object}
 */
export async function getSetting(shopId) {
  const settingDocs = await settingRef
    .where('shopId', '==', shopId)
    .limit(1)
    .get();
  if (settingDocs.empty) {
    return null;
  }
  const settingDoc = settingDocs.docs[0];

  return {
    ...settingDoc.data(),
    id: settingDoc.id
  };
}

/**
 *
 * @param {string} shopId
 * @param {Object} updatedData
 * @returns
 */
export async function updateSetting(shopId, updatedData) {
  const settingDocs = await settingRef
    .where('shopId', '==', shopId)
    .limit(1)
    .get();

  if (settingDocs.empty) {
    return;
  }

  const settingDoc = settingDocs.docs[0];
  await settingRef.doc(settingDoc.id).update(updatedData);
}

/**
 *
 * @param {string} shopifyDomain
 * @returns {Object}
 */
export async function getSettingsByDomain(shopifyDomain) {
  const settingDocs = await settingRef
    .where('shopifyDomain', '==', shopifyDomain)
    .limit(1)
    .get();
  if (settingDocs.empty) {
    return null;
  }

  const settingDoc = settingDocs.docs[0];

  const settingData = Object.fromEntries(
    Object.entries(settingDoc.data()).filter(([key]) => key !== 'shopId')
  );

  return {
    ...settingData,
    id: settingDoc.id
  };
}

/**
 *
 * @param {string} shopId
 */
export async function deleteSetting(shopId) {
  const settingDocs = await settingRef.where('shopId', '==', shopId).get();
  if (settingDocs.empty) {
    return;
  }
  const settingIDs = settingDocs.docs.map(doc => doc.id);
  await settingRef.doc(settingIDs[0]).delete();
}
