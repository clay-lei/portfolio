'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'

type Investment = {
  id: string
  symbol: string
  shares: number
  buyPrice: number
  buyDate: string
  notes: string
  currentPrice?: number
}

type PortfolioMeta = {
  cash: number
  realizedPnl: number
}

type ResearchItem = {
  symbol: string
  company: string
  category: string
  glyph: string
  accent: string
  stance: string
  narrativeScore: number
  conviction: number
  risk: number
  thesis: string
  bullCase: string
  bearCase: string
  nextCheckpoint: string
  sourceUrl: string
}

const STORAGE_KEY = 'millor-investments'
const META_STORAGE_KEY = 'millor-investment-meta'
const SNAPSHOT_DATE = 'July 15, 2026 close'

const MARKET_SNAPSHOT: Record<string, number> = {
  MSTR: 97.47,
  UNH: 418.52,
  NVO: 50.56,
  AMZN: 254.96,
  EL: 82.31,
  QQQ: 717.74
}

const RESEARCH: ResearchItem[] = [
  {
    symbol: 'MSTR',
    company: 'Strategy',
    category: 'Bitcoin treasury',
    glyph: '₿',
    accent: '#f59e0b',
    stance: 'Highest conviction · highest volatility',
    narrativeScore: 64,
    conviction: 92,
    risk: 96,
    thesis:
      'A leveraged Bitcoin proxy whose upside depends on BTC appreciation, capital-market access, and growth in Bitcoin per share.',
    bullCase:
      'BTC enters a new expansion phase and Strategy keeps raising capital above its underlying asset value.',
    bearCase:
      'BTC drawdown, premium compression, dilution, or higher financing costs can amplify losses.',
    nextCheckpoint: 'Q2 results · July 30, 2026',
    sourceUrl: 'https://www.strategy.com/investor-relations'
  },
  {
    symbol: 'UNH',
    company: 'UnitedHealth Group',
    category: 'Managed-care recovery',
    glyph: '✚',
    accent: '#2563eb',
    stance: 'Recovery watch · quality under pressure',
    narrativeScore: 61,
    conviction: 74,
    risk: 58,
    thesis:
      'A scale-driven healthcare compounder whose recovery depends on medical-cost normalization, pricing discipline, and regulatory execution.',
    bullCase:
      'Managed-care margins recover as pricing catches up with utilization and operational controls improve.',
    bearCase:
      'Medical-cost pressure, investigations, reimbursement changes, or execution issues delay the recovery.',
    nextCheckpoint: 'Q2 earnings · July 16, 2026',
    sourceUrl: 'https://www.unitedhealthgroup.com/investors.html'
  },
  {
    symbol: 'NVO',
    company: 'Novo Nordisk',
    category: 'Obesity / diabetes',
    glyph: '◉',
    accent: '#0f766e',
    stance: 'Product momentum · mixed earnings setup',
    narrativeScore: 58,
    conviction: 70,
    risk: 67,
    thesis:
      'A GLP-1 leader with strong oral Wegovy momentum, balanced against pricing pressure, competition, and weaker 2026 guidance.',
    bullCase:
      'Oral Wegovy expands the market, improves access, and protects Novo’s leadership in obesity care.',
    bearCase:
      'Price pressure, Eli Lilly competition, and patent or reimbursement changes keep revenue growth subdued.',
    nextCheckpoint: 'H1 results · August 5, 2026',
    sourceUrl: 'https://www.novonordisk.com/investors/financial-results.html'
  },
  {
    symbol: 'AMZN',
    company: 'Amazon',
    category: 'Cloud + commerce',
    glyph: 'a',
    accent: '#111827',
    stance: 'Quality compounder',
    narrativeScore: 72,
    conviction: 76,
    risk: 47,
    thesis:
      'A diversified growth platform supported by AWS, advertising, logistics scale, and AI infrastructure demand.',
    bullCase:
      'AWS and advertising compound while retail margins continue to improve.',
    bearCase:
      'Heavy AI capex, valuation compression, or consumer weakness reduces free-cash-flow growth.',
    nextCheckpoint: 'Watch AWS growth and capex',
    sourceUrl: 'https://ir.aboutamazon.com/'
  },
  {
    symbol: 'EL',
    company: 'Estée Lauder',
    category: 'Turnaround',
    glyph: '✦',
    accent: '#7c3aed',
    stance: 'Speculative recovery',
    narrativeScore: 43,
    conviction: 49,
    risk: 72,
    thesis:
      'A brand-led turnaround dependent on travel retail, China demand, inventory discipline, and management execution.',
    bullCase:
      'Margins normalize and brand demand recovers faster than expected.',
    bearCase:
      'Weak China and travel-retail trends make the turnaround longer and more expensive.',
    nextCheckpoint: 'Watch guidance and margin recovery',
    sourceUrl: 'https://www.elcompanies.com/en/investors'
  },
  {
    symbol: 'QQQ',
    company: 'Invesco QQQ',
    category: 'Portfolio ballast',
    glyph: 'Q',
    accent: '#0891b2',
    stance: 'Diversification anchor',
    narrativeScore: 70,
    conviction: 72,
    risk: 40,
    thesis:
      'A liquid way to diversify away from single-stock risk while retaining exposure to large-cap technology and growth.',
    bullCase:
      'Mega-cap earnings and AI investment continue to support index growth.',
    bearCase:
      'Concentration, valuation, or higher rates create broad multiple compression.',
    nextCheckpoint: 'Use as the rebalance destination',
    sourceUrl: 'https://www.invesco.com/qqq-etf/en/home.html'
  }
]

