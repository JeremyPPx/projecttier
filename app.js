// TierTreu - App Logic

const app = {
    state: {
        currentView: 'home',
        userPets: [
            {
                id: 1,
                name: 'Luna',
                type: 'Hund',
                breed: 'Golden Retriever',
                age: 3,
                avatar: 'assets/pet_profile.png',
                insurances: [
                    { id: 10, provider: 'Agila', type: 'Krankenvollschutz', policyNumber: 'AG-129381' }
                ],
                health: {
                    vaccinations: [
                        { id: 20, name: 'Tollwut', date: '12.05.2025', nextDue: '12.05.2028' },
                        { id: 21, name: 'Leptospirose', date: '10.08.2025', nextDue: '10.08.2026' }
                    ],
                    allergies: ['Rindfleisch', 'Pollen'],
                    history: [
                        { id: 30, date: '03.02.2026', title: 'Ohrinfektion', description: 'Behandlung mit Tropfen (Surolan) für 7 Tage.' },
                        { id: 31, date: '15.11.2025', title: 'Kastration', description: 'Routinemäßiger Eingriff, ohne Komplikationen.' }
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
            if(link.textContent.toLowerCase() === (view === 'home' ? 'startseite' : view)) {
                link.classList.add('active');
            }
        });
    },

    renderView() {
        const root = document.getElementById('app-root');
        if(this.state.currentView === 'home') {
            root.innerHTML = this.views.home();
        } else if (this.state.currentView === 'dashboard') {
            root.innerHTML = this.views.dashboard();
        }
    },

    // --- Actions ---
    
    addInsurance(e) {
        e.preventDefault();
        const provider = document.getElementById('ins-provider').value;
        const type = document.getElementById('ins-type').value;
        const policyNumber = document.getElementById('ins-policy').value;
        
        this.state.userPets[0].insurances.push({
            id: Date.now(),
            provider,
            type,
            policyNumber
        });
        this.renderView();
    },

    addAllergy(e) {
        e.preventDefault();
        const allergy = document.getElementById('allergy-input').value;
        if(allergy) {
            this.state.userPets[0].health.allergies.push(allergy);
            this.renderView();
        }
    },

    addHistory(e) {
        e.preventDefault();
        const date = document.getElementById('hist-date').value;
        const title = document.getElementById('hist-title').value;
        const desc = document.getElementById('hist-desc').value;
        
        // Format date to DD.MM.YYYY
        const [year, month, day] = date.split('-');
        const formattedDate = \`\${day}.\${month}.\${year}\`;

        this.state.userPets[0].health.history.unshift({
            id: Date.now(),
            date: formattedDate,
            title: title,
            description: desc
        });
        this.renderView();
    },

    // --- Views ---

    views: {
        home: () => \`
            <section class="hero view-section active">
                <div class="hero-content">
                    <h1>Alle Dokumente an einem Ort.</h1>
                    <p>Verwalte die Gesundheitsdaten, Impfungen und bestehenden Versicherungen deines Haustieres ganz einfach digital. Für mehr Übersicht im Alltag.</p>
                    <button class="btn btn-primary" onclick="app.navigate('dashboard')">Zum Dashboard</button>
                    
                    <div class="hero-stats">
                        <div class="stat-item">
                            <h4>100%</h4>
                            <p>Übersichtlich</p>
                        </div>
                        <div class="stat-item">
                            <h4>24/7</h4>
                            <p>Verfügbar</p>
                        </div>
                        <div class="stat-item">
                            <h4>Digital</h4>
                            <p>Gesundheitsakte</p>
                        </div>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="assets/hero.png" alt="Glücklicher Hund und Katze">
                    <div class="floating-badge">
                        <i class="fa-solid fa-file-medical"></i>
                        <div>
                            <strong>Gesundheitsakte</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted)">Immer griffbereit</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="features">
                <div class="container">
                    <div style="text-align: center; margin-bottom: 3rem;">
                        <h2>Funktionen</h2>
                        <p style="color: var(--text-muted)">Einfach, sicher und übersichtlich.</p>
                    </div>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-file-shield"></i></div>
                            <h3>Versicherungen managen</h3>
                            <p>Hinterlege alle Policen deiner Tiere. Verträge und Konditionen auf einen Blick.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-syringe"></i></div>
                            <h3>Impfpass</h3>
                            <p>Verpasse keine Auffrischung mehr. Übersicht aller Impfungen und Termine.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-notes-medical"></i></div>
                            <h3>Krankenhistorie</h3>
                            <p>Dokumentiere Vorerkrankungen, OPs und Behandlungen übersichtlich chronologisch.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-wheat-awn-circle-exclamation"></i></div>
                            <h3>Allergien</h3>
                            <p>Notiere Unverträglichkeiten und Allergien für den schnellen Zugriff beim Tierarzt.</p>
                        </div>
                    </div>
                </div>
            </section>
        \`,

        dashboard: () => {
            const pet = app.state.userPets[0];
            
            return \`
            <div class="container view-section active dashboard">
                <div class="dashboard-header">
                    <div>
                        <h2>Tier-Management</h2>
                        <p style="color: var(--text-muted)">Akte für \${pet.name} verwalten.</p>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <aside class="pet-sidebar">
                        <div class="pet-card">
                            <img src="\${pet.avatar}" alt="\${pet.name}" class="pet-avatar">
                            <div class="pet-info">
                                <h3>\${pet.name}</h3>
                                <p>\${pet.breed} • \${pet.age} Jahre</p>
                            </div>
                        </div>

                        <!-- Insurance List -->
                        <div class="dashboard-panel">
                            <div class="panel-header">
                                <h3>Versicherungen</h3>
                            </div>
                            <div class="data-list">
                                \${pet.insurances.map(ins => \`
                                    <div class="data-item card-style">
                                        <div style="font-weight: 600; color: var(--primary)">\${ins.provider}</div>
                                        <div style="font-size: 0.85rem; color: var(--text-muted)">\${ins.type}</div>
                                        <div style="font-size: 0.85rem; margin-top: 0.25rem;">Police: \${ins.policyNumber}</div>
                                    </div>
                                \`).join('')}
                            </div>
                            
                            <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 0.9rem;">Hinzufügen</h4>
                            <form onsubmit="app.addInsurance(event)" class="simple-form">
                                <input type="text" id="ins-provider" class="form-control form-sm" placeholder="Anbieter (z.B. Agila)" required>
                                <input type="text" id="ins-type" class="form-control form-sm" placeholder="Tarif (z.B. OP-Schutz)" required>
                                <input type="text" id="ins-policy" class="form-control form-sm" placeholder="Vertragsnummer" required>
                                <button type="submit" class="btn btn-primary btn-sm" style="width:100%">Speichern</button>
                            </form>
                        </div>
                    </aside>

                    <main class="dashboard-main">
                        <!-- Allergies & Vaccinations Grid -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                            
                            <div class="dashboard-panel">
                                <div class="panel-header">
                                    <h3>Allergien & Unverträglichkeiten</h3>
                                </div>
                                <div class="pill-container" style="margin-bottom: 1.5rem;">
                                    \${pet.health.allergies.map(alg => \`<span class="pill">\${alg}</span>\`).join('')}
                                </div>
                                <form onsubmit="app.addAllergy(event)" style="display: flex; gap: 0.5rem;">
                                    <input type="text" id="allergy-input" class="form-control form-sm" placeholder="Neue Allergie" required>
                                    <button type="submit" class="btn btn-secondary btn-sm"><i class="fa-solid fa-plus"></i></button>
                                </form>
                            </div>

                            <div class="dashboard-panel">
                                <div class="panel-header">
                                    <h3>Impfungen</h3>
                                </div>
                                <div class="data-list">
                                    \${pet.health.vaccinations.map(vac => \`
                                        <div class="data-item card-style">
                                            <div style="font-weight: 600;">\${vac.name}</div>
                                            <div style="display:flex; justify-content:space-between; font-size: 0.85rem; color: var(--text-muted); margin-top:0.25rem;">
                                                <span>Geimpft: \${vac.date}</span>
                                                <span style="color: var(--accent); font-weight: 600;">Fällig: \${vac.nextDue}</span>
                                            </div>
                                        </div>
                                    \`).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Medical History -->
                        <div class="dashboard-panel">
                            <div class="panel-header">
                                <h3>Krankenhistorie & OPs</h3>
                            </div>
                            
                            <form onsubmit="app.addHistory(event)" class="simple-form horizontal-form" style="margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border)">
                                <input type="date" id="hist-date" class="form-control form-sm" required>
                                <input type="text" id="hist-title" class="form-control form-sm" placeholder="Diagnose / Eingriff" required>
                                <input type="text" id="hist-desc" class="form-control form-sm" placeholder="Notizen (Behandlung, Medis)" style="flex:2" required>
                                <button type="submit" class="btn btn-primary btn-sm">Eintragen</button>
                            </form>

                            <div class="timeline">
                                \${pet.health.history.map(hist => \`
                                    <div class="timeline-item">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-date">\${hist.date}</div>
                                        <div class="timeline-content card-style">
                                            <h4>\${hist.title}</h4>
                                            <p>\${hist.description}</p>
                                        </div>
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            \`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
