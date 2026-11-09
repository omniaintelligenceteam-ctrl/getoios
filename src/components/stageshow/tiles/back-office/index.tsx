import { Check, Mic } from 'lucide-react'
import { Badge, Button, Count, Field, Roll, Stage, Window, type Act } from '../../kit'
import { OIOS_TOKENS, useFontsReady } from '../shared/look'
import '../shared/tile.css'
import './back-office.css'

// Pillar two, the back office, playing its After: "He drafts the quote from
// your prices, names what he could not price, and the invoice follows your
// approval." Beats: an estimate drafted from the clinic's prices, one line
// flagged as not on the price list; the owner types its price, the flag
// settles and the total rolls; Approve estimate turns to Approved on itself
// and the estimate's own pill rolls to the invoice it became. After the hold
// the next estimate comes in over it (the body crossfades, the chrome stays).

type Phase = 'rest' | 'out' | 'in'
type S = { focused: boolean; typed: string; priced: boolean; approved: boolean; invoice: boolean; phase: Phase }

const initial: S = { focused: false, typed: '', priced: false, approved: false, invoice: false, phase: 'rest' }
const poster: S = { focused: false, typed: '280', priced: true, approved: true, invoice: true, phase: 'rest' }

const REST = { wide: { x: 380, y: 152 }, compact: { x: 200, y: 166 } }

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('price')
  await a.click({ at: 'price', x: 0.75, y: 0.5 })
  a.put({ focused: true })
  await a.wait(250)
  await a.type('typed', '280', { interval: 110 })
  await a.wait(350)
  a.put({ focused: false, priced: true })
  await a.wait(1200)
  a.mark('approve')
  await a.click({ at: 'approve', x: 0.82, y: 0.6 })
  a.put({ approved: true })
  await a.move({ at: 'approve', x: 0.5, y: 2.6 })
  await a.wait(300)
  a.mark('done')
  a.put({ invoice: true })
  await a.wait(2600)
  // The next estimate comes in over this one: the body leaves, the chrome stays
  a.put({ phase: 'out' })
  await a.wait(230)
  await a.snap({ focused: false, typed: '', priced: false, approved: false, invoice: false, phase: 'in' })
  a.put({ phase: 'rest' })
  await a.move(a.layout === 'compact' ? REST.compact : REST.wide)
  await a.wait(300)
}

export default function BackOfficeTile() {
  const fonts = useFontsReady()
  return (
    <Stage<S>
      key={fonts ? 'fonts' : 'fallback'}
      width={560}
      height={340}
      compact={{ below: 560, width: 358, height: 344 }}
      theme="dark"
      accent="#f59e0b"
      tokens={OIOS_TOKENS}
      initial={initial}
      poster={poster}
      script={script}
      cursor={{ at: REST }}
      className="oios-tile ob"
    >
      {(s) => (
        <Window className="oios-win" title="Estimates" toolbar={<Mic className="oios-mic" size={16} strokeWidth={2} aria-hidden />}>
          <div className="oios-body">
            <div className="ob-page" data-phase={s.phase}>
              <header className="ob-head">
                <div className="ob-title">Dana Reyes</div>
                <Badge tone={s.invoice ? 'success' : 'neutral'} className="ob-kind">
                  <Roll variant="fade">{s.invoice ? 'Invoice 2042' : 'Estimate'}</Roll>
                </Badge>
              </header>
              <div className="ob-lines">
                <Line name="Exam and X-rays" price="$210" />
                <Line name="Cleaning" price="$140" />
                <div className="ob-line">
                  <span className="ob-lines__name">
                    <span className="ob-name">Whitening trays</span>
                    <span className="ob-flag" data-priced={s.priced || undefined}>
                      <Roll variant="fade">{s.priced ? 'Priced by you' : 'Not on your price list'}</Roll>
                    </span>
                  </span>
                  <Field
                    className="ob-field"
                    value={s.typed}
                    placeholder="Price"
                    focused={s.focused}
                    leading={<span className="ob-dollar">$</span>}
                    box={{ 'data-target': 'price', 'data-cursor': 'ibeam' }}
                  />
                </div>
                <div className="ob-total">
                  <span>Total</span>
                  <span className="ob-sum">$<Count value={s.priced ? 630 : 350} /></span>
                </div>
              </div>
              <div className="ob-actions">
                <Button
                  variant="primary"
                  data-done={s.approved || undefined}
                  data-target="approve"
                  icon={s.approved ? <Check size={14} strokeWidth={2.4} /> : undefined}
                >
                  {s.approved ? 'Approved' : 'Approve estimate'}
                </Button>
              </div>
            </div>
          </div>
        </Window>
      )}
    </Stage>
  )
}

function Line({ name, price }: { name: string; price: string }) {
  return (
    <div className="ob-line">
      <span className="ob-name">{name}</span>
      <span className="ob-price">{price}</span>
    </div>
  )
}
