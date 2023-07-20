import {request} from '@strapi/helper-plugin';
import pluginId from '../pluginId';

const fetchSeoComponent = async () => {
  try {
    return await request(`/${pluginId}/component`, {method: 'GET'});
  } catch (error) {
    return null;
  }
};

const fetchContentTypes = async () => {
  try {
    return await request(`/${pluginId}/content-types`, {method: 'GET'});
  } catch (error) {
    return null;
  }
};

const fetchConfig = async () => {
  try {
    return await request(`/${pluginId}/config`, {method: 'GET'});
  } catch (error) {
    return null;
  }
}

const createSeoComponent = async () => {
  try {
    const data = await request(
      `/${pluginId}/component`,
      {
        method: 'POST',
      },
      true
    );
    return data.json();
  } catch (error) {
    return null;
  }
};

export { fetchSeoComponent, fetchContentTypes, fetchConfig, createSeoComponent };
