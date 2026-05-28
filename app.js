// TierTreu - App Logic

const app = {
    state: {
        currentView: 'home',
        petType: 'hund', // hund | katze
        calc: {
            age: 2,
            sb: 150,
            limit: 2000
        },
        userPets: [
            {
                id: 1,
                name: 'Luna',
                type: 'Hund',
                breed: 'Golden Retriever',
                age: 3,
                avatar: 'assets/pet_profile.png',
                policy: 'TierTreu Premium',
                claims: [
                    { id: 101, date: '12.05.2026', type: 'Impfung & Check-up', amount: '125,50 €', status: 'approved' },
                    { id: 102, date: '03.02.2026', type: 'Ohrinfektion', amount: '89,00 €', status: 'approved' }
                ]
            }
        ]
    },

    init() {
        this.renderView();
        window.addEventListener('popstate', () => {
            // handle back button if using history API, for simplicity we just render
        });
    },

    navigate(view) {
        this.state.currentView = view;
        this.renderView();
        window.scrollTo(0, 0);
        
        // Update nav active state
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if(link.textContent.toLowerCase().includes(view) || 
               (view === 'calculator' && link.textContent === 'Tarifrechner') ||
               (view === 'dashboard' && link.textContent === 'Verwaltung')) {
                link.classList.add('active');
            }
        });
    },

    renderView() {
        const root = document.getElementById('app-root');
        
        switch(this.state.currentView) {
            case 'home':
                root.innerHTML = this.views.home();
                break;
            case 'calculator':
                root.innerHTML = this.views.calculator();
                this.attachCalcListeners();
                this.updatePrice();
                break;
            case 'dashboard':
                root.innerHTML = this.views.dashboard();
                break;
            default:
                root.innerHTML = this.views.home();
        }
    },

    updatePrice() {
        // Simple mock calculation logic
        let base = this.state.petType === 'hund' ? 25 : 15;
        let ageMultiplier = 1 + (this.state.calc.age * 0.05);
        let sbDiscount = this.state.calc.sb > 0 ? (this.state.calc.sb / 1000) * 10 : 0;
        let limitPremium = (this.state.calc.limit / 1000) * 2;
        
        let total = (base * ageMultiplier) - sbDiscount + limitPremium;
        if(total < 9.90) total = 9.90;

        const priceElement = document.getElementById('calc-price');
        if(priceElement) {
            priceElement.innerText = total.toFixed(2).replace('.', ',');
        }
    },

    attachCalcListeners() {
        document.getElementById('pet-hund').addEventListener('click', () => {
            this.state.petType = 'hund';
            document.getElementById('pet-hund').classList.add('selected');
            document.getElementById('pet-katze').classList.remove('selected');
            this.updatePrice();
        });
        
        document.getElementById('pet-katze').addEventListener('click', () => {
            this.state.petType = 'katze';
            document.getElementById('pet-katze').classList.add('selected');
            document.getElementById('pet-hund').classList.remove('selected');
            this.updatePrice();
        });

        document.getElementById('calc-age').addEventListener('input', (e) => {
            this.state.calc.age = parseInt(e.target.value);
            document.getElementById('age-val').innerText = this.state.calc.age + ' Jahre';
            this.updatePrice();
        });

        document.getElementById('calc-sb').addEventListener('input', (e) => {
            this.state.calc.sb = parseInt(e.target.value);
            document.getElementById('sb-val').innerText = this.state.calc.sb + ' €';
            this.updatePrice();
        });

        document.getElementById('calc-limit').addEventListener('input', (e) => {
            this.state.calc.limit = parseInt(e.target.value);
            document.getElementById('limit-val').innerText = this.state.calc.limit === 5000 ? 'Unbegrenzt' : this.state.calc.limit + ' €';
            this.updatePrice();
        });
    },
    
    submitClaim(e) {
        e.preventDefault();
        const input = document.getElementById('claim-reason');
        const amount = document.getElementById('claim-amount');
        
        if(input.value && amount.value) {
            this.state.userPets[0].claims.unshift({
                id: Math.floor(Math.random() * 1000) + 200,
                date: new Date().toLocaleDateString('de-DE'),
                type: input.value,
                amount: amount.value + ' €',
                status: 'pending'
            });
            input.value = '';
            amount.value = '';
            this.renderView(); // Re-render dashboard
            
            alert('Rechnung erfolgreich eingereicht! Wir prüfen den Vorgang.');
        }
    },

    views: {
        home: () => `
            <section class="hero view-section active">
                <div class="hero-content">
                    <h1>Weil dein bester Freund nur das Beste verdient.</h1>
                    <p>Sichere die Gesundheit deines Haustieres mit TierTreu ab. Transparente Tarife, schnelle Auszahlung und freie Tierarztwahl – alles komplett digital.</p>
                    <button class="btn btn-primary" onclick="app.navigate('calculator')">Jetzt Tarif berechnen</button>
                    
                    <div class="hero-stats">
                        <div class="stat-item">
                            <h4>24h</h4>
                            <p>Schadensabwicklung</p>
                        </div>
                        <div class="stat-item">
                            <h4>100%</h4>
                            <p>Kostenübernahme</p>
                        </div>
                        <div class="stat-item">
                            <h4>50k+</h4>
                            <p>Geschützte Tiere</p>
                        </div>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="assets/hero.png" alt="Glücklicher Hund und Katze">
                    <div class="floating-badge">
                        <i class="fa-solid fa-shield-cat"></i>
                        <div>
                            <strong>Sofortschutz</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted)">Ohne Wartezeit</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="features">
                <div class="container">
                    <div style="text-align: center; margin-bottom: 3rem;">
                        <h2>Warum TierTreu?</h2>
                        <p style="color: var(--text-muted)">Versicherung, die sich an dich und dein Tier anpasst.</p>
                    </div>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-stethoscope"></i></div>
                            <h3>Freie Tierarztwahl</h3>
                            <p>Egal ob Haus-Tierarzt oder Spezialklinik – du entscheidest, wo dein Liebling behandelt wird.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-bolt"></i></div>
                            <h3>Schnelle Erstattung</h3>
                            <p>Reiche Rechnungen per App ein. Wir erstatten in der Regel innerhalb von 48 Stunden.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-mobile-screen"></i></div>
                            <h3>Digitale Gesundheitsakte</h3>
                            <p>Behalte Impfungen, Chip-Nummer und Tierarztbesuche bequem im digitalen Dashboard im Blick.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fa-solid fa-heart-pulse"></i></div>
                            <h3>Vorsorgeschutz inklusive</h3>
                            <p>Impfungen, Wurmkuren und Zeckenschutz werden bis zu 100€ im Jahr übernommen.</p>
                        </div>
                    </div>
                </div>
            </section>
        `,
        calculator: () => `
            <div class="container view-section active">
                <div class="calc-container">
                    <div class="calc-header">
                        <h2>Finde den passenden Tarif</h2>
                        <p>In nur wenigen Klicks zum optimalen Schutz.</p>
                    </div>

                    <div class="pet-type-selector">
                        <div class="pet-type-card ${app.state.petType === 'hund' ? 'selected' : ''}" id="pet-hund">
                            <i class="fa-solid fa-dog"></i>
                            <h3>Hund</h3>
                        </div>
                        <div class="pet-type-card ${app.state.petType === 'katze' ? 'selected' : ''}" id="pet-katze">
                            <i class="fa-solid fa-cat"></i>
                            <h3>Katze</h3>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Alter des Tieres: <span id="age-val" style="color: var(--text-main); font-weight: 400;">${app.state.calc.age} Jahre</span></label>
                        <div class="slider-container">
                            <input type="range" id="calc-age" min="0" max="15" value="${app.state.calc.age}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Selbstbeteiligung (pro Jahr): <span id="sb-val" style="color: var(--text-main); font-weight: 400;">${app.state.calc.sb} €</span></label>
                        <div class="slider-container">
                            <input type="range" id="calc-sb" min="0" max="500" step="50" value="${app.state.calc.sb}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Jahreshöchstgrenze für OP & Heilbehandlung: <span id="limit-val" style="color: var(--text-main); font-weight: 400;">${app.state.calc.limit} €</span></label>
                        <div class="slider-container">
                            <input type="range" id="calc-limit" min="1000" max="5000" step="1000" value="${app.state.calc.limit}">
                        </div>
                        <small style="color: var(--text-muted); display: block; margin-top: 0.5rem;">5000 € entspricht unbegrenzter Deckung.</small>
                    </div>

                    <div class="price-result">
                        <p style="text-transform: uppercase; letter-spacing: 1px; font-size: 0.875rem;">Dein monatlicher Beitrag</p>
                        <div class="price-amount"><span id="calc-price">24,50</span><span> € / Monat</span></div>
                        <button class="btn btn-secondary" style="background: white; border: none;" onclick="app.navigate('dashboard')">Jetzt abschließen & zum Dashboard</button>
                    </div>
                </div>
            </div>
        `,
        dashboard: () => {
            const pet = app.state.userPets[0];
            return `
            <div class="container view-section active dashboard">
                <div class="dashboard-header">
                    <div>
                        <h2>Versicherungsverwaltung</h2>
                        <p style="color: var(--text-muted)">Willkommen zurück, verwalte hier die Daten und Rechnungen deiner Tiere.</p>
                    </div>
                    <button class="btn btn-outline"><i class="fa-solid fa-plus"></i> Neues Tier hinzufügen</button>
                </div>

                <div class="dashboard-grid">
                    <aside class="pet-sidebar">
                        <div class="pet-card">
                            <img src="${pet.avatar}" alt="${pet.name}" class="pet-avatar">
                            <div class="pet-info">
                                <h3>${pet.name}</h3>
                                <p>${pet.breed} • ${pet.age} Jahre</p>
                                <div style="margin-top: 1rem; display: inline-block; padding: 0.25rem 1rem; background: rgba(27, 61, 47, 0.1); color: var(--primary); border-radius: var(--radius-pill); font-size: 0.875rem; font-weight: 600;">
                                    ${pet.policy}
                                </div>
                            </div>
                            
                            <div class="health-status">
                                <div class="status-item">
                                    <i class="fa-solid fa-syringe"></i>
                                    <span style="font-size: 0.75rem;">Impfung OK</span>
                                </div>
                                <div class="status-item">
                                    <i class="fa-solid fa-microchip"></i>
                                    <span style="font-size: 0.75rem;">Gechipt</span>
                                </div>
                            </div>
                        </div>

                        <div class="dashboard-panel">
                            <div class="panel-header" style="margin-bottom: 1rem; padding-bottom: 0.5rem;">
                                <h3 style="font-size: 1.1rem; margin: 0;">Vertragsdetails</h3>
                            </div>
                            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem;">
                                <li style="display: flex; justify-content: space-between;">
                                    <span style="color: var(--text-muted)">Vertragsnummer:</span>
                                    <strong>TT-2026-8941</strong>
                                </li>
                                <li style="display: flex; justify-content: space-between;">
                                    <span style="color: var(--text-muted)">Selbstbeteiligung:</span>
                                    <strong>150 € / Jahr</strong>
                                </li>
                                <li style="display: flex; justify-content: space-between;">
                                    <span style="color: var(--text-muted)">Zahlweise:</span>
                                    <strong>Monatlich (SEPA)</strong>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    <main class="dashboard-main">
                        <div class="dashboard-panel">
                            <div class="panel-header">
                                <h3 style="margin: 0;">Rechnung einreichen (Simulator)</h3>
                            </div>
                            <form onsubmit="app.submitClaim(event)">
                                <div class="form-group">
                                    <label>Behandlung / Diagnose</label>
                                    <input type="text" id="claim-reason" class="form-control" placeholder="z.B. Vorsorgeuntersuchung, Röntgen, ..." required>
                                </div>
                                <div class="form-group" style="display: flex; gap: 1rem; align-items: flex-end;">
                                    <div style="flex: 1;">
                                        <label>Rechnungsbetrag (€)</label>
                                        <input type="number" step="0.01" id="claim-amount" class="form-control" placeholder="125.50" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary" style="height: 50px;">Einreichen</button>
                                </div>
                            </form>
                        </div>

                        <div class="dashboard-panel">
                            <div class="panel-header">
                                <h3 style="margin: 0;">Vergangene Rechnungen</h3>
                                <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Alle ansehen</button>
                            </div>
                            <div class="claims-list">
                                ${pet.claims.map(claim => `
                                    <div class="claim-item">
                                        <div class="claim-info">
                                            <div class="claim-icon"><i class="fa-solid ${claim.status === 'pending' ? 'fa-clock' : 'fa-check'}"></i></div>
                                            <div>
                                                <div style="font-weight: 600;">${claim.type}</div>
                                                <div style="font-size: 0.875rem; color: var(--text-muted)">${claim.date}</div>
                                            </div>
                                        </div>
                                        <div style="text-align: right;">
                                            <div style="font-weight: 600; margin-bottom: 0.25rem;">${claim.amount}</div>
                                            <div class="claim-status status-${claim.status}">
                                                ${claim.status === 'approved' ? 'Erstattet' : 'In Prüfung'}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            `;
        }
    }
};

// Start app
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
