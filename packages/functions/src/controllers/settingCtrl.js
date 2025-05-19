import {getCurrentShop} from '../helpers/auth';
import {getSetting, updateSetting, addNewSetting} from '../repositories/settingRepo';

export async function handleAddNewSetting(ctx) {
  try {
    // const shopId = 'm0veLlBS9keS3GzxvzMJROGvQdB2';
    const shopId = getCurrentShop(ctx);
    const data = ctx.req.body;

    if (!data || typeof data !== 'object') {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Invalid request body'
      };
      return;
    }

    const newSetting = await addNewSetting(shopId, data);

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: newSetting,
      message: 'Setting was added successfully!'
    };
  } catch (error) {
    console.error('Error in handleAddNewSetting:', error);

    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: 'Failed to add setting',
      error: error.message || 'Internal server error'
    };
  }
}

export async function handleGetSetting(ctx) {
  try {
    // const shopId = 'm0veLlBS9keS3GzxvzMJROGvQdB2';
    const shopId = getCurrentShop(ctx);
    const setting = await getSetting(shopId);

    if (!setting) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Setting not found',
        data: {}
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: setting
    };
  } catch (error) {
    console.error('Error in handleGetSetting:', error);

    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to retrieve setting',
      data: {}
    };
  }
}


export async function handleUpdateSetting(ctx) {
  try {
    // const shopId = 'm0veLlBS9keS3GzxvzMJROGvQdB2';
    const shopId = getCurrentShop(ctx);
    const updatedData = ctx.req.body;

    const result = await updateSetting(shopId, updatedData);

    if (!result) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Setting not found or update failed.'
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Setting was updated successfully!'
    };
  } catch (error) {
    console.error('Error updating setting:', error);

    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message || 'An error occurred while updating setting.'
    };
  }
}
