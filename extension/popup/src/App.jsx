// // import { useState, useEffect } from "react";

// // const BACKEND_URL = "http://localhost:5000/api/check";

// // function App() {
// //   const [url, setUrl] = useState("");
// //   const [result, setResult] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   // ✅ Listen from background.js (auto-scan result)
// //   useEffect(() => {
// //     const listener = (message) => {
// //       if (message.result) {
// //         setResult({
// //           result: message.result,
// //           score: message.score,
// //           source: message.source,
// //           url: message.url
// //         });
// //         setUrl(message.url || "");
// //       }
// //     };

// //     chrome.runtime.onMessage.addListener(listener);
// //     return () => chrome.runtime.onMessage.removeListener(listener);
// //   }, []);

// //   // ✅ Manual URL check
// //   const checkWebsite = async () => {
// //     const trimmed = url.trim();
// //     if (!trimmed) {
// //       setResult({ result: "Please enter a URL", score: null });
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       setResult(null);

// //       const response = await fetch(BACKEND_URL, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ url: trimmed })
// //       });

// //       const data = await response.json();
// //       setResult(data);

// //     } catch (error) {
// //       console.error("❌ Fetch error:", error);
// //       setResult({ result: "❌ Cannot connect to backend", score: null });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ FIXED: Suspicious → orange, Phishing → red, Safe → green
// //   const getResultStyle = (resultText) => {
// //     if (!resultText) return { color: "#888" };
// //     if (resultText.includes("Phishing")) return { color: "#e53e3e", fontWeight: "bold" };
// //     if (resultText.includes("Suspicious")) return { color: "#dd6b20", fontWeight: "bold" };
// //     if (resultText.includes("Safe")) return { color: "#38a169", fontWeight: "bold" };
// //     return { color: "#888" };
// //   };

// //   const getResultBg = (resultText) => {
// //     if (!resultText) return "#f9f9f9";
// //     if (resultText.includes("Phishing")) return "#fff5f5";
// //     if (resultText.includes("Suspicious")) return "#fffaf0";
// //     if (resultText.includes("Safe")) return "#f0fff4";
// //     return "#f9f9f9";
// //   };

// //   const formatScore = (score) => {
// //     if (score == null) return "";
// //     return `${(score * 100).toFixed(0)}% confidence`;
// //   };

// //   const formatSource = (source) => {
// //     const map = {
// //       blacklist: "🗂 Blacklist",
// //       dataset: "📊 Dataset",
// //       ml_model: "🧠 ML Model",
// //       rules: "📏 Rule-based"
// //     };
// //     return map[source] || source;
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <h3 style={styles.title}>🔐 AI Phishing Detector</h3>

// //       {/* URL Input */}
// //       <input
// //         type="text"
// //         placeholder="Enter website URL..."
// //         value={url}
// //         onChange={(e) => setUrl(e.target.value)}
// //         onKeyDown={(e) => e.key === "Enter" && checkWebsite()}
// //         style={styles.input}
// //       />

// //       <button
// //         onClick={checkWebsite}
// //         disabled={loading}
// //         style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
// //       >
// //         {loading ? "Checking..." : "Check URL"}
// //       </button>

