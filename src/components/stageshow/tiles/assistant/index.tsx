import { Check, Mic } from 'lucide-react'
import { Badge, Bar, Button, Collapse, Count, Roll, Stage, Window, type Act } from '../../kit'
import { OIOS_TOKENS, useFontsReady } from '../shared/look'
import '../shared/tile.css'
import './assistant.css'

// Pillar one, the assistant, playing its After: "He names the three things,
// drafts the one that needs a reply, and keeps the rest on the board."
// Beats: the owner opens Sam's row and the drafted reply is there in full;
// the cursor presses Approve and send, which turns to Sent on itself; the
// row's pill rolls from Your tap to Sent and the count from 3 to 2. After the
// hold the done item leaves the list in one motion (it no longer needs him)
// and the next loop's request arrives at the top as new.

type S = { here: boolean; open: boolean; sent: boolean; done: boolean; count: number }

const initial: S = { here: true, open: false, sent: false, done: false, count: 3 }
const poster: S = { here: true, open: true, sent: true, done: true, count: 2 }

const DRAFT = 'Yes, Saturday works for 40 guests. I will send the final menu and the invoice by Thursday.'
const REST = { wide: { x: 470, y: 300 }, compact: { x: 300, y: 310 } }

async function script(a: Act<S>) {
  await a.wait(800)
  a.mark('open')
  await a.click({ at: 'sam', x: 0.6, y: 0.5 })
  a.put({ open: true })
  await a.wait(2200)
  a.mark('approve')
  await a.click({ at: 'approve', x: 0.8, y: 0.62 })
  a.put({ sent: true })
  await a.move({ at: 'approve', x: 0.7, y: 2.4 })
  await a.wait(400)
  a.mark('done')
  a.put({ done: true, count: 2 })
  await a.wait(2400)
  // The sent request leaves the list, draft and all: it no longer needs the owner
  a.put({ here: false })
  await a.wait(900)
  await a.snap({ open: false, sent: false, done: false })
  // The next request arrives at the top as new, and the count follows it
  a.put({ here: true })
  await a.wait(250)
  a.put({ count: 3 })
  await a.move(a.layout === 'compact' ? REST.compact : REST.wide)
  await a.wait(400)
}

export default function AssistantTile() {
  const fonts = useFontsReady()
  return (
    <Stage<S>
      key={fonts ? 'fonts' : 'fallback'}
      width={560}
      height={340}
      compact={{ below: 560, width: 358, height: 346 }}
      theme="dark"
      accent="#2dd4bf"
      tokens={OIOS_TOKENS}
      initial={initial}
      poster={poster}
      script={script}
      cursor={{ at: REST }}
      className="oios-tile oa"
    >
      {(s) => (
        <Window className="oios-win" title="Today" toolbar={<Mic className="oios-mic" size={16} strokeWidth={2} aria-hidden />}>
          <div className="oios-body">
            <header className="oa-head">
              <div className="oa-title">Needs you before nine</div>
              <Badge tone="neutral" className="oa-count">
                <Count value={s.count} />
              </Badge>
            </header>
            <div className="oa-list">
              <Collapse open={s.here} reveal="drop">
                <div className="oa-item">
                  <div className="oa-row" data-target="sam" data-cursor="pointer">
                    <span className="oa-time">8:30</span>
                    <span className="oa-lines">
                      <span className="oa-name">Sam Ortiz</span>
                      <span className="oa-sub">Saturday catering for 40</span>
                    </span>
                    <Badge tone={s.done ? 'success' : 'warning'} dot className="oa-pill">
                      <Roll variant="fade">{s.done ? 'Sent' : 'Your tap'}</Roll>
                    </Badge>
                  </div>
                  <Collapse open={s.open}>
                    <div className="oa-draft">
                      <p className="oa-text">{DRAFT}</p>
                      <div className="oa-actions">
                        <Button variant="ghost">Edit</Button>
                        <Button
                          variant="primary"
                          data-done={s.sent || undefined}
                          data-target="approve"
                          icon={s.sent ? <Check size={14} strokeWidth={2.4} /> : undefined}
                        >
                          {s.sent ? 'Sent' : 'Approve and send'}
                        </Button>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </Collapse>
              <Quiet time="9:00" name="Delgado tasting" w={[132, 54]} />
              <Quiet time="11:00" name="Ridge Farms delivery" w={[150, 46]} />
              <div className="oa-row oa-row--quiet" aria-hidden>
                <span className="oa-time"><Bar w={30} h={7} r={3.5} tone={1} /></span>
                <span className="oa-lines">
                  <span className="oa-nameline"><Bar w={120} h={8} r={4} tone={2} /></span>
                  <span className="oa-subline"><Bar w={90} h={7} r={3.5} tone={1} /></span>
                </span>
                <Bar w={50} h={18} r={9} tone={1} />
              </div>
            </div>
          </div>
        </Window>
      )}
    </Stage>
  )
}

// A row that doesn't need the owner yet: its title is real, its detail and
// status are quiet lines, so the amber row leads
function Quiet({ time, name, w }: { time: string; name: string; w: [number, number] }) {
  return (
    <div className="oa-row oa-row--quiet">
      <span className="oa-time">{time}</span>
      <span className="oa-lines">
        <span className="oa-name">{name}</span>
        <span className="oa-subline"><Bar w={w[0]} h={7} r={3.5} tone={1} /></span>
      </span>
      <Bar w={w[1]} h={18} r={9} tone={1} />
    </div>
  )
}
