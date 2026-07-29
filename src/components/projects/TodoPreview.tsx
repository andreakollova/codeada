'use client';

const s = { bg: '#111', card: '#1a1a1a', border: '#222', blue: '#3b82f6', text: '#fff', dim: '#666' };

export default function TodoPreview({ variables }: { variables: Record<string, any> }) {
  const tasks = Array.isArray(variables.tasks) ? variables.tasks : [];
  const taskCount = typeof variables.task_count === 'number' ? variables.task_count : tasks.length;
  const remaining = typeof variables.remaining_tasks === 'number' ? variables.remaining_tasks : undefined;
  const hasAddFn = variables.add_task === '__function__';
  const hasToggleFn = variables.toggle_task === '__function__' || variables.complete_task === '__function__';
  const hasRemoveFn = variables.remove_task === '__function__';

  const isEmpty = tasks.length === 0;

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: s.text, letterSpacing: '0.1em', marginBottom: 4 }}>
        MY TASKS
      </div>

      {/* Add input */}
      {hasAddFn && (
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, padding: '10px 14px', background: s.card, borderRadius: 8,
            border: `1px solid ${s.border}`, color: '#444', fontSize: 13,
          }}>
            Napíš novú úlohu...
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: 8, background: s.blue, display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18,
          }}>+</div>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div style={{
          padding: 32, textAlign: 'center', color: '#333', fontSize: 13, lineHeight: 1.6,
        }}>
          Zatiaľ nemáš žiadne úlohy.<br />
          Začni pridaním prvej.
        </div>
      )}

      {/* Task list */}
      {tasks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tasks.map((task: any, i: number) => {
            const isDict = typeof task === 'object' && task !== null && !Array.isArray(task);
            const title = isDict ? task.title : String(task);
            const completed = isDict ? task.completed === true : false;

            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                background: completed ? 'rgba(255,255,255,0.02)' : s.card,
                borderRadius: 8, border: `1px solid ${s.border}`,
              }}>
                {/* Checkbox */}
                <div style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: completed ? s.blue : 'transparent',
                  border: `2px solid ${completed ? s.blue : '#333'}`,
                  transition: 'all 0.2s',
                }}>
                  {completed && <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</span>}
                </div>

                {/* Title */}
                <span style={{
                  flex: 1, fontSize: 13, color: completed ? '#555' : s.text,
                  textDecoration: completed ? 'line-through' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {title}
                </span>

                {/* Delete button */}
                {hasRemoveFn && (
                  <span style={{ color: '#333', fontSize: 14, cursor: 'default' }}>×</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', fontSize: 12, color: s.dim,
        padding: '8px 0', borderTop: `1px solid ${s.border}`,
      }}>
        <span>Celkom: {taskCount}</span>
        {remaining !== undefined && <span>Zostáva: {remaining}</span>}
      </div>
    </div>
  );
}
