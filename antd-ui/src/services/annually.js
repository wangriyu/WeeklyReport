import request       from '@/utils/request';
import { stringify } from 'qs';

export async function updateAnnuallyPlan(params) {
  return request('/api/admin/updateAnnuallyPlan', {
    method: 'POST',
    data: params,
  });
}

export async function createAnnuallyPlan(params) {
  return request('/api/admin/addAnnuallyPlan', {
    method: 'POST',
    data: params,
  });
}

export async function createAnnuallyItem(params) {
  return request('/api/admin/addAnnuallyItem', {
    method: 'POST',
    data: params,
  });
}

export async function updateAnnuallyItem(params) {
  return request('/api/admin/updateAnnuallyItem', {
    method: 'POST',
    data: params,
  });
}

export async function queryAnnuallyList() {
  return request('/api/admin/annuallyList');
}

export async function queryAnnuallyItem(params) {
  return request(`/api/admin/annuallyItemList?${stringify(params)}`);
}

export async function deleteAnnuallyItem(params) {
  return request(`/api/admin/deleteAnnuallyItem?${stringify(params)}`);
}
