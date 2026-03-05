'use client';
import { useState } from 'react';
import { pelvicFloorChallenge } from '../data/pelvicFloorChallenge';

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function PelvicFloorChallenge({ language = 'es', darkMode = false }) {
    const [expanded, setExpanded] = useState(false);         // intro expandida
    const [howToOpen, setHowToOpen] = useState(false);       // acordeón cómo hacer
    const [activeStep, setActiveStep] = useState(null);      // paso del acordeón
    const [currentDay, setCurrentDay] = useState(1);         // día activo
    const [completedDays, setCompletedDays] = useState([]);  // días completados
    const [showChallenge, setShowChallenge] = useState(false); // vista del challenge

    const lang = language;
    const data = pelvicFloorChallenge;
    const meta = data.meta[lang];
    const intro = data.introduction[lang];
    const howTo = data.howTo[lang];
    const todayData = data.days.find(d => d.day === currentDay);
    const todayContent = todayData?.[lang];

    const weekLabels = {
        es: ['Semana 1 — Activación', 'Semana 2 — Resistencia', 'Semana 3 — Consolidación'],
        en: ['Week 1 — Activation', 'Week 2 — Resistance', 'Week 3 — Consolidation'],
    };

    const markDone = () => {
        if (!completedDays.includes(currentDay)) {
            setCompletedDays([...completedDays, currentDay]);
        }
        if (currentDay < 21) setCurrentDay(currentDay + 1);
    };

    // ── VISTA PRINCIPAL DEL CHALLENGE (día a día) ─────────────────────────────
    if (showChallenge) {
        return (
            <div className={`rounded-2xl overflow-hidden shadow-md border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'}`}>

                {/* HEADER */}
                <div className="bg-gradient-to-r from-rose-400 to-amber-300 p-4 flex items-center justify-between">
                    <button onClick={() => setShowChallenge(false)} className="text-white text-sm flex items-center gap-1">
                        ← {lang === 'es' ? 'Volver' : 'Back'}
                    </button>
                    <h3 className="text-white font-semibold text-sm">{meta.title}</h3>
                    <span className="text-white text-sm font-bold">{completedDays.length}/21</span>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-100 h-1.5">
                    <div
                        className="bg-gradient-to-r from-rose-400 to-amber-300 h-1.5 transition-all duration-500"
                        style={{ width: `${(completedDays.length / 21) * 100}%` }}
                    />
                </div>

                {/* WEEK TABS */}
                <div className="flex overflow-x-auto gap-2 px-4 pt-4 pb-2 scrollbar-hide">
                    {[1, 2, 3].map(w => (
                        <button
                            key={w}
                            onClick={() => setCurrentDay(data.days.find(d => d.week === w)?.day || 1)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition ${
                                todayData?.week === w
                                    ? 'bg-rose-400 text-white'
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {weekLabels[lang][w - 1]}
                        </button>
                    ))}
                </div>

                {/* DAY DOTS */}
                <div className="flex flex-wrap gap-2 px-4 py-3">
                    {data.days.filter(d => d.week === todayData?.week).map(d => (
                        <button
                            key={d.day}
                            onClick={() => setCurrentDay(d.day)}
                            className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition ${
                                completedDays.includes(d.day)
                                    ? 'bg-rose-400 text-white'
                                    : d.day === currentDay
                                    ? 'bg-purple-600 text-white'
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {completedDays.includes(d.day) ? '✓' : d.day}
                        </button>
                    ))}
                </div>

                <div className="p-4 space-y-4">

                    {/* VIDEO DEL DÍA */}
                    {todayData?.video && (
                        <video
                            key={todayData.video}
                            src={todayData.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full rounded-xl object-cover max-h-56"
                        />
                    )}

                    {/* TÍTULO Y BADGE */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs font-medium ${darkMode ? 'text-purple-300' : 'text-purple-500'}`}>
                                {lang === 'es' ? `Día ${currentDay} de 21` : `Day ${currentDay} of 21`}
                            </p>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {todayContent?.title}
                            </h3>
                        </div>
                        {todayContent?.reps && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${darkMode ? 'bg-rose-900 text-rose-200' : 'bg-rose-50 text-rose-600'}`}>
                                {todayContent.reps}
                            </span>
                        )}
                    </div>

                    {/* INSTRUCCIÓN */}
                    <div className={`rounded-xl p-4 border-l-4 border-rose-400 ${darkMode ? 'bg-gray-700' : 'bg-amber-50'}`}>
                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {todayContent?.instruction}
                        </p>
                        {todayContent?.duration && (
                            <p className={`text-xs mt-2 font-medium ${darkMode ? 'text-purple-300' : 'text-purple-500'}`}>
                                ⏱ {todayContent.duration}
                            </p>
                        )}
                    </div>

                    {/* DATO CIENTÍFICO (acordeón) */}
                    <div className={`rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-100'}`}>
                        <button
                            onClick={() => setActiveStep(activeStep === 'science' ? null : 'science')}
                            className="w-full flex items-center justify-between p-3 text-left"
                        >
                            <span className={`text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                🔬 {lang === 'es' ? '¿Por qué funciona?' : 'Why does it work?'}
                            </span>
                            <span className={`text-lg transition-transform ${activeStep === 'science' ? 'rotate-180' : ''}`}>⌄</span>
                        </button>
                        {activeStep === 'science' && (
                            <div className="px-3 pb-3">
                                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {todayContent?.scienceFact}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* BOTÓN COMPLETAR */}
                    <button
                        onClick={markDone}
                        disabled={completedDays.includes(currentDay)}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                            completedDays.includes(currentDay)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-rose-400 to-amber-300 text-white hover:shadow-lg'
                        }`}
                    >
                        {completedDays.includes(currentDay)
                            ? (lang === 'es' ? '✓ Completado' : '✓ Completed')
                            : (lang === 'es' ? 'Marcar como hecho ✓' : 'Mark as done ✓')
                        }
                    </button>
                </div>
            </div>
        );
    }

    // ── VISTA CARD DE ENTRADA ─────────────────────────────────────────────────
    return (
        <div className={`rounded-2xl overflow-hidden shadow-md border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'}`}>

            {/* HERO VIDEO */}
            <div className="relative">
                <video
                    src={meta.heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full object-cover max-h-48"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div>
                        <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
                            🏆 21 {lang === 'es' ? 'días' : 'days'} Challenge
                        </p>
                        <h3 className="text-white text-xl font-semibold">{meta.title}</h3>
                        <p className="text-white/80 text-sm">{meta.subtitle}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">

                {/* INTRO EXPANDIBLE */}
                <div className={`rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-amber-50 border-amber-100'}`}>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-between p-3 text-left"
                    >
                        <span className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-rose-800'}`}>
                            💡 {intro.heading}
                        </span>
                        <span className={`text-lg transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>⌄</span>
                    </button>
                    {expanded && (
                        <div className="px-3 pb-3 space-y-3">
                            {intro.body.split('\n\n').map((p, i) => (
                                <p key={i} className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{p}</p>
                            ))}
                            <div className="space-y-1 pt-1">
                                {intro.benefits.map((b, i) => (
                                    <p key={i} className={`text-xs flex items-start gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="text-rose-400 mt-0.5">✓</span> {b}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* CÓMO HACER KEGEL (acordeón) */}
                <div className={`rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-100'}`}>
                    <button
                        onClick={() => setHowToOpen(!howToOpen)}
                        className="w-full flex items-center justify-between p-3 text-left"
                    >
                        <span className={`text-sm font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                            📋 {howTo.title}
                        </span>
                        <span className={`text-lg transition-transform duration-200 ${howToOpen ? 'rotate-180' : ''}`}>⌄</span>
                    </button>
                    {howToOpen && (
                        <div className="px-3 pb-3 space-y-3">
                            <video
                                src={howTo.video}
                                autoPlay loop muted playsInline
                                className="w-full rounded-lg object-cover max-h-36"
                            />
                            {howTo.steps.map((s) => (
                                <div key={s.step} className={`flex gap-3 items-start`}>
                                    <span className="w-6 h-6 rounded-full bg-rose-400 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {s.step}
                                    </span>
                                    <div>
                                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{s.title}</p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s.body}</p>
                                    </div>
                                </div>
                            ))}
                            <div className={`rounded-lg p-3 flex gap-2 ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                                <span>⚠️</span>
                                <p className={`text-xs ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>{howTo.warning}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* PROGRESO */}
                {completedDays.length > 0 && (
                    <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {lang === 'es' ? 'Tu progreso' : 'Your progress'}
                            </p>
                            <p className={`text-xs font-bold ${darkMode ? 'text-rose-300' : 'text-rose-500'}`}>
                                {completedDays.length}/21 {lang === 'es' ? 'días' : 'days'}
                            </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-rose-400 to-amber-300 h-2 rounded-full transition-all"
                                style={{ width: `${(completedDays.length / 21) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* CTA */}
                <button
                    onClick={() => setShowChallenge(true)}
                    className="w-full bg-gradient-to-r from-rose-400 to-amber-300 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition"
                >
                    {completedDays.length === 0
                        ? (lang === 'es' ? '🏆 Comenzar el Challenge' : '🏆 Start the Challenge')
                        : (lang === 'es' ? `Continuar — Día ${currentDay}` : `Continue — Day ${currentDay}`)
                    }
                </button>
            </div>
        </div>
    );
}