// //       {/* Result Box */}
// //       {result && result.result && (
// //         <div style={{ ...styles.resultBox, background: getResultBg(result.result) }}>
// //           <p style={{ ...styles.resultText, ...getResultStyle(result.result) }}>
// //             {result.result}
// //           </p>
// //           {result.score != null && (
// //             <p style={styles.meta}>{formatScore(result.score)}</p>
// //           )}
// //           {result.source && (
// //             <p style={styles.meta}>Source: {formatSource(result.source)}</p>
// //           )}
// //           {result.url && (
// //             <p style={{ ...styles.meta, wordBreak: "break-all", fontSize: 10 }}>
// //               {result.url}
// //             </p>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // const styles = {
// //   container: {
// //     padding: "16px",
// //     width: "300px",
// //     fontFamily: "'Segoe UI', sans-serif",
// //     background: "#fff"
// //   },
// //   title: {
// //     margin: "0 0 12px",
// //     fontSize: "15px",
// //     color: "#2d3748"
// //   },
// //   input: {
// //     width: "100%",
// //     padding: "8px 10px",
// //     marginBottom: "8px",
// //     border: "1px solid #cbd5e0",
// //     borderRadius: "6px",
// //     fontSize: "13px",
// //     boxSizing: "border-box"
// //   },
// //   button: {
// //     width: "100%",
// //     padding: "9px",
// //     background: "#3182ce",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "6px",
// //     cursor: "pointer",
// //     fontSize: "13px",
// //     fontWeight: "bold"
// //   },
// //   resultBox: {
// //     marginTop: "12px",
// //     padding: "10px 12px",
// //     borderRadius: "8px",
// //     border: "1px solid #e2e8f0"
// //   },
// //   resultText: {
// //     margin: "0 0 4px",
// //     fontSize: "14px"
// //   },
// //   meta: {
// //     margin: "2px 0",
// //     fontSize: "11px",
// //     color: "#718096"
// //   }
// // };

// // export default App;


// import { useState, useEffect } from "react";

// const BACKEND_URL = "http://localhost:5000/api/check";

// function App() {
//   const [url, setUrl] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const listener = (message) => {
//       if (message.result) {
//         setResult({
//           result: message.result,
//           score: message.score,
//           source: message.source,
//           url: message.url
//         });
//         setUrl(message.url || "");
//       }
//     };
//     chrome.runtime.onMessage.addListener(listener);
//     return () => chrome.runtime.onMessage.removeListener(listener);
//   }, []);

//   const checkWebsite = async () => {
//     const trimmed = url.trim();
//     if (!trimmed) {
//       setResult({ result: "Please enter a URL", score: null });
//       return;
//     }
//     try {
//       setLoading(true);
//       setResult(null);
//       const response = await fetch(BACKEND_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url: trimmed })
//       });
//       const data = await response.json();
//       setResult(data);
//     } catch (error) {
//       setResult({ result: "❌ Cannot connect to backend", score: null });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getResultStyle = (resultText) => {
//     if (!resultText) return { color: "#888" };
//     if (resultText.includes("Phishing")) return { color: "#e53e3e", fontWeight: "bold" };
//     if (resultText.includes("Suspicious")) return { color: "#dd6b20", fontWeight: "bold" };
//     if (resultText.includes("Safe")) return { color: "#38a169", fontWeight: "bold" };
//     return { color: "#888" };
//   };

//   const getResultBg = (resultText) => {
//     if (!resultText) return "#f9f9f9";
//     if (resultText.includes("Phishing")) return "#fff5f5";
//     if (resultText.includes("Suspicious")) return "#fffaf0";
//     if (resultText.includes("Safe")) return "#f0fff4";
//     return "#f9f9f9";
//   };

//   const getBorderColor = (resultText) => {
//     if (!resultText) return "#e2e8f0";
//     if (resultText.includes("Phishing")) return "#feb2b2";
//     if (resultText.includes("Suspicious")) return "#fbd38d";
//     if (resultText.includes("Safe")) return "#9ae6b4";
//     return "#e2e8f0";
//   };

//   const formatScore = (score) => {
//     if (score == null) return "";
//     return `${(score * 100).toFixed(0)}% confidence`;
//   };

//   const formatSource = (source) => {
//     const map = {
//       blacklist: "🗂 Blacklist",
//       dataset: "📊 Dataset",
//       ml_model: "🧠 ML Model",
//       rules: "📏 Rule-based"
//     };
//     return map[source] || source;
//   };

//   return (
//     <div style={styles.container}>

//       {/* Header */}
//       <div style={styles.header}>
//         <span style={styles.headerIcon}>🔐</span>
//         <div>
//           <p style={styles.headerTitle}>AI Phishing Detector</p>
//           <p style={styles.headerSub}>Stay safe online</p>
//         </div>
//       </div>

