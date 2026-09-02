'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '../../../components/Nav';
import Require from '../../../components/Require';
import { api, trackInteraction } from '../../../lib/api';

function Page({ params }) {
  const [e, setE] = useState(null);
  const [r, setR] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!params?.id) return;
    api('/events/' + params.id)
      .then(res => {
        setE(res);
        setIsSaved(Boolean(res?.is_saved));
        trackInteraction(params.id, 'VIEW');
      })
      .catch(err => console.error(err));

    api('/events/' + params.id + '/recommendation')
      .then(setR)
      .catch(() => {});
  }, [params?.id]);

  if (!e) return <div className="p-10 text-center muted">Loading event details...</div>;

  const action = async type => {
    try {
      const res = await api(`/events/${e.id}/${type}`, { method: 'POST' });
      if (type === 'register') {
        setMsg('Successfully registered for this event!');
        trackInteraction(e.id, 'REGISTER');
      } else {
        const nextState = res.saved !== undefined ? res.saved : !isSaved;
        setIsSaved(nextState);
        setMsg(nextState ? 'Event saved to your bookmarks!' : 'Event removed from saved.');
        trackInteraction(e.id, 'SAVE');
      }
    } catch (err) {
      setMsg(err.message || 'Action failed');
    }
  };

  const titleText = e.event_name || e.title || 'Event Details';
  const feeText = e.is_free ? 'Free' : `₹${e.registration_fee_inr || e.registration_fee || '—'}`;

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto p-5 md:p-10">
        <Link href="/events" className="text-brand font-bold">
          ← Back to Events
        </Link>
        <div className="card overflow-hidden mt-5">
          <div className="h-64 bg-gradient-to-br from-indigo-950 via-brand to-purple-400 p-8 text-white flex items-end">
            <div className="text-7xl font-black opacity-90">AI</div>
          </div>
          <div className="p-7">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <span className="pill">{e.event_type || 'Event'}</span>
                <h1 className="text-4xl font-black mt-3">{titleText}</h1>
                <p className="muted mt-2">{e.description}</p>
              </div>
              {r && (r.match_score || r.matchScore) && (
                <div className="text-green-600 text-4xl font-black">
                  {r.match_score || r.matchScore}%
                  <div className="text-xs text-right text-green-700 font-bold">MATCH</div>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mt-8">
              {[
                ['📍', 'Location', e.location || 'Online'],
                ['📅', 'Date', `${e.start_date}${e.end_date && e.end_date !== e.start_date ? ' – ' + e.end_date : ''}`],
                ['💰', 'Fee', feeText],
                ['👥', 'Audience', (e.target_audience || []).join(', ') || 'College students'],
                ['🧠', 'Skills', (e.required_skills || []).join(', ') || 'General'],
                ['📊', 'Difficulty', e.difficulty || 'Intermediate']
              ].map(x => (
                <div key={x[1]}>
                  <div className="text-sm muted">
                    {x[0]} {x[1]}
                  </div>
                  <div className="font-bold mt-1 text-slate-900">{x[2]}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={() => action('register')} className="btn btn-primary">
                Register Now
              </button>
              <button onClick={() => action('save')} className="btn btn-secondary">
                {isSaved ? '♥ Saved' : '♡ Save Event'}
              </button>
              {r && (
                <>
                  <Link className="btn btn-secondary" href={`/events/${e.id}/why`}>
                    Why Recommended?
                  </Link>
                  <Link className="btn btn-secondary" href={`/events/${e.id}/skill-gap`}>
                    Skill Gap Analysis
                  </Link>
                </>
              )}
            </div>
            {msg && <p className="mt-4 text-green-700 font-bold text-sm">{msg}</p>}
          </div>
        </div>
      </main>
    </>
  );
}

export default function EventDetailRoot(props) {
  return (
    <Require>
      <Page {...props} />
    </Require>
  );
}
