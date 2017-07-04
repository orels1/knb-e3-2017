require('isomorphic-fetch');
const fs = require('mz/fs');
const path = require('path');
const btoa = require('btoa');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const KNB_LOGIN = process.env.KNB_LOGIN;
const KNB_PASS = process.env.KNB_PASS;

const getKNBCredentials = async () => {
  let credentials = null;
  try {
    credentials = await fs.readFile(path.join(__dirname, './data', 'knb_cred.json'), 'utf-8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      credentials = {
        access_token: 'test',
        refresh_token: 'test',
      };
      await fs.writeFile(path.join(__dirname, './data', 'knb_cred.json'), JSON.stringify(credentials, null, 2));
    }
  }
  if (!credentials) {
    return {
      access_token: 'test',
      refresh_token: 'test',
    };
  }
  let parsed = null;
  try {
    parsed = JSON.parse(credentials);
  } catch (e) {
    if (credentials === 'undefined') {
      return {
        access_token: 'test',
        refresh_token: 'test',
      };
    }
    parsed = false;
  }
  return parsed;
};

const setKNBCredentials = async (credentials) => {
  const payload = JSON.stringify(credentials, null, 2);
  try {
    await fs.writeFile(path.join(__dirname, './data', 'knb_cred.json'), payload);
    return true;
  } catch (e) {
    return false;
  }
};

const getToken = async () => {
  const response = await fetch(
    `http://kanobu.ru/oauth/token/?grant_type=password&username=${KNB_LOGIN}&password=${KNB_PASS}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
    });
  if (response.status === 200) {
    const json = await response.json();
    return setKNBCredentials(json);
  }
  return false;
};

const refreshToken = async () => {
  const credentials = await getKNBCredentials();
  if (!credentials) return false;
  const response = await fetch(
    `http://kanobu.ru/oauth/token/?grant_type=refresh_token&refresh_token=${credentials.refresh_token}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
    });
  if (response.status === 200) {
    const json = response.json();
    return setKNBCredentials(json.access_token, json.refresh_token);
  } else if (response.status === 400) {
    return getToken();
  }
  return false;
};

const fetchKNB = async (url) => {
  const credentials = await getKNBCredentials();
  if (!credentials) return false;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
    },
  });
  if (response.status === 401) {
    await refreshToken();
    await fetchKNB(url);
  } else if (response.status === 200) {
    return response.json();
  }
  return false;
};

exports.fetchKNB = fetchKNB;