// TierTreu – App Logic

const app = {
    state: {
        currentView: 'home',
        activePetId: 1,
        userPets: [
            {
                id: 1,
                name: 'Luna',
                type: 'Hund',
                breed: 'Golden Retriever',
                age: 3,
                avatar: 'assets/pet_profile.png',
                color: '#d9745b',
                insurances: [
                    { id: 10, provider: 'Agila', type: 'Krankenvollschutz', policyNumber: 'AG-129381', since: '2024' }
                ],
                health: {
                    vaccinations: [
                        { id: 20, name: 'Tollwut', date: '12.05.2025', nextDue: '12.05.2028', status: 'ok' },
                        { id: 21, name: 'Leptospirose', date: '10.08.2025', nextDue: '10.08.2026', status: 'soon' }
                    ],
                    allergies: ['Rindfleisch', 'Pollen'],
                    history: [
                        { id: 30, date: '03.02.2026', title: 'Ohrinfektion', description: 'Behandlung mit Tropfen (Surolan) für 7 Tage.' },
                        { id: 31, date: '15.11.2025', title: 'Kastration', description: 'Routinemäßiger Eingriff, ohne Komplikationen.' }
                    ]
                }
            },
            {
                id: 2,
                name: 'Milo',
                type: 'Katze',
                breed: 'Britisch Kurzhaar',
                age: 5,
                avatar: null,
                color: '#5b8cd9',
                insurances: [
                    { id: 11, provider: 'HanseMerkur', type: 'OP-Schutz', policyNumber: 'HM-774452', since: '2023' }
                ],
                health: {
                    vaccinations: [
                        { id: 22, name: 'Katzenschnupfen', date: '20.03.2025', nextDue: '20.03.2026', status: 'overdue' },
                        { id: 23, name: 'Tollwut', date: '20.03.2025', nextDue: '20.03.2027', status: 'ok' }
                    ],
                    allergies: ['Hühnchen'],
                    history: [
                        { id: 32, date: '10.01.2026', title: 'Zahnsteinentfernung', description: 'Professionelle Zahnreinigung unter Narkose.' }
                    ]
                }
            }
        ]
    },

    init() {
        this.renderView();
    },

    navigate(view) {
        this.state.currentView = view;
        this.renderView();
        window.scrollTo(0, 0);
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        if (view === 'home') {
            document.querySelectorAll('.nav-links a')[0]?.classList.add('active');
        } else if (view === 'dashboard') {
            document.querySelectorAll('.nav-links a')[1]?.classList.add('active');
        }
    },

    renderView() {
        const root = document.getElementById('app-root');
        if (this.state.currentView === 'home') {
            root.innerHTML = this.views.home();
        } else if (this.state.currentView === 'dashboard') {
            root.innerHTML = this.views.dashboard();
        }
    },

    scrollToWaitlist() {
        this.navigate('home');
        setTimeout(() => {
            document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    },

    scrollToFeatures() {
        this.navigate('home');
        setTimeout(() => {
            document.getElementById('funktionen')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    },

    toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('open');
    },

    closeMobileMenu() {
        document.getElementById('mobile-menu')?.classList.remove('open');
    },

    selectPet(id) {
        this.state.activePetId = id;
        this.renderView();
        window.scrollTo(0, 0);
    },

    getActivePet() {
        return this.state.userPets.find(p => p.id === this.state.activePetId) || this.state.userPets[0];
    },

    getPetInitial(pet) {
        return pet.name.charAt(0).toUpperCase();
    },

    // --- Actions ---

    addPet(e) {
        e.preventDefault();
        const name = document.getElementById('new-pet-name').value;
        const type = document.getElementById('new-pet-type').value;
        const breed = document.getElementById('new-pet-breed').value;
        const age = parseInt(document.getElementById('new-pet-age').value) || 0;
        const colors = ['#d9745b','#5b8cd9','#5ba876','#9b5bd9','#d9b45b'];
        const newPet = {
            id: Date.now(),
            name, type, breed, age,
            avatar: null,
            color: colors[this.state.userPets.length % colors.length],
            insurances: [],
            health: { vaccinations: [], allergies: [], history: [] }
        };
        this.state.userPets.push(newPet);
        this.state.activePetId = newPet.id;
        document.getElementById('add-pet-modal').classList.remove('open');
        this.renderView();
    },

    addInsurance(e) {
        e.preventDefault();
        const provider = document.getElementById('ins-provider').value;
        const type = document.getElementById('ins-type').value;
        const policyNumber = document.getElementById('ins-policy').value;
        const pet = this.getActivePet();
        pet.insurances.push({ id: Date.now(), provider, type, policyNumber, since: new Date().getFullYear().toString() });
        this.renderView();
    },

    addAllergy(e) {
        e.preventDefault();
        const allergy = document.getElementById('allergy-input').value;
        if (allergy) {
            this.getActivePet().health.allergies.push(allergy);
            this.renderView();
        }
    },

    removeAllergy(index) {
        this.getActivePet().health.allergies.splice(index, 1);
        this.renderView();
    },

    addVaccination(e) {
        e.preventDefault();
        const name = document.getElementById('vac-name').value;
        const date = document.getElementById('vac-date').value;
        const nextDue = document.getElementById('vac-next').value;
        const fmt = d => { const [y,m,dd] = d.split('-'); return `${dd}.${m}.${y}`; };
        const nextDate = new Date(nextDue);
        const now = new Date();
        const diff = (nextDate - now) / (1000*60*60*24);
        const status = diff < 0 ? 'overdue' : diff < 60 ? 'soon' : 'ok';
        this.getActivePet().health.vaccinations.push({
            id: Date.now(), name,
            date: fmt(date), nextDue: fmt(nextDue), status
        });
        this.renderView();
    },

    addHistory(e) {
        e.preventDefault();
        const date = document.getElementById('hist-date').value;
        const title = document.getElementById('hist-title').value;
        const desc = document.getElementById('hist-desc').value;
        const [year, month, day] = date.split('-');
        this.getActivePet().health.history.unshift({
            id: Date.now(),
            date: `${day}.${month}.${year}`,
            title, description: desc
        });
        this.renderView();
    },

    joinWaitlist(e) {
        e.preventDefault();
        const email = document.getElementById('waitlist-email').value;
        const btn = e.target.querySelector('button');
        btn.textContent = '✓ Du bist dabei!';
        btn.style.background = '#1b3d2f';
        document.getElementById('waitlist-email').disabled = true;
        btn.disabled = true;
    },

    openAddPetModal() {
        document.getElementById('add-pet-modal').classList.add('open');
    },

    closeAddPetModal() {
        document.getElementById('add-pet-modal').classList.remove('open');
    },

    // --- Views ---

    views: {

        home: () => `
            <!-- Hero -->
            <section class="hero view-section active">
                <div class="hero-content">
                    <div class="hero-badge"><i class="fa-solid fa-shield-heart"></i> Vertrauenswürdig & sicher</div>
                    <h1>Alles für dein Tier.<br><span class="text-accent">An einem Ort.</span></h1>
                    <p>Verwalte Gesundheitsdaten, Impfungen und Versicherungen deines Haustieres – einfach digital. Für mehr Übersicht und weniger Stress beim Tierarzt.</p>
                    <div class="hero-cta">
                        <button class="btn btn-primary btn-lg" onclick="app.navigate('dashboard')">
                            <i class="fa-solid fa-play"></i> Demo ausprobieren
                        </button>
                        <button class="btn btn-outline btn-lg" onclick="app.scrollToWaitlist()">Auf Warteliste</button>
                    </div>
                    <div class="hero-stats">
                        <div class="stat-item"><h4>100%</h4><p>Kostenlos in Beta</p></div>
                        <div class="stat-item"><h4>24/7</h4><p>Verfügbar</p></div>
                        <div class="stat-item"><h4>DSGVO</h4><p>Konform</p></div>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="assets/hero.png" alt="Glücklicher Hund und Katze">
                    <div class="floating-badge">
                        <i class="fa-solid fa-file-medical"></i>
                        <div>
                            <strong>Gesundheitsakte</strong>
                            <div style="font-size:0.8rem;color:var(--text-muted)">Immer griffbereit</div>
                        </div>
                    </div>
                    <div class="floating-badge-2">
                        <i class="fa-solid fa-bell" style="color:#d9745b"></i>
                        <div>
                            <strong>Impfung fällig</strong>
                            <div style="font-size:0.8rem;color:var(--text-muted)">Leptospirose • Aug 2026</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Social Proof -->
            <section class="social-proof">
                <div class="container">
                    <p class="social-proof-label">Vertraut von Tierhaltern in ganz Deutschland</p>
                    <div class="avatars-row">
                        <div class="avatar-stack">
                            <div class="avatar-circle" style="background:#d9745b">M</div>
                            <div class="avatar-circle" style="background:#5b8cd9">S</div>
                            <div class="avatar-circle" style="background:#1b3d2f">L</div>
                            <div class="avatar-circle" style="background:#9b5bd9">K</div>
                            <div class="avatar-circle" style="background:#d9b45b">T</div>
                        </div>
                        <span><strong>237 Tierhalter</strong> auf der Warteliste</span>
                    </div>
                </div>
            </section>

            <!-- Wie es funktioniert -->
            <section class="how-it-works" id="funktionen">
                <div class="container">
                    <div class="section-header">
                        <span class="section-label">So einfach geht's</span>
                        <h2>In 3 Schritten startklar</h2>
                        <p>Keine App nötig. Direkt im Browser – auf jedem Gerät.</p>
                    </div>
                    <div class="steps-grid">
                        <div class="step-card">
                            <div class="step-number">01</div>
                            <div class="step-icon"><i class="fa-solid fa-paw"></i></div>
                            <h3>Tier anlegen</h3>
                            <p>Erstelle ein Profil für dein Haustier mit Namen, Rasse und Alter. Mehrere Tiere möglich.</p>
                        </div>
                        <div class="step-card">
                            <div class="step-number">02</div>
                            <div class="step-icon"><i class="fa-solid fa-file-circle-plus"></i></div>
                            <h3>Daten eintragen</h3>
                            <p>Impfungen, Versicherungen, Allergien und Arztbesuche – alles an einem zentralen Ort.</p>
                        </div>
                        <div class="step-card">
                            <div class="step-number">03</div>
                            <div class="step-icon"><i class="fa-solid fa-bell"></i></div>
                            <h3>Erinnerungen erhalten</h3>
                            <p>Verpasse nie wieder eine Impfauffrischung. TierTreu erinnert dich automatisch.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features -->
            <section class="features">
                <div class="container">
                    <div class="section-header">
                        <span class="section-label">Funktionen</span>
                        <h2>Alles was du brauchst</h2>
                        <p>Einfach, sicher und übersichtlich.</p>
                    </div>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-file-shield"></i></div>
                            <h3>Versicherungen</h3>
                            <p>Hinterlege alle Policen deiner Tiere. Verträge und Konditionen auf einen Blick.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-syringe"></i></div>
                            <h3>Impfpass</h3>
                            <p>Verpasse keine Auffrischung mehr. Alle Impfungen und Termine übersichtlich.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-notes-medical"></i></div>
                            <h3>Krankenhistorie</h3>
                            <p>Dokumentiere Vorerkrankungen, OPs und Behandlungen chronologisch.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-wheat-awn-circle-exclamation"></i></div>
                            <h3>Allergien</h3>
                            <p>Notiere Unverträglichkeiten für den schnellen Zugriff beim Tierarzt.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-paw"></i></div>
                            <h3>Mehrere Tiere</h3>
                            <p>Verwalte Hunde, Katzen und mehr – alle in einem gemeinsamen Dashboard.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-mobile-screen"></i></div>
                            <h3>Mobile-First</h3>
                            <p>Funktioniert auf jedem Gerät – egal ob Handy, Tablet oder Desktop.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Testimonials -->
            <section class="testimonials">
                <div class="container">
                    <div class="section-header">
                        <span class="section-label">Stimmen aus der Beta</span>
                        <h2>Was Tierhalter sagen</h2>
                    </div>
                    <div class="testimonials-grid">
                        <div class="testimonial-card">
                            <div class="stars">★★★★★</div>
                            <p>"Endlich keine Papierstapel mehr! Beim letzten Tierarztbesuch hatte ich alle Impfinfos sofort auf dem Handy."</p>
                            <div class="testimonial-author">
                                <div class="avatar-circle" style="background:#d9745b;width:40px;height:40px;font-size:1rem">M</div>
                                <div><strong>Maria K.</strong><br><span>Hundebesitzerin, Hamburg</span></div>
                            </div>
                        </div>
                        <div class="testimonial-card">
                            <div class="stars">★★★★★</div>
                            <p>"Ich habe zwei Katzen und einen Hund. TierTreu ist das erste Tool das wirklich alle drei übersichtlich verwaltet."</p>
                            <div class="testimonial-author">
                                <div class="avatar-circle" style="background:#5b8cd9;width:40px;height:40px;font-size:1rem">T</div>
                                <div><strong>Thomas R.</strong><br><span>Mehrfach-Tierhalter, München</span></div>
                            </div>
                        </div>
                        <div class="testimonial-card">
                            <div class="stars">★★★★★</div>
                            <p>"Die Versicherungsübersicht ist Gold wert. Ich wusste gar nicht mehr welche Police noch aktiv war."</p>
                            <div class="testimonial-author">
                                <div class="avatar-circle" style="background:#1b3d2f;width:40px;height:40px;font-size:1rem">L</div>
                                <div><strong>Laura S.</strong><br><span>Katzenbesitzerin, Berlin</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Waitlist -->
            <section class="waitlist-section" id="waitlist">
                <div class="container">
                    <div class="waitlist-box">
                        <div class="waitlist-content">
                            <span class="section-label" style="color:#d9745b">Früher Zugang</span>
                            <h2 style="color:white">Jetzt auf die Warteliste</h2>
                            <p style="color:#94a3b8">Sei einer der Ersten wenn TierTreu startet. Frühzeitig anmelden und dauerhaft kostenlos nutzen.</p>
                            <ul class="waitlist-perks">
                                <li><i class="fa-solid fa-check"></i> Kostenloser Früh-Zugang</li>
                                <li><i class="fa-solid fa-check"></i> Alle Features inklusive</li>
                                <li><i class="fa-solid fa-check"></i> Kein Spam, jederzeit abmeldbar</li>
                            </ul>
                        </div>
                        <form class="waitlist-form" onsubmit="app.joinWaitlist(event)">
                            <div class="form-group">
                                <input type="email" id="waitlist-email" class="form-control" placeholder="deine@email.de" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-lg" style="width:100%">
                                <i class="fa-solid fa-envelope"></i> Auf Warteliste eintragen
                            </button>
                            <p style="font-size:0.8rem;color:#64748b;margin-top:0.75rem;text-align:center">
                                <i class="fa-solid fa-lock" style="margin-right:4px"></i>Deine Daten sind sicher. DSGVO-konform.
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        `,

        dashboard: () => {
            const pet = app.getActivePet();
            const pets = app.state.userPets;

            const vacStatus = (status) => {
                if (status === 'overdue') return '<span class="badge badge-red">Überfällig</span>';
                if (status === 'soon') return '<span class="badge badge-yellow">Bald fällig</span>';
                return '<span class="badge badge-green">Aktuell</span>';
            };

            return `
            <div class="dashboard-wrapper view-section active">

                <!-- Demo Banner -->
                <div class="demo-banner">
                    <i class="fa-solid fa-flask"></i>
                    <strong>Demo-Modus</strong> – Du siehst Beispieldaten. Alle Änderungen bleiben nur in dieser Sitzung gespeichert.
                    <button class="btn btn-outline btn-sm" onclick="app.scrollToWaitlist()" style="margin-left:auto">Echten Zugang sichern</button>
                </div>

                <div class="container">
                    <div class="dashboard-layout">

                        <!-- Sidebar -->
                        <aside class="pet-sidebar">

                            <!-- Pet Switcher -->
                            <div class="sidebar-section">
                                <h4 class="sidebar-label">Meine Tiere</h4>
                                <div class="pet-list">
                                    ${pets.map(p => `
                                        <div class="pet-pill ${p.id === pet.id ? 'active' : ''}" onclick="app.selectPet(${p.id})">
                                            <div class="pet-pill-avatar" style="background:${p.color}">${app.getPetInitial(p)}</div>
                                            <div>
                                                <div class="pet-pill-name">${p.name}</div>
                                                <div class="pet-pill-breed">${p.breed}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                    <button class="add-pet-btn" onclick="app.openAddPetModal()">
                                        <i class="fa-solid fa-plus"></i> Tier hinzufügen
                                    </button>
                                </div>
                            </div>

                            <!-- Active Pet Card -->
                            <div class="pet-profile-card">
                                <div class="pet-avatar-large" style="background:${pet.color}">${app.getPetInitial(pet)}</div>
                                <div class="pet-profile-info">
                                    <h3>${pet.name}</h3>
                                    <p>${pet.breed}</p>
                                    <div class="pet-tags">
                                        <span class="pet-tag"><i class="fa-solid fa-paw"></i> ${pet.type}</span>
                                        <span class="pet-tag"><i class="fa-solid fa-cake-candles"></i> ${pet.age} Jahre</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Quick Stats -->
                            <div class="quick-stats">
                                <div class="quick-stat">
                                    <div class="quick-stat-val">${pet.insurances.length}</div>
                                    <div class="quick-stat-label">Versicherung(en)</div>
                                </div>
                                <div class="quick-stat">
                                    <div class="quick-stat-val">${pet.health.vaccinations.length}</div>
                                    <div class="quick-stat-label">Impfungen</div>
                                </div>
                                <div class="quick-stat">
                                    <div class="quick-stat-val">${pet.health.history.length}</div>
                                    <div class="quick-stat-label">Einträge</div>
                                </div>
                            </div>

                            <!-- Insurances -->
                            <div class="dashboard-panel">
                                <div class="panel-header">
                                    <h3><i class="fa-solid fa-file-shield"></i> Versicherungen</h3>
                                </div>
                                <div class="data-list">
                                    ${pet.insurances.length === 0 ? '<p class="empty-state">Noch keine Versicherung eingetragen.</p>' : ''}
                                    ${pet.insurances.map(ins => `
                                        <div class="data-item card-style">
                                            <div style="font-weight:600;color:var(--primary)">${ins.provider}</div>
                                            <div style="font-size:0.85rem;color:var(--text-muted)">${ins.type}</div>
                                            <div style="font-size:0.8rem;margin-top:0.25rem;font-family:monospace">Police: ${ins.policyNumber}</div>
                                        </div>
                                    `).join('')}
                                </div>
                                <details class="add-form-toggle">
                                    <summary>+ Versicherung hinzufügen</summary>
                                    <form onsubmit="app.addInsurance(event)" class="simple-form" style="margin-top:1rem">
                                        <input type="text" id="ins-provider" class="form-control form-sm" placeholder="Anbieter (z.B. Agila)" required>
                                        <input type="text" id="ins-type" class="form-control form-sm" placeholder="Tarif (z.B. OP-Schutz)" required>
                                        <input type="text" id="ins-policy" class="form-control form-sm" placeholder="Vertragsnummer" required>
                                        <button type="submit" class="btn btn-primary btn-sm" style="width:100%">Speichern</button>
                                    </form>
                                </details>
                            </div>
                        </aside>

                        <!-- Main -->
                        <main class="dashboard-main">
                            <div class="dashboard-header">
                                <div>
                                    <h2>Akte von ${pet.name}</h2>
                                    <p style="color:var(--text-muted)">${pet.breed} · ${pet.age} Jahre · ${pet.type}</p>
                                </div>
                            </div>

                            <!-- Allergies + Vaccinations row -->
                            <div class="two-col-grid">
                                <!-- Allergies -->
                                <div class="dashboard-panel">
                                    <div class="panel-header">
                                        <h3><i class="fa-solid fa-wheat-awn-circle-exclamation"></i> Allergien & Unverträglichkeiten</h3>
                                    </div>
                                    <div class="pill-container" style="margin-bottom:1.5rem">
                                        ${pet.health.allergies.length === 0 ? '<p class="empty-state">Keine bekannten Allergien.</p>' : ''}
                                        ${pet.health.allergies.map((alg, i) => `
                                            <span class="pill">
                                                ${alg}
                                                <span class="pill-remove" onclick="app.removeAllergy(${i})" title="Entfernen">×</span>
                                            </span>
                                        `).join('')}
                                    </div>
                                    <form onsubmit="app.addAllergy(event)" style="display:flex;gap:0.5rem">
                                        <input type="text" id="allergy-input" class="form-control form-sm" placeholder="Neue Allergie" required>
                                        <button type="submit" class="btn btn-secondary btn-sm"><i class="fa-solid fa-plus"></i></button>
                                    </form>
                                </div>

                                <!-- Vaccinations -->
                                <div class="dashboard-panel">
                                    <div class="panel-header">
                                        <h3><i class="fa-solid fa-syringe"></i> Impfungen</h3>
                                    </div>
                                    <div class="data-list" style="margin-bottom:1.5rem">
                                        ${pet.health.vaccinations.length === 0 ? '<p class="empty-state">Noch keine Impfungen eingetragen.</p>' : ''}
                                        ${pet.health.vaccinations.map(vac => `
                                            <div class="data-item card-style">
                                                <div style="display:flex;justify-content:space-between;align-items:center">
                                                    <span style="font-weight:600">${vac.name}</span>
                                                    ${vacStatus(vac.status)}
                                                </div>
                                                <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-muted);margin-top:0.35rem">
                                                    <span>Geimpft: ${vac.date}</span>
                                                    <span>Nächste: ${vac.nextDue}</span>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <details class="add-form-toggle">
                                        <summary>+ Impfung hinzufügen</summary>
                                        <form onsubmit="app.addVaccination(event)" class="simple-form" style="margin-top:1rem">
                                            <input type="text" id="vac-name" class="form-control form-sm" placeholder="Impfstoff (z.B. Tollwut)" required>
                                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
                                                <div><label style="font-size:0.8rem;color:var(--text-muted)">Geimpft am</label>
                                                <input type="date" id="vac-date" class="form-control form-sm" required></div>
                                                <div><label style="font-size:0.8rem;color:var(--text-muted)">Nächste Fälligkeit</label>
                                                <input type="date" id="vac-next" class="form-control form-sm" required></div>
                                            </div>
                                            <button type="submit" class="btn btn-primary btn-sm" style="width:100%">Speichern</button>
                                        </form>
                                    </details>
                                </div>
                            </div>

                            <!-- Medical History -->
                            <div class="dashboard-panel">
                                <div class="panel-header">
                                    <h3><i class="fa-solid fa-notes-medical"></i> Krankenhistorie & OPs</h3>
                                </div>
                                <form onsubmit="app.addHistory(event)" class="history-form">
                                    <input type="date" id="hist-date" class="form-control form-sm" required>
                                    <input type="text" id="hist-title" class="form-control form-sm" placeholder="Diagnose / Eingriff" required>
                                    <input type="text" id="hist-desc" class="form-control form-sm" placeholder="Notizen (Behandlung, Medikamente)" required>
                                    <button type="submit" class="btn btn-primary btn-sm">Eintragen</button>
                                </form>
                                ${pet.health.history.length === 0 ? '<p class="empty-state" style="margin-top:1.5rem">Noch keine Einträge.</p>' : ''}
                                <div class="timeline">
                                    ${pet.health.history.map(hist => `
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-date">${hist.date}</div>
                                            <div class="timeline-content card-style">
                                                <h4>${hist.title}</h4>
                                                <p>${hist.description}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                        </main>
                    </div>
                </div>
            </div>

            <!-- Add Pet Modal -->
            <div class="modal-overlay" id="add-pet-modal" onclick="if(event.target===this) app.closeAddPetModal()">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Neues Tier hinzufügen</h3>
                        <button class="modal-close" onclick="app.closeAddPetModal()">×</button>
                    </div>
                    <form onsubmit="app.addPet(event)" class="simple-form">
                        <input type="text" id="new-pet-name" class="form-control" placeholder="Name (z.B. Luna)" required>
                        <select id="new-pet-type" class="form-control">
                            <option value="Hund">Hund</option>
                            <option value="Katze">Katze</option>
                            <option value="Vogel">Vogel</option>
                            <option value="Kaninchen">Kaninchen</option>
                            <option value="Sonstiges">Sonstiges</option>
                        </select>
                        <input type="text" id="new-pet-breed" class="form-control" placeholder="Rasse (z.B. Labrador)" required>
                        <input type="number" id="new-pet-age" class="form-control" placeholder="Alter (Jahre)" min="0" max="30">
                        <button type="submit" class="btn btn-primary" style="width:100%">Tier anlegen</button>
                    </form>
                </div>
            </div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
