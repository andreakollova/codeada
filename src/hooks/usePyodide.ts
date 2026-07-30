'use client';

import { useState, useEffect, useCallback } from 'react';

interface PyodideResult {
  success: boolean;
  variables: Record<string, any>;
  stdout: string;
  error: string | null;
}

interface PyodideHook {
  ready: boolean;
  loading: boolean;
  runCode: (code: string) => Promise<PyodideResult>;
  runTest: (code: string, testCode: string) => Promise<boolean>;
}

let pyodideInstance: any = null;
let pyodideLoadPromise: Promise<any> | null = null;

async function loadPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadPromise) return pyodideLoadPromise;

  pyodideLoadPromise = new Promise(async (resolve, reject) => {
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.async = true;
        await new Promise<void>((res, rej) => {
          script.onload = () => res();
          script.onerror = () => rej(new Error('Failed to load Pyodide'));
          document.head.appendChild(script);
        });
      }
      const pyodide = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });
      pyodideInstance = pyodide;
      resolve(pyodide);
    } catch (err) {
      pyodideLoadPromise = null;
      reject(err);
    }
  });

  return pyodideLoadPromise;
}

// Run code in isolated scope and extract variables
async function execInScope(pyodide: any, code: string): Promise<{ scope: Record<string, any>; stdout: string; error: string | null }> {
  let stdout = '';
  pyodide.setStdout({ batched: (text: string) => { stdout += text + '\n'; } });

  try {
    // Wrap student code in exec() with a fresh dict as scope
    const wrappedCode = `
_scope = {}
exec(${JSON.stringify(code)}, _scope)
`;
    pyodide.runPython(wrappedCode);

    // Extract variables from _scope
    const extractCode = `
import json as _j
_out = {}
for _k, _v in _scope.items():
    if _k.startswith('_'):
        continue
    try:
        if callable(_v) and not isinstance(_v, type):
            _out[_k] = '__function__'
        elif isinstance(_v, (int, float, str, bool, type(None))):
            _out[_k] = _v
        elif isinstance(_v, list):
            _out[_k] = _j.loads(_j.dumps(_v))
        elif isinstance(_v, dict):
            _out[_k] = _j.loads(_j.dumps(_v))
    except:
        pass
_j.dumps(_out)
`;
    const json = pyodide.runPython(extractCode);
    const scope = JSON.parse(json);
    return { scope, stdout: stdout.trim(), error: null };
  } catch (err: any) {
    const msg = String(err?.message || err);
    const lines = msg.split('\n').filter((l: string) => l.trim() && !l.includes('_pyodide') && !l.includes('PythonError'));
    return { scope: {}, stdout: stdout.trim(), error: lines.pop() || msg };
  }
}

export function usePyodide(): PyodideHook {
  const [ready, setReady] = useState(!!pyodideInstance);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pyodideInstance) { setReady(true); return; }
    setLoading(true);
    loadPyodide()
      .then(() => { setReady(true); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const runCode = useCallback(async (code: string): Promise<PyodideResult> => {
    const pyodide = await loadPyodide();
    const { scope, stdout, error } = await execInScope(pyodide, code);
    if (error) return { success: false, variables: {}, stdout, error };
    return { success: true, variables: scope, stdout, error: null };
  }, []);

  const runTest = useCallback(async (studentCode: string, testCode: string): Promise<boolean> => {
    const pyodide = await loadPyodide();

    try {
      // Run student code + test in same scope using exec
      const combined = studentCode + '\n\n__test_result__ = bool(' + testCode + ')';
      pyodide.runPython(`
_scope = {}
exec(${JSON.stringify(combined)}, _scope)
`);
      const result = pyodide.runPython('_scope.get("__test_result__", False)');
      return result === true || result === 1;
    } catch {
      return false;
    }
  }, []);

  return { ready, loading, runCode, runTest };
}
