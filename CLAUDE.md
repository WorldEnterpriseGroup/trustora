# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trustora is a static HTML corporate one-page template called "Meelo" hosted on GitHub Pages at trustora.net. This is a purchased template from CocoBasic with no build system or package management.

## Company Information

### Trustora Business Details
- **Company Name:** Trustora
- **Domain:** trustora.net
- **Email:** info@trustora.net
- **Headquarters:** Delaware, USA
- **Address:** 16192 Coastal Hwy. Lewes, DE 19958
- **Global Operations:** Middle East, Asia, and North Africa (MENAP)
- **Founded:** 2025
- **Industry:** Business consulting, technology consulting, professional services
- **Core Services:**
  - Business Process Outsourcing (BPO)
  - Workforce Solutions & EOR
  - Technology Consulting
  - Professional Services
  - AI Implementation & Context Engineering
  - Project Management
- **Specialization:** Providing elite workforce TO Microsoft Partners and enterprise clients globally
- **Partnership:** Strategic alliance with Curiosity Research Corporation (CRC) for talent development

### Leadership Team
- **CEO:** Abdul Rehman, business professional with global consulting experience
- **COO:** Zarafshta Akhtar, strategic operations and business development
- **CFO:** Zaryaba Ayub, Masters in Finance, financial strategy and compliance

### Government Contracting Information
- **NAICS Codes:** Include relevant codes for consulting services (541611, 541612, 541618, 541990)
- **SIC Codes:** Include relevant codes for business services (8741, 8742, 8748)
- **PSC Codes:** Include relevant codes for professional services (R401, R402, R403, R404)
- **SIN Codes:** Include relevant codes for GSA Schedule services
- **Display:** Subtle but visible placement for government contracting opportunities

### Target Audience
- Business leaders and executives
- HR professionals
- Companies seeking consulting services
- Organizations needing EOR solutions
- Businesses requiring project management support
- Government agencies and contractors

## Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, jQuery
- **Backend**: Minimal PHP for contact form
- **Hosting**: GitHub Pages (gh-pages branch)
- **Libraries**: Font Awesome, Owl Carousel, SmartMenus, Isotope, ImagesLoaded

### Directory Structure
- `css/` - Modular stylesheets (main entry: style.css)
- `js/` - JavaScript files (custom code: main.js)
- `images/` - All site images and assets, including custom SVG icons
- `php/` - Backend scripts (sendMail.php)
- `index.html` - Main one-page site with all sections
- `careers.html` - Dedicated careers and internship opportunities page
- `portfolio-*.html` - Individual portfolio pages
- `blog.html`, `single.html` - Blog templates
- `config.php` - Email configuration (info@trustora.net)

## Content Strategy & Copywriting Requirements

### Website Sections & Content Focus

#### 1. Home Section (Hero Area)
- **Purpose:** Professional introduction to Trustora's workforce solutions
- **Tone:** Trustworthy, professional, business-focused
- **Key Message:** "Business Excellence Through Strategic Consulting"
- **Elements:** Headline, subtitle mentioning global MENAP presence
- **Logo:** Professional SVG logos implemented (trustora-logo.svg, trustora-text-logo.svg)

#### 2. Services Section
- **Current Services to Highlight:**
  - Business Process Outsourcing (BPO)
  - Workforce Solutions & EOR
  - Technology Consulting
  - Professional Services
  - AI Implementation & Context Engineering
  - Project Management
- **Focus:** Value proposition for Microsoft Partners and enterprise clients
- **Layout:** All 6 service cards maintained at equal height
- **Implementation:** Text-based service descriptions (no emoji icons)
- **Status:** Section numbers (01, 02, 03, etc.) have been removed

#### 3. Portfolio Section → Success Stories
- **Rename to:** "SUCCESS STORIES" or "CASE STUDIES"
- **Content:** Business consulting case studies, client success stories
- **Focus:** Business outcomes, project results, service delivery examples

#### 4. Clients Section (Testimonials)
- **Content:** Professional client testimonials from business leaders
- **Titles:** CEO, COO, HR Director, etc.
- **Focus:** Consulting outcomes, project management success, EOR services

