import {getCurrentShop} from '../helpers/auth';
import {getSetting, updateSetting, addNewSetting} from '../repositories/settingRepo';

export async function handleAddNewSetting(ctx) {
  try {
    // const shopId = getCurrentShop(ctx);
    const shopId = 'm0veLlBS9keS3GzxvzMJROGvQdB2'
    const data = ctx.req.body;
    const newSetting = await addNewSetting(shopId, data);

    ctx.status = 201;
    return (ctx.body = {
      success: true,
      data: newSetting,
      message: 'Setting was added successfully!'
    });
  } catch (err) {
    return (ctx.body = {
      success: false,
      error: err.message
    });
  }
}

export async function handleGetSetting(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    // const shopId = 'm0veLlBS9keS3GzxvzMJROGvQdB2'
    const setting = await getSetting(shopId);

    ctx.status = 200;
    return (ctx.body = {
      data: setting,
      success: true
    });
  } catch (err) {
    ctx.status = 404;
    return (ctx.body = {
      data: {},
      success: false
    });
  }
}

export async function handleUpdateSetting(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    // const shopId = 'm0veLlBS9keS3GzxvzMJROGvQdB2'
    const updatedData = ctx.req.body;
    await updateSetting(shopId, updatedData);
    ctx.status = 200;
    return (ctx.body = {
      success: true,
      message: 'Setting were updated successfully!'
    });
  } catch (error) {
    return (ctx.body = {
      success: false,
      error: error.message
    });
  }
}
