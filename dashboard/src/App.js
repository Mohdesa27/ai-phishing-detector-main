// import { useState, useEffect, useCallback } from "react";

// const BACKEND_URL = "http://localhost:5000";

// function App() {
//   const [url, setUrl] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("checker"); // "checker" | "history" | "email"
//   const [emailContent, setEmailContent] = useState("");
//   const [emailStatus, setEmailStatus] = useState(null);

//   // ✅ Load scan history
//   const fetchHistory = useCallback(async () => {
//     try {
//       setHistoryLoading(true);
//       const res = await fetch(`${BACKEND_URL}/api/history`);
//       const data = await res.json();
//       if (data.success) setHistory(data.data);
//     } catch (err) {
//       console.error("❌ History fetch error:", err);
//     } finally {
//       setHistoryLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchHistory();
//   }, [fetchHistory]);

//   // ✅ Check URL
//   const checkURL = async () => {
//     const trimmed = url.trim();
//     if (!trimmed) return;

//     try {
//       setLoading(true);
//       setResult(null);

//       const res = await fetch(`${BACKEND_URL}/api/check`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url: trimmed })
//       });

//       const data = await res.json();
//       setResult(data);

//       // Refresh history after every check
//       fetchHistory();

//     } catch (err) {
//       setResult({ result: "❌ Cannot connect to backend", score: null });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Submit email
//   const submitEmail = async () => {
//     if (!emailContent.trim()) return;

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/email/submit`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: emailContent.trim() })
//       });

//       const data = await res.json();

//       if (data.success) {
//         setEmailStatus({ type: "success", message: "✅ Email submitted successfully" });
//         setEmailContent("");
//       } else {
//         setEmailStatus({ type: "error", message: "❌ Submission failed" });
//       }
//     } catch (err) {
//       setEmailStatus({ type: "error", message: "❌ Cannot connect to backend" });
//     }
//   };

//   // ─── Helpers ───────────────────────────────────────
//   const getResultColor = (r) => {
//     if (!r) return "#718096";
//     if (r.includes("Phishing")) return "#e53e3e";
//     if (r.includes("Suspicious")) return "#dd6b20";
//     if (r.includes("Safe")) return "#38a169";
//     return "#718096";
//   };

//   const getResultBadge = (r) => {
//     if (!r) return {};
//     if (r === "Phishing") return { background: "#fff5f5", color: "#e53e3e" };
//     if (r === "Suspicious") return { background: "#fffaf0", color: "#dd6b20" };
//     if (r === "Safe") return { background: "#f0fff4", color: "#38a169" };
//     return {};
//   };

//   const formatSource = (source) => {
//     const map = {
//       blacklist: "🗂 Blacklist",
//       dataset: "📊 Dataset",
//       ml_model: "🧠 ML Model",
//       rules: "📏 Rules"
//     };
//     return map[source] || source || "—";
//   };

//   const formatDate = (d) =>
//     d ? new Date(d).toLocaleString() : "—";

//   const suspiciousCount = history.filter(h => h.result === "Suspicious").length;
//   const phishingCount = history.filter(h => h.result === "Phishing").length;
//   const safeCount = history.filter(h => h.result === "Safe").length;

//   return (
//     <div style={styles.page}>

//       {/* ── Header ── */}
//       <div style={styles.header}>
//         <h1 style={styles.headerTitle}>🔐 AI Phishing Detector</h1>
//         <p style={styles.headerSub}>Dashboard — Real-time URL threat detection</p>
//       </div>

//       {/* ── Stats ── */}
//       <div style={styles.statsRow}>
//         <StatCard label="Total Scans" value={history.length} color="#3182ce" />
//         <StatCard label="Suspicious ⚠️" value={suspiciousCount} color="#dd6b20" />
//         <StatCard label="Phishing 🚨" value={phishingCount} color="#e53e3e" />
//         <StatCard label="Safe ✅" value={safeCount} color="#38a169" />
//       </div>

//       {/* ── Tabs ── */}
//       <div style={styles.tabRow}>
//         {["checker", "history", "email"].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             style={{
//               ...styles.tab,
//               ...(activeTab === tab ? styles.tabActive : {})
//             }}
//           >
//             {tab === "checker" ? "🔍 URL Checker" : tab === "history" ? "📋 Scan History" : "📧 Email Submit"}
//           </button>
//         ))}
//       </div>

//       {/* ── URL Checker Tab ── */}
//       {activeTab === "checker" && (
//         <div style={styles.card}>
//           <h2 style={styles.cardTitle}>Check a URL</h2>

//           <div style={styles.inputRow}>
//             <input
//               type="text"
//               placeholder="Enter URL to scan (e.g. https://example.com)"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && checkURL()}
//               style={styles.input}
//             />
//             <button
//               onClick={checkURL}
//               disabled={loading}
//               style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
//             >
//               {loading ? "Checking..." : "Scan URL"}
//             </button>
//           </div>

//           {result && (
//             <div style={{
//               ...styles.resultBox,
//               borderLeft: `4px solid ${getResultColor(result.result)}`
//             }}>
//               <p style={{ ...styles.resultText, color: getResultColor(result.result) }}>
//                 {result.result}
//               </p>
//               {result.score != null && (
//                 <p style={styles.resultMeta}>
//                   Confidence: <strong>{(result.score * 100).toFixed(0)}%</strong>
//                 </p>
//               )}
//               {result.source && (
//                 <p style={styles.resultMeta}>
//                   Detected by: <strong>{formatSource(result.source)}</strong>
//                 </p>
//               )}
//               {result.message && (
//                 <p style={styles.resultMeta}>{result.message}</p>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── Scan History Tab ── */}
//       {activeTab === "history" && (
//         <div style={styles.card}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <h2 style={styles.cardTitle}>Scan History</h2>
//             <button onClick={fetchHistory} style={styles.refreshBtn}>🔄 Refresh</button>
//           </div>

//           {historyLoading ? (
//             <p style={styles.emptyMsg}>Loading history...</p>
//           ) : history.length === 0 ? (
//             <p style={styles.emptyMsg}>No scans yet. Check a URL first.</p>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr style={styles.thead}>
//                     <th style={styles.th}>URL</th>
//                     <th style={styles.th}>Result</th>
//                     <th style={styles.th}>Confidence</th>
//                     <th style={styles.th}>Source</th>
//                     <th style={styles.th}>Scanned At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {history.map((scan, i) => (
//                     <tr key={i} style={{ borderBottom: "1px solid #edf2f7" }}>
//                       <td style={{ ...styles.td, maxWidth: 250, wordBreak: "break-all", fontSize: 12 }}>
//                         {scan.url}
//                       </td>
//                       <td style={styles.td}>
//                         <span style={{ ...styles.badge, ...getResultBadge(scan.result) }}>
//                           {scan.result}
//                         </span>
//                       </td>
//                       <td style={styles.td}>
//                         {scan.score != null ? `${(scan.score * 100).toFixed(0)}%` : "—"}
//                       </td>
//                       <td style={styles.td}>{formatSource(scan.source)}</td>
//                       <td style={styles.td}>{formatDate(scan.checkedAt)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── Email Submit Tab ── */}
//       {activeTab === "email" && (
//         <div style={styles.card}>
//           <h2 style={styles.cardTitle}>Submit Email for Review</h2>

//           <textarea
//             value={emailContent}
//             onChange={(e) => setEmailContent(e.target.value)}
//             placeholder="Paste suspicious email content here..."
//             rows={8}
//             style={styles.textarea}
//           />

//           <button onClick={submitEmail} style={styles.btn}>
//             Submit Email
//           </button>

//           {emailStatus && (
//             <p style={{
//               marginTop: 12,
//               color: emailStatus.type === "success" ? "#38a169" : "#e53e3e",
//               fontWeight: "bold"
//             }}>
//               {emailStatus.message}
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Stat Card Component ──────────────────────────────
// function StatCard({ label, value, color }) {
//   return (
//     <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
//       <p style={{ ...styles.statValue, color }}>{value}</p>
//       <p style={styles.statLabel}>{label}</p>
//     </div>
//   );
// }

// // ── Styles ──────────────────────────────────────────
// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#f7fafc",
//     fontFamily: "'Segoe UI', sans-serif",
//     padding: "0 0 40px"
//   },
//   header: {
//     background: "linear-gradient(135deg, #1a365d, #2b6cb0)",
//     color: "#fff",
//     padding: "28px 40px"
//   },
//   headerTitle: { margin: 0, fontSize: 24 },
//   headerSub: { margin: "6px 0 0", opacity: 0.8, fontSize: 14 },
//   statsRow: {
//     display: "flex",
//     gap: 16,
//     padding: "24px 40px 0",
//     flexWrap: "wrap"
//   },
//   statCard: {
//     flex: 1,
//     minWidth: 120,
//     background: "#fff",
//     borderRadius: 8,
//     padding: "16px 20px",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
//   },
//   statValue: { margin: 0, fontSize: 28, fontWeight: "bold" },
//   statLabel: { margin: "4px 0 0", fontSize: 13, color: "#718096" },
//   tabRow: {
//     display: "flex",
//     gap: 8,
//     padding: "24px 40px 0"
//   },
//   tab: {
//     padding: "8px 18px",
//     border: "1px solid #e2e8f0",
//     borderRadius: 6,
//     background: "#fff",
//     cursor: "pointer",
//     fontSize: 13,
//     color: "#4a5568"
//   },
//   tabActive: {
//     background: "#2b6cb0",
//     color: "#fff",
//     border: "1px solid #2b6cb0"
//   },
//   card: {
//     margin: "20px 40px 0",
//     background: "#fff",
//     borderRadius: 10,
//     padding: "24px",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
//   },
//   cardTitle: { margin: "0 0 16px", fontSize: 17, color: "#2d3748" },
//   inputRow: { display: "flex", gap: 10 },
//   input: {
//     flex: 1,
//     padding: "10px 14px",
//     border: "1px solid #e2e8f0",
//     borderRadius: 6,
//     fontSize: 14
//   },
//   btn: {
//     padding: "10px 20px",
//     background: "#2b6cb0",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontSize: 14,
//     fontWeight: "bold",
//     whiteSpace: "nowrap"
//   },
//   refreshBtn: {
//     padding: "6px 14px",
//     background: "#edf2f7",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontSize: 13
//   },
//   resultBox: {
//     marginTop: 16,
//     padding: "14px 16px",
//     background: "#f9f9f9",
//     borderRadius: 8,
//     border: "1px solid #e2e8f0"
//   },
//   resultText: { margin: "0 0 6px", fontSize: 18, fontWeight: "bold" },
//   resultMeta: { margin: "3px 0", fontSize: 13, color: "#718096" },
//   emptyMsg: { color: "#a0aec0", fontStyle: "italic" },
//   table: { width: "100%", borderCollapse: "collapse" },
//   thead: { background: "#edf2f7" },
//   th: {
//     padding: "10px 12px",
//     textAlign: "left",
//     fontSize: 13,
//     fontWeight: "bold",
//     color: "#4a5568"
//   },
//   td: { padding: "10px 12px", fontSize: 13, color: "#2d3748" },
//   badge: {
//     display: "inline-block",
//     padding: "3px 10px",
//     borderRadius: 12,
//     fontSize: 12,
//     fontWeight: "bold"
//   },
//   textarea: {
//     width: "100%",
//     padding: "10px 14px",
//     border: "1px solid #e2e8f0",
//     borderRadius: 6,
//     fontSize: 14,
//     resize: "vertical",
//     boxSizing: "border-box",
//     marginBottom: 12
//   }
// };

// export default App;



import { useState, useEffect, useCallback } from "react";

const BACKEND_URL = "http://localhost:5000";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("checker");
  const [emailContent, setEmailContent] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [emailResult, setEmailResult] = useState(null);

  // ✅ Load scan history
  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/history`);
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error("❌ History fetch error:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ✅ Check URL
  const checkURL = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch(`${BACKEND_URL}/api/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed })
      });

      const data = await res.json();
      setResult(data);
      fetchHistory();

    } catch (err) {
      setResult({ result: "❌ Cannot connect to backend", score: null });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit & analyze email
  const submitEmail = async () => {
    if (!emailContent.trim()) return;

    try {
      setEmailStatus(null);
      setEmailResult(null);

      const res = await fetch(`${BACKEND_URL}/api/email/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: emailContent.trim() })
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Show analysis result
        setEmailResult(data);
        setEmailContent("");

        // ✅ Auto-clear status message after 4 seconds
        setEmailStatus({ type: "success", message: "✅ Email submitted and analyzed" });
        setTimeout(() => setEmailStatus(null), 4000);
      } else {
        setEmailStatus({ type: "error", message: "❌ Submission failed" });
        setTimeout(() => setEmailStatus(null), 4000);
      }
    } catch (err) {
      setEmailStatus({ type: "error", message: "❌ Cannot connect to backend" });
      setTimeout(() => setEmailStatus(null), 4000);
    }
  };

  // ─── Helpers ────────────────────────────────────────
  const getResultColor = (r) => {
    if (!r) return "#718096";
    if (r.includes("Phishing")) return "#e53e3e";
    if (r.includes("Suspicious")) return "#dd6b20";
    if (r.includes("Safe")) return "#38a169";
    return "#718096";
  };

  const getResultBadge = (r) => {
    if (!r) return {};
    if (r === "Phishing") return { background: "#fff5f5", color: "#e53e3e" };
    if (r === "Suspicious") return { background: "#fffaf0", color: "#dd6b20" };
    if (r === "Safe") return { background: "#f0fff4", color: "#38a169" };
    return {};
  };

  const formatSource = (source) => {
    const map = {
      blacklist: "🗂 Blacklist",
      dataset: "📊 Dataset",
      ml_model: "🧠 ML Model",
      rules: "📏 Rules"
    };
    return map[source] || source || "—";
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString() : "—";

  const suspiciousCount = history.filter(h => h.result === "Suspicious").length;
  const phishingCount = history.filter(h => h.result === "Phishing").length;
  const safeCount = history.filter(h => h.result === "Safe").length;

  return (
    <div style={styles.page}>

      {/* ── Header ── */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>🔐 AI Phishing Detector</h1>
        <p style={styles.headerSub}>Dashboard — Real-time URL threat detection</p>
      </div>

      {/* ── Stats ── */}
      <div style={styles.statsRow}>
        <StatCard label="Total Scans" value={history.length} color="#3182ce" />
        <StatCard label="Suspicious ⚠️" value={suspiciousCount} color="#dd6b20" />
        <StatCard label="Phishing 🚨" value={phishingCount} color="#e53e3e" />
        <StatCard label="Safe ✅" value={safeCount} color="#38a169" />
      </div>

      {/* ── Tabs ── */}
      <div style={styles.tabRow}>
        {["checker", "history", "email"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
          >
            {tab === "checker" ? "🔍 URL Checker" : tab === "history" ? "📋 Scan History" : "📧 Email Analyzer"}
          </button>
        ))}
      </div>

      {/* ── URL Checker Tab ── */}
      {activeTab === "checker" && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Check a URL</h2>
          <div style={styles.inputRow}>
            <input
              type="text"
              placeholder="Enter URL to scan (e.g. https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkURL()}
              style={styles.input}
            />
            <button
              onClick={checkURL}
              disabled={loading}
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Checking..." : "Scan URL"}
            </button>
          </div>

          {result && (
            <div style={{ ...styles.resultBox, borderLeft: `4px solid ${getResultColor(result.result)}` }}>
              <p style={{ ...styles.resultText, color: getResultColor(result.result) }}>
                {result.result}
              </p>
              {result.score != null && (
                <p style={styles.resultMeta}>
                  Confidence: <strong>{(result.score * 100).toFixed(0)}%</strong>
                </p>
              )}
              {result.source && (
                <p style={styles.resultMeta}>
                  Detected by: <strong>{formatSource(result.source)}</strong>
                </p>
              )}
              {result.message && (
                <p style={styles.resultMeta}>{result.message}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Scan History Tab ── */}
      {activeTab === "history" && (
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={styles.cardTitle}>Scan History</h2>
            <button onClick={fetchHistory} style={styles.refreshBtn}>🔄 Refresh</button>
          </div>

          {historyLoading ? (
            <p style={styles.emptyMsg}>Loading history...</p>
          ) : history.length === 0 ? (
            <p style={styles.emptyMsg}>No scans yet. Check a URL first.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>URL</th>
                    <th style={styles.th}>Result</th>
                    <th style={styles.th}>Confidence</th>
                    <th style={styles.th}>Source</th>
                    <th style={styles.th}>Scanned At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((scan, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #edf2f7" }}>
                      <td style={{ ...styles.td, maxWidth: 250, wordBreak: "break-all", fontSize: 12 }}>
                        {scan.url}
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...getResultBadge(scan.result) }}>
                          {scan.result}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {scan.score != null ? `${(scan.score * 100).toFixed(0)}%` : "—"}
                      </td>
                      <td style={styles.td}>{formatSource(scan.source)}</td>
                      <td style={styles.td}>{formatDate(scan.checkedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Email Analyzer Tab ── */}
      {activeTab === "email" && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📧 Email Phishing Analyzer</h2>
          <p style={{ fontSize: 13, color: "#718096", marginTop: -8, marginBottom: 16 }}>
            Paste a suspicious email body below to analyze it for phishing signals.
          </p>

          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Paste suspicious email content here..."
            rows={8}
            style={styles.textarea}
          />

          <button onClick={submitEmail} style={styles.btn}>
            🔍 Analyze Email
          </button>

          {/* ✅ Auto-clearing status toast */}
          {emailStatus && (
            <p style={{
              marginTop: 10,
              fontSize: 13,
              color: emailStatus.type === "success" ? "#38a169" : "#e53e3e",
              fontWeight: "bold"
            }}>
              {emailStatus.message}
            </p>
          )}

          {/* ✅ Email analysis result */}
          {emailResult && (
            <div style={{
              marginTop: 16,
              padding: "16px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              borderLeft: `4px solid ${getResultColor(emailResult.result)}`,
              background: emailResult.isPhishing ? "#fffaf0" : "#f0fff4"
            }}>
              <p style={{
                margin: "0 0 8px",
                fontSize: 18,
                fontWeight: "bold",
                color: getResultColor(emailResult.result)
              }}>
                {emailResult.result}
              </p>

              <p style={styles.resultMeta}>
                Confidence: <strong>{(emailResult.score * 100).toFixed(0)}%</strong>
              </p>

              {/* ✅ Show matched phishing keywords */}
              {emailResult.matchedKeywords && emailResult.matchedKeywords.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ ...styles.resultMeta, marginBottom: 6 }}>
                    🚨 Phishing signals detected:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {emailResult.matchedKeywords.map((kw, i) => (
                      <span key={i} style={{
                        background: "#fff5f5",
                        color: "#e53e3e",
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontSize: 12,
                        border: "1px solid #fed7d7"
                      }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {emailResult.result.includes("Safe") && (
                <p style={{ ...styles.resultMeta, marginTop: 8, color: "#38a169" }}>
                  ✅ No phishing signals found in this email.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
      <p style={{ ...styles.statValue, color }}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f7fafc", fontFamily: "'Segoe UI', sans-serif", padding: "0 0 40px" },
  header: { background: "linear-gradient(135deg, #1a365d, #2b6cb0)", color: "#fff", padding: "28px 40px" },
  headerTitle: { margin: 0, fontSize: 24 },
  headerSub: { margin: "6px 0 0", opacity: 0.8, fontSize: 14 },
  statsRow: { display: "flex", gap: 16, padding: "24px 40px 0", flexWrap: "wrap" },
  statCard: { flex: 1, minWidth: 120, background: "#fff", borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  statValue: { margin: 0, fontSize: 28, fontWeight: "bold" },
  statLabel: { margin: "4px 0 0", fontSize: 13, color: "#718096" },
  tabRow: { display: "flex", gap: 8, padding: "24px 40px 0" },
  tab: { padding: "8px 18px", border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 13, color: "#4a5568" },
  tabActive: { background: "#2b6cb0", color: "#fff", border: "1px solid #2b6cb0" },
  card: { margin: "20px 40px 0", background: "#fff", borderRadius: 10, padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  cardTitle: { margin: "0 0 16px", fontSize: 17, color: "#2d3748" },
  inputRow: { display: "flex", gap: 10 },
  input: { flex: 1, padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14 },
  btn: { padding: "10px 20px", background: "#2b6cb0", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: "bold", whiteSpace: "nowrap" },
  refreshBtn: { padding: "6px 14px", background: "#edf2f7", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  resultBox: { marginTop: 16, padding: "14px 16px", background: "#f9f9f9", borderRadius: 8, border: "1px solid #e2e8f0" },
  resultText: { margin: "0 0 6px", fontSize: 18, fontWeight: "bold" },
  resultMeta: { margin: "3px 0", fontSize: 13, color: "#718096" },
  emptyMsg: { color: "#a0aec0", fontStyle: "italic" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#edf2f7" },
  th: { padding: "10px 12px", textAlign: "left", fontSize: 13, fontWeight: "bold", color: "#4a5568" },
  td: { padding: "10px 12px", fontSize: 13, color: "#2d3748" },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: "bold" },
  textarea: { width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, resize: "vertical", boxSizing: "border-box", marginBottom: 12 }
};

export default App;