#### 5. News Section → Culture Section
- **Renamed to:** "CULTURE" (navigation updated)
- **Content:** Company culture, team insights, professional development
- **Categories:** Workplace culture, team spotlights, professional growth
- **Focus:** Trustora's collaborative and innovative work environment

#### 6. Skills Section → BPO & Workforce Solutions
- **Redesigned as:** "BPO & WORKFORCE SOLUTIONS" expertise cards
- **Content:** Six expertise areas with professional descriptions:
  - Global Workforce Management
  - Microsoft Partnership Solutions
  - AI-Driven Operations
  - Call Center Excellence
  - Project Management Systems
  - Security & Compliance
- **Implementation:** Grid layout with professional cards (no percentage bars)
- **Focus:** Demonstrating expertise in providing workforce TO Microsoft Partners

#### 7. Team Section
- **Content:** Updated with actual leadership team:
  - **CEO:** Abdul Rehman, business professional with global consulting experience
  - **COO:** Zarafshta Akhtar, strategic operations and business development
  - **CFO:** Zaryaba Ayub, Masters in Finance, financial strategy and compliance
- **Focus:** Professional profiles emphasizing global workforce management expertise
- **Social:** LinkedIn-focused professional presence
- **Status:** Team information has been updated with current roles and descriptions

#### 8. Milestones Section → Business Metrics
- **Renamed to:** "BUSINESS METRICS" (navigation updated to "Metrics")
- **Content:** Updated with realistic metrics for a 2025-founded company:
  - Global workforce size (200+ professionals)
  - MENAP regional presence
  - Client satisfaction metrics
  - Years of combined team experience
- **Focus:** Professional credibility without overselling
- **Status:** Titles updated from generic "UN/DOD" to relevant business metrics

#### 9. About Section
- **Content:** Updated company story reflecting:
  - Founded in 2025 as strategic workforce solutions provider
  - Partnership with Curiosity Research Corporation (CRC)
  - Global operations across Middle East, Asia, and North Africa (MENAP)
  - Focus on providing elite workforce TO Microsoft Partners
  - Timeline updated to reflect accurate founding date
- **Tone:** Professional, emphasizing innovation and global reach
- **Geographic Focus:** "USA • MENAP" reflecting actual operations
- **Status:** Updated from outdated 2009 founding story to current 2025 reality

#### 10. Pricing Section → EOR Services
- **Content:** Three-tier EOR service packages with compelling value propositions:
  - **STARTUP ($10K):** Elite specialists, zero-risk payroll, instant market entry
  - **ENTERPRISE ($50K):** Scalable workforce, enterprise platform, senior PM
  - **CUSTOM (ASK):** Unlimited workforce, complete BPO, C-suite advisory
- **Layout:** Pricing maintained at 4 characters or less ($10K, $50K, ASK)
- **Implementation:** Professional checklists with industry-relevant features
- **Focus:** Clear value escalation across tiers for workforce solutions
- **Status:** Updated from generic consulting to specific EOR service offerings

#### 11. Contact Section
- **Information:** Delaware address (16192 Coastal Hwy. Lewes, DE 19958), info@trustora.net
- **Status:** Contact hours have been removed as requested
- **Contact Form:** Professional form with enhanced dropdowns:
  - Company size dropdown (Individual, Startup, Small Business, Enterprise, Government)
  - Location dropdown expanded with 30+ MENAP countries
  - Professional message form with validation
  - CSS styling implemented for dropdown fields
- **Geographic Reference:** "Middle East, Asia, and North Africa" for transparency
- **Implementation:** PHP mail system configured with info@trustora.net

#### 12. Footer
- **Branding:** Trustora logo and contact information
- **Social:** Business-appropriate platforms (LinkedIn, etc.)
- **Government Codes:** Subtle display of NAICS, SIC codes
- **Geographic Reference:** "Trusted Worldwide • MENAP Excellence"
- **Status:** Updated to reflect global MENAP operations

#### 13. Careers Page (careers.html)
- **New Addition:** Dedicated careers and internship opportunities page
- **Content:** Two main sections:
  - **Internship Program:** Partnership with Ignite Curiosity (CRC)
  - **Professional Careers:** Elite team solutions and BPO services
