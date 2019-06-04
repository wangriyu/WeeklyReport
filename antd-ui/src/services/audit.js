import request from '@/utils/request';

export async function queryAuditList() {
  return request(`/api/admin/auditlist`);
}

export async function requestSetRole(params) {
  return request('/api/admin/setrole', {
    method: 'POST',
    data: params,
  });
}
