/**
 * Strip access token by default
 *
 * @param {Shop} data
 * @returns {*}
 */
export default function presentShop(data) {
  // eslint-disable-next-line no-unused-vars
  const {accessToken, accessTokenHash, ...shop} = data;

  return shop;
}
