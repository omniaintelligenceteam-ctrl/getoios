import { Check, Mic } from 'lucide-react'
import { Avatar, Badge, Bar, Button, Collapse, Count, Roll, Stage, Window, type Act } from '../../kit'
import { OIOS_TOKENS, useFontsReady } from '../shared/look'
import '../shared/tile.css'
import './workflows.css'

// Pillar three, workflows, playing its After: "The closing sweep ends it, and
// quiet quotes get chased on the schedule you set. You tap send." Beats: the
// closing sweep holds two follow-ups he drafted, a quiet quote and an overdue
// invoice; the owner presses Send both, which reads Sending on itself; each
// row's pill rolls to Sent in turn and the count rolls to 0; the button
// settles on Sent. After the hold the two sent rows leave the sweep and
// tomorrow night's follow-ups arrive as new, the button and count with them.

type S = { here: boolean; sending: boolean; sent: number; done: boolean; count: number }

const initial: S = { here: true, sending: false, sent: 0, done: false, count: 2 }
const poster: S = { here: true, sending: false, sent: 2, done: true, count: 0 }

const REST = { wide: { x: 300, y: 300 }, compact: { x: 180, y: 320 } }

const ROWS = [
  { name: 'Birch & Co.', what: 'Quote 54, quiet for 6 days' },
  { name: 'Lena Park', what: 'Invoice 1187, 12 days overdue' },
]

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('send')
  await a.click({ at: 'send', x: 0.8, y: 0.62 })
  a.put({ sending: true })
  await a.move({ at: 'send', x: -0.7, y: 0.6 })
  await a.wait(250)
  a.put({ sent: 1, count: 1 })
  await a.wait(160)
  a.put({ sent: 2, count: 0 })
  await a.wait(300)
  a.mark('done')
  a.put({ sending: false, done: true })
  await a.wait(2600)
  // The sent follow-ups leave the sweep together, and the next night's arrive as new
  a.put({ here: false })
  await a.wait(800)
  // Rows are closed: their pills go back unseen. The button and the count
  // follow the new drafts in, on their own transitions
  await a.snap({ sent: 0 })
  a.put({ here: true, done: false, count: 2 })
  await a.move(a.layout === 'compact' ? REST.compact : REST.wide)
  await a.wait(700)
}

export default function WorkflowsTile() {
  const fonts = useFontsReady()
  return (
    <Stage<S>
      key={fonts ? 'fonts' : 'fallback'}
      width={560}
      height={340}
      compact={{ below: 560, width: 358, height: 340 }}
      theme="dark"
      accent="#06b6d4"
      tokens={OIOS_TOKENS}
      initial={initial}
      poster={poster}
      script={script}
      cursor={{ at: REST }}
      className="oios-tile ow"
    >
      {(s) => (
        <Window className="oios-win" title="Closing sweep, 9:00 pm" toolbar={<Mic className="oios-mic" size={16} strokeWidth={2} aria-hidden />}>
          <div className="oios-body">
            <header className="ow-head">
              <div className="ow-title">Follow-ups drafted</div>
              <Badge tone="neutral" className="ow-count">
                <Count value={s.count} />
              </Badge>
              <Button
                variant="primary"
                className="ow-send"
                data-done={s.done || undefined}
                data-target="send"
                icon={s.done ? <Check size={14} strokeWidth={2.4} /> : undefined}
              >
                {s.done ? 'Sent' : s.sending ? 'Sending' : 'Send both'}
              </Button>
            </header>
            <div className="ow-list">
              {ROWS.map((r, i) => (
                <Collapse key={r.name} open={s.here} reveal="drop">
                  <div className="ow-row">
                    <Avatar name={r.name} size={28} />
                    <span className="ow-lines">
                      <span className="ow-name">{r.name}</span>
                      <span className="ow-sub">{r.what}</span>
                    </span>
                    <Badge tone={s.sent > i ? 'success' : 'warning'} dot className="ow-pill">
                      <Roll variant="fade">{s.sent > i ? 'Sent' : 'Drafted'}</Roll>
                    </Badge>
                  </div>
                </Collapse>
              ))}
              <div className="ow-row ow-row--quiet">
                <Avatar size={28} />
                <span className="ow-lines">
                  <span className="ow-name">Tomorrow’s brief</span>
                  <span className="ow-subline"><Bar w={118} h={7} r={3.5} tone={1} /></span>
                </span>
                <Bar w={52} h={18} r={9} tone={1} />
              </div>
              <div className="ow-row ow-row--quiet" aria-hidden>
                <Avatar size={28} />
                <span className="ow-lines">
                  <span className="ow-nameline"><Bar w={110} h={8} r={4} tone={2} /></span>
                  <span className="ow-subline"><Bar w={150} h={7} r={3.5} tone={1} /></span>
                </span>
                <Bar w={46} h={18} r={9} tone={1} />
              </div>
            </div>
          </div>
        </Window>
      )}
    </Stage>
  )
}
