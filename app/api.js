// api.js

import axios from "axios";

export const createUrl = (baseUrl, params) => {
  const url = new URL(baseUrl);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );
  return url.href;
};

export const makeGetRequest = async (url, headers) => {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error("Error making the request:", error);
  }
};

export const makePostRequest = async (url, data, headers) => {
  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error making the request:", error);
  }
};

export const authorise = async (clientId, redirectUrl) => {
  const authorizeUrl = "https://api.upstox.com/v2/login/authorization/dialog/";
  const url = createUrl(authorizeUrl, {
    client_id: clientId,
    redirect_uri: redirectUrl,
  });

  makeGetRequest(url);

  // Optionally, open the URL in the default browser
  open(url);
};

export const login = async (code, clientId, apiSecret, redirectUrl) => {
  const url = "https://api.upstox.com/v2/login/authorization/token";
  const data = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: apiSecret,
    redirect_uri: redirectUrl,
    grant_type: "authorization_code",
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };

  const userInfo = await makePostRequest(url, data, headers);

  if (userInfo.access_token) {
    return userInfo.access_token;
  } else {
    console.error("Error: access_token field not found");
  }
};

export const getOptionChain = async (
  instrumentKey,
  expiryDate,
  accessToken,
) => {
  const url = `https://api.upstox.com/v2/option/chain?instrument_key=${instrumentKey}&expiry_date=${expiryDate}`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  return makeGetRequest(url, headers);
};
