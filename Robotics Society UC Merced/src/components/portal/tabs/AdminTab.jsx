// ── Admin Tab ──────────────────────────────────────────────────────────
// User management. Only rendered for admins.
//
// Role changes also sync Django's is_staff / is_superuser flags on the
// backend, which is what controls access to /admin — see ChangeRoleView
// in backend/api/views.py.
//
// Styles: styles/portal/admin.css

import RoleBadge from '../RoleBadge'
import { formatShortDate } from '../../../lib/format'
import * as api from '../../../lib/api'
import { djangoAdminUrl } from '../../../lib/api'

export default function AdminTab({ users, currentUser, onChanged }) {
  const approve = async (id) => { await api.users.approve(id); onChanged() }
  const setRole = async (id, role) => { await api.users.changeRole(id, role); onChanged() }

  // Counters for the stat cards
  const countByRole = (role) => users.filter(u => u.role === role).length
  const stats = [
    { label: 'Total Users', val: users.length,          color: 'var(--sapphire)' },
    { label: 'Pending',     val: countByRole('pending'), color: 'var(--warning)' },
    { label: 'Members',     val: countByRole('member'),  color: 'var(--green)' },
    { label: 'Admins',      val: countByRole('admin'),   color: 'var(--sapphire)' },
  ]

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Admin Panel</h2>
          <p>Manage users, roles, and content</p>
        </div>
        <a href={djangoAdminUrl} target="_blank" rel="noopener noreferrer"
          className="btn btn-outline">Django Admin</a>
      </div>

      {/* ── Stat cards ── */}
      <div className="admin-stats">
        {stats.map(stat => (
          <div className="admin-stat-card" key={stat.label}>
            <div className="admin-stat-num" style={{ color: stat.color }}>{stat.val}</div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Users table ── */}
      <h3 style={{ marginBottom: 16 }}>All Users</h3>
      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr><th>Username</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className={u.id === currentUser.id ? 'self-row' : ''}>
                <td>
                  <strong>{u.username}</strong>
                  {u.id === currentUser.id && <span className="you-badge">you</span>}
                </td>
                <td>{u.email}</td>
                <td><RoleBadge role={u.role} /></td>
                <td>{formatShortDate(u.date_joined)}</td>
                <td>
                  {/* You cannot change your own role — the backend rejects it
                      too, so an admin can never lock themselves out. */}
                  {u.id !== currentUser.id && (
                    <div className="action-btns">
                      {u.role === 'pending' && (
                        <button className="btn-sm btn-approve" onClick={() => approve(u.id)}>✓ Approve</button>
                      )}
                      {u.role !== 'admin' && (
                        <button className="btn-sm btn-promote" onClick={() => setRole(u.id, 'admin')}>↑ Admin</button>
                      )}
                      {u.role === 'admin' && (
                        <button className="btn-sm btn-demote" onClick={() => setRole(u.id, 'member')}>↓ Member</button>
                      )}
                      {u.role !== 'pending' && (
                        <button className="btn-sm btn-demote" onClick={() => setRole(u.id, 'pending')}>
                          <i className="fi fi-rr-cross-small" /> Revoke
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
