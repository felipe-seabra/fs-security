use serde::Serialize;
use sysinfo::{Disks, System};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ProcessSnapshot {
    pid: u32,
    name: String,
    executable: Option<String>,
    cpu_percent: f32,
    memory_bytes: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DiskSnapshot {
    mount_point: String,
    total_bytes: u64,
    available_bytes: u64,
    available_percent: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AuditReport {
    app_status: String,
    platform: String,
    host_name: Option<String>,
    os_name: Option<String>,
    os_version: Option<String>,
    kernel_version: Option<String>,
    process_count: usize,
    processes: Vec<ProcessSnapshot>,
    disks: Vec<DiskSnapshot>,
    notes: Vec<String>,
    findings: Vec<AuditFinding>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AuditFinding {
    id: String,
    category: String,
    severity: String,
    title: String,
    details: String,
    recommendation: String,
}

#[tauri::command]
fn run_read_only_audit() -> AuditReport {
    let mut system = System::new_all();
    system.refresh_all();

    let processes = system
        .processes()
        .iter()
        .map(|(pid, process)| ProcessSnapshot {
            pid: pid.as_u32(),
            name: process.name().to_string_lossy().into_owned(),
            executable: process.exe().map(|path| path.display().to_string()),
            cpu_percent: process.cpu_usage(),
            memory_bytes: process.memory(),
        })
        .collect::<Vec<_>>();

    let mut processes = processes;
    processes.sort_by(|a, b| b.cpu_percent.total_cmp(&a.cpu_percent));
    processes.truncate(25);

    let disks = Disks::new_with_refreshed_list()
        .iter()
        .map(|disk| {
            let total = disk.total_space();
            let available = disk.available_space();
            let percent = if total == 0 {
                0.0
            } else {
                (available as f64 / total as f64) * 100.0
            };
            DiskSnapshot {
                mount_point: disk.mount_point().display().to_string(),
                total_bytes: total,
                available_bytes: available,
                available_percent: percent,
            }
        })
        .collect::<Vec<_>>();

    let mut findings = Vec::new();

    // Conservative heuristic: flag known miner executable names and explicit
    // mining-protocol command lines for human review. This is not a malware verdict.
    for (pid, process) in system.processes() {
        let process_name = process.name().to_string_lossy().into_owned();
        let executable = process.exe().map(|path| path.display().to_string());
        let command_line = process
            .cmd()
            .iter()
            .map(|part| part.to_string_lossy())
            .collect::<Vec<_>>()
            .join(" ");

        if let Some(evidence) = mining_indicator(&process_name, executable.as_deref(), &command_line) {
            findings.push(AuditFinding {
                id: format!("possible-miner-{}", pid.as_u32()),
                category: "Possible mining software".to_string(),
                severity: "medium".to_string(),
                title: format!("Possível software de mineração: {}", process_name),
                details: format!(
                    "{}. Este indicador é heurístico e não confirma infecção; softwares de mineração instalados intencionalmente também podem corresponder.",
                    evidence
                ),
                recommendation: "Revise o caminho, a origem, a assinatura do editor e se você reconhece este software. Nenhum processo foi encerrado e nenhum arquivo foi removido.".to_string(),
            });
        }
    }

    for disk in &disks {
        if disk.total_bytes > 0 && disk.available_percent < 10.0 {
            findings.push(AuditFinding {
                id: format!("low-disk-{}", disk.mount_point),
                category: "Performance".to_string(),
                severity: "medium".to_string(),
                title: format!("Pouco espaço livre em {}", disk.mount_point),
                details: format!(
                    "Apenas {:.1}% do espaço está disponível. Isso pode afetar atualizações, instalação de jogos e o funcionamento de alguns aplicativos.",
                    disk.available_percent
                ),
                recommendation: "Revise o armazenamento manualmente e remova apenas arquivos que reconheça. O FS Security não apaga arquivos.".to_string(),
            });
        }
    }

    let platform = if cfg!(target_os = "windows") {
        "Windows"
    } else if cfg!(target_os = "macos") {
        "macOS"
    } else {
        "Outro sistema"
    };

    AuditReport {
        app_status: "read_only_inventory_only".to_string(),
        platform: platform.to_string(),
        host_name: System::host_name(),
        os_name: System::name(),
        os_version: System::os_version(),
        kernel_version: System::kernel_version(),
        process_count: system.processes().len(),
        processes,
        disks,
        notes: vec![
            "Esta versão coleta apenas um inventário básico de processos e armazenamento.".to_string(),
            "A detecção de mineração é heurística e limitada a nomes conhecidos e alguns padrões explícitos de linha de comando.".to_string(),
            "Ainda não há verificação de assinatura, inventário de persistência ou análise abrangente de conexões de rede.".to_string(),
            "Os processos com maior uso de CPU não são classificados como malware.".to_string(),
            "Nenhuma configuração foi alterada e nenhum arquivo foi removido.".to_string(),
        ],
        findings,
    }
}

fn mining_indicator(name: &str, executable: Option<&str>, command_line: &str) -> Option<String> {
    let known_names = [
        "xmrig", "minerd", "cpuminer", "cpuminer-opt", "lolminer", "t-rex",
        "trex", "gminer", "nbminer", "phoenixminer", "teamredminer",
        "nanominer", "wildrig", "rigel", "bminer", "ethminer", "claymore",
        "srbminer", "cryptodredge", "kawpowminer",
    ];

    let name_lower = name.to_ascii_lowercase();
    let executable_stem = executable
        .and_then(|path| std::path::Path::new(path).file_stem())
        .and_then(|stem| stem.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();

    if let Some(matched) = known_names
        .iter()
        .find(|candidate| name_lower == **candidate || executable_stem == **candidate)
    {
        return Some(format!(
            "O nome do processo ou executável corresponde ao indicador conhecido '{}'",
            matched
        ));
    }

    let cmd = command_line.to_ascii_lowercase();
    let has_stratum = cmd.contains("stratum+tcp://") || cmd.contains("stratum+ssl://");
    let has_mining_arguments = cmd.contains("--pool")
        || cmd.contains("--url")
        || cmd.contains(" -o ")
        || cmd.contains("--user")
        || cmd.contains("--wallet");

    if has_stratum && has_mining_arguments {
        return Some(
            "A linha de comando contém um protocolo Stratum e argumentos associados a pool/conta; isso também pode ter usos legítimos".to_string()
        );
    }

    None
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_read_only_audit])
        .run(tauri::generate_context!())
        .expect("erro ao executar FS Security");
}

#[cfg(test)]
mod tests {
    use super::mining_indicator;

    #[test]
    fn flags_known_miner_process_name_case_insensitively() {
        let result = mining_indicator("XMRig", None, "");
        assert!(result.is_some());
        assert!(result.unwrap().contains("xmrig"));
    }

    #[test]
    fn flags_known_miner_executable_path() {
        let result = mining_indicator("worker", Some("/opt/tools/cpuminer-opt"), "");
        assert!(result.is_some());
        assert!(result.unwrap().contains("cpuminer-opt"));
    }

    #[test]
    fn flags_stratum_pool_command_line_for_review() {
        let result = mining_indicator(
            "worker",
            Some("/tmp/worker"),
            "worker --url stratum+tcp://pool.example:3333 --user example-wallet",
        );
        assert!(result.is_some());
        assert!(result.unwrap().contains("Stratum"));
    }

    #[test]
    fn does_not_flag_common_legitimate_process_by_name_alone() {
        assert!(mining_indicator("steam", Some("/usr/bin/steam"), "").is_none());
        assert!(mining_indicator("WindowServer", None, "").is_none());
        assert!(mining_indicator("explorer", Some("C:\\Windows\\explorer.exe"), "").is_none());
    }

    #[test]
    fn does_not_flag_stratum_text_without_mining_arguments() {
        assert!(mining_indicator("browser", None, "example mentions stratum+tcp:// in a help page").is_none());
    }

    #[test]
    fn does_not_flag_pool_argument_without_stratum_protocol() {
        assert!(mining_indicator("app", None, "app --pool local-cache").is_none());
    }
}
