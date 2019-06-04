import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryStaffList(params) {
  return request(`/api/admin/stafflist?${stringify(params)}`);
}

export async function requestDeleteStaff(params) {
  return request('/api/staff/softdelete', {
    method: 'POST',
    data: params,
  });
}

export async function requestCreateStaff(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function requestUpdateStaff(params) {
  return request('/api/staff/changeinfo', {
    method: 'POST',
    data: params,
  });
}
