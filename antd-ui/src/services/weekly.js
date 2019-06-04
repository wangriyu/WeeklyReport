import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryWeeklyPlan(params) {
  return request(`/api/admin/weeklyPlan?${stringify(params)}`)
}

export async function queryWeeklySummary(params) {
  return request(`/api/admin/weeklySummary?${stringify(params)}`)
}

export async function addWeeklySummary(params) {
  return request('/api/staff/weeklySummary', {
    method: 'POST',
    data: params,
  });
}

export async function addWeeklyPlan(params) {
  return request('/api/staff/weeklyPlan', {
    method: 'POST',
    data: params,
  });
}
