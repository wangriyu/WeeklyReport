import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function marketingDaily(params) {
  return request('/api/staff/marketingDaily', {
    method: 'POST',
    data: params,
  });
}

export async function techSupportDaily(params) {
  return request('/api/staff/techSupportDaily', {
    method: 'POST',
    data: params,
  });
}

export async function afterSaleDaily(params) {
  return request('/api/staff/afterSaleDaily', {
    method: 'POST',
    data: params,
  });
}

export async function developDaily(params) {
  return request('/api/staff/developDaily', {
    method: 'POST',
    data: params,
  });
}

export async function productDaily(params) {
  return request('/api/staff/productDaily', {
    method: 'POST',
    data: params,
  });
}

export async function officeDaily(params) {
  return request('/api/staff/officeDaily', {
    method: 'POST',
    data: params,
  });
}

export async function financeDaily(params) {
  return request('/api/staff/financeDaily', {
    method: 'POST',
    data: params,
  });
}
