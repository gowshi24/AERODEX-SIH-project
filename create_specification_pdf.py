import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and stamp total page numbers,
    running top header, and official institutional footer on all pages.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        # A4: 595.27 x 841.89 pt. Printable width: 595.27 - 80 = 515.27 pt.
        if self._pageNumber == 1:
            self.saveState()
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#002B49"))
            self.drawString(40, 24, "AERODEX NATIONAL AIRFARE PRICE INDEX (APIx) • SIH 2026 (SIH26056)")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(555, 24, f"Page {self._pageNumber} of {page_count}")
            self.restoreState()
            return

        self.saveState()
        # Running Top Header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#002B49"))
        self.drawString(40, 810, "AERODEX: National Airfare Price Index & Real-Time Intelligence Platform")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawRightString(555, 810, "Technical Specification, Workflow & Algorithms")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(40, 804, 555, 804)

        # Running Bottom Footer
        self.line(40, 36, 555, 36)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(40, 24, "Ministry of Statistics & Programme Implementation (MoSPI) • DGCA • RBI MPC")
        self.setFont("Helvetica-Bold", 8)
        self.drawRightString(555, 24, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_pdf(filename="AERODEX_Comprehensive_Platform_Specification.pdf"):
    pdf_path = os.path.abspath(filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    # Premium Curated Color Palette
    PRIMARY = colors.HexColor("#002B49")     # Deep Navy
    SECONDARY = colors.HexColor("#1E3A8A")   # Royal Blue
    TEAL = colors.HexColor("#0D9488")        # Emerald / Teal Accent
    DARK = colors.HexColor("#0F172A")        # Dark Slate Charcoal
    MUTED = colors.HexColor("#475569")       # Cool Grey
    LIGHT_BG = colors.HexColor("#F8FAFC")    # Background Neutral
    CARD_BG = colors.HexColor("#F1F5F9")     # Box Fill
    BORDER_CLR = colors.HexColor("#CBD5E1")  # Border Line
    AMBER = colors.HexColor("#D97706")       # Warning / Alert
    GREEN = colors.HexColor("#15803D")       # Success Green

    # Typography Hierarchy
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=SECONDARY,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=SECONDARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=DARK,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-9,
        spaceAfter=3
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.8,
        textColor=DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Helvetica-Bold',
        textColor=PRIMARY
    )

    table_cell_center = ParagraphStyle(
        'TableCellCenter',
        parent=table_cell,
        alignment=1
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white,
        alignment=1
    )

    formula_style = ParagraphStyle(
        'FormulaText',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8.5,
        leading=12,
        textColor=PRIMARY
    )

    formula_desc = ParagraphStyle(
        'FormulaDesc',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.8,
        leading=10.5,
        textColor=MUTED
    )

    story = []

    # =========================================================================
    # HEADER BANNER & TITLE
    # =========================================================================
    banner_data = [
        [
            Paragraph("<b>SMART INDIA HACKATHON 2026 • OFFICIAL PLATFORM SPECIFICATION</b>", ParagraphStyle('B1', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=TEAL)),
            Paragraph("<b>PROBLEM STATEMENT: SIH26056</b>", ParagraphStyle('B2', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=PRIMARY, alignment=2))
        ]
    ]
    banner_table = Table(banner_data, colWidths=[340, 175])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('LINEBELOW', (0,0), (-1,-1), 1, TEAL),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("AERODEX", title_style))
    story.append(Paragraph("<b>National Airfare Price Index (APIx) & Real-Time Intelligence Platform</b><br/><font size='8.5' color='#475569'>Comprehensive System Architecture, Operational Workflow, Feature Matrix & Mathematical Algorithms</font>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.2, color=PRIMARY, spaceAfter=8))

    # Metadata Executive Summary Box
    meta_data = [
        [
            Paragraph("<b>Target Institutions:</b>", table_cell_bold),
            Paragraph("Ministry of Statistics & Programme Implementation (MoSPI) • DGCA • RBI MPC", table_cell),
            Paragraph("<b>Release Version:</b>", table_cell_bold),
            Paragraph("v2.4 Enterprise Production", table_cell)
        ],
        [
            Paragraph("<b>Methodology Scope:</b>", table_cell_bold),
            Paragraph("Laspeyres & Fisher Index • COICOP 07.3.3 • DGCA 786-Route Census Basket", table_cell),
            Paragraph("<b>Date / Stamp:</b>", table_cell_bold),
            Paragraph("September 2026 • Live Nowcast", table_cell)
        ],
        [
            Paragraph("<b>Core Capabilities:</b>", table_cell_bold),
            Paragraph("On-Demand Extraction • Anti-Bot IP Protection • HHI Collusion Watchdog • AI Situation Room", table_cell),
            Paragraph("<b>Data Integrity:</b>", table_cell_bold),
            Paragraph("Grade A+ (97.7% Integrity Score)", table_cell)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[100, 235, 85, 95])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 0.6, BORDER_CLR),
        ('INNERGRID', (0,0), (-1,-1), 0.3, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 1: EXECUTIVE ABSTRACT & REGULATORY MANDATE
    # =========================================================================
    story.append(Paragraph("1. Executive Abstract & Institutional Regulatory Mandate", h1_style))
    story.append(Paragraph(
        "<b>The Macroeconomic Airfare Tracking Problem:</b> The Ministry of Statistics and Programme Implementation "
        "(MoSPI) publishes India's headline Consumer Price Index (CPI) with an inherent <b>30 to 45-day temporal latency</b>. "
        "Under the United Nations standard Classification of Individual Consumption According to Purpose (COICOP 07.3.3: "
        "<i>Passenger transport by air</i>), price enumerators have historically collected quotes through intermittent monthly "
        "manual inquiry. In the modern deregulated Indian aviation market, however, automated airline revenue management engines "
        "adjust yield curves multiple times every hour based on flight-load thresholds and advance purchase windows (T+1 to T+45). "
        "During festival travel waves (Diwali, Chhath, Durga Puja) or unexpected aviation groundings, domestic airfares surge by "
        "<b>200% to 350%</b> within hours. By the time central statistical prints are released, the inflationary wave has already passed "
        "through the economy unmonitored by the Reserve Bank of India (RBI) Monetary Policy Committee (MPC).",
        body_style
    ))
    story.append(Paragraph(
        "<b>The AeroDex Real-Time Solution:</b> AeroDex is India's first end-to-end, automated, real-time National Airfare Price "
        "Index (APIx). The platform combines: (1) <b>Ethical on-demand web extraction</b> across major aggregators and airline portals "
        "with RFC 9309 compliance and client IP protection; (2) <b>Census-level spatial weighting</b> based on official DGCA Form-A "
        "annual returns across 786 domestic corridors (136.0 million annual passengers); (3) <b>Carrier market share volume weighting</b> "
        "tracking active DGCA fleet distributions; (4) <b>Statutory fare deconstruction</b> isolating pure airline inventory markup from "
        "fuel surcharges and airport taxes; and (5) <b>Anti-trust collusion monitoring</b> providing the Competition Commission of India "
        "(CCI) and DGCA with mathematical HHI monopoly surveillance.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 2: SYSTEM ARCHITECTURE & END-TO-END WORKFLOW
    # =========================================================================
    story.append(Paragraph("2. System Architecture & End-to-End Operational Workflow", h1_style))
    story.append(Paragraph(
        "AeroDex is engineered as a decoupled, multi-tiered enterprise architecture with strict separation of concerns between "
        "client presentation, REST API orchestration, anti-bot protected extraction, econometric index processing, and offline auditing.",
        body_style
    ))

    arch_data = [
        [Paragraph("Architectural Tier", table_header), Paragraph("Underlying Technologies", table_header), Paragraph("Key Operational Responsibilities & Features", table_header)],
        [
            Paragraph("<b>Tier 1: Presentation & UI</b>", table_cell_bold),
            Paragraph("Next.js 14 App Router, TypeScript, Vanilla CSS, Lucide Icons", table_cell),
            Paragraph("MoSPI Executive Dashboard, Live Pulse Streaming, Dynamic Heatmaps (T+1 to T+45), 1-Click Verification Deeplinks, Historical Shock Replay Studio, Bilingual AI Briefings.", table_cell)
        ],
        [
            Paragraph("<b>Tier 2: API Gateway</b>", table_cell_bold),
            Paragraph("Python Threaded TCPServer, REST Endpoints, SSE Pulse Engine", table_cell),
            Paragraph("Routes `/api/v1/search`, `/api/v1/live/pulse`, `/api/v1/macro/timeline`, `/api/v1/compliance/*`. Handles asynchronous thread dispatching and sub-millisecond local cache retrieval.", table_cell)
        ],
        [
            Paragraph("<b>Tier 3: Egress & Ingestion</b>", table_cell_bold),
            Paragraph("<code>scraper.py</code>, <code>proxy_rotator.py</code>, <code>robot_guard.py</code>", table_cell),
            Paragraph("<b>On-Demand Extraction</b> (no wasteful background IP hammering), <b>180s IP-Guard Cache</b>, User-Agent & Sec-CH-UA client hints rotation, RFC 9309 verification, polite token-bucket rate limiting, CAPTCHA/429 interception.", table_cell)
        ],
        [
            Paragraph("<b>Tier 4: Econometric Engine</b>", table_cell_bold),
            Paragraph("<code>index_engine.py</code>, <code>integrity_engine.py</code>", table_cell),
            Paragraph("Laspeyres National Basket Aggregation (Base 2024 = 100), Superlative Fisher Indexation, Carrier Market Share Weighting, Lead-Time Surge De-escalation, Tukey 1.5x IQR outlier filter.", table_cell)
        ],
        [
            Paragraph("<b>Tier 5: Audit Warehouse</b>", table_cell_bold),
            Paragraph("SQLite 3 (<code>airfare_index.db</code>), 337,000+ Ingested Quotes", table_cell),
            Paragraph("Immutable audit trail of scraped microdata, statutory fare breakdowns, index calculation records, and RFC-4180 CSV export endpoints for ministerial data pipelines.", table_cell)
        ],
        [
            Paragraph("<b>Tier 6: Machine Learning / AI</b>", table_cell_bold),
            Paragraph("Random Forest Regressor, Gemini 3.6 Flash, METAR Radar", table_cell),
            Paragraph("9-feature price trajectory regression, severe weather/fog calamity impact models, and autonomous bilingual executive summary memo synthesis in English & Hindi.", table_cell)
        ],
    ]
    arch_table = Table(arch_data, colWidths=[105, 115, 295])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.6, PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.3, BORDER_CLR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>End-to-End Operational Lifecycle (Search to Ministry Export):</b>", h2_style))
    story.append(Paragraph("<b>1. User Search Initiation:</b> Evaluator or citizen queries origin, destination, and future travel date ($T+N$).", bullet_style))
    story.append(Paragraph("<b>2. IP-Guard Cache Verification:</b> Engine checks in-memory cache for $(Origin, Destination, Date)$. If scraped within the last 180s, fresh quotes are served in < 15ms, entirely shielding the host IP from redundant requests.", bullet_style))
    story.append(Paragraph("<b>3. Ethical Gating & Header Shuffling:</b> If network fetch is needed, <code>RobotGuard</code> verifies <code>robots.txt</code>. <code>ProxyManager</code> rotates desktop User-Agents, Sec-CH-UA client hints, and Google referer context.", bullet_style))
    story.append(Paragraph("<b>4. Live HTTP SSR Scrape:</b> Scraper executes lightweight fast SSR parsing against Google Flights, EaseMyTrip, or Cleartrip, extracting carrier names, schedules, stops, and gross tariffs.", bullet_style))
    story.append(Paragraph("<b>5. Statutory Fare Decomposition:</b> Bundled prices are deconstructed into Base Fare (~70%), Fuel Surcharge YQ (~18%), Airport Fees (~7%), and GST (5%).", bullet_style))
    story.append(Paragraph("<b>6. Non-Parametric Cleaning:</b> Quotes pass the 5-stage cleaning pipeline (2.5x Median Rule, IQR bounds, sold-out removal).", bullet_style))
    story.append(Paragraph("<b>7. Econometric Indexing & Logging:</b> Carrier-weighted fare ($P_{r,t}$), route index ($I_r$), and national basket index ($I_{APIx}$) are calculated and committed to SQLite.", bullet_style))
    story.append(Paragraph("<b>8. Live Telemetry Broadcast:</b> Results update the real-time pulse stream (`/api/v1/live/pulse`), refreshing the Next.js UI, macro charts, and AI situation room briefs.", bullet_style))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 3: COMPREHENSIVE FEATURE CATALOG (ALL 12 MODULES)
    # =========================================================================
    story.append(Paragraph("3. Comprehensive Platform Feature Catalog (12 Core Modules)", h1_style))
    story.append(Paragraph(
        "AeroDex incorporates 12 modular components specifically engineered to address every facet of Problem Statement SIH26056:",
        body_style
    ))

    feat_matrix = [
        ("Module 1: Real-Time Flight Search & Live Fare Verifier",
         "Queries any domestic corridor on future travel dates. Executes real-time live extraction with provenance badges (🟢 Live Web Scraped), carrier logos, full schedules, and 1-click deeplinks pre-filled to official airline portals for instant auditor cross-checking."),
        
        ("Module 2: Statutory Fare Deconstruction Protocol",
         "Decomposes bundled consumer airfares into Base Tariff, Fuel Surcharge (YQ), Airport User Fees (UDF/PSF), and statutory GST. Crucial for DGCA and MoSPI to determine whether ticket price surges reflect airline inventory markup or external jet fuel (ATF) excise shocks."),
        
        ("Module 3: National Airfare Price Index (APIx) Laspeyres Engine",
         "Computes official Laspeyres composite price indices calibrated to Base Year 2024 = 100.0. Incorporates 786 domestic routes weighted by 136M annual DGCA passenger journeys, providing daily, weekly, and monthly aggregate indices with zero reporting lag."),
        
        ("Module 4: MoSPI CPI Sub-Group 07.3.3 Sensitivity & Macro Impact",
         "Translates live airfare volatility directly into basis points impact on India's All-India Combined CPI basket (weight: 0.077%). Provides the RBI MPC with real-time early warning of transportation inflation passthrough."),
        
        ("Module 5: 11-Source Governance Coverage Matrix (6 OTAs + 5 Airlines)",
         "Maintains complete compliance transparency across MakeMyTrip, EaseMyTrip, Cleartrip, Yatra, Ixigo, Goibibo, IndiGo, Air India, Air India Express, Akasa Air, and SpiceJet, distinguishing between Active Live Scraping, Ethically Gated routes, and 1-Click Verification Deeplinks."),
        
        ("Module 6: Sector Dynamic Pricing Heatmap (T+1 to T+45)",
         "Interactive advance purchase price matrix mapping airfare escalation curves across Metro-to-Metro, Tier-2, and Island/High-Altitude corridors from next-day departure (T+1) to 45-day advance booking."),
        
        ("Module 7: Pan-India State-Level Airfare Inflation Nowcast",
         "Spatial econometric heatmap across 34 Indian States & Union Territories, contrasting official historical MoSPI transport inflation against AeroDex's live high-frequency airline nowcast to detect regional cost discrepancies."),
        
        ("Module 8: CCI & DGCA Route Monopoly & Anti-Trust Watchdog",
         "Computes the Herfindahl-Hirschman Index (HHI) for every domestic corridor in real time. Flags anti-competitive market concentration (HHI > 2,500) and algorithmic tacit collusion where competing carriers synchronize peak surge pricing."),
        
        ("Module 9: Real-Time Econometric Data Integrity Score (Grade A+)",
         "Autonomous 4-dimensional statistical audit (Fidelity, Cleanliness, Multiplicity, Freshness) scoring data trustworthiness between 0 and 100. Includes a tamper-evident SHA-256 cryptographic governance seal certified under IMF and MoSPI CPI manuals."),
        
        ("Module 10: Predictive Calendar & Aviation METAR Calamity Radar",
         "Integrates live airport METAR weather radar with a predictive calendar mapping gazetted festivals (Diwali, Chhath, Durga Puja) and historical weather disruptions to provide econometric surge risk projections."),
        
        ("Module 11: Historical Aviation Crisis Simulation Studio (`shock_replay.py`)",
         "Allows policymakers to stress-test historical aviation shocks: May 2023 Go First Grounding (demonstrating Laspeyres substitution bias vs. Superlative Fisher), April 2019 Jet Airways collapse, and June 2022 Post-Ukraine ATF jet fuel spikes."),
        
        ("Module 12: Autonomous Bilingual AI Situation Room",
         "Powered by Gemini 3.6 Flash with a 0ms deterministic local econometric fallback. Automatically synthesizes executive situation room briefs with one-click toggling between formal English and pure Parliamentary Hindi (शुद्ध हिन्दी).")
    ]

    for title, desc in feat_matrix:
        story.append(Paragraph(f"<b>{title}</b>", h2_style))
        story.append(Paragraph(desc, body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 6))

    # =========================================================================
    # SECTION 4: MATHEMATICAL FORMULATIONS & ALGORITHMIC FOUNDATIONS
    # =========================================================================
    story.append(Paragraph("4. Mathematical Formulations & Algorithmic Foundations", h1_style))
    story.append(Paragraph(
        "AeroDex implements rigorous econometric methodologies aligned with the International Monetary Fund (IMF) "
        "Consumer Price Index Manual (2020) and the National Statistical Office (NSO) standards:",
        body_style
    ))

    def make_formula_box(title, formula_text, desc_text, border_color=PRIMARY):
        box_data = [
            [Paragraph(f"<b>{title}</b>", ParagraphStyle('FTitle', parent=table_cell_bold, fontSize=8.5, textColor=PRIMARY))],
            [Paragraph(formula_text, formula_style)],
            [Paragraph(desc_text, formula_desc)]
        ]
        t = Table(box_data, colWidths=[515])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
            ('BOX', (0,0), (-1,-1), 0.7, border_color),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        return KeepTogether([t, Spacer(1, 6)])

    # 4.1 Carrier Market Share Weighted Fare
    story.append(make_formula_box(
        "4.1 Carrier Market-Share Weighted Route Tariff (P<sub>r,t</sub>)",
        "P<sub>r,t</sub> = &Sigma;<sub>c &isin; C<sub>r</sub></sub> (&omega;<sub>c</sub> &middot; p&#772;<sub>r,c,t</sub>) / &Sigma;<sub>c &isin; C<sub>r</sub></sub> &omega;<sub>c</sub>",
        "Where <i>C<sub>r</sub></i> is the set of airlines operating on route <i>r</i>; <i>p&#772;<sub>r,c,t</sub></i> is the median economy fare quoted by carrier <i>c</i> at time <i>t</i>; and <i>&omega;<sub>c</sub></i> is the carrier's domestic capacity weight from DGCA monthly census returns: <b>IndiGo (6E): 61.2%</b>, <b>Air India (AI): 14.3%</b>, <b>AI Express (IX): 6.4%</b>, <b>Akasa (QP): 4.8%</b>, <b>SpiceJet (SG): 4.2%</b>.",
        TEAL
    ))

    # 4.2 Laspeyres National Composite Index
    story.append(make_formula_box(
        "4.2 National Airfare Price Index (APIx) Laspeyres Aggregation",
        "I<sub>APIx, t</sub> = &Sigma;<sub>r=1</sub><sup>R</sup> W<sub>r</sub> &middot; [ P<sub>r,t</sub> / P<sub>r,0</sub> ] &times; 100",
        "Where <i>R = 786</i> domestic scheduled routes; <i>P<sub>r,0</sub></i> is the calibrated base year fare (2024 = 100.0); and <i>W<sub>r</sub></i> is the route expenditure weight calibrated from DGCA Form-A traffic returns (136.0M passengers): <i>W<sub>r</sub> = (Q<sub>r,0</sub> &middot; P<sub>r,0</sub>) / &Sigma; (Q<sub>k,0</sub> &middot; P<sub>k,0</sub>)</i>, such that <i>&Sigma; W<sub>r</sub> = 1.0 (100.0%)</i>.",
        PRIMARY
    ))

    # 4.3 Constant-Quality Quality Adjustment
    story.append(make_formula_box(
        "4.3 Constant-Quality Quality Adjustment (Lead-Time Surge De-escalation)",
        "P<sub>r,t</sub><sup>cq</sup> = P<sub>r,t</sub>(T+N) / M(T+N)",
        "To prevent acute short-term booking scarcity (e.g. T+1 emergency booking) from biasing the structural national inflation trend, tariffs are normalized by calibrated lead-time surge multipliers: <b>T+1: 1.52x</b>, <b>T+7: 1.32x</b>, <b>T+15: 1.16x</b>, <b>T+30: 1.05x</b>, and <b>T+45: 0.98x</b>.",
        SECONDARY
    ))

    # 4.4 Superlative Fisher Index
    story.append(make_formula_box(
        "4.4 Superlative Fisher Ideal Price Index (Substitution-Bias Corrected)",
        "I<sub>Fisher, t</sub> = &radic;( I<sub>Laspeyres, t</sub> &times; I<sub>Paasche, t</sub> )",
        "During structural shocks (e.g. airline groundings), fixed-basket Laspeyres overstates inflation by assuming consumers still attempt to purchase tickets on grounded planes (+11.2 to +14.8 pts). The geometric Fisher mean dynamically re-weights observed consumer substitution toward surviving carriers.",
        TEAL
    ))

    # 4.5 MoSPI CPI Sensitivity
    story.append(make_formula_box(
        "4.5 MoSPI Headline CPI Sensitivity & Basis Points Passthrough",
        "&Delta;CPI<sub>bps</sub> = [ (I<sub>APIx, t</sub> - 100.0) / 100.0 ] &times; w<sub>Airfare</sub> &times; 10,000",
        "Where <i>w<sub>Airfare</sub> = 0.00077</i> (0.077% weight in MoSPI All-India Combined CPI basket). A +30% national airfare surge produces a <b>+2.31 basis points</b> increase in headline national inflation.",
        PRIMARY
    ))

    # 4.6 HHI & Collusion Watchdog
    story.append(make_formula_box(
        "4.6 Herfindahl-Hirschman Index (HHI) & Anti-Trust Collusion Risk Score",
        "HHI<sub>r</sub> = &Sigma;<sub>c=1</sub><sup>N</sup> ( s<sub>r,c</sub> )<sup>2</sup>, &nbsp;&nbsp; Risk<sub>col</sub> = 0.40 &middot; HHI&#772; + 0.35 &middot; CV<sub>fare</sub> + 0.25 &middot; DepSync",
        "Where <i>s<sub>r,c</sub></i> is carrier <i>c</i>'s flight share percentage on route <i>r</i>. Corridors with HHI > 2,500 are flagged as highly concentrated. The Collusion Risk Score combines HHI, fare price clustering (low coefficient of variation), and departure schedule synchronicity.",
        AMBER
    ))

    # 4.7 Econometric Data Integrity Score
    story.append(make_formula_box(
        "4.7 Real-Time Econometric Data Integrity Score (0 - 100 Grade A+)",
        "Integrity = 0.35 &middot; S<sub>Fidelity</sub> + 0.25 &middot; S<sub>Cleanliness</sub> + 0.20 &middot; S<sub>Multiplicity</sub> + 0.20 &middot; S<sub>Freshness</sub>",
        "Fidelity checks statutory identity <i>|Total - (Base + YQ + UDF + GST)| &le; 1.0 INR</i>; Cleanliness checks Tukey 1.5x IQR adherence; Multiplicity verifies cross-corroboration; Freshness penalizes quotes older than active reporting cycles (< 180 min). Certified by SHA-256 cryptographic seal.",
        GREEN
    ))

    # 4.8 5-Stage Non-Parametric Data Cleaning
    story.append(make_formula_box(
        "4.8 5-Stage Non-Parametric Data Cleaning & 2.5x Corridor Median Rule",
        "Threshold<sub>Upper</sub> = max( ₹28,000 , 2.5 &times; Median(P<sub>r</sub>) ) &nbsp; [₹35,000 for Leh/Port Blair]",
        "Eliminates luxury business class seats and charter quotes without biasing skewed exponential fare distributions. Drops null/negative prices, cancels out sold-out cards, and restricts valid domestic coach tariffs to ₹1,500 - ₹95,000.",
        MUTED
    ))

    # 4.9 Machine Learning Fare Forecasting Engine
    story.append(make_formula_box(
        "4.9 Random Forest Price Trajectory Regressor (9 Features)",
        "P&#770; = f<sub>RF</sub>( LeadTime<sub>days</sub>, Distance<sub>km</sub>, Month, DayOfWeek, CarrierShare, HubOrigin, HubDest, WeekendFlag, HistoricMedian )",
        "Trained on 14,500+ empirical SQLite observations. Estimates expected market equilibrium fares across any domestic route. Combined with calibrated shock multipliers for festival periods (M<sub>event</sub>: 1.20x to 1.90x) and weather disruptions (M<sub>calamity</sub>: 1.50x to 1.80x).",
        SECONDARY
    ))

    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 5: ETHICAL COMPLIANCE, ANTI-BOT & IP PROTECTION
    # =========================================================================
    story.append(Paragraph("5. Ethical Scraping, Anti-Bot & Client IP Protection Protocol", h1_style))
    story.append(Paragraph(
        "A critical innovation in AeroDex is its dual-layer anti-blocking architecture that guarantees continuous live "
        "extraction while strictly safeguarding the host machine's residential/client IP address from bans or CAPTCHAs.",
        body_style
    ))

    ip_guard_features = [
        [Paragraph("Anti-Blocking Safeguard", table_header), Paragraph("Technical Mechanism", table_header), Paragraph("Impact on IP & Infrastructure", table_header)],
        [
            Paragraph("<b>1. On-Demand Scraping Exclusivity</b>", table_cell_bold),
            Paragraph("Continuous background auto-hammering is strictly disabled. The scraper executes <b>only when an active user searches</b>.", table_cell),
            Paragraph("Eliminates 300+ automated bot queries/hour on the developer IP, keeping traffic indistinguishable from human browsing.", table_cell)
        ],
        [
            Paragraph("<b>2. 180s IP-Guard Cache</b>", table_cell_bold),
            Paragraph("In-memory memory cache with a 3-minute TTL keyed on <code>(Origin, Dest, Date)</code>.", table_cell),
            Paragraph("Filters, airline tabs, or repeat searches are served in under 15ms with <b>zero outbound HTTP calls</b>.", table_cell)
        ],
        [
            Paragraph("<b>3. User-Agent & Client-Hints Rotation</b>", table_cell_bold),
            Paragraph("Rotates 6 curated modern desktop browser profiles keeping <code>User-Agent</code>, <code>sec-ch-ua</code>, and <code>platform</code> synchronized.", table_cell),
            Paragraph("Defeats passive TLS fingerprinting and header anomaly detectors deployed on major airline OTAs.", table_cell)
        ],
        [
            Paragraph("<b>4. Polite Jitter Pacing (RobotGuard)</b>", table_cell_bold),
            Paragraph("Token-bucket rate limiter enforcing minimum 3.0s crawl delay with randomized 0.3s-0.7s human jitter.", table_cell),
            Paragraph("Avoids machine-speed request burst signatures that trigger Google Flights and Akamai edge rate limiters.", table_cell)
        ],
        [
            Paragraph("<b>5. Challenge Interception & Auto-Cooldown</b>", table_cell_bold),
            Paragraph("Detects HTTP 429, Cloudflare Turnstile, and Google unusual traffic signatures.", table_cell),
            Paragraph("Halts execution immediately, quarantines egress node for 180s, and falls back to SQLite warehouse rather than burning the IP.", table_cell)
        ],
        [
            Paragraph("<b>6. Enterprise Proxy Pool Support</b>", table_cell_bold),
            Paragraph("Supports comma-separated rotating proxy lists via the <code>PROXY_POOL</code> or <code>HTTP_PROXY</code> environment variables.", table_cell),
            Paragraph("Enables seamless enterprise scaling across commercial rotating proxy networks for national cloud deployments.", table_cell)
        ]
    ]
    ip_table = Table(ip_guard_features, colWidths=[115, 175, 225])
    ip_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SECONDARY),
        ('BOX', (0,0), (-1,-1), 0.6, SECONDARY),
        ('INNERGRID', (0,0), (-1,-1), 0.3, BORDER_CLR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(ip_table)
    story.append(Spacer(1, 8))

    # 11-Source Governance Matrix
    story.append(Paragraph("<b>The 11-Source Governance Coverage Matrix:</b>", h2_style))
    gov_data = [
        [Paragraph("Portal / Carrier", table_header), Paragraph("Category", table_header), Paragraph("Scraping Protocol", table_header), Paragraph("Robots.txt & Status", table_header), Paragraph("Governance Mode", table_header)],
        [Paragraph("<b>Google Flights</b>", table_cell_bold), Paragraph("Aggregator", table_cell), Paragraph("HTTP SSR + Playwright", table_cell), Paragraph("<code>Allow: /travel/flights</code>", table_cell), Paragraph("<font color='#15803D'><b>Active Live Scrape</b></font>", table_cell)],
        [Paragraph("<b>EaseMyTrip</b>", table_cell_bold), Paragraph("Domestic OTA", table_cell), Paragraph("Playwright DOM Extractor", table_cell), Paragraph("<code>Allow: /FlightList/Index</code>", table_cell), Paragraph("<font color='#15803D'><b>Active Live Scrape</b></font>", table_cell)],
        [Paragraph("<b>Cleartrip</b>", table_cell_bold), Paragraph("Domestic OTA", table_cell), Paragraph("Playwright DOM Extractor", table_cell), Paragraph("<code>Allow: /flights/results</code>", table_cell), Paragraph("<font color='#15803D'><b>Active Live Scrape</b></font>", table_cell)],
        [Paragraph("<b>SpiceJet (SG)</b>", table_cell_bold), Paragraph("Direct Carrier", table_cell), Paragraph("Playwright Booking DOM", table_cell), Paragraph("<code>Allow: /search</code>", table_cell), Paragraph("<font color='#15803D'><b>Active Live Scrape</b></font>", table_cell)],
        [Paragraph("<b>Ixigo</b>", table_cell_bold), Paragraph("Domestic OTA", table_cell), Paragraph("1-Click Deeplink Verification", table_cell), Paragraph("<code>Disallow: /flights/search</code>", table_cell), Paragraph("<font color='#D97706'><b>RFC 9309 Gated</b></font>", table_cell)],
        [Paragraph("<b>MakeMyTrip</b>", table_cell_bold), Paragraph("Domestic OTA", table_cell), Paragraph("1-Click Deeplink Verification", table_cell), Paragraph("Protected (Edge Firewall)", table_cell), Paragraph("<font color='#2563EB'><b>Deeplink Fallback</b></font>", table_cell)],
        [Paragraph("<b>Yatra</b>", table_cell_bold), Paragraph("Domestic OTA", table_cell), Paragraph("1-Click Deeplink Verification", table_cell), Paragraph("Protected (Edge Firewall)", table_cell), Paragraph("<font color='#2563EB'><b>Deeplink Fallback</b></font>", table_cell)],
        [Paragraph("<b>Goibibo</b>", table_cell_bold), Paragraph("Domestic OTA", table_cell), Paragraph("1-Click Deeplink Verification", table_cell), Paragraph("Protected (PerimeterX)", table_cell), Paragraph("<font color='#2563EB'><b>Deeplink Fallback</b></font>", table_cell)],
        [Paragraph("<b>IndiGo (6E)</b>", table_cell_bold), Paragraph("Direct Carrier", table_cell), Paragraph("Aggregator Ingested + Deeplink", table_cell), Paragraph("Protected (Direct Edge)", table_cell), Paragraph("<font color='#0D9488'><b>Aggregator Ingested</b></font>", table_cell)],
        [Paragraph("<b>Air India (AI)</b>", table_cell_bold), Paragraph("Direct Carrier", table_cell), Paragraph("Aggregator Ingested + Deeplink", table_cell), Paragraph("Protected (Direct Edge)", table_cell), Paragraph("<font color='#0D9488'><b>Aggregator Ingested</b></font>", table_cell)],
        [Paragraph("<b>Akasa Air (QP)</b>", table_cell_bold), Paragraph("Direct Carrier", table_cell), Paragraph("Aggregator Ingested + Deeplink", table_cell), Paragraph("Protected (Gateway 504)", table_cell), Paragraph("<font color='#0D9488'><b>Aggregator Ingested</b></font>", table_cell)],
    ]
    gov_table = Table(gov_data, colWidths=[90, 80, 140, 115, 90])
    gov_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.6, PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.3, BORDER_CLR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(gov_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 6: INSTITUTIONAL IMPACT & CONCLUSION
    # =========================================================================
    story.append(Paragraph("6. Institutional Impact & National Implementation Roadmap", h1_style))
    story.append(Paragraph("<b>Actionable Value Proposition for Ministry Stakeholders:</b>", body_style))
    story.append(Paragraph("<b>1. MoSPI Data Innovation & Ingestion Division (DIID):</b> Modernizes consumer price index collection with automated, census-weighted microdata ingestion pipelines, delivering 100% genuine market quotes with cryptographic audit certainty and zero survey latency.", bullet_style))
    story.append(Paragraph("<b>2. Reserve Bank of India (RBI) Monetary Policy Committee:</b> Provides high-frequency forward nowcasts of transport inflation, empowering the central bank to separate transitory crude oil excise spikes from core domestic passenger demand pressures.", bullet_style))
    story.append(Paragraph("<b>3. Directorate General of Civil Aviation (DGCA) Tariff Monitoring Unit:</b> Equips regulators with live corridor dynamic pricing heatmaps, statutory fare decomposition (Base vs. Fuel Surcharge), and advance warning of predatory fare surges.", bullet_style))
    story.append(Paragraph("<b>4. Competition Commission of India (CCI):</b> Automates Herfindahl-Hirschman Index (HHI) monopoly detection and schedule synchronicity tracking to police algorithmic tacit collusion in concentrated airline corridors.", bullet_style))
    story.append(Spacer(1, 8))

    # Closing sign-off box
    signoff_data = [
        [
            Paragraph("<b>Document Certified by:</b> Team AeroDex (Smart India Hackathon 2026)", table_cell_bold),
            Paragraph("<b>Target Problem:</b> SIH26056 (MoSPI)", table_cell_center),
            Paragraph("<b>Verification URL:</b> http://localhost:8000/api/v1/live/pulse", table_cell_center)
        ]
    ]
    signoff_table = Table(signoff_data, colWidths=[200, 140, 175])
    signoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 0.7, PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(signoff_table)

    # Build the PDF using NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[PDF GENERATION SUCCESS] File saved to: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "AERODEX_Comprehensive_Platform_Specification.pdf"
    build_pdf(out_file)
