import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Activity, AlertTriangle, CheckCircle2, ChevronRight, Cpu, HardDrive,
  LockKeyhole, Play, RefreshCw, ShieldCheck, Terminal, Zap
} from "lucide-react";
import "./styles.css";

type ProcessSnapshot = {
  pid: number;
  name: string;
  executable: string | null;
  cpuPercent: number;
  memoryBytes: number;
};

type DiskSnapshot = {
  mountPoint: string;
  totalBytes: number;
  availableBytes: number;
  availablePercent: number;
};

type AuditFinding = {
  id: string;
  category: string;
  severity: string;
  title: string;
  details: string;
  recommendation: string;
};

type AuditReport = {
  appStatus: string;
  platform: string;
  hostName: string | null;
  osName: string | null;
  osVersion: string | null;
  kernelVersion: string | null;
  processCount: number;
  processes: ProcessSnapshot[];
  disks: DiskSnapshot[];
  notes: string[];
  findings: AuditFinding[];
};

function bytes(value: number) {
  if (value < 1024) return `${value} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let size = value / 1024;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(1)} ${units[index]}`;
}

export default function App() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<"gaming" | "everyday">("gaming");

  async function runAudit() {
    setLoading(true);
    setError("");
    try {
      const result = await invoke<AuditReport>("run_read_only_audit");
      setReport(result);
    } catch {
      setError("Não foi possível executar a auditoria nativa. Abra o aplicativo pelo Tauri e consulte o README para os requisitos de desenvolvimento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={23} /></div>
          <div><strong>FS Security</strong><span>System audit</span></div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active"><Activity size={17} /> Visão geral</div>
        <div className="nav-item muted"><ShieldCheck size={17} /> Segurança <span className="soon">EM DESENV.</span></div>
        <div className="nav-item muted"><Zap size={17} /> Otimização <span className="soon">EM DESENV.</span></div>
        <div className="nav-item muted"><Terminal size={17} /> Relatórios <span className="soon">EM DESENV.</span></div>
        <div className="sidebar-bottom">
          <div className="privacy-icon"><LockKeyhole size={16} /></div>
          <strong>Local-first</strong>
          <p>Os dados desta auditoria ficam no dispositivo. Esta versão não envia relatórios para servidores.</p>
          <span className="version">EARLY DEVELOPMENT · 0.1.0</span>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div><span className="eyebrow">SYSTEM INTELLIGENCE</span><h1>Visão geral</h1></div>
          <div className="status"><span className="status-dot" /> MODO SOMENTE LEITURA</div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker"><ShieldCheck size={14} /> AUDITORIA LOCAL</span>
            <h2>Entenda seu sistema.<br /><em>Decida com evidências.</em></h2>
            <p>Faça um inventário inicial, identifique pontos que merecem atenção e prepare uma análise mais completa de segurança e desempenho.</p>
            <button className="primary-button" onClick={runAudit} disabled={loading}>
              {loading ? <RefreshCw className="spin" size={17} /> : <Play size={17} />}
              {loading ? "Analisando inventário..." : report ? "Atualizar inventário" : "Iniciar inventário read-only"}
              {!loading && <ChevronRight size={16} />}
            </button>
          </div>
          <div className="hero-graphic"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="core"><ShieldCheck size={46} strokeWidth={1.25} /></div><div className="orbit-dot dot-a" /><div className="orbit-dot dot-b" /><div className="orbit-dot dot-c" /></div>
        </section>

        <div className="notice"><AlertTriangle size={17} /><p><strong>Versão inicial:</strong> este recurso coleta apenas dados básicos de processos e armazenamento. Ainda não detecta malware, não audita persistência ou conexões de rede e não altera configurações.</p></div>
        {error && <div className="error-banner" role="alert">{error}</div>}

        {report ? (
          <>
            <section className="metrics-grid">
              <article className="metric-card"><div className="metric-top"><span>PROCESSOS OBSERVADOS</span><Cpu size={17} /></div><strong>{report.processCount}</strong><p>Processos visíveis ao usuário atual</p></article>
              <article className="metric-card"><div className="metric-top"><span>VOLUMES DE DISCO</span><HardDrive size={17} /></div><strong>{report.disks.length}</strong><p>Volumes retornados pelo sistema</p></article>
              <article className="metric-card"><div className="metric-top"><span>ITENS PARA REVISÃO</span><AlertTriangle size={17} /></div><strong>{report.findings.length}</strong><p>Alertas básicos de armazenamento</p></article>
            </section>
            <section className="section-block">
              <div className="section-heading"><div><h3>Resumo do dispositivo</h3><p>Informações coletadas localmente nesta execução</p></div><span className="read-badge"><CheckCircle2 size={14} /> Somente leitura</span></div>
              <div className="system-card">
                <div><span>SISTEMA OPERACIONAL</span><strong>{[report.osName, report.osVersion].filter(Boolean).join(" ") || report.platform}</strong></div>
                <div><span>DISPOSITIVO</span><strong>{report.hostName || "Não informado"}</strong></div>
                <div><span>PLATAFORMA</span><strong>{report.platform}</strong></div>
                <div><span>KERNEL</span><strong>{report.kernelVersion || "Não informado"}</strong></div>
              </div>
            </section>
            <section className="section-block">
              <div className="section-heading"><div><h3>Armazenamento</h3><p>Volumes e espaço disponível</p></div></div>
              {report.disks.length ? <div className="disk-list">{report.disks.map((disk) => <article className="disk-row" key={disk.mountPoint}><div className="disk-symbol"><HardDrive size={18} /></div><div className="disk-info"><strong>{disk.mountPoint}</strong><span>{bytes(disk.availableBytes)} livres de {bytes(disk.totalBytes)}</span><div className="progress-track"><div className={disk.availablePercent < 10 ? "progress-fill warn" : "progress-fill"} style={{ width: `${Math.max(0, Math.min(100, disk.availablePercent))}%` }} /></div></div><strong className={disk.availablePercent < 10 ? "disk-percent warn-text" : "disk-percent"}>{disk.availablePercent.toFixed(1)}%</strong></article>)}</div> : <p className="empty-state">Nenhum volume foi retornado pelo sistema.</p>}
            </section>
            <section className="section-block">
              <div className="section-heading"><div><h3>Itens que merecem revisão</h3><p>Indicadores heurísticos — não são confirmação de malware.</p></div></div>
              {report.findings.length ? <div className="finding-list">{report.findings.map((finding) => <article className="finding-card" key={finding.id}><div className="finding-heading"><span className={finding.category === "Possible mining software" ? "finding-tag mining" : "finding-tag"}>{finding.category === "Possible mining software" ? "POSSÍVEL MINERADOR" : finding.category.toUpperCase()}</span><span className={finding.severity === "high" ? "severity high" : "severity"}>Revisar</span></div><h4>{finding.title}</h4><p>{finding.details}</p><div className="finding-recommendation"><strong>Próximo passo:</strong> {finding.recommendation}</div></article>)}</div> : <div className="empty-state">Nenhum indicador heurístico foi encontrado nesta coleta limitada. Isso não comprova que o computador esteja livre de mineradores.</div>}
            </section>
            <section className="section-block">
              <div className="section-heading"><div><h3>Processos com maior uso de CPU</h3><p>Instantâneo informativo; uso elevado não significa malware.</p></div></div>
              <div className="process-table"><div className="process-head"><span>PROCESSO</span><span>PID</span><span>CPU</span><span>MEMÓRIA</span></div>{report.processes.map((process) => <div className="process-row" key={process.pid}><div className="process-name"><span className="process-icon"><Cpu size={15} /></span><div><strong>{process.name || "Processo sem nome"}</strong><small title={process.executable || ""}>{process.executable || "Caminho indisponível"}</small></div></div><span>{process.pid}</span><span>{process.cpuPercent.toFixed(1)}%</span><span>{bytes(process.memoryBytes)}</span></div>)}</div>
            </section>
            <section className="section-block">
              <div className="section-heading"><div><h3>Notas desta execução</h3><p>Limitações que devem ser consideradas ao interpretar os dados</p></div></div>
              <div className="notes-list">{report.notes.map((note) => <p key={note}><CheckCircle2 size={15} />{note}</p>)}</div>
            </section>
          </>
        ) : (
          <section className="empty-dashboard">
            <div className="empty-icon"><Activity size={25} /></div>
            <h3>Nenhum inventário executado</h3>
            <p>Execute a coleta somente leitura para ver dados básicos deste dispositivo. Ela não altera configurações nem confirma se o sistema está livre de malware.</p>
          </section>
        )}

        <section className="section-block profile-section">
          <div className="section-heading"><div><h3>Perfil de otimização</h3><p>Seleciona a prioridade para futuras recomendações; ainda não aplica ajustes.</p></div></div>
          <div className="profile-options">
            <button className={profile === "gaming" ? "profile-option selected" : "profile-option"} onClick={() => setProfile("gaming")}><Zap size={19} /><span><strong>Gaming</strong><small>Latência, carga em segundo plano e espaço para jogos</small></span><span className="radio-dot" /></button>
            <button className={profile === "everyday" ? "profile-option selected" : "profile-option"} onClick={() => setProfile("everyday")}><Activity size={19} /><span><strong>Uso diário</strong><small>Confiabilidade, inicialização e recursos do sistema</small></span><span className="radio-dot" /></button>
          </div>
          <div className="profile-footnote">Perfil selecionado: <strong>{profile === "gaming" ? "Gaming" : "Uso diário"}</strong>. O mecanismo de recomendações ainda está em desenvolvimento.</div>
        </section>
        <footer>FS SECURITY <span>·</span> PROTÓTIPO LOCAL <span>·</span> NENHUMA ALTERAÇÃO AUTOMÁTICA</footer>
      </section>
    </main>
  );
}
