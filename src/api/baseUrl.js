export default function getBaseUrl() {
  return getQueryStringParameterByName('useMockApi') ? 'http://localhost:3001/' : '/';
}

/* This function should make it easier for us to switch between
   real and mockapi during development by just adding
   '/?useMockApi=true' to the query string.
*/
function getQueryStringParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return;
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
