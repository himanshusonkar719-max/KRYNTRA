// KRYNTRA API Client with JWT Auth & Graceful Mock Fallbacks

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kryntra_token");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("kryntra_token", token);
  } else {
    localStorage.removeItem("kryntra_token");
  }
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem("kryntra_user");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("kryntra_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("kryntra_user");
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // Token expired or invalid
      setToken(null);
      setUser(null);
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // If backend isn't reachable, throw descriptive error
    throw err;
  }
}

// ─── AUTH APIS ─────────────────────────────────────────────
export const authApi = {
  async register(name, email, password) {
    const data = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setToken(data.access_token);
    setUser(data.user);
    return data;
  },

  async login(email, password) {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    setUser(data.user);
    return data;
  },

  async getSession() {
    try {
      const data = await request("/api/auth/session");
      setUser(data);
      return data;
    } catch {
      return getUser();
    }
  },

  async logout() {
    try {
      await request("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
    setToken(null);
    setUser(null);
  },
};

// ─── SCAN APIS ─────────────────────────────────────────────
export const scansApi = {
  async createScan(target, scan_type = "network", scanners = ["nmap", "zap", "trivy"]) {
    return await request("/api/scans", {
      method: "POST",
      body: JSON.stringify({ target, scan_type, scanners }),
    });
  },

  async listScans() {
    return await request("/api/scans");
  },

  async getScan(scanId) {
    return await request(`/api/scans/${scanId}`);
  },

  async deleteScan(scanId) {
    return await request(`/api/scans/${scanId}`, { method: "DELETE" });
  },

  async exportScan(scanId) {
    return await request(`/api/scans/${scanId}/export`);
  },
};

// ─── TRIAGE APIS ───────────────────────────────────────────
export const triageApi = {
  async getQueue() {
    return await request("/api/triage/queue");
  },

  async overrideTriage(vulnId, overrideData) {
    return await request(`/api/triage/${vulnId}/override`, {
      method: "POST",
      body: JSON.stringify(overrideData),
    });
  },

  async verifySandbox(vulnId) {
    return await request(`/api/triage/${vulnId}/verify`, {
      method: "POST",
    });
  },
};

// ─── COMPLIANCE APIS ───────────────────────────────────────
export const reportsApi = {
  async getCompliance(framework = "soc2") {
    return await request(`/api/reports/compliance/${framework}`);
  },

  async generateReport(framework = "soc2") {
    return await request("/api/reports/generate", {
      method: "POST",
      body: JSON.stringify({ framework }),
    });
  },

  async listReports() {
    return await request("/api/reports");
  },

  async exportReport(reportId) {
    return await request(`/api/reports/${reportId}/export`);
  },
};


// ─── ASSESSMENTS APIS (MERGED FROM OLD) ───────────────────
export const assessmentsApi = {
  async list() {
    return await request("/api/assessments");
  },

  async get(id) {
    return await request(`/api/assessments/${id}`);
  },

  async submit(id, answers, timeTakenSecs = 0) {
    return await request(`/api/assessments/${id}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers, time_taken_secs: timeTakenSecs }),
    });
  },

  async getHistory() {
    return await request("/api/assessments/attempts/history");
  },
};

// ─── ANALYTICS APIS (MERGED FROM OLD) ─────────────────────
export const analyticsApi = {
  async getOverview() {
    return await request("/api/analytics/overview");
  },

  async getRadar() {
    return await request("/api/analytics/radar");
  },

  async getLeaderboard() {
    return await request("/api/analytics/leaderboard");
  },
};

// ─── LEARNING PATHS APIS (MERGED FROM OLD) ────────────────
const SEED_PATHS = [
  {
    id: "path-web-sec",
    title: "Web Application Security",
    description: "Master the OWASP Top 10, cross-site scripting (XSS), SQL injection, and secure coding practices.",
    domain: "Web Application Security",
    domainSlug: "web-app-security",
    difficulty: "beginner",
    estimatedHours: 4.5,
    assessmentCount: 2,
    steps: [
      { id: "step-1", title: "Web Application Security Fundamentals", assessmentId: "assess-web-001", durationMins: 15 },
      { id: "step-2", title: "Advanced Web Vulnerability Analysis", assessmentId: "assess-web-004", durationMins: 45 }
    ]
  },
  {
    id: "path-net-sec",
    title: "Network Perimeter Defense",
    description: "Build expertise in firewalls, IDS/IPS, packet analysis, protocol security, and perimeter hardening.",
    domain: "Network Security",
    domainSlug: "network-security",
    difficulty: "intermediate",
    estimatedHours: 6.0,
    assessmentCount: 1,
    steps: [
      { id: "step-1", title: "Network Perimeter Security & Defense", assessmentId: "assess-net-002", durationMins: 30 }
    ]
  },
  {
    id: "path-ir-ops",
    title: "Incident Response Operations",
    description: "Learn digital forensics, malware containment strategies, memory preservation, and NIST incident lifecycles.",
    domain: "Incident Response",
    domainSlug: "incident-response",
    difficulty: "advanced",
    estimatedHours: 8.0,
    assessmentCount: 1,
    steps: [
      { id: "step-1", title: "Incident Response Triage & Lifecycle", assessmentId: "assess-ir-003", durationMins: 45 }
    ]
  },
  {
    id: "path-cloud-grc",
    title: "Cloud Security & Continuous Compliance",
    description: "Master AWS/GCP IAM least privilege, container security, and regulatory mapping (SOC2, ISO 27001, NIST CSF).",
    domain: "Cloud Security",
    domainSlug: "cloud-security",
    difficulty: "intermediate",
    estimatedHours: 7.5,
    assessmentCount: 2,
    steps: [
      { id: "step-1", title: "Cloud Infrastructure & IAM Security", assessmentId: "assess-cloud-005", durationMins: 30 },
      { id: "step-2", title: "Governance, Risk & Compliance Essentials", assessmentId: "assess-grc-006", durationMins: 25 }
    ]
  }
];

export const learningPathsApi = {
  async list() {
    return SEED_PATHS;
  },

  async get(id) {
    return SEED_PATHS.find((p) => p.id === id) || SEED_PATHS[0];
  }
};

// ─── TERMINAL APIS ────────────────────────────────────────
export const terminalApi = {
  async execute(command, cwd = null) {
    return await request("/api/terminal/execute", {
      method: "POST",
      body: JSON.stringify({ command, cwd }),
    });
  },

  async searchTool(query) {
    return await request("/api/terminal/search-tool", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },

  async installTool(query) {
    return await request("/api/terminal/install-tool", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },

  async getSystemInfo() {
    return await request("/api/terminal/system-info");
  },
};
