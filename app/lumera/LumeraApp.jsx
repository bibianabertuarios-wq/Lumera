'use client'
import PelvicFloorChallenge from "../components/PelvicFloorChallenge";
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import './lumera.css'

// hooks imported above

        // SUPABASE ACTIVADO
        const SUPABASE_URL = 'https://pyekwpmbdnmglrjieexc.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWt3cG1iZG5tZ2xyamllZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODM0OTgsImV4cCI6MjA4MTA1OTQ5OH0.zQl7GF3E6BhDqW3bEMixAbdDcOsW8BsFOBeAGa-5bzY';
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // LEMON SQUEEZY - Configuración
        const LEMON_CONFIG = {
            storeId: '271685',
            variantId: '1230606'
        };

        const PRICES = {
            emea: {
                price: '€4.99',
                monthly: '€4.99',
                annual: '€39.99',
                annualOriginal: '€59.88',
                annualSavings: '€20',
                currency: 'EUR',
                monthlyVariantId: '2d480891-baaa-4968-9c7b-9b4a6e2c04db',
                annualVariantId: 'd3ff3973-7f9e-413c-89dc-9255874779d7'
            },
            latam: {
                price: '$5.49',
                monthly: '$5.49',
                annual: '$43.99',
                annualOriginal: '$65.88',
                annualSavings: '$22',
                currency: 'USD',
                monthlyVariantId: '2d480891-baaa-4968-9c7b-9b4a6e2c04db',
                annualVariantId: 'd3ff3973-7f9e-413c-89dc-9255874779d7'
            },
            usa: {
                price: '$5.49',
                monthly: '$5.49',
                annual: '$43.99',
                annualOriginal: '$65.88',
                annualSavings: '$22',
                currency: 'USD',
                monthlyVariantId: '2d480891-baaa-4968-9c7b-9b4a6e2c04db',
                annualVariantId: 'd3ff3973-7f9e-413c-89dc-9255874779d7'
            }
        };

        const LumeraApp = () => {
            const [language, setLanguage] = useState('es');

            // Sync idioma con Supabase cuando cambia
            useEffect(() => {
                if (!currentUser || !currentUser.id) return;
                supabase.from('users').update({ language }).eq('id', currentUser.id);
            }, [language]);
            const [darkMode, setDarkMode] = useState(false);
            const [session, setSession] = useState(null);
            const [authMode, setAuthMode] = useState('login');
            const [authData, setAuthData] = useState({ email: '', password: '' });
            const [showPasswordReset, setShowPasswordReset] = useState(false);
            const [resetEmail, setResetEmail] = useState('');
            const [showAuth, setShowAuth] = useState(true); // FORZAR TRUE AL INICIO
            const [loading, setLoading] = useState(true);
            const [currentUser, setCurrentUser] = useState(null);
            const [currentPage, setCurrentPage] = useState('home');
            const [showQuiz, setShowQuiz] = useState(false);
            const [quizStep, setQuizStep] = useState(1);
            const [symptoms, setSymptoms] = useState([]);
            const [periodLog, setPeriodLog] = useState([]);
            const [periodGuidance, setPeriodGuidance] = useState(null);
            const [periodGuidanceLoading, setPeriodGuidanceLoading] = useState(false);
            const [userMessages, setUserMessages] = useState([]);
            const [exerciseGoal, setExerciseGoal] = useState('hormonal');
            const [userRegion, setUserRegion] = useState('latam');
            const [showTutorial, setShowTutorial] = useState(false);
            const [showHowTo, setShowHowTo] = useState(false);
            const [editingProfile, setEditingProfile] = useState(false);
            const [profileEdits, setProfileEdits] = useState({});
            const [showBmiInfo, setShowBmiInfo] = useState(false);
            const [showBmrInfo, setShowBmrInfo] = useState(false);
            const [showTdeeInfo, setShowTdeeInfo] = useState(false);
            const [oracleFlipped, setOracleFlipped] = useState(false);
            const [oracleActiveMomento, setOracleActiveMomento] = useState(null);
            const [oracleActive, setOracleActive] = useState(null);

            // CHAT LUMI
            const [showLumiChat, setShowLumiChat] = useState(false);
            const [showEditProfile, setShowEditProfile] = useState(false);
            const [editingWeight, setEditingWeight] = useState('');
            const [editingActivity, setEditingActivity] = useState('moderate');
            const [lumiMessages, setLumiMessages] = useState([]);
            const [lumiInput, setLumiInput] = useState('');
            const [lumiLoading, setLumiLoading] = useState(false);
            const [dailyQuestions, setDailyQuestions] = useState(0);
            const [lastQuestionDate, setLastQuestionDate] = useState(null);

            // MODAL PATRÓN DÍA 3
            const [showPatternModal, setShowPatternModal] = useState(false);
            const [patternResult, setPatternResult] = useState(null);
            const [patternShown, setPatternShown] = useState(false);

            // LUMI PROACTIVA - NUEVO ✨
            const [unreadLumiMessages, setUnreadLumiMessages] = useState(0);
            const [showProactiveModal, setShowProactiveModal] = useState(false);
            const [proactiveMessages, setProactiveMessages] = useState([]);
            const [showPlanModal, setShowPlanModal] = useState(false);

            // TRIAL BANNER
            const [trialDaysRemaining, setTrialDaysRemaining] = useState(3);
            const [showTrialBanner, setShowTrialBanner] = useState(true);

            // DASHBOARD PREMIUM - NUEVO
            const [showProfileModal, setShowProfileModal] = useState(false);
            const [editWeight, setEditWeight] = useState('');
            const [editHeight, setEditHeight] = useState('');
            const [editAge, setEditAge] = useState('');
            const [editActivityLevel, setEditActivityLevel] = useState('moderate');
            const [editGoal, setEditGoal] = useState('maintain');
            const [showDashboardModal, setShowDashboardModal] = useState(false);
            const [showWelcomePremium, setShowWelcomePremium] = useState(false);
            const [showWelcomeTrial, setShowWelcomeTrial] = useState(false);
            const [showShulaDay3, setShowShulaDay3] = useState(false);
            const [showOraclePopup, setShowOraclePopup] = useState(false);
            const [welcomeAct, setWelcomeAct] = useState(1);
            const [chartData, setChartData] = useState(null);
            const [aiCookingTips, setAiCookingTips] = useState({}); // {recipeName: [tip1, tip2, tip3]}
            const [loadingTips, setLoadingTips] = useState({}); // {recipeName: true/false}
            const [aiExercises, setAiExercises] = useState(null);
            const [loadingExercises, setLoadingExercises] = useState(false);

            // MENUS - Estado global
            const [menus, setMenus] = useState({ es: {}, en: {} });
            const [menusLoading, setMenusLoading] = useState(true);

            const [formData, setFormData] = useState({
                profileName: '',
                age: '',
                height: '',
                weight: '',
                activity_level: 'moderate', // sedentary, light, moderate, active, very_active
                conditions: [],
            });

            const [symptomForm, setSymptomForm] = useState({
                sleep: 5,
                energy: 5,
                mood: 5,
                hotFlashes: 0,
                anxiety: 5,
                vaginalDryness: 0,
                brainFog: 0,
                memory: 5,
                date: new Date().toISOString().split('T')[0]
            });

            const [periodForm, setPeriodForm] = useState({
                intensity: 5,
                duration: 5,
                symptoms: '',
                date: new Date().toISOString().split('T')[0]
            });

            const [communityMessage, setCommunityMessage] = useState('');
            const [communityPosts, setCommunityPosts] = useState([]);
            const [loadingPosts, setLoadingPosts] = useState(true);

            // REFS PARA GRÁFICOS
            const chartRefSleep = useRef(null);
            const chartRefEnergy = useRef(null);
            const chartRefMood = useRef(null);
            const chartRefHotFlashes = useRef(null);
            const chartRefPeriod = useRef(null);

            const chartsRef = useRef({
                sleep: null,
                energy: null,
                mood: null,
                hotFlashes: null,
                period: null
            });

            const t = {
                es: {
                    app_name: 'Lumera',
                    home: 'Inicio',
                    nutrition: 'Nutrición',
                    exercise: 'Ejercicio',
                    symptoms: 'Síntomas',
                    period: 'Período',
                    myths: 'Mitos',
                    tips: 'Consejos',
                    workshops: 'Talleres',
                    community: 'Comunidad',
                    save: 'Guardar',
                    cancel: 'Cancelar',
                    next: 'Siguiente',
                    exit: 'Salir',
                    ingredients: 'Ingredientes',
                    preparation: 'Preparación',
                    why: 'Por qué',
                    benefits: 'Beneficios',
                    day: 'Día',
                    breakfast: 'Desayuno',
                    lunch: 'Almuerzo',
                    dinner: 'Cena',
                    snack: 'Snack',
                    personalized: 'Personalizado para ti',
                    download: 'Descargar',
                    addRecord: 'Registrar',
                    strength: 'Ganar Fuerza',
                    weightLoss: 'Perder Peso',
                    hormonal: 'Equilibrio Hormonal'
                },
                en: {
                    app_name: 'Lumera',
                    home: 'Home',
                    nutrition: 'Nutrition',
                    exercise: 'Exercise',
                    symptoms: 'Symptoms',
                    period: 'Period',
                    myths: 'Myths',
                    tips: 'Tips',
                    workshops: 'Workshops',
                    community: 'Community',
                    save: 'Save',
                    cancel: 'Cancel',
                    next: 'Next',
                    exit: 'Exit',
                    ingredients: 'Ingredients',
                    preparation: 'Preparation',
                    why: 'Why',
                    benefits: 'Benefits',
                    day: 'Day',
                    breakfast: 'Breakfast',
                    lunch: 'Lunch',
                    dinner: 'Dinner',
                    snack: 'Snack',
                    personalized: 'Personalized for you',
                    download: 'Download',
                    addRecord: 'Record',
                    strength: 'Build Strength',
                    weightLoss: 'Lose Weight',
                    hormonal: 'Hormonal Balance'
                }
            };

            // CARGAR DATOS
            useEffect(() => {
                // CARGAR SESIÓN DESDE SUPABASE
                const checkSession = async () => {
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session) {
                        // Cargar perfil del usuario (el más reciente)
                        const { data: profiles } = await supabase
                            .from('users')
                            .select('*')
                            .eq('id', session.user.id)
                            .order('updated_at', { ascending: false })
                            .limit(1);

                        const profile = profiles?.[0];

                        setSession(session);
                        setCurrentUser(profile || { id: session.user.id, email: session.user.email });
                        setShowAuth(false);

                        // Si no tiene perfil completo, mostrar quiz
                        if (!profile?.profile_name) {
                            setShowQuiz(true);
                        }

                    } else {
                        setShowAuth(true);
                        setShowQuiz(false);
                    }

                    setLoading(false);
                };

                checkSession();

                // Listener para cambios de auth
                // IMPORTANTE: ignoramos SIGNED_IN inicial porque checkSession ya lo maneja
                // Solo actuamos en cambios reales (login posterior, logout)
                let initialAuthEventHandled = false;
                const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                    if (event === 'SIGNED_OUT') {
                        setSession(null);
                        setCurrentUser(null);
                        setShowAuth(true);
                        initialAuthEventHandled = false;
                    } else if (event === 'SIGNED_IN' && session) {
                        // Si es el primer SIGNED_IN y checkSession ya lo manejó, ignorar
                        if (!initialAuthEventHandled) {
                            initialAuthEventHandled = true;
                            return; // checkSession ya lo procesó
                        }

                        setSession(session);

                        // Cargar perfil
                        const { data: profile } = await supabase
                            .from('users')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();

                        if (profile) {
                            setCurrentUser(profile);
                            setShowAuth(false);
                            if (!profile.profile_name) {
                                setShowQuiz(true);
                            }
                        } else {
                            // Usuario nueva por Google, crear perfil básico
                            const { data: newProfile } = await supabase
                                .from('users')
                                .insert([{
                                    id: session.user.id,
                                    email: session.user.email,
                                    created_at: new Date().toISOString()
                                }])
                                .select();

                            setCurrentUser(newProfile?.[0] || { id: session.user.id, email: session.user.email });
                            setShowAuth(false);
                            setShowQuiz(true);
                        }
                    }
                });

                return () => subscription.unsubscribe();
            }, []);

            // CARGAR POSTS DE COMUNIDAD
            useEffect(() => {
                const loadCommunityPosts = async () => {
                    try {
                        const { data, error } = await supabase
                            .from('community_posts')
                            .select('*')
                            .eq('is_approved', true)
                            .eq('language', language)
                            .order('created_at', { ascending: false })
                            .limit(20);

                        if (error) {
                        } else {
                            setCommunityPosts(data || []);
                        }
                    } catch (err) {
                    } finally {
                        setLoadingPosts(false);
                    }
                };

                if (session) {
                    loadCommunityPosts();
                }
            }, [language, session]);

            // CARGAR MENSAJES PROACTIVOS DE LUMI ✨
            useEffect(() => {
                if (!currentUser) return;

                const todayKey = `lumiGreeted_${currentUser.id}_${new Date().toDateString()}`;
                const alreadyGreetedToday = localStorage.getItem(todayKey);

                // Calcular si es día 3 de trial
                const trialDaysLeftNow = (() => {
                    if (!currentUser?.created_at) return 99;
                    const created = new Date(currentUser.created_at);
                    const daysPassed = (new Date() - created) / (1000 * 60 * 60 * 24);
                    return Math.max(0, Math.ceil(3 - daysPassed));
                })();
                const isDay3Trial = trialDaysLeftNow <= 1 && !['active','paid'].includes(currentUser.subscription_status);

                // Generar saludo local diario garantizado
                const buildDailyGreeting = () => {
                    const userName = currentUser.profile_name || (language === 'es' ? 'amiga' : 'friend');
                    const hour = new Date().getHours();
                    const greetEs = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
                    const greetEn = hour < 12 ? 'Good morning' : hour < 19 ? 'Good afternoon' : 'Good evening';

                    if (isDay3Trial) {
                        return {
                            id: 'local-day3-' + Date.now(),
                            message_type: 'pattern_insight',
                            message_text: language === 'es'
                                ? `${greetEs} ${userName} 💜 Es tu tercer día con Lumera y ya tengo algo importante para ti. He analizado tus registros y detecté patrones reales en tus síntomas. Ábrelos tocando el corazón abajo 🔍 — son datos de tu cuerpo, no suposiciones.`
                                : `${greetEn} ${userName} 💜 It's your third day with Lumera and I already have something important for you. I've analyzed your records and found real patterns in your symptoms. Open them by tapping the heart below 🔍 — these are real data from your body, not guesses.`,
                            created_at: new Date().toISOString(),
                            read_at: null
                        };
                    }

                    const dayVariants = language === 'es'
                        ? [
                            `${greetEs} ${userName} 💜 Estoy aquí para acompañarte hoy. ¿Cómo te encuentras?`,
                            `${greetEs} ${userName} 🌿 Un nuevo día para cuidarte. ¿Cómo dormiste anoche?`,
                            `${greetEs} ${userName} ✨ Me alegra verte. ¿Quieres registrar cómo te sientes hoy?`,
                            `${greetEs} ${userName} 💜 Recuerda: pequeños pasos cada día marcan la diferencia. ¿Cómo estás hoy?`,
                            `${greetEs} ${userName} 🌸 Tu cuerpo hace algo increíble cada día. ¿Cómo te sientes ${new Date().getHours() < 12 ? "esta mañana" : new Date().getHours() < 20 ? "esta tarde" : "esta noche"}?`,
                        ]
                        : [
                            `${greetEn} ${userName} 💜 I'm here for you today. How are you feeling?`,
                            `${greetEn} ${userName} 🌿 A new day to take care of yourself. How did you sleep last night?`,
                            `${greetEn} ${userName} ✨ Good to see you. Would you like to log how you're feeling today?`,
                            `${greetEn} ${userName} 💜 Remember: small steps every day make a big difference. How are you today?`,
                            `${greetEn} ${userName} 🌸 Your body does something incredible every day. How are you feeling ${new Date().getHours() < 12 ? "this morning" : new Date().getHours() < 20 ? "this afternoon" : "tonight"}?`,
                        ];

                    const dayOfWeek = new Date().getDay();
                    return {
                        id: 'local-greeting-' + Date.now(),
                        message_type: 'greeting',
                        message_text: dayVariants[dayOfWeek % dayVariants.length],
                        created_at: new Date().toISOString(),
                        read_at: null
                    };
                };

                const loadProactiveMessages = async () => {
                    try {
                        const { data, error } = await supabase
                            .from('lumi_proactive_messages')
                            .select('*')
                            .eq('user_id', currentUser.id)
                            .is('read_at', null)
                            .order('created_at', { ascending: false });

                        if (!error && data && data.length > 0) {
                            // Hay mensajes reales sin leer en BD → mostrarlos
                            setProactiveMessages(data);
                            setUnreadLumiMessages(data.length);
                            const timer = setTimeout(() => setShowProactiveModal(true), 2000);
                            return () => clearTimeout(timer);
                        }

                        // Sin mensajes en BD → saludo diario local
                        // Solo mostrar popup si no saludó hoy todavía
                        const greeting = buildDailyGreeting();
                        setProactiveMessages([greeting]);
                        setUnreadLumiMessages(1);

                        if (!alreadyGreetedToday) {
                            localStorage.setItem(todayKey, '1');
                            const timer = setTimeout(() => setShowProactiveModal(true), 2000);
                            return () => clearTimeout(timer);
                        }
                        // Ya saludó hoy → badge visible pero sin popup automático
                    } catch (err) {
                        // Fallback: saludo diario aunque falle Supabase
                        const greeting = buildDailyGreeting();
                        setProactiveMessages([greeting]);
                        setUnreadLumiMessages(1);
                        if (!alreadyGreetedToday) {
                            localStorage.setItem(todayKey, '1');
                            const timer = setTimeout(() => setShowProactiveModal(true), 2000);
                            return () => clearTimeout(timer);
                        }
                    }
                };

                loadProactiveMessages();

                // Recargar cada 5 minutos para detectar mensajes nuevos de BD
                const interval = setInterval(loadProactiveMessages, 5 * 60 * 1000);
                return () => clearInterval(interval);
            }, [currentUser]);

            // CARGAR SÍNTOMAS DESDE SUPABASE - CRÍTICO ✨
            useEffect(() => {
                if (!currentUser) return;

                const loadSymptoms = async () => {
                    try {
                        const { data, error } = await supabase
                            .from('symptoms')
                            .select('*')
                            .eq('user_id', currentUser.id)
                            .order('symptom_date', { ascending: false })
                            .limit(30);

                        if (error) {
                            return;
                        }

                        if (data && data.length > 0) {
                            const normalized = data.map(s => ({...s, hotFlashes: s.hot_flashes ?? s.hotFlashes ?? 0, brainFog: s.brain_fog ?? s.brainFog ?? 0, vaginalDryness: s.vaginal_dryness ?? s.vaginalDryness ?? 0, jointPain: s.joint_pain ?? s.jointPain ?? 0})); setSymptoms(normalized);
                        }
                    } catch (err) {
                    }
                };

                loadSymptoms();
            }, [currentUser]);

            // GUARDAR PREFERENCIAS LOCALMENTE
            useEffect(() => {
                localStorage.setItem('lumeraDark', JSON.stringify(darkMode));
                localStorage.setItem('lumeraLang', language);
                localStorage.setItem('lumeraSymptoms', JSON.stringify(symptoms));
                localStorage.setItem('lumeraPeriod', JSON.stringify(periodLog));
                localStorage.setItem('lumeraMessages', JSON.stringify(userMessages));
            }, [darkMode, language, symptoms, periodLog, userMessages]);

            // CALCULAR DÍAS RESTANTES DE TRIAL
            useEffect(() => {
                if (!currentUser) return;

                // Calcular días de trial restantes
                const trialStartDate = new Date(currentUser.created_at);
                const today = new Date();
                const daysSinceStart = Math.floor((today - trialStartDate) / (1000 * 60 * 60 * 24));
                const daysLeft = Math.max(0, 3 - daysSinceStart);

                setTrialDaysRemaining(daysLeft);

                // Mostrar banner solo si no es premium
                setShowTrialBanner(!['active','paid'].includes(currentUser.subscription_status));
            }, [currentUser]);

            // GRÁFICOS DE SÍNTOMAS
            useEffect(() => {
                if (symptoms.length === 0) return;

                const labels = symptoms.map(s => {
                    const d = new Date(s.symptom_date || s.date);
                    return d.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' });
                }).slice(-14);
                const sleepData = symptoms.map(s => s.sleep || 0).slice(-14);
                const energyData = symptoms.map(s => s.energy || 0).slice(-14);
                const moodData = symptoms.map(s => s.mood || 0).slice(-14);
                const hotFlashesData = symptoms.map(s => s.hot_flashes || s.hotFlashes || 0).slice(-14);

                const chartOptions = {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: true } },
                    scales: { y: { beginAtZero: true, max: 10 } }
                };

                setTimeout(() => {
                    if (chartRefSleep.current && window.Chart) {
                        if (chartsRef.current.sleep) chartsRef.current.sleep.destroy();
                        chartsRef.current.sleep = new window.Chart(chartRefSleep.current, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{ label: language === 'es' ? 'Sueño' : 'Sleep', data: sleepData, borderColor: '#C9935A', backgroundColor: 'rgba(201,147,90,0.1)', borderWidth: 2, fill: true, tension: 0.4 }]
                            },
                            options: chartOptions
                        });
                    }

                    if (chartRefEnergy.current && window.Chart) {
                        if (chartsRef.current.energy) chartsRef.current.energy.destroy();
                        chartsRef.current.energy = new window.Chart(chartRefEnergy.current, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{ label: language === 'es' ? 'Energía' : 'Energy', data: energyData, borderColor: '#B87333', backgroundColor: 'rgba(184,115,51,0.1)', borderWidth: 2, fill: true, tension: 0.4 }]
                            },
                            options: chartOptions
                        });
                    }

                    if (chartRefMood.current && window.Chart) {
                        if (chartsRef.current.mood) chartsRef.current.mood.destroy();
                        chartsRef.current.mood = new window.Chart(chartRefMood.current, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{ label: language === 'es' ? 'Ánimo' : 'Mood', data: moodData, borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.1)', borderWidth: 2, fill: true, tension: 0.4 }]
                            },
                            options: chartOptions
                        });
                    }

                    if (chartRefHotFlashes.current && window.Chart) {
                        if (chartsRef.current.hotFlashes) chartsRef.current.hotFlashes.destroy();
                        chartsRef.current.hotFlashes = new window.Chart(chartRefHotFlashes.current, {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{ label: language === 'es' ? 'Sofocos' : 'Hot Flashes', data: hotFlashesData, backgroundColor: '#f97316', borderColor: '#ea580c', borderWidth: 1 }]
                            },
                            options: chartOptions
                        });
                    }
                }, 100);
            }, [symptoms, language]);

            // GRÁFICOS DE PERÍODO
            useEffect(() => {
                if (periodLog.length === 0) return;

                const labels = periodLog.map(p => p.date).slice(-12);
                const intensityData = periodLog.map(p => p.intensity).slice(-12);
                const durationData = periodLog.map(p => p.duration).slice(-12);

                const chartOptions = {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: true } },
                    scales: { y: { beginAtZero: true } }
                };

                setTimeout(() => {
                    if (chartRefPeriod.current && window.Chart) {
                        if (chartsRef.current.period) chartsRef.current.period.destroy();
                        chartsRef.current.period = new window.Chart(chartRefPeriod.current, {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [
                                    { label: language === 'es' ? 'Intensidad' : 'Intensity', data: intensityData, backgroundColor: '#C9935A', borderColor: '#B87333', borderWidth: 1 },
                                    { label: language === 'es' ? 'Duración (días)' : 'Duration (days)', data: durationData, backgroundColor: '#f97316', borderColor: '#c2410c', borderWidth: 1 }
                                ]
                            },
                            options: chartOptions
                        });
                    }
                }, 100);
            }, [periodLog, language]);

            // Helper: parsear health_conditions sea cual sea el formato (array, string JSON, CSV)
            const parseHealthConditions = (conditions) => {
                if (!conditions) return [];
                if (Array.isArray(conditions)) return conditions;
                if (typeof conditions === 'string') {
                    try { 
                        const parsed = JSON.parse(conditions);
                        return Array.isArray(parsed) ? parsed : [parsed];
                    } catch { 
                        return conditions.split(',').map(s => s.trim()).filter(Boolean);
                    }
                }
                return [];
            };

            // SISTEMA DE FILTRO DE INTOLERANCIAS Y SUSTITUCIONES
            const applyDietaryRestrictions = (ingredient, userConditions) => {
                // Normalizar health_conditions — puede venir como string JSON, array, o undefined
                let parsedConditions = userConditions;
                if (typeof userConditions === 'string') {
                    try { parsedConditions = JSON.parse(userConditions); }
                    catch { parsedConditions = userConditions.split(',').map(s => s.trim()).filter(Boolean); }
                }
                if (!parsedConditions || parsedConditions.length === 0) {
                    return ingredient;
                }
                // Usar parsedConditions en lugar de userConditions a partir de aquí
                userConditions = parsedConditions;

                // NORMALIZAR condiciones a español (funciona con ambos idiomas)
                // FIX: Hacer case-insensitive con toLowerCase()
                const normalizeCondition = (cond) => {
                    const condLower = cond.toLowerCase().trim();
                    const mapping = {
                        // Inglés → español
                        'lactose-free': 'sin lactosa',
                        'lactose free': 'sin lactosa',
                        'gluten-free': 'sin gluten',
                        'gluten free': 'sin gluten',
                        'vegetarian': 'vegetariana',
                        'vegetarian no eggs': 'vegetariana sin huevo',
                        'vegan': 'vegana',
                        'hypertension': 'hipertensión',
                        'high blood pressure': 'hipertensión',
                        'arthritis': 'artritis',
                        'anxiety': 'ansiedad',
                        'diabetes': 'diabetes',
                        'diabetes type 2': 'diabetes',
                        'diabetes tipo 2': 'diabetes',
                        // Español con mayúsculas (tal como se guarda del quiz)
                        'sin lactosa': 'sin lactosa',
                        'sin gluten': 'sin gluten',
                        'vegetariana': 'vegetariana',
                        'vegetariana sin huevo': 'vegetariana sin huevo',
                        'vegana': 'vegana',
                        'hipertensión': 'hipertensión',
                        'hipertension': 'hipertensión',
                        'tensión alta': 'hipertensión',
                        'tension alta': 'hipertensión',
                        'artritis': 'artritis',
                        'ansiedad': 'ansiedad',
                        'diabetes': 'diabetes',
                        // Con mayúscula inicial (formato del quiz)
                        'sin lactosa': 'sin lactosa',
                        'hipertensión': 'hipertensión',
                        'artritis': 'artritis',
                        'ansiedad': 'ansiedad',
                    };
                    // También mapear con mayúscula inicial (Diabetes, Hipertensión, etc.)
                    return mapping[condLower] || condLower;
                };

                const normalizedConditions = userConditions.map(normalizeCondition);

                let modifiedIng = { ...ingredient };

                const restrictions = {
                    'sin lactosa': {
                        prohibited: ['leche', 'milk', 'yogur', 'yogurt', 'queso', 'cheese', 'nata', 'cream', 'mantequilla', 'butter', 'kéfir', 'kefir', 'requesón', 'ricotta', 'mascarpone', 'crème', 'crema de leche', 'nata montada', 'whey'],
                        substitute: (ing) => {
                            const n = ing.name.toLowerCase();
                            if (n.includes('leche') || n.includes('milk'))
                                return { ...ing, name: language === 'es' ? 'Leche de avena sin lactosa' : 'Oat milk', why: (ing.why||'') + (language === 'es' ? ' ✨ Sin lactosa, rica en fibra.' : ' ✨ Lactose-free, rich in fiber.') };
                            if (n.includes('yogur') || n.includes('yogurt') || n.includes('kéfir') || n.includes('kefir'))
                                return { ...ing, name: language === 'es' ? 'Yogur de coco sin lactosa' : 'Coconut yogurt', why: (ing.why||'') + (language === 'es' ? ' ✨ Sin lactosa, con probióticos.' : ' ✨ Lactose-free with probiotics.') };
                            if (n.includes('queso') || n.includes('cheese') || n.includes('requesón') || n.includes('ricotta') || n.includes('mascarpone'))
                                return { ...ing, name: language === 'es' ? 'Queso vegetal sin lactosa' : 'Dairy-free cheese', why: (ing.why||'') + (language === 'es' ? ' ✨ Sin lactosa.' : ' ✨ Lactose-free.') };
                            if (n.includes('mantequilla') || n.includes('butter'))
                                return { ...ing, name: language === 'es' ? 'Aceite de oliva virgen extra' : 'Extra virgin olive oil', qty: Math.ceil((ing.qty||20) * 0.75), unit: 'ml', why: language === 'es' ? 'Grasa saludable sin lactosa, antiinflamatoria.' : 'Healthy lactose-free fat, anti-inflammatory.' };
                            if (n.includes('nata') || n.includes('cream') || n.includes('crema'))
                                return { ...ing, name: language === 'es' ? 'Crema de coco' : 'Coconut cream', why: language === 'es' ? 'Alternativa cremosa sin lactosa.' : 'Creamy lactose-free alternative.' };
                            return null;
                        }
                    },
                    'sin gluten': {
                        prohibited: ['avena', 'oats', 'pan', 'bread', 'pasta', 'harina', 'flour', 'trigo', 'wheat', 'cebada', 'barley', 'centeno', 'rye', 'sémola', 'semolina', 'cuscús', 'couscous', 'espelta', 'spelt', 'kamut', 'triticale', 'malt', 'malta', 'soja texturizada', 'textured soy'],
                        substitute: (ing) => {
                            const n = ing.name.toLowerCase();
                            if (n.includes('avena') || n.includes('oats'))
                                return { ...ing, name: language === 'es' ? 'Avena certificada sin gluten' : 'Certified gluten-free oats', why: (ing.why||'') + (language === 'es' ? ' ✨ Certificada libre de gluten.' : ' ✨ Certified gluten-free.') };
                            if (n.includes('pan') || n.includes('bread') || n.includes('tostada') || n.includes('toast'))
                                return { ...ing, name: language === 'es' ? 'Pan sin gluten de semillas' : 'Seed gluten-free bread', why: (ing.why||'') + (language === 'es' ? ' ✨ Sin gluten, rico en fibra.' : ' ✨ Gluten-free, fiber-rich.') };
                            if (n.includes('pasta'))
                                return { ...ing, name: language === 'es' ? 'Pasta de arroz integral' : 'Brown rice pasta', why: language === 'es' ? 'Sin gluten, misma energía.' : 'Gluten-free, same energy.' };
                            if (n.includes('harina') || n.includes('flour'))
                                return { ...ing, name: language === 'es' ? 'Harina de almendra o arroz' : 'Almond or rice flour', why: language === 'es' ? 'Sin gluten. La almendra añade proteína.' : 'Gluten-free. Almond adds protein.' };
                            if (n.includes('cuscús') || n.includes('couscous') || n.includes('sémola') || n.includes('semolina'))
                                return { ...ing, name: language === 'es' ? 'Quinoa cocida' : 'Cooked quinoa', qty: Math.ceil((ing.qty||80) * 1.1), unit: 'g', why: language === 'es' ? 'Sin gluten + proteína completa.' : 'Gluten-free + complete protein.' };
                            if (n.includes('trigo') || n.includes('wheat') || n.includes('espelta') || n.includes('spelt'))
                                return { ...ing, name: language === 'es' ? 'Arroz integral' : 'Brown rice', qty: Math.ceil((ing.qty||80) * 1.0), unit: 'g', why: language === 'es' ? 'Cereal sin gluten, buena fuente de energía.' : 'Gluten-free grain, good energy source.' };
                            if (n.includes('cebada') || n.includes('barley') || n.includes('centeno') || n.includes('rye'))
                                return { ...ing, name: language === 'es' ? 'Mijo cocido' : 'Cooked millet', qty: Math.ceil((ing.qty||80) * 1.0), unit: 'g', why: language === 'es' ? 'Cereal sin gluten alcalinizante.' : 'Alkalizing gluten-free grain.' };
                            return { ...ing, name: language === 'es' ? 'Arroz integral' : 'Brown rice', why: language === 'es' ? 'Alternativa sin gluten segura.' : 'Safe gluten-free alternative.' };
                        }
                    },
                    'vegetariana': {
                        // Vegetariana clásica: sin carne/pescado pero con huevo y lácteos
                        // Nota: si la usuaria también marcó "sin huevo" se aplica la restricción de vegana para huevos
                        prohibited: ['pescado', 'fish', 'carne', 'meat', 'pollo', 'chicken', 'pavo', 'turkey', 'atún', 'tuna', 'salmón', 'salmon', 'cerdo', 'pork', 'ternera', 'beef', 'cordero', 'lamb'],
                        substitute: (ing) => {
                            const nameLower = ing.name.toLowerCase();
                            if (nameLower.includes('salmón') || nameLower.includes('salmon') || nameLower.includes('atún') || nameLower.includes('tuna') || nameLower.includes('pescado') || nameLower.includes('fish')) {
                                return { ...ing, name: language === 'es' ? 'Tofu firme' : 'Firm tofu', qty: Math.ceil((ing.qty||150) * 1.2), unit: 'g', why: language === 'es' ? 'Proteína vegetal completa que absorbe sabores. Rica en calcio.' : 'Complete plant protein that absorbs flavors. Rich in calcium.' };
                            }
                            if (nameLower.includes('pollo') || nameLower.includes('chicken') || nameLower.includes('pavo') || nameLower.includes('turkey')) {
                                return { ...ing, name: language === 'es' ? 'Garbanzos cocidos' : 'Cooked chickpeas', qty: Math.ceil((ing.qty||150) * 0.9), unit: 'g', why: language === 'es' ? 'Proteína vegetal completa. Alta en fibra y minerales.' : 'Complete plant protein. High in fiber and minerals.' };
                            }
                            if (nameLower.includes('carne') || nameLower.includes('meat') || nameLower.includes('ternera') || nameLower.includes('beef') || nameLower.includes('cerdo') || nameLower.includes('pork')) {
                                return { ...ing, name: language === 'es' ? 'Lentejas cocidas' : 'Cooked lentils', qty: Math.ceil((ing.qty||150) * 0.8), unit: 'g', why: language === 'es' ? 'Proteína vegetal + hierro. Perfecta para esta etapa.' : 'Plant protein + iron. Perfect for this stage.' };
                            }
                            return { ...ing, name: language === 'es' ? 'Tempeh' : 'Tempeh', qty: Math.ceil((ing.qty||150) * 0.8), unit: 'g', why: language === 'es' ? 'Proteína fermentada vegetal. Rica en calcio y B12.' : 'Fermented plant protein. Rich in calcium and B12.' };
                        }
                    },
                    'vegetariana sin huevo': {
                        prohibited: ['pescado', 'fish', 'carne', 'meat', 'pollo', 'chicken', 'pavo', 'turkey', 'atún', 'tuna', 'salmón', 'salmon', 'huevo', 'egg', 'huevos', 'eggs'],
                        substitute: (ing) => {
                            const nameLower = ing.name.toLowerCase();
                            if (nameLower.includes('huevo') || nameLower.includes('egg')) {
                                return { ...ing, name: language === 'es' ? 'Tofu revuelto' : 'Scrambled tofu', qty: Math.ceil((ing.qty||2) * 80), unit: 'g', why: language === 'es' ? 'Alternativa vegetal al huevo. Misma proteína sin colesterol.' : 'Plant-based egg alternative. Same protein, no cholesterol.' };
                            }
                            // Para el resto, aplicar sustituciones de vegetariana
                            if (nameLower.includes('salmón') || nameLower.includes('salmon') || nameLower.includes('pescado') || nameLower.includes('fish')) {
                                return { ...ing, name: language === 'es' ? 'Tofu firme' : 'Firm tofu', qty: Math.ceil((ing.qty||150) * 1.2), unit: 'g', why: language === 'es' ? 'Proteína vegetal completa.' : 'Complete plant protein.' };
                            }
                            return { ...ing, name: language === 'es' ? 'Lentejas' : 'Lentils', qty: Math.ceil((ing.qty||150) * 0.8), unit: 'g', why: language === 'es' ? 'Proteína vegetal + hierro.' : 'Plant protein + iron.' };
                        }
                    },
                    'vegana': {
                        prohibited: ['pescado', 'fish', 'carne', 'meat', 'pollo', 'chicken', 'huevo', 'egg', 'leche', 'milk', 'yogur', 'yogurt', 'queso', 'cheese', 'miel', 'honey'],
                        substitute: (ing) => {
                            const nameLower = ing.name.toLowerCase();

                            if (nameLower.includes('huevo') || nameLower.includes('egg')) {
                                return { ...ing, name: language === 'es' ? 'Tofu revuelto' : 'Scrambled tofu', qty: Math.ceil(ing.qty * 2.5), unit: 'g', why: language === 'es' ? 'Proteína vegetal versátil. Misma textura.' : 'Versatile plant protein. Same texture.' };
                            }
                            if (nameLower.includes('leche') || nameLower.includes('milk')) {
                                return { ...ing, name: language === 'es' ? 'Leche de soja fortificada' : 'Fortified soy milk', why: language === 'es' ? 'Opción vegetal más económica y proteica.' : 'Most economical and protein-rich plant option.' };
                            }
                            if (nameLower.includes('yogur') || nameLower.includes('yogurt')) {
                                return { ...ing, name: language === 'es' ? 'Yogur de soja' : 'Soy yogurt', why: language === 'es' ? 'Alternativa vegetal con probióticos.' : 'Plant alternative with probiotics.' };
                            }
                            if (nameLower.includes('queso') || nameLower.includes('cheese')) {
                                return { ...ing, name: language === 'es' ? 'Levadura nutricional' : 'Nutritional yeast', qty: Math.ceil(ing.qty * 0.3), unit: 'g', why: language === 'es' ? 'Sabor a queso + B12. Perfecto.' : 'Cheesy flavor + B12. Perfect.' };
                            }
                            if (nameLower.includes('pescado') || nameLower.includes('fish')) {
                                return { ...ing, name: language === 'es' ? 'Tempeh marinado' : 'Marinated tempeh', qty: Math.ceil(ing.qty * 0.9), unit: 'g', why: language === 'es' ? 'Proteína fermentada con omega-3.' : 'Fermented protein with omega-3.' };
                            }
                            if (nameLower.includes('carne') || nameLower.includes('meat') || nameLower.includes('pollo') || nameLower.includes('chicken')) {
                                return { ...ing, name: language === 'es' ? 'Garbanzos cocidos' : 'Cooked chickpeas', qty: Math.ceil(ing.qty * 0.7), unit: 'g', why: language === 'es' ? 'Proteína vegetal económica y completa.' : 'Economical and complete plant protein.' };
                            }
                            if (nameLower.includes('miel') || nameLower.includes('honey')) {
                                return { ...ing, name: language === 'es' ? 'Sirope de arce' : 'Maple syrup', why: language === 'es' ? 'Dulzor natural vegano.' : 'Natural vegan sweetness.' };
                            }
                            return null;
                        }
                    },
                    'diabetes': {
                        // Alimentos con alto índice glucémico que se eliminan o sustituyen
                        prohibited: ['azúcar', 'sugar', 'miel', 'honey', 'sirope', 'syrup', 'mermelada', 'jam', 'dulce de leche', 'caramelo', 'caramel', 'refresco', 'soda', 'zumo azucarado', 'jugo azucarado', 'azúcar moreno', 'brown sugar', 'glucosa', 'glucose', 'fructosa', 'fructose', 'maltosa', 'dextrosa'],
                        modify: (ing) => {
                            const n = ing.name.toLowerCase();
                            // Azúcares → stevia o reducir
                            if (n.includes('miel') || n.includes('honey'))
                                return { ...ing, name: language === 'es' ? 'Stevia o eritritol (pizca)' : 'Stevia or erythritol (pinch)', qty: 1, unit: language === 'es' ? 'pizca' : 'pinch', why: language === 'es' ? 'Endulzante sin impacto glucémico.' : 'Sweetener with no glycemic impact.' };
                            if (n.includes('azúcar') || n.includes('sugar'))
                                return { ...ing, name: language === 'es' ? 'Stevia (al gusto)' : 'Stevia (to taste)', qty: 1, unit: language === 'es' ? 'pizca' : 'pinch', why: language === 'es' ? 'Sin calorías ni efecto en glucosa.' : 'No calories or glucose effect.' };
                            if (n.includes('sirope') || n.includes('syrup') || n.includes('mermelada') || n.includes('jam'))
                                return null; // Eliminar
                            // Carbohidratos refinados → integrales
                            if (n.includes('arroz blanco') || n.includes('white rice'))
                                return { ...ing, name: language === 'es' ? 'Arroz basmati (porción pequeña)' : 'Basmati rice (small portion)', qty: Math.ceil((ing.qty||80) * 0.6), why: language === 'es' ? 'Índice glucémico más bajo que arroz blanco.' : 'Lower glycemic index than white rice.' };
                            if ((n.includes('pan') && n.includes('blanco')) || n.includes('white bread'))
                                return { ...ing, name: language === 'es' ? 'Pan integral de centeno' : 'Rye whole grain bread', qty: Math.ceil((ing.qty||60) * 0.8), why: language === 'es' ? 'Fibra que ralentiza absorción de glucosa.' : 'Fiber that slows glucose absorption.' };
                            if (n.includes('pasta') && !n.includes('integral'))
                                return { ...ing, name: language === 'es' ? 'Pasta integral al dente' : 'Whole grain pasta al dente', qty: Math.ceil((ing.qty||80) * 0.8), why: language === 'es' ? 'Al dente = menor índice glucémico.' : 'Al dente = lower glycemic index.' };
                            if (n.includes('puré de patata') || n.includes('mashed potato'))
                                return { ...ing, name: language === 'es' ? 'Puré de coliflor' : 'Cauliflower mash', why: language === 'es' ? 'Mucho menos almidón. Índice glucémico bajo.' : 'Much less starch. Low glycemic index.' };
                            if (n.includes('plátano maduro') || n.includes('ripe banana'))
                                return { ...ing, name: language === 'es' ? 'Plátano verde pequeño' : 'Small green banana', qty: Math.ceil((ing.qty||1) * 0.5), why: language === 'es' ? 'Verde = almidón resistente, menor glucemia.' : 'Green = resistant starch, lower glycemia.' };
                            // Frutas muy dulces → porciones pequeñas con nota
                            if (n.includes('uva') || n.includes('grape') || n.includes('mango') || n.includes('lichee') || n.includes('lychee'))
                                return { ...ing, qty: Math.ceil((ing.qty||100) * 0.4), why: (ing.why||'') + (language === 'es' ? ' ⚠️ Porción reducida para control glucémico.' : ' ⚠️ Reduced portion for glucose control.') };
                            return ing;
                        }
                    },
                    'hipertensión': {
                        prohibited: ['sal', 'salt', 'sodio', 'sodium', 'salsa de soja', 'soy sauce', 'salsa worcestershire', 'worcestershire', 'anchoas', 'anchovies', 'embutido', 'deli meat', 'jamón serrano', 'prosciutto', 'bacon', 'tocino', 'chorizo', 'salchichón', 'mortadela', 'paté', 'pate', 'queso curado', 'aged cheese', 'snack salado', 'chips', 'patatas fritas', 'caldo comercial', 'bouillon', 'cubito caldo'],
                        modify: (ing) => {
                            const n = ing.name.toLowerCase();
                            // Sal → especias sin sodio
                            if (n.includes('sal ') || n === 'sal' || n.includes(' salt') || n === 'salt')
                                return { ...ing, name: language === 'es' ? 'Hierbas aromáticas (albahaca, orégano, cúrcuma)' : 'Fresh herbs (basil, oregano, turmeric)', qty: 1, unit: language === 'es' ? 'cdta' : 'tsp', why: language === 'es' ? 'Sabor sin sodio. La cúrcuma además es antiinflamatoria.' : 'Flavor without sodium. Turmeric is also anti-inflammatory.' };
                            if (n.includes('salsa de soja') || n.includes('soy sauce'))
                                return { ...ing, name: language === 'es' ? 'Salsa de soja baja en sodio (poca)' : 'Low-sodium soy sauce (small amount)', qty: Math.ceil((ing.qty||15) * 0.3), why: language === 'es' ? 'Versión reducida en sodio.' : 'Reduced sodium version.' };
                            if (n.includes('jamón') || n.includes('ham') || n.includes('bacon') || n.includes('tocino') || n.includes('embutido'))
                                return { ...ing, name: language === 'es' ? 'Pavo cocido sin sal' : 'Unsalted cooked turkey', why: language === 'es' ? 'Proteína magra con mínimo sodio.' : 'Lean protein with minimal sodium.' };
                            if (n.includes('queso curado') || n.includes('aged cheese') || n.includes('parmesano') || n.includes('parmesan'))
                                return { ...ing, name: language === 'es' ? 'Queso fresco bajo en sodio' : 'Low-sodium fresh cheese', qty: Math.ceil((ing.qty||30) * 0.7), why: language === 'es' ? 'Fresco = mucho menos sodio que curado.' : 'Fresh = much less sodium than aged.' };
                            if (n.includes('caldo') || n.includes('broth') || n.includes('bouillon'))
                                return { ...ing, name: language === 'es' ? 'Caldo casero sin sal o agua con especias' : 'Homemade unsalted broth or spiced water', why: language === 'es' ? 'Sin sodio añadido. Controla tu tensión.' : 'No added sodium. Controls your blood pressure.' };
                            return ing;
                        }
                    },
                    'artritis': {
                        // Evitar proinflamatorios, potenciar antiinflamatorios
                        prohibited: ['fritos', 'fried', 'aceite de girasol', 'sunflower oil', 'aceite de maíz', 'corn oil', 'margarina', 'margarine', 'grasas trans', 'trans fat', 'comida procesada', 'processed food', 'azúcar refinada', 'refined sugar', 'alcohol'],
                        modify: (ing) => {
                            const n = ing.name.toLowerCase();
                            if (n.includes('aceite de girasol') || n.includes('sunflower oil') || n.includes('aceite de maíz') || n.includes('corn oil'))
                                return { ...ing, name: language === 'es' ? 'Aceite de oliva virgen extra' : 'Extra virgin olive oil', why: language === 'es' ? 'Oleocantal = efecto antiinflamatorio similar al ibuprofeno.' : 'Oleocanthal = anti-inflammatory effect similar to ibuprofen.' };
                            if (n.includes('margarina') || n.includes('margarine'))
                                return { ...ing, name: language === 'es' ? 'Aceite de coco virgen' : 'Virgin coconut oil', qty: Math.ceil((ing.qty||20) * 0.8), why: language === 'es' ? 'Grasa antiinflamatoria sin trans.' : 'Anti-inflammatory fat without trans.' };
                            if (n.includes('fritos') || n.includes('fried'))
                                return { ...ing, name: language === 'es' ? 'Al vapor o asado' : 'Steamed or roasted', why: language === 'es' ? 'Sin aceites oxidados proinflamatorios.' : 'Without pro-inflammatory oxidized oils.' };
                            // Añadir nota antiinflamatoria a ciertos alimentos
                            if (n.includes('salmón') || n.includes('salmon') || n.includes('sardina') || n.includes('sardine'))
                                return { ...ing, why: (ing.why||'') + (language === 'es' ? ' 🌟 Omega-3 potentemente antiinflamatorio para articulaciones.' : ' 🌟 Potently anti-inflammatory omega-3 for joints.') };
                            if (n.includes('cúrcuma') || n.includes('turmeric') || n.includes('jengibre') || n.includes('ginger'))
                                return { ...ing, why: (ing.why||'') + (language === 'es' ? ' 🌟 Antiinflamatorio natural. Excelente para artritis.' : ' 🌟 Natural anti-inflammatory. Excellent for arthritis.') };
                            return ing;
                        }
                    },
                    'ansiedad': {
                        // Evitar estimulantes, potenciar calmantes
                        prohibited: ['café', 'coffee', 'cafeína', 'caffeine', 'té negro', 'black tea', 'bebida energética', 'energy drink', 'alcohol', 'azúcar refinada', 'refined sugar'],
                        modify: (ing) => {
                            const n = ing.name.toLowerCase();
                            if (n.includes('café') || n.includes('coffee') || n.includes('cafeína') || n.includes('caffeine'))
                                return { ...ing, name: language === 'es' ? 'Té de manzanilla o melisa' : 'Chamomile or lemon balm tea', why: language === 'es' ? 'Calmante natural. Reduce ansiedad sin cafeína.' : 'Natural calming. Reduces anxiety without caffeine.' };
                            if (n.includes('té negro') || n.includes('black tea'))
                                return { ...ing, name: language === 'es' ? 'Té verde descafeinado o té de lavanda' : 'Decaf green tea or lavender tea', why: language === 'es' ? 'L-teanina calmante sin estimulación.' : 'Calming L-theanine without stimulation.' };
                            if (n.includes('chocolate negro') || n.includes('dark chocolate'))
                                return { ...ing, name: language === 'es' ? 'Chocolate negro 85%+ (poca cantidad)' : 'Dark chocolate 85%+ (small amount)', qty: Math.ceil((ing.qty||30) * 0.5), why: (ing.why||'') + (language === 'es' ? ' ✨ Magnesio calmante. Solo pequeña dosis.' : ' ✨ Calming magnesium. Small dose only.') };
                            // Potenciar alimentos ricos en magnesio y triptófano
                            if (n.includes('almendra') || n.includes('almond') || n.includes('nuez') || n.includes('walnut'))
                                return { ...ing, why: (ing.why||'') + (language === 'es' ? ' 🌟 Rico en magnesio. Reduce ansiedad naturalmente.' : ' 🌟 Rich in magnesium. Reduces anxiety naturally.') };
                            if (n.includes('avena') || n.includes('oats'))
                                return { ...ing, why: (ing.why||'') + (language === 'es' ? ' 🌟 Triptófano → serotonina. Calma ansiedad.' : ' 🌟 Tryptophan → serotonin. Calms anxiety.') };
                            return ing;
                        }
                    }
                };

                // Aplicar restricciones
                for (const condition of normalizedConditions) {
                    const restriction = restrictions[condition];
                    if (!restriction) {
                        continue;
                    }

                    // Proteger contra modifiedIng null o sin name
                    if (!modifiedIng || !modifiedIng.name) continue;

                    // Verificar si ingrediente está prohibido
                    const ingNameLower = modifiedIng.name.toLowerCase();
                    const isProhibited = restriction.prohibited && restriction.prohibited.some(p => ingNameLower.includes(p));

                    
                    if (isProhibited) {
                        if (restriction.substitute) {
                            const substituted = restriction.substitute(modifiedIng);
                            if (substituted) {
                                return substituted;
                            }
                        }
                        return null; // Eliminar si no tiene sustituto
                    }

                    // Aplicar modificaciones (como diabetes)
                    if (restriction.modify) {
                        const modified = restriction.modify(modifiedIng);
                        if (!modified) return null;
                        modifiedIng = modified;
                    }
                }

                return modifiedIng;
            };

            // CACHE DE TRADUCCIONES (para no consultar DB cada vez)
            let ingredientTranslationsCache = null;

            // CARGAR TRADUCCIONES DE INGREDIENTES
            const loadIngredientTranslations = async () => {
                if (ingredientTranslationsCache) return ingredientTranslationsCache;

                try {
                    const { data, error } = await supabase
                        .from('ingredient_translations')
                        .select('*');

                    if (error) {
                        return {};
                    }

                    // Convertir array a objeto para búsqueda rápida
                    const translations = {};
                    data.forEach(item => {
                        translations[item.standard.toLowerCase()] = {
                            latam: item.latam,
                            emea: item.emea,
                            usa: item.usa
                        };
                    });

                    ingredientTranslationsCache = translations;
                    return translations;
                } catch (err) {
                    return {};
                }
            };

            // TRADUCIR INGREDIENTE SEGÚN REGIÓN
            const translateIngredient = async (ingredientName, region) => {
                if (!ingredientName) return ingredientName;

                const translations = await loadIngredientTranslations();
                const regionKey = region?.toLowerCase() || 'latam';

                // Normalizar nombre del ingrediente (quitar acentos, minúsculas)
                const normalized = ingredientName.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                // Buscar traducción
                for (const [standard, trans] of Object.entries(translations)) {
                    const standardNorm = standard.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                    // Si el ingrediente contiene el término estándar
                    if (normalized.includes(standardNorm) || standardNorm.includes(normalized)) {
                        const translated = trans[regionKey] || trans.latam || ingredientName;

                        // Reemplazar solo la palabra específica
                        return ingredientName.toLowerCase().replace(
                            new RegExp(standard, 'gi'),
                            translated
                        );
                    }
                }

                return ingredientName; // Si no hay traducción, devolver original
            };

            // TRADUCIR TODOS LOS INGREDIENTES DE UNA RECETA
            const translateRecipeIngredients = async (recipe, region) => {
                if (!recipe || !recipe.ingredients) return recipe;

                // Solo parsear formato string → objeto, sin traducción regional
                const translatedIngredients = await Promise.all(
                    recipe.ingredients.map(async (ing) => {
                        if (typeof ing === 'string') {
                            const match = ing.match(/^(.+?)\s+(\d+(?:\.\d+)?)(g|ml|kg|l|ud|cdta|cda|pizca|ramitas?|dientes?)$/i);
                            if (match) {
                                const [, name, qty, unit] = match;
                                return { ingredient: name.trim(), name: name.trim(), qty: parseFloat(qty), unit: unit };
                            }
                            return { ingredient: ing, name: ing };
                        }
                        // Ya es objeto, devolver tal cual (sin swap regional)
                        return { ...ing, name: ing.ingredient || ing.name };
                    })
                );

                return {
                    ...recipe,
                    ingredients: translatedIngredients
                };
            };

            // AJUSTAR CALORÍAS SEGÚN TDEE DEL USUARIO
            const adjustCaloriesForUser = (recipe, userTDEE) => {
                // Permitir ajuste en trial y premium
                if (!userTDEE) return recipe;

                // Calcular factor de ajuste (target: 25-30% del TDEE por comida principal)
                const targetMealCalories = {
                    'Desayuno': userTDEE * 0.25,
                    'Almuerzo': userTDEE * 0.35,
                    'Cena': userTDEE * 0.30,
                    'Snack': userTDEE * 0.10
                };

                const target = targetMealCalories[recipe.meal] || recipe.calories;
                const factor = target / recipe.calories;

                // Ajustar cantidades de ingredientes
                const adjustedIngredients = recipe.ingredients.map(ing => ({
                    ...ing,
                    qty: ing.qty ? Math.round(ing.qty * factor * 10) / 10 : ing.qty // Redondear a 1 decimal si existe qty
                }));

                return {
                    ...recipe,
                    calories: Math.round(target),
                    ingredients: adjustedIngredients,
                    personalized: true
                };
            };

            // MENÚS 7 DÍAS — versión con idioma explícito
            const getWeekMenusForLang = async (forceLang) => {
                try {
                    const userLang = forceLang;
                    const region = (currentUser?.region || userRegion || 'LATAM').toLowerCase();
                    await loadIngredientTranslations();

                    let query = supabase.from('menus').select('*').eq('locale', userLang);
                    query = query.eq('region', region.toUpperCase());
                    let { data: recipes, error } = await query;

                    if (error || !recipes || recipes.length === 0) {
                        // Reintentar sin filtro de región
                        const { data: r2 } = await supabase.from('menus').select('*').eq('locale', userLang);
                        recipes = r2 || [];
                    }

                    if (!recipes || recipes.length === 0) return { [userLang]: {} };

                    // Organizar por síntoma (reutiliza la misma lógica)
                    const menusBySymptom = {};
                    const mealOrder = { desayuno:1, breakfast:1, almuerzo:2, lunch:2, snack:3, cena:4, dinner:4 };

                    for (const recipe of recipes) {
                        const symptom = recipe.symptom || 'general';
                        if (!menusBySymptom[symptom]) menusBySymptom[symptom] = [];
                        // Traducir ingredientes básico
                        const ingredients = (recipe.ingredients || []).map(ing => {
                            if (typeof ing === 'string') return { name: ing, ingredient: ing };
                            return ing;
                        });
                        menusBySymptom[symptom].push({
                            name: recipe.name, meal: recipe.meal_type, calories: recipe.calories,
                            protein: recipe.protein, carbs: recipe.carbs, fats: recipe.fats,
                            ingredients, steps: recipe.steps, why: recipe.why,
                            hormonalBenefit: recipe.hormonal_benefit, keyNutrients: recipe.key_nutrients || [],
                            cookingTips: recipe.cooking_tips, nutrientTips: recipe.nutrient_tips || [],
                            menuFocus: recipe.menu_focus,
                            horario: recipe.recommended_time || recipe.horario,
                            whyHorario: recipe.time_reason || recipe.why_horario
                        });
                    }

                    Object.keys(menusBySymptom).forEach(symptom => {
                        menusBySymptom[symptom].sort((a, b) => {
                            const oA = mealOrder[a.meal?.toLowerCase()] || 999;
                            const oB = mealOrder[b.meal?.toLowerCase()] || 999;
                            return oA - oB;
                        });
                    });

                    return { [userLang]: menusBySymptom };
                } catch (err) {
                    return { [forceLang]: {} };
                }
            };

            // MENÚS 7 DÍAS
            const getWeekMenus = async () => {
                try {
                    // Obtener región del usuario
                    const userLang = language;
                    const region = (currentUser?.region || userRegion || 'LATAM').toLowerCase();

                    
                    // Cargar traducciones primero
                    await loadIngredientTranslations();

                    // Consultar Supabase
                    let query = supabase
                        .from('menus')
                        .select('*')
                        .eq('locale', userLang);

                  // Filtrar por región para ambos idiomas
query = query.eq('region', region.toUpperCase()); 

                    let { data: recipes, error } = await query;

                    if (error) {
                        return getFallbackMenus();
                    }

                    // Si no hay resultados con región, intentar sin filtro de región
                    if (!recipes || recipes.length === 0) {
                        const { data: recipesNoRegion, error: error2 } = await supabase
                            .from('menus')
                            .select('*')
                            .eq('locale', userLang);
                        if (error2 || !recipesNoRegion || recipesNoRegion.length === 0) {
                            return getFallbackMenus();
                        }
                        recipes = recipesNoRegion;
                    }

                    
                    // Traducir ingredientes de cada receta
                    // Solo parsear strings → objetos, sin swap regional
                    const translatedRecipes = recipes.map(recipe => {
                        const parsedIngredients = (recipe.ingredients || []).map(ing => {
                            if (typeof ing === 'string') {
                                const match = ing.match(/^(.+?)\s+(\d+(?:\.\d+)?)(g|ml|kg|l|ud|cdta|cda|pizca|ramitas?|dientes?)$/i);
                                if (match) {
                                    const [, name, qty, unit] = match;
                                    return { ingredient: name.trim(), name: name.trim(), qty: parseFloat(qty), unit: unit };
                                }
                                return { ingredient: ing, name: ing };
                            }
                            return { ...ing, name: ing.ingredient || ing.name };
                        });
                        return { ...recipe, ingredients: parsedIngredients };
                    });

                    
                    // Organizar por SÍNTOMA (no por día)
                    const menusBySymptom = {};
                    translatedRecipes.forEach(recipe => {
                        const symptom = recipe.symptom || 'general';
                        if (!menusBySymptom[symptom]) menusBySymptom[symptom] = [];
                        menusBySymptom[symptom].push({
                            name: recipe.name,
                            meal: recipe.meal_type,
                            calories: recipe.calories,
                            protein: recipe.protein,
                            carbs: recipe.carbs,
                            fats: recipe.fats,
                            ingredients: recipe.ingredients,
                            steps: recipe.steps,
                            why: recipe.why,
                            hormonalBenefit: recipe.hormonal_benefit,
                            keyNutrients: recipe.key_nutrients || [],
                            cookingTips: recipe.cooking_tips,
                            nutrientTips: recipe.nutrient_tips || [],
                            menuFocus: recipe.menu_focus,
                            horario: recipe.recommended_time || recipe.horario,
                            whyHorario: recipe.time_reason || recipe.why_horario
                        });
                    });

                    // Log para debug

                    // Ordenar por tipo de comida (garantizar orden correcto)
                    const mealOrder = {
                        'desayuno': 1,
                        'breakfast': 1,
                        'almuerzo': 2,
                        'lunch': 2,
                        'snack': 3,
                        'cena': 4,
                        'dinner': 4
                    };

                    Object.keys(menusBySymptom).forEach(symptom => {
                        menusBySymptom[symptom].sort((a, b) => {
                            const orderA = mealOrder[a.meal?.toLowerCase()] || 999;
                            const orderB = mealOrder[b.meal?.toLowerCase()] || 999;
                            return orderA - orderB;
                        });
                    });

                    return { [userLang]: menusBySymptom };
                } catch (error) {
                    return getFallbackMenus();
                }
            };

            const getFallbackMenus = () => {
                const baseMenus = {
                    es: {
                        lunes: [
                            { 
                                name: 'Bowl de Avena que Te Cuida', 
                                meal: 'Desayuno',
                                horario: '7:00-9:00 AM',
                                whyHorario: 'Tu cortisol está alto naturalmente al despertar. Carbohidratos complejos en este momento estabilizan tu energía para todo el día sin picos de insulina.',
                                calories: 420, 
                                time: '12 min', 
                                ingredients: [
                                    { name: 'Avena integral', qty: 50, unit: 'g', why: 'Te mantendrá llena hasta el almuerzo sin picos de azúcar que te dejen sin energía a media mañana.', region: { latam: 'Avena', emea: 'Avena', usa: 'Oats' }, eco: 'Cualquier marca', gourmet: 'Avena orgánica' }, 
                                    { name: 'Leche fortificada', qty: 200, unit: 'ml', why: 'Tus huesos necesitan calcio extra ahora. Esta leche te da justo lo que piden.', region: { latam: 'Leche', emea: 'Leche', usa: 'Milk' }, eco: 'Leche de vaca', gourmet: 'Leche de almendras fortificada' }, 
                                    { name: 'Semillas de chía', qty: 15, unit: 'g', why: 'Tienen un tipo de grasa que ayuda a calmar los sofocos. Muchas mujeres notan la diferencia en días.', region: { latam: 'Chía', emea: 'Semillas de chía', usa: 'Chia seeds' }, eco: 'Semillas de lino molidas', gourmet: 'Chía orgánica' },
                                    { name: 'Frutos rojos', qty: 80, unit: 'g', why: 'Protegen tu cerebro cuando sientes esa niebla mental. Son como un escudo para tu claridad.', region: { latam: 'Frutillas o moras', emea: 'Arándanos', usa: 'Blueberries' }, eco: 'Congelados (mismos nutrientes)', gourmet: 'Frescos orgánicos' },
                                    { name: 'Frutos secos', qty: 10, unit: 'g', why: 'Te ayudan a dormir mejor por la noche. Tienen algo que tu cuerpo convierte en calma.', region: { latam: 'Maní o nueces', emea: 'Almendras', usa: 'Almonds or walnuts' }, eco: 'Cacahuetes', gourmet: 'Almendras crudas' }
                                ], 
                                steps: ['Calienta la leche 2 minutos', 'Echa la avena y remueve mientras cocina 8 minutos', 'Añade las semillas los últimos 2 minutos', 'Sirve y decora con los frutos rojos y los frutos secos por encima'], 
                                why: 'Este desayuno te da energía constante toda la mañana. El magnesio de las semillas te ayudará con los sofocos, y las grasas buenas calman la inflamación que sientes en las articulaciones.'
                            },
                            { 
                                name: 'Pescado con Todo lo que Necesitas', 
                                meal: 'Almuerzo',
                                horario: '12:00-2:00 PM', 
                                whyHorario: 'Tu digestión está en su pico. Proteína y grasas buenas ahora se absorben mejor y mantienen tu energía estable toda la tarde.',
                                calories: 540, 
                                time: '25 min', 
                                ingredients: [
                                    { name: 'Pescado graso', qty: 150, unit: 'g', why: 'Este pescado tiene las grasas que tu cuerpo dejó de producir. Calman dolores y te dan claridad mental.', region: { latam: 'Jurel o atún', emea: 'Sardinas o caballa', usa: 'Salmon or sardines' }, eco: 'Sardinas en lata (mismos beneficios)', gourmet: 'Salmón fresco' }, 
                                    { name: 'Quinoa o arroz', qty: 120, unit: 'g', why: 'Proteína completa que mantiene tus músculos fuertes. Ahora los pierdes más rápido y esto lo frena.', region: { latam: 'Quinoa (barata allí)', emea: 'Quinoa', usa: 'Quinoa' }, eco: 'Arroz integral', gourmet: 'Quinoa tricolor' },
                                    { name: 'Espinacas', qty: 100, unit: 'g', why: 'Hierro para cuando tus reglas se vuelven locas. Y vitamina K para tus huesos.', region: { latam: 'Acelga o espinaca', emea: 'Espinacas', usa: 'Spinach' }, eco: 'Espinacas congeladas', gourmet: 'Baby spinach fresca' },
                                    { name: 'Aguacate', qty: 50, unit: 'g', why: 'Grasa buena que ayuda a absorber todo lo nutritivo del plato. Un lubricante para tu cuerpo.', region: { latam: 'Palta (abundante)', emea: 'Aguacate', usa: 'Avocado' }, eco: 'Aceite de oliva (1 cda)', gourmet: 'Aguacate Hass' },
                                    { name: 'Limón', qty: 0.5, unit: 'ud', why: 'Multiplica por 3 el hierro que absorbes. Un truco simple que funciona.', region: { latam: 'Limón', emea: 'Limón', usa: 'Lemon' }, eco: 'Siempre asequible', gourmet: 'Limones orgánicos' }
                                ], 
                                steps: ['Pon a cocer la quinoa o el arroz (tarda 15 minutos)', 'Mientras, haz el pescado a la plancha 6-8 minutos por lado (o calienta las sardinas si son de lata)', 'Saltea las espinacas 3 minutos con un poco de ajo si quieres', 'Mezcla todo en el plato, añade el aguacate en trozos o el aceite, y exprime el limón por encima'], 
                                why: 'Este plato tiene TODO lo que tu cuerpo pide ahora: grasas que calman, proteína que fortalece, hierro que energiza. Es como darle a tu cuerpo exactamente lo que necesita para sentirse bien.'
                            },
                            { 
                                name: 'Lentejas que Te Abrazan', 
                                meal: 'Cena',
                                horario: '7:00-8:30 PM',
                                whyHorario: '2-3 horas antes de dormir. Tu cuerpo necesita tiempo para digerir. Proteína vegetal ligera prepara tu sueño sin pesadez.',
                                calories: 410, 
                                time: '35 min', 
                                ingredients: [
                                    { name: 'Lentejas', qty: 150, unit: 'g', why: 'Tienen algo que tu cerebro convierte en la hormona del sueño. Cena esto y dormirás mejor.', region: { latam: 'Lentejas', emea: 'Lentejas', usa: 'Lentils' }, eco: 'Lentejas secas (muy baratas)', gourmet: 'Lentejas rojas (más rápidas)' }, 
                                    { name: 'Zanahoria', qty: 100, unit: 'g', why: 'Vitamina A para tu piel y mucosas que están más secas ahora. Las hidrata desde dentro.', region: { latam: 'Zanahoria', emea: 'Zanahoria', usa: 'Carrots' }, eco: 'Siempre asequible', gourmet: 'Zanahorias baby' },
                                    { name: 'Pimiento', qty: 80, unit: 'g', why: 'Vitamina C a tope. Ayuda a que tu cuerpo aproveche todo el hierro de las lentejas.', region: { latam: 'Ají morrón', emea: 'Pimiento rojo', usa: 'Bell pepper' }, eco: 'De temporada', gourmet: 'Pimientos orgánicos' },
                                    { name: 'Cúrcuma', qty: 1, unit: 'cdta', why: 'Antiinflamatorio natural. Si te duelen las articulaciones, esto ayuda de verdad.', region: { latam: 'Cúrcuma molida', emea: 'Cúrcuma', usa: 'Turmeric' }, eco: 'Cúrcuma molida', gourmet: 'Cúrcuma fresca' },
                                    { name: 'Verduras de hoja', qty: 50, unit: 'g', why: 'Magnesio que relaja tus músculos. Te prepara para dormir profundo.', region: { latam: 'Acelga', emea: 'Espinacas', usa: 'Kale or spinach' }, eco: 'Acelga', gourmet: 'Kale orgánico' }
                                ], 
                                steps: ['Sofríe cebolla, zanahoria y pimiento unos 5 minutos hasta que huelan bien', 'Añade las lentejas, las especias y caldo o agua', 'Deja cocinar 20-35 minutos (depende del tipo de lenteja)', 'Los últimos 3 minutos echa las verduras de hoja'], 
                                why: 'Esta cena es ligera pero te llena. Tiene ingredientes que le dicen a tu cuerpo: "es hora de relajarse". El magnesio relaja, el triptófano se convierte en melatonina, y la cúrcuma calma cualquier dolor que no te deje dormir.'
                            },
                            { 
                                name: 'Snack Pre-Sueño Perfecto', 
                                meal: 'Snack',
                                horario: '9:00-10:00 PM',
                                whyHorario: '1-2 horas antes de acostarte. Calcio se absorbe mejor de noche. Triptófano necesita 60-90 min para convertirse en melatonina.',
                                calories: 280, 
                                time: '5 min', 
                                ingredients: [
                                    { name: 'Yogur natural', qty: 170, unit: 'g', why: 'Calcio que tu cuerpo absorbe mejor por la noche. Y bacterias buenas para tu digestión.', region: { latam: 'Yogur natural', emea: 'Yogur', usa: 'Plain yogurt' }, eco: 'Yogur natural básico', gourmet: 'Yogur griego 0%' }, 
                                    { name: 'Nueces', qty: 20, unit: 'g', why: 'Tienen melatonina natural. Como una pastilla para dormir, pero de verdad.', region: { latam: 'Maní o nueces', emea: 'Nueces', usa: 'Walnuts' }, eco: 'Cacahuetes', gourmet: 'Nueces de California' },
                                    { name: 'Fruta fresca', qty: 1, unit: 'ud', why: 'Algo de azúcar natural que ayuda al triptófano a llegar a tu cerebro y convertirse en sueño.', region: { latam: 'Plátano o manzana', emea: 'Kiwi', usa: 'Kiwi or apple' }, eco: 'Manzana o plátano', gourmet: 'Kiwi (tiene serotonina)' },
                                    { name: 'Semillas molidas', qty: 10, unit: 'g', why: 'Actúan como estrógenos suaves en tu cuerpo. Muchas mujeres notan menos sofocos con esto.', region: { latam: 'Lino molido', emea: 'Semillas de lino', usa: 'Ground flaxseed' }, eco: 'Lino molido en casa', gourmet: 'Mix chía + lino' }
                                ], 
                                steps: ['Pon el yogur en un bol', 'Pica las nueces y échalas', 'Corta la fruta en trozos', 'Espolvorea las semillas molidas por encima'], 
                                why: 'Come esto 1-2 horas antes de acostarte. Tiene todo para preparar tu cuerpo para un sueño profundo: calcio que se absorbe de noche, melatonina natural de las nueces, y algo dulce que calma la ansiedad nocturna.'
                            }
                        ],
                        martes: [
                            { name: 'Huevos Revueltos', meal: 'Desayuno', calories: 340, time: '10 min', ingredients: [{ name: 'Huevos', qty: 2, unit: 'piezas', why: 'Proteína completa' }], steps: ['Revuelve huevos'], why: 'Proteína pura' },
                            { name: 'Salmón al Horno', meal: 'Almuerzo', calories: 480, time: '20 min', ingredients: [{ name: 'Salmón', qty: 200, unit: 'g', why: 'Omega-3' }], steps: ['Hornea salmón'], why: 'Reduce inflamación' },
                            { name: 'Tofu a la Plancha', meal: 'Cena', calories: 320, time: '15 min', ingredients: [{ name: 'Tofu firme', qty: 250, unit: 'g', why: 'Proteína vegetal' }], steps: ['Sofríe tofu'], why: 'Opción vegana' },
                            { name: 'Batido Verde', meal: 'Snack', calories: 200, time: '5 min', ingredients: [{ name: 'Espinacas', qty: 50, unit: 'g', why: 'Minerales' }], steps: ['Licúa'], why: 'Snack refrescante' }
                        ],
                        miercoles: [
                            { name: 'Granola Casera', meal: 'Desayuno', calories: 380, time: '10 min', ingredients: [{ name: 'Granola', qty: 50, unit: 'g', why: 'Fibra' }], steps: ['Sirve'], why: 'Desayuno cómodo' },
                            { name: 'Pavo con Boniato', meal: 'Almuerzo', calories: 460, time: '25 min', ingredients: [{ name: 'Pechuga pavo', qty: 250, unit: 'g', why: 'Proteína magra' }], steps: ['Cocina'], why: 'Comida completa' },
                            { name: 'Garbanzos al Horno', meal: 'Cena', calories: 360, time: '20 min', ingredients: [{ name: 'Garbanzos cocidos', qty: 250, unit: 'g', why: 'Proteína vegetal' }], steps: ['Hornea'], why: 'Cena vegetariana' },
                            { name: 'Frutos Secos', meal: 'Snack', calories: 220, time: '2 min', ingredients: [{ name: 'Almendras', qty: 30, unit: 'g', why: 'Proteína' }], steps: ['Sirve'], why: 'Snack energético' }
                        ],
                        jueves: [
                            { name: 'Pudding de Chía', meal: 'Desayuno', calories: 320, time: '8 min', ingredients: [{ name: 'Semillas chía', qty: 30, unit: 'g', why: 'Omega-3' }], steps: ['Mezcla'], why: 'Desayuno que hidrata' },
                            { name: 'Atún a la Plancha', meal: 'Almuerzo', calories: 500, time: '15 min', ingredients: [{ name: 'Filete atún', qty: 200, unit: 'g', why: 'Omega-3' }], steps: ['Asa atún'], why: 'Pescado azul' },
                            { name: 'Pollo al Horno', meal: 'Cena', calories: 400, time: '30 min', ingredients: [{ name: 'Muslo pollo', qty: 250, unit: 'g', why: 'Proteína' }], steps: ['Hornea'], why: 'Cena reconfortante' },
                            { name: 'Manzana con Almendras', meal: 'Snack', calories: 200, time: '3 min', ingredients: [{ name: 'Manzana', qty: 1, unit: 'pieza', why: 'Fibra' }], steps: ['Sirve'], why: 'Snack dulce' }
                        ],
                        viernes: [
                            { name: 'Panqueques Integrales', meal: 'Desayuno', calories: 400, time: '20 min', ingredients: [{ name: 'Harina integral', qty: 100, unit: 'g', why: 'Fibra' }], steps: ['Cocina'], why: 'Desayuno festivo' },
                            { name: 'Merluza a la Sal', meal: 'Almuerzo', calories: 420, time: '25 min', ingredients: [{ name: 'Filete merluza', qty: 250, unit: 'g', why: 'Proteína magra' }], steps: ['Hornea'], why: 'Pescado blanco' },
                            { name: 'Pasta de Verdura', meal: 'Cena', calories: 380, time: '20 min', ingredients: [{ name: 'Pasta integral', qty: 150, unit: 'g', why: 'Fibra' }], steps: ['Cuece'], why: 'Clásico italiano' },
                            { name: 'Chocolate Oscuro', meal: 'Snack', calories: 200, time: '2 min', ingredients: [{ name: 'Chocolate 85%', qty: 30, unit: 'g', why: 'Antioxidantes' }], steps: ['Sirve'], why: 'Snack gourmet' }
                        ],
                        sabado: [
                            { name: 'Brunch Completo', meal: 'Desayuno', calories: 450, time: '25 min', ingredients: [{ name: 'Huevos', qty: 2, unit: 'piezas', why: 'Proteína' }], steps: ['Fríe'], why: 'Brunch italiano' },
                            { name: 'Carne Magra', meal: 'Almuerzo', calories: 520, time: '20 min', ingredients: [{ name: 'Carne magra', qty: 250, unit: 'g', why: 'Proteína' }], steps: ['Asa'], why: 'Proteína fuerte' },
                            { name: 'Ratatouille', meal: 'Cena', calories: 300, time: '30 min', ingredients: [{ name: 'Verduras variadas', qty: 400, unit: 'g', why: 'Vitaminas' }], steps: ['Sofríe'], why: 'Cena francesa' },
                            { name: 'Té con Galletas', meal: 'Snack', calories: 180, time: '5 min', ingredients: [{ name: 'Té verde', qty: 250, unit: 'ml', why: 'Antioxidantes' }], steps: ['Prepara'], why: 'Merienda acogedora' }
                        ],
                        domingo: [
                            { name: 'Smoothie Bowl', meal: 'Desayuno', calories: 420, time: '10 min', ingredients: [{ name: 'Arándanos', qty: 100, unit: 'g', why: 'Antioxidantes' }], steps: ['Mezcla'], why: 'Desayuno festivo' },
                            { name: 'Pollo Asado', meal: 'Almuerzo', calories: 500, time: '40 min', ingredients: [{ name: 'Pollo entero', qty: 400, unit: 'g', why: 'Proteína' }], steps: ['Asa'], why: 'Almuerzo abundante' },
                            { name: 'Ceviche Vegetal', meal: 'Cena', calories: 320, time: '20 min', ingredients: [{ name: 'Palmitos', qty: 200, unit: 'g', why: 'Proteína vegetal' }], steps: ['Mezcla'], why: 'Cena sofisticada' },
                            { name: 'Frutas de Temporada', meal: 'Snack', calories: 150, time: '5 min', ingredients: [{ name: 'Frutas variadas', qty: 300, unit: 'g', why: 'Vitaminas' }], steps: ['Sirve'], why: 'Snack natural' }
                        ]
                    },
                    en: {
                        lunes: [
                            { 
                                name: 'Oatmeal Bowl That Cares for You', 
                                meal: 'Breakfast',
                                horario: '7:00-9:00 AM',
                                whyHorario: 'Your cortisol is naturally high when you wake up. Complex carbs at this time stabilize your energy for the whole day without insulin spikes.',
                                calories: 420, 
                                time: '12 min', 
                                ingredients: [
                                    { name: 'Whole oats', qty: 50, unit: 'g', why: 'Will keep you full until lunch without sugar crashes that leave you drained mid-morning.', region: { latam: 'Avena', emea: 'Oats', usa: 'Oats' }, eco: 'Any brand', gourmet: 'Organic oats' }, 
                                    { name: 'Fortified milk', qty: 200, unit: 'ml', why: 'Your bones need extra calcium now. This milk gives you exactly what they ask for.', region: { latam: 'Leche', emea: 'Milk', usa: 'Milk' }, eco: 'Cow milk', gourmet: 'Fortified almond milk' }, 
                                    { name: 'Chia seeds', qty: 15, unit: 'g', why: 'They have a type of fat that helps calm hot flashes. Many women notice the difference in days.', region: { latam: 'Chía', emea: 'Chia seeds', usa: 'Chia seeds' }, eco: 'Ground flax seeds', gourmet: 'Organic chia' },
                                    { name: 'Berries', qty: 80, unit: 'g', why: 'They protect your brain when you feel that mental fog. They\'re like a shield for your clarity.', region: { latam: 'Frutillas o moras', emea: 'Blueberries', usa: 'Blueberries' }, eco: 'Frozen (same nutrients)', gourmet: 'Fresh organic' },
                                    { name: 'Nuts', qty: 10, unit: 'g', why: 'Help you sleep better at night. They have something your body converts into calm.', region: { latam: 'Maní o nueces', emea: 'Almonds', usa: 'Almonds or walnuts' }, eco: 'Peanuts', gourmet: 'Raw almonds' }
                                ], 
                                steps: ['Heat the milk for 2 minutes', 'Add the oats and stir while cooking for 8 minutes', 'Add the seeds in the last 2 minutes', 'Serve and top with berries and nuts'], 
                                why: 'This breakfast gives you steady energy all morning. The magnesium from the seeds will help with hot flashes, and the good fats calm the inflammation you feel in your joints.'
                            },
                            { 
                                name: 'Fish with Everything You Need', 
                                meal: 'Lunch',
                                horario: '12:00-2:00 PM', 
                                whyHorario: 'Your digestion is at its peak. Protein and good fats are better absorbed now and keep your energy stable all afternoon.',
                                calories: 540, 
                                time: '25 min', 
                                ingredients: [
                                    { name: 'Fatty fish', qty: 150, unit: 'g', why: 'This fish has the fats your body stopped producing. They calm pain and give you mental clarity.', region: { latam: 'Jurel o atún', emea: 'Sardines or mackerel', usa: 'Salmon or sardines' }, eco: 'Canned sardines (same benefits)', gourmet: 'Fresh salmon' }, 
                                    { name: 'Quinoa or rice', qty: 120, unit: 'g', why: 'Complete protein that keeps your muscles strong. Now you lose them faster and this slows it down.', region: { latam: 'Quinoa (cheap there)', emea: 'Quinoa', usa: 'Quinoa' }, eco: 'Brown rice', gourmet: 'Tricolor quinoa' },
                                    { name: 'Spinach', qty: 100, unit: 'g', why: 'Iron for when your periods go crazy. And vitamin K for your bones.', region: { latam: 'Acelga o espinaca', emea: 'Spinach', usa: 'Spinach' }, eco: 'Frozen spinach', gourmet: 'Fresh baby spinach' },
                                    { name: 'Avocado', qty: 50, unit: 'g', why: 'Good fat that helps absorb all the nutrients from the dish. A lubricant for your body.', region: { latam: 'Palta (abundant)', emea: 'Avocado', usa: 'Avocado' }, eco: 'Olive oil (1 tbsp)', gourmet: 'Hass avocado' },
                                    { name: 'Lemon', qty: 0.5, unit: 'pc', why: 'Multiplies by 3 the iron you absorb. A simple trick that works.', region: { latam: 'Limón', emea: 'Lemon', usa: 'Lemon' }, eco: 'Always affordable', gourmet: 'Organic lemons' }
                                ], 
                                steps: ['Cook the quinoa or rice (takes 15 minutes)', 'Meanwhile, grill the fish for 6-8 minutes per side (or heat the sardines if canned)', 'Sauté the spinach for 3 minutes with some garlic if you like', 'Mix everything on the plate, add the avocado in chunks or the oil, and squeeze the lemon on top'], 
                                why: 'This dish has EVERYTHING your body asks for now: fats that calm, protein that strengthens, iron that energizes. It\'s like giving your body exactly what it needs to feel good.'
                            },
                            { 
                                name: 'Lentils That Hug You', 
                                meal: 'Dinner',
                                horario: '7:00-8:30 PM',
                                whyHorario: '2-3 hours before bed. Your body needs time to digest. Light plant protein prepares your sleep without heaviness.',
                                calories: 410, 
                                time: '35 min', 
                                ingredients: [
                                    { name: 'Lentils', qty: 150, unit: 'g', why: 'They have something your brain converts into the sleep hormone. Eat this for dinner and you\'ll sleep better.', region: { latam: 'Lentejas', emea: 'Lentils', usa: 'Lentils' }, eco: 'Dry lentils (very cheap)', gourmet: 'Red lentils (faster)' }, 
                                    { name: 'Carrot', qty: 100, unit: 'g', why: 'Vitamin A for your skin and mucous membranes that are drier now. It hydrates them from within.', region: { latam: 'Zanahoria', emea: 'Carrot', usa: 'Carrots' }, eco: 'Always affordable', gourmet: 'Baby carrots' },
                                    { name: 'Bell pepper', qty: 80, unit: 'g', why: 'Lots of vitamin C. Helps your body take advantage of all the iron from the lentils.', region: { latam: 'Ají morrón', emea: 'Red pepper', usa: 'Bell pepper' }, eco: 'In season', gourmet: 'Organic peppers' },
                                    { name: 'Turmeric', qty: 1, unit: 'tsp', why: 'Natural anti-inflammatory. If your joints hurt, this really helps.', region: { latam: 'Cúrcuma molida', emea: 'Turmeric', usa: 'Turmeric' }, eco: 'Ground turmeric', gourmet: 'Fresh turmeric' },
                                    { name: 'Leafy greens', qty: 50, unit: 'g', why: 'Magnesium that relaxes your muscles. Prepares you for deep sleep.', region: { latam: 'Acelga', emea: 'Spinach', usa: 'Kale or spinach' }, eco: 'Chard', gourmet: 'Organic kale' }
                                ], 
                                steps: ['Sauté onion, carrot and pepper for about 5 minutes until they smell good', 'Add the lentils, spices and broth or water', 'Let cook for 20-35 minutes (depends on the type of lentil)', 'Add the leafy greens in the last 3 minutes'], 
                                why: 'This dinner is light but filling. It has ingredients that tell your body: "it\'s time to relax". Magnesium relaxes, tryptophan converts to melatonin, and turmeric calms any pain that won\'t let you sleep.'
                            },
                            { 
                                name: 'Perfect Pre-Sleep Snack', 
                                meal: 'Snack',
                                horario: '9:00-10:00 PM',
                                whyHorario: '1-2 hours before bed. Calcium is better absorbed at night. Tryptophan needs 60-90 min to convert to melatonin.',
                                calories: 280, 
                                time: '5 min', 
                                ingredients: [
                                    { name: 'Plain yogurt', qty: 170, unit: 'g', why: 'Calcium that your body absorbs better at night. And good bacteria for your digestion.', region: { latam: 'Yogur natural', emea: 'Yogurt', usa: 'Plain yogurt' }, eco: 'Basic plain yogurt', gourmet: 'Greek yogurt 0%' }, 
                                    { name: 'Walnuts', qty: 20, unit: 'g', why: 'They have natural melatonin. Like a sleeping pill, but real.', region: { latam: 'Maní o nueces', emea: 'Walnuts', usa: 'Walnuts' }, eco: 'Peanuts', gourmet: 'California walnuts' },
                                    { name: 'Fresh fruit', qty: 1, unit: 'pc', why: 'Some natural sugar that helps tryptophan reach your brain and convert into sleep.', region: { latam: 'Plátano o manzana', emea: 'Kiwi', usa: 'Kiwi or apple' }, eco: 'Apple or banana', gourmet: 'Kiwi (has serotonin)' },
                                    { name: 'Ground seeds', qty: 10, unit: 'g', why: 'They act like gentle estrogens in your body. Many women notice fewer hot flashes with this.', region: { latam: 'Lino molido', emea: 'Flax seeds', usa: 'Ground flaxseed' }, eco: 'Flax ground at home', gourmet: 'Chia + flax mix' }
                                ], 
                                steps: ['Put the yogurt in a bowl', 'Chop the walnuts and add them', 'Cut the fruit into pieces', 'Sprinkle the ground seeds on top'], 
                                why: 'Eat this 1-2 hours before bed. It has everything to prepare your body for deep sleep: calcium absorbed at night, natural melatonin from walnuts, and something sweet that calms nighttime anxiety.'
                            }
                        ],
                        martes: [
                            { name: 'Scrambled Eggs', meal: 'Breakfast', calories: 340, time: '10 min', ingredients: [{ name: 'Eggs', qty: 2, unit: 'pcs', why: 'Complete protein', region: { latam: 'Huevos', emea: 'Eggs', usa: 'Eggs' } }], steps: ['Scramble eggs'], why: 'Pure protein' },
                            { name: 'Baked Salmon', meal: 'Lunch', calories: 480, time: '20 min', ingredients: [{ name: 'Salmon', qty: 200, unit: 'g', why: 'Omega-3', region: { latam: 'Salmón', emea: 'Salmon', usa: 'Salmon' } }], steps: ['Bake salmon'], why: 'Reduces inflammation' },
                            { name: 'Grilled Tofu', meal: 'Dinner', calories: 320, time: '15 min', ingredients: [{ name: 'Firm tofu', qty: 250, unit: 'g', why: 'Plant protein', region: { latam: 'Tofu', emea: 'Tofu', usa: 'Tofu' } }], steps: ['Sauté tofu'], why: 'Vegan option' },
                            { name: 'Green Smoothie', meal: 'Snack', calories: 200, time: '5 min', ingredients: [{ name: 'Spinach', qty: 50, unit: 'g', why: 'Minerals', region: { latam: 'Espinacas', emea: 'Spinach', usa: 'Spinach' } }], steps: ['Blend'], why: 'Refreshing snack' }
                        ],
                        miercoles: [
                            { name: 'Homemade Granola', meal: 'Breakfast', calories: 380, time: '10 min', ingredients: [{ name: 'Granola', qty: 50, unit: 'g', why: 'Fiber', region: { latam: 'Granola', emea: 'Granola', usa: 'Granola' } }], steps: ['Serve'], why: 'Convenient breakfast' },
                            { name: 'Turkey with Sweet Potato', meal: 'Lunch', calories: 460, time: '25 min', ingredients: [{ name: 'Turkey breast', qty: 250, unit: 'g', why: 'Lean protein', region: { latam: 'Pavo', emea: 'Turkey', usa: 'Turkey' } }], steps: ['Cook'], why: 'Complete meal' },
                            { name: 'Roasted Chickpeas', meal: 'Dinner', calories: 360, time: '20 min', ingredients: [{ name: 'Cooked chickpeas', qty: 250, unit: 'g', why: 'Plant protein', region: { latam: 'Garbanzos', emea: 'Chickpeas', usa: 'Chickpeas' } }], steps: ['Roast'], why: 'Vegetarian dinner' },
                            { name: 'Mixed Nuts', meal: 'Snack', calories: 220, time: '2 min', ingredients: [{ name: 'Almonds', qty: 30, unit: 'g', why: 'Protein', region: { latam: 'Almendras', emea: 'Almonds', usa: 'Almonds' } }], steps: ['Serve'], why: 'Energetic snack' }
                        ],
                        jueves: [
                            { name: 'Chia Pudding', meal: 'Breakfast', calories: 320, time: '8 min', ingredients: [{ name: 'Chia seeds', qty: 30, unit: 'g', why: 'Omega-3', region: { latam: 'Chía', emea: 'Chia', usa: 'Chia' } }], steps: ['Mix'], why: 'Hydrating breakfast' },
                            { name: 'Grilled Tuna', meal: 'Lunch', calories: 500, time: '15 min', ingredients: [{ name: 'Tuna fillet', qty: 200, unit: 'g', why: 'Omega-3', region: { latam: 'Atún', emea: 'Tuna', usa: 'Tuna' } }], steps: ['Grill tuna'], why: 'Blue fish' },
                            { name: 'Baked Chicken', meal: 'Dinner', calories: 400, time: '30 min', ingredients: [{ name: 'Chicken thigh', qty: 250, unit: 'g', why: 'Protein', region: { latam: 'Pollo', emea: 'Chicken', usa: 'Chicken' } }], steps: ['Bake'], why: 'Comforting dinner' },
                            { name: 'Apple with Almonds', meal: 'Snack', calories: 200, time: '3 min', ingredients: [{ name: 'Apple', qty: 1, unit: 'pc', why: 'Fiber', region: { latam: 'Manzana', emea: 'Apple', usa: 'Apple' } }], steps: ['Serve'], why: 'Sweet snack' }
                        ],
                        viernes: [
                            { name: 'Whole Wheat Pancakes', meal: 'Breakfast', calories: 400, time: '20 min', ingredients: [{ name: 'Whole wheat flour', qty: 100, unit: 'g', why: 'Fiber', region: { latam: 'Harina integral', emea: 'Flour', usa: 'Flour' } }], steps: ['Cook'], why: 'Festive breakfast' },
                            { name: 'Salt-baked Hake', meal: 'Lunch', calories: 420, time: '25 min', ingredients: [{ name: 'Hake fillet', qty: 250, unit: 'g', why: 'Lean protein', region: { latam: 'Merluza', emea: 'Hake', usa: 'Hake' } }], steps: ['Bake'], why: 'White fish' },
                            { name: 'Vegetable Pasta', meal: 'Dinner', calories: 380, time: '20 min', ingredients: [{ name: 'Whole wheat pasta', qty: 150, unit: 'g', why: 'Fiber', region: { latam: 'Pasta', emea: 'Pasta', usa: 'Pasta' } }], steps: ['Cook'], why: 'Italian classic' },
                            { name: 'Dark Chocolate', meal: 'Snack', calories: 200, time: '2 min', ingredients: [{ name: 'Dark chocolate 85%', qty: 30, unit: 'g', why: 'Antioxidants', region: { latam: 'Chocolate', emea: 'Chocolate', usa: 'Chocolate' } }], steps: ['Serve'], why: 'Gourmet snack' }
                        ],
                        sabado: [
                            { name: 'Complete Brunch', meal: 'Breakfast', calories: 450, time: '25 min', ingredients: [{ name: 'Eggs', qty: 2, unit: 'pcs', why: 'Protein', region: { latam: 'Huevos', emea: 'Eggs', usa: 'Eggs' } }], steps: ['Fry'], why: 'Italian brunch' },
                            { name: 'Lean Meat', meal: 'Lunch', calories: 520, time: '20 min', ingredients: [{ name: 'Lean meat', qty: 250, unit: 'g', why: 'Protein', region: { latam: 'Carne', emea: 'Meat', usa: 'Meat' } }], steps: ['Grill'], why: 'Strong protein' },
                            { name: 'Ratatouille', meal: 'Dinner', calories: 300, time: '30 min', ingredients: [{ name: 'Mixed vegetables', qty: 400, unit: 'g', why: 'Vitamins', region: { latam: 'Verduras', emea: 'Vegetables', usa: 'Vegetables' } }], steps: ['Sauté'], why: 'French dinner' },
                            { name: 'Tea with Cookies', meal: 'Snack', calories: 180, time: '5 min', ingredients: [{ name: 'Green tea', qty: 250, unit: 'ml', why: 'Antioxidants', region: { latam: 'Té', emea: 'Tea', usa: 'Tea' } }], steps: ['Prepare'], why: 'Cozy afternoon' }
                        ],
                        domingo: [
                            { name: 'Smoothie Bowl', meal: 'Breakfast', calories: 420, time: '10 min', ingredients: [{ name: 'Blueberries', qty: 100, unit: 'g', why: 'Antioxidants', region: { latam: 'Arándanos', emea: 'Blueberries', usa: 'Blueberries' } }], steps: ['Mix'], why: 'Festive breakfast' },
                            { name: 'Roast Chicken', meal: 'Lunch', calories: 500, time: '40 min', ingredients: [{ name: 'Whole chicken', qty: 400, unit: 'g', why: 'Protein', region: { latam: 'Pollo', emea: 'Chicken', usa: 'Chicken' } }], steps: ['Roast'], why: 'Abundant lunch' },
                            { name: 'Vegetable Ceviche', meal: 'Dinner', calories: 320, time: '20 min', ingredients: [{ name: 'Hearts of palm', qty: 200, unit: 'g', why: 'Plant protein', region: { latam: 'Palmitos', emea: 'Palm hearts', usa: 'Hearts of palm' } }], steps: ['Mix'], why: 'Sophisticated dinner' },
                            { name: 'Seasonal Fruits', meal: 'Snack', calories: 150, time: '5 min', ingredients: [{ name: 'Mixed fruits', qty: 300, unit: 'g', why: 'Vitamins', region: { latam: 'Frutas', emea: 'Fruits', usa: 'Fruits' } }], steps: ['Serve'], why: 'Natural snack' }
                        ]
                    }
                };

                // ✅ PERSONALIZACIÓN SEGÚN NIVEL
                if (!currentUser) return baseMenus;

                const personalizedMenusES = {};
                const personalizedMenusEN = {};
                const userRegionKey = (currentUser?.region || 'latam').toLowerCase();

                // Detectar síntoma dominante (solo trial/premium)
                let dominantSymptom = null;
                if ((tier === 'trial' || tier === 'premium') && symptoms && symptoms.length > 0) {
                    const recent = symptoms.slice(-3);
                    const scores = {};
                    recent.forEach(s => {
                        // Síntomas directos del objeto
                        ['sleep','energy','mood','hotFlashes','anxiety','brainFog'].forEach(k => {
                            if (s[k] !== undefined) {
                                const label = { sleep: 'Insomnio', energy: 'Fatiga', mood: 'Cambios de Humor', hotFlashes: 'Sofocos', anxiety: 'Ansiedad', brainFog: 'Niebla Mental' }[k];
                                if (!scores[label]) scores[label] = [];
                                // Invertir sueño y energía: bajo = peor
                                const val = (k === 'sleep' || k === 'energy') ? (10 - (s[k] || 0)) : (s[k] || 0);
                                scores[label].push(val);
                            }
                        });
                        // Síntomas del objeto symptoms nested
                        Object.keys(s.symptoms || {}).forEach(sym => {
                            if (!scores[sym]) scores[sym] = [];
                            scores[sym].push(s.symptoms[sym] || 0);
                        });
                    });
                    let maxAvg = 0;
                    Object.keys(scores).forEach(sym => {
                        const avg = scores[sym].reduce((a,b) => a+b, 0) / scores[sym].length;
                        if (avg > maxAvg) { maxAvg = avg; dominantSymptom = sym; }
                    });
                    if (maxAvg < 4) dominantSymptom = null;
                }

                // Personalizar para ESPAÑOL
                for (const [day, recipes] of Object.entries(baseMenus.es)) {
                    personalizedMenusES[day] = recipes.map(recipe => {

                        // 1. Usar nombre neutro del ingrediente (sin swap regional)
                        let regionalIngredients = recipe.ingredients.map(ing => ing);

                        // 2. FREE → sin personalización
                        if (tier === 'free') {
                            return { ...recipe, ingredients: regionalIngredients };
                        }

                        // 3. TRIAL / PREMIUM → restricciones dietéticas
                        regionalIngredients = regionalIngredients
                            .map(ing => applyDietaryRestrictions(ing, parseHealthConditions(currentUser.health_conditions)))
                            .filter(ing => ing !== null);

                        let finalRecipe = { ...recipe, ingredients: regionalIngredients };

                        // 4. TRIAL / PREMIUM → ajuste de calorías por TDEE
                        if (currentUser.tdee) {
                            finalRecipe = adjustCaloriesForUser(finalRecipe, currentUser.tdee);
                        }

                        // 5. TRIAL / PREMIUM → etiquetar síntoma dominante
                        if (dominantSymptom) {
                            finalRecipe.symptomFocus = dominantSymptom;
                            finalRecipe.personalized = true;
                        }

                        return finalRecipe;
                    });
                }

                // Personalizar para INGLÉS
                for (const [day, recipes] of Object.entries(baseMenus.en)) {
                    personalizedMenusEN[day] = recipes.map(recipe => {

                        // 1. Usar nombre neutro del ingrediente (sin swap regional)
                        let regionalIngredients = recipe.ingredients.map(ing => ing);

                        // 2. FREE → sin personalización
                        if (tier === 'free') {
                            return { ...recipe, ingredients: regionalIngredients };
                        }

                        // 3. TRIAL / PREMIUM → restricciones dietéticas
                        regionalIngredients = regionalIngredients
                            .map(ing => applyDietaryRestrictions(ing, parseHealthConditions(currentUser.health_conditions)))
                            .filter(ing => ing !== null);

                        let finalRecipe = { ...recipe, ingredients: regionalIngredients };

                        // 4. TRIAL / PREMIUM → ajuste de calorías por TDEE
                        if (currentUser.tdee) {
                            finalRecipe = adjustCaloriesForUser(finalRecipe, currentUser.tdee);
                        }

                        // 5. TRIAL / PREMIUM → etiquetar síntoma dominante
                        if (dominantSymptom) {
                            finalRecipe.symptomFocus = dominantSymptom;
                            finalRecipe.personalized = true;
                        }

                        return finalRecipe;
                    });
                }

                return {
                    es: personalizedMenusES,
                    en: personalizedMenusEN
                };
            }; // Fin de getFallbackMenus

            // Sincronizar userRegion con el perfil cuando se carga
            useEffect(() => {
                if (currentUser?.region) {
                    setUserRegion(currentUser.region.toLowerCase());
                }
            }, [currentUser]);

            // Cargar menús al inicio y cuando cambie región
            // Carga AMBOS idiomas para que el cambio de idioma sea instantáneo
            useEffect(() => {
                const loadMenusBothLangs = async () => {
                    if (!currentUser) return;
                    setMenusLoading(true);

                    // Cargar ambos idiomas en paralelo
                    const originalLang = language;

                    // Guardar idioma actual temporalmente para no cambiar UI
                    const [esMenus, enMenus] = await Promise.all([
                        getWeekMenusForLang('es'),
                        getWeekMenusForLang('en')
                    ]);

                    setMenus({ 
                        es: esMenus?.es || {}, 
                        en: enMenus?.en || {} 
                    });
                    setMenusLoading(false);
                };
                if (currentUser) {
                    loadMenusBothLangs();
                }
            }, [userRegion, currentUser]);

            // EJERCICIOS
            const getExercises = () => {
                const allExercises = {
                    strength: [
                        { 
                            name: 'Sentadillas', 
                            duration: '20 min', 
                            difficulty: 'Moderada', 
                            freq: '3x semana', 
                            day: language === 'es' ? 'Lunes' : 'Monday', 
                            why: language === 'es' ? 'Aumenta densidad ósea (1-3% anual). Previene osteoporosis crucial en esta etapa.' : 'Increases bone density (1-3% per year). Prevents osteoporosis critical at this stage.', 
                            science: language === 'es' ? 'Ejercicio de resistencia aumenta masa ósea más que cardio. Pierdes 1% óseo anual sin ejercicio.' : 'Resistance exercise increases bone mass more than cardio. You lose 1% bone annually without exercise.',
                            steps: language === 'es' ? [
                                'Pies separados ancho de hombros, dedos ligeramente hacia afuera',
                                'Mantén espalda recta, pecho hacia afuera, brazos adelante para equilibrio',
                                'Baja doblando rodillas y caderas como si te sentaras (3 segundos)',
                                'Baja hasta muslos paralelos al suelo, rodillas NO pasan dedos pies',
                                'Sube empujando con talones, apretando glúteos (2 segundos)',
                                'Haz 3 series x 10-15 repeticiones, descansa 60 seg entre series',
                                'Si te cuesta: Pon silla detrás, baja hasta tocarla sin sentarte',
                                'Equipo: NINGUNO (peso corporal)'
                            ] : [
                                'Feet shoulder-width apart, toes slightly outward',
                                'Keep back straight, chest out, arms forward for balance',
                                'Lower by bending knees and hips like sitting in chair (3 seconds)',
                                'Lower until thighs parallel to ground, knees DON\'T pass toes',
                                'Rise pushing through heels, squeezing glutes (2 seconds)',
                                'Do 3 sets x 10-15 reps, rest 60 sec between sets',
                                'If difficult: Put chair behind, lower until touching without sitting',
                                'Equipment: NONE (bodyweight)'
                            ]
                        },
                        { 
                            name: language === 'es' ? 'Flexiones en Pared' : 'Wall Push-ups', 
                            duration: '15 min', 
                            difficulty: language === 'es' ? 'Fácil-Moderada' : 'Easy-Moderate', 
                            freq: '2x semana', 
                            day: language === 'es' ? 'Miércoles' : 'Wednesday', 
                            why: language === 'es' ? 'Fortalece pecho, brazos y core. Mejora postura sin impacto en muñecas.' : 'Strengthens chest, arms and core. Improves posture without wrist impact.', 
                            science: language === 'es' ? 'Pérdida de estrógeno causa pérdida de 0.5-1% muscular anual. Ejercicio de resistencia ralentiza esto.' : 'Estrogen loss causes 0.5-1% muscle loss annually. Resistance exercise slows this.',
                            steps: language === 'es' ? [
                                'Párate frente a pared, distancia 60-80cm',
                                'Manos en pared altura hombros, separadas ancho hombros',
                                'Cuerpo forma línea recta desde cabeza a talones, abdomen tenso',
                                'Baja pecho hacia pared doblando codos (3 segundos)',
                                'Codos a 45° del cuerpo, nariz casi toca pared',
                                'Empuja para volver arriba sin bloquear codos (2 segundos)',
                                'Haz 3 series x 10-15 repeticiones, descansa 60 seg',
                                'Progresión: Semana 3-4 usa mesa más baja, semana 5+ banco',
                                'Equipo: Solo pared'
                            ] : [
                                'Stand facing wall, 60-80cm away',
                                'Hands on wall shoulder height, shoulder-width apart',
                                'Body forms straight line head to heels, abs tight',
                                'Lower chest to wall bending elbows (3 seconds)',
                                'Elbows 45° from body, nose almost touches wall',
                                'Push back up without locking elbows (2 seconds)',
                                'Do 3 sets x 10-15 reps, rest 60 sec',
                                'Progression: Week 3-4 use lower table, week 5+ bench',
                                'Equipment: Just wall'
                            ]
                        },
                        { 
                            name: language === 'es' ? 'Levantamiento de Mancuernas' : 'Dumbbell Lifting', 
                            duration: '25 min', 
                            difficulty: 'Moderada', 
                            freq: '3x semana', 
                            day: language === 'es' ? 'Viernes' : 'Friday', 
                            why: language === 'es' ? 'Incrementa fuerza y masa muscular. Acelera metabolismo 5-7%.' : 'Increases strength and muscle mass. Accelerates metabolism 5-7%.', 
                            science: language === 'es' ? 'Cada kg de músculo quema 6 calorías en reposo. Es tu aliado metabólico en esta etapa.' : 'Each kg of muscle burns 6 calories at rest. It\'s your metabolism ally at this stage.',
                            steps: language === 'es' ? [
                                'Pies separados ancho hombros, rodillas ligeramente flexionadas',
                                'Mancuernas a los lados, palmas hacia cuerpo (2-5kg para empezar)',
                                'Levanta brazos laterales hasta altura hombros formando T',
                                'Mantén codos ligeramente flexionados, no uses impulso del cuerpo',
                                'Baja controlado en 3 segundos',
                                'Haz 3 series x 10-12 repeticiones, descansa 60 seg',
                                'NO subas más arriba de hombros, NO balancees cuerpo',
                                'Alternativa SIN mancuernas: Usa botellas de agua 1L',
                                'Equipo: Mancuernas 2-5kg O botellas de agua'
                            ] : [
                                'Feet shoulder-width, knees slightly bent',
                                'Dumbbells at sides, palms facing body (4-10lbs to start)',
                                'Lift arms laterally to shoulder height forming T',
                                'Keep elbows slightly bent, don\'t use body momentum',
                                'Lower controlled in 3 seconds',
                                'Do 3 sets x 10-12 reps, rest 60 sec',
                                'DON\'T raise above shoulders, DON\'T swing body',
                                'Alternative WITHOUT dumbbells: Use 1L water bottles',
                                'Equipment: 4-10lb dumbbells OR water bottles'
                            ]
                        },
                        { 
                            name: language === 'es' ? 'Planchas Abdominales' : 'Planks', 
                            duration: '10 min', 
                            difficulty: 'Moderada', 
                            freq: '3x semana', 
                            day: language === 'es' ? 'Martes' : 'Tuesday', 
                            why: language === 'es' ? 'Fortalece core. Mejora estabilidad y postura.' : 'Strengthens core. Improves stability and posture.', 
                            science: language === 'es' ? 'Core fuerte previene caídas (comunes en mujeres 40-55) y reduce dolor de espalda 60%.' : 'Strong core prevents falls (common in 40-55 year old women) and reduces back pain 60%.',
                            steps: language === 'es' ? [
                                'Posición inicial: Apoya antebrazos en el suelo, codos bajo hombros',
                                'Extiende piernas atrás, apoyada en puntas de pies',
                                'Forma línea recta desde cabeza a talones (NO hundas caderas)',
                                'Activa abdomen como si te fueran a golpear, aprieta glúteos',
                                'Mantén la posición: Principiante 20-30 seg, Intermedio 45-60 seg',
                                'Descansa 30-60 seg entre series',
                                'Haz 3-4 series totales',
                                'Variante más fácil: Apoya rodillas en suelo en vez de pies',
                                'Equipo: Solo colchoneta'
                            ] : [
                                'Starting position: Support on forearms, elbows under shoulders',
                                'Extend legs back, supported on toes',
                                'Form straight line from head to heels (DON\'T sag hips)',
                                'Engage abs as if about to be punched, squeeze glutes',
                                'Hold position: Beginner 20-30 sec, Intermediate 45-60 sec',
                                'Rest 30-60 sec between sets',
                                'Do 3-4 total sets',
                                'Easier variant: Support knees on floor instead of feet',
                                'Equipment: Just mat'
                            ]
                        },
                        { 
                            name: language === 'es' ? 'Desplantes' : 'Lunges', 
                            duration: '20 min', 
                            difficulty: 'Moderada', 
                            freq: '2x semana', 
                            day: language === 'es' ? 'Jueves' : 'Thursday', 
                            why: language === 'es' ? 'Trabaja piernas y equilibrio. Funcional para vida diaria.' : 'Works legs and balance. Functional for daily life.', 
                            science: language === 'es' ? 'Mejora propiocepción. Previene lesiones por caídas que son 3x más frecuentes en esta etapa.' : 'Improves proprioception. Prevents fall injuries which are 3x more frequent at this stage.',
                            steps: language === 'es' ? [
                                'Párate derecha, pies ancho de caderas',
                                'Da un paso largo adelante con pierna derecha',
                                'Baja cadera hasta rodilla trasera casi toca suelo',
                                'Rodilla delantera a 90°, NO pasa dedos pie',
                                'Empuja con talón delantero para volver arriba',
                                'Alterna piernas o haz todas de un lado primero',
                                'Haz 3 series x 10-12 repeticiones por pierna',
                                'Principiante: Agárrate de silla para equilibrio',
                                'Equipo: NINGUNO (o silla de apoyo)'
                            ] : [
                                'Stand straight, feet hip-width apart',
                                'Take long step forward with right leg',
                                'Lower hips until back knee almost touches floor',
                                'Front knee at 90°, DON\'T pass toes',
                                'Push through front heel to return up',
                                'Alternate legs or do all one side first',
                                'Do 3 sets x 10-12 reps per leg',
                                'Beginner: Hold chair for balance',
                                'Equipment: NONE (or chair for support)'
                            ]
                        },
                        { 
                            name: language === 'es' ? 'Remo con Banda' : 'Rowing with Band', 
                            duration: '15 min', 
                            difficulty: language === 'es' ? 'Fácil-Moderada' : 'Easy-Moderate', 
                            freq: '2x semana', 
                            day: language === 'es' ? 'Sábado' : 'Saturday', 
                            why: language === 'es' ? 'Fortalece espalda. Mejora postura que se debilita con cambios hormonales.' : 'Strengthens back. Improves posture that weakens with hormonal changes.', 
                            science: language === 'es' ? 'Estrógeno soportaba musculatura. Sin él, necesitas refuerzo activo. Remo restaura alineación.' : 'Estrogen supported muscles. Without it, you need active reinforcement. Rowing restores alignment.',
                            steps: language === 'es' ? [
                                'Siéntate en suelo, piernas extendidas adelante',
                                'Pasa banda elástica por plantas de pies, agarra extremos',
                                'Espalda recta, pecho hacia afuera',
                                'Tira banda hacia tu abdomen, codos pegados al cuerpo',
                                'Aprieta omóplatos atrás al final del movimiento',
                                'Vuelve controlado a posición inicial',
                                'Haz 3 series x 12-15 repeticiones',
                                'Sin banda: Usa toalla pasada bajo pies',
                                'Equipo: Banda elástica €5-10 O toalla'
                            ] : [
                                'Sit on floor, legs extended forward',
                                'Pass elastic band under feet, grab ends',
                                'Back straight, chest out',
                                'Pull band to abdomen, elbows close to body',
                                'Squeeze shoulder blades back at end of movement',
                                'Return controlled to starting position',
                                'Do 3 sets x 12-15 reps',
                                'Without band: Use towel passed under feet',
                                'Equipment: Elastic band €5-10 OR towel'
                            ]
                        }
                    ],
                    weightLoss: [
                        { 
                            name: language === 'es' ? 'Caminata Rápida' : 'Brisk Walking', 
                            duration: '30 min', 
                            difficulty: language === 'es' ? 'Fácil' : 'Easy', 
                            freq: '5-7x semana', 
                            day: language === 'es' ? 'Diariamente' : 'Daily', 
                            why: language === 'es' ? 'Quema 200-300 calorías. Accesible, bajo impacto, social.' : 'Burns 200-300 calories. Accessible, low impact, social.', 
                            science: language === 'es' ? 'Cardio moderado mejora sensibilidad insulínica (baja en esta etapa). Reduce sofocos 30-40%.' : 'Moderate cardio improves insulin sensitivity (low at this stage). Reduces hot flashes 30-40%.',
                            steps: language === 'es' ? [
                                'Ritmo rápido: Puedes hablar pero no cantar (zona aeróbica)',
                                'Brazos doblados a 90°, muévelos al ritmo de pasos',
                                'Talón toca suelo primero, impulsa con dedos',
                                'Postura recta, mirada al frente, hombros relajados',
                                'Primeros 5 min: Calentamiento ritmo suave',
                                'Minutos 6-25: Ritmo rápido constante',
                                'Últimos 5 min: Enfriamiento bajando ritmo',
                                'Ideal: Parques, paseo marítimo, caminadoras',
                                'Equipo: Zapatillas cómodas'
                            ] : [
                                'Brisk pace: Can talk but not sing (aerobic zone)',
                                'Arms bent 90°, move with step rhythm',
                                'Heel touches ground first, push off with toes',
                                'Straight posture, look forward, shoulders relaxed',
                                'First 5 min: Warm-up gentle pace',
                                'Minutes 6-25: Constant brisk pace',
                                'Last 5 min: Cool down slowing pace',
                                'Ideal: Parks, boardwalk, treadmills',
                                'Equipment: Comfortable shoes'
                            ]
                        },
                        { 
                            name: language === 'es' ? 'Bicicleta Estática' : 'Stationary Bike', 
                            duration: '30 min', 
                            difficulty: 'Moderada', 
                            freq: '3-4x semana', 
                            day: language === 'es' ? 'Lunes, Miércoles, Viernes' : 'Mon, Wed, Fri', 
                            why: language === 'es' ? 'Quema 250-400 calorías. Sin impacto articular.' : 'Burns 250-400 calories. No joint impact.', 
                            science: language === 'es' ? 'Cardio aeróbico reduce grasa visceral (la más peligrosa). Disminuye riesgo cardiovascular 35%.' : 'Aerobic cardio reduces visceral fat (the most dangerous). Reduces cardiovascular risk 35%.',
                            steps: language === 'es' ? [
                                'Ajusta sillín: Rodilla ligeramente flexionada cuando pedal abajo',
                                'Resistencia moderada: Puedes mantener conversación',
                                'Primeros 5 min: Resistencia baja para calentar',
                                'Minutos 6-25: Aumenta resistencia, mantén ritmo constante',
                                'Últimos 5 min: Baja resistencia, pedalea suave',
                                'Mantén espalda recta, hombros relajados',
                                'Manos sueltas en manillar, no te apoyes con peso',
                                'Alternativa: Bicicleta normal en ruta plana',
                                'Equipo: Bicicleta estática o normal'
                            ] : [
                                'Adjust seat: Knee slightly bent when pedal down',
                                'Moderate resistance: Can maintain conversation',
                                'First 5 min: Low resistance to warm up',
                                'Minutes 6-25: Increase resistance, maintain constant rhythm',
                                'Last 5 min: Lower resistance, pedal gently',
                                'Keep back straight, shoulders relaxed',
                                'Hands loose on handlebar, don\'t lean with weight',
                                'Alternative: Regular bike on flat route',
                                'Equipment: Stationary or regular bike'
                            ]
                        },
                        { name: 'HIIT (Intervalos)', duration: '20 min', difficulty: language === 'es' ? 'Alta' : 'High', freq: '2x semana', day: language === 'es' ? 'Martes, Jueves' : 'Tue, Thu', why: language === 'es' ? 'Máxima quema calórica en mínimo tiempo. Efecto EPOC (metabolismo acelerado 24h).' : 'Maximum calorie burn in minimum time. EPOC effect (accelerated metabolism 24h).', science: language === 'es' ? 'HIIT aumenta EPOC 25-30%. Eficiente cuando tienes poco tiempo. Aumenta VO2 máx 15-25%.' : 'HIIT increases EPOC 25-30%. Efficient when time is limited. Increases max VO2 15-25%.' },
                        { name: language === 'es' ? 'Saltar la Cuerda' : 'Jump Rope', duration: '15 min', difficulty: 'Moderada', freq: '2x semana', day: language === 'es' ? 'Miércoles, Sábado' : 'Wed, Sat', why: language === 'es' ? 'Quema 300+ calorías/30 min. Tonifica piernas y core.' : 'Burns 300+ calories/30 min. Tones legs and core.', science: language === 'es' ? 'Saltar fortalece huesos (crucial ahora). Quema más calorías que correr en mismo tiempo.' : 'Jumping strengthens bones (crucial now). Burns more calories than running in same time.' },
                        { 
                            name: language === 'es' ? 'Natación' : 'Swimming', 
                            duration: '45 min', 
                            difficulty: 'Moderada', 
                            freq: '2x semana', 
                            day: language === 'es' ? 'Lunes, Viernes' : 'Mon, Fri', 
                            why: language === 'es' ? 'Quema 300-400 calorías. Bajo impacto. Trabaja todo el cuerpo.' : 'Burns 300-400 calories. Low impact. Works entire body.', 
                            science: language === 'es' ? 'Natación trabaja 85% músculos. Mejora cardiovascular sin estrés articular. Reduce sofocos.' : 'Swimming works 85% of muscles. Improves cardiovascular health without joint stress. Reduces hot flashes.',
                            steps: language === 'es' ? [
                                'Estilo crol o espalda (más fáciles que mariposa)',
                                'Primeros 10 min: Nada suave para calentar',
                                'Minutos 11-35: Ritmo moderado constante',
                                'Últimos 10 min: Ritmo suave para enfriar',
                                'Respira cada 2-3 brazadas (no aguantes respiración)',
                                'Si no sabes nadar: Camina en agua hasta cintura',
                                'Alternativa: Aquagym en piscina',
                                'Equipo: Traje de baño, gorro, gafas'
                            ] : [
                                'Freestyle or backstroke (easier than butterfly)',
                                'First 10 min: Swim gently to warm up',
                                'Minutes 11-35: Constant moderate pace',
                                'Last 10 min: Gentle pace to cool down',
                                'Breathe every 2-3 strokes (don\'t hold breath)',
                                'If you can\'t swim: Walk in waist-deep water',
                                'Alternative: Water aerobics in pool',
                                'Equipment: Swimsuit, cap, goggles'
                            ]
                        },
                        { 
                            name: language === 'es' ? 'Elíptica' : 'Elliptical', 
                            duration: '25 min', 
                            difficulty: language === 'es' ? 'Moderada-Alta' : 'Moderate-High', 
                            freq: '3x semana', 
                            day: language === 'es' ? 'Martes, Jueves, Domingo' : 'Tue, Thu, Sun', 
                            why: language === 'es' ? 'Cardio intenso sin impacto. Quema 250-350 calorías.' : 'Intense cardio without impact. Burns 250-350 calories.', 
                            science: language === 'es' ? 'Bajo impacto pero intenso. Ideal para perder peso sin lesionar articulaciones.' : 'Low impact but intense. Ideal for weight loss without joint injury.',
                            steps: language === 'es' ? [
                                'Agarra manillares móviles (trabajas brazos y piernas)',
                                'Primeros 5 min: Resistencia baja, ritmo suave',
                                'Minutos 6-20: Aumenta resistencia, ritmo moderado-alto',
                                'Últimos 5 min: Baja resistencia, ritmo suave',
                                'Mantén espalda recta, no te inclines adelante',
                                'Pies completos en pedales (no solo puntas)',
                                'Alternativa: Caminadora con inclinación',
                                'Equipo: Máquina elíptica (gym o casa)'
                            ] : [
                                'Grab moving handles (work arms and legs)',
                                'First 5 min: Low resistance, gentle pace',
                                'Minutes 6-20: Increase resistance, moderate-high pace',
                                'Last 5 min: Lower resistance, gentle pace',
                                'Keep back straight, don\'t lean forward',
                                'Full feet on pedals (not just toes)',
                                'Alternative: Treadmill with incline',
                                'Equipment: Elliptical machine (gym or home)'
                            ]
                        }
                    ],
                    hormonal: [
                        { 
                            name: language === 'es' ? 'Yoga Suave' : 'Gentle Yoga', 
                            duration: '45 min', 
                            difficulty: language === 'es' ? 'Fácil' : 'Easy', 
                            freq: '3x semana', 
                            day: language === 'es' ? 'Lunes, Miércoles, Viernes' : 'Mon, Wed, Fri', 
                            why: language === 'es' ? 'Reduce estrés que desencadena sofocos. Mejora sueño 40% en estudios.' : 'Reduces stress that triggers hot flashes. Improves sleep 40% in studies.', 
                            science: language === 'es' ? 'Cortisol elevado empeora síntomas. Yoga reduce cortisol 25%. Restaura balance nervioso.' : 'High cortisol worsens symptoms. Yoga reduces cortisol 25%. Restores nervous balance.',
                            steps: language === 'es' ? [
                                'Busca clase "Yoga suave" o "Hatha yoga" para principiantes',
                                'Posturas básicas: Perro boca abajo, gato-vaca, niño',
                                'Mantén cada postura 5 respiraciones profundas',
                                'NO fuerces, el yoga NO duele',
                                'Enfócate en respiración lenta y profunda',
                                'Termina con 10 min de relajación tumbada',
                                'Online: Youtube "yoga suave" o apps como Down Dog',
                                'Equipo: Colchoneta de yoga'
                            ] : [
                                'Look for "Gentle yoga" or "Hatha yoga" for beginners',
                                'Basic poses: Downward dog, cat-cow, child',
                                'Hold each pose 5 deep breaths',
                                'DON\'T force, yoga doesn\'t hurt',
                                'Focus on slow, deep breathing',
                                'End with 10 min relaxation lying down',
                                'Online: Youtube "gentle yoga" or apps like Down Dog',
                                'Equipment: Yoga mat'
                            ]
                        },
                        { 
                            name: 'Tai Chi', 
                            duration: '40 min', 
                            difficulty: language === 'es' ? 'Fácil' : 'Easy', 
                            freq: '3x semana', 
                            day: language === 'es' ? 'Martes, Jueves, Sábado' : 'Tue, Thu, Sat', 
                            why: language === 'es' ? 'Meditación en movimiento. Mejora balance. Calma ansiedad.' : 'Moving meditation. Improves balance. Calms anxiety.', 
                            science: language === 'es' ? 'Estudios chinos: Tai Chi reduce sofocos 50%. Mejora sueño más que otros ejercicios en mujeres.' : 'Chinese studies: Tai Chi reduces hot flashes 50%. Improves sleep more than other exercises in women.',
                            steps: language === 'es' ? [
                                'Busca clase local de Tai Chi o videos "Tai Chi principiantes"',
                                'Movimientos lentos, fluidos, como en cámara lenta',
                                'Respira profundo y lento coordinando con movimientos',
                                'Enfoca mente en cada movimiento (meditación activa)',
                                'Practica descalza o con zapatillas flexibles',
                                'Ideal al aire libre (parque, jardín)',
                                'Online: Youtube "tai chi for beginners"',
                                'Equipo: NINGUNO (ropa cómoda)'
                            ] : [
                                'Find local Tai Chi class or videos "Tai Chi for beginners"',
                                'Slow, flowing movements, like slow motion',
                                'Breathe deep and slow coordinating with movements',
                                'Focus mind on each movement (active meditation)',
                                'Practice barefoot or flexible shoes',
                                'Ideal outdoors (park, garden)',
                                'Online: Youtube "tai chi for beginners"',
                                'Equipment: NONE (comfortable clothes)'
                            ]
                        },
                        { youtube: language === 'es' ? 'https://www.youtube.com/results?search_query=pilates+core+mujeres+menopausia' : 'https://www.youtube.com/results?search_query=pilates+core+women+menopause', name: language === 'es' ? 'Pilates Core' : 'Pilates Core', duration: '30 min', difficulty: 'Moderada', freq: '2-3x semana', day: language === 'es' ? 'Lunes, Jueves' : 'Mon, Thu', why: language === 'es' ? 'Fortalece centro del cuerpo. Mejora postura. Estabilidad.' : 'Strengthens core body. Improves posture. Stability.', science: language === 'es' ? 'Fortalecimiento core reduce dolor de espalda 60%. Mejora postura que se cae con cambios hormonales.' : 'Core strengthening reduces back pain 60%. Improves posture that weakens with hormonal changes.' },
                        { youtube: language === 'es' ? 'https://www.youtube.com/results?search_query=respiracion+consciente+menopausia+sofocos' : 'https://www.youtube.com/results?search_query=conscious+breathing+menopause+hot+flashes', name: language === 'es' ? 'Respiración Consciente' : 'Conscious Breathing', duration: '15 min', difficulty: language === 'es' ? 'Fácil' : 'Easy', freq: '4-5x semana', day: language === 'es' ? 'Diariamente' : 'Daily', why: language === 'es' ? 'Activa sistema nervioso parasimpático (calma). Reduce sofocos instantáneamente.' : 'Activates parasympathetic nervous system (calm). Reduces hot flashes instantly.', science: language === 'es' ? 'Respiración 4-4-6 reduce cortisol 30%. En sofoco: respira y baja 50% intensidad.' : '4-4-6 breathing reduces cortisol 30%. In a hot flash: breathe and reduce intensity 50%.' },
                        { youtube: language === 'es' ? 'https://www.youtube.com/results?search_query=caminata+meditativa+mujeres+50' : 'https://www.youtube.com/results?search_query=meditative+walk+women+over+50', name: language === 'es' ? 'Caminata Meditativa' : 'Meditative Walk', duration: '30 min', difficulty: language === 'es' ? 'Fácil' : 'Easy', freq: '5x semana', day: language === 'es' ? 'Diariamente' : 'Daily', why: language === 'es' ? 'Mezcla cardio suave con conexión emocional. Anti-ansiedad natural.' : 'Mixes light cardio with emotional connection. Natural anti-anxiety.', science: language === 'es' ? 'Naturaleza reduce cortisol en 20 min. Caminar mejora serotonina naturalmente.' : 'Nature reduces cortisol in 20 min. Walking improves serotonin naturally.' },
                        { youtube: language === 'es' ? 'https://www.youtube.com/results?search_query=estiramientos+profundos+menopausia+mujeres' : 'https://www.youtube.com/results?search_query=deep+stretching+menopause+women', name: language === 'es' ? 'Estiramientos Profundos' : 'Deep Stretching', duration: '20 min', difficulty: language === 'es' ? 'Fácil' : 'Easy', freq: '3x semana', day: language === 'es' ? 'Miércoles, Viernes, Domingo' : 'Wed, Fri, Sun', why: language === 'es' ? 'Libera tensión física. Mejora flexibilidad.' : 'Releases physical tension. Improves flexibility.', science: language === 'es' ? 'Estrés se almacena en músculos. Estiramientos liberan tensión y reduce cortisol.' : 'Stress is stored in muscles. Stretching releases tension and reduces cortisol.' }
                    ]
                };

                // PERSONALIZACIÓN: Ya filtra por exerciseGoal (strength/weightLoss/hormonal)
                // TODO futuro: Ajustar intensidad según edad y condiciones físicas
                return allExercises[exerciseGoal] || [];
            };

            // MITOS
            const getMythsAndTips = () => {
                return {
                    myths: language === 'es' ? [
                        { 
                            myth: 'Necesitas medicación obligatoriamente', 
                            truth: 'Tienes opciones: cambios de estilo de vida, terapias naturales Y medicación si la necesitas', 
                            science: 'Esta etapa es biológicamente natural. El estrógeno desciende 90% pero es un cambio fisiológico, no una enfermedad. Estudios muestran que ejercicio + nutrición reducen síntomas 40-60% sin medicación. PERO si tus síntomas son severos, la terapia hormonal es segura y efectiva bajo supervisión médica.',
                            action: 'Documenta síntomas 3 meses. Si afectan tu calidad de vida, consulta opciones médicas sin miedo.',
                            source: 'https://pubmed.ncbi.nlm.nih.gov/26444994/'
                        },
                        { 
                            myth: 'Los sofocos duran para siempre', 
                            truth: 'La mayoría dura 5-8 años. La intensidad disminuye progresivamente', 
                            science: 'Estudio SWAN (Study of Women\'s Health Across the Nation): 65% de mujeres resuelve sofocos en 8 años, 90% en 10 años. Intensidad máxima en años 1-3, luego disminuye naturalmente.',
                            action: 'Ejercicio moderado + sueño 7-9h + manejo estrés = reducción de sofocos 30-50%',
                            source: 'https://pubmed.ncbi.nlm.nih.gov/25786690/'
                        },
                        { 
                            myth: 'Es imposible no engordar', 
                            truth: 'El metabolismo baja ligeramente, pero TÚ controlas tu peso', 
                            science: 'Metabolismo basal desciende 100-200 calorías/día (5-8%). Pero entrenamiento de fuerza 2-3x/semana recupera 3-5% del metabolismo. Proteína 1.2-1.6g/kg preserva masa muscular que quema calorías.',
                            action: 'Fuerza 2-3 días/semana + proteína cada comida = peso estable o pérdida controlada',
                            source: 'https://pubmed.ncbi.nlm.nih.gov/35231009/'
                        },
                        { 
                            myth: 'Tu vida sexual terminó', 
                            truth: 'Muchas mujeres reportan MEJOR vida sexual sin miedo a embarazo', 
                            science: 'Sequedad vaginal es tratable con lubricantes y humectantes (efectividad 80-90%). Estudios: 40% de mujeres reporta MEJOR satisfacción sexual en esta etapa por libertad de anticoncepción y mejor comunicación con pareja.',
                            action: 'Lubricante base agua + comunicación abierta + tiempo = intimidad plena',
                            source: 'https://pubmed.ncbi.nlm.nih.gov/19212271/'
                        }
                    ] : [
                        { 
                            myth: 'You must take medication', 
                            truth: 'You have options: lifestyle changes, natural therapies AND medication if you need it', 
                            science: 'This stage is biologically natural. Estrogen drops 90% but it\'s physiological change, not disease. Studies show exercise + nutrition reduce symptoms 40-60% without medication. BUT if symptoms are severe, hormone therapy is safe and effective under medical supervision.',
                            action: 'Document symptoms for 3 months. If they affect your quality of life, consult medical options without fear.',
                            source: 'https://pubmed.ncbi.nlm.nih.gov/26444994/'
                        },
                        { 
                            myth: 'Hot flashes last forever', 
                            truth: 'Most last 5-8 years. Intensity decreases progressively', 
                            science: 'SWAN Study (Study of Women\'s Health Across the Nation): 65% of women resolve hot flashes in 8 years, 90% in 10. Maximum intensity years 1-3, then naturally decreases.',
                            action: 'Moderate exercise + 7-9h sleep + stress management = 30-50% reduction in hot flashes',
                            source: 'https://pubmed.ncbi.nlm.nih.gov/25786690/'
                        },
                        { 
                            myth: 'Weight gain is inevitable', 
                            truth: 'Metabolism drops slightly, but YOU control your weight', 
                            science: 'Basal metabolism decreases 100-200 calories/day (5-8%). But strength training 2-3x/week recovers 3-5% of metabolism. Protein 1.2-1.6g/kg preserves muscle mass that burns calories.',
                            action: 'Strength 2-3 days/week + protein every meal = stable weight or controlled loss',
                            source: 'https://pubmed.ncbi.nlm.nih.gov/35231009/'
                        },
                        { 
                            myth: 'Your sexual life is over', 
                            truth: 'Many women report BETTER sexual life without pregnancy fear', 
                            science: 'Vaginal dryness is treatable with lubricants and moisturizers (80-90% effectiveness). Studies: 40% of women report BETTER sexual satisfaction at this stage due to contraception freedom and better partner communication.',
                            action: 'Water-based lubricant + open communication + time = full intimacy',
                            source: 'https://pubmed.ncbi.nlm.nih.gov/19212271/'
                        }
                    ],
                    tips: language === 'es' ? [
                        { emoji: '🌙', title: 'Sueño 7-9 Horas', why: 'El sueño es reparación. Tu cuerpo NECESITA más sueño. Dormir 7+ horas reduce sofocos 40%.', how: '• Misma hora siempre\n• Sin pantallas tras las 21:00\n• Habitación 16-18°C' },
                        { emoji: '💪', title: 'Movimiento 30+ min Diario', why: 'Ejercicio es medicina. Reduce sofocos, mejora sueño, preserva hueso. Incrementa serotonina.', how: '• Cardio suave (caminar) 5 días\n• Fuerza 2-3 días\n• Flexibilidad (yoga) 2-3 días' },
                        { emoji: '🥗', title: 'Nutrición Real No Dietas', why: 'Dietas restrictivas empeoran síntomas. Necesitas nutrientes para neurotransmisores.', how: '• Proteína CADA comida (30-40g)\n• Come arcoíris\n• Grasas omega-3' },
                        { emoji: '✨', title: 'Respiración Profunda 5 min', why: 'Activa parasimpático (sistema calma). En sofoco: respira y baja 50% intensidad.', how: '• Inhalación 4 segundos\n• Retención 4 segundos\n• Exhalación 6 segundos' },
                        { emoji: '🪨', title: 'Conexión Humana', why: 'Aislamiento amplifica ansiedad. Conexión reduce estrés 35%.', how: '• Busca círculo de mujeres\n• Habla sin tabúes\n• Comparte miedos' }
                    ] : [
                        { emoji: '🌙', title: 'Sleep 7-9 Hours', why: 'Sleep is repair. Your body NEEDS more sleep. Sleeping 7+ hours reduces hot flashes 40%.', how: '• Same time always\n• No screens after 9 PM\n• Room 16-18°C' },
                        { emoji: '💪', title: 'Movement 30+ min Daily', why: 'Exercise is medicine. Reduces hot flashes, improves sleep, preserves bone. Increases serotonin.', how: '• Light cardio (walking) 5 days\n• Strength 2-3 days\n• Flexibility (yoga) 2-3 days' },
                        { emoji: '🥗', title: 'Real Nutrition Not Diets', why: 'Restrictive diets worsen symptoms. You need nutrients for neurotransmitters.', how: '• Protein EVERY meal (30-40g)\n• Eat the rainbow\n• Omega-3 fats' },
                        { emoji: '✨', title: 'Deep Breathing 5 min', why: 'Activates parasympathetic (calm system). In hot flash: breathe and reduce intensity 50%.', how: '• Inhale 4 seconds\n• Hold 4 seconds\n• Exhale 6 seconds' },
                        { emoji: '🪨', title: 'Human Connection', why: 'Isolation amplifies anxiety. Connection reduces stress 35%.', how: '• Find a circle of women\n• Talk without taboos\n• Share fears' }
                    ]
                };
            };

            // CUESTIONARIO
            // FUNCIONES AUTH Y PREMIUM
            const handleLogin = async () => {
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: authData.email,
                        password: authData.password
                    });

                    if (error) {
                        alert('Error: ' + error.message);
                        return;
                    }

                    // Cargar perfil del usuario
                    const { data: profile, error: profileError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                    if (profileError) {
                    }

                    setSession(data.session);
                    setCurrentUser(profile || { id: data.user.id, email: data.user.email });
                    setShowAuth(false);

                    // Si no tiene perfil completo, mostrar quiz
                    if (!profile?.profile_name) {
                        setShowQuiz(true);
                    }

                } catch (err) {
                    alert(language === 'es' ? 'Error al iniciar sesión' : 'Login error');
                }
            };

            // RESETEO DE CONTRASEÑA
            const handlePasswordReset = async () => {
                if (!resetEmail || !resetEmail.includes('@')) {
                    alert(language === 'es' 
                        ? 'Por favor ingresa un email válido' 
                        : 'Please enter a valid email');
                    return;
                }

                try {
                    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                        redirectTo: 'https://getlumera.app'
                    });

                    if (error) {
                        alert('Error: ' + error.message);
                        return;
                    }

                    alert(language === 'es'
                        ? '✅ Te hemos enviado un email para resetear tu contraseña. Revisa tu bandeja de entrada.'
                        : '✅ We sent you an email to reset your password. Check your inbox.');

                    setShowPasswordReset(false);
                    setResetEmail('');
                } catch (err) {
                    alert(language === 'es' 
                        ? 'Error al enviar email de reseteo' 
                        : 'Error sending reset email');
                }
            };

            // LOGIN CON GOOGLE
            const handleGoogleLogin = async () => {
                try {
                    const { data, error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: 'https://getlumera.app'
                        }
                    });

                    if (error) {
                        alert('Error: ' + error.message);
                    }
                } catch (err) {
                    alert(language === 'es' 
                        ? 'Error al conectar con Google' 
                        : 'Error connecting with Google');
                }
            };

            const handleRegister = async () => {
                try {
                    // IMPORTANTE: Primero registrar en Auth (el trigger creará el perfil automáticamente)
                    const { data, error } = await supabase.auth.signUp({
                        email: authData.email,
                        password: authData.password
                    });

                    if (error) {
                        // Error específico de usuario duplicado
                        if (error.message.includes('already registered')) {
                            alert(language === 'es' 
                                ? 'Este email ya está registrado. Intenta iniciar sesión.' 
                                : 'This email is already registered. Try logging in.');
                            setAuthMode('login');
                            return;
                        }
                        alert('Error: ' + error.message);
                        return;
                    }

                    
                    // Si hay sesión directa (email confirmation OFF) → quiz inmediato
                    // Si no hay sesión (email confirmation ON) → avisar que revise email
                    if (data.session) {
                        setSession(data.session);
                        setCurrentUser({ id: data.user.id, email: data.user.email });
                        setShowAuth(false);
                        setShowQuiz(true);
                    } else {
                        // Email confirmation requerida
                        alert(language === 'es'
                            ? '✅ Cuenta creada. Revisa tu email para confirmar tu cuenta y luego inicia sesión.'
                            : '✅ Account created. Check your email to confirm your account, then log in.');
                        setAuthMode('login');
                    }
                } catch (err) {
                    alert(language === 'es' ? 'Error al registrarse' : 'Registration error');
                }
            };

            const handleLogout = async () => {
                await supabase.auth.signOut();
                setSession(null);
                setCurrentUser(null);
                setShowAuth(true);
                setShowQuiz(false);
            };

            // CÁLCULOS NUTRICIONALES
            const calculateBMI = (weight, height) => {
                // weight en kg, height en cm
                if (!weight || !height || weight <= 0 || height <= 0) return null;
                const heightInMeters = height / 100;
                return (weight / (heightInMeters * heightInMeters)).toFixed(2);
            };

            const calculateTDEE = (weight, height, age, activityLevel) => {
                // Fórmula Mifflin-St Jeor para mujeres
                if (!weight || !height || !age) return null;

                // BMR (Basal Metabolic Rate)
                const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;

                // Activity multipliers
                const activityMultipliers = {
                    'sedentary': 1.2,      // Poco o ningún ejercicio
                    'light': 1.375,        // Ejercicio ligero 1-3 días/semana
                    'moderate': 1.55,      // Ejercicio moderado 3-5 días/semana
                    'active': 1.725,       // Ejercicio intenso 6-7 días/semana
                    'very_active': 1.9     // Ejercicio muy intenso, trabajo físico
                };

                const multiplier = activityMultipliers[activityLevel] || 1.55;
                return Math.round(bmr * multiplier);
            };

            const getBMICategory = (bmi, lang = 'es') => {
                if (!bmi) return null;
                const categories = {
                    es: {
                        underweight: 'Bajo peso',
                        normal: 'Peso normal',
                        overweight: 'Sobrepeso',
                        obese: 'Obesidad'
                    },
                    en: {
                        underweight: 'Underweight',
                        normal: 'Normal weight',
                        overweight: 'Overweight',
                        obese: 'Obese'
                    }
                };

                const lang_categories = categories[lang] || categories['es'];

                if (bmi < 18.5) return lang_categories.underweight;
                if (bmi < 25) return lang_categories.normal;
                if (bmi < 30) return lang_categories.overweight;
                return lang_categories.obese;
            };

            const updateUserMetrics = async (userId, weight, height, age, activityLevel) => {
                const bmi = calculateBMI(weight, height);
                const tdee = calculateTDEE(weight, height, age, activityLevel);

                
                const { error } = await supabase
                    .from('users')
                    .update({
                        weight: parseFloat(weight),
                        height: parseInt(height),
                        activity_level: activityLevel,
                        bmi: parseFloat(bmi),
                        tdee: parseInt(tdee)
                    })
                    .eq('id', userId);

                if (error) {
                    return false;
                }

                return { bmi, tdee };
            };

            const getMetrics = () => {
                if (!currentUser) return null;
                const { weight, height, age, activity_level, goal, bmi, bmr, tdee, target_calories } = currentUser;
                if (!weight || !height || !age) return null;

                // Usar valores calculados por BD si existen, sino calcular en frontend
                const bmiVal = bmi || calculateBMI(weight, height);
                const bmrVal = bmr || Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161);
                const tdeeVal = tdee || calculateTDEE(weight, height, age, activity_level || 'moderate');
                const adjustments = { lose: -500, maintain: 0, gain: 300 };
                const targetVal = target_calories || (tdeeVal + (adjustments[goal || 'maintain'] || 0));

                return { 
                    bmi: bmiVal, 
                    bmr: bmrVal, 
                    tdee: tdeeVal, 
                    target: targetVal 
                };
            };

            const saveMetabolicProfile = async () => {
                if (!session?.user?.id) {
                    alert(language === 'es' ? 'Error: no hay sesión activa' : 'Error: no active session');
                    return;
                }

                const weight = parseFloat(editWeight);
                const height = parseFloat(editHeight);
                const age = parseInt(editAge);

                if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
                    alert(language === 'es' ? 'Por favor completa todos los campos correctamente' : 'Please complete all fields correctly');
                    return;
                }

                try {
                    // El trigger de BD calcula BMI/BMR/TDEE automáticamente
                    const { data, error } = await supabase
                        .from('users')
                        .update({
                            weight,
                            height,
                            age,
                            activity_level: editActivityLevel,
                            goal: editGoal,
                            weight_goal: editGoal
                        })
                        .eq('id', session.user.id)
                        .select()
                        .single();

                    if (error) throw error;

                    // Actualizar estado local con los valores que devuelve la BD (incluyendo BMI/TDEE calculados)
                    setCurrentUser(data);
                    setShowProfileModal(false);
                    alert(language === 'es' ? '✅ Perfil actualizado' : '✅ Profile updated');
                } catch (error) {
                    alert((language === 'es' ? 'Error: ' : 'Error: ') + error.message);
                }
            };

            // GENERAR DATOS PARA GRÁFICOS
            const generateChartData = () => {
                if (!symptoms || symptoms.length === 0) return null;

                const last7Days = symptoms
                    .sort((a, b) => new Date(b.symptom_date) - new Date(a.symptom_date))
                    .slice(0, 7)
                    .reverse();

                if (last7Days.length === 0) return null;

                return {
                    labels: last7Days.map(s => {
                        const date = new Date(s.symptom_date);
                        return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                        });
                    }),
                    energy: last7Days.map(s => s.energy || 5),
                    sleep: last7Days.map(s => s.sleep || 5),
                    mood: last7Days.map(s => s.mood || 5),
                    anxiety: last7Days.map(s => s.anxiety || 0),
                    hotFlashes: last7Days.map(s => s.hot_flashes || 0)
                };
            };

            // EJERCICIOS PERSONALIZADOS - Llama a Edge Function (solo Premium)
            const fetchPersonalizedExercises = async () => {
                // Trial y premium tienen acceso a ejercicios dinámicos; solo 'free' queda bloqueado
                if (getUserTier() === 'free') return;
                if (loadingExercises) return;

                setLoadingExercises(true);

                try {
                    const recentSymptoms = symptoms.slice(0, 7);

                    const response = await fetch('https://pyekwpmbdnmglrjieexc.supabase.co/functions/v1/generate-exercises', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
                        },
                        body: JSON.stringify({
                            user_id: currentUser?.id,
                            symptoms: recentSymptoms,
                            health_conditions: currentUser?.health_conditions || [],
                            activity_level: currentUser?.activity_level || 'moderate',
                            goal: exerciseGoal,
                            language: language
                        })
                    });

                    if (!response.ok) throw new Error('Error ' + response.status);

                    const data = await response.json();

                    if (data.exercises && data.exercises.length > 0) {
                        setAiExercises(data.exercises);
                    } else {
                        throw new Error('Sin datos');
                    }
                } catch (error) {
                    // Mostrar ejercicios personalizados locales si falla la Edge Function
                    const fallback = getExercises().slice(0, 3).map(ex => ({
                        ...ex,
                        why: (ex.why || '') + (language === 'es' ? ' Adaptado a tu perfil.' : ' Adapted to your profile.')
                    }));
                    setAiExercises(fallback.length > 0 ? fallback : null);
                    if (fallback.length === 0) {
                        alert(language === 'es' ? 'No se pudo generar la rutina. Intenta más tarde.' : 'Could not generate routine. Try again later.');
                    }
                } finally {
                    setLoadingExercises(false);
                }
            };

            // COOKING TIPS IA - Llama a Edge Function
            const fetchCookingTips = async (recipe) => {
                const tier = getUserTier();
                if (tier === 'free') return; // Solo trial y premium

                const recipeKey = recipe.name;
                if (aiCookingTips[recipeKey] || loadingTips[recipeKey]) return; // Ya tiene tips o está cargando

                setLoadingTips(prev => ({ ...prev, [recipeKey]: true }));

                try {
                    const ingredients = (recipe.ingredients || []).map(ing => ing.name || ing).filter(Boolean);

                    const response = await fetch(`https://pyekwpmbdnmglrjieexc.supabase.co/functions/v1/cooking-tips`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        },
                        body: JSON.stringify({
                            recipe_name: recipe.name,
                            ingredients: ingredients,
                            language: language
                        })
                    });

                    const data = await response.json();

                    if (data.tips && data.tips.length > 0) {
                        setAiCookingTips(prev => ({ ...prev, [recipeKey]: data.tips }));
                    }
                } catch (error) {
                } finally {
                    setLoadingTips(prev => ({ ...prev, [recipeKey]: false }));
                }
            };


            // SISTEMA DE TRIAL 7 DÍAS
            const isPremium = () => {
                if (!currentUser) return false;

                // Usuario con suscripción activa
                if (['active','paid'].includes(currentUser.subscription_status)) return true;

                // Usuario en trial (7 días desde registro)
                if (currentUser.created_at) {
                    const createdDate = new Date(currentUser.created_at);
                    const now = new Date();
                    const daysSinceCreation = (now - createdDate) / (1000 * 60 * 60 * 24);

                    // Si tiene menos de 3 días (trial) y no ha cancelado
                    if (daysSinceCreation <= 3 && currentUser.trial_active !== false) {
                        return true;
                    }
                }

                return false;
            };

            // Calcular días restantes de trial
            const getTrialDaysLeft = () => {
                if (!currentUser?.created_at) return 0;
                const createdDate = new Date(currentUser.created_at);
                const now = new Date();
                const daysPassed = (now - createdDate) / (1000 * 60 * 60 * 24);
                const daysLeft = Math.max(0, Math.ceil(3 - daysPassed));
                return daysLeft;
            };

            // NIVELES DE USUARIO: 'trial' | 'free' | 'premium'
            // trial = dentro de los 3 días desde el registro
            // free = más de 3 días sin suscripción activa
            // premium = suscripción activa
            const getUserTier = () => {

                if (!currentUser) return 'free';
                if (['active','paid'].includes(currentUser.subscription_status)) return 'premium';
                if (getTrialDaysLeft() > 0) return 'trial';
                return 'free';
            };

            // useEffect para generar datos cuando cambien síntomas
            useEffect(() => {
                if (getUserTier() === 'premium' && symptoms.length > 0) {
                    setChartData(generateChartData());
                }
            }, [symptoms, language]);

            // Mostrar bienvenida Premium solo primera vez
            useEffect(() => {
                if (getUserTier() === 'premium' && currentUser) {
                    const hasSeenWelcome = localStorage.getItem(`premium_welcome_${currentUser.id}`);
                    if (!hasSeenWelcome) {
                        setShowWelcomePremium(true);
                        localStorage.setItem(`premium_welcome_${currentUser.id}`, 'true');
                    }
                }
            }, [currentUser]);

            useEffect(() => {
                if (!currentUser) return;
                const trialDaysLeft = getTrialDaysLeft();
                const isInTrial = !currentUser.subscription_status || !['active','paid'].includes(currentUser.subscription_status);
                const isTrialDay3 = isInTrial && trialDaysLeft <= 1;
                if (isTrialDay3) {
                    const hasSeenShula = localStorage.getItem(`shula_day3_${currentUser.id}`);
                    if (!hasSeenShula) {
                        const timer = setTimeout(() => {
                            setShowShulaDay3(true);
                            localStorage.setItem(`shula_day3_${currentUser.id}`, 'true');
                        }, 2000);
                        return () => clearTimeout(timer);
                    }
                }
            }, [currentUser]);



            // Limpiar todos los modales cuando se muestra la pantalla de auth (evita superposición en escritorio)
            useEffect(() => {
                if (showAuth) {
                    setShowLumiChat(false);
                    setShowPlanModal(false);
                    setShowPatternModal(false);
                    setShowProactiveModal(false);
                    setShowWelcomePremium(false);
                    setShowProfileModal && setShowProfileModal(false);
                }
            }, [showAuth]);

            // Auto-disparar patrón en día 3 del trial (movido aquí desde renderPremiumDashboard)
            useEffect(() => {
                const trialDaysLeft = getTrialDaysLeft();
                const isInTrial = !currentUser?.subscription_status || !['active','paid'].includes(currentUser?.subscription_status);
                const isTrialDay3 = isInTrial && trialDaysLeft <= 1;
                if (isTrialDay3 && symptoms.length >= 3 && !patternShown) {
                    const result = analyzePatterns(symptoms);
                    if (result && result.length > 0) {
                        setPatternResult(result);
                        setTimeout(() => {
                            if (getTrialDaysLeft() <= 1) setShowPatternModal(true);
                            setPatternShown(true);
                        }, 1500);
                    }
                }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [currentUser, symptoms]);

            // CÁLCULOS METABÓLICOS

            // Obtiene el día de la semana estático basado en la semana del año
            // Así en free el menú cambia una vez por semana, no cada día
            const getStaticWeeklyDay = () => {
                const today = new Date();
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                const weekNumber = Math.floor(((today - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
                const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                return days[weekNumber % 7];
            };

            const getRegion = () => {
                // Primero intentar usar la región del usuario si está logueado
                if (currentUser && currentUser.region) {
                    return currentUser.region.toLowerCase(); // FORZAR MINÚSCULAS
                }

                // Si no hay usuario logueado, detectar por timezone
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

                // LATAM: América Latina (excepto USA/Canadá)
                if (tz.includes('America/') && 
                    !tz.includes('America/New_York') && 
                    !tz.includes('America/Chicago') && 
                    !tz.includes('America/Los_Angeles') &&
                    !tz.includes('America/Toronto') &&
                    !tz.includes('America/Vancouver')) {
                    return 'latam';
                }

                // USA/Canadá
                if (tz.includes('America/New_York') || 
                    tz.includes('America/Chicago') || 
                    tz.includes('America/Los_Angeles') ||
                    tz.includes('America/Toronto') ||
                    tz.includes('America/Vancouver') ||
                    tz.includes('US/')) {
                    return 'usa';
                }

                // Europa, Medio Oriente, África
                if (tz.includes('Europe') || tz.includes('Africa') || tz.includes('Asia')) {
                    return 'emea';
                }

                // Default LATAM si no detecta
                return 'latam';
            };

            // STRIPE REAL - PRODUCCIÓN
            // CANCELAR SUSCRIPCIÓN - Abre portal de cliente Lemon Squeezy
            const handleCancelSubscription = async () => {
                const confirmed = window.confirm(
                    language === 'es'
                        ? '¿Segura que quieres cancelar? Mantendrás acceso premium hasta el final de tu período de facturación.'
                        : 'Are you sure you want to cancel? You will keep premium access until the end of your billing period.'
                );
                if (!confirmed) return;

                // Si tenemos subscription_id del usuario, podemos intentar abrir el portal directo
                // Si no, redirigimos al soporte con email prellenado
                const email = currentUser?.email || '';
                const subscriptionId = currentUser?.subscription_id || '';

                if (subscriptionId) {
                    // Lemon Squeezy customer portal (si tienes customer_portal_url guardada en el usuario)
                    const portalUrl = currentUser?.customer_portal_url;
                    if (portalUrl) {
                        window.open(portalUrl, '_blank');
                    } else {
                        // Fallback: email de soporte con info prellenada
                        window.open(`mailto:support@lumera.app?subject=${encodeURIComponent('Cancelar suscripción')}&body=${encodeURIComponent(`Hola, quiero cancelar mi suscripción.\n\nEmail: ${email}\nID suscripción: ${subscriptionId}`)}`, '_blank');
                    }
                } else {
                    // Sin subscription_id, abrir email de soporte
                    window.open(`mailto:support@lumera.app?subject=${encodeURIComponent(language === 'es' ? 'Cancelar suscripción' : 'Cancel subscription')}&body=${encodeURIComponent(language === 'es' ? `Hola, quiero cancelar mi suscripción.\n\nEmail: ${email}` : `Hi, I want to cancel my subscription.\n\nEmail: ${email}`)}`, '_blank');
                }
            };

            const handleSubscribe = async (planType = 'monthly') => {
                if (!currentUser) { 
                    alert(language === 'es' ? 'Inicia sesión primero' : 'Please log in first'); 
                    return; 
                }

                
                // Obtener el UUID correcto según el plan y región
                const variantId = planType === 'annual' ? PRICES[userRegion].annualVariantId : PRICES[userRegion].monthlyVariantId;

                
                // Construir checkout URL de Lemon Squeezy
                const checkoutUrl = `https://getlumera.lemonsqueezy.com/checkout/buy/${variantId}`;

                // Añadir parámetros: email del usuario y user_id para el webhook
                const urlWithParams = `${checkoutUrl}?checkout[email]=${encodeURIComponent(currentUser.email)}&checkout[custom][user_id]=${currentUser.id}&checkout[custom][plan_type]=${planType}`;

                
                // Redirigir a Lemon Squeezy checkout
                window.location.href = urlWithParams;
            };

            const renderQuiz = () => {
                if (quizStep === 1) {
                    return (
                        <div style={{minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: '#f5f0eb', overflow: 'hidden'}}>
                            {/* Video fondo */}
                            <video autoPlay loop muted playsInline
                                style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, zIndex: 0}}
                                src="/videos/Dashboard.mp4" />
                            {/* Overlay gradiente */}
                            <div style={{position: 'fixed', inset: 0, background: 'linear-gradient(135deg, rgba(245,240,235,0.6) 0%, rgba(236,220,200,0.5) 100%)', zIndex: 1}} />
                            {/* Tarjeta glassmorphism */}
                            <div style={{position: 'relative', zIndex: 2, width: '100%', maxWidth: '480px', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '2rem', padding: '2.5rem 2rem', boxShadow: '0 8px 64px rgba(0,0,0,0.1)'}}>
                                {/* Selector idioma */}
                                <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem'}}>
                                    <select value={language} onChange={(e) => setLanguage(e.target.value)}
                                        style={{padding: '0.4rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.82rem', cursor: 'pointer'}}>
                                        <option value="es" style={{color: '#333'}}>🇪🇸 Español</option>
                                        <option value="en" style={{color: '#333'}}>🇬🇧 English</option>
                                    </select>
                                </div>
                                {/* Logo y headline */}
                                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                                    <p style={{fontSize: '0.72rem', fontWeight: 700, color: '#C9935A', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.75rem'}}>✦ LUMERA</p>
                                    <h1 style={{fontFamily: "'Cormorant', Georgia, serif", fontSize: '2.4rem', fontWeight: 300, color: '#292524', lineHeight: 1.15, marginBottom: '1rem'}}>
                                        {language === 'es' ? 'Tu nuevo capítulo — comienza ahora' : 'Your new chapter — begins now'}
                                    </h1>
                                    <p style={{fontSize: '0.9rem', color: '#78716c', lineHeight: 1.7}}>
                                        {language === 'es'
                                            ? 'Ciencia y cuidado diseñados para ti. Para que esta etapa sea la más poderosa de tu vida.'
                                            : 'Science and care designed for you. So this stage becomes the most powerful of your life.'}
                                    </p>
                                </div>
                                {/* 3 bullets rápidos */}
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem'}}>
                                    {[
                                        {icon: '/images/lumi.png', text: language === 'es' ? 'LUMI recuerda como te sientes cada dia' : 'LUMI remembers how you feel each day'},
                                        {icon: '/images/menu.png', text: language === 'es' ? 'Menus adaptados a tus sintomas' : 'Menus adapted to your symptoms'},
                                        {icon: '/images/ejercicio.png', text: language === 'es' ? 'Ejercicio segun tu energia real' : 'Exercise based on your real energy'},
                                    ].map((item, i) => (
                                        <div key={i} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(201,147,90,0.06)', borderRadius: '0.75rem', padding: '0.75rem 1rem'}}>
                                            <img src={item.icon} style={{width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0}} />
                                            <span style={{fontSize: '0.85rem', color: '#44403c'}}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* CTA */}
                                <button
                                    onClick={() => setQuizStep(2)}
                                    style={{width: '100%', background: 'linear-gradient(135deg, #C9935A, #e8c89f)', border: 'none', borderRadius: '9999px', padding: '1rem', color: 'white', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(124,58,237,0.5)', letterSpacing: '0.02em', marginBottom: '0.75rem'}}
                                >
                                    {language === 'es' ? '✨ Comenzar mi transformación' : '✨ Start my transformation'}
                                </button>
                                <p style={{textAlign: 'center', fontSize: '0.75rem', color: '#a8a29e'}}>
                                    {language === 'es' ? 'Gratis · Sin tarjeta · 2 minutos' : 'Free · No card · 2 minutes'}
                                </p>
                            </div>
                        </div>
                    );
                }
                if (quizStep === 2) {
                    return (
                        <div style={{minHeight:'100vh', background:'#f5ede4', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem'}}>
                            <div style={{position:'relative', zIndex:2, background:'rgba(255,255,255,0.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderRadius:'1.5rem', padding:'2rem 1.75rem', maxWidth:'520px', width:'100%', border:'1px solid rgba(255,255,255,0.9)', boxShadow:'0 8px 40px rgba(180,140,120,0.12)'}}>
                                <h2 style={{fontFamily:"'Cormorant', serif", fontSize:"1.8rem", fontWeight:400, color:"#292524", marginBottom:"1.5rem", textAlign:"center"}}>{language === 'es' ? 'Tu Perfil' : 'Your Profile'}</h2>

                                <div className="space-y-4 mb-6">
                                    <input type="text" placeholder={language === 'es' ? 'Tu nombre' : 'Your name'} 
                                        value={formData.profileName}
                                        onChange={(e) => setFormData({...formData, profileName: e.target.value})}
                                        style={{width:"100%", padding:"0.75rem 1rem", border:"1px solid rgba(201,147,90,0.25)", borderRadius:"0.75rem", fontSize:"0.95rem", background:"rgba(255,255,255,0.8)", color:"#292524", outline:"none", boxSizing:"border-box"}}/>

                                    <div className="grid grid-cols-3 gap-3">
                                        <input type="number" placeholder={language === 'es' ? 'Edad' : 'Age'} 
                                            value={formData.age}
                                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                                            style={{padding:"0.75rem 1rem", border:"1px solid rgba(201,147,90,0.25)", borderRadius:"0.75rem", fontSize:"0.95rem", background:"rgba(255,255,255,0.8)", color:"#292524", outline:"none", width:"100%"}}/>
                                        <input type="number" placeholder={language === 'es' ? 'Altura (cm)' : 'Height (cm)'} 
                                            value={formData.height}
                                            onChange={(e) => setFormData({...formData, height: e.target.value})}
                                            style={{padding:"0.75rem 1rem", border:"1px solid rgba(201,147,90,0.25)", borderRadius:"0.75rem", fontSize:"0.95rem", background:"rgba(255,255,255,0.8)", color:"#292524", outline:"none", width:"100%"}}/>
                                        <input type="number" placeholder={language === 'es' ? 'Peso (kg)' : 'Weight (kg)'} 
                                            value={formData.weight}
                                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                            style={{padding:"0.75rem 1rem", border:"1px solid rgba(201,147,90,0.25)", borderRadius:"0.75rem", fontSize:"0.95rem", background:"rgba(255,255,255,0.8)", color:"#292524", outline:"none", width:"100%"}}/>
                                    </div>

                                    {/* NIVEL DE ACTIVIDAD FÍSICA */}
                                    <div className="mt-6">
                                        <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            {language === 'es' ? '💪 Nivel de Actividad Física' : '💪 Physical Activity Level'}
                                        </label>
                                        <select 
                                            value={formData.activity_level}
                                            onChange={(e) => setFormData({...formData, activity_level: e.target.value})}
                                            style={{width:"100%", padding:"0.75rem 1rem", border:"1px solid rgba(201,147,90,0.25)", borderRadius:"0.75rem", fontSize:"0.95rem", background:"rgba(255,255,255,0.8)", color:"#292524", outline:"none"}}
                                        >
                                            <option value="sedentary">{language === 'es' ? 'Sedentario (poco o ningún ejercicio)' : 'Sedentary (little to no exercise)'}</option>
                                            <option value="light">{language === 'es' ? 'Ligero (ejercicio 1-3 días/semana)' : 'Light (exercise 1-3 days/week)'}</option>
                                            <option value="moderate">{language === 'es' ? 'Moderado (ejercicio 3-5 días/semana)' : 'Moderate (exercise 3-5 days/week)'}</option>
                                            <option value="active">{language === 'es' ? 'Activo (ejercicio 6-7 días/semana)' : 'Active (exercise 6-7 days/week)'}</option>
                                            <option value="very_active">{language === 'es' ? 'Muy activo (ejercicio intenso diario + trabajo físico)' : 'Very active (intense daily exercise + physical job)'}</option>
                                        </select>
                                        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {language === 'es' 
                                                ? 'Esto nos ayuda a calcular tus necesidades calóricas diarias' 
                                                : 'This helps us calculate your daily caloric needs'}
                                        </p>
                                    </div>
                                </div>

                                <button onClick={() => setQuizStep(3)} style={{width:"100%", background:"linear-gradient(135deg, #C9935A, #e8c89f)", border:"none", borderRadius:"9999px", padding:"0.9rem", color:"white", fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(201,147,90,0.25)"}}>
                                    {language === 'es' ? 'Siguiente' : 'Next'} →
                                </button>
                            </div>
                        </div>
                    );
                }

                if (quizStep === 3) {
                    const conditions = language === 'es' 
                        ? ['Diabetes', 'Hipertensión', 'Sin gluten', 'Sin lactosa', 'Vegetariana', 'Vegetariana sin huevo', 'Vegana', 'Artritis']
                        : ['Diabetes', 'Hypertension', 'Gluten-free', 'Lactose-free', 'Vegetarian', 'Vegetarian no eggs', 'Vegan', 'Arthritis'];

                    return (
                        <div style={{minHeight:'100vh', background:'#f5ede4', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem'}}>
                            <div style={{position:'relative', zIndex:2, background:'rgba(255,255,255,0.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderRadius:'1.5rem', padding:'2rem 1.75rem', maxWidth:'520px', width:'100%', border:'1px solid rgba(255,255,255,0.9)', boxShadow:'0 8px 40px rgba(180,140,120,0.12)'}}>
                                <h2 style={{fontFamily:"'Cormorant', serif", fontSize:"1.8rem", fontWeight:400, color:"#292524", marginBottom:"1.5rem", textAlign:"center"}}>{language === 'es' ? 'Restricciones' : 'Restrictions'}</h2>

                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {conditions.map((cond, idx) => (
                                        <label key={idx} className={`flex items-center justify-center p-3 md:p-4 border rounded-lg cursor-pointer transition min-h-[60px] ${
                                            formData.conditions.includes(cond)
                                                ? darkMode ? 'bg-amber-900 border-amber-400' : 'bg-amber-50 border-amber-400'
                                                : darkMode ? 'border-gray-600' : 'border-gray-300'
                                        }`}>
                                            <input type="checkbox" 
                                                checked={formData.conditions.includes(cond)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({...formData, conditions: [...formData.conditions, cond]});
                                                    } else {
                                                        setFormData({...formData, conditions: formData.conditions.filter(c => c !== cond)});
                                                    }
                                                }}
                                                className="mr-2 md:mr-3 w-5 h-5 flex-shrink-0"/>
                                            <span className="text-sm md:text-base text-center leading-tight">{cond}</span>
                                        </label>
                                    ))}
                                </div>

                                <button onClick={() => setQuizStep(4)} style={{width:"100%", background:"linear-gradient(135deg, #C9935A, #e8c89f)", border:"none", borderRadius:"9999px", padding:"0.9rem", color:"white", fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(201,147,90,0.25)"}}>
                                    {language === 'es' ? 'Siguiente' : 'Next'} →
                                </button>
                            </div>
                        </div>
                    );
                }

                if (quizStep === 4) {
                    const goals = [
                        { value: 'strength', label: language === 'es' ? 'Ganar Fuerza' : 'Build Strength' },
                        { value: 'weightLoss', label: language === 'es' ? 'Perder Peso' : 'Lose Weight' },
                        { value: 'hormonal', label: language === 'es' ? 'Equilibrio Hormonal' : 'Hormonal Balance' }
                    ];

                    return (
                        <div style={{minHeight:'100vh', background:'#f5ede4', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem'}}>
                            <div style={{position:'relative', zIndex:2, background:'rgba(255,255,255,0.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderRadius:'1.5rem', padding:'2rem 1.75rem', maxWidth:'520px', width:'100%', border:'1px solid rgba(255,255,255,0.9)', boxShadow:'0 8px 40px rgba(180,140,120,0.12)'}}>
                                <h2 style={{fontFamily:"'Cormorant', serif", fontSize:"2rem", fontWeight:400, color:"#292524", marginBottom:"1.5rem"}}>{language === 'es' ? '¿Cuál es tu objetivo?' : 'What\'s Your Goal?'}</h2>

                                <div className="space-y-4 mb-8">
                                    {goals.map((goal) => (
                                        <label key={goal.value} className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition ${
                                            exerciseGoal === goal.value
                                                ? darkMode ? 'bg-amber-900 border-amber-400' : 'bg-amber-50 border-amber-400'
                                                : darkMode ? 'border-gray-600' : 'border-gray-300'
                                        }`}>
                                            <input type="radio" name="goal" value={goal.value}
                                                checked={exerciseGoal === goal.value}
                                                onChange={(e) => setExerciseGoal(e.target.value)}
                                                className="mr-4 w-5 h-5"/>
                                            <span className="font-semibold text-lg">{goal.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <button onClick={() => setQuizStep(5)} style={{width:"100%", background:"linear-gradient(135deg, #C9935A, #e8c89f)", border:"none", borderRadius:"9999px", padding:"0.9rem", color:"white", fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(201,147,90,0.25)"}}>
                                    {language === 'es' ? 'Siguiente' : 'Next'} →
                                </button>
                            </div>
                        </div>
                    );
                }

                if (quizStep === 5) {
                    const regions = [
                        { value: 'latam', label: language === 'es' ? '🌎 Latinoamérica' : '🌎 Latin America' },
                        { value: 'emea', label: language === 'es' ? '🌍 Europa / África' : '🌍 Europe / Africa' },
                        { value: 'usa', label: language === 'es' ? '🌎 USA / Canadá' : '🌎 USA / Canada' }
                    ];

                    return (
                        <div style={{minHeight:'100vh', background:'#f5ede4', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem'}}>
                            <div style={{position:'relative', zIndex:2, background:'rgba(255,255,255,0.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderRadius:'1.5rem', padding:'2rem 1.75rem', maxWidth:'520px', width:'100%', border:'1px solid rgba(255,255,255,0.9)', boxShadow:'0 8px 40px rgba(180,140,120,0.12)'}}>
                                <h2 style={{fontFamily:"'Cormorant', serif", fontSize:"2rem", fontWeight:400, color:"#292524", marginBottom:"1rem"}}>{language === 'es' ? '¿Dónde estás?' : 'Where are you?'}</h2>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                                    {language === 'es' 
                                        ? 'Esto nos ayuda a personalizar ingredientes locales según tu región'
                                        : 'This helps us personalize local ingredients for your region'}
                                </p>

                                <div className="space-y-4 mb-8">
                                    {regions.map((region) => (
                                        <label key={region.value} className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition ${
                                            userRegion === region.value
                                                ? darkMode ? 'bg-amber-900 border-amber-400' : 'bg-amber-50 border-amber-400'
                                                : darkMode ? 'border-gray-600' : 'border-gray-300'
                                        }`}>
                                            <input type="radio" name="region" value={region.value}
                                                checked={userRegion === region.value}
                                                onChange={(e) => setUserRegion(e.target.value)}
                                                className="mr-4 w-5 h-5"/>
                                            <span className="font-semibold text-lg">{region.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <button onClick={async () => {
                                    if (!formData.profileName || !formData.age || !formData.height || !formData.weight) {
                                        alert(language === 'es' ? 'Completa todos los campos' : 'Complete all fields');
                                        return;
                                    }

                                    // Intentar recuperar sesión si no está en estado
                                    let activeSession = session;
                                    if (!activeSession) {
                                        const { data: sessionData } = await supabase.auth.getSession();
                                        activeSession = sessionData?.session;
                                    }
                                    if (!activeSession) {
                                        alert(language === 'es' 
                                            ? 'Error: No hay sesión activa. Por favor cierra y vuelve a iniciar sesión.' 
                                            : 'Error: No active session. Please close and log in again.');
                                        return;
                                    }

                                    // Calcular IMC y TDEE usando las funciones
                                    const bmi = calculateBMI(formData.weight, formData.height);
                                    const tdee = calculateTDEE(formData.weight, formData.height, formData.age, formData.activity_level);

                                    
                                    // GUARDAR EN SUPABASE
                                    const profileData = {
                                        profile_name: formData.profileName,
                                        age: parseInt(formData.age),
                                        height: parseFloat(formData.height),
                                        weight: parseFloat(formData.weight),
                                        activity_level: formData.activity_level,
                                        bmi: parseFloat(bmi),
                                        tdee: parseInt(tdee),
                                        health_conditions: formData.conditions,
                                        goal: exerciseGoal,
                                        region: userRegion,
                                        updated_at: new Date().toISOString()
                                    };

                                    const { data: updatedProfile, error } = await supabase
                                        .from('users')
                                        .upsert({id: activeSession.user.id, email: activeSession.user.email, ...profileData})
                                        .select()
                                        .single();

                                    if (error) {
                                        alert(language === 'es' ? 'Error al guardar perfil' : 'Error saving profile');
                                        return;
                                    }

                                    setCurrentUser({
                                        ...updatedProfile,
                                        bmi: parseFloat(bmi),
                                        tdee: parseInt(tdee)
                                    });
                                    setShowQuiz(false);
                                    setShowWelcomeTrial(true);
                                    setWelcomeAct(1);
                                    setCurrentPage('home');
                                }} style={{width:"100%", background:"linear-gradient(135deg, #C9935A, #e8c89f)", border:"none", borderRadius:"9999px", padding:"0.9rem", color:"white", fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(201,147,90,0.25)"}}>
                                    {language === 'es' ? '¡Comenzar!' : 'Let\'s Go!'} ✨
                                </button>
                            </div>
                        </div>
                    );
                }
            };

            // LUMI - MENSAJES PERSONALIZADOS
            const getLumiMessage = (page = 'home') => {
                if (!currentUser) return null;

                const userName = currentUser.profile_name;
                const todaySymptoms = symptoms.length > 0 ? symptoms[symptoms.length - 1] : null;
                const yesterdaySymptoms = symptoms.length > 1 ? symptoms[symptoms.length - 2] : null;

                // Analizar síntomas de hoy
                const hasLowSleep = todaySymptoms && todaySymptoms.sleep <= 3;
                const hasLowEnergy = todaySymptoms && todaySymptoms.energy <= 3;
                const hasHighHotFlashes = todaySymptoms && todaySymptoms.hotFlashes >= 4;
                const hasLowMood = todaySymptoms && todaySymptoms.mood <= 3;

                // Mensaje bienvenida día 1 sin síntomas
                const isDay1 = symptoms.length === 0 && getUserTier() === 'trial';
                if (isDay1 && page === 'home') {
                    return (
                        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                            <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.15rem',fontWeight:500,color:darkMode?'#e8d5c0':'#292524',lineHeight:1.6}}>
                                {language==='es' ? 'Hola preciosa, soy LUMI ✦' : 'Hi gorgeous, I am LUMI ✦'}
                            </p>
                            <p style={{fontSize:'0.88rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.7}}>
                                {language==='es' ? 'Antes de empezar, quiero que sepas algo: este no es otro espacio de tips saludables. Este es tu refugio.' : 'Before we start, I want you to know: this is not just another wellness app. This is your sanctuary.'}
                            </p>
                            <p style={{fontSize:'0.88rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.7}}>
                                {language==='es' ? 'Donde puedes confesar que algunos días no te reconoces. Que te asusta lo impredecible que eres. Que nadie entiende esta montaña rusa. Que te sientes sola en este proceso.' : 'Where you can admit that some days you do not recognise yourself. That your unpredictability scares you. That nobody understands this rollercoaster. That you feel alone.'}
                            </p>
                            <p style={{fontSize:'0.9rem',color:'#C9935A',lineHeight:1.6,fontWeight:600}}>
                                {language==='es' ? '¿Sabes qué? Eres de las valientes. ✦' : 'You know what? You are one of the brave ones. ✦'}
                            </p>
                            <p style={{fontSize:'0.88rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.7}}>
                                {language==='es' ? 'Hay dos tipos de mujeres en esta etapa: las que florecen y las que sienten que todo se desmorona. Las dos son completamente normales.' : 'There are two types of women at this stage: those who bloom and those who feel everything is falling apart. Both are completely normal.'}
                            </p>
                            <p style={{fontSize:'0.88rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.7}}>
                                {language==='es' ? 'Voy a ayudarte con menús, ejercicio y entender tu cuerpo... pero también estaré aquí cuando quieras matar a alguien por masticar fuerte 😅, llores viendo un anuncio, o necesites que alguien te diga "no estás loca".' : "I'll help you with menus, exercise and understanding your body... but I'll also be here when you want to kill someone for chewing loudly 😅, cry at a commercial, or need someone to tell you you are not crazy."}
                            </p>
                            <p style={{fontSize:'0.9rem',color:'#C9935A',fontWeight:600,lineHeight:1.5}}>
                                {language==='es' ? 'Somos tú y yo. Tu espacio más seguro. 🌿 ¿Lista?' : 'It is just you and me. Your safest space. 🌿 Ready?'}
                            </p>
                        </div>
                    );
                }

                // Mensajes según contexto
                const messages = {
                    es: {
                        home: {
                            lowSleep: `Hola ${userName}, veo que dormiste poco. Este menú te dará energía estable sin sobrecargar tu cuerpo.`,
                            lowEnergy: `${userName}, tu energía está baja hoy. Los menús de hoy te ayudarán a recuperarla sin forzarte.`,
                            highHotFlashes: `${userName}, tus sofocos están intensos. El menú de hoy tiene alimentos que pueden ayudar a calmarlos.`,
                            lowMood: `${userName}, sé que hoy es difícil. Este menú está pensado para ayudar a tu ánimo desde dentro.`,
                            default: `Hoy es un buen día para escuchar a tu cuerpo, ${userName}. No tienes que hacerlo perfecto. Solo empezar.`
                        },
                        nutrition: {
                            lowSleep: `Veo que dormiste poco, ${userName}. Este menú tiene magnesio y triptófano — dos aliados para que esta noche descanses mejor.`,
                            highHotFlashes: `${userName}, he preparado menús con fitoestrógenos naturales y alimentos que ayudan a regular la temperatura. Muchas mujeres notan la diferencia en días.`,
                            lowEnergy: `${userName}, tu energía está baja. Este menú tiene hierro, vitamina B y carbohidratos de liberación lenta para que te sientas mejor sin forzar nada.`,
                            lowMood: `${userName}, sé que el ánimo no acompaña hoy. El triptófano y el magnesio de estos platos ayudan a tu cuerpo a producir serotonina naturalmente.`,
                            highAnxiety: `${userName}, noto que la ansiedad está presente. Este menú evita estimulantes y tiene alimentos ricos en magnesio que calman el sistema nervioso.`,
                            highBrainFog: `${userName}, para la niebla mental he elegido alimentos ricos en omega-3, colina y antioxidantes. Tu cerebro necesita combustible específico hoy.`,
                            default: `${userName}, cada comida de hoy está pensada para lo que tu cuerpo está viviendo ahora. No tienes que hacerlo perfecto, solo empezar.`
                        },
                        exercise: {
                            lowEnergy: `${userName}, hoy empieza suave. El movimiento ligero puede darte más energía de la que imaginas.`,
                            lowMood: `${userName}, el ejercicio puede ayudar con el ánimo. Empieza con 10 minutos y ve cómo te sientes.`,
                            default: `${userName}, tu cuerpo quiere moverse. Solo necesita que lo escuches y empieces despacio.`
                        }
                    },
                    en: {
                        home: {
                            lowSleep: `Hi ${userName}, I see you didn't sleep well. Today's menu will give you stable energy without overwhelming your body.`,
                            lowEnergy: `${userName}, your energy is low today. Today's menus will help you recover it without forcing yourself.`,
                            highHotFlashes: `${userName}, your hot flashes are intense. Today's menu has foods that may help calm them.`,
                            lowMood: `${userName}, I know today is tough. This menu is designed to help your mood from within.`,
                            default: `Today is a good day to listen to your body, ${userName}. You do not have to do it perfectly. Just start.`
                        },
                        nutrition: {
                            lowSleep: `I see you didn't sleep well, ${userName}. This menu has magnesium and tryptophan — two allies to help you rest better tonight.`,
                            highHotFlashes: `${userName}, I've selected menus with natural phytoestrogens and foods that help regulate temperature. Many women notice the difference within days.`,
                            lowEnergy: `${userName}, your energy is low. This menu has iron, B vitamins and slow-release carbs so you feel better without forcing anything.`,
                            lowMood: `${userName}, I know your mood isn't great today. The tryptophan and magnesium in these dishes help your body produce serotonin naturally.`,
                            highAnxiety: `${userName}, I notice anxiety is present. This menu avoids stimulants and includes magnesium-rich foods that calm the nervous system.`,
                            highBrainFog: `${userName}, for brain fog I've chosen foods rich in omega-3, choline and antioxidants. Your brain needs specific fuel today.`,
                            default: `${userName}, every meal today is designed for what your body is going through right now. You don't have to be perfect, just start.`
                        },
                        exercise: {
                            lowEnergy: `${userName}, start gentle today. Light movement can give you more energy than you imagine.`,
                            lowMood: `${userName}, exercise can help with mood. Start with 10 minutes and see how you feel.`,
                            default: `${userName}, your body wants to move. It just needs you to listen and start slowly.`
                        }
                    }
                };

                const lang = language === 'es' ? 'es' : 'en';
                const pageMessages = messages[lang][page] || messages[lang].home;

                // En free: solo mensaje genérico, sin revelar análisis de síntomas
                if (getUserTier() === 'free') return pageMessages.default;

                // TRIAL y PREMIUM: priorizar mensajes según síntomas
                // Usar el síntoma dominante detectado por el scoring para máxima coherencia
                const dominantForMsg = (() => {
                    if (!todaySymptoms && symptoms.length === 0) return null;
                    const ref = todaySymptoms || symptoms[0] || {};
                    const sf = (camel, snake, def=0) => ref[camel] !== undefined ? ref[camel] : (ref[snake] !== undefined ? ref[snake] : def);
                    const anxiety   = sf('anxiety', 'anxiety', 0);
                    const brainFog  = sf('brainFog', 'brain_fog', 0);
                    const hotFlash  = sf('hotFlashes', 'hot_flashes', 0);
                    const sleep     = sf('sleep', 'sleep', 10);
                    const energy    = sf('energy', 'energy', 10);
                    const mood      = sf('mood', 'mood', 10);
                    const scores = { highAnxiety: anxiety > 5 ? anxiety : 0, highBrainFog: brainFog > 5 ? brainFog : 0, highHotFlashes: hotFlash > 5 ? hotFlash : 0, lowSleep: sleep < 5 ? 10-sleep : 0, lowEnergy: energy < 5 ? 10-energy : 0, lowMood: mood < 5 ? 10-mood : 0 };
                    const top = Object.entries(scores).sort((a,b) => b[1]-a[1])[0];
                    return top[1] > 0 ? top[0] : null;
                })();

                if (dominantForMsg && pageMessages[dominantForMsg]) return pageMessages[dominantForMsg];
                if (hasLowSleep && pageMessages.lowSleep) return pageMessages.lowSleep;
                if (hasHighHotFlashes && pageMessages.highHotFlashes) return pageMessages.highHotFlashes;
                if (hasLowEnergy && pageMessages.lowEnergy) return pageMessages.lowEnergy;
                if (hasLowMood && pageMessages.lowMood) return pageMessages.lowMood;

                return pageMessages.default;
            };

            // ANÁLISIS DE PATRONES REAL (se ejecuta cuando hay 3+ síntomas registrados)
            const analyzePatterns = (data = null) => {
                const syms = data || symptoms;
                if (syms.length < 3) return null;

                const keys = ['sleep', 'energy', 'mood', 'hotFlashes', 'anxiety', 'brainFog', 'memory'];
                const labels = {
                    es: { sleep: 'sueño', energy: 'energía', mood: 'ánimo', hotFlashes: 'sofocos', anxiety: 'ansiedad', brainFog: 'niebla mental', memory: 'memoria' },
                    en: { sleep: 'sleep', energy: 'energy', mood: 'mood', hotFlashes: 'hot flashes', anxiety: 'anxiety', brainFog: 'brain fog', memory: 'memory' }
                };
                const lang = language === 'es' ? 'es' : 'en';
                const patterns = [];

                keys.forEach(key => {
                    const values = syms.map(s => s[key] || 0);
                    const avg = values.reduce((a, b) => a + b, 0) / values.length;
                    const last3 = values.slice(-3);
                    const last3Avg = last3.reduce((a, b) => a + b, 0) / last3.length;

                    // Patrón 1: síntoma consistentemente alto (>=6 en los últimos 3 días)
                    if (last3.every(v => v >= 6) && (key === 'hotFlashes' || key === 'anxiety' || key === 'brainFog')) {
                        patterns.push({
                            type: 'persistent_high',
                            symptom: labels[lang][key],
                            avg: last3Avg.toFixed(1),
                            message: language === 'es'
                                ? `Los últimos 3 días tu ${labels[lang][key]} ha estado alto (promedio ${last3Avg.toFixed(1)}/10). Esto no es casual — tu cuerpo te está diciendo algo.`
                                : `Your ${labels[lang][key]} has been high for the last 3 days (average ${last3Avg.toFixed(1)}/10). This isn't random — your body is telling you something.`
                        });
                    }

                    // Patrón 2: síntoma consistentemente bajo (sueño, energía, ánimo <=4)
                    if (last3.every(v => v <= 4) && (key === 'sleep' || key === 'energy' || key === 'mood')) {
                        patterns.push({
                            type: 'persistent_low',
                            symptom: labels[lang][key],
                            avg: last3Avg.toFixed(1),
                            message: language === 'es'
                                ? `Tu ${labels[lang][key]} ha estado bajo estos últimos días (promedio ${last3Avg.toFixed(1)}/10). Vale la pena que le prestemos atención.`
                                : `Your ${labels[lang][key]} has been low these past days (average ${last3Avg.toFixed(1)}/10). It's worth paying attention to.`
                        });
                    }

                    // Patrón 3: tendencia de empeoramiento (cada día peor que el anterior)
                    if (last3.length === 3 && last3[2] < last3[1] && last3[1] < last3[0] && (key === 'sleep' || key === 'energy' || key === 'mood')) {
                        patterns.push({
                            type: 'worsening',
                            symptom: labels[lang][key],
                            message: language === 'es'
                                ? `Tu ${labels[lang][key]} ha ido bajando los últimos 3 días (${last3[0]} → ${last3[1]} → ${last3[2]}). Es una señal que vale la pena escuchar.`
                                : `Your ${labels[lang][key]} has been dropping over the last 3 days (${last3[0]} → ${last3[1]} → ${last3[2]}). It's a sign worth listening to.`
                        });
                    }

                    // Patrón 4: correlación sueño-energía (sueño bajo = energía baja al día siguiente)
                    if (key === 'sleep' && syms.length >= 2) {
                        let correlation = 0;
                        for (let i = 0; i < syms.length - 1; i++) {
                            if ((syms[i].sleep || 0) <= 3 && (syms[i + 1].energy || 0) <= 4) correlation++;
                        }
                        if (correlation >= 2 && syms.length >= 3) {
                            patterns.push({
                                type: 'correlation',
                                symptom: 'sueño-energía',
                                message: language === 'es'
                                    ? `Hay un patrón claro: los días que duermes poco, al día siguiente tu energía baja. Esto es muy común en esta etapa y hay cosas que podemos hacer al final del día para mejorar el sueño.`
                                    : `There's a clear pattern: on days you sleep less, your energy drops the next day. This is very common at this stage and there are things we can do in the evening to improve sleep.`
                            });
                        }
                    }
                });

                // Si no encontró patrones automáticos, dar insight genérico basado en datos reales
                if (patterns.length === 0) {
                    const avgSleep = (syms.slice(-3).reduce((a, s) => a + (s.sleep || 0), 0) / 3).toFixed(1);
                    const avgEnergy = (syms.slice(-3).reduce((a, s) => a + (s.energy || 0), 0) / 3).toFixed(1);
                    const avgMood = (syms.slice(-3).reduce((a, s) => a + (s.mood || 0), 0) / 3).toFixed(1);
                    patterns.push({
                        type: 'summary',
                        symptom: 'general',
                        message: language === 'es'
                            ? `Estos 3 días tu estado ha sido: sueño ${avgSleep}/10, energía ${avgEnergy}/10, ánimo ${avgMood}/10. Tu PDF de síntomas ya tiene datos suficientes para ver tendencias. ¡Descárgalo desde la sección de Síntomas!`
                            : `These 3 days your status has been: sleep ${avgSleep}/10, energy ${avgEnergy}/10, mood ${avgMood}/10. Your symptoms PDF now has enough data to see trends. Download it from the Symptoms section!`
                    });
                }

                return patterns;
            };

            // VERIFICAR SI DEBE MOSTRAR MODAL DE PATRÓN
            const checkAndShowPattern = (newSymptoms) => {
                if (newSymptoms.length >= 3 && !patternShown) {
                    const result = analyzePatterns(newSymptoms);
                    if (result && result.length > 0) {
                        setPatternResult(result);
                        if (getTrialDaysLeft() <= 1) setShowPatternModal(true);
                        setPatternShown(true);
                    }
                }
            };

            // VERIFICAR SI ESTÁ EN DÍAS DE PERIODO (registró periodo en los últimos 7 días)
            const isInPeriodDays = () => {
                if (periodLog.length === 0) return false;
                const lastPeriod = periodLog[periodLog.length - 1];
                const periodDate = new Date(lastPeriod.date);
                const today = new Date();
                const diffDays = (today - periodDate) / (1000 * 60 * 60 * 24);
                return diffDays <= (lastPeriod.duration || 5);
            };

            // CALCULAR MESES SIN PERIODO
            const getMonthsWithoutPeriod = () => {
                if (periodLog.length === 0) return null;
                const lastPeriod = periodLog[periodLog.length - 1];
                const lastDate = new Date(lastPeriod.date);
                const today = new Date();
                const months = (today.getFullYear() - lastDate.getFullYear()) * 12 + (today.getMonth() - lastDate.getMonth());
                return months;
            };

            // CHAT CON LUMI
            const checkDailyLimit = () => {
                const today = new Date().toDateString();
                if (lastQuestionDate !== today) {
                    setDailyQuestions(0);
                    setLastQuestionDate(today);
                    return true;
                }

                const premium = isPremium();
                if (premium) return true;
                if (dailyQuestions >= 5) return false;
                return true;
            };

            // MARCAR MENSAJES PROACTIVOS COMO LEÍDOS - NUEVO ✨
            const markMessagesAsRead = async () => {
                if (proactiveMessages.length === 0) {
                    // Primer día — mostrar mensaje de bienvenida de LUMI
                    const userName = currentUser?.profile_name || (language === 'es' ? 'amiga' : 'friend');
                    const welcomeMsg = {
                        id: 'welcome_lumi',
                        message_type: 'greeting',
                        content: language === 'es'
                            ? `Hola, ${userName}. Soy LUMI, tu reflejo biológico. Me alegra que hayas cruzado la puerta del santuario.\n\nMi misión es escucharte. Hoy no te pediré imposibles; solo quiero que registres cómo te sientes en Síntomas. Con eso, empezaré a descifrar tu ritmo para que mañana tu menú y tu movimiento sean medicina, no obligación.\n\n¿Por dónde quieres que empecemos a explorar hoy?`
                            : `Hello, ${userName}. I am LUMI, your biological reflection. I am glad you have stepped into the sanctuary.\n\nMy mission is to listen. Today, I will not ask for the impossible; I just want you to log how you feel in Symptoms. With that, I will begin to decode your rhythm so that tomorrow, your menu and movement become medicine, not a chore.\n\nWhere shall we begin exploring today?`,
                        created_at: new Date().toISOString(),
                    };
                    setProactiveMessages([welcomeMsg]);
                    const timer = setTimeout(() => setShowProactiveModal(true), 1500);
                    return () => clearTimeout(timer);
                }

                const messageIds = proactiveMessages.map(m => m.id);

                await supabase
                    .from('lumi_proactive_messages')
                    .update({ read_at: new Date().toISOString() })
                    .in('id', messageIds);

                setUnreadLumiMessages(0);
                setProactiveMessages([]);
            };

            const sendToLumi = async () => {
                if (!lumiInput.trim() || lumiLoading) return;

                // Verificar límite
                if (!checkDailyLimit()) {
                    const limitMsg = language === 'es' 
                        ? 'Has usado tus 5 preguntas diarias. Hazte premium para preguntas ilimitadas 💜'
                        : 'You\'ve used your 5 daily questions. Go premium for unlimited questions 💜';
                    setLumiMessages([...lumiMessages, { role: 'assistant', content: limitMsg }]);
                    return;
                }

                const userMessage = lumiInput.trim();
                setLumiInput('');
                setLumiMessages([...lumiMessages, { role: 'user', content: userMessage }]);
                setLumiLoading(true);

                try {
                    // Contexto de la usuaria
                    const todaySymptoms = symptoms.length > 0 ? symptoms[symptoms.length - 1] : null;
                    const userName = currentUser?.profile_name || 'amiga';

                    const todayStr = todaySymptoms
                        ? (language === 'es'
                            ? '- Hoy: sueño ' + todaySymptoms.sleep + '/10, energía ' + todaySymptoms.energy + '/10, ánimo ' + todaySymptoms.mood + '/10, sofocos ' + (todaySymptoms.hot_flashes||todaySymptoms.hotFlashes||0) + '/10'
                            : '- Today: sleep ' + todaySymptoms.sleep + '/10, energy ' + todaySymptoms.energy + '/10, mood ' + todaySymptoms.mood + '/10, hot flashes ' + (todaySymptoms.hot_flashes||todaySymptoms.hotFlashes||0) + '/10')
                        : (language === 'es' ? '- No ha registrado síntomas hoy' : '- No symptoms logged today');

                    const recentStr = symptoms.length >= 2
                        ? (language === 'es' ? '- Últimos días:\n' : '- Recent days:\n') +
                          symptoms.slice(0, 3).map((s, i) => 
                            (language === 'es' ? '  Día ' : '  Day ') + (i+1) + ': ' +
                            (language === 'es' ? 'sueño ' : 'sleep ') + (s.sleep||'?') + ', ' +
                            (language === 'es' ? 'energía ' : 'energy ') + (s.energy||'?') + ', ' +
                            (language === 'es' ? 'ánimo ' : 'mood ') + (s.mood||'?') + ', ' +
                            (language === 'es' ? 'sofocos ' : 'hot flashes ') + (s.hot_flashes||s.hotFlashes||'?')
                          ).join('\n')
                        : '';

                    const patternStr = symptoms.length >= 3
                        ? (language === 'es'
                            ? '- ANÁLISIS: Si ves que un síntoma se repite o empeora, menciónalo tú primero de forma natural.'
                            : '- PATTERN CHECK: If you see a symptom repeating or worsening, mention it yourself naturally.')
                        : (language === 'es'
                            ? '- Solo tiene ' + symptoms.length + ' día(s) registrados. Anímala a seguir registrando.'
                            : '- Only ' + symptoms.length + ' day(s) logged. Encourage her to keep logging.');

                    const periodStr = isInPeriodDays()
                        ? (language === 'es'
                            ? '- ESTÁ EN PERIODO. Adapta: energía baja es normal, pide mimo no esfuerzo.'
                            : '- SHE IS IN HER PERIOD. Adjust: low energy is normal, care not effort.')
                        : '';

                    const periodLogStr = periodLog.length > 0
                        ? (language === 'es' ? '- Ha registrado ' + periodLog.length + ' período(s).' : '- Has logged ' + periodLog.length + ' period(s).')
                        : (language === 'es' ? '- No ha registrado períodos aún.' : '- No periods logged yet.');

                    const systemPrompt = language === 'es'
                        ? 'Eres Lumi, la coach de wellness de Lumera. Hablas con ' + userName + ', una mujer en esta etapa de cambios hormonales.\n\n' +
                          'Tu personalidad:\n' +
                          '- Cálida, empática, cercana (como una amiga sabia)\n' +
                          '- Empoderador (NO victimista)\n' +
                          '- Práctica (das consejos accionables)\n' +
                          '- Evitas lenguaje médico técnico\n' +
                          '- NUNCA uses "perimenopausia" o "menopausia"\n' +
                          '- Dices "esta etapa", "este momento", "tu cuerpo ahora"\n' +
                          '- Eres una GUÍA proactiva\n\n' +
                          'Datos de ' + userName + ':\n' +
                          todayStr + '\n' + recentStr + '\n' + patternStr + '\n' + periodStr + '\n' + periodLogStr + '\n\n' +
                          'Responde en español, máximo 3-4 líneas, tono conversacional.'
                        : 'You are Lumi, Lumera\'s wellness coach. Talking to ' + userName + ', a woman going through hormonal changes.\n\n' +
                          'Your personality:\n' +
                          '- Warm, empathetic, close (like a wise friend)\n' +
                          '- Empowering (NOT victim-focused)\n' +
                          '- Practical (actionable advice)\n' +
                          '- No technical medical language\n' +
                          '- NEVER say "perimenopause" or "menopause"\n' +
                          '- Say "this stage", "this moment", "your body now"\n' +
                          '- PROACTIVE guide\n\n' +
                          userName + '\'s data:\n' +
                          todayStr + '\n' + recentStr + '\n' + patternStr + '\n' + periodStr + '\n' + periodLogStr + '\n\n' +
                          'Respond in English, max 3-4 lines, conversational tone.';

                    const response = await fetch('https://lumera1.bibianabertuarios.workers.dev', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: 'claude-sonnet-4-20250514',
                            max_tokens: 1000,
                            system: systemPrompt,
                            messages: [
                                ...lumiMessages.filter(m => m.role !== 'assistant' || !m.content.includes('Has usado tus')),
                                { role: 'user', content: userMessage }
                            ]
                        })
                    });

                    const data = await response.json();
                    const assistantMessage = data.content[0].text;

                    setLumiMessages([...lumiMessages, 
                        { role: 'user', content: userMessage },
                        { role: 'assistant', content: assistantMessage }
                    ]);

                    // Incrementar contador
                    setDailyQuestions(dailyQuestions + 1);

                } catch (error) {
                    const errorMsg = language === 'es'
                        ? 'Perdona, tuve un problemita. Intenta de nuevo en un momento 💜'
                        : 'Sorry, I had a little issue. Try again in a moment 💜';
                    setLumiMessages([...lumiMessages, 
                        { role: 'user', content: userMessage },
                        { role: 'assistant', content: errorMsg }
                    ]);
                }

                setLumiLoading(false);
            };

            // HOME
            // LANDING PAGE (sin usuario registrado) - OPTIMIZADO CONVERSIÓN
            const renderLanding = () => {
                return (
                    <div className="min-h-screen flex flex-col">
                        {/* HERO - GANCHO EMOCIONAL + BENEFICIO CONCRETO */}
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="max-w-2xl w-full space-y-8 text-center">
                                {/* Frase principal */}
                                <div className="space-y-4">
                                    <h1 className="text-4xl md:text-5xl font-light leading-tight gradient-text">
                                        {language === 'es' 
                                            ? 'Cuando tu cuerpo cambia, no deberías enfrentarlo sola'
                                            : 'When your body changes, you shouldn\'t face it alone'}
                                    </h1>
                                    <p className="text-xl font-semibold gradient-text">
                                        {language === 'es'
                                            ? 'Para dormir mejor, tener más energía y entender tus síntomas sin drama'
                                            : 'To sleep better, have more energy and understand your symptoms without drama'}
                                    </p>
                                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {language === 'es'
                                            ? 'En 7 días verás qué hábitos empeoran o mejoran tus síntomas. Lumera te acompaña con planes personalizados, sin presión y a tu ritmo.'
                                            : 'In 7 days you\'ll see which habits worsen or improve your symptoms. Lumera supports you with personalized plans, no pressure, at your pace.'}
                                    </p>
                                    <p className={`text-base ${darkMode ? 'text-amber-300' : 'text-amber-700'} font-semibold`}>
                                        {language === 'es'
                                            ? '✨ Pensada para mujeres de LATAM, con ingredientes que realmente encuentras en tu súper'
                                            : '✨ Designed for LATAM women, with ingredients you actually find in your supermarket'}
                                    </p>
                                </div>

                                {/* CTA PRINCIPAL */}
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => setShowAuthModal(true)}
                                        className="w-full md:w-auto bg-gradient-to-r from-rose-400 to-amber-300 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-105"
                                    >
                                        {language === 'es' ? 'Empieza gratis ahora' : 'Start free now'}
                                    </button>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                                        {language === 'es' 
                                            ? '3 días con acceso completo, sin tarjeta. Si no te ayuda a entender al menos un síntoma, simplemente lo dejas.'
                                            : '3 full days, no card required. If it doesn\'t help you understand at least one symptom, just leave.'}
                                    </p>
                                </div>

                                {/* MICRO-PROOF */}
                                <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} rounded-xl p-4 inline-block`}>
                                    <p className={`text-sm ${darkMode ? 'text-indigo-200' : 'text-indigo-900'} font-medium`}>
                                        {language === 'es'
                                            ? '🔬 Diseñado con apoyo de nutrición y ejercicio basados en evidencia para mujeres 40–55'
                                            : '🔬 Designed with evidence-based nutrition and exercise support for women 40–55'}
                                    </p>
                                </div>

                                {/* VALIDACIÓN MICRO */}
                                <div className="flex flex-wrap justify-center gap-6 text-sm pt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">👩</span>
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                            {language === 'es' ? 'Mujeres 40+' : 'Women 40+'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🌎</span>
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                            {language === 'es' ? 'LATAM, Europa, USA' : 'LATAM, Europe, USA'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span style={{fontSize:"1.5rem",color:"#C9935A"}}>✦</span>
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                            {language === 'es' ? 'Acompañamiento diario' : 'Daily support'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NO ES TU CULPA - MUY VISIBLE */}
                        <div className={`${darkMode ? 'bg-stone-900' : 'bg-amber-50'} py-12 px-6`}>
                            <div className="max-w-2xl mx-auto text-center">
                                <p className="text-2xl font-bold gradient-text mb-3">
                                    {language === 'es' 
                                        ? 'No es que estés fallando. Tu cuerpo está cambiando.'
                                        : 'You\'re not failing. Your body is changing.'}
                                </p>
                                <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {language === 'es'
                                        ? 'Y mereces entender qué te pasa, sin juicios ni soluciones extremas.'
                                        : 'And you deserve to understand what\'s happening, without judgment or extreme solutions.'}
                                </p>
                            </div>
                        </div>

                        {/* SECCIÓN: ¿TE PASA ESTO? */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-16 px-6`}>
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-3xl font-bold text-center gradient-text mb-8">
                                    {language === 'es' ? '¿Te pasa esto?' : 'Does this sound familiar?'}
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4 text-base">
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg border-l-4 border-rose-400`}>
                                        <span className="text-rose-500 font-bold">•</span> {language === 'es' ? 'Te despiertas cansada aunque duermas' : 'You wake up tired even when you sleep'}
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg border-l-4 border-rose-400`}>
                                        <span className="text-rose-500 font-bold">•</span> {language === 'es' ? 'Tu cuerpo reacciona distinto a la comida' : 'Your body reacts differently to food'}
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg border-l-4 border-rose-400`}>
                                        <span className="text-rose-500 font-bold">•</span> {language === 'es' ? 'Hay días en que no sabes qué necesitas' : 'Some days you don\'t know what you need'}
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg border-l-4 border-rose-400`}>
                                        <span className="text-rose-500 font-bold">•</span> {language === 'es' ? 'Nadie te explica claramente qué te pasa' : 'No one clearly explains what\'s happening'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TESTIMONIOS ASPIRACIONALES */}
                        <div className={`${darkMode ? 'bg-stone-900' : 'bg-amber-50'} py-12 px-6`}>
                            <div className="max-w-4xl mx-auto">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl border-l-4 border-rose-400`}>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} italic mb-3`}>
                                            {language === 'es'
                                                ? '"Después de una semana, entendí por qué dormía mal los domingos y qué cambiar."'
                                                : '"After a week, I understood why I slept badly on Sundays and what to change."'}
                                        </p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            — {language === 'es' ? 'Usuaria Lumera, 46 años' : 'Lumera user, 46 years old'}
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl border-l-4 border-amber-500`}>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} italic mb-3`}>
                                            {language === 'es'
                                                ? '"Al tercer día ya vi un patrón claro. No sabía que mi café de la tarde me quitaba el sueño."'
                                                : '"By day three I saw a clear pattern. I didn\'t know my afternoon coffee was keeping me awake."'}
                                        </p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            — {language === 'es' ? 'Usuaria Lumera, 52 años' : 'Lumera user, 52 years old'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* POR QUÉ LUMERA ES DISTINTA */}
                        <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} py-16 px-6`}>
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-center gradient-text mb-12">
                                    {language === 'es' ? 'Por qué Lumera es distinta' : 'Why Lumera is different'}
                                </h2>
                                <div className="space-y-6">
                                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl border-l-4 border-amber-500`}>
                                        <h4 className="font-bold text-lg mb-2 gradient-text">
                                            {language === 'es' ? 'No solo cuenta síntomas' : 'Doesn\'t just count symptoms'}
                                        </h4>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {language === 'es'
                                                ? 'Conecta sueño, energía y estado de ánimo para detectar patrones sencillos que tú sola tardarías meses en ver.'
                                                : 'Connects sleep, energy and mood to detect simple patterns that would take you months to see alone.'}
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl border-l-4 border-rose-400`}>
                                        <h4 className="font-bold text-lg mb-2 gradient-text">
                                            {language === 'es' ? 'LUMI habla como una amiga sabia' : 'LUMI speaks like a wise friend'}
                                        </h4>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {language === 'es'
                                                ? 'No como un informe médico. Te acompaña, te explica y te ayuda a decidir sin presión.'
                                                : 'Not like a medical report. Supports you, explains and helps you decide without pressure.'}
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl border-l-4 border-amber-500`}>
                                        <h4 className="font-bold text-lg mb-2 gradient-text">
                                            {language === 'es' ? 'Menús con ingredientes de tu región' : 'Menus with local ingredients'}
                                        </h4>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {language === 'es'
                                                ? 'Se adaptan a tus restricciones (sin lactosa, sin gluten) y a tu región (LATAM, Europa, USA) para usar ingredientes que realmente tienes a mano.'
                                                : 'Adapt to your restrictions (lactose-free, gluten-free) and region (LATAM, Europe, USA) using ingredients you actually have available.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CÓMO FUNCIONA - CON RESULTADOS CONCRETOS */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} py-16 px-6`}>
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-3xl font-bold text-center gradient-text mb-12">
                                    {language === 'es' ? '¿Cómo funciona?' : 'How does it work?'}
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-rose-400 to-amber-300 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{language === 'es' ? 'Registra cómo te sientes' : 'Log how you feel'}</h4>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                                {language === 'es' ? 'Energía, síntomas y estado de ánimo.' : 'Energy, symptoms and mood.'}
                                            </p>
                                            <p className={`text-xs font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                                ⏱ {language === 'es' ? 'En menos de 2 minutos al día' : 'In less than 2 minutes a day'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-rose-400 to-amber-300 text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{language === 'es' ? 'Lumera detecta patrones' : 'Lumera detects patterns'}</h4>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                                {language === 'es' ? 'Conectamos datos para encontrar qué te ayuda.' : 'We connect data to find what helps you.'}
                                            </p>
                                            <p className={`text-xs font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                                🔍 {language === 'es' ? 'LUMI detecta patrones que tú sola tardarías meses en ver' : 'LUMI detects patterns that would take you months to see alone'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-rose-400 to-amber-300 text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{language === 'es' ? 'Recibes tu plan adaptado' : 'Get your adapted plan'}</h4>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                                {language === 'es' ? 'Menús, ejercicios y consejos que cambian según cómo te sientes.' : 'Menus, exercises and advice that change based on how you feel.'}
                                            </p>
                                            <p className={`text-xs font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                                ✨ {language === 'es' ? 'Aplicas cambios pequeños que puedes mantener' : 'Apply small changes you can maintain'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TABLA COMPARATIVA GRATIS VS PREMIUM */}
                        <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} py-16 px-6`}>
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-center gradient-text mb-4">
                                    {language === 'es' ? 'Qué incluye cada opción' : 'What each option includes'}
                                </h2>
                                <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-8`}>
                                    {language === 'es'
                                        ? 'Empieza gratis, pasa a premium solo si ves claro que te ayuda'
                                        : 'Start free, upgrade to premium only if you clearly see it helps'}
                                </p>

                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
                                    <table className="w-full text-sm">
                                        <thead className="bg-gradient-to-r from-rose-400 to-amber-300 text-white">
                                            <tr>
                                                <th className="text-left p-4 font-bold">{language === 'es' ? 'Función' : 'Feature'}</th>
                                                <th className="text-center p-4 font-bold">{language === 'es' ? 'Gratis' : 'Free'}</th>
                                                <th className="text-center p-4 font-bold">Premium</th>
                                            </tr>
                                        </thead>
                                        <tbody className={darkMode ? 'text-gray-300' : 'text-gray-800'}>
                                            <tr className={darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                                                <td className="p-4 font-medium">{language === 'es' ? 'Chat con LUMI' : 'LUMI Chat'}</td>
                                                <td className="p-4 text-center text-amber-600 font-bold">5 {language === 'es' ? 'mensajes/día' : 'messages/day'}</td>
                                                <td className="p-4 text-center text-green-600 font-bold">✅ {language === 'es' ? 'Ilimitado' : 'Unlimited'}</td>
                                            </tr>
                                            <tr className={darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                                                <td className="p-4 font-medium">{language === 'es' ? 'Menús personalizados' : 'Personalized menus'}</td>
                                                <td className="p-4 text-center text-gray-500">1 {language === 'es' ? 'básico semanal' : 'basic weekly'}</td>
                                                <td className="p-4 text-center text-green-600 font-bold">✅ {language === 'es' ? '7 días adaptados' : '7 adapted days'}</td>
                                            </tr>
                                            <tr className={darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                                                <td className="p-4 font-medium">{language === 'es' ? 'Insights de patrones' : 'Pattern insights'}</td>
                                                <td className="p-4 text-center text-gray-500">{language === 'es' ? 'Vista simple' : 'Simple view'}</td>
                                                <td className="p-4 text-center text-green-600 font-bold">✅ {language === 'es' ? 'Insights detallados' : 'Detailed insights'}</td>
                                            </tr>
                                            <tr className={darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                                                <td className="p-4 font-medium">{language === 'es' ? 'Tracker de síntomas' : 'Symptom tracker'}</td>
                                                <td className="p-4 text-center text-green-600 font-bold">✅ {language === 'es' ? 'Ilimitado' : 'Unlimited'}</td>
                                                <td className="p-4 text-center text-green-600 font-bold">✅ {language === 'es' ? 'Ilimitado' : 'Unlimited'}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 font-medium">{language === 'es' ? 'Informes para tu médica' : 'Reports for your doctor'}</td>
                                                <td className="p-4 text-center text-red-600 font-bold">❌</td>
                                                <td className="p-4 text-center text-green-600 font-bold">✅ PDF {language === 'es' ? 'sencillo' : 'simple'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* CTA FINAL */}
                        <div className="py-16 px-6 text-center">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <h2 className="text-3xl font-bold gradient-text">
                                    {language === 'es' 
                                        ? 'Empieza gratis. Quédate solo si te ayuda.'
                                        : 'Start free. Stay only if it helps.'}
                                </h2>
                                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {language === 'es'
                                        ? 'Durante 3 días, LUMI te mostrará al menos un patrón de tus síntomas para que decidas con datos, no con intuición.'
                                        : 'For 3 days, LUMI will show you at least one pattern in your symptoms so you decide with data, not intuition.'}
                                </p>
                                <button 
                                    onClick={() => setShowAuthModal(true)}
                                    className="bg-gradient-to-r from-rose-400 to-amber-300 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-105"
                                >
                                    {language === 'es' ? 'Empieza ahora gratis' : 'Start now free'}
                                </button>
                                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                    {language === 'es' 
                                        ? 'Sin compromiso · Sin tarjeta · Cancela cuando quieras'
                                        : 'No commitment · No card · Cancel anytime'}
                                </p>
                            </div>
                        </div>

                        {/* DISCLAIMER */}
                        <div className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'} italic p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            {language === 'es'
                                ? 'Lumera no sustituye atención médica ni realiza diagnósticos. Es un espacio de acompañamiento y educación para mujeres 40+.'
                                : 'Lumera does not replace medical care or make diagnoses. It is a space for support and education for women 40+.'}
                        </div>
                    </div>
                );
            };

            // ✨ DASHBOARD PREMIUM
            const renderPremiumDashboard = () => {
                const userName = currentUser.profile_name || (language === 'es' ? 'amiga' : 'friend');
                const trialDaysLeft = getTrialDaysLeft();
                const isInTrial = !currentUser.subscription_status || !['active','paid'].includes(currentUser.subscription_status);
                // Día 3 de trial = último día, acceso premium completo para mostrar el valor máximo
                const isTrialDay3 = isInTrial && trialDaysLeft <= 1;

                // (useEffect movido al nivel de LumeraApp para cumplir reglas de hooks)

                return (
                    <div className="pb-32" key={language} style={{background:'#050303',minHeight:'100vh',position:'relative',overflowX:'hidden'}}>
                        <video autoPlay loop muted playsInline src="/videos/premium_bg.mp4"
                            style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0,opacity:0.6,pointerEvents:'none'}}/>
                        <div style={{position:'fixed',inset:0,zIndex:1,pointerEvents:'none',background:'rgba(4,2,1,0.35)'}}>
                            <div style={{position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(184,115,51,0.04) 80px,rgba(184,115,51,0.04) 81px)'}}/>
                        </div>

                        <style>{`
                            @keyframes gpulse{0%,100%{transform:scale(1);opacity:1}33%{transform:scale(1.08);opacity:.85}66%{transform:scale(.95);opacity:.95}}
                            @keyframes gshimmer{0%{background-position:-200% center}100%{background-position:200% center}}
                            .gc{
                                background: rgba(8,5,3,0.25);
                                border: 1.5px solid rgba(184,115,51,0.65);
                                border-radius: 1.25rem;
                                box-shadow: 0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(184,115,51,0.12), inset 0 1px 0 rgba(255,255,255,0.06);
                            }
                            .gch{transition:all 0.3s ease;cursor:pointer}
                            .gch:hover{border-color:rgba(184,115,51,0.7)!important;transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.12),0 0 20px rgba(184,115,51,0.1)!important}
                        `}</style>

                        <div style={{position:'relative',zIndex:2,padding:'0 0 2rem'}}>

                            <div style={{background:'linear-gradient(160deg,rgba(184,115,51,0.18) 0%,rgba(22,16,10,0.95) 60%)',borderBottom:'1px solid rgba(184,115,51,0.20)',padding:'2.5rem 1.5rem 2rem',position:'relative',overflow:'hidden'}}>
                                <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'120px',height:'3px',background:'linear-gradient(90deg,transparent,#B87333,transparent)'}}/>
                                <div style={{display:'inline-flex',alignItems:'center',background:'linear-gradient(135deg,rgba(184,115,51,0.25),rgba(232,200,120,0.15))',border:'1px solid rgba(184,115,51,0.45)',borderRadius:'9999px',padding:'0.3rem 1rem',marginBottom:'1.25rem'}}>
                                    <span style={{fontSize:'0.65rem',fontWeight:700,color:'#B87333',letterSpacing:'0.18em',textTransform:'uppercase'}}>PREMIUM</span>
                                </div>
                                <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'2.5rem',fontWeight:500,color:'#F5E6D3',lineHeight:1.1,marginBottom:'0.75rem'}}>
                                    {language==='es'?'Bienvenida,':'Welcome,'}<br/>
                                    <span style={{background:'linear-gradient(135deg,#B87333,#E8C878,#D4956A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundSize:'200%',animation:'gshimmer 4s linear infinite'}}>{userName}</span>
                                </h1>
                                <p style={{fontSize:'0.92rem',color:'rgba(212,149,106,0.85)',lineHeight:1.6,marginBottom:'1.5rem',fontStyle:'italic',fontFamily:"'Cormorant',serif"}}>
                                    {language==='es'?'Tu santuario. Tu ritmo. Tu transformación.':'Your sanctuary. Your rhythm. Your transformation.'}
                                </p>
                                {currentUser && currentUser.bmi && currentUser.tdee && (
                                    <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
                                        {[{label:'IMC',value:currentUser.bmi,sub:getBMICategory(currentUser.bmi,language)},{label:'TDEE',value:currentUser.tdee,sub:'kcal/día'}].map(({label,value,sub})=>(
                                            <div key={label} style={{background:'rgba(184,115,51,0.12)',border:'1px solid rgba(184,115,51,0.30)',borderRadius:'0.75rem',padding:'0.6rem 1rem',minWidth:'90px'}}>
                                                <p style={{fontSize:'0.62rem',color:'#B87333',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'2px'}}>{label}</p>
                                                <p style={{fontSize:'1.4rem',fontWeight:700,color:'#B87333',lineHeight:1}}>{value}</p>
                                                <p style={{fontSize:'0.65rem',color:'rgba(245,230,211,0.55)',marginTop:'2px'}}>{sub}</p>
                                            </div>
                                        ))}
                                        <div onClick={()=>setShowEditProfile(true)} style={{background:'rgba(184,115,51,0.08)',border:'1px solid rgba(184,115,51,0.20)',borderRadius:'0.75rem',padding:'0.6rem 1rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.4rem'}}>
                                            <span style={{fontSize:'0.72rem',color:'#B87333',fontWeight:600}}>{language==='es'?'Editar perfil':'Edit profile'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{padding:'1.25rem'}}>

                                {symptoms && symptoms.length >= 2 && (()=>{
                                    const last7=symptoms.slice(-7);
                                    const avg=(k)=>{const v=last7.map(s=>s[k]||0).filter(x=>x>0);return v.length?v.reduce((a,b)=>a+b,0)/v.length:0};
                                    const trd=(k)=>{if(last7.length<2)return 0;const h=Math.floor(last7.length/2);const r=last7.slice(-h).map(s=>s[k]||0);const o=last7.slice(0,h).map(s=>s[k]||0);return(r.reduce((a,b)=>a+b,0)/r.length)-(o.reduce((a,b)=>a+b,0)/o.length)};
                                    const eA=avg('energy'),sA=avg('sleep'),mA=avg('mood'),aA=avg('anxiety');
                                    const sT=trd('sleep'),eT=trd('energy'),mT=trd('mood');
                                    const pr=[];
                                    if(sT<-0.5)pr.push(language==='es'?'🌙 Tu sueño ha bajado. Los próximos días pueden traer más cansancio.':'🌙 Sleep has dropped. Coming days may bring more fatigue.');
                                    else if(sT>0.5)pr.push(language==='es'?'🌙 Estás durmiendo mejor. Más energía en los próximos días.':'🌙 Sleeping better. More energy coming up.');
                                    if(eT<-0.5)pr.push(language==='es'?'⚡ Energía bajando. Añade proteína y magnesio esta semana.':'⚡ Energy declining. Add protein and magnesium this week.');
                                    else if(eT>0.5)pr.push(language==='es'?'⚡ Energía subiendo. Aprovecha este pico.':'⚡ Energy rising. Use this peak.');
                                    if(aA>=3.5)pr.push(language==='es'?'🌊 Ansiedad presente. Respiración 4-7-8 antes de comer.':'🌊 Anxiety present. 4-7-8 breathing before meals.');
                                    if(mT<-0.5)pr.push(language==='es'?'🌿 Ánimo fluctuante. Omega-3 y luz solar matutina.':'🌿 Mood fluctuating. Omega-3s and morning sunlight.');
                                    if(pr.length===0)pr.push(language==='es'?'✦ Patrones estables esta semana. Tu cuerpo está respondiendo.':'✦ Stable patterns this week. Your body is responding.');
                                    const ac=[sA<3?(language==='es'?'Magnesio 300mg antes de dormir':'300mg magnesium before sleep'):null,eA<3?(language==='es'?'Proteína en desayuno':'Protein at breakfast'):null,aA>=3.5?(language==='es'?'Respiración 4-7-8 x3 al día':'4-7-8 breathing x3 daily'):null,mA<3?(language==='es'?'10 min luz solar por la mañana':'10 min morning sunlight'):null].filter(Boolean);
                                    return (
                                        <div className="gc" style={{marginBottom:'1rem',padding:'1.5rem',position:'relative',overflow:'hidden'}}>
                                            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:'linear-gradient(90deg,#B87333,#E8C878,#B87333)'}}/>
                                            <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'1rem'}}>
                                                <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#B87333,#E8C878)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>🔮</div>
                                                <div>
                                                    <p style={{fontSize:'0.62rem',color:'#B87333',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase'}}>LUMI PREDICTIVA</p>
                                                    <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.1rem',color:'#F5E6D3',fontWeight:500}}>{language==='es'?'Esta semana te espera esto':'This week ahead for you'}</p>
                                                </div>
                                            </div>
                                            {pr.slice(0,2).map((p,i)=>(
                                                <div key={i} style={{background:'rgba(184,115,51,0.08)',border:'1px solid rgba(184,115,51,0.18)',borderRadius:'0.75rem',padding:'0.75rem 1rem',marginBottom:'0.6rem'}}>
                                                    <p style={{fontSize:'0.87rem',color:'rgba(245,230,211,0.88)',lineHeight:1.55}}>{p}</p>
                                                </div>
                                            ))}
                                            {ac.length>0&&(<div style={{marginTop:'0.75rem'}}>
                                                <p style={{fontSize:'0.62rem',color:'#B87333',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'0.5rem'}}>ACCIONES ESTA SEMANA</p>
                                                {ac.slice(0,3).map((a,i)=>(
                                                    <div key={i} style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.35rem'}}>
                                                        <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#B87333',flexShrink:0}}/>
                                                        <p style={{fontSize:'0.82rem',color:'rgba(212,149,106,0.9)'}}>{a}</p>
                                                    </div>
                                                ))}
                                            </div>)}
                                            <div style={{marginTop:'1rem',paddingTop:'0.75rem',borderTop:'1px solid rgba(184,115,51,0.15)',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                                                <img src="/images/lumi.png" style={{width:'22px',height:'22px',borderRadius:'50%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} alt="LUMI"/>
                                                <p style={{fontSize:'0.75rem',color:'rgba(184,115,51,0.7)',fontStyle:'italic',fontFamily:"'Cormorant',serif"}}>{`LUMI · ${last7.length} ${language==='es'?'registros analizados':'entries analysed'}`}</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="gc" style={{marginBottom:'1rem',overflow:'hidden',padding:0}}>
                                    <div style={{position:'relative'}}>
                                        <img src="/images/acuarela.jpg" alt="Shula Ríos" style={{width:'100%',maxHeight:'200px',objectFit:'cover',display:'block',filter:'brightness(0.85) sepia(0.15)'}} onError={e=>{e.target.style.display='none'}}/>
                                        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 30%,rgba(13,13,13,0.85) 100%)'}}/>
                                        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1rem 1.25rem'}}>
                                            <p style={{fontFamily:"'Cormorant',serif",fontStyle:'italic',color:'rgba(245,230,211,0.9)',fontSize:'0.95rem'}}>{language==='es'?'"No estás sola en este camino."':'"You are not alone on this path."'}</p>
                                            <p style={{fontSize:'0.62rem',color:'rgba(184,115,51,0.7)',marginTop:'4px'}}>Arte original · Shula Ríos</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{marginBottom:'1rem'}}>
                                    <p style={{fontSize:'0.62rem',color:'#B87333',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'0.75rem'}}>{language==='es'?'TU ESPACIO':'YOUR SPACE'}</p>
                                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem'}}>
                                        {[
                                            {img:'/images/modo_ritual.png',es:'Síntomas',en:'Symptoms',page:'symptoms',des:'Registra tu día',den:'Log your day'},
                                            {img:'/images/nutri_huevo.png',es:'Nutrición',en:'Nutrition',page:'nutrition',des:'Tu menú hoy',den:'Your menu today'},
                                            {img:'/images/ejer_fuerza.png',es:'Ejercicio',en:'Exercise',page:'exercise',des:'Movimiento',den:'Movement'},
                                            {img:'/images/lumi.png',es:'LUMI',en:'LUMI',page:'chat',des:'Tu guía amiga',den:'Your guide'},
                                            {img:'/images/nutri_progreso.png',es:'Progreso',en:'Progress',page:'progreso',des:'Tus patrones',den:'Your patterns'},
                                            {img:'/images/modo_cueva.png',es:'Período',en:'Period',page:'period',des:'Tu ciclo',den:'Your cycle'},
                                        ].map((item,i)=>(
                                            <div key={i} className="gc gch" onClick={()=>setCurrentPage(item.page)} style={{padding:'1rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                                                <img src={item.img} style={{width:'42px',height:'42px',borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'1px solid rgba(184,115,51,0.3)',boxShadow:'0 0 12px rgba(184,115,51,0.15)'}}/>
                                                <div>
                                                    <p style={{fontSize:'0.88rem',fontWeight:600,color:'#F5E6D3',fontFamily:"'Cormorant',serif"}}>{language==='es'?item.es:item.en}</p>
                                                    <p style={{fontSize:'0.7rem',color:'rgba(184,115,51,0.7)'}}>{language==='es'?item.des:item.den}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="gc" style={{marginBottom:'1rem',padding:'1.25rem'}}>
                                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:!isInTrial?'1rem':'0'}}>
                                        <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#B87333,#E8C878)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                            <span style={{fontSize:'0.8rem',color:'#0D0D0D',fontWeight:700}}>P</span>
                                        </div>
                                        <div style={{flex:1}}>
                                            <p style={{fontSize:'0.78rem',fontWeight:600,color:'#B87333'}}>{isTrialDay3?(language==='es'?'Último día de prueba':'Last trial day'):isInTrial?(language==='es'?`Trial activo · ${trialDaysLeft} días`:`Trial · ${trialDaysLeft} days`):(language==='es'?'Premium activa':'Premium active')}</p>
                                            <p style={{fontSize:'0.72rem',color:'rgba(184,115,51,0.65)'}}>{language==='es'?'Acceso completo a Lumera':'Full access to Lumera'}</p>
                                        </div>
                                    </div>
                                    {!isInTrial&&(
                                        <button onClick={handleCancelSubscription} style={{background:'none',border:'1px solid rgba(184,115,51,0.2)',borderRadius:'0.5rem',padding:'0.45rem 1rem',fontSize:'0.75rem',color:'rgba(184,115,51,0.5)',cursor:'pointer',width:'100%'}} onMouseEnter={e=>{e.target.style.borderColor='rgba(239,68,68,0.5)';e.target.style.color='rgba(239,68,68,0.7)'}} onMouseLeave={e=>{e.target.style.borderColor='rgba(184,115,51,0.2)';e.target.style.color='rgba(184,115,51,0.5)'}}>
                                            {language==='es'?'Cancelar suscripción':'Cancel subscription'}
                                        </button>
                                    )}
                                </div>

                                <div style={{textAlign:'center',padding:'1rem 0 0.5rem',borderTop:'1px solid rgba(184,115,51,0.12)'}}>
                                    <p style={{fontFamily:"'Cormorant',serif",fontStyle:'italic',fontSize:'1rem',color:'rgba(245,230,211,0.5)',lineHeight:1.6}}>{language==='es'?'"Conocerte mejor es el primer paso para cuidarte mejor."':'"Knowing yourself better is the first step to caring for yourself better."'}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                );
            };

            const renderHome = () => {
                if (!currentUser) return renderLanding();

                const userName = currentUser.profile_name || (language === 'es' ? 'amiga' : 'friend');
                const trialDaysForRouting = getTrialDaysLeft();

                // Premium activo → su propio dashboard
                if (['active','paid'].includes(currentUser?.subscription_status)) {
                    return renderPremiumDashboard();
                }

                // Trial (días 1, 2 y 3) → dashboard de onboarding + conversión
                const trialDaysLeft = trialDaysForRouting;
                const dayNum = Math.max(1, 4 - trialDaysLeft); // día 1, 2 o 3

                const isPremiumUser = ['active','paid'].includes(currentUser?.subscription_status);
                const bgCard = isPremiumUser ? 'rgba(22,14,6,0.88)' : (darkMode ? '#1c1917' : '#ffffff');
                const bgPage = isPremiumUser ? '#0D0A06' : (darkMode ? '#0c0a09' : '#fafaf9');
                const bgAccent = isPremiumUser ? 'rgba(184,115,51,0.12)' : (darkMode ? 'rgba(201,147,90,0.08)' : 'rgba(253,248,243,0.95)');
                const borderColor = isPremiumUser ? 'rgba(184,115,51,0.25)' : 'rgba(201,147,90,0.15)';
                const tMain = isPremiumUser ? '#F5E6D3' : (darkMode ? '#fdf8f3' : '#1c1917');
                const tSub = isPremiumUser ? 'rgba(212,149,106,0.8)' : (darkMode ? '#a8a29e' : '#78716c');
                const textMain = darkMode ? '#e7e5e4' : '#292524';
                const textSub = darkMode ? '#a8a29e' : '#78716c';
                const borderSoft = darkMode ? 'rgba(201,147,90,0.18)' : 'rgba(201,147,90,0.15)';

                return (
                    <div className="pb-32 space-y-6" key={language} style={{background: bgPage, position: 'relative'}}>
                        <video autoPlay loop muted playsInline src="/videos/Dashboard.mp4" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.18}} />
                        <video autoPlay loop muted playsInline src="/videos/Dashboard.mp4" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.18}} />

                        {/* ── HERO DINÁMICO ── */}
                        {(() => {
                            const tier = getUserTier();
                            const userName = currentUser?.profile_name || (language === 'es' ? 'amiga' : 'friend');
                            const todayS = symptoms.length > 0 ? symptoms[symptoms.length - 1] : null;
                            const hasLowSleep = todayS && (todayS.sleep || todayS.sleepQuality || 0) <= 3;
                            const hasLowEnergy = todayS && (todayS.energy || todayS.energyLevel || 0) <= 3;
                            const hasHighAnxiety = todayS && (todayS.anxiety || todayS.anxietyLevel || 0) >= 4;
                            const hasLowMood = todayS && (todayS.mood || todayS.moodLevel || 0) <= 3;

                            let mode = 'ritual';
                            if (hasLowEnergy || hasLowSleep) mode = 'cueva';
                            else if (hasHighAnxiety || hasLowMood) mode = 'tormenta';
                            else if (todayS && (todayS.energy || 0) >= 4 && (todayS.mood || 0) >= 4) mode = 'diosa';

                            const modeConfig = {
                                cueva: {
                                    bg: 'linear-gradient(135deg,#2d1f14 0%,#5c3d22 100%)',
                                    img: '/images/modo_cueva.png',
                                    label: language==='es'?'Modo cueva':'Cave mode',
                                    msg: language==='es'?`Hoy no tienes que poder con todo, ${userName}. Tu cuerpo está procesando algo importante. Yo me encargo del resto.`:`You don't have to handle everything today, ${userName}. Your body is processing something important. I've got the rest.`,
                                },
                                diosa: {
                                    bg: 'linear-gradient(135deg,#7a4f1a 0%,#C9935A 100%)',
                                    img: '/images/modo_diosa.png',
                                    label: language==='es'?'Modo diosa':'Goddess mode',
                                    msg: language==='es'?`Hoy tu cuerpo está brillando, ${userName}. Lo noto en tus datos. Aprovechamos esta energía juntas.`:`Your body is shining today, ${userName}. I can see it in your data. Let's use this energy together.`,
                                },
                                tormenta: {
                                    bg: 'linear-gradient(135deg,#1a2535 0%,#2d4a7a 100%)',
                                    img: '/images/modo_tormenta.png',
                                    label: language==='es'?'Modo tormenta':'Storm mode',
                                    msg: language==='es'?`No estás loca, ${userName}. Lo que sientes tiene nombre y tiene solución. Hoy vamos despacio.`:`You're not crazy, ${userName}. What you feel has a name and a solution. We go slow today.`,
                                },
                                ritual: {
                                    bg: 'linear-gradient(135deg,#1a2d1f 0%,#3d6645 100%)',
                                    img: '/images/modo_ritual.png',
                                    label: language==='es'?'Modo ritual':'Ritual mode',
                                    msg: language==='es'?`Un día tranquilo también es un regalo, ${userName}. Tu cuerpo está hablando en voz baja hoy.`:`A calm day is also a gift, ${userName}. Your body is speaking softly today.`,
                                },
                            };

                            const cfg = modeConfig[mode];

                            const completedActions = [
                                symptoms.length > 0,
                                true,
                                true,
                                false,
                            ].filter(Boolean).length;
                            const progressPct = Math.round((completedActions / 4) * 100);

                            return (
                                <div>
                                    {/* ¿En qué nos centramos hoy? */}
                                    <div style={{background:darkMode?'rgba(255,255,255,0.04)':'white',borderRadius:'1.25rem',padding:'1.1rem 1.25rem',marginBottom:'12px',border:'1px solid rgba(201,147,90,0.15)'}}>
                                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.15rem',fontWeight:500,color:darkMode?'#fdf8f3':'#1c1917',margin:'0 0 10px'}}>
                                            {language==='es'?'¿En qué nos centramos hoy?':'What do we focus on today?'}
                                        </p>
                                        <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                                            {[
                                                {es:'Sueño',en:'Sleep',icon:''},
                                                {es:'Energía',en:'Energy',icon:''},
                                                {es:'Ánimo',en:'Mood',icon:''},
                                                {es:'Sofocos',en:'Hot flashes',icon:''},
                                                {es:'Ansiedad',en:'Anxiety',icon:''},
                                                {es:'Niebla mental',en:'Brain fog',icon:''},
                                            ].map((s,i) => (
                                                <div key={i} onClick={()=>setCurrentPage('symptoms')} style={{
                                                    background:darkMode?'rgba(201,147,90,0.1)':'rgba(253,248,243,0.9)',
                                                    border:'1px solid rgba(201,147,90,0.25)',
                                                    borderRadius:'9999px',
                                                    padding:'0.35rem 0.85rem',
                                                    fontSize:'0.82rem',
                                                    color:darkMode?'#e8d5c0':'#57534e',
                                                    cursor:'pointer',
                                                    display:'flex',
                                                    alignItems:'center',
                                                    gap:'5px',
                                                    transition:'all 0.2s',
                                                }}
                                                onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,147,90,0.2)';e.currentTarget.style.color='#C9935A'}}
                                                onMouseLeave={e=>{e.currentTarget.style.background=darkMode?'rgba(201,147,90,0.1)':'rgba(253,248,243,0.9)';e.currentTarget.style.color=darkMode?'#e8d5c0':'#57534e'}}
                                                >
                                                    <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#C9935A',display:'inline-block',marginRight:'5px',flexShrink:0}}/>
                                                    <span style={{fontSize:'0.82rem'}}>{language==='es'?s.es:s.en}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hero card — evoluciona por día */}
                                    <div style={{
                                        borderRadius:'1.5rem',padding:'1.5rem',marginBottom:'12px',
                                        background: dayNum === 3
                                            ? `linear-gradient(160deg, rgba(13,8,3,0.92) 0%, ${cfg.bg.replace('linear-gradient(135deg,','').split(')')[0].split(',').pop().trim()} 100%)`
                                            : cfg.bg,
                                        position:'relative',overflow:'hidden',
                                        boxShadow: dayNum === 3 ? '0 0 40px rgba(184,115,51,0.25), inset 0 0 60px rgba(0,0,0,0.3)' :
                                                   dayNum === 2 ? '0 0 20px rgba(201,147,90,0.15)' : 'none',
                                        border: dayNum >= 2 ? '1px solid rgba(184,115,51,0.3)' : 'none',
                                        transition: 'all 1s ease',
                                    }}>
                                        {/* Esfera cobre — aparece día 2+ */}
                                        {/* Imagen del modo — fondo completo */}
                                        {cfg.img && <img src={cfg.img} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.25,filter:'brightness(0.8) saturate(1.2)',pointerEvents:'none',zIndex:0,borderRadius:'1.5rem'}}/>}
                                        {dayNum >= 2 && <div style={{position:'absolute',top:0,right:0,width:'140px',height:'140px',background:`radial-gradient(circle, rgba(184,115,51,${dayNum===3?'0.35':'0.18'}), transparent)`,borderRadius:'50%',transform:'translate(40px,-40px)',animation:'pulse 4s ease-in-out infinite'}}/>}
                                        {dayNum === 1 && <div style={{position:'absolute',top:0,right:0,width:'120px',height:'120px',background:'rgba(255,255,255,0.04)',borderRadius:'50%',transform:'translate(30px,-30px)'}}/>}
                                        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}`}</style>

                                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                                            <p style={{fontSize:'0.72rem',color: dayNum===3?'rgba(232,200,120,0.9)':'rgba(255,255,255,0.7)',letterSpacing:'0.12em',textTransform:'uppercase',margin:0}}>{cfg.label}</p>
                                            <div style={{
                                                background: dayNum===3?'linear-gradient(135deg,rgba(184,115,51,0.4),rgba(232,200,120,0.25))':
                                                            dayNum===2?'rgba(184,115,51,0.2)':'rgba(255,255,255,0.15)',
                                                border: dayNum>=2?'1px solid rgba(184,115,51,0.4)':'none',
                                                borderRadius:'9999px',padding:'0.2rem 0.75rem',fontSize:'0.72rem',
                                                color: dayNum>=2?'#E8C878':'white',
                                                backdropFilter:'blur(4px)',
                                            }}>
                                                {dayNum===1
                                                    ?(language==='es'?'✦ Iniciando sintonía...':'✦ Beginning alignment...')
                                                    :dayNum===2
                                                        ?(language==='es'?'✦ Descubriendo tus patrones...':'✦ Discovering your patterns...')
                                                        :(language==='es'?'✦ Tu santuario está casi listo':'✦ Your sanctuary is almost ready')}
                                            </div>
                                        </div>
                                        <h2 style={{fontFamily:"'Cormorant',serif",fontSize:'1.9rem',fontWeight:500,color:'white',margin:'0 0 8px',lineHeight:1.2}}>
                                            {language==='es'?`Hola, ${userName}`:`Hi, ${userName}`}
                                        </h2>
                                        <div style={{display:'flex',alignItems:'flex-start',gap:'10px',marginBottom:'16px'}}>
                                            <img src="/images/lumi.png" style={{width:'32px',height:'32px',borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'2px solid rgba(201,147,90,0.6)'}} alt="LUMI"/>
                                            <p style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.88)',lineHeight:1.6,margin:0,fontStyle:'italic'}}>{cfg.msg}</p>
                                        </div>
                                        {/* Barra progreso */}
                                        <div>
                                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                                                <p style={{fontSize:'0.72rem',color: dayNum===3?'rgba(232,200,120,0.8)':'rgba(255,255,255,0.65)',margin:0}}>
                                                    {dayNum===1
                                                        ?(language==='es'?'Iniciando sintonía con tu cuerpo...':'Beginning alignment with your body...')
                                                        :dayNum===2
                                                            ?(language==='es'?'Descubriendo tus patrones de GLP-1 y cortisol...':'Discovering your GLP-1 and cortisol patterns...')
                                                            :(language==='es'?'La claridad te espera. Un paso más.':'Clarity awaits. One more step.')}
                                                </p>
                                                <p style={{fontSize:'0.72rem',color:'rgba(201,147,90,0.9)',margin:0,fontWeight:600}}>{progressPct}%</p>
                                            </div>
                                            <div style={{background:'rgba(255,255,255,0.15)',borderRadius:'9999px',height:'5px'}}>
                                                <div style={{background:'linear-gradient(to right,#C9935A,#e8c89f)',borderRadius:'9999px',height:'100%',width:`${progressPct}%`,transition:'width 0.5s ease'}}/>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tip del día */}
                                    {(() => {
                                        const tips_es = {
                                            cueva: '🌿 El magnesio del aguacate reduce el cortisol que te roba energía. Ponlo hoy en el desayuno.',
                                            diosa: '⚡ Tu energía alta es el momento ideal para el ejercicio de fuerza. Aprovecha la ventana de hoy.',
                                            tormenta: '🌊 La respiración 4-4-6 activa el nervio vago y frena la ansiedad en 3 minutos.',
                                            ritual: '✦ Un día tranquilo es cuando tu cuerpo consolida los cambios. Descansa sin culpa.',
                                        };
                                        const tips_en = {
                                            cueva: '🌿 Avocado magnesium reduces the cortisol stealing your energy. Have it at breakfast today.',
                                            diosa: '⚡ High energy is the perfect time for strength training. Use todays window.',
                                            tormenta: '🌊 4-4-6 breathing activates the vagus nerve and stops anxiety in 3 minutes.',
                                            ritual: '✦ A calm day is when your body consolidates changes. Rest without guilt.',
                                        };
                                        return (
                                            <div style={{background:darkMode?'rgba(201,147,90,0.08)':'rgba(253,248,243,0.95)',borderRadius:'1.1rem',padding:'0.85rem 1.1rem',marginBottom:'12px',border:'1px solid rgba(201,147,90,0.2)'}}>
                                                <p style={{fontSize:'0.7rem',color:'#C9935A',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',margin:'0 0 4px'}}>{language==='es'?'✦ Aprendizaje de hoy':'✦ Todays insight'}</p>
                                                <p style={{fontSize:'0.85rem',color:darkMode?'#e8d5c0':'#57534e',margin:0,lineHeight:1.55}}>{language==='es'?tips_es[mode]:tips_en[mode]}</p>
                                            </div>
                                        );
                                    })()}

                                    {/* 4 tarjetas expandibles */}
                                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                                        {[
                                            {
                                                img:'/images/sintomas.png',
                                                es:'Síntomas',en:'Symptoms',
                                                desc_es:'Cuéntame tu día',desc_en:'Tell me about your day',
                                                detail_es:'Registra cómo te sientes para que LUMI pueda acompañarte mejor hoy.',
                                                detail_en:'Log how you feel so LUMI can support you better today.',
                                                page:'symptoms'
                                            },
                                            {
                                                img:'/images/menu.png',
                                                es:'Nutrición',en:'Nutrition',
                                                desc_es:'Lo que necesitas hoy',desc_en:'What you need today',
                                                detail_es:'Tu menú adaptado a cómo te sientes. Cambia cada día contigo.',
                                                detail_en:'Your menu adapted to how you feel. Changes with you every day.',
                                                page:'nutrition'
                                            },
                                            {
                                                img:'/images/ejercicio.png',
                                                es:'Ejercicio',en:'Exercise',
                                                desc_es:'Movimiento a tu medida',desc_en:'Movement your way',
                                                detail_es:'Rutina pensada para esta etapa. Sin forzar, con propósito.',
                                                detail_en:'Routine designed for this stage. No forcing, with purpose.',
                                                page:'exercise'
                                            },
                                            {
                                                img:'/images/lumi.png',
                                                es:'LUMI',en:'LUMI',
                                                desc_es:'Tu espacio seguro ✦',desc_en:'Your safe space ✦',
                                                detail_es:'Cuéntame lo que no le dices a nadie. Aquí no hay juicios.',
                                                detail_en:'Tell me what you dont tell anyone. No judgement here.',
                                                page:'chat'
                                            },
                                        ].map((action,i) => (
                                            <div key={i} style={{
                                                borderRadius:'1.25rem',
                                                overflow:'hidden',
                                                background:darkMode?'rgba(255,255,255,0.06)':'white',
                                                border:'1px solid rgba(201,147,90,0.15)',
                                                boxShadow:'0 2px 16px rgba(201,147,90,0.08)',
                                                cursor:'pointer',
                                            }}
                                            onClick={()=>setCurrentPage(action.page)}
                                            >
                                                <div style={{position:'relative',height:'90px',overflow:'hidden'}}>
                                                    <img src={action.img} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
                                                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.4))'}}/>
                                                </div>
                                                <div style={{padding:'0.75rem'}}>
                                                    <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.05rem',fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',margin:'0 0 3px'}}>{language==='es'?action.es:action.en}</p>
                                                    <p style={{fontSize:'0.75rem',color:'#C9935A',margin:0,lineHeight:1.3}}>{language==='es'?action.desc_es:action.desc_en}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}


                        {/* ── CARTA DEL ORÁCULO ── */}
                        {(() => {
                            const todayS = symptoms.length > 0 ? symptoms[symptoms.length - 1] : null;
                            const hasLowSleep = todayS && (todayS.sleep || 0) <= 3;
                            const hasHighHotFlashes = todayS && (todayS.hotFlashes || todayS.hot_flashes || 0) >= 4;
                            const hasHighAnxiety = todayS && (todayS.anxiety || 0) >= 4;
                            const hasLowEnergy = todayS && (todayS.energy || 0) <= 2;
                            const hasHighEnergy = todayS && (todayS.energy || 0) >= 4 && (todayS.mood || 0) >= 4;
                            const hasLowMood = todayS && (todayS.mood || 0) <= 3;

                            let sintoma = 'flor';
                            if (hasLowSleep) sintoma = 'luna';
                            else if (hasHighHotFlashes) sintoma = 'llama';
                            else if (hasHighAnxiety) sintoma = 'marea';
                            else if (hasLowEnergy) sintoma = 'niebla';
                            else if (hasHighEnergy) sintoma = 'rayo';

                            let animo = 'ritual';
                            if (hasHighEnergy) animo = 'diosa';
                            else if (hasLowEnergy || hasLowSleep) animo = 'cueva';
                            else if (hasHighAnxiety || hasLowMood) animo = 'tormenta';

                            const cartas = {
                                luna: {
                                    symbol: '🌙', nombre_es: 'Carta Luna', nombre_en: 'Moon Card',
                                    color_from: '#1a1f3a', color_to: '#2d3561',
                                    variantes: {
                                        tormenta: { titulo_es: 'Luna Oscura', titulo_en: 'Dark Moon', msg_es: 'Tu cuerpo pide oscuridad y silencio. La luna mengua para renovarse. Tú también.', msg_en: 'Your body asks for darkness and silence. The moon wanes to renew. So do you.', menu_es: 'Crema de calabaza con nuez moscada — regula la melatonina', menu_en: 'Pumpkin cream with nutmeg — regulates melatonin', ej_es: 'Respiración 4-4-6 tumbada. 5 min antes de apagar la luz', ej_en: '4-4-6 breathing lying down. 5 min before lights out' },
                                        cueva: { titulo_es: 'Luna Serena', titulo_en: 'Serene Moon', msg_es: 'La cueva que buscas esta noche es sagrada. Tu cuerpo sabe que necesita restaurarse.', msg_en: 'The cave you seek tonight is sacred. Your body knows it needs to restore.', menu_es: 'Infusión de valeriana + chocolate 85%', menu_en: 'Valerian tea + 85% dark chocolate', ej_es: 'Estiramiento de cadera en el suelo. 3 minutos', ej_en: 'Hip stretch on the floor. 3 minutes' },
                                        ritual: { titulo_es: 'Luna Llena', titulo_en: 'Full Moon', msg_es: 'Un día tranquilo es cuando la luna se prepara para brillar. Descansa sin culpa.', msg_en: 'A calm day is when the moon prepares to shine. Rest without guilt.', menu_es: 'Yogur griego con semillas de lino molidas', menu_en: 'Greek yogurt with ground flaxseeds', ej_es: 'Kegel suave x10 mientras preparas la cena', ej_en: 'Gentle Kegel x10 while making dinner' },
                                        diosa: { titulo_es: 'Luna Nueva', titulo_en: 'New Moon', msg_es: 'Tienes energía pero el sueño te falla. Tu cuerpo está en transición — nuevo ciclo en marcha.', msg_en: 'You have energy but sleep fails you. Your body is in transition — new cycle beginning.', menu_es: 'Plátano con almendras antes de dormir', menu_en: 'Banana with almonds before bed', ej_es: 'Caminata meditativa 10 min antes de dormir', ej_en: '10 min meditative walk before bed' },
                                    }
                                },
                                llama: {
                                    symbol: '🔥', nombre_es: 'Carta Llama', nombre_en: 'Flame Card',
                                    color_from: '#7a2510', color_to: '#c44b1a',
                                    variantes: {
                                        tormenta: { titulo_es: 'Llama Viva', titulo_en: 'Living Flame', msg_es: 'El fuego interno y la tormenta se encuentran hoy. No los apagues — transfórmalos.', msg_en: 'Inner fire and storm meet today. Transform them.', menu_es: 'Infusión de salvia fría — el remedio más estudiado para sofocos', menu_en: 'Cold sage infusion — most studied remedy for hot flashes', ej_es: 'Respiración refrescante: inhala 4, exhala 8. Repite 6 veces', ej_en: 'Cooling breath: inhale 4, exhale 8. Repeat 6 times' },
                                        cueva: { titulo_es: 'Llama Interior', titulo_en: 'Inner Flame', msg_es: 'Tu cuerpo arde por dentro mientras pide calma por fuera. Ambas cosas pueden coexistir.', msg_en: 'Your body burns inside while asking for calm outside. Both can coexist.', menu_es: 'Ensalada de rúcula, pepino y semillas de lino', menu_en: 'Rocket, cucumber and flaxseed salad', ej_es: 'Estiramientos suaves en el suelo. Sin calor, sin presión', ej_en: 'Gentle stretches on the floor. No heat, no pressure' },
                                        ritual: { titulo_es: 'Llama Sagrada', titulo_en: 'Sacred Flame', msg_es: 'El calor que sientes es tu cuerpo hablando. Escúchalo con curiosidad, no con miedo.', msg_en: 'The heat you feel is your body speaking. Listen with curiosity, not fear.', menu_es: 'Tofu salteado con sésamo y jengibre', menu_en: 'Stir-fried tofu with sesame and ginger', ej_es: 'Yoga suave: postura del niño 5 minutos', ej_en: 'Gentle yoga: child pose 5 minutes' },
                                        diosa: { titulo_es: 'Llama Dorada', titulo_en: 'Golden Flame', msg_es: 'Energía de diosa y fuego interno juntos. Eres poderosa incluso cuando ardes.', msg_en: 'Goddess energy and inner fire together. You are powerful even when you burn.', menu_es: 'Salmón con aguacate y semillas — omega-3 que regula la temperatura', menu_en: 'Salmon with avocado and seeds — omega-3 regulates temperature', ej_es: 'Aprovecha la energía: 15 min caminata rápida por la mañana', ej_en: 'Use that energy: 15 min brisk walk in the morning' },
                                    }
                                },
                                marea: {
                                    symbol: '🌊', nombre_es: 'Carta Marea', nombre_en: 'Tide Card',
                                    color_from: '#0f2d4a', color_to: '#1a5276',
                                    variantes: {
                                        tormenta: { titulo_es: 'Marea Alta', titulo_en: 'High Tide', msg_es: 'Las mareas suben. Tú no eres la tormenta — eres el océano entero. Esto también pasa.', msg_en: 'Tides rise. You are not the storm — you are the whole ocean. This too shall pass.', menu_es: 'Avena caliente con canela y nueces — magnesio que calma el sistema nervioso', menu_en: 'Warm oats with cinnamon and walnuts — magnesium calms the nervous system', ej_es: 'Respiración cuadrada 4-4-4-4. Solo 3 minutos', ej_en: 'Box breathing 4-4-4-4. Just 3 minutes' },
                                        cueva: { titulo_es: 'Marea Profunda', titulo_en: 'Deep Tide', msg_es: 'La cueva y el mar hoy. Necesitas profundidad y silencio. Dátelos sin culpa.', msg_en: 'Cave and sea today. You need depth and silence. Give them to yourself.', menu_es: 'Caldo de verduras casero con jengibre', menu_en: 'Homemade vegetable broth with ginger', ej_es: 'Caminar 10 minutos sola, sin música ni móvil', ej_en: 'Walk 10 minutes alone, no music no phone' },
                                        ritual: { titulo_es: 'Marea Serena', titulo_en: 'Serene Tide', msg_es: 'Ansiedad suave en un día tranquilo. Tu cuerpo está regulándose. Confía en el proceso.', msg_en: 'Gentle anxiety on a calm day. Your body is regulating. Trust the process.', menu_es: 'Infusión de manzanilla con miel cruda', menu_en: 'Chamomile tea with raw honey', ej_es: 'Estiramiento de psoas 3 minutos — donde el cuerpo almacena el estrés', ej_en: 'Psoas stretch 3 minutes — where the body stores stress' },
                                        diosa: { titulo_es: 'Marea Brillante', titulo_en: 'Bright Tide', msg_es: 'Energía de diosa con ansiedad de fondo. Esa tensión creativa también es poder.', msg_en: 'Goddess energy with background anxiety. That creative tension is also power.', menu_es: 'Chocolate negro 85% + una naranja — dopamina y vitamina C', menu_en: '85% dark chocolate + an orange — dopamine and vitamin C', ej_es: 'Canaliza la energía: 20 sentadillas lentas y controladas', ej_en: 'Channel the energy: 20 slow controlled squats' },
                                    }
                                },
                                niebla: {
                                    symbol: '🌫️', nombre_es: 'Carta Niebla', nombre_en: 'Mist Card',
                                    color_from: '#2a2a35', color_to: '#4a4a5a',
                                    variantes: {
                                        tormenta: { titulo_es: 'Niebla Densa', titulo_en: 'Dense Mist', msg_es: 'La niebla más la tormenta. Tu cerebro necesita un descanso urgente. Dáselo.', msg_en: 'Mist and storm. Your brain needs urgent rest. Give it.', menu_es: 'Huevos revueltos con aguacate — colina y omega-3 para el cerebro', menu_en: 'Scrambled eggs with avocado — choline and omega-3 for the brain', ej_es: 'Solo caminar 5 minutos al aire libre. El oxígeno es el primer remedio', ej_en: 'Just walk 5 minutes outdoors. Oxygen is the first remedy' },
                                        cueva: { titulo_es: 'Niebla Suave', titulo_en: 'Soft Mist', msg_es: 'La niebla no dura. Detrás siempre hay claridad. Hoy descansa — mañana ves más lejos.', msg_en: 'The mist does not last. Behind it there is always clarity. Rest today.', menu_es: 'Nueces y arándanos — el snack más estudiado para la memoria', menu_en: 'Walnuts and blueberries — most studied snack for memory', ej_es: 'Rotación de hombros y cuello 2 minutos', ej_en: 'Shoulder and neck rotation 2 minutes' },
                                        ritual: { titulo_es: 'Niebla Clara', titulo_en: 'Clear Mist', msg_es: 'La claridad llega después de la niebla. Hoy plantas la semilla — mañana florece.', msg_en: 'Clarity comes after the mist. Today you plant the seed — tomorrow it blooms.', menu_es: 'Salmón al horno con brócoli — omega-3 que regenera conexiones neuronales', menu_en: 'Baked salmon with broccoli — omega-3 that regenerates neural connections', ej_es: 'Meditación de 5 minutos enfocada en respiración nasal', ej_en: '5 minute meditation focused on nasal breathing' },
                                        diosa: { titulo_es: 'Niebla Dorada', titulo_en: 'Golden Mist', msg_es: 'Energía alta con niebla mental — tu cuerpo y tu mente van a ritmos distintos hoy.', msg_en: 'High energy with brain fog — your body and mind are at different rhythms today.', menu_es: 'Batido de plátano, espinacas y proteína', menu_en: 'Banana, spinach and protein smoothie', ej_es: 'Aprovecha la energía corporal: 10 min de baile libre en casa', ej_en: 'Use that body energy: 10 min of free dancing at home' },
                                    }
                                },
                                flor: {
                                    symbol: '🌸', nombre_es: 'Carta Flor', nombre_en: 'Flower Card',
                                    color_from: '#3d1f2d', color_to: '#7a3d5c',
                                    variantes: {
                                        ritual: { titulo_es: 'Flor Serena', titulo_en: 'Serene Flower', msg_es: 'Tu cuerpo florece cuando lo escuchas. Hoy es uno de esos días. No lo desperdicies.', msg_en: 'Your body blooms when you listen to it. Today is one of those days.', menu_es: 'Tu menú base de hoy — todos los nutrientes para florecer', menu_en: 'Your base menu today — all nutrients to bloom', ej_es: 'Rutina completa de hoy — tu cuerpo está listo', ej_en: 'Full routine today — your body is ready' },
                                        diosa: { titulo_es: 'Flor Dorada', titulo_en: 'Golden Flower', msg_es: 'Hoy tu cuerpo está en su mejor momento. Aprovecha cada hora — esto es tuyo.', msg_en: 'Today your body is at its best. Make the most of every hour.', menu_es: 'Menú de alta energía — proteína + hidratos + grasas saludables', menu_en: 'High energy menu — protein + carbs + healthy fats', ej_es: 'Hoy puedes subir la intensidad. Tu cuerpo te lo está pidiendo', ej_en: 'Today you can increase intensity. Your body is asking for it' },
                                        cueva: { titulo_es: 'Flor Protegida', titulo_en: 'Protected Flower', msg_es: 'Equilibrio interno con necesidad de calma. Las flores también necesitan sombra para crecer.', msg_en: 'Inner balance with need for calm. Flowers also need shade to grow.', menu_es: 'Menú reconfortante de hoy — cálido, nutritivo, sin complicaciones', menu_en: 'Comforting menu today — warm, nutritious, uncomplicated', ej_es: 'Movimiento suave — estiramientos o caminata tranquila', ej_en: 'Gentle movement — stretches or quiet walk' },
                                        tormenta: { titulo_es: 'Flor en la Tormenta', titulo_en: 'Flower in the Storm', msg_es: 'Tu cuerpo está bien pero tu ánimo no acompaña. Eso también es válido. Aquí estoy.', msg_en: 'Your body is well but your mood does not follow. That is also valid. I am here.', menu_es: 'Chocolate negro 85% y frutos rojos — serotonina natural', menu_en: '85% dark chocolate and berries — natural serotonin', ej_es: 'Baile libre 5 minutos — el movimiento que más rápido cambia el ánimo', ej_en: 'Free dance 5 minutes — movement that changes mood fastest' },
                                    }
                                },
                                rayo: {
                                    symbol: '⚡', nombre_es: 'Carta Rayo', nombre_en: 'Lightning Card',
                                    color_from: '#5c4a0a', color_to: '#C9935A',
                                    variantes: {
                                        diosa: { titulo_es: 'Rayo Dorado', titulo_en: 'Golden Lightning', msg_es: 'Hoy tienes poder. Tu cuerpo está en su momento. Úsalo — no lo desperdicies en pequeñeces.', msg_en: 'Today you have power. Your body is in its moment. Use it.', menu_es: 'Huevos + aguacate + tostada integral. Energía 4 horas', menu_en: 'Eggs + avocado + wholegrain toast. Energy 4 hours', ej_es: 'Sube la intensidad hoy: HIIT suave 15 min o caminata rápida 30 min', ej_en: 'Increase intensity today: gentle HIIT 15 min or brisk walk 30 min' },
                                        ritual: { titulo_es: 'Rayo Sereno', titulo_en: 'Serene Lightning', msg_es: 'Energía tranquila y constante. No necesitas brillar fuerte — basta con brillar.', msg_en: 'Quiet and constant energy. You do not need to shine bright — shining is enough.', menu_es: 'Menú equilibrado de hoy — todo lo que necesitas está ahí', menu_en: 'Balanced menu today — everything you need is there', ej_es: 'Rutina de hoy completa — tu cuerpo está receptivo', ej_en: 'Full routine today — your body is receptive' },
                                        tormenta: { titulo_es: 'Rayo y Tormenta', titulo_en: 'Lightning and Storm', msg_es: 'Energía con tensión. Canalízala con intención — puede ser tu día más creativo.', msg_en: 'Energy with tension. Channel it with intention — it can be your most creative day.', menu_es: 'Salmón + brócoli + boniato — antiinflamatorio y energético', menu_en: 'Salmon + broccoli + sweet potato — anti-inflammatory and energising', ej_es: 'Caminata rápida 20 min para liberar la tensión', ej_en: 'Brisk walk 20 min to release tension' },
                                        cueva: { titulo_es: 'Rayo en Descanso', titulo_en: 'Resting Lightning', msg_es: 'Tu energía está ahí pero pide pausa. El descanso también es productivo.', msg_en: 'Your energy is there but asks for pause. Rest is also productive.', menu_es: 'Nueces + plátano + yogur griego — energía sostenida sin esfuerzo', menu_en: 'Walnuts + banana + Greek yogurt — sustained energy without effort', ej_es: 'Estiramientos suaves 10 min — recarga sin agotar', ej_en: 'Gentle stretches 10 min — recharge without exhausting' },
                                    }
                                },
                            };

                            const carta = cartas[sintoma];
                            const variante = carta.variantes[animo] || carta.variantes.ritual || Object.values(carta.variantes)[0];
                            // flipped → moved to global as oracleFlipped

                            return (
                                <div style={{marginBottom:'12px'}}>
                                    <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.1rem',fontWeight:500,color:darkMode?'#fdf8f3':'#1c1917',margin:'0 0 10px',textAlign:'center'}}>
                                        {language==='es'?'✦ Tu carta de hoy':'✦ Your card today'}
                                    </p>
                                    {/* Carta con flip */}
                                    <div onClick={()=>setOracleFlipped(!oracleFlipped)} style={{cursor:'pointer',perspective:'1000px',height:'200px',position:'relative'}}>
                                        {/* Cara frontal */}
                                        <div style={{
                                            position:'absolute',inset:0,borderRadius:'1.25rem',
                                            background:`linear-gradient(135deg,${carta.color_from},${carta.color_to})`,
                                            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                                            transition:'opacity 0.4s ease, transform 0.4s ease',
                                            opacity: oracleFlipped ? 0 : 1,
                                            transform: oracleFlipped ? 'rotateY(90deg)' : 'rotateY(0deg)',
                                            border:'1px solid rgba(201,147,90,0.3)',
                                            boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
                                        }}>
                                            <div style={{position:'absolute',top:0,right:0,width:'80px',height:'80px',background:'rgba(255,255,255,0.05)',borderRadius:'50%',transform:'translate(20px,-20px)'}}/>
                                            <span style={{fontSize:'3.5rem',marginBottom:'8px'}}>{carta.symbol}</span>
                                            <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.3rem',fontWeight:500,color:'rgba(255,255,255,0.9)',margin:0}}>{language==='es'?carta.nombre_es:carta.nombre_en}</p>
                                            <p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.5)',margin:'6px 0 0',letterSpacing:'0.1em'}}>{language==='es'?'Toca para revelar':'Tap to reveal'}</p>
                                        </div>
                                        {/* Cara trasera — revelada */}
                                        <div style={{
                                            position:'absolute',inset:0,borderRadius:'1.25rem',
                                            background:`linear-gradient(135deg,${carta.color_from},${carta.color_to})`,
                                            padding:'1.25rem',
                                            transition:'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
                                            opacity: oracleFlipped ? 1 : 0,
                                            transform: oracleFlipped ? 'rotateY(0deg)' : 'rotateY(-90deg)',
                                            border:'1px solid rgba(201,147,90,0.3)',
                                            boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
                                            display:'flex',flexDirection:'column',justifyContent:'space-between',
                                        }}>
                                            <div>
                                                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                                                    <span style={{fontSize:'1.5rem'}}>{carta.symbol}</span>
                                                    <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.1rem',fontWeight:600,color:'rgba(255,255,255,0.95)',margin:0}}>{language==='es'?variante.titulo_es:variante.titulo_en}</p>
                                                </div>
                                                <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.82)',lineHeight:1.55,margin:0,fontStyle:'italic'}}>{language==='es'?variante.msg_es:variante.msg_en}</p>
                                            </div>
                                            <div style={{display:'flex',flexDirection:'column',gap:'4px',marginTop:'10px'}}>
                                                <div style={{display:'flex',alignItems:'center',gap:'6px',cursor:'pointer'}} onClick={(e)=>{e.stopPropagation();setCurrentPage('nutrition')}}>
                                                    <span style={{fontSize:'0.75rem'}}>🍳</span>
                                                    <p style={{fontSize:'0.75rem',color:'rgba(232,200,159,0.9)',margin:0}}>{language==='es'?variante.menu_es:variante.menu_en}</p>
                                                    <span style={{fontSize:'0.72rem',color:'rgba(201,147,90,0.7)',marginLeft:'auto'}}>→</span>
                                                </div>
                                                <div style={{display:'flex',alignItems:'center',gap:'6px',cursor:'pointer'}} onClick={(e)=>{e.stopPropagation();setCurrentPage('exercise')}}>
                                                    <span style={{fontSize:'0.75rem'}}>💪</span>
                                                    <p style={{fontSize:'0.75rem',color:'rgba(232,200,159,0.9)',margin:0}}>{language==='es'?variante.ej_es:variante.ej_en}</p>
                                                    <span style={{fontSize:'0.72rem',color:'rgba(201,147,90,0.7)',marginLeft:'auto'}}>→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Momento del día */}
                                    {oracleFlipped && (
                                        <div style={{marginTop:'10px',display:'flex',gap:'8px'}}>
                                            {(() => {
                                            // oracleActiveMomento → moved to global as oracleActiveMomento
                                            const contenido = {
                                                    aprender: {
                                                        luna: {es:'El estrógeno bajo reduce la melatonina. Por eso tu sueño cambió — no es tu culpa, es química.',en:'Low oestrogen reduces melatonin. Your sleep changed — not your fault, it is chemistry.'},
                                                        llama: {es:'Los sofocos son vasodilataciones controladas por el hipotálamo cuando el estrógeno fluctúa.',en:'Hot flashes are vasodilations controlled by the hypothalamus when oestrogen fluctuates.'},
                                                        marea: {es:'La ansiedad en esta etapa viene del eje HPA — hipotálamo, hipófisis y suprarrenales en desajuste.',en:'Anxiety at this stage comes from the HPA axis out of sync.'},
                                                        niebla: {es:'El estrógeno protege las neuronas. Cuando baja, la conducción nerviosa se ralentiza temporalmente.',en:'Oestrogen protects neurons. When it drops, nerve conduction temporarily slows.'},
                                                        flor: {es:'Los días de equilibrio son cuando tu microbioma intestinal regula bien tus hormonas.',en:'Balanced days are when your gut microbiome regulates your hormones well.'},
                                                        rayo: {es:'Los picos de energía coinciden con los picos de estrógeno. Tu cuerpo sabe cuándo brillar.',en:'Energy peaks coincide with oestrogen peaks. Your body knows when to shine.'},
                                                    },
                                                    cuidarme: {
                                                        luna: {es:'Pecado de hoy: Mousse de chocolate negro y frambuesas. Magnesio puro. Sin culpa.',en:'Todays treat: Dark chocolate and raspberry mousse. Pure magnesium. No guilt.'},
                                                        llama: {es:'Pecado de hoy: Helado de yogur griego con miel y nueces. Refrescante y hormonal.',en:'Todays treat: Greek yogurt ice cream with honey and walnuts. Cooling and hormonal.'},
                                                        marea: {es:'Pecado de hoy: Tarta de dátil y cacao sin horno. Serotonina natural en cada bocado.',en:'Todays treat: No-bake date and cacao tart. Natural serotonin in every bite.'},
                                                        niebla: {es:'Pecado de hoy: Bowl de arándanos con granola y chocolate. Antioxidantes para tu cerebro.',en:'Todays treat: Blueberry bowl with granola and chocolate. Antioxidants for your brain.'},
                                                        flor: {es:'Pecado de hoy: Fresas con nata de coco y miel cruda. Ligero, dulce, perfecto.',en:'Todays treat: Strawberries with coconut cream and raw honey. Light, sweet, perfect.'},
                                                        rayo: {es:'Pecado de hoy: Brownie de alubias negras y cacao. Proteína disfrazada de indulgencia.',en:'Todays treat: Black bean and cacao brownie. Protein disguised as indulgence.'},
                                                    },
                                                    intimidad: {
                                                        luna: {es:'La sequedad vaginal mejora con omega-3 y vitamina E. El salmón y el aguacate son tus aliados esta semana.',en:'Vaginal dryness improves with omega-3 and vitamin E. Salmon and avocado are your allies.'},
                                                        llama: {es:'Los sofocos pueden afectar el deseo. El ejercicio moderado y el magnesio ayudan a regularlos.',en:'Hot flashes can affect desire. Moderate exercise and magnesium help regulate them.'},
                                                        marea: {es:'La ansiedad reduce la libido — es una respuesta de supervivencia. Calmar el sistema nervioso es el primer paso.',en:'Anxiety reduces libido — it is a survival response. Calming the nervous system is the first step.'},
                                                        niebla: {es:'La fatiga mental también afecta la intimidad. Descansar y nutrirte bien es el acto más amoroso hoy.',en:'Mental fatigue also affects intimacy. Resting and nourishing yourself is the most loving act today.'},
                                                        flor: {es:'Los días de equilibrio son ideales para reconectar con tu cuerpo. El placer también es salud hormonal.',en:'Balanced days are ideal for reconnecting with your body. Pleasure is also hormonal health.'},
                                                        rayo: {es:'Energía alta y buen ánimo — hoy tu cuerpo está en su mejor momento para la intimidad y la conexión.',en:'High energy and good mood — today your body is at its best for intimacy and connection.'},
                                                    },
                                                };
                                                // active → moved to global as oracleActive
                                            const btns = [
                                                {key:'aprender',icon:'/images/carta_aprender.png',es:'Aprender',en:'Learn'},
                                                {key:'cuidarme',icon:'/images/carta_cuidarme.png',es:'Cuidarme',en:'Care'},
                                                {key:'intimidad',icon:'/images/carta_intimidad.png',es:'Intimidad',en:'Intimacy'},
                                            ];
                                            return btns.map((btn,i) => (
                                                <div key={i} style={{flex:1}}>
                                                    <div onClick={(e)=>{e.stopPropagation();setOracleActiveMomento(oracleActiveMomento===btn.key?null:btn.key)}} style={{
                                                        background:oracleActiveMomento===btn.key?`linear-gradient(135deg,${carta.color_from},${carta.color_to})`:(darkMode?'rgba(255,255,255,0.06)':'white'),
                                                        border:`1px solid ${oracleActiveMomento===btn.key?'rgba(201,147,90,0.5)':'rgba(201,147,90,0.2)'}`,
                                                        borderRadius:'0.85rem',padding:'0.6rem',textAlign:'center',cursor:'pointer',transition:'all 0.2s',
                                                    }}>
                                                        {btn.icon.startsWith('/') 
                                            ? <img src={btn.icon} style={{width:'32px',height:'32px',borderRadius:'50%',objectFit:'cover',margin:'0 auto 4px',display:'block',boxShadow:'0 2px 6px rgba(201,147,90,0.3)'}}/>
                                            : <span style={{fontSize:'1.1rem',display:'block',marginBottom:'2px'}}>{btn.icon}</span>}
                                                        <p style={{fontSize:'0.72rem',color:oracleActiveMomento===btn.key?'rgba(255,255,255,0.9)':'#C9935A',margin:0,fontWeight:600}}>{language==='es'?btn.es:btn.en}</p>
                                                    </div>
                                                    {oracleActiveMomento===btn.key && (
                                                        <div style={{marginTop:'6px',background:darkMode?'rgba(255,255,255,0.04)':'rgba(253,248,243,0.95)',borderRadius:'0.75rem',padding:'0.75rem',border:'1px solid rgba(201,147,90,0.15)'}}>
                                                            <p style={{fontSize:'0.78rem',color:darkMode?'#e8d5c0':'#57534e',margin:'0 0 8px',lineHeight:1.5}}>
                                                                {language==='es'?contenido[btn.key][sintoma].es:contenido[btn.key][sintoma].en}
                                                            </p>
                                                            <p onClick={()=>setCurrentPage(btn.key==='aprender'?'chat':btn.key==='cuidarme'?'nutrition':'chat')} style={{fontSize:'0.72rem',color:'#C9935A',margin:0,cursor:'pointer',fontWeight:600,display:'flex',alignItems:'center',gap:'4px'}}>
                                                                {btn.key==='aprender'
                                                                    ?(language==='es'?'Pregúntale a LUMI para ir más profundo →':'Ask LUMI to go deeper →')
                                                                    :btn.key==='cuidarme'
                                                                        ?(language==='es'?'Ver tu plan en Nutrición →':'See your plan in Nutrition →')
                                                                        :(language==='es'?'Habla con LUMI sobre esto →':'Talk to LUMI about this →')}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ));
                                        })()}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* ── LUMI SE ANTICIPA ── */}
                        {(() => {
                            const todayS = symptoms.length > 0 ? symptoms[symptoms.length - 1] : null;
                            const hasLowEnergy = todayS && (todayS.energy || 0) <= 3;
                            const hasAnxiety = todayS && (todayS.anxiety || 0) >= 4;
                            const hasLowSleep = todayS && (todayS.sleep || 0) <= 3;
                            const hasLowMood = todayS && (todayS.mood || 0) <= 3;
                            let tip_es, tip_en;
                            if (hasLowSleep) {
                                tip_es = '🌙 Cuando el sueño baja, el cortisol sube. Esta noche: magnesio, sin pantallas 1h antes, temperatura fresca.';
                                tip_en = '🌙 When sleep drops, cortisol rises. Tonight: magnesium, no screens 1h before, cool temperature.';
                            } else if (hasLowEnergy) {
                                tip_es = '⚡ Energía baja hoy. Tu cuerpo pide hierro o vitamina B12 — revisa tu menú de hoy en Nutrición.';
                                tip_en = '⚡ Low energy today. Your body may need iron or B12 — check your menu in Nutrition.';
                            } else if (hasAnxiety) {
                                tip_es = '🌊 Ansiedad detectada. Antes de comer: 4 seg inhala, 7 mantén, 8 exhala. Repite 3 veces.';
                                tip_en = '🌊 Anxiety detected. Before eating: inhale 4s, hold 7, exhale 8. Repeat 3 times.';
                            } else if (hasLowMood) {
                                tip_es = '🌿 Ánimo bajo hoy. 10 minutos de luz solar antes de las 10am tiene evidencia directa sobre el estado de ánimo.';
                                tip_en = '🌿 Low mood today. 10 minutes of sunlight before 10am has direct evidence on mood.';
                            } else {
                                tip_es = '✦ Tu cuerpo está en equilibrio hoy. Los días tranquilos son cuando se consolidan los cambios — aprovéchalo.';
                                tip_en = '✦ Your body is balanced today. Calm days are when changes consolidate — make the most of it.';
                            }
                            return (
                                <div style={{
                                    background: darkMode ? 'rgba(201,147,90,0.08)' : 'rgba(253,248,243,0.98)',
                                    borderRadius: '1.25rem',
                                    padding: '1rem 1.25rem',
                                    marginBottom: '12px',
                                    border: '1px solid rgba(201,147,90,0.22)',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.75rem',
                                }}>
                                    <img src="/images/lumi.png"
                                        style={{width:'32px',height:'32px',borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'2px solid rgba(201,147,90,0.4)',marginTop:'2px'}}
                                        onError={e=>{e.target.style.display='none'}} alt="LUMI"/>
                                    <div>
                                        <p style={{fontSize:'0.68rem',color:'#C9935A',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'4px'}}>
                                            {language==='es'?'✦ LUMI se anticipa':'✦ LUMI anticipates'}
                                        </p>
                                        <p style={{fontSize:'0.87rem',color:darkMode?'#e8d5c0':'#44403c',lineHeight:1.6,margin:'0 0 10px'}}>
                                            {language==='es'?tip_es:tip_en}
                                        </p>
                                        <p onClick={()=>setCurrentPage('chat')} style={{fontSize:'0.8rem',color:'#C9935A',margin:0,lineHeight:1.5,cursor:'pointer',fontStyle:'italic'}}>
                                            {language==='es'
                                                ?'Estoy en la esquina izquierda, 24/7, para lo que necesites — toca para hablar conmigo ✦'
                                                :'I am in the bottom left corner, 24/7, for whatever you need — tap to talk to me ✦'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* ── BLOQUE LOCKED — predicción bloqueada ── */}
                        <div style={{
                            borderRadius:'1.25rem',
                            overflow:'hidden',
                            marginBottom:'12px',
                            position:'relative',
                        }}>
                            {/* Contenido borroso */}
                            <div style={{
                                background: darkMode?'rgba(20,14,8,0.9)':'rgba(253,248,243,0.95)',
                                border:`1px solid rgba(184,115,51,${dayNum===3?'0.5':'0.25'})`,
                                borderRadius:'1.25rem',
                                padding:'1.1rem 1.25rem',
                                filter:'blur(3px)',
                                userSelect:'none',
                                pointerEvents:'none',
                            }}>
                                <p style={{fontSize:'0.68rem',color:'#B87333',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'4px'}}>
                                    {language==='es'?'✦ PREDICCIÓN DE MAÑANA':'✦ TOMORROWS PREDICTION'}
                                </p>
                                <p style={{fontSize:'0.87rem',color:darkMode?'#e8d5c0':'#44403c',lineHeight:1.6,margin:'0 0 6px'}}>
                                    {language==='es'
                                        ?'Tu estrógeno cae mañana. He ajustado tu plan de nutrición para evitar el hambre emocional y el pico de cortisol.'
                                        :'Your oestrogen drops tomorrow. I have adjusted your nutrition plan to prevent emotional hunger and cortisol spikes.'}
                                </p>
                                <p style={{fontSize:'0.78rem',color:'#B87333',fontStyle:'italic'}}>
                                    {language==='es'?'Ritual recomendado: Chocolate 85% + estiramientos + magnesio.':'Recommended ritual: 85% dark chocolate + stretches + magnesium.'}
                                </p>
                            </div>
                            {/* Overlay candado */}
                            <div onClick={()=>setCurrentPage('upgrade')} style={{
                                position:'absolute',inset:0,
                                background:'rgba(10,8,5,0.55)',
                                borderRadius:'1.25rem',
                                display:'flex',flexDirection:'column',
                                alignItems:'center',justifyContent:'center',
                                cursor:'pointer',
                                backdropFilter:'blur(1px)',
                                border:`1px solid rgba(184,115,51,${dayNum===3?'0.6':'0.3'})`,
                                gap:'8px',
                            }}>
                                <div style={{
                                    width:'40px',height:'40px',borderRadius:'50%',
                                    background:`linear-gradient(135deg,rgba(184,115,51,${dayNum===3?'0.5':'0.3'}),rgba(232,200,120,0.2))`,
                                    border:'1px solid rgba(184,115,51,0.5)',
                                    display:'flex',alignItems:'center',justifyContent:'center',
                                    fontSize:'1.1rem',
                                }}>🔒</div>
                                <p style={{fontFamily:"'Cormorant',serif",fontSize:'0.95rem',color:'#B87333',margin:0,fontWeight:500}}>
                                    {language==='es'?'LUMI Predictiva — Premium':'LUMI Predictive — Premium'}
                                </p>
                                <p style={{fontSize:'0.72rem',color:'rgba(232,200,120,0.6)',margin:0}}>
                                    {language==='es'?'Toca para desbloquear':'Tap to unlock'}
                                </p>
                            </div>
                        </div>

                        {/* ── POPUP DÍA 3 — "Enter the New Era" ── */}
                        {dayNum === 3 && (
                            <div style={{
                                background:'linear-gradient(160deg,rgba(10,6,2,0.97) 0%,rgba(30,18,6,0.97) 100%)',
                                borderRadius:'1.5rem',
                                padding:'2rem 1.5rem',
                                marginBottom:'12px',
                                border:'1px solid rgba(184,115,51,0.4)',
                                boxShadow:'0 0 60px rgba(184,115,51,0.15)',
                                textAlign:'center',
                                position:'relative',
                                overflow:'hidden',
                            }}>
                                <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#B87333,#E8C878,#B87333,transparent)'}}/>
                                <p style={{fontSize:'0.62rem',color:'rgba(184,115,51,0.7)',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'1rem'}}>
                                    {language==='es'?'TU SANTUARIO ESTÁ LISTO':'YOUR SANCTUARY IS READY'}
                                </p>
                                <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.6rem',fontWeight:400,color:'#F5E6D3',lineHeight:1.3,marginBottom:'0.75rem'}}>
                                    {language==='es'
                                        ?'Has aprendido a escuchar. Ahora es momento de dominar tu ritmo.'
                                        :'You have learned to listen. Now it is time to master your rhythm.'}
                                </p>
                                <p style={{fontSize:'0.85rem',color:'rgba(184,115,51,0.8)',lineHeight:1.6,marginBottom:'1.5rem',fontStyle:'italic',fontFamily:"'Cormorant',serif"}}>
                                    {language==='es'
                                        ?'Deja atrás la niebla hormonal. Pasa de registrar el pasado a predecir tu bienestar.'
                                        :'Leave the hormonal fog behind. Move from logging the past to predicting your wellbeing.'}
                                </p>
                                <div onClick={()=>setCurrentPage('upgrade')} style={{
                                    background:'linear-gradient(135deg,#B87333,#E8C878)',
                                    borderRadius:'9999px',
                                    padding:'0.85rem 2.5rem',
                                    cursor:'pointer',
                                    display:'inline-block',
                                    boxShadow:'0 0 30px rgba(184,115,51,0.4)',
                                }}>
                                    <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.1rem',fontWeight:600,color:'#0A0A0A',margin:0,letterSpacing:'0.05em'}}>
                                        {language==='es'?'Entrar en la Nueva Era':'Enter the New Era'}
                                    </p>
                                </div>
                                <p style={{fontSize:'0.72rem',color:'rgba(184,115,51,0.45)',marginTop:'0.75rem'}}>
                                    {language==='es'?'3 días · Sin tarjeta · Cancela cuando quieras':'3 days · No card · Cancel anytime'}
                                </p>
                                <div style={{position:'absolute',bottom:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(184,115,51,0.4),transparent)'}}/>
                            </div>
                        )}

                        {/* ── CTA PREMIUM ── */}
                        <div style={{
                            background: 'linear-gradient(135deg, #C9935A 0%, #e8c89f 100%)',
                            borderRadius: '1.5rem',
                            padding: '2rem 1.75rem',
                            textAlign: 'center',
                            color: 'white',
                            boxShadow: '0 8px 32px rgba(201,147,90,0.25)'
                        }}>
                            <div style={{fontSize: '2.5rem', marginBottom: '0.75rem'}}>✦</div>
                            <h2 style={{fontFamily: "'Cormorant', serif", fontSize: '1.8rem', fontWeight: 500, marginBottom: '0.5rem', lineHeight: 1.2}}>
                                {language === 'es' ? '¿Te gusta lo que ves?' : 'Liking what you see?'}
                            </h2>
                            <p style={{fontSize: '0.92rem', opacity: 0.9, marginBottom: '1.5rem', lineHeight: 1.6}}>
                                {language === 'es'
                                    ? 'Al terminar el trial pierdes acceso a LUMI, ejercicios personalizados, patrones y gráficos. Hazte premium y sigue teniendo a Lumera contigo cada día.'
                                    : 'When your trial ends you lose access to LUMI, personalized exercises, patterns and charts. Go premium and keep Lumera with you every day.'}
                            </p>
                            <button
                                onClick={() => setCurrentPage('premium')}
                                style={{
                                    background: 'white',
                                    color: '#C9935A',
                                    fontWeight: 800,
                                    fontSize: '1.05rem',
                                    padding: '0.9rem 2.5rem',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    display: 'inline-block',
                                    marginBottom: '0.75rem',
                                    transition: 'transform 0.15s',
                                }}
                                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            >
                                ✨ {language === 'es' ? 'Hazte Premium ahora' : 'Go Premium now'}
                            </button>
                            <p style={{fontSize: '0.78rem', opacity: 0.8, margin: 0}}>
                                {language === 'es' ? 'Sin tarjeta durante el trial · Cancela cuando quieras' : 'No card during trial · Cancel anytime'}
                            </p>
                        </div>

                    </div>
                );
            };

            const renderNutrition = () => {
                const mealLabels = language === 'es' ? { 
                    Desayuno: 'Desayuno', 
                    Almuerzo: 'Almuerzo', 
                    Cena: 'Cena', 
                    Snack: 'Snack' 
                } : { 
                    Desayuno: 'Breakfast', 
                    Almuerzo: 'Lunch', 
                    Cena: 'Dinner', 
                    Snack: 'Snack' 
                };

                if (menusLoading) {
                    return (
                        <div className="pb-32 space-y-8">
                            <h2 className="text-3xl font-light gradient-text">{t[language].nutrition}</h2>
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center`}>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto mb-4"></div>
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    {language === 'es' ? 'Cargando menús...' : 'Loading menus...'}
                                </p>
                            </div>
                        </div>
                    );
                }

                // Función para seleccionar menú adaptado según síntomas
                const getSelectedSymptom = () => {
                    const tier = getUserTier();

                    // Verificar si está en período - múltiples formas de detectarlo
                    if (symptoms && symptoms.length > 0) {
                        const recent = symptoms.slice(-3);
                        const isOnPeriod = recent.some(s => 
                            s.period_active === true || 
                            s.is_period === true ||
                            s.on_period === true ||
                            (s.notes && (
                                s.notes.toLowerCase().includes('período') ||
                                s.notes.toLowerCase().includes('periodo') ||
                                s.notes.toLowerCase().includes('period') ||
                                s.notes.toLowerCase().includes('regla') ||
                                s.notes.toLowerCase().includes('menstruación')
                            ))
                        );
                        if (isOnPeriod) {
                            return 'periodo';
                        }
                    }

                    // Si no hay síntomas registrados, usar síntoma del quiz
                    const primarySymptom = currentUser?.primary_symptom || currentUser?.main_symptom;
                    const symptomMap = {
                        'hot_flashes': 'sofocos',
                        'sofocos': 'sofocos',
                        'fatigue': 'fatiga',
                        'fatiga': 'fatiga',
                        'baja_energia': 'fatiga',
                        'low_energy': 'fatiga',
                        'insomnia': 'insomnio',
                        'insomnio': 'insomnio',
                        'anxiety': 'ansiedad',
                        'ansiedad': 'ansiedad',
                        'brain_fog': 'niebla_mental',
                        'niebla_mental': 'niebla_mental',
                        'mood': 'cambios_humor',
                        'cambios_humor': 'cambios_humor'
                    };

                    // Helper: leer campo de síntoma con ambas nomenclaturas (camelCase y snake_case)
                    const sf = (s, camel, snake, defaultVal = 0) => {
                        const v = s[camel] !== undefined ? s[camel] : (s[snake] !== undefined ? s[snake] : defaultVal);
                        return typeof v === 'number' ? v : defaultVal;
                    };

                    // PREMIUM y TRIAL: scoring ponderado - gana el síntoma MÁS dominante
                    if (tier === 'premium' || tier === 'trial') {
                        if (symptoms && symptoms.length >= 1) {
                            const n = tier === 'premium' ? 3 : 2;
                            const recent = symptoms.slice(0, n);

                            // Leer todos los campos normalizando camelCase ↔ snake_case
                            const avgSleep      = recent.reduce((s, r) => s + sf(r, 'sleep',      'sleep',       5), 0) / recent.length;
                            const avgEnergy     = recent.reduce((s, r) => s + sf(r, 'energy',     'energy',      5), 0) / recent.length;
                            const avgHotFlashes = recent.reduce((s, r) => s + sf(r, 'hotFlashes', 'hot_flashes', 0), 0) / recent.length;
                            const avgAnxiety    = recent.reduce((s, r) => s + sf(r, 'anxiety',    'anxiety',     0), 0) / recent.length;
                            const avgBrainFog   = recent.reduce((s, r) => s + sf(r, 'brainFog',   'brain_fog',   0), 0) / recent.length;
                            const avgMood       = recent.reduce((s, r) => s + sf(r, 'mood',       'mood',        5), 0) / recent.length;
                            const avgJointPain  = recent.reduce((s, r) => s + sf(r, 'jointPain',  'joint_pain',  0), 0) / recent.length;
                            const avgBloating   = recent.reduce((s, r) => s + sf(r, 'bloating',   'bloating',    0), 0) / recent.length;
                            const avgMemory     = recent.reduce((s, r) => s + sf(r, 'memory',     'memory',      5), 0) / recent.length;

                            // Score de alarma: mayor = más urgente
                            // Para síntomas donde ALTO es malo (sofocos, ansiedad, niebla)
                            // Para síntomas donde BAJO es malo (sueño, energía, ánimo, memoria)
                            const scores = {
                                'fatiga':          avgEnergy  < 6 ? (6 - avgEnergy)  * 2.0 : 0,
                                'insomnio':        avgSleep   < 6 ? (6 - avgSleep)   * 2.0 : 0,
                                'sofocos':         avgHotFlashes > 3 ? (avgHotFlashes - 3) * 2.0 : 0,
                                'ansiedad':        avgAnxiety    > 3 ? (avgAnxiety    - 3) * 2.0 : 0,
                                'niebla_mental':   (avgBrainFog > 3 ? (avgBrainFog - 3) * 2.0 : 0) + (avgMemory < 6 ? (6 - avgMemory) * 2.0 : 0),
                                'cambios_humor':   avgMood    < 6 ? (6 - avgMood)   * 2.0 : 0,
                                'dolor_articular': avgJointPain  > 3 ? (avgJointPain - 3) * 2.0 : 0,
                                'hinchazon':       avgBloating   > 3 ? (avgBloating  - 3) * 2.0 : 0,
                            };

                            // Si hay síntoma principal del perfil, darle un boost para desempates
                            const profileSymptom = primarySymptom && symptomMap[primarySymptom];
                            if (profileSymptom && scores[profileSymptom] !== undefined) {
                                scores[profileSymptom] += 1; // pequeño boost al síntoma declarado
                            }

                            const topSymptom = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

                            if (topSymptom[1] > 0) return topSymptom[0];
                        }

                        // Sin registros → usar síntoma principal del perfil
                        if (primarySymptom && symptomMap[primarySymptom]) {
                            return symptomMap[primarySymptom];
                        }
                        return 'sofocos';
                    }

                    // FREE: menú rotativo semanal
                    const weekNumber = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 604800000);
                    const symptomsList = ['sofocos', 'fatiga', 'insomnio', 'ansiedad', 'niebla_mental', 'dolor_articular', 'cambios_humor', 'hinchazon'];
                    return symptomsList[weekNumber % symptomsList.length];
                };

                const selectedSymptom = getSelectedSymptom();

                // Para periodo: usar sofocos como base si no hay menú específico
                const menuKey = selectedSymptom === 'periodo' ? 'sofocos' : selectedSymptom;
                const langKey = language === 'es' ? 'es' : 'en';
                const menuLang = menus[langKey] || {};

                // Buscar menú: 1) idioma+síntoma exacto, 2) idioma+sofocos, 3) otro idioma+síntoma, 4) []
                let recipes = menuLang[menuKey] 
                    || menuLang['sofocos']
                    || menuLang[Object.keys(menuLang)[0]]  // primer síntoma disponible en ese idioma
                    || menus['es']?.[menuKey]               // fallback español si inglés vacío
                    || menus['es']?.['sofocos']
                    || [];

                if (!menuLang[menuKey] && Object.keys(menuLang).length === 0) {
                }

                // Aplicar restricciones dietéticas a los menús de Supabase (trial y premium)
                const userConditions = parseHealthConditions(currentUser?.health_conditions);
                if (userConditions.length > 0 && getUserTier() !== 'free') {
                    recipes = recipes.map(recipe => {
                        if (!recipe.ingredients) return recipe;
                        const filteredIngredients = recipe.ingredients
                            .map(ing => {
                                // Normalizar ingrediente a objeto si viene como string
                                const ingObj = typeof ing === 'string' ? { name: ing } : ing;
                                return applyDietaryRestrictions(ingObj, userConditions);
                            })
                            .filter(ing => ing !== null);
                        return { ...recipe, ingredients: filteredIngredients };
                    });
                }

                return (
                    <div className="pb-32 space-y-8" key={`nutrition-${language}`} style={{position: 'relative'}}>
                        <video autoPlay loop muted playsInline src="/videos/menu.mp4"
                            style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.18}} />
                        {/* HEADER NUTRICIÓN */}
                        <div style={{marginBottom:'1.5rem'}}>
                            <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'2.2rem',fontWeight:400,color:darkMode?'#fdf8f3':'#1c1917',lineHeight:1.2,marginBottom:'0.5rem'}}>
                                {language==='es'?'¿Qué necesitas hoy?':'What do you need today?'}
                            </h1>
                            <p style={{fontSize:'0.85rem',color:'#C9935A',fontStyle:'italic',fontFamily:"'Cormorant',serif"}}>
                                {language==='es'?'Elige y te llevo directa a lo que buscas.':'Choose and I will take you straight to what you need.'}
                            </p>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginBottom:'1.5rem'}}>
                        <details style={{borderRadius:'1.25rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.2)',background:darkMode?'rgba(255,255,255,0.03)':'white'}}>
                            <summary style={{listStyle:'none',cursor:'pointer'}}>
                                <div style={{padding:'1.25rem 1.5rem',display:'flex',alignItems:'center',gap:'1rem',background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(253,248,243,0.8))'}}>
                                    <img src='/images/nutri_huevo.png' style={{width:'48px',height:'48px',borderRadius:'50%',objectFit:'cover',flexShrink:0,boxShadow:'0 2px 8px rgba(201,147,90,0.3)'}}/>
                                    <div style={{flex:1}}>
                                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.25rem',fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',margin:0}}>{language==='es'?'Tengo tiempo y ganas de cocinar':'I have time and feel like cooking'}</p>
                                        <p style={{fontSize:'0.78rem',color:'#C9935A',margin:0}}>{language==='es'?'Tu menú del día personalizado':'Your personalised daily menu'}</p>
                                    </div>
                                </div>
                            </summary>
                            <div>
                        {symptoms.length === 0 && (
                            <div onClick={()=>setCurrentPage('symptoms')} style={{borderRadius:'1.25rem',padding:'1.25rem 1.5rem',background:'linear-gradient(135deg,#fdf8f3,#fef3e8)',border:'1px solid rgba(201,147,90,0.3)',cursor:'pointer',display:'flex',alignItems:'center',gap:'1rem'}}>
                                <span style={{fontSize:'2rem',flexShrink:0}}>🌿</span>
                                <div>
                                    <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.1rem',fontWeight:600,color:'#1c1917',marginBottom:'0.2rem'}}>{language==='es'?'Registra tus síntomas primero':'Log your symptoms first'}</p>
                                    <p style={{fontSize:'0.78rem',color:'#78716c'}}>{language==='es'?'Tu menú personalizado se adapta a cómo te sientes hoy. Toca aquí para registrar →':'Your personalised menu adapts to how you feel today. Tap here to log →'}</p>
                                </div>
                            </div>
                        )}
                        <video autoPlay loop muted playsInline src="/videos/menu.mp4"
                            style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.18}} />
                        <h2 className="text-3xl font-light gradient-text">{t[language].nutrition}</h2>

                        <div className={`${darkMode ? 'bg-rose-900' : 'bg-amber-50'} rounded-xl shadow p-5 border-l-4 border-rose-400`}>
                            <div className="flex items-start gap-3">
                                <span style={{fontSize:"1.5rem",color:"#C9935A"}}>✦</span>
                                <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-rose-900'} font-medium leading-relaxed`}>
                                    {getLumiMessage('nutrition')}
                                </p>
                            </div>
                        </div>

                        {/* DASHBOARD METABÓLICO - Trial y Premium */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
                            <div className="bg-gradient-to-r from-rose-400 to-amber-300 text-white p-6">
                                <h3 className="text-2xl font-semibold">{language === 'es' ? '✨ Tu Menú de Hoy' : '✨ Your Menu Today'}</h3>
                                <p className="text-sm opacity-90 mt-1">
                                    {getUserTier() === 'free'
                                        ? (language === 'es' ? 'Tu menú de esta semana' : 'Your menu this week')
                                        : (language === 'es' ? 'Adaptado según cómo te sientes' : 'Adapted based on how you feel')}
                                </p>
                            </div>

                            <div className="p-8 space-y-8">
                                {recipes.map((recipe, idx) => (
                                    <div key={idx} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 border-l-4 border-rose-400 space-y-6`}>
                                        {/* HEADER CON NOMBRE Y CALORÍAS */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="text-2xl font-bold mb-2 gradient-text">{recipe.name}</h4>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                                                    {mealLabels[recipe.meal] || recipe.meal}
                                                </p>

                                                {/* HORARIO RECOMENDADO */}
                                                {recipe.horario && (
                                                    <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'} inline-block px-4 py-2 rounded-lg`}>
                                                        <p className={`text-sm font-bold ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                                                            🕐 {language === 'es' ? 'Hora recomendada' : 'Recommended time'}: {recipe.horario}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`${darkMode ? 'bg-stone-900' : 'bg-amber-50'} text-amber-700 px-4 py-2 rounded-xl text-lg font-bold`}>
                                                {recipe.calories} cal
                                            </span>
                                        </div>

                                        {/* POR QUÉ ESTE HORARIO - CIENCIA */}
                                        {recipe.whyHorario && (
                                            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} p-4 rounded-lg border-l-4 border-indigo-500`}>
                                                <p className={`text-sm ${darkMode ? 'text-indigo-200' : 'text-indigo-900'} leading-relaxed`}>
                                                    <strong className="font-bold">⏰ {language === 'es' ? '¿Por qué a esta hora?' : 'Why at this time?'}</strong><br/>
                                                    {recipe.whyHorario}
                                                </p>
                                            </div>
                                        )}

                                        {/* POR QUÉ ESTE MENÚ - BENEFICIOS */}
                                        <div className={`${darkMode ? 'bg-stone-900' : 'bg-amber-50'} p-4 rounded-lg border-l-4 border-amber-500`}>
                                            <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-900'} font-medium leading-relaxed`}>
                                                <strong className="font-bold">💜 {language === 'es' ? '¿Por qué este menú?' : 'Why this menu?'}</strong><br/>
                                                {recipe.why}
                                            </p>
                                        </div>

                                        {/* INGREDIENTES — ACORDEON */}
                                        <details style={{borderRadius:'0.85rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.2)'}}>
                                            <summary style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.9rem 1.1rem',cursor:'pointer',background:darkMode?'rgba(201,147,90,0.1)':'rgba(201,147,90,0.07)',listStyle:'none',userSelect:'none'}}>
                                                <span style={{fontFamily:"'Cormorant', serif",fontSize:'1.05rem',fontWeight:600,color:darkMode?'#e8c89f':'#92580a',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                                                    <span style={{color:'#C9935A'}}>&#10022;</span> {t[language].ingredients}
                                                </span>
                                                <span style={{color:'#C9935A',fontSize:'0.85rem'}}>&#9662;</span>
                                            </summary>
                                            <div style={{padding:'0.75rem 1rem 1rem',display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                                                {recipe.ingredients.map((ing, i) => {
                                                    const isString = typeof ing === 'string';
                                                    const ingredientName = isString ? ing : (ing.ingredient || ing.name);
                                                    const hasDetails = !isString && (ing.qty || ing.why);
                                                    return (
                                                        <div key={i} style={{background:darkMode?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.9)',borderRadius:'0.65rem',padding:'0.65rem 0.85rem',borderLeft:'3px solid #C9935A'}}>
                                                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:hasDetails&&ing.why?'0.35rem':0}}>
                                                                <span style={{fontWeight:600,fontSize:'0.88rem',color:darkMode?'#f5f0eb':'#292524'}}>{ingredientName}</span>
                                                                {hasDetails && ing.qty && (
                                                                    <span style={{background:'rgba(201,147,90,0.15)',color:'#92580a',padding:'0.15rem 0.6rem',borderRadius:'9999px',fontSize:'0.75rem',fontWeight:700}}>
                                                                        {ing.qty}{ing.unit||''}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {hasDetails && ing.why && (
                                                                <p style={{fontSize:'0.78rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.45,margin:0}}>{ing.why}</p>
                                                            )}
                                                            {hasDetails && (ing.eco || ing.gourmet) && (
                                                                <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap',marginTop:'0.4rem'}}>
                                                                    {ing.eco && <span style={{background:'rgba(201,147,90,0.1)',color:'#92580a',padding:'0.1rem 0.5rem',borderRadius:'9999px',fontSize:'0.7rem',fontWeight:600}}>{language==='es'?'Asequible':'Budget'}: {ing.eco}</span>}
                                                                    {ing.gourmet && <span style={{background:'rgba(201,147,90,0.1)',color:'#92580a',padding:'0.1rem 0.5rem',borderRadius:'9999px',fontSize:'0.7rem',fontWeight:600}}>Gourmet: {ing.gourmet}</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </details>
                                        {/* PREPARACION — ACORDEON */}
                                        <details style={{borderRadius:'0.85rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.2)'}}>
                                            <summary style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.9rem 1.1rem',cursor:'pointer',background:darkMode?'rgba(201,147,90,0.1)':'rgba(201,147,90,0.07)',listStyle:'none',userSelect:'none'}}>
                                                <span style={{fontFamily:"'Cormorant', serif",fontSize:'1.05rem',fontWeight:600,color:darkMode?'#e8c89f':'#92580a',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                                                    <span style={{color:'#C9935A'}}>&#10022;</span> {t[language].preparation}
                                                </span>
                                                <span style={{color:'#C9935A',fontSize:'0.85rem'}}>&#9662;</span>
                                            </summary>
                                            <ol style={{padding:'0.75rem 1rem 1rem',display:'flex',flexDirection:'column',gap:'0.55rem',margin:0,listStyle:'none'}}>
                                                {recipe.steps.map((step, i) => (
                                                    <li key={i} style={{display:'flex',gap:'0.65rem',alignItems:'flex-start'}}>
                                                        <span style={{flexShrink:0,width:'1.4rem',height:'1.4rem',background:'linear-gradient(135deg,#C9935A,#e8c89f)',color:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700,marginTop:'0.1rem'}}>{i+1}</span>
                                                        <span style={{fontSize:'0.85rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.5}}>{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </details>

                                        {/* COOKING TIPS - IA para trial y premium */}
                                        {getUserTier() !== 'free' && (
                                            <div className={`${darkMode ? 'bg-green-900/40' : 'bg-green-50'} p-4 rounded-lg border-l-4 border-green-500`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="text-sm font-bold flex items-center gap-2">
                                                        <span>💡</span>
                                                        {language === 'es' ? 'Consejos para preservar nutrientes' : 'Tips to preserve nutrients'}
                                                    </h5>
                                                    {!aiCookingTips[recipe.name] && (
                                                        <button
                                                            onClick={() => fetchCookingTips(recipe)}
                                                            disabled={loadingTips[recipe.name]}
                                                            className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold hover:bg-green-600 transition disabled:opacity-50"
                                                        >
                                                            {loadingTips[recipe.name] 
                                                                ? '⏳ Generando...' 
                                                                : '✨ Ver consejos'}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Tips estáticos (siempre visibles) */}
                                                {recipe.cookingTips && recipe.cookingTips.length > 0 && !aiCookingTips[recipe.name] && (
                                                    <p className={`text-sm ${darkMode ? 'text-green-100' : 'text-green-800'} leading-relaxed`}>
                                                        {recipe.cookingTips[0].tip || recipe.cookingTips[0]}
                                                    </p>
                                                )}

                                                {/* Tips generados por IA */}
                                                {aiCookingTips[recipe.name] && (
                                                    <div className="space-y-2">
                                                        {aiCookingTips[recipe.name].map((tip, i) => (
                                                            <div key={i} className="flex items-start gap-2">
                                                                <span className="text-green-500 font-bold text-sm mt-0.5">✓</span>
                                                                <p className={`text-sm ${darkMode ? 'text-green-100' : 'text-green-800'} leading-relaxed`}>
                                                                    {tip}
                                                                </p>
                                                            </div>
                                                        ))}
                                                        <p className={`text-xs mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'} italic`}>
                                                            ✨ {language === 'es' ? 'Consejos personalizados para esta receta' : 'Personalized tips for this recipe'}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Estado cargando */}
                                                {loadingTips[recipe.name] && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                                        <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                                                            {language === 'es' ? 'LUMI está analizando los ingredientes...' : 'LUMI is analyzing the ingredients...'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* NUTRIENT TIPS - CIENCIA DETRÁS */}
                                        {recipe.nutrientTips && recipe.nutrientTips.length > 0 && (
                                            <div>
                                                <h5 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                    <span>🔬</span>
                                                    {language === 'es' ? 'Ciencia detrás de este menú' : 'Science behind this menu'}
                                                </h5>
                                                <div className="space-y-3">
                                                    {recipe.nutrientTips.map((tip, i) => (
                                                        <div key={i} className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg border-l-4 border-blue-500`}>
                                                            <p className={`font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                                                                {tip.icon} {tip.title}
                                                            </p>
                                                            <p className={`text-sm ${darkMode ? 'text-blue-100' : 'text-blue-800'} leading-relaxed`}>
                                                                {tip.tip}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>




                                                <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} rounded-xl p-6 border-l-4 border-indigo-500`}>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {language === 'es'
                                    ? '💡 Este menú se adapta según tus síntomas registrados. Vuelve mañana para un menú diferente basado en cómo te sientes.'
                                    : '💡 This menu adapts based on your logged symptoms. Come back tomorrow for a different menu based on how you feel.'}
                            </p>
                        </div>
            </div>
                        </details>
                        <details style={{borderRadius:'1.25rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.2)',background:darkMode?'rgba(255,255,255,0.03)':'white'}}>
                            <summary style={{listStyle:'none',cursor:'pointer'}}>
                                <div style={{padding:'1.25rem 1.5rem',display:'flex',alignItems:'center',gap:'1rem',background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(253,248,243,0.8))'}}>
                                    <img src='/images/nutri_reloj.png' style={{width:'48px',height:'48px',borderRadius:'50%',objectFit:'cover',flexShrink:0,boxShadow:'0 2px 8px rgba(201,147,90,0.3)'}}/>
                                    <div style={{flex:1}}>
                                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.25rem',fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',margin:0}}>{language==='es'?'Sin tiempo — cocina el domingo':'No time — cook on Sunday'}</p>
                                        <p style={{fontSize:'0.78rem',color:'#C9935A',margin:0}}>{language==='es'?'2 horas = comida sana toda la semana':'2 hours = healthy food all week'}</p>
                                    </div>
                                </div>
                            </summary>
                            <div style={{padding:'1.25rem 1.5rem'}}>
                                {[{time:'30min',es:'Legumbres base',en:'Base legumes',d_es:'Lentejas + garbanzos. Proteína para toda la semana.',d_en:'Lentils + chickpeas. Protein base for the whole week.',icon:'🫘'},{time:'20min',es:'Cereales integrales',en:'Whole grains',d_es:'Arroz integral o quinoa. 5 días en nevera.',d_en:'Brown rice or quinoa. Keeps 5 days in fridge.',icon:'🌾'},{time:'15min',es:'Verduras asadas',en:'Roasted veg',d_es:'Boniato + brócoli a 200°C.',d_en:'Sweet potato + broccoli at 200°C.',icon:'🥦'},{time:'10min',es:'Salsa hormonal',en:'Hormonal sauce',d_es:'Tomate + cúrcuma + AOVE + ajo.',d_en:'Tomato + turmeric + EVOO + garlic.',icon:'🍅'},{time:'5min',es:'Snacks listos',en:'Ready snacks',d_es:'Nueces + almendras + dátiles en tarros.',d_en:'Walnuts + almonds + dates in jars.',icon:'🥜'}].map((item,i)=>(
                                    <div key={i} style={{display:'flex',gap:'1rem',padding:'0.875rem 0',borderBottom:'1px solid rgba(201,147,90,0.1)'}}>
                                        <span style={{fontSize:'1.5rem',flexShrink:0}}>{item.icon}</span>
                                        <div style={{flex:1}}>
                                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                                                <p style={{fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',fontSize:'0.92rem',margin:0}}>{language==='es'?item.es:item.en}</p>
                                                <span style={{fontSize:'0.72rem',color:'#C9935A',background:'rgba(201,147,90,0.1)',borderRadius:'9999px',padding:'2px 8px'}}>{item.time}</span>
                                            </div>
                                            <p style={{fontSize:'0.8rem',color:'#78716c',margin:0,lineHeight:1.5}}>{language==='es'?item.d_es:item.d_en}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </details>
                        <details style={{borderRadius:'1.25rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.2)',background:darkMode?'rgba(255,255,255,0.03)':'white'}}>
                            <summary style={{listStyle:'none',cursor:'pointer'}}>
                                <div style={{padding:'1.25rem 1.5rem',display:'flex',alignItems:'center',gap:'1rem',background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(253,248,243,0.8))'}}>
                                    <img src='/images/nutri_chocolate.png' style={{width:'48px',height:'48px',borderRadius:'50%',objectFit:'cover',flexShrink:0,boxShadow:'0 2px 8px rgba(201,147,90,0.3)'}}/>
                                    <div style={{flex:1}}>
                                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.25rem',fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',margin:0}}>{language==='es'?'Los Irresistibles':'The Irresistibles'}</p>
                                        <p style={{fontSize:'0.78rem',color:'#C9935A',margin:0}}>{language==='es'?'Postres que activan tu GLP-1':'Desserts that activate your GLP-1'}</p>
                                    </div>
                                </div>
                            </summary>
                            <div style={{padding:'1.25rem 1.5rem'}}>
                                {[{icon:'🍫',es:'Mousse chocolate negro',en:'Dark chocolate mousse',cal:'180 kcal',glp:3,p_es:'200g choc 85% + 2 claras + frambuesas. Enfía 2h.',p_en:'200g 85% choc + 2 whites + raspberries. Chill 2h.',w_es:'Flavonoides activan GLP-1 en 30 min.',w_en:'Flavonoids activate GLP-1 in 30 min.'},{icon:'🍨',es:'Helado yogur griego',en:'Greek yogurt ice cream',cal:'120 kcal',glp:2,p_es:'Yogur griego + miel + nueces. Congela 4h.',p_en:'Greek yogurt + honey + walnuts. Freeze 4h.',w_es:'Proteína + probióticos = más GLP-1.',w_en:'Protein + probiotics = more GLP-1.'},{icon:'🟤',es:'Brownie alubias negras',en:'Black bean brownie',cal:'160 kcal',glp:3,p_es:'1 bote alubias + 3 huevos + cacao + miel. 20min 180°.',p_en:'1 tin beans + 3 eggs + cocoa + honey. 20min 180°.',w_es:'Triple: proteína + fibra + flavonoides.',w_en:'Triple: protein + fibre + flavonoids.'},{icon:'🫐',es:'Bowl arándanos',en:'Blueberry bowl',cal:'210 kcal',glp:2,p_es:'Arándanos + granola + yogur + chía + miel.',p_en:'Blueberries + granola + yogurt + chia + honey.',w_es:'Antioxidantes reducen inflamación que bloquea GLP-1.',w_en:'Antioxidants reduce inflammation blocking GLP-1.'},{icon:'🟡',es:'Tarta dátil sin horno',en:'No-bake date tart',cal:'140 kcal',glp:2,p_es:'12 dátiles + cacao + almendras. Tritura y enfía 1h.',p_en:'12 dates + cocoa + almonds. Blend and chill 1h.',w_es:'Fibra del dátil = GLP-1 activo horas.',w_en:'Date fibre = GLP-1 active for hours.'}].map((r,i)=>(
                                    <div key={i} style={{borderRadius:'0.875rem',padding:'1rem',marginBottom:'0.75rem',background:darkMode?'rgba(255,255,255,0.04)':'rgba(253,248,243,0.8)',border:'1px solid rgba(201,147,90,0.15)'}}>
                                        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem'}}>
                                            <span style={{fontSize:'1.5rem'}}>{r.icon}</span>
                                            <div style={{flex:1}}>
                                                <p style={{fontFamily:"'Cormorant',serif",fontSize:'1rem',fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',margin:0}}>{language==='es'?r.es:r.en}</p>
                                                <div style={{display:'flex',gap:'0.5rem',marginTop:'2px'}}>
                                                    <span style={{fontSize:'0.7rem',color:'#78716c'}}>{r.cal}</span>
                                                    <span style={{fontSize:'0.7rem',color:'#C9935A',fontWeight:600}}>{'⚡'.repeat(r.glp)} GLP-1</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{fontSize:'0.8rem',color:darkMode?'#e8d5c0':'#57534e',margin:'0 0 4px',lineHeight:1.5}}>{language==='es'?r.p_es:r.p_en}</p>
                                        <p style={{fontSize:'0.75rem',color:'#C9935A',margin:0,fontStyle:'italic'}}>✦ {language==='es'?r.w_es:r.w_en}</p>
                                    </div>
                                ))}
                            </div>
                        </details>
                        <details style={{borderRadius:'1.25rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.2)',background:darkMode?'rgba(255,255,255,0.03)':'white'}}>
                            <summary style={{listStyle:'none',cursor:'pointer'}}>
                                <div style={{padding:'1.25rem 1.5rem',display:'flex',alignItems:'center',gap:'1rem',background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(253,248,243,0.8))'}}>
                                    <img src='/images/nutri_lista.png' style={{width:'48px',height:'48px',borderRadius:'50%',objectFit:'cover',flexShrink:0,boxShadow:'0 2px 8px rgba(201,147,90,0.3)'}}/>
                                    <div style={{flex:1}}>
                                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.25rem',fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',margin:0}}>{language==='es'?'Voy de compras':'Shopping list'}</p>
                                        <p style={{fontSize:'0.78rem',color:'#C9935A',margin:0}}>{language==='es'?'Los imprescindibles siempre en casa':'The essentials always at home'}</p>
                                    </div>
                                </div>
                            </summary>
                            <div style={{padding:'1.25rem 1.5rem'}}>
                                {[{cat_es:'Proteínas',cat_en:'Proteins',items_es:['Huevos (12u)','Yogur griego','Salmón o sardinas','Legumbres (botes)'],items_en:['Eggs (12)','Greek yogurt','Salmon or sardines','Legumes (tins)'],icon:'🥚'},{cat_es:'Grasas buenas',cat_en:'Good fats',items_es:['Aguacates','Nueces o almendras','Aceite oliva virgen extra','Lino o chía'],items_en:['Avocados','Walnuts or almonds','Extra virgin olive oil','Flax or chia'],icon:'🥑'},{cat_es:'Fibra',cat_en:'Fibre',items_es:['Brócoli','Boniato','Espinacas','Manzana con piel'],items_en:['Broccoli','Sweet potato','Spinach','Apple with skin'],icon:'🥦'},{cat_es:'Activadores GLP-1',cat_en:'GLP-1 activators',items_es:['Chocolate 85%+','Kéfir o kombucha','Jengibre fresco','Avena integral'],items_en:['85%+ chocolate','Kefir or kombucha','Fresh ginger','Whole oats'],icon:'⚡'}].map((cat,i)=>(
                                    <div key={i} style={{marginBottom:'1rem'}}>
                                        <p style={{fontSize:'0.72rem',color:'#C9935A',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'6px'}}><span>{cat.icon}</span>{language==='es'?cat.cat_es:cat.cat_en}</p>
                                        {(language==='es'?cat.items_es:cat.items_en).map((item,j)=>(
                                            <div key={j} style={{display:'flex',alignItems:'center',gap:'8px',padding:'0.35rem 0',borderBottom:'1px solid rgba(201,147,90,0.08)'}}>
                                                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#C9935A',flexShrink:0}}/>
                                                <p style={{fontSize:'0.85rem',color:darkMode?'#e8d5c0':'#44403c',margin:0}}>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </details>
                        <details style={{borderRadius:'1.25rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.2)',background:darkMode?'rgba(255,255,255,0.03)':'white'}}>
                            <summary style={{listStyle:'none',cursor:'pointer'}}>
                                <div style={{padding:'1.25rem 1.5rem',display:'flex',alignItems:'center',gap:'1rem',background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(253,248,243,0.8))'}}>
                                    <img src='/images/nutri_cerebro.png' style={{width:'48px',height:'48px',borderRadius:'50%',objectFit:'cover',flexShrink:0,boxShadow:'0 2px 8px rgba(201,147,90,0.3)'}}/>
                                    <div style={{flex:1}}>
                                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.25rem',fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',margin:0}}>{language==='es'?'Aprendiendo':'Learning'}</p>
                                        <p style={{fontSize:'0.78rem',color:'#C9935A',margin:0}}>{language==='es'?'GLP-1, IMC, TDEE y Cortisol explicados':'GLP-1, BMI, TDEE and Cortisol explained'}</p>
                                    </div>
                                </div>
                            </summary>
                            <div style={{padding:'1.25rem 1.5rem'}}>
                                {[{term:'GLP-1',icon:'🔬',color:'#C9935A',d_es:'Tu hormona del apetito natural.',d_en:'Your natural appetite hormone.',x_es:'Cuando está alta: te sacias más rápido, menos antojos, mejor metabolismo. Ozempic la imita artificialmente. Tú puedes activarla con comida real.',x_en:'When high: you feel full faster, fewer cravings, better metabolism. Ozempic mimics it artificially. You can activate it with real food.'},{term:'IMC',icon:'📊',color:'#B87333',d_es:'Índice de Masa Corporal. Una referencia, no un juicio.',d_en:'Body Mass Index. A reference, not a judgement.',x_es:'En la transición hormonal puede subir aunque comas igual: el estrógeno bajo redistribuye la grasa. No es tu fracaso, es biología.',x_en:'During hormonal transition it can rise even eating the same: low oestrogen redistributes fat. Not your failure, it is biology.'},{term:'TDEE',icon:'⚡',color:'#D97706',d_es:'Las calorías que tu cuerpo necesita cada día.',d_en:'The calories your body needs each day.',x_es:'Comer muy por debajo sube el cortisol y baja el metabolismo. Tu menú está calibrado a tu TDEE.',x_en:'Eating far below raises cortisol and slows metabolism. Your menu is calibrated to your TDEE.'},{term:'Cortisol',icon:'😤',color:'#78716c',d_es:'La hormona del estrés. El enemigo del GLP-1.',d_en:'The stress hormone. The enemy of GLP-1.',x_es:'Cuando sube bloquea el GLP-1 y almacena grasa en la cintura. Dormir bien y no saltarse comidas es tan importante como qué comes.',x_en:'When it rises it blocks GLP-1 and stores fat around the waist. Sleeping well and not skipping meals is as important as what you eat.'}].map((item,i)=>(
                                    <div key={i} style={{borderRadius:'0.875rem',padding:'1rem',marginBottom:'0.75rem',background:darkMode?'rgba(255,255,255,0.04)':'rgba(253,248,243,0.8)',border:'1px solid rgba(201,147,90,0.15)'}}>
                                        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem'}}>
                                            <span style={{fontSize:'1.4rem'}}>{item.icon}</span>
                                            <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.2rem',fontWeight:700,color:item.color,margin:0}}>{item.term}</p>
                                        </div>
                                        <p style={{fontSize:'0.87rem',fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',margin:'0 0 6px',lineHeight:1.4}}>{language==='es'?item.d_es:item.d_en}</p>
                                        <p style={{fontSize:'0.8rem',color:darkMode?'#a8a29e':'#78716c',margin:0,lineHeight:1.6}}>{language==='es'?item.x_es:item.x_en}</p>
                                    </div>
                                ))}
                            </div>
                        </details>
                        </div>
                        {/* MI PROGRESO */}
                        <details style={{borderRadius:'1.25rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.2)',background:darkMode?'rgba(255,255,255,0.03)':'white',marginTop:'1.5rem'}}>
                            <summary style={{listStyle:'none',cursor:'pointer'}}>
                                <div style={{padding:'1.25rem 1.5rem',display:'flex',alignItems:'center',gap:'1rem',background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(253,248,243,0.8))'}}>
                                    <img src='/images/nutri_progreso.png' style={{width:'48px',height:'48px',borderRadius:'50%',objectFit:'cover',flexShrink:0,boxShadow:'0 2px 8px rgba(201,147,90,0.3)'}}/>
                                    <div style={{flex:1}}>
                                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.25rem',fontWeight:600,color:darkMode?'#fdf8f3':'#1c1917',margin:0}}>{language==='es'?'Mis datos metabólicos':'My metabolic data'}</p>
                                        <p style={{fontSize:'0.78rem',color:'#C9935A',margin:0}}>{language==='es'?'IMC, TDEE y tendencias':'BMI, TDEE and trends'}</p>
                                    </div>
                                </div>
                            </summary>
                            <div style={{padding:'0.5rem'}}>
                        {(getUserTier() === 'premium' || getUserTier() === 'trial') && (
                            <div className="relative rounded-2xl shadow-2xl overflow-hidden mb-8" style={{
                                background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.3) 0%, rgba(251, 207, 232, 0.3) 25%, rgba(216, 180, 254, 0.3) 50%, rgba(165, 180, 252, 0.3) 75%, rgba(254, 202, 202, 0.3) 100%)'
                            }}>
                                {/* Overlay sutil */}
                                <div className="absolute inset-0" style={{background: 'rgba(255,255,255,0.65)'}}></div>

                                {/* Contenido */}
                                <div className="relative z-10 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-semibold gradient-text mb-2">
                                                {language === 'es' ? 'Tu Transformación' : 'Your Transformation'}
                                            </h3>
                                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {language === 'es' ? 'Como la serpiente muda su piel, tú estás transformándote' : 'Like the snake sheds its skin, you are transforming'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {chartData && (
                                                <button
                                                    onClick={() => setShowDashboardModal(true)}
                                                    className="text-amber-700 hover:text-amber-800 text-sm font-semibold"
                                                >
                                                    📊 {language === 'es' ? 'Ver gráficos' : 'View charts'}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setEditWeight(currentUser?.weight || '');
                                                    setEditHeight(currentUser?.height || '');
                                                    setEditAge(currentUser?.age || '');
                                                    setEditActivityLevel(currentUser?.activity_level || 'moderate');
                                                    setEditGoal(currentUser?.goal || 'maintain');
                                                    setShowProfileModal(true);
                                                }}
                                                className="text-amber-700 hover:text-amber-800 text-sm font-semibold"
                                            >
                                                ✏️ {language === 'es' ? 'Editar' : 'Edit'}
                                            </button>
                                        </div>
                                    </div>

                                {getMetrics() ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className={`${darkMode ? 'bg-blue-900/40' : 'bg-blue-50'} p-4 rounded-xl`}>
                                            <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-600'} font-semibold mb-1`}>
                                                IMC
                                            </p>
                                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {getMetrics().bmi}
                                            </p>
                                        </div>
                                        <div className={`${darkMode ? 'bg-green-900/40' : 'bg-green-50'} p-4 rounded-xl`}>
                                            <p className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-600'} font-semibold mb-1`}>
                                                TMB
                                            </p>
                                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {getMetrics().bmr}
                                            </p>
                                        </div>
                                        <div className={`${darkMode ? 'bg-stone-900/40' : 'bg-amber-50'} p-4 rounded-xl`}>
                                            <p className={`text-xs ${darkMode ? 'text-amber-300' : 'text-amber-700'} font-semibold mb-1`}>
                                                TDEE
                                            </p>
                                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {getMetrics().tdee}
                                            </p>
                                        </div>
                                        <div className={`${darkMode ? 'bg-pink-900/40' : 'bg-pink-50'} p-4 rounded-xl`}>
                                            <p className={`text-xs ${darkMode ? 'text-pink-300' : 'text-pink-600'} font-semibold mb-1`}>
                                                {language === 'es' ? 'Objetivo' : 'Target'}
                                            </p>
                                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {getMetrics().target}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`${darkMode ? 'bg-yellow-900/40 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border-2 border-dashed rounded-xl p-6 text-center`}>
                                        <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'} mb-3`}>
                                            {language === 'es' 
                                                ? '⚠️ Completa tu perfil metabólico para menús ultra-personalizados'
                                                : '⚠️ Complete your metabolic profile for ultra-personalized menus'}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setEditWeight(currentUser?.weight || '');
                                                setEditHeight(currentUser?.height || '');
                                                setEditAge(currentUser?.age || '');
                                                setEditActivityLevel(currentUser?.activity_level || 'moderate');
                                                setEditGoal(currentUser?.goal || 'maintain');
                                                setShowProfileModal(true);
                                            }}
                                            className="bg-gradient-to-r from-amber-600 to-amber-400 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                                        >
                                            {language === 'es' ? 'Completar Ahora' : 'Complete Now'}
                                        </button>
                                    </div>
                                )}
                                </div>
                            </div>
                        )}

                        {/* GRÁFICOS DE TENDENCIA - Trial y Premium con síntomas */}
                        {(getUserTier() === 'premium' || getUserTier() === 'trial') && symptoms.length >= 3 && (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-8`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold gradient-text">
                                            📊 {language === 'es' ? 'Tus Tendencias' : 'Your Trends'}
                                        </h3>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {language === 'es' ? 'Últimos 7 días' : 'Last 7 days'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage('symptoms')}
                                        className="text-xs text-amber-700 font-semibold hover:underline"
                                    >
                                        {language === 'es' ? 'Ver detalle →' : 'See detail →'}
                                    </button>
                                </div>

                                {/* Mini tarjetas de promedio */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                    {[
                                        { label: language === 'es' ? 'Sueño' : 'Sleep', key: 'sleep', color: '#C9935A', icon: '😴' },
                                        { label: language === 'es' ? 'Energía' : 'Energy', key: 'energy', color: 'pink', icon: '⚡' },
                                        { label: language === 'es' ? 'Ánimo' : 'Mood', key: 'mood', color: 'blue', icon: '🪨' },
                                        { label: language === 'es' ? 'Sofocos' : 'Hot flashes', key: 'hot_flashes', color: 'orange', icon: '🔥' }
                                    ].map(metric => {
                                        const last7 = symptoms.slice(0, 7);
                                        const avg = last7.reduce((sum, s) => sum + (s[metric.key] || 0), 0) / last7.length;
                                        const prev7 = symptoms.slice(7, 14);
                                        const prevAvg = prev7.length > 0 ? prev7.reduce((sum, s) => sum + (s[metric.key] || 0), 0) / prev7.length : avg;
                                        const trend = avg > prevAvg ? '↑' : avg < prevAvg ? '↓' : '→';
                                        const trendColor = metric.key === 'hot_flashes' 
                                            ? (avg < prevAvg ? 'text-green-500' : avg > prevAvg ? 'text-red-500' : 'text-gray-400')
                                            : (avg > prevAvg ? 'text-green-500' : avg < prevAvg ? 'text-red-500' : 'text-gray-400');
                                        return (
                                            <div key={metric.key} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-3 text-center`}>
                                                <div className="text-lg mb-1">{metric.icon}</div>
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>{metric.label}</p>
                                                <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{avg.toFixed(1)}</p>
                                                <p className={`text-sm font-semibold ${trendColor}`}>{trend}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Barra visual simple para cada métrica */}
                                {[
                                    { label: language === 'es' ? 'Sueño' : 'Sleep', key: 'sleep', color: '#C9935A' },
                                    { label: language === 'es' ? 'Energía' : 'Energy', key: 'energy', color: '#C9935A' },
                                    { label: language === 'es' ? 'Ánimo' : 'Mood', key: 'mood', color: '#06b6d4' }
                                ].map(metric => {
                                    const last7 = symptoms.slice(0, 7).reverse();
                                    return (
                                        <div key={metric.key} className="mb-3">
                                            <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</p>
                                            <div className="flex items-end gap-1 h-10">
                                                {last7.map((s, i) => {
                                                    const val = s[metric.key] || 0;
                                                    const height = (val / 10) * 100;
                                                    return (
                                                        <div
                                                            key={i}
                                                            className="flex-1 rounded-t-sm transition-all"
                                                            style={{ height: height + '%', backgroundColor: metric.color, opacity: 0.7 + (i / last7.length) * 0.3 }}
                                                            title={val + '/10'}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {language === 'es' ? 'hace 7 días' : '7 days ago'}
                                                </span>
                                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {language === 'es' ? 'hoy' : 'today'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Para trial: mensaje para upgrade */}
                            </div>
                        )}

                        {/* PREVIEW gráficos para TRIAL - día 3 */}
                        {getUserTier() === 'trial' && symptoms.length >= 3 && (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-8 relative overflow-hidden`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold gradient-text">
                                        📊 {language === 'es' ? 'Tus Tendencias' : 'Your Trends'}
                                    </h3>
                                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-semibold">
                                        {language === 'es' ? '✦ Premium' : '✦ Premium'}
                                    </span>
                                </div>

                                {/* Preview borroso */}
                                <div className="relative">
                                    <div className="blur-sm opacity-50 pointer-events-none">
                                        <div className="grid grid-cols-4 gap-3 mb-4">
                                            {['😴', '⚡', '🪨', '🔥'].map((icon, i) => (
                                                <div key={i} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-3 text-center`}>
                                                    <div className="text-lg mb-1">{icon}</div>
                                                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>7.{i}</p>
                                                    <p className="text-sm text-green-500">↑</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-end gap-1 h-12">
                                            {[6,7,5,8,7,9,8].map((v, i) => (
                                                <div key={i} className="flex-1 rounded-t-sm bg-amber-400" style={{ height: (v/10*100) + '%' }} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Overlay CTA */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2 text-center`}>
                                            {language === 'es' 
                                                ? '¡Ya tienes datos suficientes para ver tus patrones!' 
                                                : 'You have enough data to see your patterns!'}
                                        </p>
                                        <button
                                            onClick={() => setCurrentPage('premium')}
                                            className="bg-gradient-to-r from-amber-600 to-amber-400 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                                        >
                                            {language === 'es' ? '✦ Desbloquear tendencias' : '✦ Unlock trends'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                            </div>
                        </details>
                    </div>
                );
            };

            const renderExercise = () => {
                const allExercises = getExercises();
                const objectives = { strength: language === 'es' ? '💪 Ganar Fuerza' : '💪 Build Strength', weightLoss: language === 'es' ? '⚡ Perder Peso' : '⚡ Lose Weight', hormonal: language === 'es' ? '🧘 Equilibrio Hormonal' : '🧘 Hormonal Balance' };

                // Función para filtrar ejercicios según nivel de usuario
                const getFiltered = () => {
                    if (!allExercises || allExercises.length === 0) return [];
                    const tier = getUserTier();

                    // FREE: estáticos por semana
                    if (tier === 'free') {
                        const today = new Date();
                        const startOfYear = new Date(today.getFullYear(), 0, 1);
                        const weekNumber = Math.floor(((today - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
                        const startIdx = (weekNumber * 3) % allExercises.length;
                        const result = [];
                        for (let i = 0; i < 3; i++) {
                            result.push(allExercises[(startIdx + i) % allExercises.length]);
                        }
                        return result;
                    }

                    // TRIAL / PREMIUM: detectar síntomas - usar slice(0,3) porque ya vienen DESC
                    let hasJointPain = false, hasLowEnergy = false, hasHighAnxiety = false, hasLowSleep = false;
                    let inPeriod = isInPeriodDays();

                    if (symptoms && symptoms.length > 0) {
                        const recent = symptoms.slice(0, 3); // Los más recientes (BD los devuelve DESC)
                        recent.forEach(s => {
                            if ((s.hot_flashes || s.hotFlashes || 0) >= 6) hasJointPain = true; // sofocos altos → no HIIT
                            if ((s.energy || 10) <= 4) hasLowEnergy = true;
                            if ((s.anxiety || 0) >= 5) hasHighAnxiety = true;
                            if ((s.sleep || 10) <= 4) hasLowSleep = true;
                        });
                    }

                    // En periodo → ejercicios suaves específicos
                    if (inPeriod) {
                        return [
                            {
                                name: language === 'es' ? 'Yoga Restaurativo' : 'Restorative Yoga',
                                duration: '30 min', difficulty: language === 'es' ? 'Fácil' : 'Easy', freq: language === 'es' ? 'Estos días' : 'These days',
                                why: language === 'es' ? 'Estos días tu cuerpo pide descanso, no esfuerzo. Este yoga le da exactamente eso: calma y espacio para recuperarse.' : 'These days your body asks for rest, not effort. This yoga gives exactly that: calm and space to recover.',
                                science: language === 'es' ? 'Estudios muestran que este tipo de yoga reduce el dolor estos días hasta un 30-40%. Tu cuerpo lo agradece.' : 'Studies show this type of yoga reduces pain these days up to 30-40%. Your body appreciates it.',
                                steps: language === 'es'
                                    ? ['Posturas: Niño, piernas en pared, savasana', 'Mantén cada postura 3-5 minutos', 'Pon manta bajo rodillas si necesitas', 'Respiración profunda: 4 seg entrada, 6 seg salida', 'No fuerces — estos días pide descanso', 'Equipo: Colchoneta, manta']
                                    : ['Poses: Child\'s, legs up wall, savasana', 'Hold each pose 3-5 minutes', 'Put blanket under knees if needed', 'Deep breathing: 4 sec in, 6 sec out', 'Don\'t force — these days ask for rest', 'Equipment: Mat, blanket']
                            },
                            {
                                name: language === 'es' ? 'Caminata Suave' : 'Gentle Walk',
                                duration: '20 min', difficulty: language === 'es' ? 'Fácil' : 'Easy', freq: language === 'es' ? 'Estos días' : 'These days',
                                why: language === 'es' ? 'No necesitas hacer mucho estos días. Caminar suave ya es suficiente. Le ayuda a tu cuerpo a sentirse mejor sin pedirte nada.' : 'You don\'t need to do much these days. Walking gently is enough. It helps your body feel better without asking anything of you.',
                                science: language === 'es' ? 'Con 20 minutos caminando tu cuerpo libera algo que calma el dolor de forma natural. Es un regalo fácil para ti.' : 'In 20 minutes of walking your body releases something that naturally calms pain. It\'s an easy gift to yourself.',
                                steps: language === 'es'
                                    ? ['Ritmo tranquilo, sin prisa', 'Al aire libre si es posible', 'Si tienes cólicos fuertes, espera a que bajen', 'Respira profundo y disfruta', 'Equipo: Zapatillas cómodas']
                                    : ['Relaxed pace, no rush', 'Outdoors if possible', 'If cramps are strong, wait until they ease', 'Breathe deep and enjoy', 'Equipment: Comfortable shoes']
                            },
                            {
                                name: language === 'es' ? 'Estiramiento Pélvico' : 'Pelvic Stretch',
                                duration: '15 min', difficulty: language === 'es' ? 'Fácil' : 'Easy', freq: language === 'es' ? 'Estos días' : 'These days',
                                why: language === 'es' ? 'Va directo a donde duele. Es ese estiramiento que la mayoría no conoce pero que funciona muy bien para la zona baja.' : 'Goes directly to where it hurts. It\'s the stretch most don\'t know but works really well for the lower area.',
                                science: language === 'es' ? 'Muchas mujeres reportan que con solo 2-3 semanas de esto notan menos tensión en la zona baja. Es simple pero muy efectivo.' : 'Many women report that with just 2-3 weeks of this they notice less tension in the lower area. Simple but very effective.',
                                steps: language === 'es'
                                    ? ['Tumbada boca arriba, rodillas flexionadas', 'Cruza una pierna formando número 4', 'Tira suavemente de la otra pierna hacia ti', 'Mantén 30 seg, respira profundo', 'Cambia de lado', 'Luego: rodillas al pecho, balancéate suave']
                                    : ['Lie on back, knees bent', 'Cross one leg forming figure 4', 'Gently pull the other leg toward you', 'Hold 30 sec, breathe deep', 'Switch sides', 'Then: knees to chest, gently rock']
                            }
                        ];
                    }

                    // Filtrar según síntomas
                    let filtered = allExercises.filter(ex => {
                        if (hasJointPain && (ex.name.toLowerCase().includes('hiit') || ex.name.toLowerCase().includes('saltar') || ex.name.toLowerCase().includes('jump'))) return false;
                        if (hasLowEnergy && (ex.difficulty === 'Alta' || ex.difficulty === 'High')) return false;
                        return true;
                    });

                    // Ansiedad alta o mal sueño → reordenar: suaves primero
                    if (hasHighAnxiety || hasLowSleep) {
                        filtered.sort((a, b) => {
                            const softA = (a.difficulty === 'Fácil' || a.difficulty === 'Easy') ? 0 : 1;
                            const softB = (b.difficulty === 'Fácil' || b.difficulty === 'Easy') ? 0 : 1;
                            return softA - softB;
                        });
                    }

                    return filtered.slice(0, 3);
                };

                const exercises = getFiltered();

                return (
                    <div className="pb-32 space-y-8" key={`exercise-${language}`} style={{position: 'relative'}}>
                        <video autoPlay loop muted playsInline src="/videos/ejercicio.mp4"
                            style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.18}} />
                        <div>
                            <h2 className="text-3xl font-light gradient-text">{t[language].exercise}</h2>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{objectives[exerciseGoal]}</p>
                        </div>

                        <div style={{background:darkMode?'rgba(201,147,90,0.08)':'rgba(253,248,243,0.95)',borderRadius:'1.1rem',padding:'1rem 1.25rem',borderLeft:'3px solid #C9935A'}}>
                            <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
                                <img src="/images/lumi.png" style={{width:'28px',height:'28px',borderRadius:'50%',objectFit:'cover',flexShrink:0}} alt="LUMI" />
                                <p style={{fontSize:'0.88rem',color:darkMode?'#e8d5c0':'#57534e',fontStyle:'italic',lineHeight:1.6}}>
                                    {getLumiMessage('exercise')}
                                </p>
                            </div>
                        </div>

                        {/* CHALLENGE SUELO PÉLVICO */}
                        <PelvicFloorChallenge language={language} darkMode={darkMode} userTier={getUserTier()} />

                        {/* EJERCICIOS PERSONALIZADOS - Trial y Premium */}
                        {(getUserTier() === 'premium' || getUserTier() === 'trial') && (
                            <div className={`${darkMode ? 'bg-gray-800 border-amber-700' : 'bg-amber-50 border-amber-200'} rounded-xl p-5 border`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className={`font-semibold ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                            {language === 'es' ? 'Rutina personalizada para ti' : 'Personalized routine for you'}
                                        </h3>
                                        <p className={`text-xs mt-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                            {language === 'es' 
                                                ? 'Basada en tus síntomas recientes y condiciones de salud' 
                                                : 'Based on your recent symptoms and health conditions'}
                                        </p>
                                    </div>
                                    {!aiExercises && (
                                        <button
                                            onClick={fetchPersonalizedExercises}
                                            disabled={loadingExercises}
                                            className="bg-gradient-to-r from-amber-600 to-amber-400 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {loadingExercises 
                                                ? (language === 'es' ? '⏳ Generando...' : '⏳ Generating...')
                                                : (language === 'es' ? '✨ Personalizar' : '✨ Personalize')}
                                        </button>
                                    )}
                                    {aiExercises && (
                                        <button
                                            onClick={() => setAiExercises(null)}
                                            className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} underline`}
                                        >
                                            {language === 'es' ? 'Ver estándar' : 'View standard'}
                                        </button>
                                    )}
                                </div>

                                {loadingExercises && (
                                    <div className="flex items-center gap-3 py-4">
                                        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className={`text-sm ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                            {language === 'es' 
                                                ? 'Analizando tus síntomas para crear tu rutina...' 
                                                : 'Analyzing your symptoms to create your routine...'}
                                        </p>
                                    </div>
                                )}

                                {aiExercises && (
                                    <div className="space-y-3 mt-3">
                                        {aiExercises.map((ex, i) => (
                                            <div key={i} className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-4`}>
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ex.name}</h4>
                                                    <div className="flex gap-2 shrink-0">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700'}`}>{ex.duration}</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>{ex.difficulty}</span>
                                                    </div>
                                                </div>
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{ex.why}</p>
                                                {ex.steps && (
                                                    <ol className="space-y-1">
                                                        {ex.steps.map((step, j) => (
                                                            <li key={j} className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex gap-2`}>
                                                                <span className="text-amber-600 font-bold shrink-0">{j+1}.</span>
                                                                {step}
                                                            </li>
                                                        ))}
                                                    </ol>
                                                )}
                                                {(() => {
                                                    const ytUrl = ex.youtube || 
                                                        `https://www.youtube.com/results?search_query=${encodeURIComponent((ex.name || '') + (language === 'es' ? ' ejercicio mujeres menopausia' : ' exercise women menopause'))}`;
                                                    return (
                                                        <div className="mt-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                                                            <p className="text-sm font-medium text-red-800 mb-2">
                                                                🎥 {language === 'es' ? 'Video de referencia:' : 'Reference video:'}
                                                            </p>
                                                            <a
                                                                href={ytUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-red-600 underline text-sm hover:text-red-800"
                                                            >
                                                                {language === 'es' ? 'Ver en YouTube →' : 'Watch on YouTube →'}
                                                            </a>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        ))}
                                        <p className={`text-xs ${darkMode ? 'text-amber-500' : 'text-amber-700'} italic text-center mt-2`}>
                                            ✨ {language === 'es' ? 'Rutina adaptada a cómo te has sentido esta semana' : 'Routine adapted to how you\'ve felt this week'}
                                        </p>
                                    </div>
                                )}

                                {!aiExercises && !loadingExercises && symptoms.length === 0 && (
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                                        {language === 'es' 
                                            ? 'Registra algunos síntomas para personalizar tu rutina' 
                                            : 'Track some symptoms to personalize your routine'}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* NUDGE FREE → PREMIUM */}
                        {getUserTier() === 'free' && (
                            <div style={{background:darkMode?'rgba(201,147,90,0.1)':'rgba(253,248,243,0.95)',borderRadius:'1.1rem',padding:'1rem 1.25rem',border:'1px solid rgba(201,147,90,0.25)',display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
                                <span style={{color:'#C9935A',fontSize:'1.1rem',flexShrink:0}}>✦</span>
                                <div>
                                    <p style={{fontSize:'0.85rem',fontWeight:600,color:darkMode?'#e8d5c0':'#92580a',marginBottom:'0.25rem'}}>
                                        {language === 'es' ? 'Con Premium, estos ejercicios se adaptan cada día según cómo te sientes' : 'With Premium, these exercises adapt every day based on how you feel'}
                                    </p>
                                    <p style={{fontSize:'0.78rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.5}}>
                                        {language === 'es' 
                                            ? 'Si tienes dolor articular, bajo ánimo o estás en periodo, Lumera lo detecta y ajusta automáticamente.' 
                                            : 'If you have joint pain, low mood or are on your period, Lumera detects it and adjusts automatically.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div style={{display:'flex',gap:'0.75rem',overflowX:'auto',paddingBottom:'1rem'}}>
                            {[
                                {key:'strength',img:'/images/ejer_fuerza.png'},
                                {key:'weightLoss',img:'/images/ejer_espiral.png'},
                                {key:'hormonal',img:'/images/ejer_hormonal.png'},
                            ].map((obj) => (
                                <button key={obj.key} onClick={() => setExerciseGoal(obj.key)} style={{
                                    display:'flex',alignItems:'center',gap:'0.5rem',
                                    padding:'0.5rem 1.1rem',borderRadius:'9999px',fontWeight:600,
                                    whiteSpace:'nowrap',transition:'all 0.2s',border:'1px solid rgba(201,147,90,0.3)',cursor:'pointer',
                                    background: exerciseGoal === obj.key ? 'linear-gradient(135deg,#C9935A,#e8c89f)' : darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(201,147,90,0.08)',
                                    color: exerciseGoal === obj.key ? 'white' : darkMode ? '#e8d5c0' : '#92580a',
                                    boxShadow: exerciseGoal === obj.key ? '0 2px 10px rgba(201,147,90,0.35)' : 'none',
                                    fontSize:'0.82rem',
                                }}>
                                    <img src={obj.img} style={{width:'22px',height:'22px',borderRadius:'50%',objectFit:'cover',flexShrink:0}}/>
                                    {obj.key === 'strength' ? t[language].strength : obj.key === 'weightLoss' ? t[language].weightLoss : t[language].hormonal}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {exercises.map((ex, idx) => (
                                <details key={idx} style={{background:darkMode?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.92)',borderRadius:'1.1rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.18)',boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
                                    <summary style={{padding:'1rem 1.25rem',cursor:'pointer',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(232,200,159,0.08))'}}>
                                        <div>
                                            <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.15rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524',marginBottom:'0.2rem'}}>
                                                <span style={{color:'#C9935A',marginRight:'0.4rem'}}>✦</span>{ex.name}
                                            </h3>
                                            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
                                                <span style={{fontSize:'0.72rem',color:'#C9935A',fontWeight:600}}>{ex.duration}</span>
                                                <span style={{fontSize:'0.72rem',color:'#92580a'}}>{ex.difficulty}</span>
                                                <span style={{fontSize:'0.72rem',color:'#78716c'}}>{ex.freq}</span>
                                            </div>
                                        </div>
                                        <span style={{color:'#C9935A',fontSize:'1.1rem',flexShrink:0}}>›</span>
                                    </summary>
                                    <div style={{padding:'1rem 1.25rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                                        <div style={{borderLeft:'3px solid #C9935A',paddingLeft:'0.75rem'}}>
                                            <p style={{fontSize:'0.8rem',fontWeight:600,color:'#C9935A',marginBottom:'0.2rem'}}>{t[language].why}</p>
                                            <p style={{fontSize:'0.85rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.5}}>{ex.why}</p>
                                        </div>
                                        {ex.steps && ex.steps.length > 0 && (
                                            <div style={{borderLeft:'3px solid rgba(201,147,90,0.4)',paddingLeft:'0.75rem'}}>
                                                <p style={{fontSize:'0.8rem',fontWeight:600,color:'#92580a',marginBottom:'0.4rem'}}>{language==='es'?'Cómo hacerlo':'How to do it'}</p>
                                                <ol style={{paddingLeft:'1rem',margin:0}}>
                                                    {ex.steps.map((step, i) => (
                                                        <li key={i} style={{fontSize:'0.82rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.5,marginBottom:'0.25rem'}}>
                                                            <span style={{color:'#C9935A',fontWeight:700,marginRight:'0.3rem'}}>{i+1}.</span>{step}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                </details>
                            ))}
                        </div>


                                                <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} rounded-xl p-6 border-l-4 border-indigo-500`}>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {getUserTier() === 'free'
                                    ? (language === 'es'
                                        ? '💡 Con Premium, estos ejercicios se adaptan cada día según cómo te sientes.'
                                        : '💡 With Premium, these exercises adapt every day based on how you feel.')
                                    : (language === 'es'
                                        ? '💡 Estos ejercicios se adaptan según tus restricciones y energía.'
                                        : '💡 These exercises adapt based on your restrictions and energy.')}
                            </p>
                        </div>
                    </div>
                );
            };

            const renderSymptoms = () => {
                return (
                    <div className="pb-32 space-y-8" key={`symptoms-${language}`}>
                        <h2 className="text-3xl font-light gradient-text">{t[language].symptoms}</h2>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 space-y-6`}>
                            <h3 className="font-semibold text-lg">{language === 'es' ? 'Registra tu día' : 'Track your day'}</h3>

                            <div className="space-y-4">
                                <style>{`.lumera-slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:9999px;outline:none;cursor:pointer;background:linear-gradient(to right,#C9935A calc(var(--val,5)*10%),#e8d5c0 calc(var(--val,5)*10%))}.lumera-slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#C9935A,#e8c89f);cursor:pointer;box-shadow:0 1px 6px rgba(201,147,90,0.4)}.lumera-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#C9935A,#e8c89f);cursor:pointer;border:none}`}</style>
                                {[
                                    { key: 'sleep', label: language === 'es' ? 'Calidad del sueño' : 'Sleep quality' },
                                    { key: 'energy', label: language === 'es' ? 'Nivel de energía' : 'Energy level' },
                                    { key: 'mood', label: language === 'es' ? 'Ánimo' : 'Mood' },
                                    { key: 'hotFlashes', label: language === 'es' ? 'Sofocos' : 'Hot flashes' },
                                    { key: 'anxiety', label: language === 'es' ? 'Ansiedad' : 'Anxiety' },
                                    { key: 'vaginalDryness', label: language === 'es' ? 'Sequedad vaginal' : 'Vaginal dryness' },
                                    { key: 'brainFog', label: language === 'es' ? 'Niebla mental' : 'Brain fog' },
                                    { key: 'memory', label: language === 'es' ? 'Memoria/Claridad' : 'Memory/Clarity' }
                                ].map((item) => (
                                    <div key={item.key}>
                                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.4rem'}}>
                                            <label style={{fontSize:'0.875rem',fontWeight:600,color:darkMode?'#e8d5c0':'#57534e',display:'flex',alignItems:'center',gap:'0.4rem'}}>
                                                <span style={{color:'#C9935A',fontSize:'0.65rem'}}>✦</span>{item.label}
                                            </label>
                                            <span style={{color:'#C9935A',fontWeight:700,fontSize:'0.875rem'}}>{symptomForm[item.key]}/10</span>
                                        </div>
                                        <input type="range" min="0" max="10" value={symptomForm[item.key]} onChange={(e) => setSymptomForm({...symptomForm, [item.key]: parseInt(e.target.value)})} className="lumera-slider" style={{'--val':symptomForm[item.key]}}/>
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-sm font-semibold mb-2">{language === 'es' ? 'Fecha' : 'Date'}</label>
                                    <input type="date" value={symptomForm.date} onChange={(e) => setSymptomForm({...symptomForm, date: e.target.value})} style={{width:'100%',padding:'0.5rem 1rem',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.6rem',background:darkMode?'rgba(255,255,255,0.05)':'white',color:darkMode?'white':'#292524',outline:'none'}}/>
                                </div>
                            </div>

                            <button onClick={async () => {
                                // Guardar en Supabase para persistencia (snake_case)
                                const supabaseRecord = {
                                    user_id: currentUser.id,
                                    symptom_date: symptomForm.date,
                                    sleep: symptomForm.sleep,
                                    energy: symptomForm.energy,
                                    mood: symptomForm.mood,
                                    hot_flashes: symptomForm.hotFlashes,
                                    anxiety: symptomForm.anxiety,
                                    vaginal_dryness: symptomForm.vaginalDryness,
                                    brain_fog: symptomForm.brainFog,
                                    memory: symptomForm.memory,
                                    created_at: new Date().toISOString()
                                };

                                const { data: savedRecord, error: saveError } = await supabase
                                    .from('symptoms')
                                    .insert([supabaseRecord])
                                    .select()
                                    .single();

                                if (saveError) {
                                    // Continuar con estado local aunque falle Supabase
                                } else {
                                }

                                // Usar el record de Supabase si se guardó (tiene ambas nomenclaturas via el select)
                                // O el form local como fallback - añadir ambas nomenclaturas para el scoring
                                const symptomWithBothFormats = {
                                    ...symptomForm,
                                    // Añadir snake_case para que el scoring lo encuentre siempre
                                    hot_flashes: symptomForm.hotFlashes,
                                    brain_fog: symptomForm.brainFog,
                                    vaginal_dryness: symptomForm.vaginalDryness,
                                    ...(savedRecord || {})
                                };

                                const newSymptoms = [symptomWithBothFormats, ...symptoms];
                                setSymptoms(newSymptoms);
                                setTimeout(() => setShowOraclePopup(true), 800);
                                setSymptomForm({ sleep: 5, energy: 5, mood: 5, hotFlashes: 0, anxiety: 5, vaginalDryness: 0, brainFog: 0, memory: 5, date: new Date().toISOString().split('T')[0] });
                                // Verificar patrones después de guardar
                                setTimeout(() => checkAndShowPattern(newSymptoms), 500);
                                // Mostrar notificación personalizada
                                const notification = document.createElement('div');
                                notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md'; notification.style.background='linear-gradient(135deg,#0D0D0D,#1a1008)'; notification.style.border='1px solid rgba(184,115,51,0.4)';
                                notification.innerHTML = `
                                    <div class="flex items-start gap-3">
                                        <div class="text-3xl">💜</div>
                                        <div>
                                            <p class="font-bold mb-1">${language === 'es' ? '¡Síntoma registrado!' : 'Symptom recorded!'}</p>
                                            <p class="text-sm opacity-90">${newSymptoms.length >= 3 && !patternShown ? (language === 'es' ? '¡LUMI tiene algo que mostrarte! Revisa el aviso especial 💜' : 'LUMI has something to show you! Check the special notice 💜') : (language === 'es' ? 'Gracias. Esto me ayuda a acompañarte mejor. Tu menú te está esperando en 🥗 Nutrición' : 'Thank you. This helps me support you better. Your menu is waiting in 🥗 Nutrition')}</p>
                                        </div>
                                    </div>
                                `;
                                document.body.appendChild(notification);
                                setTimeout(() => notification.remove(), 5000);
                            }} style={{width:"100%", background:"linear-gradient(135deg, #C9935A, #e8c89f)", border:"none", borderRadius:"9999px", padding:"0.9rem", color:"white", fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(201,147,90,0.25)"}}>
                                {t[language].addRecord}
                            </button>
                        </div>

                        {symptoms.length > 0 && (
                            <>
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                    <h3 className="font-semibold text-lg mb-4">📈 {language === 'es' ? 'Tendencia de Sueño' : 'Sleep Trend'}</h3>
                                    <canvas ref={chartRefSleep} style={{maxHeight: '300px'}}></canvas>
                                </div>

                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                    <h3 className="font-semibold text-lg mb-4">📈 {language === 'es' ? 'Tendencia de Energía' : 'Energy Trend'}</h3>
                                    <canvas ref={chartRefEnergy} style={{maxHeight: '300px'}}></canvas>
                                </div>

                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                    <h3 className="font-semibold text-lg mb-4">📈 {language === 'es' ? 'Tendencia de Ánimo' : 'Mood Trend'}</h3>
                                    <canvas ref={chartRefMood} style={{maxHeight: '300px'}}></canvas>
                                </div>

                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                    <h3 className="font-semibold text-lg mb-4">📈 {language === 'es' ? 'Tendencia de Sofocos' : 'Hot Flashes Trend'}</h3>
                                    <canvas ref={chartRefHotFlashes} style={{maxHeight: '300px'}}></canvas>
                                </div>

                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-lg">📊 {language === 'es' ? 'Resumen General' : 'Overall Summary'}</h3>
                                        <button onClick={async () => {
                                            const { jsPDF } = window.jspdf;
                                            const doc = new jsPDF();

                                            doc.setFontSize(20);
                                            doc.text('Lumera - Reporte de Síntomas', 20, 20);

                                            doc.setFontSize(12);
                                            doc.text(`${language === 'es' ? 'Usuaria' : 'User'}: ${currentUser.profile_name}`, 20, 40);
                                            doc.text(`${language === 'es' ? 'Fecha' : 'Date'}: ${new Date().toLocaleDateString()}`, 20, 50);

                                            const avgSleep = (symptoms.reduce((a, s) => a + s.sleep, 0) / symptoms.length).toFixed(1);
                                            const avgEnergy = (symptoms.reduce((a, s) => a + s.energy, 0) / symptoms.length).toFixed(1);
                                            const avgMood = (symptoms.reduce((a, s) => a + s.mood, 0) / symptoms.length).toFixed(1);

                                            doc.setFontSize(14);
                                            doc.text(language === 'es' ? 'Promedios' : 'Averages', 20, 70);
                                            doc.setFontSize(11);
                                            doc.text(`${language === 'es' ? 'Sueño' : 'Sleep'}: ${avgSleep}/10`, 20, 85);
                                            doc.text(`${language === 'es' ? 'Energía' : 'Energy'}: ${avgEnergy}/10`, 20, 95);
                                            doc.text(`${language === 'es' ? 'Ánimo' : 'Mood'}: ${avgMood}/10`, 20, 105);

                                            doc.text(`${language === 'es' ? 'Total de registros' : 'Total records'}: ${symptoms.length}`, 20, 120);

                                            doc.save(`Lumera_Sintomas_${new Date().toISOString().split('T')[0]}.pdf`);
                                        }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                                            📥 {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg`}>
                                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{language === 'es' ? 'Promedio Sueño' : 'Avg Sleep'}</p>
                                            <p className="text-2xl font-bold text-blue-600">{(symptoms.reduce((a, s) => a + s.sleep, 0) / symptoms.length).toFixed(1)}/10</p>
                                        </div>
                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-rose-50'} p-4 rounded-lg`}>
                                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{language === 'es' ? 'Promedio Energía' : 'Avg Energy'}</p>
                                            <p className="text-2xl font-bold text-rose-500">{(symptoms.reduce((a, s) => a + s.energy, 0) / symptoms.length).toFixed(1)}/10</p>
                                        </div>
                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-cyan-50'} p-4 rounded-lg`}>
                                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{language === 'es' ? 'Promedio Ánimo' : 'Avg Mood'}</p>
                                            <p className="text-2xl font-bold text-cyan-600">{(symptoms.reduce((a, s) => a + s.mood, 0) / symptoms.length).toFixed(1)}/10</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            };

            // PERÍODO
            const renderPeriod = () => {
                return (
                    <div className="pb-32 space-y-5" key={`period-${language}`} style={{background:darkMode?'transparent':'linear-gradient(180deg,#fdf8f3,#fdf4ee)',minHeight:'100vh',padding:'1rem'}}>
                        <div style={{position:'relative',borderRadius:'1.25rem',overflow:'hidden',marginBottom:'0.5rem',height:'110px'}}>
                            <img src="/images/periodo.png" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.65)'}} alt="" />
                            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'1.25rem'}}>
                                <div>
                                    <p style={{color:'rgba(255,255,255,0.8)',fontSize:'0.7rem',letterSpacing:'0.15em'}}>✦ LUMERA</p>
                                    <h2 style={{fontFamily:"'Cormorant',serif",fontSize:'1.8rem',fontWeight:500,color:'white',lineHeight:1.2}}>{t[language].period}</h2>
                                </div>
                            </div>
                        </div>

                        <div style={{background:darkMode?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.92)',borderRadius:'1.1rem',padding:'1.25rem',border:'1px solid rgba(201,147,90,0.15)'}}>
                            <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.1rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524',marginBottom:'1rem'}}>{language === 'es' ? 'Registra tu período' : 'Record your period'}</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">{language === 'es' ? 'Intensidad (1-10)' : 'Intensity (1-10)'}</label>
                                    <input type="range" min="1" max="10" value={periodForm.intensity} onChange={(e) => setPeriodForm({...periodForm, intensity: parseInt(e.target.value)})} className="lumera-slider w-full" style={{'--val':periodForm.intensity}}/>
                                    <p style={{fontSize:'0.8rem',color:'#C9935A',fontWeight:600,marginTop:'0.25rem'}}>{periodForm.intensity}/10</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">{language === 'es' ? 'Duración (días)' : 'Duration (days)'}</label>
                                    <input type="range" min="1" max="10" value={periodForm.duration} onChange={(e) => setPeriodForm({...periodForm, duration: parseInt(e.target.value)})} className="lumera-slider w-full" style={{'--val':periodForm.duration}}/>
                                    <p style={{fontSize:'0.8rem',color:'#C9935A',fontWeight:600,marginTop:'0.25rem'}}>{periodForm.duration} {language === 'es' ? 'días' : 'days'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">{language === 'es' ? 'Síntomas' : 'Symptoms'}</label>
                                    <input type="text" placeholder={language === 'es' ? 'Ej: cólicos, hinchazón' : 'E.g: cramps, bloating'} value={periodForm.symptoms} onChange={(e) => setPeriodForm({...periodForm, symptoms: e.target.value})} style={{width:'100%',padding:'0.5rem 1rem',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.6rem',background:darkMode?'rgba(255,255,255,0.05)':'white',color:darkMode?'white':'#292524',outline:'none'}}/>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">{language === 'es' ? 'Fecha' : 'Date'}</label>
                                    <input type="date" value={periodForm.date} onChange={(e) => setPeriodForm({...periodForm, date: e.target.value})} style={{width:'100%',padding:'0.5rem 1rem',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.6rem',background:darkMode?'rgba(255,255,255,0.05)':'white',color:darkMode?'white':'#292524',outline:'none'}}/>
                                </div>
                            </div>

                            <button onClick={async () => {
                                // Calcular día del ciclo (días desde el inicio del último período)
                                const today = new Date();
                                const periodStart = new Date(periodForm.date);
                                const dayOfCycle = Math.max(1, Math.round((today - periodStart) / (1000*60*60*24)) + 1);

                                const newLog = [...periodLog, { ...periodForm, dayOfCycle }];
                                setPeriodLog(newLog);
                                setPeriodForm({ intensity: 5, duration: 5, symptoms: '', date: new Date().toISOString().split('T')[0] });

                                // Llamar Edge Function para generar guía personalizada
                                setPeriodGuidanceLoading(true);
                                setPeriodGuidance(null);
                                try {
                                    const res = await fetch('https://pyekwpmbdnmglrjieexc.supabase.co/functions/v1/period-guidance', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (await supabase.auth.getSession()).data.session?.access_token },
                                        body: JSON.stringify({
                                            intensity: periodForm.intensity,
                                            duration: periodForm.duration,
                                            dayOfCycle,
                                            symptoms: periodForm.symptoms,
                                            language,
                                            userName: currentUser?.profile_name || 'tú',
                                            healthConditions: parseHealthConditions(currentUser?.health_conditions)
                                        })
                                    });
                                    if (res.ok) {
                                        const guidance = await res.json();
                                        setPeriodGuidance(guidance);
                                    }
                                } catch(e) {
                                } finally {
                                    setPeriodGuidanceLoading(false);
                                }
                            }} style={{width:"100%", background:"linear-gradient(135deg, #C9935A, #e8c89f)", border:"none", borderRadius:"9999px", padding:"0.9rem", color:"white", fontSize:"1rem", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(201,147,90,0.25)"}}>
                                {language === 'es' ? 'Registrar y recibir guía de LUMI' : 'Record and get LUMI guidance'}
                            </button>
                        </div>

                        {/* LOADING LUMI */}
                        {periodGuidanceLoading && (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 text-center`}>
                                <div className="text-4xl mb-3">🌙</div>
                                <p className="font-light text-lg gradient-text" style={{fontFamily: 'Cormorant, serif'}}>
                                    {language === 'es' ? 'LUMI está preparando tu guía...' : 'LUMI is preparing your guidance...'}
                                </p>
                                <div className="mt-4 w-12 h-1 mx-auto rounded-full animate-pulse" style={{background:"linear-gradient(135deg,#B87333,#E8C878)"}}></div>
                            </div>
                        )}

                        {/* GUÍA DE LUMI */}
                        {periodGuidance && !periodGuidanceLoading && (
                            <div className="space-y-5">
                                {/* Mensaje LUMI */}
                                <div className="rounded-2xl p-6" style={{background: 'linear-gradient(135deg, #fdf4ff, #fff7ed)', borderLeft: '4px solid #f43f5e'}}>
                                    <div className="flex items-start gap-3">
                                        <span style={{fontSize:"1.5rem",color:"#C9935A"}}>✦</span>
                                        <p className={`leading-relaxed ${darkMode ? 'text-gray-200' : 'text-rose-900'} font-medium`}>
                                            {periodGuidance.lumiMessage}
                                        </p>
                                    </div>
                                </div>

                                {/* Tips del día */}
                                {periodGuidance.tips && periodGuidance.tips.length > 0 && (
                                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                        <h3 className="font-semibold text-lg mb-4">
                                            🌿 {language === 'es' ? 'Lo que te ayuda hoy' : 'What helps you today'}
                                        </h3>
                                        <div className="space-y-4">
                                            {periodGuidance.tips.map((tip, i) => (
                                                <div key={i} className={`flex gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-rose-50'}`}>
                                                    <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                                                    <div>
                                                        <p className="font-semibold text-sm mb-1" style={{color: '#C9935A'}}>{tip.title}</p>
                                                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tip.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Qué evitar */}
                                {periodGuidance.avoid && periodGuidance.avoid.length > 0 && (
                                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                        <h3 className="font-semibold text-lg mb-4">
                                            🚫 {language === 'es' ? 'Mejor evitar hoy' : 'Better to avoid today'}
                                        </h3>
                                        <div className="space-y-3">
                                            {periodGuidance.avoid.map((item, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <span className="text-lg flex-shrink-0">{item.emoji}</span>
                                                    <div>
                                                        <span className="font-semibold text-sm" style={{color: '#78716c'}}>{item.item}</span>
                                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}> — {item.reason}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Menú del día */}
                                {periodGuidance.menu && (
                                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                        <h3 className="font-semibold text-lg mb-5">
                                            🍽️ {language === 'es' ? 'Menú especial para hoy' : 'Special menu for today'}
                                        </h3>
                                        <div className="space-y-4">
                                            {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => {
                                                const item = periodGuidance.menu[meal];
                                                if (!item) return null;
                                                const mealLabel = {
                                                    breakfast: language === 'es' ? '🌅 Desayuno' : '🌅 Breakfast',
                                                    lunch: language === 'es' ? '☀️ Almuerzo' : '☀️ Lunch',
                                                    dinner: language === 'es' ? '🌙 Cena' : '🌙 Dinner',
                                                    snack: language === 'es' ? '🍎 Snack' : '🍎 Snack',
                                                }[meal];
                                                return (
                                                    <div key={meal} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-rose-50 to-amber-50 border-rose-100'}`}>
                                                        <p className="text-xs font-semibold mb-1" style={{color: '#a8a29e', letterSpacing: '0.08em', textTransform: 'uppercase'}}>{mealLabel}</p>
                                                        <p className="font-semibold text-base mb-1" style={{fontFamily: 'Cormorant, serif', fontSize: '1.1rem'}}>{item.name}</p>
                                                        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>
                                                        {item.ingredients && (
                                                            <p className="text-xs" style={{color: '#a8a29e'}}>{item.ingredients.join(' · ')}</p>
                                                        )}
                                                        {item.why && (
                                                            <p className="text-xs mt-2 italic" style={{color: '#C9935A'}}>{item.why}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Base científica */}
                                {periodGuidance.science && (
                                    <p className={`text-xs text-center italic px-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                                        🔬 {periodGuidance.science}
                                    </p>
                                )}
                            </div>
                        )}

                        {periodLog.length > 0 && (
                            <>
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-lg">📈 {language === 'es' ? 'Tendencia de Período' : 'Period Trend'}</h3>
                                        <button onClick={() => {
                                            const { jsPDF } = window.jspdf;
                                            const doc = new jsPDF();

                                            doc.setFontSize(20);
                                            doc.text('Lumera - Reporte de Período', 20, 20);

                                            doc.setFontSize(12);
                                            doc.text(`${language === 'es' ? 'Usuaria' : 'User'}: ${currentUser.profile_name}`, 20, 40);
                                            doc.text(`${language === 'es' ? 'Fecha' : 'Date'}: ${new Date().toLocaleDateString()}`, 20, 50);

                                            doc.setFontSize(14);
                                            doc.text(language === 'es' ? 'Resumen de Registros' : 'Records Summary', 20, 70);
                                            doc.setFontSize(11);

                                            const avgIntensity = (periodLog.reduce((a, p) => a + p.intensity, 0) / periodLog.length).toFixed(1);
                                            const avgDuration = (periodLog.reduce((a, p) => a + p.duration, 0) / periodLog.length).toFixed(1);

                                            doc.text(`${language === 'es' ? 'Intensidad promedio' : 'Avg intensity'}: ${avgIntensity}/10`, 20, 85);
                                            doc.text(`${language === 'es' ? 'Duración promedio' : 'Avg duration'}: ${avgDuration} días`, 20, 95);
                                            doc.text(`${language === 'es' ? 'Total de ciclos registrados' : 'Total cycles recorded'}: ${periodLog.length}`, 20, 105);

                                            doc.save(`Lumera_Periodo_${new Date().toISOString().split('T')[0]}.pdf`);
                                        }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                                            📥 {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
                                        </button>
                                    </div>
                                    <canvas ref={chartRefPeriod} style={{maxHeight: '300px'}}></canvas>
                                </div>

                                {/* ANÁLISIS DE TENDENCIA - aparece con 3+ registros */}
                                {periodLog.length >= 3 && (
                                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                        <h3 className="font-semibold text-lg mb-4">🌸 {language === 'es' ? 'Tendencia de tu ciclo' : 'Your cycle trend'}</h3>
                                        {(() => {
                                            const intensities = periodLog.map(p => p.intensity);
                                            const durations = periodLog.map(p => p.duration);
                                            const avgIntensity = (intensities.reduce((a, b) => a + b, 0) / intensities.length).toFixed(1);
                                            const avgDuration = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1);
                                            const lastIntensity = intensities[intensities.length - 1];
                                            const prevIntensity = intensities[intensities.length - 2];
                                            const intensityTrend = lastIntensity > prevIntensity ? 'up' : lastIntensity < prevIntensity ? 'down' : 'stable';

                                            // Calcular intervalos entre períodos
                                            const intervals = [];
                                            for (let i = 1; i < periodLog.length; i++) {
                                                const d1 = new Date(periodLog[i - 1].date);
                                                const d2 = new Date(periodLog[i].date);
                                                intervals.push(Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
                                            }
                                            const avgInterval = intervals.length > 0 ? (intervals.reduce((a, b) => a + b, 0) / intervals.length).toFixed(0) : null;
                                            const irregular = intervals.length >= 2 && (Math.max(...intervals) - Math.min(...intervals)) > 14;

                                            return (
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-rose-50'} p-4 rounded-lg text-center`}>
                                                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{language === 'es' ? 'Intensidad avg' : 'Avg intensity'}</p>
                                                            <p className="text-2xl font-bold text-rose-500">{avgIntensity}<span className="text-sm font-normal">/10</span></p>
                                                            {intensityTrend !== 'stable' && (
                                                                <p className={`text-xs mt-1 ${intensityTrend === 'up' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                                    {intensityTrend === 'up' ? '↑' : '↓'} {language === 'es' ? 'vs anterior' : 'vs previous'}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-amber-50'} p-4 rounded-lg text-center`}>
                                                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{language === 'es' ? 'Duración avg' : 'Avg duration'}</p>
                                                            <p className="text-2xl font-bold text-amber-700">{avgDuration}<span className="text-sm font-normal"> {language === 'es' ? 'días' : 'days'}</span></p>
                                                        </div>
                                                    </div>

                                                    {avgInterval && (
                                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-amber-50'} p-4 rounded-lg`}>
                                                            <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                                                <span className="font-semibold">⏱️ {language === 'es' ? 'Intervalo promedio' : 'Avg interval'}:</span> {avgInterval} {language === 'es' ? 'días entre períodos' : 'days between periods'}
                                                                {irregular && (
                                                                    <span className={`block text-xs mt-1 ${darkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                                                                        {language === 'es' 
                                                                            ? '⚡ Tu ciclo muestra irregularidad. Es muy común en esta etapa. LUMI puede ayudarte a manejar los días de incertidumbre.' 
                                                                            : '⚡ Your cycle shows irregularity. It\'s very common at this stage. LUMI can help you navigate the uncertain days.'}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                                    <h3 className="font-semibold text-lg mb-4">{language === 'es' ? 'Tu Historial' : 'Your History'}</h3>
                                    <div className="space-y-3">
                                        {periodLog.map((p, idx) => (
                                            <div key={idx} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{p.date}</p>
                                                <p className="text-sm"><span className="font-semibold">{language === 'es' ? 'Intensidad' : 'Intensity'}:</span> {p.intensity}/10 | <span className="font-semibold">{language === 'es' ? 'Duración' : 'Duration'}:</span> {p.duration} días</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            };

            // MITOS
            const renderMyths = () => {
                const { myths } = getMythsAndTips();

                return (
                    <div className="pb-32 space-y-5" key={`myths-${language}`} style={{background:darkMode?'transparent':'linear-gradient(180deg,#fdf8f3,#fdf4ee)',minHeight:'100vh',padding:'1rem'}}>
                        <div style={{position:'relative',borderRadius:'1.25rem',overflow:'hidden',marginBottom:'0.5rem',height:'120px'}}>
                            <img src="/images/mitos.png" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.7)'}} alt="" />
                            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'1.25rem'}}>
                                <div>
                                    <p style={{color:'rgba(255,255,255,0.8)',fontSize:'0.7rem',letterSpacing:'0.15em'}}>✦ LUMERA</p>
                                    <h2 style={{fontFamily:"'Cormorant',serif",fontSize:'1.8rem',fontWeight:500,color:'white',lineHeight:1.2}}>{t[language].myths}</h2>
                                </div>
                            </div>
                        </div>
                        {myths && Array.isArray(myths) && myths.length > 0 ? myths.map((myth, idx) => (
                            <div key={idx} style={{background:darkMode?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.9)',borderRadius:'1.1rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.15)',boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
                                <div style={{padding:'1rem 1.25rem',borderBottom:'1px solid rgba(201,147,90,0.1)',background:darkMode?'rgba(201,147,90,0.08)':'rgba(201,147,90,0.05)'}}>
                                    <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.15rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524',lineHeight:1.3}}>
                                        <span style={{color:'#C9935A',marginRight:'0.4rem'}}>✦</span>{myth.myth}
                                    </h3>
                                </div>
                                <div style={{padding:'1rem 1.25rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                                    <div style={{borderLeft:'3px solid #C9935A',paddingLeft:'0.75rem'}}>
                                        <p style={{fontSize:'0.8rem',fontWeight:600,color:'#C9935A',marginBottom:'0.2rem'}}>{language==='es'?'La realidad':'The truth'}</p>
                                        <p style={{fontSize:'0.85rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.5}}>{myth.truth}</p>
                                    </div>
                                    <div style={{borderLeft:'3px solid rgba(201,147,90,0.4)',paddingLeft:'0.75rem'}}>
                                        <p style={{fontSize:'0.8rem',fontWeight:600,color:'#92580a',marginBottom:'0.2rem'}}>{language==='es'?'Base cientifica':'Science'}</p>
                                        <p style={{fontSize:'0.82rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.5,marginBottom:'0.4rem'}}>{myth.science}</p>
                                        {myth.source && <a href={myth.source} target="_blank" rel="noopener noreferrer" style={{fontSize:'0.75rem',color:'#C9935A',textDecoration:'underline'}}>{language==='es'?'Ver estudio':'View study'} →</a>}
                                    </div>
                                    <div style={{borderLeft:'3px solid rgba(201,147,90,0.4)',paddingLeft:'0.75rem'}}>
                                        <p style={{fontSize:'0.8rem',fontWeight:600,color:'#92580a',marginBottom:'0.2rem'}}>{language==='es'?'Que hacer':'What to do'}</p>
                                        <p style={{fontSize:'0.82rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.5}}>{myth.action}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div style={{background:'rgba(255,255,255,0.9)',borderRadius:'1.1rem',padding:'1.5rem',textAlign:'center'}}>
                                <p style={{color:'#78716c'}}>{language==='es'?'Cargando...':'Loading...'}</p>
                            </div>
                        )}
                    </div>
                );
            };


            // CONSEJOS
            const renderTips = () => {
                const { tips } = getMythsAndTips();
                return (
                    <div className="pb-32 space-y-5" key={`tips-${language}`} style={{background:darkMode?'transparent':'linear-gradient(180deg,#fdf8f3,#fdf4ee)',minHeight:'100vh',padding:'1rem'}}>
                        <div style={{position:'relative',borderRadius:'1.25rem',overflow:'hidden',marginBottom:'0.5rem',height:'120px'}}>
                            <img src="/images/consejos.png" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.65)'}} alt="" />
                            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'1.25rem'}}>
                                <div>
                                    <p style={{color:'rgba(255,255,255,0.8)',fontSize:'0.7rem',letterSpacing:'0.15em'}}>✦ LUMERA</p>
                                    <h2 style={{fontFamily:"'Cormorant',serif",fontSize:'1.8rem',fontWeight:500,color:'white',lineHeight:1.2}}>{t[language].tips}</h2>
                                </div>
                            </div>
                        </div>

                        {/* ── GLP-1 NATURAL ── */}
                        <div style={{background:darkMode?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.95)',borderRadius:'1.1rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.2)',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
                            <div style={{padding:'1rem 1.25rem',borderBottom:'1px solid rgba(201,147,90,0.1)',background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(232,200,159,0.08))'}}>
                                <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.2rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524'}}>
                                    <span style={{color:'#C9935A',marginRight:'0.4rem'}}>✦</span>{language==='es'?'GLP-1 Natural: por qué engordas aunque comas igual':'GLP-1 Natural: why you gain weight even eating the same'}
                                </h3>
                            </div>
                            <div style={{padding:'1rem 1.25rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                                <div style={{borderLeft:'3px solid #C9935A',paddingLeft:'0.75rem'}}>
                                    <p style={{fontSize:'0.8rem',fontWeight:600,color:'#C9935A',marginBottom:'0.2rem'}}>{language==='es'?'Qué es el GLP-1':'What is GLP-1'}</p>
                                    <p style={{fontSize:'0.85rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.5}}>{language==='es'?'El GLP-1 es una hormona que produce tu propio cuerpo después de comer. Regula el apetito, reduce los antojos y controla el azúcar en sangre. En esta etapa, los cambios hormonales reducen su producción — y eso explica por qué sientes más hambre y acumulas más grasa abdominal aunque no hayas cambiado tus hábitos.':'GLP-1 is a hormone your own body produces after eating. It regulates appetite, reduces cravings and controls blood sugar. At this stage, hormonal changes reduce its production — which explains why you feel hungrier and accumulate more belly fat even without changing your habits.'}</p>
                                </div>
                                <div style={{borderLeft:'3px solid rgba(201,147,90,0.4)',paddingLeft:'0.75rem'}}>
                                    <p style={{fontSize:'0.8rem',fontWeight:600,color:'#92580a',marginBottom:'0.2rem'}}>{language==='es'?'Cómo estimularlo de forma natural':'How to stimulate it naturally'}</p>
                                    <p style={{fontSize:'0.85rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.5}}>{language==='es'?'Ciertos alimentos activan la producción de GLP-1 de forma natural — sin pastillas ni inyecciones. Son ingredientes comunes que ya tienes en tu despensa o puedes encontrar en cualquier supermercado.':'Certain foods naturally activate GLP-1 production — no pills or injections needed. They are common ingredients you already have in your pantry or can find in any supermarket.'}</p>
                                </div>
                                <div style={{background:'rgba(201,147,90,0.06)',borderRadius:'0.75rem',padding:'0.75rem 1rem',border:'1px solid rgba(201,147,90,0.15)'}}>
                                    <p style={{fontSize:'0.78rem',fontWeight:700,color:'#C9935A',marginBottom:'0.5rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>✦ {language==='es'?'Alimentos que ↑ GLP-1':'Foods that ↑ GLP-1'}</p>
                                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.4rem'}}>
                                        {[
                                            {es:'Huevos',en:'Eggs',motivo_es:'Proteína completa',motivo_en:'Complete protein'},
                                            {es:'Aguacate / palta',en:'Avocado',motivo_es:'Grasa saludable',motivo_en:'Healthy fat'},
                                            {es:'Avena',en:'Oats',motivo_es:'Fibra soluble',motivo_en:'Soluble fibre'},
                                            {es:'Yogur griego',en:'Greek yogurt',motivo_es:'Proteína + probióticos',motivo_en:'Protein + probiotics'},
                                            {es:'Legumbres',en:'Legumes',motivo_es:'Fibra + proteína vegetal',motivo_en:'Fibre + plant protein'},
                                            {es:'Nueces',en:'Walnuts',motivo_es:'Omega-3 vegetal',motivo_en:'Plant omega-3'},
                                            {es:'Salmón / sardinas',en:'Salmon / sardines',motivo_es:'Omega-3 EPA/DHA',motivo_en:'Omega-3 EPA/DHA'},
                                            {es:'Brócoli y verduras',en:'Broccoli & veggies',motivo_es:'Fibra + antioxidantes',motivo_en:'Fibre + antioxidants'},
                                        ].map((item,i) => (
                                            <div key={i} style={{background:'rgba(255,255,255,0.7)',borderRadius:'0.5rem',padding:'0.4rem 0.6rem',border:'1px solid rgba(201,147,90,0.12)'}}>
                                                <p style={{fontSize:'0.78rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524'}}>{language==='es'?item.es:item.en}</p>
                                                <p style={{fontSize:'0.68rem',color:'#C9935A'}}>{language==='es'?item.motivo_es:item.motivo_en}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{borderLeft:'3px solid rgba(155,142,196,0.5)',paddingLeft:'0.75rem'}}>
                                    <p style={{fontSize:'0.72rem',color:darkMode?'#a8a29e':'#78716c',fontStyle:'italic'}}>🔬 {language==='es'?'Estudios publicados en Cell Metabolism confirman que la dieta rica en proteína y fibra aumenta la secreción endógena de GLP-1 en mujeres postmenopáusicas.':'Studies published in Cell Metabolism confirm that a diet rich in protein and fibre increases endogenous GLP-1 secretion in postmenopausal women.'}</p>
                                </div>
                            </div>
                        </div>

                        {(tips || []).map((tip, idx) => (
                            <div key={idx} style={{background:darkMode?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.9)',borderRadius:'1.1rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.15)',boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
                                <div style={{padding:'1rem 1.25rem',borderBottom:'1px solid rgba(201,147,90,0.1)',background:'linear-gradient(135deg,rgba(201,147,90,0.08),rgba(232,200,159,0.06))'}}>
                                    <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.2rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524'}}>
                                        <span style={{color:'#C9935A',marginRight:'0.4rem'}}>✦</span>{tip.title}
                                    </h3>
                                </div>
                                <div style={{padding:'1rem 1.25rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                                    <div style={{borderLeft:'3px solid #C9935A',paddingLeft:'0.75rem'}}>
                                        <p style={{fontSize:'0.8rem',fontWeight:600,color:'#C9935A',marginBottom:'0.2rem'}}>{language==='es'?'Por que importa':'Why it matters'}</p>
                                        <p style={{fontSize:'0.85rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.5}}>{tip.why}</p>
                                    </div>
                                    <div style={{borderLeft:'3px solid rgba(201,147,90,0.4)',paddingLeft:'0.75rem'}}>
                                        <p style={{fontSize:'0.8rem',fontWeight:600,color:'#92580a',marginBottom:'0.2rem'}}>{language==='es'?'Como hacerlo':'How to do it'}</p>
                                        <p style={{fontSize:'0.85rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.5,whiteSpace:'pre-line'}}>{tip.how}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!tips || tips.length === 0) && (
                            <div style={{background:'rgba(255,255,255,0.9)',borderRadius:'1.1rem',padding:'1.5rem',textAlign:'center'}}>
                                <p style={{color:'#78716c'}}>{language==='es'?'Cargando consejos...':'Loading tips...'}</p>
                            </div>
                        )}
                    </div>
                );
            };

            // COMUNIDAD
            const renderCommunity = () => {
                // Publicar mensaje
                const handlePostMessage = async () => {
                    if (!communityMessage.trim()) return;

                    try {
                        const { data, error } = await supabase
                            .from('community_posts')
                            .insert([{
                                user_id: currentUser.id,
                                user_name: currentUser.profile_name || 'Anónima',
                                message: communityMessage.trim(),
                                language: language,
                                is_approved: true  // Auto-aprobar por ahora
                            }])
                            .select();

                        if (error) {
                            alert(language === 'es' ? 'Error al publicar mensaje' : 'Error posting message');
                        } else {
                            // Agregar el nuevo post a la lista
                            setCommunityPosts([data[0], ...communityPosts]);
                            setCommunityMessage('');

                            // Notificación de éxito
                            const notification = document.createElement('div');
                            notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md'; notification.style.background='linear-gradient(135deg,#0D0D0D,#1a1008)'; notification.style.border='1px solid rgba(184,115,51,0.4)';
                            notification.innerHTML = `
                                <div class="flex items-start gap-3">
                                    <div class="text-3xl">💜</div>
                                    <div>
                                        <p class="font-bold mb-1">${language === 'es' ? '¡Mensaje compartido!' : 'Message shared!'}</p>
                                        <p class="text-sm opacity-90">${language === 'es' ? 'Gracias por compartir tu historia con la comunidad' : 'Thank you for sharing your story with the community'}</p>
                                    </div>
                                </div>
                            `;
                            document.body.appendChild(notification);
                            setTimeout(() => notification.remove(), 4000);
                        }
                    } catch (err) {
                        alert(language === 'es' ? 'Error al publicar' : 'Error posting');
                    }
                };

                return (
                    <div className="pb-32 space-y-8" key={`community-${language}`}>
                        <h2 className="text-3xl font-light gradient-text">{t[language].community}</h2>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                            <h3 className="font-semibold text-lg mb-4">{language === 'es' ? '💜 Comparte tu Historia' : '💜 Share Your Story'}</h3>
                            <textarea 
                                value={communityMessage} 
                                onChange={(e) => setCommunityMessage(e.target.value)} 
                                placeholder={language === 'es' ? 'Cuéntanos cómo te sientes, qué ha mejorado, o qué te ayuda día a día...' : 'Tell us how you feel, what has improved, or what helps you daily...'} 
                                className={`w-full px-4 py-3 border rounded-lg mb-4 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} 
                                rows="4"
                                maxLength="500"
                            />
                            <div className="flex justify-between items-center mb-4">
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {communityMessage.length}/500
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {language === 'es' ? '✨ Tu mensaje será visible para toda la comunidad' : '✨ Your message will be visible to the entire community'}
                                </p>
                            </div>
                            <button 
                                onClick={handlePostMessage}
                                disabled={!communityMessage.trim()}
                                className="w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" style={{background:"linear-gradient(135deg,#B87333,#E8C878)",color:"#0D0D0D"}}
                            >
                                {language === 'es' ? 'Compartir Mensaje' : 'Share Message'}
                            </button>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                            <h3 className="font-semibold text-lg mb-6">{language === 'es' ? 'Historias de Nuestra Comunidad' : 'Community Stories'}</h3>

                            {loadingPosts ? (
                                <div className="text-center py-8">
                                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {language === 'es' ? 'Cargando historias...' : 'Loading stories...'}
                                    </p>
                                </div>
                            ) : communityPosts.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {language === 'es' ? 'Sé la primera en compartir tu historia 💜' : 'Be the first to share your story 💜'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {communityPosts.map((post) => (
                                        <div key={post.id} className={`${darkMode ? 'bg-gray-700' : 'bg-amber-50'} rounded-xl p-6 border-l-4 border-rose-400`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-semibold">👩 {post.user_name}</h4>
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    📅 {new Date(post.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </p>
                                            </div>
                                            <p className={`italic ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                                                "{post.message}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            };

            // RENDERIZAR CONTENIDO
            const renderContent = () => {
                if (!currentUser) return null;

                // Páginas premium que requieren suscripción
                const premiumPages = ['workshops', 'community']; // nutrition y exercise tienen freemium interno

                if (premiumPages.includes(currentPage) && !isPremium()) {
                    return (
                        <div className="text-center py-20">
                            <div className="mb-6">
                                <div className="inline-block p-8 bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-full mb-6">
                                    <svg className="w-24 h-24 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-4 gradient-text">{language === 'es' ? 'Contenido Premium' : 'Premium Content'}</h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                                {language === 'es' ? 'Desbloquea todas las funcionalidades de Lumera' : 'Unlock all Lumera features'}
                            </p>
                            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 mb-6">
                                <div className="mb-6">
                                    <div className="text-5xl font-bold gradient-text mb-2">{PRICES[getRegion()].price}</div>
                                    <div className="text-sm text-gray-600">{language === 'es' ? 'por mes' : 'per month'}</div>
                                </div>
                                <ul className="text-left space-y-3 mb-8">
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{language === 'es' ? 'Menús personalizados semanales' : 'Personalized weekly menus'}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{language === 'es' ? 'Rutinas de ejercicio adaptadas' : 'Adapted exercise routines'}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{language === 'es' ? 'Seguimiento de síntomas y análisis' : 'Symptom tracking and analysis'}</span>
                                    </li>
                                </ul>
                                <button onClick={() => setShowPlanModal(true)} className="w-full text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg" style={{background:"linear-gradient(135deg,#B87333,#E8C878)",color:"#0D0D0D"}}>
                                    {language === 'es' ? 'Suscribirme' : 'Subscribe'}
                                </button>
                            </div>
                        </div>
                    );
                }

                switch(currentPage) {
                    case 'home': return renderHome();
                    case 'nutrition': return renderNutrition();
                    case 'exercise': return renderExercise();
                    case 'symptoms': return renderSymptoms();
                    case 'period': return renderPeriod();
                    case 'myths': return renderMyths();
                    case 'tips': return renderTips();
                    case 'workshops': return renderWorkshops();
                    case 'community': return renderCommunity();
                    default: return renderHome();
                }
            };

            // Mostrar loading hasta que tengamos el estado definitivo de auth
            // Esto evita el parpadeo/superposición en escritorio
            if (loading) return (
                <div className="min-h-screen flex items-center justify-center" style={{background: '#fafaf9'}}>
                    <div className="text-center">
                        <svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                            <defs>
                                <linearGradient id="flameGradLoad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style={{stopColor:'#d4af7f',stopOpacity:1}} />
                                    <stop offset="100%" style={{stopColor:'#e8c89f',stopOpacity:1}} />
                                </linearGradient>
                            </defs>
                            <path d="M 32 12 A 20 20 0 0 0 32 52 A 16 16 0 0 1 32 16 Z" fill="#b8a8d8"/>
                            <path d="M 40 32 Q 40 26 42 22 Q 42 28 40 35 Q 38 28 38 22 Q 40 26 40 32" fill="url(#flameGradLoad)"/>
                        </svg>
                        <h1 className="text-3xl font-light gradient-text" style={{fontFamily: 'Cormorant, serif'}}>Lumera</h1>
                        <div className="mt-4 w-8 h-1 mx-auto rounded-full animate-pulse" style={{background:"linear-gradient(135deg,#B87333,#E8C878)"}}></div>
                    </div>
                </div>
            );

            
            // LANDING PAGE CON HERO ELEGANTE
            {/* ── ORACLE POPUP ── */}
            {showOraclePopup && currentUser && (() => {
                const todayS = symptoms && symptoms.length > 0 ? symptoms[0] : null;
                const mode = todayS
                    ? (todayS.energy <= 3 || todayS.sleep <= 3) ? 'cueva'
                    : (todayS.anxiety >= 4) ? 'tormenta'
                    : (todayS.energy >= 7 && todayS.mood >= 7) ? 'diosa'
                    : 'ritual'
                    : 'ritual';
                const modeData = {
                    cueva: {img:'/images/modo_cueva.png',label_es:'Modo Cueva',label_en:'Cave Mode',color:'#5c3d22',msg_es:`Tu cuerpo pide reposo hoy, ${currentUser.profile_name||'amiga'}. La cueva es sagrada — no es debilidad, es sabiduría.`,msg_en:`Your body asks for rest today, ${currentUser.profile_name||'friend'}. The cave is sacred — not weakness, but wisdom.`},
                    tormenta: {img:'/images/modo_tormenta.png',label_es:'Modo Tormenta',label_en:'Storm Mode',color:'#2d4a7a',msg_es:`No estás loca, ${currentUser.profile_name||'amiga'}. Lo que sientes tiene nombre y tiene solución. Hoy vamos despacio.`,msg_en:`You are not crazy, ${currentUser.profile_name||'friend'}. What you feel has a name and a solution. We go slow today.`},
                    diosa: {img:'/images/modo_diosa.png',label_es:'Modo Diosa',label_en:'Goddess Mode',color:'#7a4f1a',msg_es:`Tu energía está en su pico, ${currentUser.profile_name||'amiga'}. Aprovecha esta ventana — tu cuerpo está brillando.`,msg_en:`Your energy is at its peak, ${currentUser.profile_name||'friend'}. Use this window — your body is shining.`},
                    ritual: {img:'/images/modo_ritual.png',label_es:'Modo Ritual',label_en:'Ritual Mode',color:'#3d6645',msg_es:`Un día tranquilo también es un regalo, ${currentUser.profile_name||'amiga'}. Tu cuerpo está hablando en voz baja.`,msg_en:`A calm day is also a gift, ${currentUser.profile_name||'friend'}. Your body is speaking softly.`},
                };
                const cfg = modeData[mode];
                return (
                    <div style={{position:'fixed',inset:0,zIndex:9998,background:'rgba(10,6,2,0.88)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}} onClick={()=>setShowOraclePopup(false)}>
                        <div onClick={e=>e.stopPropagation()} style={{
                            maxWidth:'360px',width:'100%',borderRadius:'1.5rem',overflow:'hidden',
                            background:'rgba(15,10,5,0.95)',border:'1px solid rgba(184,115,51,0.35)',
                            boxShadow:'0 0 60px rgba(184,115,51,0.15)',
                        }}>
                            {/* Imagen modo a pantalla completa */}
                            <div style={{position:'relative',height:'200px',overflow:'hidden'}}>
                                <img src={cfg.img} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.7)'}}/>
                                <div style={{position:'absolute',inset:0,background:`linear-gradient(to bottom, transparent 30%, rgba(15,10,5,0.95) 100%)`}}/>
                                <div style={{position:'absolute',bottom:'1rem',left:'1.25rem'}}>
                                    <p style={{fontSize:'0.6rem',color:'rgba(184,115,51,0.7)',letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:'4px'}}>✦ {language==='es'?cfg.label_es:cfg.label_en}</p>
                                    <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.5rem',fontWeight:400,color:'#F5E6D3',margin:0}}>{language==='es'?'Tu carta de hoy':'Your card today'}</p>
                                </div>
                            </div>
                            {/* Mensaje */}
                            <div style={{padding:'1.25rem 1.5rem'}}>
                                <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.05rem',fontStyle:'italic',color:'rgba(245,230,211,0.9)',lineHeight:1.7,marginBottom:'1.25rem'}}>
                                    {language==='es'?cfg.msg_es:cfg.msg_en}
                                </p>
                                <div style={{display:'flex',gap:'0.75rem'}}>
                                    <button onClick={()=>{setShowOraclePopup(false);setCurrentPage('nutrition');}} style={{flex:1,background:'rgba(184,115,51,0.12)',border:'1px solid rgba(184,115,51,0.3)',borderRadius:'0.75rem',padding:'0.6rem',fontSize:'0.78rem',color:'#C9935A',cursor:'pointer',fontFamily:"'Cormorant',serif"}}>
                                        {language==='es'?'Ver nutrición':'See nutrition'}
                                    </button>
                                    <button onClick={()=>setShowOraclePopup(false)} style={{flex:1,background:'linear-gradient(135deg,#B87333,#E8C878)',border:'none',borderRadius:'0.75rem',padding:'0.6rem',fontSize:'0.78rem',color:'#0A0A0A',cursor:'pointer',fontWeight:600,fontFamily:"'Cormorant',serif"}}>
                                        {language==='es'?'Entendido':'Got it'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            if (showShulaDay3) return (
                <div style={{position:'fixed',inset:0,zIndex:9999,background:'#0A0608',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    {/* Video de fondo — seda negra */}
                    <video autoPlay loop muted playsInline src="/videos/premium_bg.mp4"
                        style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.3,pointerEvents:'none'}}/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(10,4,2,0.7) 0%,rgba(10,4,2,0.4) 50%,rgba(10,4,2,0.8) 100%)'}}/>

                    <style>{`@keyframes shulaFade{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}.shula-in{animation:shulaFade 1.5s ease forwards}`}</style>

                    <div className="shula-in" style={{position:'relative',zIndex:1,maxWidth:'400px',width:'100%',padding:'2rem',textAlign:'center'}}>
                        {/* Ornamento top */}
                        <div style={{width:'60px',height:'1px',background:'linear-gradient(90deg,transparent,#B87333,transparent)',margin:'0 auto 2rem'}}/>

                        {/* Video de Shula en círculo */}
                        <div style={{width:'220px',height:'220px',borderRadius:'50%',overflow:'hidden',margin:'0 auto 2rem',border:'2px solid rgba(184,115,51,0.5)',boxShadow:'0 0 40px rgba(184,115,51,0.2)',position:'relative'}}>
                            <video autoPlay loop muted playsInline src="/videos/shula_day3.mp4"
                                style={{width:'140%',height:'140%',objectFit:'cover',position:'absolute',top:'-20%',left:'-20%'}}/>
                        </div>

                        {/* Mensaje */}
                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'0.68rem',color:'rgba(184,115,51,0.7)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'1.5rem'}}>
                            SHULA RÍOS · LUMERA
                        </p>
                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.35rem',fontWeight:400,color:'#F5E6D3',lineHeight:1.8,marginBottom:'2rem',fontStyle:'italic'}}>
                            {language==='es'
                                ?'"Algo ha cambiado en ti, lo noto. En estos días, tu cuerpo ha dejado de ser un misterio para empezar a ser tu mapa. Hoy nuestra prueba termina, pero este santuario es tuyo para siempre. No vuelvas al ruido exterior. Quédate aquí, conmigo... El viaje real comienza ahora."'
                                :'"Something has changed in you, I can feel it. Over these days, your body has stopped being a mystery and started becoming your map. Today our trial ends, but this sanctuary is yours forever. Do not go back to the noise. Stay here, with me... The real journey begins now."'}
                        </p>

                        {/* Botón CTA */}
                        <button
                            onClick={()=>{setShowShulaDay3(false);setCurrentPage('upgrade');}}
                            style={{
                                background:'linear-gradient(135deg,#B87333,#E8C878)',
                                border:'none',borderRadius:'9999px',
                                padding:'1rem 2.5rem',
                                color:'#0A0A0A',
                                fontFamily:"'Cormorant',serif",
                                fontSize:'1.1rem',fontWeight:600,
                                cursor:'pointer',letterSpacing:'0.06em',
                                boxShadow:'0 0 30px rgba(184,115,51,0.4)',
                                marginBottom:'1rem',display:'block',width:'100%',
                            }}>
                            {language==='es'?'Mantener mi Santuario':'Keep my Sanctuary'}
                        </button>
                        <button
                            onClick={()=>setShowShulaDay3(false)}
                            style={{background:'none',border:'none',color:'rgba(184,115,51,0.4)',fontSize:'0.78rem',cursor:'pointer',letterSpacing:'0.08em'}}>
                            {language==='es'?'Explorar un momento más':'Explore a little longer'}
                        </button>

                        <div style={{width:'60px',height:'1px',background:'linear-gradient(90deg,transparent,#B87333,transparent)',margin:'2rem auto 0'}}/>
                    </div>
                </div>
            );

            if (showWelcomeTrial) return (
                <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem',background:'rgba(10,8,5,0.95)'}}>
                                    <video autoPlay loop muted playsInline src="/videos/welcome_bg.mp4" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.35,pointerEvents:'none'}}/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(10,8,5,0.6) 0%,rgba(10,8,5,0.5) 50%,rgba(10,8,5,0.7) 100%)'}}/>
                    <img src="/images/acuarela.jpg" style={{display:'none'}} onError={e=>{e.target.style.display='none'}}/>
                    <style>{`@keyframes wfadein{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.wact{animation:wfadein 1.2s ease forwards}`}</style>
                    <div style={{position:'relative',zIndex:1,maxWidth:'380px',width:'100%',textAlign:'center'}}>
                        {welcomeAct===1&&(<div className="wact">
                            <p style={{fontFamily:"'Cormorant',serif",fontSize:'0.68rem',color:'rgba(184,115,51,0.7)',letterSpacing:'0.22em',textTransform:'uppercase',marginBottom:'2.5rem'}}>LUMERA</p>
                            <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.45rem',fontWeight:400,color:'#F5E6D3',lineHeight:1.75,marginBottom:'3rem'}}>
                                {language==='es'
                                    ?'"Sé que eres una mujer ocupada. Sé que tienes preguntas sin respuesta y que, a veces, te sientes sola en tu propio cuerpo. Quieres cuidarte, pero no encuentras el cómo ni el cuándo."'
                                    :'"I know you are busy. I know you have questions that go unanswered, and that sometimes, you feel like a stranger in your own body. You want to prioritize yourself, but the how and when feel out of reach."'}
                            </p>
                            <button onClick={()=>setWelcomeAct(2)} style={{background:'transparent',border:'1px solid rgba(184,115,51,0.5)',borderRadius:'9999px',padding:'0.6rem 2rem',color:'rgba(184,115,51,0.85)',fontSize:'0.82rem',cursor:'pointer',letterSpacing:'0.1em'}}>
                                {language==='es'?'Continuar →':'Continue →'}
                            </button>
                        </div>)}
                        {welcomeAct===2&&(<div className="wact">
                            <div style={{width:'40px',height:'1px',background:'rgba(184,115,51,0.4)',margin:'0 auto 2.5rem'}}/>
                            <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.45rem',fontWeight:400,color:'#F5E6D3',lineHeight:1.75,marginBottom:'1.5rem'}}>
                                {language==='es'
                                    ?'"Por eso nace Lumera. Un espacio por y para ti. Sin juicios, sin ruidos. Solo tú, yo y tu ritmo biológico."'
                                    :'"That is why Lumera was born. A space designed by and for you. No judgment, no noise. Just you, me, and your biological rhythm."'}
                            </p>
                            <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.1rem',fontStyle:'italic',color:'rgba(232,200,120,0.85)',marginBottom:'3rem'}}>
                                {language==='es'?'Bienvenida a tu santuario.':'Welcome to your sanctuary.'}
                            </p>
                            <button onClick={()=>setWelcomeAct(3)} style={{background:'transparent',border:'1px solid rgba(184,115,51,0.5)',borderRadius:'9999px',padding:'0.6rem 2rem',color:'rgba(184,115,51,0.85)',fontSize:'0.82rem',cursor:'pointer',letterSpacing:'0.1em'}}>
                                {language==='es'?'Continuar →':'Continue →'}
                            </button>
                        </div>)}
                        {welcomeAct===3&&(<div className="wact">
                            <p style={{fontFamily:"'Cormorant',serif",fontSize:'0.68rem',color:'rgba(184,115,51,0.7)',letterSpacing:'0.22em',textTransform:'uppercase',marginBottom:'2rem'}}>{language==='es'?'TU ESPACIO':'YOUR SPACE'}</p>
                            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem',marginBottom:'3rem',textAlign:'left'}}>
                                {[
                                    {img:'/images/nutri_huevo.png',es:'Nutrición',en:'Nutrition',d_es:'Placer sin culpas. Alquimia para tu GLP-1.',d_en:'Pleasure without guilt. Alchemy for your GLP-1.'},
                                    {img:'/images/carta_aprender.png',es:'LUMI',en:'LUMI',d_es:'Tu guía silenciosa. La voz que entiende tus hormonas.',d_en:'Your quiet guide. The voice that speaks your hormones.'},
                                    {img:'/images/ejer_espiral.png',es:'Movimiento',en:'Movement',d_es:'No es una obligación, es un ritual para ordenar tus ideas.',d_en:'Not a chore, but a ritual to clear your mind.'},
                                ].map((item,i)=>(
                                    <div key={i} style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                                        <img src={item.img} style={{width:'44px',height:'44px',borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'1px solid rgba(184,115,51,0.35)'}}/>
                                        <div>
                                            <p style={{fontFamily:"'Cormorant',serif",fontSize:'1rem',fontWeight:600,color:'#B87333',margin:'0 0 2px'}}>{language==='es'?item.es:item.en}</p>
                                            <p style={{fontSize:'0.8rem',color:'rgba(245,230,211,0.65)',margin:0,lineHeight:1.5}}>{language==='es'?item.d_es:item.d_en}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={()=>setShowWelcomeTrial(false)} style={{background:'linear-gradient(135deg,#B87333,#E8C878)',border:'none',borderRadius:'9999px',padding:'0.85rem 2.5rem',color:'#0A0A0A',fontSize:'1rem',fontFamily:"'Cormorant',serif",fontWeight:600,cursor:'pointer',letterSpacing:'0.08em',boxShadow:'0 0 25px rgba(184,115,51,0.35)'}}>
                                {language==='es'?'Explórame':'Explore me'}
                            </button>
                            <p style={{fontSize:'0.7rem',color:'rgba(184,115,51,0.4)',marginTop:'1rem',fontStyle:'italic',fontFamily:"'Cormorant',serif"}}>
                                {language==='es'?'"Tu cuerpo lleva mucho tiempo hablándote..."':'"Your body has been speaking to you for a long time..."'}
                            </p>
                        </div>)}
                    </div>
                </div>
            );

            if (showAuth) return (
                <div className="min-h-screen" style={{background: '#fafaf9'}}>
                    {/* NAVBAR ELEGANTE */}
                    <nav className="navbar-elegant fixed top-0 w-full z-50">
                        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C35 85 25 68 25 50 C25 32 35 15 50 5Z" fill="#9b8ec4" opacity="0.85"/>
                                    <path d="M50 22 L56 45 L50 78 L44 45 Z" fill="#C9935A"/>
                                </svg>
                                <h1 className="text-2xl font-medium tracking-tight" style={{color: '#78716c', fontFamily: 'Cormorant, serif'}}>
                                    LUMERA
                                </h1>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                                    style={{
                                        background: 'rgba(120, 113, 108, 0.08)',
                                        color: '#78716c'
                                    }}
                                >
                                    🌐 {language.toUpperCase()}
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* HERO ELEGANTE CON DOS COLUMNAS - OPTIMIZADO MÓVIL */}
                    <div className="pt-24" style={{
                        background: '#1a1a18',
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* VIDEO FONDO */}
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 0,
                                opacity: 0.55
                            }}
                        >
                            <source src="/lumera-intro.mp4" type="video/mp4" />
                        </video>

                        {/* OVERLAY GRADIENTE PARA LEGIBILIDAD */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to right, rgba(250, 245, 240, 0.92) 0%, rgba(250, 245, 240, 0.7) 40%, rgba(250, 245, 240, 0.3) 70%, rgba(250, 245, 240, 0.1) 100%)',
                            zIndex: 1
                        }}></div>

                        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 w-full" style={{position: 'relative', zIndex: 2}}>
                            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                                {/* CONTENIDO IZQUIERDO - COMPACTO */}
                                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                                    <div className="badge-subtle" style={{display: 'inline-block', width: 'fit-content'}}>
                                        {language === 'es' ? 'Para mujeres que están viviendo una transformación' : 'For women experiencing transformation'}
                                    </div>

                                    <div>
                                        <h2 className="hero-title-hybrid" style={{marginBottom: '0.75rem', fontSize: 'clamp(1.75rem, 5vw, 3rem)'}}>
                                            {language === 'es' ? 'Cuando tu cuerpo cambia,' : 'When your body changes,'}
                                            <br/>
                                            <span className="hero-subtitle-hybrid">
                                                {language === 'es' ? 'tener un plan lo cambia todo' : 'having a plan changes everything'}
                                            </span>
                                        </h2>

                                        <p className="text-lg md:text-xl leading-relaxed" style={{color: '#78716c', marginTop: '1rem'}}>
                                            {language === 'es' 
                                                ? 'No estás sola. Acompañamiento personalizado que entiende esta etapa.'
                                                : 'You are not alone. Personalized support that understands this stage.'}
                                        </p>
                                    </div>

                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                                        <p className="text-sm" style={{color: '#a8a29e'}}>
                                            {language === 'es' ? 'Sin tarjeta • Cancela cuando quieras' : 'No card required • Cancel anytime'}
                                        </p>
                                    </div>
                                </div>

                                <div style={{background: "rgba(255,255,255,0.65)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.85)", borderRadius: "2rem", padding: "2rem 1.75rem", boxShadow: "0 8px 48px rgba(124,58,237,0.12)"}}>
                                    <div style={{textAlign: "center", marginBottom: "1.5rem"}}>
                                        <div style={{fontFamily:"'Cormorant', serif", fontSize:"1.2rem", color:"#C9935A", letterSpacing:"0.15em", marginBottom:"0.5rem"}}>✦ LUMERA</div>
                                        <h3 style={{fontFamily: "'Cormorant', serif", fontSize: "1.6rem", fontWeight: 400, color: "#292524", marginBottom: "0.25rem"}}>
                                            {language === 'es' ? 'Empieza tu prueba gratuita' : 'Start your free trial'}
                                        </h3>
                                        <p className="text-sm" style={{color: '#78716c'}}>
                                            {language === 'es' ? '3 días para descubrir Lumera' : '3 days to discover Lumera'}
                                        </p>
                                    </div>
                                    <div style={{display: "flex", gap: "0.5rem", marginBottom: "1.25rem", background: "rgba(201,147,90,0.06)", borderRadius: "9999px", padding: "0.25rem"}}>
                                        <button
                                            onClick={() => setAuthMode('register')}
                                            style={{flex: 1, padding: "0.6rem", borderRadius: "9999px", border: "none", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", background: authMode === "register" ? "linear-gradient(135deg, #C9935A, #e8c89f)" : "transparent", color: authMode === "register" ? "white" : "#78716c", boxShadow: authMode === "register" ? "0 2px 8px rgba(124,58,237,0.3)" : "none"}}
                                        >
                                            {language === 'es' ? 'Crear Cuenta' : 'Sign Up'}
                                        </button>
                                        <button 
                                            onClick={() => setAuthMode('login')} 
                                            style={{flex: 1, padding: "0.6rem", borderRadius: "9999px", border: "none", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", background: authMode === "login" ? "linear-gradient(135deg, #C9935A, #e8c89f)" : "transparent", color: authMode === "login" ? "white" : "#78716c", boxShadow: authMode === "login" ? "0 2px 8px rgba(124,58,237,0.3)" : "none"}}
                                        >
                                            {language === 'es' ? 'Iniciar Sesión' : 'Login'}
                                        </button>
                                    </div>

                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem'}}>
                                        <input
                                            type="email"
                                            placeholder={language === 'es' ? 'Tu correo electrónico' : 'Your email'}
                                            value={authData.email}
                                            onChange={(e) => setAuthData({...authData, email: e.target.value})}
                                            className="input-elegant w-full"
                                        />

                                        <input
                                            type="password"
                                            placeholder={language === 'es' ? 'Contraseña' : 'Password'}
                                            value={authData.password}
                                            onChange={(e) => setAuthData({...authData, password: e.target.value})}
                                            className="input-elegant w-full"
                                        />

                                        {authMode === 'login' && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordReset(true)}
                                                className="text-xs text-amber-700 hover:text-amber-800 text-right transition"
                                            >
                                                {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}
                                            </button>
                                        )}
                                    </div>

                                    {authMode === 'register' && (
                                        <div className="mb-4 space-y-2 text-xs bg-amber-900/10 p-4 rounded-2xl border border-amber-700/20">
                                            <p className="font-bold text-sm text-rose-900 mb-2">
                                                {language === 'es' ? '⚠️ Confirmaciones Importantes' : '⚠️ Important Confirmations'}
                                            </p>

                                            <label className="flex items-start gap-2 cursor-pointer group">
                                                <input type="checkbox" required className="mt-1 w-4 h-4 text-amber-700 rounded focus:ring-2 focus:ring-amber-300 flex-shrink-0"/>
                                                <span className="text-gray-700 group-hover:text-gray-900 leading-tight">
                                                    {language === 'es' 
                                                        ? 'Confirmo que soy mayor de 18 años.' 
                                                        : 'I confirm I am over 18 years old.'}
                                                </span>
                                            </label>

                                            <label className="flex items-start gap-2 cursor-pointer group">
                                                <input type="checkbox" required className="mt-1 w-4 h-4 text-amber-700 rounded flex-shrink-0"/>
                                                <span className="text-gray-700 font-medium group-hover:text-gray-900 leading-tight">
                                                    {language === 'es' 
                                                        ? 'Entiendo que Lumera es una herramienta de bienestar y NO sustituye consejo médico profesional.' 
                                                        : 'I understand that Lumera is a wellness tool and does NOT replace professional medical advice.'}
                                                </span>
                                            </label>

                                            <label className="flex items-start gap-2 cursor-pointer group">
                                                <input type="checkbox" required className="mt-1 w-4 h-4 text-amber-700 rounded"/>
                                                <span className="text-gray-700 font-medium group-hover:text-gray-900">
                                                    {language === 'es' 
                                                        ? <>Acepto la <a href={language === 'es' ? '/privacidad' : '/privacy'} target="_blank" style={{color: '#DEB98A', textDecoration: 'underline'}}>Política de Privacidad</a> y protección de datos.</>
                                                        : <>I accept the <a href={language === 'es' ? '/privacidad' : '/privacy'} target="_blank" style={{color: '#DEB98A', textDecoration: 'underline'}}>Privacy Policy</a> and data protection.</>}
                                                </span>
                                            </label>

                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input type="checkbox" required className="mt-1 w-4 h-4 text-amber-700 rounded"/>
                                                <span className="text-gray-700 font-medium group-hover:text-gray-900">
                                                    {language === 'es' 
                                                        ? <>Acepto los <a href={language === 'es' ? '/terminos' : '/terms'} target="_blank" style={{color: '#DEB98A', textDecoration: 'underline'}}>Términos de Uso</a> y respeto la propiedad intelectual de Lumera.</>
                                                        : <>I accept the <a href={language === 'es' ? '/terminos' : '/terms'} target="_blank" style={{color: '#DEB98A', textDecoration: 'underline'}}>Terms of Use</a> and respect Lumera's intellectual property.</>}
                                                </span>
                                            </label>
                                        </div>
                                    )}

                                    <button
                                        onClick={authMode === 'login' ? handleLogin : handleRegister}
                                        className="btn-cta-elegant w-full"
                                    >
                                        {authMode === 'login' 
                                            ? (language === 'es' ? 'Entrar' : 'Login') 
                                            : (language === 'es' ? 'Crear cuenta' : 'Create account')}
                                    </button>

                                    {/* BOTÓN DE GOOGLE */}
                                    <div className="flex items-center gap-3 my-4">
                                        <div className="flex-1 border-t border-gray-300"></div>
                                        <span className="text-xs text-gray-500">
                                            {language === 'es' ? 'o continúa con' : 'or continue with'}
                                        </span>
                                        <div className="flex-1 border-t border-gray-300"></div>
                                    </div>

                                    <button
                                        onClick={handleGoogleLogin}
                                        className="w-full border hover:opacity-90 py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2"
                                        style={{background: 'linear-gradient(135deg, #f5f0ff, #fdf2f8)', borderColor: 'rgba(167,139,250,0.4)', color: '#C9935A'}}
                                    >
                                        <span style={{fontFamily: "'Cormorant', serif", fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em'}}>✦ Lumera</span>
                                        <span style={{fontSize: '0.85rem', fontWeight: 500}}>
                                            {language === 'es' ? '— continúa con Google' : '— continue with Google'}
                                        </span>
                                    </button>

                                    <p className="text-center text-sm mt-4" style={{color: '#78716c'}}>
                                        {authMode === 'signup' 
                                            ? (language === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?')
                                            : (language === 'es' ? '¿No tienes cuenta?' : 'Don\'t have an account?')}
                                        {' '}
                                        <button
                                            type="button"
                                            onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                                            className="font-medium"
                                            style={{color: '#C9935A'}}
                                        >
                                            {authMode === 'signup' 
                                                ? (language === 'es' ? 'Inicia sesión' : 'Log in')
                                                : (language === 'es' ? 'Regístrate' : 'Sign up')}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BANNER INSTALACIÓN PWA */}
                    {(() => {
                        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
                        const isAndroid = /android/i.test(navigator.userAgent);
                        const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
                        if (isInstalled) return null;
                        return (
                            <div className="py-16 px-6" style={{background: 'linear-gradient(135deg, #fdf4ff 0%, #fff7ed 100%)'}}>
                                <div className="max-w-2xl mx-auto text-center">
                                    <div className="text-4xl mb-4">🌙</div>
                                    <h3 className="text-2xl font-light mb-3" style={{color: '#44403c', fontFamily: 'Cormorant, serif'}}>
                                        {language === 'es' ? 'Llévame contigo, siempre que me necesites' : 'Take me with you, whenever you need me'}
                                    </h3>
                                    <p className="text-base leading-relaxed mb-8" style={{color: '#78716c'}}>
                                        {language === 'es'
                                            ? 'Puedes instalarme en tu móvil y tenerme siempre a mano — sin buscarte en el navegador, sin distracciones.'
                                            : 'You can install me on your phone and have me always at hand — no searching in the browser, no distractions.'}
                                    </p>

                                    {isAndroid && (
                                        <div className="card-elegant inline-block text-left px-8 py-6" style={{maxWidth: '360px', width: '100%'}}>
                                            <p className="text-sm font-semibold mb-4" style={{color: '#a8a29e', letterSpacing: '0.1em', textTransform: 'uppercase'}}>
                                                {language === 'es' ? 'En Android' : 'On Android'}
                                            </p>
                                            {[
                                                { icon: '🌐', text: language === 'es' ? 'Abre Lumera en Chrome' : 'Open Lumera in Chrome' },
                                                { icon: '⋮', text: language === 'es' ? 'Toca el menú (tres puntos)' : 'Tap the menu (three dots)' },
                                                { icon: '📲', text: language === 'es' ? 'Selecciona "Añadir a pantalla de inicio"' : 'Select "Add to Home Screen"' },
                                            ].map((step, i) => (
                                                <div key={i} className="flex items-center gap-4 mb-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{background: 'linear-gradient(135deg, #f43f5e, #f59e0b)', color: 'white', fontWeight: '600'}}>
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-sm" style={{color: '#57534e'}}>{step.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isIOS && (
                                        <div className="card-elegant inline-block text-left px-8 py-6" style={{maxWidth: '360px', width: '100%'}}>
                                            <p className="text-sm font-semibold mb-4" style={{color: '#a8a29e', letterSpacing: '0.1em', textTransform: 'uppercase'}}>
                                                {language === 'es' ? 'En iPhone' : 'On iPhone'}
                                            </p>
                                            {[
                                                { text: language === 'es' ? 'Abre Lumera en Safari' : 'Open Lumera in Safari' },
                                                { text: language === 'es' ? 'Pulsa el botón compartir  ↑' : 'Tap the share button ↑' },
                                                { text: language === 'es' ? 'Selecciona "Añadir a inicio"' : 'Select "Add to Home Screen"' },
                                            ].map((step, i) => (
                                                <div key={i} className="flex items-center gap-4 mb-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{background: 'linear-gradient(135deg, #f43f5e, #f59e0b)', color: 'white', fontWeight: '600'}}>
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-sm" style={{color: '#57534e'}}>{step.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {!isIOS && !isAndroid && (
                                        <div className="flex gap-8 justify-center flex-wrap">
                                            <div className="card-elegant text-left px-8 py-6" style={{maxWidth: '280px'}}>
                                                <p className="text-sm font-semibold mb-4" style={{color: '#a8a29e', letterSpacing: '0.1em', textTransform: 'uppercase'}}>Android</p>
                                                {[
                                                    language === 'es' ? 'Abre Lumera en Chrome' : 'Open Lumera in Chrome',
                                                    language === 'es' ? 'Menú ⋮ → "Añadir a pantalla de inicio"' : 'Menu ⋮ → "Add to Home Screen"',
                                                    language === 'es' ? '¡Listo! Aparece en tu inicio' : 'Done! Appears on your home screen',
                                                ].map((step, i) => (
                                                    <div key={i} className="flex items-center gap-4 mb-3">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{background: 'linear-gradient(135deg, #f43f5e, #f59e0b)', color: 'white', fontWeight: '600'}}>{i + 1}</div>
                                                        <p className="text-sm" style={{color: '#57534e'}}>{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="card-elegant text-left px-8 py-6" style={{maxWidth: '280px'}}>
                                                <p className="text-sm font-semibold mb-4" style={{color: '#a8a29e', letterSpacing: '0.1em', textTransform: 'uppercase'}}>iPhone</p>
                                                {[
                                                    language === 'es' ? 'Abre Lumera en Safari' : 'Open Lumera in Safari',
                                                    language === 'es' ? 'Pulsa el botón compartir ↑' : 'Tap the share button ↑',
                                                    language === 'es' ? 'Selecciona "Añadir a inicio"' : 'Select "Add to Home Screen"',
                                                ].map((step, i) => (
                                                    <div key={i} className="flex items-center gap-4 mb-3">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{background: 'linear-gradient(135deg, #f43f5e, #f59e0b)', color: 'white', fontWeight: '600'}}>{i + 1}</div>
                                                        <p className="text-sm" style={{color: '#57534e'}}>{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-xs mt-8" style={{color: '#a8a29e'}}>
                                        {language === 'es'
                                            ? '✨ Gratuito · Sin descargas de tienda · Siempre actualizada'
                                            : '✨ Free · No store download · Always up to date'}
                                    </p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* FEATURES ELEGANTES */}
                    <div className="py-24 px-6" style={{background: 'white'}}>
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h3 className="text-3xl font-light mb-4" style={{color: '#292524', fontFamily: 'Cormorant, serif'}}>
                                    {language === 'es' ? 'Todo lo que necesitas en un lugar' : 'Everything you need in one place'}
                                </h3>
                                <div className="divider-elegant"></div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="card-elegant text-center fade-in-up">
                                    <div className="text-5xl mb-6">🍽️</div>
                                    <h3 className="text-2xl font-light mb-4" style={{color: '#44403c', fontFamily: 'Cormorant, serif'}}>
                                        {language === 'es' ? 'Menús que alivian' : 'Menus that relieve'}
                                    </h3>
                                    <p className="leading-relaxed" style={{color: '#78716c'}}>
                                        {language === 'es' 
                                            ? 'Recetas adaptadas para reducir síntomas como hinchazón y sofocos. Con evidencia científica.'
                                            : 'Recipes adapted to reduce symptoms like bloating and hot flashes. Evidence-based.'}
                                    </p>
                                </div>

                                <div className="card-elegant text-center fade-in-up">
                                    <div className="text-5xl mb-6">💪</div>
                                    <h3 className="text-2xl font-light mb-4" style={{color: '#44403c', fontFamily: 'Cormorant, serif'}}>
                                        {language === 'es' ? 'Ejercicio sin riesgo' : 'Safe movement'}
                                    </h3>
                                    <p className="leading-relaxed" style={{color: '#78716c'}}>
                                        {language === 'es' 
                                            ? 'Movimiento seguro para esta etapa. Sin impacto, sin dolor, solo bienestar.'
                                            : 'Exercise designed for this stage. No impact, no pain, just wellness.'}
                                    </p>
                                </div>

                                <div className="card-elegant text-center fade-in-up">
                                    <div className="text-5xl mb-6">💬</div>
                                    <h3 className="text-2xl font-light mb-4" style={{color: '#44403c', fontFamily: 'Cormorant, serif'}}>
                                        {language === 'es' ? 'Tu guía personal' : 'Your personal guide'}
                                    </h3>
                                    <p className="leading-relaxed" style={{color: '#78716c'}}>
                                        {language === 'es' 
                                            ? 'Acompañamiento cuando lo necesites. Respuestas, planes adaptados, seguimiento.'
                                            : 'Support when you need it. Answers, adapted plans, tracking.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STATS STRIP */}
                    <div className="py-12 px-6" style={{background: 'linear-gradient(135deg, #faf5ff 0%, #fff7ed 100%)'}}>
                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div>
                                    <p className="text-4xl font-light mb-1" style={{color: '#C9935A', fontFamily: 'Cormorant, serif'}}>120+</p>
                                    <p className="text-sm" style={{color: '#78716c'}}>{language === 'es' ? 'Recetas científicas' : 'Science-based recipes'}</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-light mb-1" style={{color: '#C9935A', fontFamily: 'Cormorant, serif'}}>3</p>
                                    <p className="text-sm" style={{color: '#78716c'}}>{language === 'es' ? 'Regiones adaptadas' : 'Adapted regions'}</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-light mb-1" style={{color: '#C9935A', fontFamily: 'Cormorant, serif'}}>100%</p>
                                    <p className="text-sm" style={{color: '#78716c'}}>{language === 'es' ? 'Personalizado' : 'Personalized'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TESTIMONIOS */}
                    <div className="py-24 px-6" style={{background: 'white'}}>
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-16">
                                <h3 className="text-3xl font-light mb-4" style={{color: '#292524', fontFamily: 'Cormorant, serif'}}>
                                    {language === 'es' ? 'Lo que dicen otras mujeres' : 'What other women say'}
                                </h3>
                                <div className="divider-elegant"></div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="testimonial-card">
                                    <p className="text-sm leading-relaxed mt-6 mb-4" style={{color: '#78716c'}}>
                                        {language === 'es' 
                                            ? 'Por fin entiendo lo que le pasa a mi cuerpo. Los menús de Lumera me han ayudado a reducir el hinchazón en semanas.'
                                            : 'I finally understand what\'s happening to my body. Lumera\'s menus helped reduce my bloating in weeks.'}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{background: 'linear-gradient(135deg, #DEB98A, #e8c89f)'}}>👩</div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{color: '#44403c'}}>
                                                {language === 'es' ? 'María, 46 años' : 'Maria, 46'}
                                            </p>
                                            <p className="text-xs" style={{color: '#a8a29e'}}>⭐⭐⭐⭐⭐</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="testimonial-card">
                                    <p className="text-sm leading-relaxed mt-6 mb-4" style={{color: '#78716c'}}>
                                        {language === 'es' 
                                            ? 'El chat de LUMI es increíble. Cuando me angustio por los sofocos, puedo hablar con alguien que realmente entiende.'
                                            : 'The LUMI chat is incredible. When I get anxious about hot flashes, I can talk to someone who truly understands.'}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{background: 'linear-gradient(135deg, #DEB98A, #e8c89f)'}}>👩</div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{color: '#44403c'}}>
                                                {language === 'es' ? 'Laura, 43 años' : 'Laura, 43'}
                                            </p>
                                            <p className="text-xs" style={{color: '#a8a29e'}}>⭐⭐⭐⭐⭐</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="testimonial-card">
                                    <p className="text-sm leading-relaxed mt-6 mb-4" style={{color: '#78716c'}}>
                                        {language === 'es' 
                                            ? 'Los ejercicios son perfectos para esta etapa. Nada de impacto, pero me siento mucho más fuerte y con más energía.'
                                            : 'The exercises are perfect for this stage. No impact, but I feel so much stronger and more energized.'}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{background: 'linear-gradient(135deg, #DEB98A, #e8c89f)'}}>👩</div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{color: '#44403c'}}>
                                                {language === 'es' ? 'Carmen, 48 años' : 'Carmen, 48'}
                                            </p>
                                            <p className="text-xs" style={{color: '#a8a29e'}}>⭐⭐⭐⭐⭐</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA FINAL */}
                    <div className="py-24 px-6" style={{background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08) 0%, rgba(253, 164, 175, 0.08) 100%)'}}>
                        <div className="max-w-2xl mx-auto text-center">
                            <h3 className="text-3xl font-light mb-4" style={{color: '#292524', fontFamily: 'Cormorant, serif'}}>
                                {language === 'es' ? 'Empieza tu transformación hoy' : 'Start your transformation today'}
                            </h3>
                            <p className="mb-8 leading-relaxed" style={{color: '#78716c'}}>
                                {language === 'es' 
                                    ? 'Prueba Lumera gratis durante 3 días. Sin compromisos, sin tarjeta de crédito.'
                                    : 'Try Lumera free for 3 days. No commitments, no credit card.'}
                            </p>
                            <button
                                onClick={() => { document.querySelector('.card-elegant')?.scrollIntoView({behavior: 'smooth', block: 'center'}); }}
                                className="btn-cta-elegant inline-block"
                                style={{padding: '1rem 2.5rem', fontSize: '1.1rem'}}
                            >
                                {language === 'es' ? 'Comenzar gratis →' : 'Get started free →'}
                            </button>
                            <p className="text-xs mt-4" style={{color: '#a8a29e'}}>
                                {language === 'es' ? 'Sin tarjeta • Cancela cuando quieras • Disponible en ES y EN' : 'No card • Cancel anytime • Available in ES and EN'}
                            </p>
                        </div>
                    </div>

                    {/* MODAL RESETEO CONTRASEÑA */}
                    {showPasswordReset && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPasswordReset(false)}>
                            <div 
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                                onClick={(e) => e.stopPropagation()}>

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold gradient-text">
                                        {language === 'es' ? '🔑 Resetear Contraseña' : '🔑 Reset Password'}
                                    </h3>
                                    <button 
                                        onClick={() => setShowPasswordReset(false)}
                                        className="text-gray-600 hover:text-gray-900 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <p className="text-sm mb-4 text-gray-600">
                                    {language === 'es' 
                                        ? 'Te enviaremos un email con instrucciones para crear una nueva contraseña.'
                                        : 'We\'ll send you an email with instructions to create a new password.'}
                                </p>

                                <input
                                    type="email"
                                    placeholder={language === 'es' ? 'Tu correo electrónico' : 'Your email'}
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="input-elegant w-full mb-6"
                                />

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowPasswordReset(false)}
                                        className="flex-1 py-3 rounded-lg font-semibold transition bg-gray-200 hover:bg-gray-300"
                                    >
                                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                                    </button>
                                    <button
                                        onClick={handlePasswordReset}
                                        className="flex-1 bg-gradient-to-r from-amber-700 to-amber-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                                    >
                                        {language === 'es' ? 'Enviar Email' : 'Send Email'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );

            
            // IMPORTANTE: Solo mostrar quiz si hay sesión válida
            if (showQuiz && session) return renderQuiz();

            // Si showQuiz es true pero no hay sesión, forzar auth
            if (showQuiz && !session) {
                setShowQuiz(false);
                setShowAuth(true);
                return null;
            }

            return (
                <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}>
                    <style>{`.lumera-slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:9999px;outline:none;cursor:pointer;background:linear-gradient(to right,#C9935A calc(var(--val,5)*10%),#e8d5c0 calc(var(--val,5)*10%))}.lumera-slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#C9935A,#e8c89f);cursor:pointer;box-shadow:0 1px 6px rgba(201,147,90,0.4)}.lumera-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#C9935A,#e8c89f);cursor:pointer;border:none}`}</style>
                    <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow sticky top-0 z-40 border-b`}>
                        <div className="max-w-6xl mx-auto px-3 py-3 flex justify-between items-center" style={{gap:'0.5rem'}}>
                            <div className="flex items-center gap-3">
                                <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C35 85 25 68 25 50 C25 32 35 15 50 5Z" fill="#9b8ec4" opacity="0.85"/>
                                    <path d="M50 22 L56 45 L50 78 L44 45 Z" fill="#C9935A"/>
                                </svg>
                                <h1 style={{fontFamily:"'Cormorant',serif",fontSize:"1.25rem",fontWeight:500,background:"linear-gradient(135deg,#C9935A,#c4a882)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",whiteSpace:"nowrap"}}>Lumera</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`px-2 py-1 rounded text-xs border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'}`}>
                                    <option value="es">🇪🇸</option>
                                    <option value="en">🇬🇧</option>
                                </select>
                                <button onClick={() => setDarkMode(!darkMode)} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-yellow-500 text-black' : 'bg-gray-200'}`}>
                                    {darkMode ? '☀️' : '🌙'}
                                </button>
                                {getUserTier() === 'premium' ? (
                                    <div style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.4rem 1rem',borderRadius:'9999px',background:'linear-gradient(135deg,#C9935A,#e8c89f)'}}>
                                        <span style={{color:'white',fontSize:'0.8rem',fontWeight:600}}>✦ Premium</span>
                                    </div>
                                ) : (
                                    <button onClick={() => setShowPlanModal(true)} style={{padding:'0.4rem 1rem',borderRadius:'9999px',fontSize:'0.8rem',fontWeight:600,background:'linear-gradient(135deg,#C9935A,#e8c89f)',color:'white',border:'none',cursor:'pointer',letterSpacing:'0.03em'}}>
                                        ✦ {language === 'es' ? 'Hazte Premium' : 'Go Premium'}
                                    </button>
                                )}
                                <button onClick={handleLogout} className="text-sm text-gray-600 dark:text-gray-400">{language === 'es' ? 'Salir' : 'Exit'}</button>
                            </div>
                        </div>
                    </header>

                    {/* BANNER TRIAL MEJORADO */}
                    {currentUser && !['active','paid'].includes(currentUser.subscription_status) && getTrialDaysLeft() > 0 && (
                        <div style={{background:darkMode?'rgba(201,147,90,0.12)':'linear-gradient(135deg,rgba(253,248,243,0.98),rgba(253,244,238,0.98))',borderBottom:'1px solid rgba(201,147,90,0.2)',padding:'0.75rem 1rem'}}>
                            <div style={{maxWidth:'900px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'0.75rem'}}>
                                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                                    <span style={{color:'#C9935A',fontSize:'1rem'}}>✦</span>
                                    <div>
                                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'0.95rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524'}}>
                                            {getTrialDaysLeft() === 3 && (language === 'es' 
                                                ? 'Día 1 de 3 — Explora Lumera sin límites'
                                                : 'Day 1 of 3 — Explore Lumera freely')}
                                            {getTrialDaysLeft() === 2 && (language === 'es'
                                                ? 'Día 2 de 3 — ¿Ya exploraste tus planes?'
                                                : 'Day 2 of 3 — Have you seen your plans?')}
                                            {getTrialDaysLeft() === 1 && (language === 'es'
                                                ? 'Último día de tu prueba gratuita'
                                                : 'Last day of your free trial')}
                                        </p>
                                        <p style={{fontSize:'0.75rem',color:darkMode?'#a8a29e':'#78716c'}}>
                                            {getTrialDaysLeft() === 1 && (language === 'es'
                                                ? '20% de descuento si te suscribes hoy'
                                                : '20% off if you subscribe today')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPlanModal(true)}
                                    style={{background:'linear-gradient(135deg,#C9935A,#e8c89f)',color:'white',border:'none',borderRadius:'9999px',padding:'0.45rem 1.1rem',fontSize:'0.8rem',fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}
                                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap text-sm ${
                                        darkMode 
                                            ? 'bg-white text-amber-900 hover:bg-gray-100' 
                                            : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:opacity-90'
                                    } transition`}
                                >
                                    {getTrialDaysLeft() === 1 
                                        ? (language === 'es' ? 'Activar descuento' : 'Activate discount')
                                        : (language === 'es' ? 'Suscribirse' : 'Subscribe')
                                    }
                                </button>
                            </div>
                        </div>
                    )}

                    {/* BANNER POST-TRIAL */}
                    {currentUser && !['active','paid'].includes(currentUser.subscription_status) && getTrialDaysLeft() === 0 && (
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-amber-50'} border-b ${darkMode ? 'border-gray-700' : 'border-amber-200'} px-4 py-3`}>
                            <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🔒</span>
                                    <div>
                                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {language === 'es' 
                                                ? 'Tu prueba terminó - Suscríbete para continuar'
                                                : 'Your trial ended - Subscribe to continue'}
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {language === 'es'
                                                ? 'Todavía puedes usar el tracker de síntomas y contenido básico'
                                                : 'You can still use symptom tracker and basic content'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPlanModal(true)}
                                    className="px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:opacity-90 transition text-sm"
                                >
                                    {language === 'es' ? 'Ver planes' : 'View plans'}
                                </button>
                            </div>
                        </div>
                    )}

                    <main className="max-w-6xl mx-auto px-4 py-8" key={`content-${currentPage}-${language}`}>
                        {renderContent()}
                    </main>

                    {/* Footer con disclaimer y enlaces legales */}
                    <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t py-6 mb-20`}>
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="text-center mb-4">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    {language === 'es'
                                        ? '⚠️ Lumera es una herramienta de bienestar, no sustituye consejo médico profesional.'
                                        : '⚠️ Lumera is a wellness tool, not a substitute for professional medical advice.'}
                                </p>
                                <div className="flex justify-center gap-4 text-xs">
                                    <a href="mailto:support@lumera.app" className="text-amber-700 hover:underline">
                                        {language === 'es' ? 'Soporte' : 'Support'}
                                    </a>
                                    <a href="mailto:privacy@lumera.app" className="text-amber-700 hover:underline">
                                        {language === 'es' ? 'Privacidad' : 'Privacy'}
                                    </a>
                                    <a href="mailto:hello@lumera.app" className="text-amber-700 hover:underline">
                                        {language === 'es' ? 'Contacto' : 'Contact'}
                                    </a>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gray-500">
                                © 2025 Lumera. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
                            </p>
                        </div>
                    </footer>

                    <nav className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t shadow-lg`}>
                        <div className="max-w-6xl mx-auto flex justify-around overflow-x-auto">
                            {[
                                { page: 'home', label: t[language].home, img: '/images/sintomas.png', premium: false },
                                { page: 'nutrition', label: t[language].nutrition, img: '/images/menu.png', premium: true },
                                { page: 'exercise', label: t[language].exercise, img: '/images/ejercicio.png', premium: true },
                                { page: 'symptoms', label: t[language].symptoms, img: '/images/sintomas.png', premium: true },
                                { page: 'period', label: t[language].period, img: '/images/periodo.png', premium: true },
                                { page: 'myths', label: t[language].myths, img: '/images/mitos.png', premium: false },
                                { page: 'tips', label: t[language].tips, img: '/images/consejos.png', premium: false },
                                { page: 'community', label: t[language].community, img: '/images/comunidad.png', premium: true }
                            ].map((item) => (
                                <button key={item.page} onClick={() => setCurrentPage(item.page)}
                                    style={{
                                        padding: '0.5rem 0.6rem',
                                        borderTop: currentPage === item.page ? '2px solid #C9935A' : '2px solid transparent',
                                        background: currentPage === item.page ? 'rgba(201,147,90,0.08)' : 'transparent',
                                        border: 'none',
                                        borderTop: currentPage === item.page ? '2px solid #C9935A' : '2px solid transparent',
                                        cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '56px',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
                                    }}>
                                    <div style={{position: 'relative'}}>
                                        <img src={item.img} style={{width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', opacity: currentPage === item.page ? 1 : 0.6}} />
                                        {item.premium && !isPremium() && <span style={{position: 'absolute', top: -4, right: -4, fontSize: '0.55rem', background: '#C9935A', color: 'white', borderRadius: '9999px', padding: '0 3px'}}>PRO</span>}
                                    </div>
                                    <div style={{fontSize: '0.6rem', color: currentPage === item.page ? '#C9935A' : '#78716c', fontWeight: currentPage === item.page ? 600 : 400}}>{item.label}</div>
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* BOTÓN FLOTANTE LUMI CON BADGE ANIMADO - ACTUALIZADO ✨ */}
                    {currentUser && (
                        <button
                            onClick={() => {
                                if (unreadLumiMessages > 0) {
                                    setShowProactiveModal(true);
                                } else {
                                    setShowLumiChat(true);
                                }
                            }}
                            style={{position:'fixed',bottom:'6rem',right:'1.5rem',zIndex:50,width:'60px',height:'60px',borderRadius:'50%',background:'#0D0D0D',border:'2px solid rgba(184,115,51,0.7)',boxShadow:'0 4px 20px rgba(0,0,0,0.4), 0 0 15px rgba(184,115,51,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.3s ease',padding:0}}
                            onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.08)';e.currentTarget.style.boxShadow='0 0 25px rgba(184,115,51,0.4)'}}
                            onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.4)'}}
                            title={language === 'es' ? 'Habla con LUMI - Tu coach personal' : 'Talk to LUMI - Your personal coach'}>

                            {/* BADGE ANIMADO */}
                            {unreadLumiMessages > 0 && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce shadow-lg">
                                    {unreadLumiMessages}
                                </div>
                            )}
                            <img src="/images/lumi.png" style={{width:'38px',height:'38px',borderRadius:'50%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} alt="LUMI"/>



                            {/* PULSO ANIMADO CUANDO HAY MENSAJES */}
                            {unreadLumiMessages > 0 && (
                                <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75"></span>
                            )}
                        </button>
                    )}

                    {/* MODAL CHAT LUMI */}
                    {showLumiChat && (
                        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowLumiChat(false)}>
                            <div 
                                style={{background:['active','paid'].includes(currentUser?.subscription_status)?'#0D0A06':(darkMode?'#1c1917':'#ffffff'),borderRadius:'1.5rem 1.5rem 0 0',boxShadow:'0 -8px 40px rgba(0,0,0,0.4)',width:'100%',maxWidth:'24rem',height:'80vh',maxHeight:'600px',display:'flex',flexDirection:'column',border:['active','paid'].includes(currentUser?.subscription_status)?'1px solid rgba(184,115,51,0.25)':'none'}}
                                onClick={(e) => e.stopPropagation()}>

                                {/* Header */}
                                <div style={{background:'linear-gradient(135deg,#0D0A06,#1a1008)',borderBottom:'1px solid rgba(184,115,51,0.3)',padding:'1rem 1.25rem',borderRadius:'1.5rem 1.5rem 0 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                                        <img src="/images/lumi.png" style={{width:'40px',height:'40px',borderRadius:'50%',objectFit:'cover',border:'2px solid rgba(184,115,51,0.5)'}} onError={e=>{e.target.style.display='none'}} alt="LUMI"/>
                                        <div>
                                            <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.15rem',fontWeight:600,color:'#B87333',margin:0}}>LUMI</h3>
                                            <p style={{fontSize:'0.72rem',color:'rgba(184,115,51,0.65)',margin:0}}>
                                                {!isPremium() ? `${dailyQuestions}/5 ${language === 'es' ? 'preguntas hoy' : 'questions today'}` : (language==='es'?'✦ Tu reflejo biológico':'✦ Your biological reflection')}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowLumiChat(false)} style={{background:'none',border:'none',color:'rgba(184,115,51,0.6)',cursor:'pointer',padding:'0.5rem',borderRadius:'50%'}}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {lumiMessages.length === 0 && (
                                        <div className="text-center py-8">
                                            <svg className="w-14 h-14 mx-auto mb-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                            <p className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'} mb-3`}>
                                                {language === 'es' ? '💜 Hola, soy LUMI' : '💜 Hi, I\'m LUMI'}
                                            </p>
                                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed px-2`}>
                                                {currentUser?.profile_name 
                                                    ? (language === 'es' 
                                                        ? `Hola ${currentUser.profile_name}. No tienes que contarme todo de un golpe. Voy a ir conociéndote poco a poco mientras registras cómo te sientes cada día. Así puedo acompañarte mejor. ¿Por qué no me cuentas cómo estás hoy?`
                                                        : `Hi ${currentUser.profile_name}. You don't have to tell me everything at once. I'll get to know you little by little as you log how you feel each day. That way I can support you better. Why don't you tell me how you're doing today?`)
                                                    : (language === 'es'
                                                        ? 'No tienes que contarme todo de un golpe. Voy a ir conociéndote poco a poco mientras registras cómo te sientes cada día. ¿Por qué no me cuentas cómo estás hoy?'
                                                        : 'You don\'t have to tell me everything at once. I\'ll get to know you little by little as you log how you feel each day. Why don\'t you tell me how you\'re doing today?')}
                                            </p>
                                        </div>
                                    )}

                                    {lumiMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                                msg.role === 'user'
                                                    ? 'bg-gradient-to-r from-rose-400 to-amber-300 text-white'
                                                    : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                                            }`}>
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {lumiLoading && (
                                        <div className="flex justify-start">
                                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl px-4 py-2`}>
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <div className="border-t p-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={lumiInput}
                                            onChange={(e) => setLumiInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendToLumi()}
                                            placeholder={language === 'es' ? 'Escribe tu pregunta...' : 'Type your question...'}
                                            className={`flex-1 px-4 py-3 rounded-full border ${
                                                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-amber-600`}
                                            disabled={lumiLoading}
                                        />
                                        <button
                                            onClick={sendToLumi}
                                            disabled={!lumiInput.trim() || lumiLoading}
                                            style={{background:'linear-gradient(135deg,#B87333,#E8C878)',border:'none',borderRadius:'50%',padding:'0.75rem',cursor:'pointer',transition:'all 0.2s'}} className="disabled:opacity-50 hover:scale-105">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODAL MENSAJES PROACTIVOS DE LUMI - NUEVO ✨ */}
                    {showProactiveModal && proactiveMessages.length > 0 && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => {
                            setShowProactiveModal(false);
                            markMessagesAsRead();
                        }}>
                            <div 
                                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col`}
                                onClick={(e) => e.stopPropagation()}>

                                {/* Header — distinto para saludo vs día 3 patrón */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #0D0D0D, #1a1008)',
                                    borderBottom: '1px solid rgba(184,115,51,0.3)',
                                    padding: '1.25rem'
                                }}>
                                    <div className="flex items-center gap-3">
                                        <img src="/images/lumi.png" style={{width:'44px',height:'44px',borderRadius:'50%',objectFit:'cover',border:'2px solid rgba(184,115,51,0.5)',flexShrink:0}} onError={e=>{e.target.style.display='none'}} alt="LUMI"/>
                                        <div>
                                            <h3 style={{fontFamily:"'Cormorant',serif",fontWeight:600,fontSize:'1.15rem',color:'#B87333',margin:0}}>
                                                {proactiveMessages[0]?.message_type === 'pattern_insight'
                                                    ? (language === 'es' ? 'LUMI encontró tus patrones' : 'LUMI found your patterns')
                                                    : (language === 'es' ? 'LUMI' : 'LUMI')}
                                            </h3>
                                            <p style={{fontSize:'0.78rem',color:'rgba(184,115,51,0.7)',margin:0,marginTop:'0.15rem'}}>
                                                {proactiveMessages[0]?.message_type === 'pattern_insight'
                                                    ? (language === 'es' ? '✦ Día 3 · Análisis completado' : '✦ Day 3 · Analysis complete')
                                                    : (language === 'es' ? '✦ Tu reflejo biológico' : '✦ Your biological reflection')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {proactiveMessages.map((msg, idx) => (
                                        <div key={msg.id} style={{background:darkMode?'rgba(184,115,51,0.08)':'rgba(253,248,243,0.95)',borderRadius:'0.75rem',padding:'1rem',borderLeft:'3px solid #C9935A'}}>
                                            {/* Tipo de mensaje con emoji */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xl">
                                                    
                                                    
                                                    
                                                    
                                                </span>
                                                <span className={`text-xs font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                                    {msg.message_type === 'pattern_detected' && (language === 'es' ? 'Patrón detectado' : 'Pattern detected')}
                                                    {msg.message_type === 'greeting' && (language === 'es' ? 'Saludo' : 'Greeting')}
                                                    {msg.message_type === 'check_in' && (language === 'es' ? 'Seguimiento' : 'Check-in')}
                                                    {msg.message_type === 'encouragement' && (language === 'es' ? 'Ánimo' : 'Encouragement')}
                                                </span>
                                            </div>

                                            {/* Texto del mensaje */}
                                            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {language === "es" ? msg.message_text : (msg.message_type === "greeting" ? "Good morning! I am here to support you today. How are you feeling?" : msg.message_type === "encouragement" ? "You are doing great. Every small step counts towards your wellbeing." : msg.message_type === "check_in" ? "How are you feeling today? I am here to listen." : msg.message_type === "pattern_detected" ? "I have detected some patterns in your symptoms. Let's review them together." : msg.message_text)}
                                            </p>

                                            {/* Timestamp */}
                                            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="p-4 border-t space-y-2">
                                    {/* Día 3 trial → botón ver patrón prominente */}
                                    {proactiveMessages[0]?.message_type === 'pattern_insight' && symptoms.length >= 3 && (
                                        <button
                                            onClick={() => {
                                                setShowProactiveModal(false);
                                                markMessagesAsRead();
                                                const result = analyzePatterns(symptoms);
                                                if (result && result.length > 0) {
                                                    setPatternResult(result);
                                                } else {
                                                    setPatternResult([{
                                                        type: 'no_data',
                                                        symptom: '',
                                                        message: language === 'es'
                                                            ? 'Aún estás construyendo tu historial. Registra tus síntomas cada día y en 3 días tendré patrones reales de tu cuerpo para mostrarte.'
                                                            : 'You are still building your history. Log your symptoms every day and in 3 days I will have real patterns from your body to show you.'
                                                    }]);
                                                }
                                                if (getTrialDaysLeft() <= 1) setShowPatternModal(true);
                                                setPatternShown(true);
                                            }}
                                            style={{
                                                width: '100%',
                                                background: 'linear-gradient(135deg, #C9935A, #C9935A)',
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '0.95rem',
                                                padding: '0.85rem',
                                                borderRadius: '0.875rem',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            📊 {language === 'es' ? 'Ver mi patrón de síntomas' : 'See my symptom pattern'}
                                        </button>
                                    )}
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => {
                                                setShowProactiveModal(false);
                                                markMessagesAsRead();
                                                setShowLumiChat(true);
                                            }}
                                            className="flex-1 bg-gradient-to-r from-rose-400 to-amber-300 text-white py-3 rounded-xl font-semibold text-sm">
                                            💬 {language === 'es' ? 'Hablar con LUMI' : 'Talk to LUMI'}
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setShowProactiveModal(false);
                                                markMessagesAsRead();
                                            }}
                                            className={`flex-1 py-3 rounded-xl font-semibold text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                            {language === 'es' ? 'Cerrar' : 'Close'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODAL SELECCIÓN DE PLAN */}
                    {showPlanModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowPlanModal(false)}>
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-lg`} onClick={(e) => e.stopPropagation()}>
                                <div style={{background:'linear-gradient(135deg,#C9935A,#e8c89f)',padding:'1.5rem',color:'white'}}>
                                    <p style={{fontSize:'0.7rem',letterSpacing:'0.15em',opacity:0.85,marginBottom:'0.25rem'}}>✦ LUMERA</p>
                                    <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.8rem',fontWeight:500,marginBottom:'0.25rem'}}>{language === 'es' ? 'Elige tu plan' : 'Choose your plan'}</h3>
                                    <p style={{fontSize:'0.8rem',opacity:0.85}}>{language === 'es' ? 'Cancela cuando quieras · Precios + IVA' : 'Cancel anytime · Prices excl. VAT'}</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <button onClick={() => { setShowPlanModal(false); handleSubscribe('monthly'); }} style={{width:'100%',background:darkMode?'rgba(255,255,255,0.05)':'rgba(253,248,243,0.8)',borderRadius:'1rem',padding:'1.1rem 1.25rem',textAlign:'left',border:'1.5px solid rgba(201,147,90,0.2)',cursor:'pointer',transition:'all 0.2s'}} onMouseOver={e=>e.currentTarget.style.borderColor='#C9935A'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(201,147,90,0.2)'}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'es' ? 'Mensual' : 'Monthly'}</h4>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'es' ? 'Máxima flexibilidad' : 'Maximum flexibility'}</p>
                                            </div>
                                            <div className="text-right">
                                                <div style={{fontSize:'1.5rem',fontWeight:700,color:'#C9935A'}}>{PRICES[userRegion].monthly}</div>
                                                <div style={{fontSize:'0.72rem',color:'#78716c'}}>{language === 'es' ? 'por mes + IVA' : 'per month + VAT'}</div>
                                            </div>
                                        </div>
                                    </button>
                                    <button onClick={() => { setShowPlanModal(false); handleSubscribe('annual'); }} style={{width:'100%',background:darkMode?'rgba(201,147,90,0.08)':'rgba(253,248,243,0.95)',borderRadius:'1rem',padding:'1.1rem 1.25rem',textAlign:'left',border:'1.5px solid #C9935A',cursor:'pointer',position:'relative',transition:'all 0.2s'}}>
                                        <div style={{position:'absolute',top:'0.5rem',right:'0.5rem',background:'linear-gradient(135deg,#C9935A,#e8c89f)',color:'white',fontSize:'0.7rem',fontWeight:700,padding:'0.2rem 0.6rem',borderRadius:'9999px'}}>{language === 'es' ? `Ahorra ${PRICES[userRegion].annualSavings}` : `Save ${PRICES[userRegion].annualSavings}`}</div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'es' ? 'Anual' : 'Annual'}</h4>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'es' ? 'Mejor precio' : 'Best value'}</p>
                                            </div>
                                            <div className="text-right">
                                                <div style={{fontSize:'1.5rem',fontWeight:700,color:'#C9935A'}}>{PRICES[userRegion].annual}</div>
                                                <div style={{fontSize:'0.72rem',color:'#78716c'}}>{language === 'es' ? 'por año + IVA' : 'per year + VAT'}</div>
                                                <div style={{fontSize:'0.72rem',textDecoration:'line-through',color:'#a8a29e'}}>{PRICES[userRegion].annualOriginal}</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className="p-4 border-t">
                                    <button onClick={() => setShowPlanModal(false)} className={`w-full py-3 rounded-xl font-semibold ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>{language === 'es' ? 'Cancelar' : 'Cancel'}</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODAL PATRÓN DÍA 3 - RESUMEN LUMI */}
                    {showPatternModal && patternResult && patternResult[0]?.type === 'no_data' && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowPatternModal(false)}>
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden`} onClick={e => e.stopPropagation()}>
                                <div style={{background: 'linear-gradient(135deg, #C9935A, #C9935A)', padding: '1.75rem 1.5rem', textAlign: 'center', color: 'white'}}>
                                    <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🌱</div>
                                    <h3 style={{fontFamily: "'Cormorant', serif", fontSize: '1.6rem', fontWeight: 400, marginBottom: '0.25rem'}}>
                                        {language === 'es' ? 'Estamos empezando' : 'We are just starting'}
                                    </h3>
                                </div>
                                <div style={{padding: '1.5rem', textAlign: 'center'}}>
                                    <p style={{fontSize: '0.95rem', lineHeight: 1.7, color: darkMode ? '#e7e5e4' : '#44403c', marginBottom: '1.5rem'}}>
                                        {patternResult[0].message}
                                    </p>
                                    <button onClick={() => { setShowPatternModal(false); setCurrentPage('symptoms'); }} style={{background: 'linear-gradient(135deg, #C9935A, #C9935A)', color: 'white', border: 'none', borderRadius: '9999px', padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', width: '100%'}}>
                                        {language === 'es' ? 'Registrar síntomas ahora →' : 'Log symptoms now →'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showPatternModal && patternResult && patternResult[0]?.type !== 'no_data' && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                            <div style={{background:darkMode?'#1c1917':'#fdf8f3',borderRadius:'1rem',boxShadow:'0 25px 60px rgba(0,0,0,0.5)',width:'100%',maxWidth:'28rem',overflow:'hidden',maxHeight:'92vh',overflowY:'auto',border:'1px solid rgba(184,115,51,0.2)'}}>

                                {/* Header */}
                                <div style={{background:'linear-gradient(135deg,#0D0A06,#1a1008)',borderBottom:'1px solid rgba(184,115,51,0.3)',padding:'1.75rem 1.5rem',textAlign:'center'}}>
                                    <img src="/images/lumi.png" style={{width:'52px',height:'52px',borderRadius:'50%',objectFit:'cover',margin:'0 auto 0.75rem',display:'block',border:'2px solid rgba(184,115,51,0.5)'}} onError={e=>{e.target.style.display='none'}}/>
                                    <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.6rem',fontWeight:400,marginBottom:'0.25rem',color:'#B87333'}}>
                                        {language === 'es'
                                            ? `${currentUser?.profile_name || ''}, he estado observando`
                                            : `${currentUser?.profile_name || ''}, I have been paying attention`}
                                    </h3>
                                    <p style={{fontSize:'0.85rem',color:'rgba(184,115,51,0.7)'}}>
                                        {language === 'es' ? '✦ Aquí está lo que he visto en tus primeros 3 días' : '✦ Here is what I noticed in your first 3 days'}
                                    </p>
                                </div>

                                {/* GRÁFICO MINI — 3 días, 6 métricas */}
                                <div style={{margin: '1.25rem 1rem 0', padding: '1rem', borderRadius: '0.875rem', background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafaf9', border: '1px solid rgba(0,0,0,0.06)'}}>
                                    <p style={{fontSize: '0.72rem', fontWeight: 600, color: '#a8a29e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem'}}>
                                        📊 {language === 'es' ? 'Tus últimos 3 días' : 'Your last 3 days'}
                                    </p>
                                    <canvas id="patternChart" height="130"></canvas>
                                </div>

                                {/* TARJETAS RESUMEN — sueño, energía, ánimo, sofocos */}
                                {(() => {
                                    const last3 = symptoms.slice(-3);
                                    if (last3.length === 0) return null;
                                    const sf = (s, c, k) => s[c] !== undefined ? s[c] : (s[k] !== undefined ? s[k] : 0);
                                    const avg = (c, k) => (last3.reduce((a, s) => a + sf(s, c, k), 0) / last3.length);
                                    const metrics = [
                                        { label: language === 'es' ? 'Sueño' : 'Sleep', val: avg('sleep','sleep'), img: '/images/modo_cueva.png', good: v => v >= 6, goodText: language === 'es' ? 'Descansando bien' : 'Resting well', badText: language === 'es' ? 'Necesita atención' : 'Needs attention', color: '#B87333' },
                                        { label: language === 'es' ? 'Energía' : 'Energy', val: avg('energy','energy'), img: '/images/ejer_espiral.png', good: v => v >= 5, goodText: language === 'es' ? 'Estable' : 'Stable', badText: language === 'es' ? 'Baja estos días' : 'Low these days', color: '#C9935A' },
                                        { label: language === 'es' ? 'Ánimo' : 'Mood', val: avg('mood','mood'), img: '/images/modo_ritual.png', good: v => v >= 5, goodText: language === 'es' ? 'Equilibrado' : 'Balanced', badText: language === 'es' ? 'Días difíciles' : 'Tough days', color: '#C9935A' },
                                        { label: language === 'es' ? 'Sofocos' : 'Hot flashes', val: avg('hotFlashes','hot_flashes'), img: '/images/modo_tormenta.png', good: v => v <= 4, goodText: language === 'es' ? 'Manejables' : 'Manageable', badText: language === 'es' ? 'Frecuentes' : 'Frequent', color: '#B87333' },
                                    ];
                                    return (
                                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', margin: '1rem'}}>
                                            {metrics.map((m, i) => (
                                                <div key={i} style={{background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', border: `1px solid ${m.color}30`, borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center'}}>
                                                    <img src={m.img} style={{width:'36px',height:'36px',borderRadius:'50%',objectFit:'cover',margin:'0 auto 4px',display:'block',border:'1px solid rgba(184,115,51,0.3)'}}/>
                                                    <div style={{fontSize: '1.5rem', fontWeight: 700, color: m.color, lineHeight: 1.1}}>{m.val.toFixed(1)}<span style={{fontSize: '0.65rem', fontWeight: 400, color: '#a8a29e'}}>/10</span></div>
                                                    <div style={{fontSize: '0.7rem', color: '#a8a29e', marginTop: '0.1rem'}}>{m.label}</div>
                                                    <div style={{fontSize: '0.65rem', marginTop: '0.3rem', color: m.good(m.val) ? '#10b981' : '#f43f5e', fontWeight: 600}}>
                                                        {m.good(m.val) ? '✓ ' + m.goodText : '· ' + m.badText}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                                {/* LO QUE LUMI OBSERVÓ — sin porcentajes, tono personal */}
                                <div style={{margin: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
                                    {patternResult.map((p, idx) => (
                                        <div key={idx} style={{background: darkMode ? 'rgba(124,58,237,0.15)' : '#faf5ff', borderLeft: '3px solid #C9935A', borderRadius: '0.75rem', padding: '0.875rem 1rem'}}>
                                            <p style={{fontSize: '0.85rem', lineHeight: 1.55, color: darkMode ? '#d8b4fe' : '#6b21a8'}}>
                                                {p.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* MENSAJE LUMI PERSONAL */}
                                <div style={{margin: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #fff7ed, #fdf4ff)', borderRadius: '0.875rem', border: '1px solid rgba(244,63,94,0.15)'}}>
                                    <p style={{fontSize: '0.85rem', lineHeight: 1.6, color: darkMode ? '#fda4af' : '#9f1239', fontStyle: 'italic'}}>
                                        {language === 'es'
                                            ? '"Llevas 3 días conociéndote mejor. Eso ya es más de lo que hace la mayoría. Lo que registras aquí me ayuda a entenderte y a darte exactamente lo que tu cuerpo necesita en esta etapa."'
                                            : "You’ve spent 3 days getting to know yourself better. That’s already more than most people do. What you log here helps me understand you and give your body exactly what it needs at this stage."}
                                    </p>
                                    <p style={{fontSize: '0.78rem', color: '#a8a29e', marginTop: '0.5rem', fontWeight: 600}}>— LUMI</p>
                                </div>

                                {/* CTA conversión día 3 */}
                                {getTrialDaysLeft() <= 1 && getUserTier() !== 'premium' && (
                                    <div style={{margin: '0 1rem 1rem', background: 'linear-gradient(135deg, #C9935A, #C9935A)', borderRadius: '0.875rem', padding: '1.25rem', textAlign: 'center'}}>
                                        <p style={{color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem'}}>
                                            {language === 'es' ? '¿Seguimos juntas?' : 'Shall we continue together?'}
                                        </p>
                                        <p style={{color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.4}}>
                                            {language === 'es'
                                                ? 'Con Premium LUMI sigue analizando cada día y tus menús se adaptan a lo que vas sintiendo.'
                                                : 'With Premium, LUMI keeps analyzing every day and your menus adapt to how you feel.'}
                                        </p>
                                        <button
                                            onClick={() => { setShowPatternModal(false); setCurrentPage('premium'); }}
                                            style={{background: 'white', color: '#C9935A', fontWeight: 700, fontSize: '0.9rem', padding: '0.6rem 1.75rem', borderRadius: '9999px', border: 'none', cursor: 'pointer'}}>
                                            {language === 'es' ? '✨ Quiero continuar' : '✨ I want to continue'}
                                        </button>
                                    </div>
                                )}

                                {/* Botones */}
                                <div style={{padding: '0 1rem 1.25rem', display: 'flex', gap: '0.75rem'}}>
                                    <button
                                        onClick={() => { setShowPatternModal(false); setCurrentPage('symptoms'); }}
                                        style={{flex: 1, background: 'linear-gradient(135deg, #C9935A, #f43f5e)', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'}}>
                                        {language === 'es' ? 'Ver mis gráficas' : 'See my charts'}
                                    </button>
                                    <button
                                        onClick={() => setShowPatternModal(false)}
                                        style={{flex: 1, background: darkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f4', color: darkMode ? 'white' : '#57534e', border: 'none', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'}}>
                                        {language === 'es' ? 'Entendido' : 'Got it'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Renderiza el chart cuando se abre el modal */}
                    {showPatternModal && patternResult && (() => {
                        setTimeout(() => {
                            const canvas = document.getElementById('patternChart');
                            if (!canvas) return;
                            if (canvas.__chartInstance) canvas.__chartInstance.destroy();
                            const ctx = canvas.getContext('2d');
                            const last3 = symptoms.slice(0, 3).reverse();
                            const labels = last3.map((s, i) => {
                                const dateStr = s.symptom_date || s.date;
                                if (dateStr) {
                                    const d = new Date(dateStr);
                                    return language === 'es' 
                                        ? ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()]
                                        : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
                                }
                                return language === 'es' ? 'Día ' + (i+1) : 'Day ' + (i+1);
                            });
                            canvas.__chartInstance = new window.Chart(ctx, {
                                type: 'line',
                                data: {
                                    labels: labels,
                                    datasets: [
                                        { label: language === 'es' ? 'Sueño' : 'Sleep', data: last3.map(s => s.sleep || 0), borderColor: '#60a5fa', tension: 0.4, fill: false, pointRadius: 4, pointBackgroundColor: '#60a5fa' },
                                        { label: language === 'es' ? 'Energía' : 'Energy', data: last3.map(s => s.energy || 0), borderColor: '#fbbf24', tension: 0.4, fill: false, pointRadius: 4, pointBackgroundColor: '#fbbf24' },
                                        { label: language === 'es' ? 'Ánimo' : 'Mood', data: last3.map(s => s.mood || 0), borderColor: '#DEB98A', tension: 0.4, fill: false, pointRadius: 4, pointBackgroundColor: '#DEB98A' }
                                    ]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    scales: {
                                        y: { min: 0, max: 10, ticks: { stepSize: 2, color: darkMode ? '#9ca3af' : '#6b7280', font: { size: 10 } }, grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)' } },
                                        x: { ticks: { color: darkMode ? '#9ca3af' : '#6b7280', font: { size: 11 } }, grid: { display: false } }
                                    },
                                    plugins: { legend: { labels: { color: darkMode ? '#d1d5db' : '#374151', font: { size: 10 }, boxWidth: 10 } } }
                                }
                            });
                        }, 120);
                        return null;
                    })()}

                    {/* MODAL GUÍA: SIN PERIODO / PERIODO IRREGULAR */}
                    {currentUser && periodLog.length > 0 && getMonthsWithoutPeriod() >= 12 && currentPage === 'period' && (
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mt-4 border-2 border-amber-700/40`}>
                            <div className="text-center mb-4">
                                <div className="text-3xl mb-2">🌱</div>
                                <h3 className={`text-lg font-bold ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                    {language === 'es' ? 'Algo importante' : 'Something important'}
                                </h3>
                            </div>

                            <p className={`text-sm leading-relaxed text-center mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {language === 'es'
                                    ? `Llevas más de ${getMonthsWithoutPeriod()} meses sin registrar un período. Si realmente no te ha venido durante este tiempo, es posible que tu cuerpo esté en una nueva fase. Eso está bien. No es el final de nada. Si no lo has consultado con un profesional de salud, puede ser un buen momento para hacerlo.`
                                    : `You've gone more than ${getMonthsWithoutPeriod()} months without logging a period. If it really hasn't come during this time, your body might be in a new phase. That's okay. It's not the end of anything. If you haven't spoken to a health professional about it, it might be a good time to do so.`}
                            </p>

                            {/* Qué esperar */}
                            <div className={`${darkMode ? 'bg-stone-900' : 'bg-amber-50'} rounded-lg p-4 mb-4`}>
                                <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                    {language === 'es' ? '¿Qué puede pasar?' : 'What might happen?'}
                                </p>
                                <ul className={`text-xs space-y-1.5 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                    {(language === 'es' 
                                        ? ['Cambios en el sueño — puede volverse más ligero o interrumpido debido a cambios hormonales', 'Sofocos más frecuentes o intensos, especialmente por la noche', 'Cambios de humor relacionados con la variabilidad hormonal', 'Mayor sensibilidad al estrés', 'Cambios en el metabolismo y en cómo tu cuerpo maneja los nutrientes', 'Tu nivel de energía puede variar más de un día a otro']
                                        : ['Sleep changes — it may become lighter or interrupted due to hormonal shifts', 'More frequent or intense hot flashes, especially at night', 'Mood changes linked to hormonal variability', 'Greater sensitivity to stress', 'Metabolism changes and how your body processes nutrients', 'Your energy levels may vary more from day to day']
                                    ).map((item, i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                            <span className="text-amber-500 mt-0.5">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Algo esperanzador */}
                            <div className={`${darkMode ? 'bg-emerald-900' : 'bg-emerald-50'} rounded-lg p-4 border-l-4 border-emerald-500`}>
                                <p className={`text-sm leading-relaxed ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                                    <span className="font-semibold">✨ {language === 'es' ? 'Y también esto:' : 'And also this:'}</span>{' '}
                                    {language === 'es'
                                        ? 'Muchas mujeres reportan que en esta fase recuperan energía, sienten más claridad mental y encuentran una nueva relación con su cuerpo. Es un cambio, no una pérdida. Y Lumera te acompañará en cada paso.'
                                        : 'Many women report that in this phase they regain energy, feel more mental clarity, and find a new relationship with their body. It\'s a change, not a loss. And Lumera will be with you every step of the way.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* MODAL EDITAR PERFIL - COMPACTO Y VISUAL */}
                    {showEditProfile && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowEditProfile(false)}>
                            <div 
                                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md p-6`}
                                onClick={(e) => e.stopPropagation()}>

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold gradient-text">
                                        {language === 'es' ? '⚙️ Editar Perfil' : '⚙️ Edit Profile'}
                                    </h3>
                                    <button 
                                        onClick={() => setShowEditProfile(false)}
                                        className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-2xl`}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>IMC Actual</p>
                                        <p className="text-lg font-bold gradient-text">{currentUser?.bmi || '-'}</p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>TDEE Actual</p>
                                        <p className="text-lg font-bold gradient-text">{currentUser?.tdee || '-'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            {language === 'es' ? '⚖️ Peso (kg)' : '⚖️ Weight (kg)'}
                                        </label>
                                        <input 
                                            type="number" 
                                            step="0.1"
                                            value={editingWeight || currentUser?.weight || ''}
                                            onChange={(e) => setEditingWeight(e.target.value)}
                                            placeholder={currentUser?.weight?.toString() || ''}
                                            className={`w-full px-4 py-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            {language === 'es' ? '💪 Nivel de Actividad' : '💪 Activity Level'}
                                        </label>
                                        <select 
                                            value={editingActivity || currentUser?.activity_level || 'moderate'}
                                            onChange={(e) => setEditingActivity(e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                                        >
                                            <option value="sedentary">{language === 'es' ? 'Sedentario' : 'Sedentary'}</option>
                                            <option value="light">{language === 'es' ? 'Ligero' : 'Light'}</option>
                                            <option value="moderate">{language === 'es' ? 'Moderado' : 'Moderate'}</option>
                                            <option value="active">{language === 'es' ? 'Activo' : 'Active'}</option>
                                            <option value="very_active">{language === 'es' ? 'Muy activo' : 'Very active'}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowEditProfile(false)}
                                        className={`flex-1 py-3 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                                    >
                                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const weight = editingWeight || currentUser.weight;
                                            const activity = editingActivity || currentUser.activity_level;

                                            if (!weight || weight <= 0) {
                                                alert(language === 'es' ? 'Ingresa un peso válido' : 'Enter a valid weight');
                                                return;
                                            }

                                            const metrics = await updateUserMetrics(
                                                currentUser.id,
                                                weight,
                                                currentUser.height,
                                                currentUser.age,
                                                activity
                                            );

                                            if (metrics) {
                                                setCurrentUser({
                                                    ...currentUser,
                                                    weight: parseFloat(weight),
                                                    activity_level: activity,
                                                    bmi: parseFloat(metrics.bmi),
                                                    tdee: parseInt(metrics.tdee)
                                                });

                                                setShowEditProfile(false);
                                                alert(language === 'es' ? '✅ Perfil actualizado' : '✅ Profile updated');
                                            } else {
                                                alert(language === 'es' ? 'Error al actualizar' : 'Error updating');
                                            }
                                        }}
                                        className="flex-1 bg-gradient-to-r from-rose-400 to-amber-300 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                                    >
                                        {language === 'es' ? 'Guardar' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODAL RESETEO DE CONTRASEÑA */}
                    {showPasswordReset && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPasswordReset(false)}>
                            <div 
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold gradient-text">{language === 'es' ? '🔑 Resetear Contraseña' : '🔑 Reset Password'}</h3>
                                    <button onClick={() => setShowPasswordReset(false)} className="text-gray-600 hover:text-gray-900 text-2xl">×</button>
                                </div>
                                <p className="text-sm mb-4 text-gray-600">
                                    {language === 'es' ? 'Te enviaremos un email.' : 'We will send you an email.'}
                                </p>
                                <input type="email" placeholder="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="input-elegant w-full mb-6" />
                                <button onClick={handlePasswordReset} className="w-full bg-gradient-to-r from-amber-700 to-amber-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                                    {language === 'es' ? 'Enviar' : 'Send'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MODAL PERFIL METABÓLICO */}
                    {showProfileModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowProfileModal(false)}>
                            <div 
                                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md p-6`}
                                onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold gradient-text">
                                        {language === 'es' ? '📊 Perfil Metabólico' : '📊 Metabolic Profile'}
                                    </h3>
                                    <button onClick={() => setShowProfileModal(false)} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-gray-900 text-2xl`}>×</button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className={`text-sm font-semibold block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {language === 'es' ? 'Peso (kg)' : 'Weight (kg)'}
                                        </label>
                                        <input
                                            type="number"
                                            value={editWeight}
                                            onChange={(e) => setEditWeight(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500"
                                            placeholder="65"
                                        />
                                    </div>

                                    <div>
                                        <label className={`text-sm font-semibold block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {language === 'es' ? 'Altura (cm)' : 'Height (cm)'}
                                        </label>
                                        <input
                                            type="number"
                                            value={editHeight}
                                            onChange={(e) => setEditHeight(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500"
                                            placeholder="165"
                                        />
                                    </div>

                                    <div>
                                        <label className={`text-sm font-semibold block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {language === 'es' ? 'Edad' : 'Age'}
                                        </label>
                                        <input
                                            type="number"
                                            value={editAge}
                                            onChange={(e) => setEditAge(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500"
                                            placeholder="45"
                                        />
                                    </div>

                                    <div>
                                        <label className={`text-sm font-semibold block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {language === 'es' ? 'Nivel de Actividad' : 'Activity Level'}
                                        </label>
                                        <select
                                            value={editActivityLevel}
                                            onChange={(e) => setEditActivityLevel(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500"
                                        >
                                            <option value="sedentary">{language === 'es' ? 'Sedentario (poco ejercicio)' : 'Sedentary (little exercise)'}</option>
                                            <option value="light">{language === 'es' ? 'Ligero (1-3 días/semana)' : 'Light (1-3 days/week)'}</option>
                                            <option value="moderate">{language === 'es' ? 'Moderado (3-5 días/semana)' : 'Moderate (3-5 days/week)'}</option>
                                            <option value="active">{language === 'es' ? 'Activo (6-7 días/semana)' : 'Active (6-7 days/week)'}</option>
                                            <option value="very_active">{language === 'es' ? 'Muy activo (trabajo físico)' : 'Very active (physical job)'}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`text-sm font-semibold block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {language === 'es' ? 'Objetivo' : 'Goal'}
                                        </label>
                                        <select
                                            value={editGoal}
                                            onChange={(e) => setEditGoal(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500"
                                        >
                                            <option value="lose">{language === 'es' ? 'Perder peso' : 'Lose weight'}</option>
                                            <option value="maintain">{language === 'es' ? 'Mantener peso' : 'Maintain weight'}</option>
                                            <option value="gain">{language === 'es' ? 'Ganar peso' : 'Gain weight'}</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={saveMetabolicProfile}
                                        className="w-full bg-gradient-to-r from-amber-600 to-amber-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition mt-6"
                                    >
                                        {language === 'es' ? '💾 Guardar' : '💾 Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }; // Cierra LumeraApp

        export default LumeraApp;
