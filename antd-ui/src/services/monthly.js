import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryMarketingMonthly(params) {
  return request(`/api/admin/marketingMonthly?${stringify(params)}`);
}

export async function queryMarketingMonthlyByID(params) {
  return request(`/api/admin/marketingMonthlyByID?${stringify(params)}`);
}

export async function queryTechSupportMonthly(params) {
  return request(`/api/admin/techSupportMonthly?${stringify(params)}`);
}

export async function queryAfterSaleMonthly(params) {
  return request(`/api/admin/afterSaleMonthly?${stringify(params)}`);
}

export async function queryOfficeMonthly(params) {
  return request(`/api/admin/officeMonthly?${stringify(params)}`);
}

export async function queryDevelopMonthly(params) {
  return request(`/api/admin/developMonthly?${stringify(params)}`);
}

export async function queryProductMonthly(params) {
  return request(`/api/admin/productMonthly?${stringify(params)}`);
}

export async function queryFinanceMonthly(params) {
  return request(`/api/admin/financeMonthly?${stringify(params)}`);
}
