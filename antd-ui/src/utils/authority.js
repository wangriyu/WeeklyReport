import { encryptAES, decryptAES } from './utils';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(data) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString = typeof data === 'undefined' ? localStorage.getItem('authority') : data;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(decryptAES(authorityString));
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'object' && authority && authority.role) {
    return [authority.role];
  }
  // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  // if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
  //   return ['admin'];
  // }

  return authority && authority.role ? authority.role : 'null';
}

export function setAuthority(data) {
  // const proAuthority = typeof data === 'string' ? [authority] : authority;
  return localStorage.setItem('authority', encryptAES(JSON.stringify(data)));
}