const ALLOCATION_COLORS = [
  '#18181b',
  '#2563eb',
  '#0f766e',
  '#f59e0b',
  '#7c3aed',
  '#0891b2',
  '#e11d48',
  '#64748b'
]

function formatMoney (n: number) {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  })
}

function formatCompactMoney (n: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 1
  }).format(n)
}

function formatPct (n: number) {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

function loadInvestments (): Investment[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadMeta (): PortfolioMeta {
  if (typeof window === 'undefined') {
    return { cash: 0, realizedPnl: 0 }
  }

  try {
    const raw = localStorage.getItem(META_STORAGE_KEY)
    if (!raw) return { cash: 0, realizedPnl: 0 }

    const parsed = JSON.parse(raw)

    return {
      cash: Number(parsed.cash) || 0,
      realizedPnl: Number(parsed.realizedPnl) || 0
    }
  } catch {
    return { cash: 0, realizedPnl: 0 }
  }
}

function emptyForm () {
  return {
    symbol: '',
    shares: '',
    buyPrice: '',
    buyDate: new Date().toISOString().slice(0, 10),
    notes: '',
    currentPrice: ''
  }
}

function scoreTone (score: number) {
  if (score >= 70) return 'text-emerald-700'
  if (score >= 55) return 'text-amber-700'
  return 'text-rose-700'
}

function scoreLabel (score: number) {
  if (score >= 70) return 'Constructive'
  if (score >= 55) return 'Mixed-positive'
  if (score >= 45) return 'Neutral / mixed'
  return 'Cautious'
}

function tickerGlyph (symbol: string) {
  return (
    RESEARCH.find(item => item.symbol === symbol)?.glyph ?? symbol.slice(0, 1)
  )
}

function tickerAccent (symbol: string) {
  return RESEARCH.find(item => item.symbol === symbol)?.accent ?? '#52525b'
}

export default function InvestmentsPage () {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [meta, setMeta] = useState<PortfolioMeta>({
    cash: 0,
    realizedPnl: 0
  })
  const [hydrated, setHydrated] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [researchFilter, setResearchFilter] = useState('ALL')

  useEffect(() => {
    setInvestments(loadInvestments())
    setMeta(loadMeta())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investments))
  }, [investments, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta))
  }, [meta, hydrated])

  const totals = useMemo(() => {
    let cost = 0
    let value = 0

    for (const inv of investments) {
      const positionCost = inv.shares * inv.buyPrice
      cost += positionCost
      value += inv.shares * (inv.currentPrice ?? inv.buyPrice)
    }

    const pnl = value - cost
    const pnlPct = cost === 0 ? 0 : (pnl / cost) * 100
    const totalPortfolio = value + meta.cash

    return {
      cost,
      value,
      pnl,
      pnlPct,
      totalPortfolio
    }
  }, [investments, meta.cash])

  const positionAnalytics = useMemo(() => {
    return investments
      .map(inv => {
        const mark = inv.currentPrice ?? inv.buyPrice
        const cost = inv.shares * inv.buyPrice
        const value = inv.shares * mark
        const pnl = value - cost
        const pnlPct = cost === 0 ? 0 : (pnl / cost) * 100

        return {
          ...inv,
          mark,
          cost,
          value,
          pnl,
          pnlPct,
          allocationPct:
            totals.totalPortfolio === 0
              ? 0
              : (value / totals.totalPortfolio) * 100
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [investments, totals.totalPortfolio])

  const largestPosition = positionAnalytics[0]

  const allocationGradient = useMemo(() => {
    if (totals.totalPortfolio <= 0) {
      return 'conic-gradient(#e4e4e7 0deg 360deg)'
    }

    const segments: string[] = []
    let cursor = 0

    positionAnalytics.forEach((position, index) => {
      const start = cursor
      const end = cursor + position.allocationPct
      const color = ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]
      segments.push(`${color} ${start}% ${end}%`)
      cursor = end
    })

    if (meta.cash > 0) {
      const cashPct = (meta.cash / totals.totalPortfolio) * 100
      segments.push(`#d4d4d8 ${cursor}% ${cursor + cashPct}%`)
    }

    return `conic-gradient(${segments.join(', ')})`
  }, [positionAnalytics, meta.cash, totals.totalPortfolio])

  const filteredResearch =
    researchFilter === 'ALL'
      ? RESEARCH
      : RESEARCH.filter(item => item.symbol === researchFilter)

  function startEdit (inv: Investment) {
    setEditingId(inv.id)
    setForm({
      symbol: inv.symbol,
      shares: String(inv.shares),
      buyPrice: String(inv.buyPrice),
      buyDate: inv.buyDate,
      notes: inv.notes,
      currentPrice: inv.currentPrice != null ? String(inv.currentPrice) : ''
    })
  }

  function resetForm () {
    setEditingId(null)
    setForm(emptyForm())
  }

  function handleSubmit (e: FormEvent) {
    e.preventDefault()

    const symbol = form.symbol.trim().toUpperCase()
    const shares = Number(form.shares)
    const buyPrice = Number(form.buyPrice)
    const currentPrice =
      form.currentPrice.trim() === '' ? undefined : Number(form.currentPrice)

    if (!symbol || !(shares > 0) || !(buyPrice >= 0)) return
    if (currentPrice != null && !(currentPrice >= 0)) return

    const next: Investment = {
      id: editingId ?? crypto.randomUUID(),
      symbol,
      shares,
      buyPrice,
      buyDate: form.buyDate || new Date().toISOString().slice(0, 10),
      notes: form.notes.trim(),
      currentPrice
    }

    setInvestments(prev =>
      editingId
        ? prev.map(item => (item.id === editingId ? next : item))
        : [next, ...prev]
    )

    resetForm()
  }

  function handleDelete (id: string) {
    setInvestments(prev => prev.filter(item => item.id !== id))
    if (editingId === id) resetForm()
  }

  function applyMarketSnapshot () {
    setInvestments(prev =>
      prev.map(item => ({
        ...item,
        currentPrice: MARKET_SNAPSHOT[item.symbol] ?? item.currentPrice
      }))
    )
  }

  return (
    <main className='relative min-h-screen overflow-x-hidden bg-[#f2efe6] text-zinc-900'>
      <div className='pointer-events-none fixed inset-0 opacity-60'>
        <div className='absolute -left-20 top-12 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl' />
        <div className='absolute right-0 top-40 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl' />
        <div className='absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-100/50 blur-3xl' />
      </div>

      <div className='relative mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-16'>
        <header className='overflow-hidden rounded-[32px] border border-zinc-900/10 bg-zinc-950 text-white shadow-[0_30px_80px_rgba(24,24,27,0.2)]'>
          <div className='grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end'>
            <div>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-300'>
                  Private capital journal
                </span>
                <span className='rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100'>
                  Aggressive · thesis-driven
                </span>
              </div>

              <h1 className='mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl'>
                Portfolio cockpit
              </h1>

              <p className='mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg'>
                A private dashboard for position tracking, concentration risk,
                thesis review, and the names that keep showing up in my
                research: MSTR, UNH, NVO, AMZN, EL, and QQQ.
              </p>

              <div className='mt-6 flex flex-wrap gap-3'>
                <button
                  type='button'
                  onClick={applyMarketSnapshot}
                  className='rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200'
                >
                  Apply {SNAPSHOT_DATE} marks
                </button>

                <a
                  href='#research'
                  className='rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10'
                >
                  Open research board ↓
                </a>

                <Link
                  href='/'
                  className='rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10'
                >
                  ← Home
                </Link>
              </div>
            </div>

            <div className='rounded-3xl border border-white/10 bg-white/[0.06] p-5'>
              <p className='text-xs uppercase tracking-[0.2em] text-zinc-400'>
                Current playbook
              </p>

              <div className='mt-4 space-y-4 text-sm'>
                <div className='flex items-start gap-3'>
                  <span className='mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-300/15 text-amber-200'>
                    01
                  </span>
                  <p className='leading-6 text-zinc-300'>
                    Treat MSTR as the high-conviction BTC proxy, not as a normal
                    software stock.
                  </p>
                </div>

                <div className='flex items-start gap-3'>
                  <span className='mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-300/15 text-blue-200'>
                    02
                  </span>
                  <p className='leading-6 text-zinc-300'>
                    Keep UNH and NVO in a separate healthcare-recovery bucket.
                  </p>
                </div>

                <div className='flex items-start gap-3'>
                  <span className='mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan-300/15 text-cyan-200'>
                    03
                  </span>
                  <p className='leading-6 text-zinc-300'>
                    Use QQQ as the diversification destination when single-name
                    concentration gets too high.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className='mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
          {[
            {
              label: 'Portfolio value',
              value: formatMoney(totals.totalPortfolio),
              note: 'Positions + cash'
            },
            {
              label: 'Cost basis',
              value: formatMoney(totals.cost),
              note: 'Open positions'
            },
            {
              label: 'Unrealized P&L',
              value: `${formatMoney(totals.pnl)} · ${formatPct(totals.pnlPct)}`,
              note: 'Marked positions',
              tone:
                totals.pnl > 0
                  ? 'text-emerald-700'
                  : totals.pnl < 0
                  ? 'text-rose-700'
                  : 'text-zinc-900'
            },
            {
              label: 'Largest position',
              value: largestPosition
                ? `${
                    largestPosition.symbol
                  } · ${largestPosition.allocationPct.toFixed(1)}%`
                : '—',
              note: 'Concentration check'
            },
            {
              label: 'Realized P&L',
              value: formatMoney(meta.realizedPnl),
              note: 'Editable local record',
              tone:
                meta.realizedPnl > 0
                  ? 'text-emerald-700'
                  : meta.realizedPnl < 0
                  ? 'text-rose-700'
                  : 'text-zinc-900'
            }
          ].map(item => (
            <article
              key={item.label}
              className='rounded-3xl border border-zinc-900/10 bg-white/80 p-5 shadow-sm'
            >
              <p className='text-xs font-medium uppercase tracking-[0.14em] text-zinc-500'>
                {item.label}
              </p>
              <p
                className={`mt-3 text-xl font-semibold tracking-tight ${
                  item.tone ?? 'text-zinc-900'
                }`}
              >
                {hydrated ? item.value : '—'}
              </p>
              <p className='mt-1 text-xs text-zinc-500'>{item.note}</p>
            </article>
          ))}
        </section>

        <section className='mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]'>
          <article className='rounded-[30px] border border-zinc-900/10 bg-white/80 p-6 shadow-sm sm:p-7'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs font-medium uppercase tracking-[0.16em] text-zinc-500'>
                  Allocation
                </p>
                <h2 className='mt-2 text-2xl font-semibold tracking-tight'>
                  Concentration map
                </h2>
              </div>

              <span className='rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600'>
                {investments.length} positions
              </span>
            </div>

            <div className='mt-7 grid items-center gap-7 sm:grid-cols-[180px_1fr]'>
              <div
                className='relative mx-auto h-44 w-44 rounded-full'
                style={{ background: allocationGradient }}
              >
                <div className='absolute inset-[25%] grid place-items-center rounded-full bg-[#faf9f5] text-center shadow-inner'>
                  <div>
                    <p className='text-xs text-zinc-500'>Total</p>
                    <p className='mt-1 text-lg font-semibold'>
                      {formatCompactMoney(totals.totalPortfolio)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                {positionAnalytics.slice(0, 6).map((position, index) => (
                  <div
                    key={position.id}
                    className='flex items-center justify-between gap-3 text-sm'
                  >
                    <div className='flex min-w-0 items-center gap-2'>
                      <span
                        className='h-2.5 w-2.5 shrink-0 rounded-full'
                        style={{
                          backgroundColor:
                            ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]
                        }}
                      />
                      <span className='font-medium'>{position.symbol}</span>
                      <span className='truncate text-zinc-500'>
                        {formatCompactMoney(position.value)}
                      </span>
                    </div>
                    <span className='font-medium text-zinc-700'>
                      {position.allocationPct.toFixed(1)}%
                    </span>
                  </div>
                ))}

                {meta.cash > 0 && (
                  <div className='flex items-center justify-between gap-3 text-sm'>
                    <div className='flex items-center gap-2'>
                      <span className='h-2.5 w-2.5 rounded-full bg-zinc-300' />
                      <span className='font-medium'>Cash</span>
                    </div>
                    <span className='font-medium text-zinc-700'>
                      {totals.totalPortfolio === 0
                        ? '0.0%'
                        : `${(
                            (meta.cash / totals.totalPortfolio) *
                            100
                          ).toFixed(1)}%`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </article>

          <article className='rounded-[30px] border border-zinc-900/10 bg-white/80 p-6 shadow-sm sm:p-7'>
            <div className='flex flex-wrap items-end justify-between gap-3'>
              <div>
                <p className='text-xs font-medium uppercase tracking-[0.16em] text-zinc-500'>
                  Position performance
                </p>
                <h2 className='mt-2 text-2xl font-semibold tracking-tight'>
                  Open P&L by ticker
                </h2>
              </div>

              <p className='text-xs text-zinc-500'>
                Manual marks · local browser data
              </p>
            </div>

            <div className='mt-7 space-y-5'>
              {positionAnalytics.length === 0 ? (
                <div className='rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500'>
                  Add positions below to generate the chart.
                </div>
              ) : (
                positionAnalytics.slice(0, 8).map(position => {
                  const magnitude = Math.min(Math.abs(position.pnlPct), 100)

                  return (
                    <div key={position.id}>
                      <div className='flex items-end justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                          <span
                            className='grid h-9 w-9 place-items-center rounded-xl text-sm font-semibold text-white'
                            style={{
                              backgroundColor: tickerAccent(position.symbol)
                            }}
                          >
                            {tickerGlyph(position.symbol)}
                          </span>

                          <div>
                            <p className='font-semibold'>{position.symbol}</p>
                            <p className='text-xs text-zinc-500'>
                              {position.shares} shares ·{' '}
                              {formatMoney(position.mark)}
                            </p>
                          </div>
                        </div>

                        <div className='text-right'>
                          <p
                            className={`font-semibold ${
                              position.pnl > 0
                                ? 'text-emerald-700'
                                : position.pnl < 0
                                ? 'text-rose-700'
                                : 'text-zinc-700'
                            }`}
                          >
                            {formatPct(position.pnlPct)}
                          </p>
                          <p className='text-xs text-zinc-500'>
                            {formatMoney(position.pnl)}
                          </p>
                        </div>
                      </div>

                      <div className='mt-3 h-2 overflow-hidden rounded-full bg-zinc-100'>
                        <div
                          className={`h-full rounded-full ${
                            position.pnl >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.max(magnitude, 2)}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </article>
        </section>

        <section
          id='research'
          className='mt-10 rounded-[34px] border border-zinc-900/10 bg-white/75 p-6 shadow-sm sm:p-8'
        >
          <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.16em] text-zinc-500'>
                Research pulse
              </p>
              <h2 className='mt-2 text-3xl font-semibold tracking-tight'>
                Thesis, sentiment, and risk
              </h2>
              <p className='mt-3 max-w-3xl text-sm leading-6 text-zinc-600'>
                Narrative scores are a qualitative research view, not analyst
                consensus. The goal is to separate market reputation from
                personal conviction and downside risk.
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              {['ALL', ...RESEARCH.map(item => item.symbol)].map(symbol => (
                <button
                  key={symbol}
                  type='button'
                  onClick={() => setResearchFilter(symbol)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    researchFilter === symbol
                      ? 'bg-zinc-900 text-white'
                      : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-7 grid gap-5 lg:grid-cols-2'>
            {filteredResearch.map(item => (
              <article
                key={item.symbol}
                className='group rounded-[28px] border border-zinc-200 bg-[#fbfaf6] p-6 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg'
              >
                <div className='flex items-start justify-between gap-5'>
                  <div className='flex items-center gap-3'>
                    <span
                      className='grid h-12 w-12 place-items-center rounded-2xl text-xl font-semibold text-white shadow-sm'
                      style={{ backgroundColor: item.accent }}
                    >
                      {item.glyph}
                    </span>

                    <div>
                      <div className='flex flex-wrap items-baseline gap-x-2'>
                        <h3 className='text-xl font-semibold'>{item.symbol}</h3>
                        <span className='text-sm text-zinc-500'>
                          {item.company}
                        </span>
                      </div>
                      <p className='mt-1 text-xs uppercase tracking-[0.12em] text-zinc-500'>
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <div className='text-right'>
                    <p
                      className={`text-sm font-semibold ${scoreTone(
                        item.narrativeScore
                      )}`}
                    >
                      {scoreLabel(item.narrativeScore)}
                    </p>
                    <p className='mt-1 text-xs text-zinc-500'>
                      Narrative {item.narrativeScore}/100
                    </p>
                  </div>
                </div>

                <p className='mt-5 rounded-2xl bg-white p-4 text-sm font-medium leading-6 text-zinc-800'>
                  {item.stance}
                </p>

                <p className='mt-4 text-sm leading-6 text-zinc-600'>
                  {item.thesis}
                </p>

                <div className='mt-5 grid gap-4 sm:grid-cols-3'>
                  {[
                    {
                      label: 'Narrative',
                      value: item.narrativeScore,
                      color: item.accent
                    },
                    {
                      label: 'Conviction',
                      value: item.conviction,
                      color: '#18181b'
                    },
                    {
                      label: 'Risk',
                      value: item.risk,
                      color: '#e11d48'
                    }
                  ].map(metric => (
                    <div key={metric.label}>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-zinc-500'>{metric.label}</span>
                        <span className='font-semibold'>{metric.value}</span>
                      </div>
                      <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200'>
                        <div
                          className='h-full rounded-full'
                          style={{
                            width: `${metric.value}%`,
                            backgroundColor: metric.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                  <div className='rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4'>
                    <p className='text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700'>
                      Bull case
                    </p>
                    <p className='mt-2 text-sm leading-5 text-emerald-950/80'>
                      {item.bullCase}
                    </p>
                  </div>

                  <div className='rounded-2xl border border-rose-100 bg-rose-50/70 p-4'>
                    <p className='text-xs font-semibold uppercase tracking-[0.12em] text-rose-700'>
                      Bear case
                    </p>
                    <p className='mt-2 text-sm leading-5 text-rose-950/80'>
                      {item.bearCase}
                    </p>
                  </div>
                </div>

                <div className='mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4'>
                  <p className='text-xs font-medium text-zinc-600'>
                    Next checkpoint: {item.nextCheckpoint}
                  </p>

                  <a
                    href={item.sourceUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='text-xs font-semibold text-zinc-900 hover:underline'
                  >
                    Company research ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className='mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
          <article className='rounded-[30px] border border-zinc-900/10 bg-zinc-950 p-6 text-white shadow-sm sm:p-8'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.16em] text-zinc-400'>
                Conviction map
              </p>
              <h2 className='mt-2 text-2xl font-semibold tracking-tight'>
                Higher conviction is not lower risk
              </h2>
            </div>

            <div className='relative mt-7 h-[330px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]'>
              <div className='absolute inset-x-6 top-1/2 border-t border-dashed border-white/10' />
              <div className='absolute inset-y-6 left-1/2 border-l border-dashed border-white/10' />

              <span className='absolute left-4 top-4 text-[10px] uppercase tracking-[0.14em] text-zinc-500'>
                High conviction
              </span>
              <span className='absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.14em] text-zinc-500'>
                Lower conviction
              </span>
              <span className='absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.14em] text-zinc-500'>
                Higher risk →
              </span>

              {RESEARCH.map(item => (
                <div
                  key={item.symbol}
                  className='absolute -translate-x-1/2 translate-y-1/2'
                  style={{
                    left: `${item.risk}%`,
                    bottom: `${item.conviction}%`
                  }}
                >
                  <div
                    className='grid h-11 w-11 place-items-center rounded-2xl border-2 border-zinc-950 text-sm font-bold text-white shadow-xl'
                    style={{ backgroundColor: item.accent }}
                    title={`${item.symbol}: conviction ${item.conviction}, risk ${item.risk}`}
                  >
                    {item.symbol}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className='rounded-[30px] border border-zinc-900/10 bg-white/80 p-6 shadow-sm sm:p-8'>
            <p className='text-xs font-medium uppercase tracking-[0.16em] text-zinc-500'>
              Private ledger settings
            </p>
            <h2 className='mt-2 text-2xl font-semibold tracking-tight'>
              Cash and realized gains
            </h2>

            <p className='mt-3 text-sm leading-6 text-zinc-600'>
              These values stay only in this browser. They are not sent to a
              server and are not hard-coded into the public page.
            </p>

            <div className='mt-6 space-y-4'>
              <label className='block'>
                <span className='text-sm font-medium text-zinc-700'>
                  Cash available
                </span>
                <div className='mt-2 flex items-center rounded-2xl border border-zinc-300 bg-white px-4'>
                  <span className='text-zinc-400'>$</span>
                  <input
                    type='number'
                    min='0'
                    step='any'
                    value={meta.cash}
                    onChange={e =>
                      setMeta(current => ({
                        ...current,
                        cash: Number(e.target.value) || 0
                      }))
                    }
                    className='w-full bg-transparent px-2 py-3 outline-none'
                  />
                </div>
              </label>

              <label className='block'>
                <span className='text-sm font-medium text-zinc-700'>
                  Realized P&L
                </span>
                <div className='mt-2 flex items-center rounded-2xl border border-zinc-300 bg-white px-4'>
                  <span className='text-zinc-400'>$</span>
                  <input
                    type='number'
                    step='any'
                    value={meta.realizedPnl}
                    onChange={e =>
                      setMeta(current => ({
                        ...current,
                        realizedPnl: Number(e.target.value) || 0
                      }))
                    }
                    className='w-full bg-transparent px-2 py-3 outline-none'
                  />
                </div>
              </label>
            </div>

            <div className='mt-6 rounded-2xl bg-zinc-100 p-4 text-xs leading-5 text-zinc-600'>
              Snapshot prices are included only as a dated convenience. Update
              marks manually after the snapshot date.
            </div>
          </article>
        </section>

        <section className='mt-10 rounded-[34px] border border-zinc-900/10 bg-white/80 p-6 shadow-sm sm:p-8'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.16em] text-zinc-500'>
                Position editor
              </p>
              <h2 className='mt-2 text-2xl font-semibold tracking-tight'>
                {editingId ? 'Edit position' : 'Add a position'}
              </h2>
            </div>

            {editingId && (
              <button
                type='button'
                onClick={resetForm}
                className='rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50'
              >
                Cancel edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className='mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'
          >
            <label className='space-y-1.5 text-sm'>
              <span className='font-medium text-zinc-700'>Symbol</span>
              <input
                required
                value={form.symbol}
                onChange={e =>
                  setForm(current => ({
                    ...current,
                    symbol: e.target.value.toUpperCase()
                  }))
                }
                placeholder='MSTR'
                className='w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-600'
              />
            </label>

            <label className='space-y-1.5 text-sm'>
              <span className='font-medium text-zinc-700'>Shares</span>
              <input
                required
                type='number'
                min='0'
                step='any'
                value={form.shares}
                onChange={e =>
                  setForm(current => ({
                    ...current,
                    shares: e.target.value
                  }))
                }
                placeholder='100'
                className='w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-600'
              />
            </label>

            <label className='space-y-1.5 text-sm'>
              <span className='font-medium text-zinc-700'>Average cost</span>
              <input
                required
                type='number'
                min='0'
                step='any'
                value={form.buyPrice}
                onChange={e =>
                  setForm(current => ({
                    ...current,
                    buyPrice: e.target.value
                  }))
                }
                placeholder='145.00'
                className='w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-600'
              />
            </label>

            <label className='space-y-1.5 text-sm'>
              <span className='font-medium text-zinc-700'>Current mark</span>
              <input
                type='number'
                min='0'
                step='any'
                value={form.currentPrice}
                onChange={e =>
                  setForm(current => ({
                    ...current,
                    currentPrice: e.target.value
                  }))
                }
                placeholder='97.47'
                className='w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-600'
              />
            </label>

            <label className='space-y-1.5 text-sm'>
              <span className='font-medium text-zinc-700'>Buy date</span>
              <input
                type='date'
                value={form.buyDate}
                onChange={e =>
                  setForm(current => ({
                    ...current,
                    buyDate: e.target.value
                  }))
                }
                className='w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-600'
              />
            </label>

            <label className='space-y-1.5 text-sm sm:col-span-2 lg:col-span-3'>
              <span className='font-medium text-zinc-700'>Thesis / notes</span>
              <input
                value={form.notes}
                onChange={e =>
                  setForm(current => ({
                    ...current,
                    notes: e.target.value
                  }))
                }
                placeholder='Why I own it, invalidation level, or next action'
                className='w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-600'
              />
            </label>

            <div className='flex items-end'>
              <button
                type='submit'
                className='w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700'
              >
                {editingId ? 'Save changes' : 'Add record'}
              </button>
            </div>
          </form>
        </section>

        <section className='mt-10'>
          <div className='flex flex-wrap items-end justify-between gap-4'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.16em] text-zinc-500'>
                Open positions
              </p>
              <h2 className='mt-2 text-2xl font-semibold tracking-tight'>
                Position ledger
              </h2>
            </div>

            <p className='text-xs text-zinc-500'>
              Stored locally with localStorage
            </p>
          </div>

          {!hydrated ? (
            <p className='mt-4 text-sm text-zinc-600'>Loading…</p>
          ) : investments.length === 0 ? (
            <p className='mt-5 rounded-3xl border border-dashed border-zinc-300 bg-white/50 px-6 py-10 text-sm text-zinc-600'>
              No positions yet. Add MSTR, UNH, NVO, or another holding above.
            </p>
          ) : (
            <div className='mt-5 grid gap-4 lg:grid-cols-2'>
              {positionAnalytics.map(inv => (
                <article
                  key={inv.id}
                  className='rounded-[28px] border border-zinc-900/10 bg-white/85 p-6 shadow-sm'
                >
                  <div className='flex items-start justify-between gap-5'>
                    <div className='flex items-center gap-3'>
                      <span
                        className='grid h-12 w-12 place-items-center rounded-2xl text-lg font-semibold text-white'
                        style={{ backgroundColor: tickerAccent(inv.symbol) }}
                      >
                        {tickerGlyph(inv.symbol)}
                      </span>

                      <div>
                        <div className='flex flex-wrap items-baseline gap-2'>
                          <h3 className='text-xl font-semibold tracking-tight'>
                            {inv.symbol}
                          </h3>
                          <span className='text-xs text-zinc-500'>
                            {inv.shares} shares
                          </span>
                        </div>
                        <p className='mt-1 text-xs text-zinc-500'>
                          Bought {inv.buyDate}
                        </p>
                      </div>
                    </div>

                    <div className='text-right'>
                      <p className='text-lg font-semibold'>
                        {formatMoney(inv.value)}
                      </p>
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          inv.pnl > 0
                            ? 'text-emerald-700'
                            : inv.pnl < 0
                            ? 'text-rose-700'
                            : 'text-zinc-600'
                        }`}
                      >
                        {formatMoney(inv.pnl)} · {formatPct(inv.pnlPct)}
                      </p>
                    </div>
                  </div>

                  <div className='mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-zinc-50 p-4 text-sm'>
                    <div>
                      <p className='text-xs text-zinc-500'>Average</p>
                      <p className='mt-1 font-semibold'>
                        {formatMoney(inv.buyPrice)}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-zinc-500'>Mark</p>
                      <p className='mt-1 font-semibold'>
                        {formatMoney(inv.mark)}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-zinc-500'>Allocation</p>
                      <p className='mt-1 font-semibold'>
                        {inv.allocationPct.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {inv.notes && (
                    <p className='mt-4 text-sm leading-6 text-zinc-600'>
                      {inv.notes}
                    </p>
                  )}

                  <div className='mt-5 flex gap-2 border-t border-zinc-200 pt-4'>
                    <button
                      type='button'
                      onClick={() => startEdit(inv)}
                      className='rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold hover:bg-zinc-50'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDelete(inv.id)}
                      className='rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50'
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className='mt-16 flex flex-col gap-3 border-t border-zinc-900/10 pt-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between'>
          <p>
            © {new Date().getFullYear()} Millor Lei · Private investment
            journal.
          </p>
          <p>Research dashboard only · not investment advice.</p>
        </footer>
      </div>
    </main>
  )
}
