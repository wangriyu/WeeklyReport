import request from '@/utils/request';

export async function queryCurrent(id) {
  return request(`/api/currentUser?id=${id}`);
}

export async function changeInfo(params) {
  return request('/api/staff/changeinfo', {
    method: 'POST',
    data: params,
  });
}

export async function changePass(params) {
  return request('/api/staff/changepass', {
    method: 'POST',
    data: params,
  });
}
