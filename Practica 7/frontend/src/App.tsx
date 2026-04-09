import { FormEvent, useMemo, useState } from 'react';

type PayrollItem = {
  id: string;
  name: string;
  status: string;
  current_step: number;
  created_at: string;
};

type AuditItem = {
  id: string;
  service: string;
  action: string;
  entity: string;
  created_at: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function App() {
  const [token, setToken] = useState('token-admin');
  const [payrollName, setPayrollName] = useState('Planilla quincenal');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [message, setMessage] = useState('');

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  async function fetchPayrolls() {
    const response = await fetch(`${API_URL}/api/payrolls`, { headers: authHeaders });
    const data = await response.json();
    setPayrolls(data.items ?? []);
  }

  async function fetchLogs() {
    const response = await fetch(`${API_URL}/api/logs?limit=30`, { headers: authHeaders });
    const data = await response.json();
    setLogs(data.items ?? []);
  }

  async function uploadPayroll(e: FormEvent) {
    e.preventDefault();
    if (!csvFile) {
      setMessage('Selecciona un CSV');
      return;
    }

    const formData = new FormData();
    formData.append('name', payrollName);
    formData.append('file', csvFile);

    const response = await fetch(`${API_URL}/api/payrolls/upload`, {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });

    const data = await response.json();
    setMessage(response.ok ? `Planilla creada: ${data.payrollId}` : `Error: ${JSON.stringify(data)}`);
    if (response.ok) {
      await fetchPayrolls();
      await fetchLogs();
    }
  }

  async function approve(payrollId: string, step: number) {
    const response = await fetch(`${API_URL}/api/payrolls/${payrollId}/approve`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ step, comment: `Aprobado paso ${step}` }),
    });
    const data = await response.json();
    setMessage(response.ok ? `Aprobada: ${data.status}` : `Error: ${JSON.stringify(data)}`);
    await fetchPayrolls();
    await fetchLogs();
  }

  async function download(payrollId: string) {
    const response = await fetch(`${API_URL}/api/payrolls/${payrollId}/download`, {
      headers: authHeaders,
    });
    const data = await response.json();
    if (data.url) {
      window.open(data.url, '_blank');
    }
  }

  return (
    <main className="layout">
      <header className="hero">
        <h1>Payroll Microservices Dashboard</h1>
        <p>OAuth corporativo (12h), aprobacion 3 pasos, historial y auditoria centralizada.</p>
        <div className="token-bar">
          <label>Token:</label>
          <input value={token} onChange={(e) => setToken(e.target.value)} />
          <button onClick={fetchPayrolls}>Cargar planillas</button>
          <button onClick={fetchLogs}>Cargar logs</button>
        </div>
        <small>Tokens demo: token-admin, token-approver, token-viewer</small>
      </header>

      <section className="card">
        <h2>Cargar CSV</h2>
        <form onSubmit={uploadPayroll} className="form-grid">
          <input value={payrollName} onChange={(e) => setPayrollName(e.target.value)} placeholder="Nombre planilla" />
          <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)} />
          <button type="submit">Subir</button>
        </form>
        <p>{message}</p>
      </section>

      <section className="card">
        <h2>Planillas</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Paso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr key={p.id}>
                <td>{p.id.slice(0, 8)}...</td>
                <td>{p.name}</td>
                <td>{p.status}</td>
                <td>{p.current_step}</td>
                <td className="actions">
                  <button onClick={() => approve(p.id, p.current_step)}>Aprobar paso</button>
                  <button onClick={() => download(p.id)}>Descargar CSV</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Logs de auditoria</h2>
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              [{new Date(log.created_at).toLocaleString()}] {log.service} - {log.action} ({log.entity})
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
