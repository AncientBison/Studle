import { BACKEND_URL } from "../const/constants";

/**
 * Request an api based on {BASKEND_URL}
 * @param {string} uri 
 * @param {object} options fetch options
 * @returns json data of the response
 */
const api = async (uri, options) => {
  //! You should think about you really don't need to use this response data.
  const apiRes = await fetch(`${BACKEND_URL}${uri}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
    },
    ...options,
  });

  return await apiRes.json();
}

export default api;