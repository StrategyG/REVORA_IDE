"use client";

import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

const STORAGE_KEY = "revora.foundation.workspace.v1";
const MAX_FILE_BYTES = 1_000_000;
const STARTER_FILES = {
  "README.md": "# REVORA IDE\n\nThis is a local foundation preview. Files are stored in this browser only.\n\nAuthentication, server persistence, AI generation, terminal, build and preview execution are intentionally disabled.\n",
  "src/main.js": 'function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("REVORA"));\n',
  "src/styles.css": ":root {\n  color-scheme: dark;\n}\n\nbody {\n  margin: 0;\n}\n"
};

function languageFor(path) {
  return path.endsWith(".js") || path.endsWith(".jsx") || path.endsWith(".mjs")
    ? javascript()
    : [];
}

function isSafeClientPath(path) {
  if (!path || path.length > 240 || path.startsWith("/") || path.includes("\\") || path.includes("\0")) return false;
  const parts = path.split("/");
  return parts.every((part) =>
    part.length > 0 &&
    part !== "." &&
    part !== ".." &&
    ![".git", ".next", "node_modules"].includes(part) &&
    /^[a-zA-Z0-9._@+-]+$/.test(part)
  );
}

export default function EditorShell() {
  const [files, setFiles] = useState(STARTER_FILES);
  const [activePath, setActivePath] = useState("src/main.js");
  const [openPaths, setOpenPaths] = useState(["README.md", "src/main.js"]);
  const [hydrated, setHydrated] = useState(false);
  const [newPath, setNewPath] = useState("");
  const [notice, setNotice] = useState("Draft lokal aktif");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.files && typeof parsed.files === "object") {
          const safeEntries = Object.entries(parsed.files).filter(([path, content]) =>
            isSafeClientPath(path) && typeof content === "string" && content.length <= 1_000_000
          );
          if (safeEntries.length) {
            const restored = Object.fromEntries(safeEntries);
            setFiles(restored);
            const first = Object.keys(restored)[0];
            setActivePath(restored[parsed.activePath] !== undefined ? parsed.activePath : first);
            setOpenPaths(Array.isArray(parsed.openPaths)
              ? parsed.openPaths.filter((path) => restored[path] !== undefined)
              : [first]);
          }
        }
      }
    } catch {
      setNotice("Draft lokal tidak dapat dibaca; workspace starter digunakan");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return undefined;
    const handle = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ files, activePath, openPaths }));
        setNotice("Draft tersimpan di browser");
      } catch {
        setNotice("Penyimpanan browser penuh atau tidak tersedia");
      }
    }, 350);
    return () => window.clearTimeout(handle);
  }, [files, activePath, openPaths, hydrated]);

  const visiblePaths = useMemo(
    () => Object.keys(files).filter((path) => path.toLowerCase().includes(search.toLowerCase())).sort(),
    [files, search]
  );
  const activeContent = files[activePath] ?? "";

  function updateContent(value) {
    if (new Blob([value]).size > MAX_FILE_BYTES) {
      setNotice("Batas file preview adalah 1 MB; perubahan ini tidak disimpan.");
      return;
    }
    setFiles((current) => ({ ...current, [activePath]: value }));
    setNotice("Perubahan belum tersimpan");
  }

  function openFile(path) {
    setActivePath(path);
    setOpenPaths((current) => current.includes(path) ? current : [...current, path]);
  }

  function createFile(event) {
    event.preventDefault();
    const path = newPath.trim();
    if (!isSafeClientPath(path)) {
      setNotice("Path tidak valid. Gunakan path relatif tanpa spasi atau '..'.");
      return;
    }
    if (Object.prototype.hasOwnProperty.call(files, path)) {
      setNotice("File sudah ada.");
      return;
    }
    setFiles((current) => ({ ...current, [path]: "" }));
    setOpenPaths((current) => [...current, path]);
    setActivePath(path);
    setNewPath("");
    setNotice("File baru dibuat dalam draft browser");
  }

  function downloadFile() {
    const blob = new Blob([activeContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activePath.split("/").pop() || "untitled.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportWorkspace() {
    const blob = new Blob([JSON.stringify({ schemaVersion: 1, files }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "revora-workspace-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function closeTab(path) {
    const next = openPaths.filter((item) => item !== path);
    setOpenPaths(next);
    if (activePath === path) setActivePath(next[next.length - 1] || "");
  }

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ files, activePath, openPaths }));
          setNotice("Draft tersimpan di browser");
        } catch {
          setNotice("Penyimpanan browser tidak tersedia");
        }
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [files, activePath, openPaths]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="REVORA IDE home">
          <span className="brand-mark">R</span>
          <span>REVORA <b>IDE</b></span>
        </a>
        <div className="topbar-center">Engineering workspace</div>
        <div className="topbar-actions">
          <span className="preview-chip">LOCAL PREVIEW</span>
          <button className="button button-quiet" onClick={exportWorkspace} type="button">Export workspace</button>
        </div>
      </header>

      <div className="warning-banner" role="status">
        <strong>Foundation preview.</strong>
        <span>Perubahan hanya tersimpan di browser ini. Sinkronisasi server, autentikasi, AI, terminal, build, dan preview runtime belum aktif.</span>
      </div>

      <section className="workspace">
        <aside className="sidebar">
          <div className="panel-heading"><span>EXPLORER</span><span className="muted">LOCAL</span></div>
          <label className="search-label" htmlFor="file-search">Find file</label>
          <input id="file-search" className="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search files…" />
          <div className="file-list" role="list" aria-label="Workspace files">
            {visiblePaths.map((path) => (
              <button className={"file-item " + (activePath === path ? "selected" : "")} key={path} onClick={() => openFile(path)} type="button">
                <span className="file-dot">{path.endsWith(".js") ? "JS" : path.endsWith(".css") ? "#" : "MD"}</span>
                <span>{path}</span>
              </button>
            ))}
            {visiblePaths.length === 0 && <p className="empty-state">No matching files.</p>}
          </div>
          <form className="new-file-form" onSubmit={createFile}>
            <label htmlFor="new-file">Create file</label>
            <input id="new-file" value={newPath} onChange={(event) => setNewPath(event.target.value)} placeholder="src/new-file.js" />
            <button className="button button-small" type="submit">Add file</button>
          </form>
          <div className="sidebar-footer">
            <span className="status-led" />
            <span>{notice}</span>
          </div>
        </aside>

        <section className="editor-column" aria-label="Code editor">
          <div className="tabbar">
            {openPaths.map((path) => (
              <div className={"tab " + (activePath === path ? "active" : "")} key={path}>
                <button type="button" onClick={() => setActivePath(path)}>{path.split("/").pop()}</button>
                <button className="tab-close" type="button" aria-label={"Close " + path} onClick={() => closeTab(path)}>×</button>
              </div>
            ))}
            <div className="tab-spacer" />
            <button className="button button-small button-quiet" onClick={downloadFile} type="button">Download file</button>
          </div>
          <div className="editor-breadcrumb">{activePath || "No file selected"}</div>
          {activePath ? (
            <CodeMirror
              value={activeContent}
              height="100%"
              theme={oneDark}
              extensions={languageFor(activePath)}
              onChange={updateContent}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                autocompletion: false
              }}
              aria-label={"Editor for " + activePath}
            />
          ) : (
            <div className="editor-empty">Select a file from the explorer.</div>
          )}
          <div className="statusbar">
            <span>{(activePath || "").endsWith(".js") ? "JavaScript" : (activePath || "").endsWith(".css") ? "CSS" : "Text / Markdown"}</span>
            <span>UTF-8</span>
            <span>Local draft</span>
            <span className="status-right">Ctrl/Cmd + S · Browser storage</span>
          </div>
        </section>

        <aside className="assistant-panel">
          <div className="panel-heading"><span>AI ASSISTANT</span><span className="muted">LOCKED</span></div>
          <div className="assistant-empty">
            <div className="assistant-orb">✦</div>
            <h2>AI gateway belum dikonfigurasi</h2>
            <p>AI akan diaktifkan setelah server-side credentials, project authorization, context provenance, patch validation, dan approval flow tersedia.</p>
            <button className="button button-disabled" type="button" disabled>Generate code</button>
          </div>
          <div className="assistant-note">
            Model output nantinya berupa patch proposal yang dapat ditinjau. Model tidak boleh menulis langsung ke workspace atau menjalankan perintah.
          </div>
        </aside>
      </section>

      <footer className="bottom-bar">
        <span><span className="status-led" /> Workspace browser-only</span>
        <span>Execution disabled by policy</span>
      </footer>
    </main>
  );
}