- **Application Form:** Comprehensive form with:
  - Position type selection (Internship, Full-Time, Contract, Part-Time)
  - Areas of expertise checkboxes (AI/ML, Development, Project Management, BPO, Security)
  - Location dropdown with 30+ MENAP countries
  - Professional application message
- **Navigation:** Added to main navigation as "Careers"
- **Focus:** Recruiting talent from MENAP region for global workforce solutions

### Content Guidelines

#### Tone & Voice
- **Primary:** Professional, trustworthy, business-focused
- **Secondary:** Approachable, solution-oriented
- **Avoid:** Casual language, technical jargon, overly promotional content
- **Geographic Reference:** Use "USA • MENAP" or "Middle East, Asia, and North Africa"
- **Microsoft Partnership:** Emphasize providing workforce TO Microsoft Partners (not being partners)

#### SEO Keywords
- Business Process Outsourcing (BPO)
- Workforce Solutions
- Employer of Record (EOR)
- Microsoft Partners
- AI Implementation
- Context Engineering
- Project Management
- Professional Services
- MENAP workforce
- Global workforce solutions
- Remote team management
- Enterprise consulting

#### Call-to-Actions
- "Contact Us"
- "Get Started"
- "Learn More"
- "Schedule Consultation"
- "Request Quote"
- "Start Your Project"

## Development Commands

This is a static site with no build process. Common tasks:

```bash
# No build/test commands - edit files directly
# To preview locally, use any static server:
python3 -m http.server 8000
# or
php -S localhost:8000
```

## Key Implementation Details

### JavaScript (main.js)
- jQuery-based, includes smooth scrolling, sticky header, portfolio filtering
- Portfolio content loaded dynamically from div.ajax-portfolio
- Form validation and AJAX submission to php/sendMail.php

### CSS Architecture  
- Modular with imports in style.css
- Responsive breakpoints: 1200px, 1024px, 750px, 450px
- BEM-like naming for components

### PHP Email Configuration
- Update `config.php` with recipient email (info@trustora.net)
- Contact form uses native PHP mail() function
- Form fields: name, email, subject, message, company size, location

### Contact Form Implementation
- **Status:** Professional form successfully implemented and enhanced
- **Features:**
  - Company size dropdown (Individual, Startup, Small Business, Enterprise, Government)
  - Enhanced location dropdown with 30+ MENAP countries organized by region
  - Professional message form with validation
  - CSS styling implemented for dropdown fields
  - PHP backend configured (config.php → info@trustora.net)
  - AJAX submission to php/sendMail.php
- **Geographic Coverage:** Comprehensive MENAP region coverage for transparency
- **Integration:** Form styling matches corporate theme and professional standards

### Logo Implementation
- **Implemented:** Professional SVG logos created and deployed
  - `trustora-logo.svg`: T-shaped logo with gradient for footer/branding
  - `trustora-text-logo.svg`: Full "Trustora" text logo for header navigation
- **Style:** Modern, professional, scalable with blue gradient
- **Status:** Successfully replaced original template logos throughout site

## Content Update Workflow

### When Updating Content
1. **Maintain Structure:** Keep all existing HTML structure and CSS classes
2. **Content Only:** Update text content, not layout or styling
3. **Professional Focus:** Ensure all content reflects Trustora's workforce solutions and BPO services
4. **Contact Info:** Always use info@trustora.net and Delaware address (16192 Coastal Hwy. Lewes, DE 19958)
5. **Branding:** Maintain Trustora branding throughout
6. **Government Focus:** Include relevant NAICS, SIC codes where appropriate
7. **Geographic Reference:** Use "USA • MENAP" or "Middle East, Asia, and North Africa"
8. **Microsoft Partnership:** Clarify providing workforce TO Microsoft Partners (not being partners)
9. **Company Timeline:** Founded in 2025, partnered with Curiosity Research Corporation
10. **Careers Integration:** Include links to careers page and internship opportunities