//       {/* Input */}
//       <div style={styles.body}>
//         <label style={styles.label}>Enter URL to check</label>
//         <input
//           type="text"
//           placeholder="e.g. https://example.com"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && checkWebsite()}
//           style={styles.input}
//         />

//         <button
//           onClick={checkWebsite}
//           disabled={loading}
//           style={{ ...styles.button, opacity: loading ? 0.75 : 1 }}
//         >
//           {loading ? "Checking..." : "🔍 Check URL"}
//         </button>

//         {/* Result */}
//         {result && result.result && (
//           <div style={{
//             ...styles.resultBox,
//             background: getResultBg(result.result),
//             borderColor: getBorderColor(result.result)
//           }}>
//             <p style={{ ...styles.resultText, ...getResultStyle(result.result) }}>
//               {result.result}
//             </p>

//             {result.score != null && (
//               <p style={styles.meta}>
//                 Confidence: <strong>{formatScore(result.score)}</strong>
//               </p>
//             )}

//             {result.source && (
//               <p style={styles.meta}>
//                 Source: <strong>{formatSource(result.source)}</strong>
//               </p>
//             )}

//             {result.url && (
//               <p style={styles.urlMeta}>{result.url}</p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div style={styles.footer}>
//         Powered by AI + 114k phishing dataset
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     width: "420px",
//     fontFamily: "'Segoe UI', sans-serif",
//     background: "#fff",
//     borderRadius: "10px",
//     overflow: "hidden"
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     background: "linear-gradient(135deg, #1a365d, #2b6cb0)",
//     padding: "16px 20px"
//   },
//   headerIcon: { fontSize: "28px" },
//   headerTitle: { margin: 0, fontSize: "16px", fontWeight: "bold", color: "#fff" },
//   headerSub: { margin: "2px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.75)" },
//   body: { padding: "20px" },
//   label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#4a5568", marginBottom: "8px" },
//   input: {
//     width: "100%", padding: "11px 14px", marginBottom: "12px",
//     border: "1.5px solid #cbd5e0", borderRadius: "8px", fontSize: "14px",
//     boxSizing: "border-box", outline: "none", color: "#2d3748"
//   },
//   button: {
//     width: "100%", padding: "12px", background: "#2b6cb0", color: "#fff",
//     border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "bold"
//   },
//   resultBox: { marginTop: "16px", padding: "14px 16px", borderRadius: "10px", border: "1.5px solid" },
//   resultText: { margin: "0 0 8px", fontSize: "18px" },
//   meta: { margin: "4px 0", fontSize: "13px", color: "#718096" },
//   urlMeta: { margin: "6px 0 0", fontSize: "11px", color: "#a0aec0", wordBreak: "break-all" },
//   footer: {
//     padding: "10px 20px", background: "#f7fafc", fontSize: "11px",
//     color: "#a0aec0", textAlign: "center", borderTop: "1px solid #e2e8f0"
//   }
// };

// export default App;


import { useState, useEffect } from "react";
 
const BACKEND_URL = "http://localhost:5000/api/check";
 
