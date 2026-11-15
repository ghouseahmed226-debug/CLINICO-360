// API client for CLINICO 360 backend
// All requests go through Next.js rewrites to avoid CORS in development

const BASE = '/api/v1'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

// --- Auth ---
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (email: string, password: string, full_name: string, role: string) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, full_name, role }) }),
  },

  // --- Dashboard ---
  dashboard: {
    stats: () => request<{ drugs_in_database: number; clinical_cases: number; prescriptions_analyzed: number; drug_interactions_indexed: number }>('/dashboard/stats'),
    recentCases: (limit?: number) => request<any[]>(`/dashboard/recent-cases?limit=${limit ?? 5}`),
    recentDrugs: (limit?: number) => request<any[]>(`/dashboard/recent-drugs?limit=${limit ?? 8}`),
    health: () => request<{ status: string }>('/dashboard/health'),
  },

  // --- Drugs ---
  drugs: {
    search: (q: string) => request<any[]>(`/drugs/search?q=${encodeURIComponent(q)}`),
    list: (skip = 0, limit = 50) => request<any[]>(`/drugs/list?skip=${skip}&limit=${limit}`),
    profile: (id: number) => request<any>(`/drugs/${id}`),
    adrs: (id: number, organ_system?: string, severity?: string) => {
      const params = new URLSearchParams()
      if (organ_system) params.set('organ_system', organ_system)
      if (severity) params.set('severity', severity)
      return request<any>(`/drugs/${id}/adrs?${params}`)
    },
    sameClass: (id: number) => request<any>(`/drugs/${id}/same-class`),
    checkInteractions: (drug_names: string[]) =>
      request<any>('/drugs/interactions/check', { method: 'POST', body: JSON.stringify({ drug_names }) }),
    ivCompat: (drug_a: string, drug_b: string) =>
      request<any>('/drugs/iv-compatibility/check', { method: 'POST', body: JSON.stringify({ drug_a, drug_b }) }),
  },

  // --- Cases ---
  cases: {
    create: (data: any) =>
      request<any>('/cases/create', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: number) => request<any>(`/cases/${id}`),
    list: (skip = 0, limit = 20) => request<any[]>(`/cases/list/all?skip=${skip}&limit=${limit}`),
    analyzeRx: (raw_text: string, source_type = 'text') =>
      request<any>('/cases/prescription/analyze', { method: 'POST', body: JSON.stringify({ raw_text, source_type }) }),
    dosageQuery: (data: any) =>
      request<any>('/cases/dosage/query', { method: 'POST', body: JSON.stringify(data) }),
  },
}

export default api
