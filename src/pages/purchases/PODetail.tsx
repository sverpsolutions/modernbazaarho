import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { purchases_api, type po_detail } from '../../api/purchases'

const STATUS_COLOR: Record<string, string> = {
  draft:            'bg-slate-100 text-slate-600 border-slate-300',
  pending_approval: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  approved:         'bg-green-100 text-green-800 border-green-300',
  partial:          'bg-blue-100 text-blue-800 border-blue-300',
  completed:        'bg-emerald-100 text-emerald-800 border-emerald-300',
  cancelled:        'bg-red-100 text-red-700 border-red-300',
}

function fmt_amt(n: number | string, dec = 2) {
  return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

function fmt_date(s?: string | null) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmt_dt(s?: string | null) {
  if (!s) return '—'
  return new Date(s).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function doh_class(doh: number | null) {
  if (doh === null || doh === undefined) return 'bg-slate-100 text-slate-400'
  if (doh < 3)  return 'bg-red-100 text-red-700 font-bold'
  if (doh <= 7) return 'bg-orange-100 text-orange-700 font-bold'
  return 'bg-green-100 text-green-700 font-bold'
}

export default function PODetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [po, set_po]           = useState<po_detail | null>(null)
  const [loading, set_loading] = useState(true)
  const [approving, set_approving] = useState(false)
  const [remarks, set_remarks]     = useState('')
  const [show_approve, set_show_approve] = useState(false)
  const [approve_action, set_approve_action] = useState<'approved' | 'rejected'>('approved')
  const [err, set_err] = useState('')

  useEffect(() => {
    if (!id) return
    set_loading(true)
    purchases_api.get_po(Number(id))
      .then(r => set_po(r.data))
      .catch(() => set_err('Failed to load PO'))
      .finally(() => set_loading(false))
  }, [id])

  async function do_approve() {
    if (!id) return
    set_approving(true)
    try {
      await purchases_api.approve_po(Number(id), approve_action, remarks)
      const r = await purchases_api.get_po(Number(id))
      set_po(r.data)
      set_show_approve(false)
      set_remarks('')
    } catch (e: any) {
      set_err(e?.response?.data?.detail || 'Action failed')
    } finally {
      set_approving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <i className="fas fa-spinner fa-spin mr-2 text-2xl"></i>
      </div>
    )
  }

  if (!po) {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="text-4xl mb-3">📋</div>
        {err || 'PO not found'}
        <div className="mt-4">
          <button onClick={() => navigate('/purchases/po')} className="text-blue-600 underline text-sm">
            ← Back to list
          </button>
        </div>
      </div>
    )
  }

  const grand_total = po.items.reduce((s, i) => s + Number(i.order_qty) * Number(i.rate), 0)

  return (
    <div className="space-y-4 pb-8">
      {/* Toolbar */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-800">{po.po_no}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${STATUS_COLOR[po.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
              {po.status.replace('_', ' ')}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${
              po.approval_status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
              po.approval_status === 'rejected' ? 'bg-red-100 text-red-600 border-red-200' :
              'bg-yellow-50 text-yellow-700 border-yellow-200'
            }`}>
              {po.approval_status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supplier: <b className="text-slate-600">{po.supplier_name}</b>
            {po.outlet_name && <> &nbsp;→&nbsp; <b className="text-slate-600">{po.outlet_name}</b></>}
          </p>
        </div>
        <div className="flex gap-2">
          {po.status === 'draft' && (
            <button
              onClick={() => navigate(`/purchases/po/edit/${po.id}`)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors">
              <i className="fas fa-edit mr-1.5"></i> Edit PO
            </button>
          )}
          {po.status === 'approved' && (
            <button
              onClick={() => navigate(`/purchases/po/${po.id}/distribute`)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors">
              <i className="fas fa-share-alt mr-1.5"></i> Distribute
            </button>
          )}
          {po.approval_status === 'pending' && (
            <>
              <button
                onClick={() => { set_approve_action('approved'); set_show_approve(true) }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors">
                <i className="fas fa-check mr-1.5"></i> Approve
              </button>
              <button
                onClick={() => { set_approve_action('rejected'); set_show_approve(true) }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors">
                <i className="fas fa-times mr-1.5"></i> Reject
              </button>
            </>
          )}
          <button
            onClick={() => navigate('/purchases/po')}
            className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
            ← Back
          </button>
        </div>
      </div>

      {/* Approve modal */}
      {show_approve && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="font-bold text-slate-800 mb-4">
              {approve_action === 'approved' ? '✅ Approve PO' : '❌ Reject PO'}
            </h2>
            <textarea
              value={remarks}
              onChange={e => set_remarks(e.target.value)}
              rows={3}
              placeholder="Remarks (optional for approval, required for rejection)…"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {err && <p className="text-xs text-red-600 mt-2">{err}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => set_show_approve(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={do_approve} disabled={approving}
                className={`px-5 py-2 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 ${
                  approve_action === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                }`}>
                {approving ? '…' : approve_action === 'approved' ? 'Confirm Approve' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'PO Date',        value: fmt_date(po.po_date) },
          { label: 'Expected',       value: fmt_date(po.expected_date) },
          { label: 'Lead Days',      value: `${po.delivery_days}d` },
          { label: 'Total Items',    value: po.items.length },
          { label: 'Grand Total',    value: fmt_amt(grand_total) },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-100 px-4 py-3 shadow-sm">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">{c.label}</div>
            <div className="text-lg font-black text-slate-800 mt-0.5">{c.value}</div>
          </div>
        ))}
      </div>

      {/* Items table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-800 text-white px-4 py-2.5 font-bold text-sm flex items-center gap-2">
          <span>📦</span> Order Items
          <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{po.items.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-2 text-left text-slate-600">#</th>
                <th className="px-4 py-2 text-left text-slate-600">Item</th>
                <th className="px-3 py-2 text-center text-blue-700">SOH</th>
                <th className="px-3 py-2 text-center">DOH</th>
                <th className="px-3 py-2 text-center text-slate-500">7d Sale</th>
                <th className="px-3 py-2 text-center text-slate-500">30d Sale</th>
                <th className="px-3 py-2 text-center text-cyan-700">Avg/Day</th>
                <th className="px-3 py-2 text-center text-amber-700">Suggested</th>
                <th className="px-3 py-2 text-center font-bold text-slate-700">Ordered</th>
                <th className="px-3 py-2 text-center">GST%</th>
                <th className="px-3 py-2 text-right">Rate</th>
                <th className="px-3 py-2 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {po.items.map((item, idx) => {
                const amt = Number(item.order_qty) * Number(item.rate)
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-slate-800">{item.product_name}</div>
                      <div className="text-slate-400 font-mono text-[10px]">{item.item_code}</div>
                    </td>
                    <td className="px-3 py-2.5 text-center font-bold text-blue-700 bg-blue-50/30">
                      {Number(item.warehouse_stock).toFixed(0)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${doh_class(item.doh_value ? Number(item.doh_value) : null)}`}>
                        {item.doh_value ? `${Number(item.doh_value).toFixed(1)}d` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-500">{Number(item.sale_7d).toFixed(1)}</td>
                    <td className="px-3 py-2.5 text-center text-slate-500">{Number(item.sale_30d).toFixed(1)}</td>
                    <td className="px-3 py-2.5 text-center text-cyan-700">{Number(item.avg_daily_sale).toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-center text-amber-700 font-bold">
                      {Number(item.suggested_qty).toFixed(0)}
                    </td>
                    <td className="px-3 py-2.5 text-center font-black text-slate-800 text-sm">
                      {Number(item.order_qty).toFixed(0)}
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-500">{Number(item.gst_percent)}%</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700">
                      {fmt_amt(Number(item.rate))}
                    </td>
                    <td className="px-3 py-2.5 text-right font-black font-mono text-slate-800">
                      {fmt_amt(amt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
              <tr>
                <td colSpan={11} className="px-4 py-2.5 text-right font-bold text-slate-600">Grand Total:</td>
                <td className="px-3 py-2.5 text-right font-black text-lg text-red-600 font-mono">
                  {fmt_amt(grand_total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Terms & Conditions */}
      {po.terms_conditions.length > 0 && (
        <div className="bg-white rounded-xl border border-yellow-200 shadow-sm p-4">
          <div className="text-xs font-bold text-slate-500 uppercase mb-3">📋 Terms & Conditions</div>
          <div className="space-y-2">
            {po.terms_conditions
              .sort((a, b) => a.sequence_no - b.sequence_no)
              .map(t => (
                <div key={t.id}
                  className={`border-l-4 px-3 py-2 rounded-r text-xs ${
                    t.term_type === 'FIXED'
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-green-400 bg-green-50'
                  }`}>
                  <b className={t.term_type === 'FIXED' ? 'text-blue-700' : 'text-green-700'}>
                    {t.term_type === 'FIXED' ? '🔒' : '✏️'} {t.title}
                  </b>
                  {t.description && <span className="text-slate-600 ml-1">— {t.description}</span>}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {po.notes && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">📝 Notes</div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{po.notes}</p>
        </div>
      )}

      {/* Audit log */}
      {po.audit_logs && po.audit_logs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="text-xs font-bold text-slate-500 uppercase mb-3">🕐 Activity Log</div>
          <div className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200"></div>
            {po.audit_logs.map(log => (
              <div key={log.id} className="mb-3 relative">
                <div className="absolute -left-4 top-0.5 w-2 h-2 rounded-full bg-blue-400 border-2 border-white"></div>
                <div className="ml-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    {log.action}
                    {log.old_status && log.new_status && (
                      <span className="text-slate-400 font-normal">
                        {log.old_status} → {log.new_status}
                      </span>
                    )}
                  </div>
                  {log.description && (
                    <div className="text-xs text-slate-500 mt-0.5">{log.description}</div>
                  )}
                  <div className="text-[10px] text-slate-400 mt-0.5">{fmt_dt(log.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
