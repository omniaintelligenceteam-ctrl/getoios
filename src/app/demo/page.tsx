import { redirect } from 'next/navigation'

// Live voice demo is offline — route visitors to the audit form until it's back.
export default function DemoPage() {
  redirect('/form')
}
