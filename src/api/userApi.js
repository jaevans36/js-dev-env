// This polyfil will allow this to work on browsers that don't support fetch natively, this can be removed and replaced with something that only does it for browsers that don't support fetch
import 'whatwg-fetch';

// export allows this to be a public function
export function getUsers() {
  return get('users');
}

function get(url) {
  return fetch(url).then(onSuccess, onError);
}

function onSuccess(response) {
  return response.json();
}

function onError(error) {
  console.log(error); // eslint-disable-line no-console
}