function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    const listener = (message) => {
      if (message.result) {
        setResult({
          result: message.result,
          score: message.score,
          source: message.source,
          url: message.url
        });
        setUrl(message.url || "");
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);
 
  const checkWebsite = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setResult({ result: "Please enter a URL", score: null });
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ result: "❌ Cannot connect to backend", score: null });
    } finally {
      setLoading(false);
    }
  };
 
  const getResultStyle = (resultText) => {
    if (!resultText) return { color: "#888" };
    if (resultText.includes("Phishing")) return { color: "#e53e3e", fontWeight: "bold" };
    if (resultText.includes("Suspicious")) return { color: "#dd6b20", fontWeight: "bold" };
    if (resultText.includes("Safe")) return { color: "#38a169", fontWeight: "bold" };
    return { color: "#888" };
  };
 
  const getResultBg = (resultText) => {
    if (!resultText) return "#f9f9f9";
    if (resultText.includes("Phishing")) return "#fff5f5";
    if (resultText.includes("Suspicious")) return "#fffaf0";
    if (resultText.includes("Safe")) return "#f0fff4";
    return "#f9f9f9";
  };
 
  const getBorderColor = (resultText) => {
    if (!resultText) return "#e2e8f0";
    if (resultText.includes("Phishing")) return "#feb2b2";
    if (resultText.includes("Suspicious")) return "#fbd38d";
    if (resultText.includes("Safe")) return "#9ae6b4";
    return "#e2e8f0";
  };
 
  const formatScore = (score) => {
    if (score == null) return "";
    return `${(score * 100).toFixed(0)}% confidence`;
  };
 
  const formatSource = (source) => {
    const map = {
      blacklist: "🗂 Blacklist",
      dataset: "📊 Dataset",
      ml_model: "🧠 ML Model",
      rules: "📏 Rule-based"
    };
    return map[source] || source;
  };
 
  return (
    <div style={styles.container}>
 
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>🔐</span>
        <div>
          <p style={styles.headerTitle}>AI Phishing Detector</p>
          <p style={styles.headerSub}>Stay safe online</p>
        </div>
      </div>
 
      {/* Input */}
      <div style={styles.body}>
        <label style={styles.label}>Enter URL to check</label>
        <input
          type="text"
          placeholder="e.g. https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkWebsite()}
          style={styles.input}
        />
 
        <button
          onClick={checkWebsite}
          disabled={loading}
          style={{ ...styles.button, opacity: loading ? 0.75 : 1 }}
        >
          {loading ? "Checking..." : "🔍 Check URL"}
        </button>
 
        {/* Result */}
        {result && result.result && (
          <div style={{
            ...styles.resultBox,
            background: getResultBg(result.result),
            borderColor: getBorderColor(result.result)
          }}>
            <p style={{ ...styles.resultText, ...getResultStyle(result.result) }}>
              {result.result}
            </p>
 
            {result.score != null && (
              <p style={styles.meta}>
                Confidence: <strong>{formatScore(result.score)}</strong>
              </p>
            )}
 
            {result.source && (
              <p style={styles.meta}>
                Source: <strong>{formatSource(result.source)}</strong>
              </p>
            )}
 
            {result.url && (
              <p style={styles.urlMeta}>{result.url}</p>
            )}
          </div>
        )}
      </div>
 
      {/* Footer */}
      <div style={styles.footer}>
        Powered by AI + 114k phishing dataset
      </div>
    </div>
  );
}
 
const styles = {
  container: {
    width: "420px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "linear-gradient(135deg, #1a365d, #2b6cb0)",
    padding: "16px 20px"
  },
  headerIcon: { fontSize: "28px" },
  headerTitle: { margin: 0, fontSize: "16px", fontWeight: "bold", color: "#fff" },
  headerSub: { margin: "2px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.75)" },
  body: { padding: "20px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#4a5568", marginBottom: "8px" },
  input: {
    width: "100%", padding: "11px 14px", marginBottom: "12px",
    border: "1.5px solid #cbd5e0", borderRadius: "8px", fontSize: "14px",
    boxSizing: "border-box", outline: "none", color: "#2d3748"
  },
  button: {
    width: "100%", padding: "12px", background: "#2b6cb0", color: "#fff",
    border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "bold"
  },
  resultBox: { marginTop: "16px", padding: "14px 16px", borderRadius: "10px", border: "1.5px solid" },
  resultText: { margin: "0 0 8px", fontSize: "18px" },
  meta: { margin: "4px 0", fontSize: "13px", color: "#718096" },
  urlMeta: { margin: "6px 0 0", fontSize: "11px", color: "#a0aec0", wordBreak: "break-all" },
  footer: {
    padding: "10px 20px", background: "#f7fafc", fontSize: "11px",
    color: "#a0aec0", textAlign: "center", borderTop: "1px solid #e2e8f0"
  }
};
 
export default App;