### Content Review Checklist
- [x] Professional tone maintained
- [x] Workforce solutions and BPO focus clear  
- [x] Contact information updated (info@trustora.net, Delaware address)
- [x] USA/MENAP presence mentioned throughout
- [x] Services accurately described (BPO, workforce solutions, EOR)
- [x] SEO keywords updated for current focus
- [x] Call-to-actions appropriate
- [x] No template placeholder content remains
- [x] Government contracting codes included (NAICS, SIC)
- [x] Contact form with enhanced MENAP location dropdown
- [x] Team section updated with actual leadership (CEO, COO, CFO)
- [x] About section reflects 2025 founding and CRC partnership
- [x] Service cards are equal height
- [x] Pricing table prices are 4 characters or less ($10K, $50K, ASK)
- [x] Up-title-text numbers removed from all sections
- [x] Contact hours removed
- [x] SVG logos implemented (trustora-logo.svg, trustora-text-logo.svg)
- [x] Skills section redesigned as "BPO & Workforce Solutions"
- [x] Culture section renamed from "News"
- [x] Business metrics updated for 2025 company
- [x] Careers page created with internship and professional opportunities
- [x] Microsoft partnership clarified (providing workforce TO partners)

## Creative Freedom Guidelines

### Areas for Innovation
Claude Code has permission to improvise in the following areas to enhance corporate appeal and business generation:

1. **Enhanced Contact Form:** Implement professional contact form similar to Focus Hive with proper CSS styling
2. **Government Contracting Elements:** Subtle display of NAICS, SIC, PSC, SIN codes for future government contracts
3. **Corporate Credibility:** Add elements that enhance professional credibility (certifications, partnerships, industry memberships)
4. **Service Differentiation:** Creative ways to showcase Trustora's unique value proposition
5. **Client Success Metrics:** Innovative ways to display business outcomes and client success stories
6. **Geographic Presence:** Professional display of USA headquarters and Asia branch offices
7. **Industry Expertise:** Creative ways to demonstrate consulting expertise and thought leadership
8. **Logo Design:** Create professional SVG logo with letter "T" for Trustora

### Innovation Boundaries
- **Maintain Professional Tone:** All innovations must maintain corporate professionalism
- **Template Structure:** Don't break existing HTML/CSS structure
- **Brand Consistency:** All changes must align with Trustora's business consulting focus
- **Subtle Implementation:** Government codes and corporate elements should be present but not overwhelming
- **User Experience:** Enhance functionality without compromising user experience
- **Geographic Reference:** Use "USA • Asia" in public content, Delaware only in contact/footer

### Recommended Enhancements
- **Contact Form:** Implement Focus Hive-style form with proper CSS styling for dropdowns
- **Government Codes:** Subtle footer or about section display of relevant codes
- **Office Locations:** Professional display of USA and Asia offices
- **Service Packages:** Creative presentation of consulting service offerings
- **Client Testimonials:** Enhanced testimonial section with business outcomes focus
- **Corporate Credentials:** Professional display of certifications, memberships, or partnerships
- **Logo:** Modern SVG logo with letter "T" for Trustora
- **Service Icons:** Replace Roman numerals with meaningful icons or stats

## Important Notes

- This is a template site - avoid breaking the existing design system
- All pages include the same header/footer structure
- Portfolio items use data-id attributes for AJAX loading
- Images should be optimized before adding to images/
- When modifying navigation, update both desktop and mobile menus
- **Critical:** All content must reflect Trustora's workforce solutions and BPO services
- **Domain:** Always reference trustora.net, not template domains
- **Email:** Use info@trustora.net for all contact information
- **Address:** Use 16192 Coastal Hwy. Lewes, DE 19958 for Delaware headquarters
- **Government Focus:** Include relevant NAICS, SIC codes for future opportunities
- **Contact Form:** Enhanced with MENAP location dropdown (30+ countries)
- **Geographic Reference:** Use "USA • MENAP" or "Middle East, Asia, and North Africa"
- **Team Updates:** Leadership team updated (Abdul Rehman CEO, Zarafshta Akhtar COO, Zaryaba Ayub CFO)
- **Company Focus:** Founded 2025, partnered with Curiosity Research Corporation
- **Microsoft Partnership:** Providing workforce TO Microsoft Partners (not being partners)
- **Careers Integration:** careers.html page with internship and professional opportunities
- **Logo Implementation:** Professional SVG logos implemented throughout site
- **Pricing Structure:** Three-tier EOR services ($10K, $50K, ASK) with compelling checklists