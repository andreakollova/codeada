'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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
let pyodideLoading = false;
let pyodideLoadPromise: Promise<any> | null = null;

async function loadPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadPromise) return pyodideLoadPromise;

  pyodideLoading = true;
  pyodideLoadPromise = new Promise(async (resolve, reject) => {
    try {
      // Load Pyodide script
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
      pyodideLoading = false;
      resolve(pyodide);
    } catch (err) {
      pyodideLoading = false;
      pyodideLoadPromise = null;
      reject(err);
    }
  });

  return pyodideLoadPromise;
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
    let stdout = '';

    // Capture print output
    pyodide.setStdout({ batched: (text: string) => { stdout += text + '\n'; } });

    try {
      // Reset namespace
      pyodide.runPython('import sys\nfor k in list(globals().keys()):\n  if k not in ("__builtins__", "__name__", "__doc__", "sys"):\n    del globals()[k]');

      // Run student code
      pyodide.runPython(code);

      // Extract variables
      const varsCode = `
import json
_vars = {}
for _k, _v in globals().items():
  if _k.startswith('_') or _k in ('json', 'sys', 'random', 'string', 'math'):
    continue
  try:
    if callable(_v) and not isinstance(_v, type):
      _vars[_k] = '__function__'
    elif isinstance(_v, (int, float, str, bool, list, dict, type(None))):
      _vars[_k] = _v
  except:
    pass
json.dumps(_vars)
`;
      const varsJson = pyodide.runPython(varsCode);
      const variables = JSON.parse(varsJson);

      return { success: true, variables, stdout: stdout.trim(), error: null };
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      // Clean up Pyodide error formatting
      const cleaned = errorMsg.split('\n').filter((l: string) =>
        !l.includes('File "<exec>"') && !l.includes('PythonError')
      ).join('\n').trim() || errorMsg;

      return { success: false, variables: {}, stdout: stdout.trim(), error: cleaned };
    }
  }, []);

  const runTest = useCallback(async (studentCode: string, testCode: string): Promise<boolean> => {
    const pyodide = await loadPyodide();

    try {
      // Reset and run student code first
      pyodide.runPython('import sys\nfor k in list(globals().keys()):\n  if k not in ("__builtins__", "__name__", "__doc__", "sys"):\n    del globals()[k]');
      pyodide.runPython(studentCode);

      // Run test — should evaluate to True/False
      const result = pyodide.runPython(testCode);
      return result === true || result === 1 || String(result) === 'True';
    } catch {
      return false;
    }
  }, []);

  return { ready, loading, runCode, runTest };
}
