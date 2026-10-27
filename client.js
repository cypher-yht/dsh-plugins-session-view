window.__ModuleLoader__.load({
  id: '@local/dsh-session-view',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'session-view';

    const zh = {
      'panel.title': '会话视图',
      'panel.description': '查看所有会话及其实时状态',
      'panel.count': '{count} 个会话',
      'list.loading': '正在加载会话…',
      'list.empty': '还没有会话',
      'row.openLabel': '打开会话：{title}',
      'row.running': '运行中',
      'row.idle': '空闲',
      'row.subagent': '子代理',
      'row.blank': '空白会话',
      'row.updated': '更新于 {time}'
    };

    const en = {
      'panel.title': 'Session View',
      'panel.description': 'Browse all sessions and their live status',
      'panel.count': '{count} sessions',
      'list.loading': 'Loading sessions…',
      'list.empty': 'No sessions yet',
      'row.openLabel': 'Open session: {title}',
      'row.running': 'Running',
      'row.idle': 'Idle',
      'row.subagent': 'Sub-agent',
      'row.blank': 'Blank',
      'row.updated': 'Updated {time}'
    };

    function fmt(tpl, vars) {
      if (typeof tpl !== 'string') return '';
      return tpl.replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] !== undefined ? String(vars[k]) : m));
    }

    function shortId(id) {
      const s = String(id == null ? '' : id);
      return s.length > 16 ? `${s.slice(0, 8)}…${s.slice(-8)}` : s;
    }

    function SessionViewIcon(props) {
      const size = props && props.size ? props.size : 20;
      return h('svg', {
        viewBox: '0 0 24 24',
        width: size,
        height: size,
        'aria-hidden': true,
        style: { display: 'block' },
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      },
        h('path', { d: 'M9 6h11M9 12h11M9 18h11' }),
        h('circle', { cx: 4.6, cy: 6, r: 1.4, fill: 'currentColor', stroke: 'none' }),
        h('circle', { cx: 4.6, cy: 12, r: 1.4, fill: 'currentColor', stroke: 'none' }),
        h('circle', { cx: 4.6, cy: 18, r: 1.4, fill: 'currentColor', stroke: 'none' })
      );
    }

    function SessionViewPanel(props) {
      const useSessions = props.useSessions;
      const t = props.t;
      const onOpenSession = props.onOpenSession;

      const list = useSessions((s) => s);
      const ids = (list && list.ids) || [];
      const byId = (list && list.byId) || {};
      const phase = list ? list.phase : 'pending';

      function rowTitle(id) {
        const row = byId[id] || {};
        return row.title || row.sessionTitle || shortId(row.id || row.sessionId || id);
      }

      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          background: 'var(--dsw-alias-bg-base)'
        }
      },
        h('div', {
          style: {
            padding: '16px 20px 12px',
            borderBottom: '1px solid var(--dsw-alias-border-l1)'
          }
        },
          h('div', { style: { fontSize: 18, fontWeight: 600, lineHeight: '24px', color: 'var(--dsw-alias-label-primary)' } }, t('panel.title')),
          h('div', { style: { marginTop: 4, fontSize: 13, lineHeight: '18px', color: 'var(--dsw-alias-label-secondary)' } }, t('panel.description')),
          phase !== 'pending'
            ? h('div', { style: { marginTop: 4, fontSize: 12, color: 'var(--dsw-alias-label-secondary)' } }, fmt(t('panel.count'), { count: ids.length }))
            : null
        ),
        h('div', { style: { flex: 1, overflowY: 'auto', padding: '6px 0' } },
          phase === 'pending'
            ? h('div', { style: { padding: 32, textAlign: 'center', fontSize: 13, color: 'var(--dsw-alias-label-secondary)' } }, t('list.loading'))
            : ids.length === 0
              ? h('div', { style: { padding: 32, textAlign: 'center', fontSize: 13, color: 'var(--dsw-alias-label-secondary)' } }, t('list.empty'))
              : ids.map((id) => {
                  const row = byId[id] || {};
                  const title = rowTitle(id);
                  const running = !!row.running;
                  const subagent = row.origin === 'subagent';
                  const blank = !!row.blank;
                  const updated = row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '';
                  const statusText = (running ? t('row.running') : t('row.idle'))
                    + (subagent ? ` · ${t('row.subagent')}` : '')
                    + (blank ? ` · ${t('row.blank')}` : '')
                    + (updated ? ` · ${fmt(t('row.updated'), { time: updated })}` : '');
                  return h('button', {
                    key: id,
                    type: 'button',
                    'aria-label': fmt(t('row.openLabel'), { title }),
                    onClick: () => onOpenSession(id),
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      font: 'inherit'
                    }
                  },
                    h('span', {
                      'aria-hidden': true,
                      style: {
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: running
                          ? 'var(--dsw-alias-state-success-primary)'
                          : 'var(--dsw-alias-state-idle-primary)'
                      }
                    }),
                    h('span', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 } },
                      h('span', {
                        style: {
                          fontSize: 14,
                          lineHeight: '20px',
                          color: 'var(--dsw-alias-label-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }, title),
                      h('span', { style: { fontSize: 12, lineHeight: '16px', color: 'var(--dsw-alias-label-secondary)' } }, statusText)
                    ),
                    h('span', {
                      'aria-hidden': true,
                      style: { color: 'var(--dsw-alias-label-secondary)', fontSize: 16, flexShrink: 0 }
                    }, '›')
                  );
                })
        )
      );
    }

    return {
      inject: ['slots', 'locale', 'uiWorkspace'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'session-view: dictionaries');
        const t = ctx.locale.bind(NS);

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: 'session-view',
          order: 20,
          label: () => t('panel.title')
        }, SessionViewIcon));

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: 'session-view',
          inject: () => ({
            t,
            onOpenSession: (id) => ctx.uiWorkspace.openSession(id)
          })
        }, SessionViewPanel));
      }
    };
  }
});
