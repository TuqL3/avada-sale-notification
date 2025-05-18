import {Firestore} from '@google-cloud/firestore';
const firestore = new Firestore();
const setting = firestore.collection('settings');

export async function addNewSetting(shopId, data) {
  const setting = await getSetting(shopId);
  if (!setting) {
    return setting.add({
      ...data,
      shopId: shopId
    });
  }
}

export async function getSetting(shopId) {
  const doc = await setting.doc(shopId).get();
  if (!doc.exists) return null;

  return {
    ...doc.data(),
    id: doc.id
  };
}

export async function updateSetting(shopId, updatedData) {
  const st = await setting
    .where('shopId', '==', shopId)
    .limit(1)
    .get();

  if (st.empty) {
    return;
  }

  const result = st.docs[0];
  await setting.doc(result.id).set(updatedData, {merge: true});
}
