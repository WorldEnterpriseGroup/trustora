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
- **Branch Offices:** Asia
- **Industry:** Business consulting, technology consulting, professional services
- **Core Services:**
  - Business Consulting
  - Technology Consulting
  - Professional Services
  - Employer of Record (EOR)
  - Project Management
  - Performance Management
- **Specialization:** Import/export of tech and professional services, EOR from APAC to the west

### Leadership Team
- **CEO:** Abdul Rehman, business professional
- **COO:** Zarafshta Akhtar
- **Account Manager:** Aroofa Mahmood - Masters in Finance

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
- `images/` - All site images and assets
- `php/` - Backend scripts (sendMail.php)
- `index.html` - Main one-page site
- `portfolio-*.html` - Individual portfolio pages
- `blog.html`, `single.html` - Blog templates

## Content Strategy & Copywriting Requirements

### Website Sections & Content Focus

#### 1. Home Section (Hero Area)
- **Purpose:** Professional introduction to Trustora's consulting services
- **Tone:** Trustworthy, professional, business-focused
- **Key Message:** Position Trustora as a trusted business partner
- **Elements:** Headline, subtitle mentioning USA/Asia presence (not Delaware specifically)
- **Logo:** Create SVG logo with letter "T" to replace current icon_logo.png

#### 2. Services Section
- **Current Services to Highlight:**
  - Business Consulting
  - Technology Consulting
  - Professional Services
  - Employer of Record
  - Project Management
  - Performance Management
- **Focus:** Value proposition and client benefits for each service
- **Layout:** Ensure all 6 service cards are exactly the same height
- **Service Numbers:** Replace Roman numerals (I, II, III, etc.) with icons, stats, or meaningful content
- **Remove:** Up-title-text numbers (01, 02, 03, etc.) from all sections

#### 3. Portfolio Section → Success Stories
- **Rename to:** "SUCCESS STORIES" or "CASE STUDIES"
- **Content:** Business consulting case studies, client success stories
- **Focus:** Business outcomes, project results, service delivery examples

#### 4. Clients Section (Testimonials)
- **Content:** Professional client testimonials from business leaders
- **Titles:** CEO, COO, HR Director, etc.
- **Focus:** Consulting outcomes, project management success, EOR services

#### 5. News Section
- **Content:** Business-focused articles, consulting trends, industry insights
- **Categories:** Business consulting, technology trends, HR insights
- **Focus:** Thought leadership and industry expertise

#### 6. Skills Section
- **Content:** Business consulting skills, technology expertise, project management methodologies
- **Focus:** Professional capabilities and expertise areas

#### 7. Team Section
- **Content:** Update with actual leadership team:
  - **CEO:** Abdul Rehman, business professional
  - **COO:** Zarafshta Akhtar
  - **Account Manager:** Aroofa Mahmood - Masters in Finance
- **Focus:** Professional profiles with consulting, project management, and business expertise
- **Social:** LinkedIn-focused professional presence

#### 8. Milestones Section → Business Metrics
- **Rename to:** "BUSINESS METRICS" or "KEY PERFORMANCE INDICATORS"
- **Content:** Realistic business metrics for Trustora
- **Focus:** Company growth and success indicators

#### 9. About Section
- **Content:** Trustora's company story focusing on:
  - Specialization in import/export of tech and professional services
  - EOR services from APAC to the west
  - Longstanding history of supporting HR needs and EOR needs
  - Innovative and performance-driven approach
- **Tone:** Professional, emphasizing trust and reliability
- **Geographic Focus:** USA • Asia (not Delaware specifically)

#### 10. Pricing Section → Service Offerings
- **Content:** Service packages, consulting engagement types, EOR service tiers
- **Layout:** Ensure pricing-table-price text is 4 characters or less
- **Reference:** Follow exact layout from [original demo](https://demo.cocobasic.com/meelo-html/?storefront=envato-elements)

#### 11. Contact Section
- **Information:** Delaware address (16192 Coastal Hwy. Lewes, DE 19958), info@trustora.net
- **Remove:** Contact hours (we are always open)
- **Contact Form:** Implement Focus Hive-style form with proper CSS styling
  - Company size dropdown with proper CSS classes
  - Location dropdown with proper CSS classes
  - Professional message form with validation
  - Fix CSS styling issues for dropdown fields

#### 12. Footer
- **Branding:** Trustora logo and contact information
- **Social:** Business-appropriate platforms (LinkedIn, etc.)
- **Government Codes:** Subtle display of NAICS, SIC, PSC, SIN codes

### Content Guidelines

#### Tone & Voice
- **Primary:** Professional, trustworthy, business-focused
- **Secondary:** Approachable, solution-oriented
- **Avoid:** Casual language, technical jargon, overly promotional content
- **Geographic Reference:** Use "USA • Asia" instead of "Delaware • Asia"

#### SEO Keywords
- Business consulting
- Technology consulting
- Employer of Record (EOR)
- Project management
- Performance management
- Professional services
- Import/export services
- APAC to west services
- Government contracting
- NAICS codes
- Professional services consulting

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
- **Reference:** [Focus Hive Contact Form](https://focushive.com/support.html)
- **Features:**
  - Company size dropdown (Individual, Startup, Small Business, Enterprise, Government)
  - Location dropdown (Africa, Asia, Australia, Europe, North America, South America)
  - Professional message form with validation
  - Multiple office locations display
  - Form validation and AJAX submission
  - Professional styling consistent with corporate theme
- **CSS Fixes:** Ensure proper CSS classes are applied to dropdown fields

### Logo Implementation
- **Current:** images/icon_logo.png (letter M with underline)
- **New:** Create SVG logo with letter "T" for Trustora
- **Style:** Modern, professional, scalable
- **Replacement:** Update both header logo and hero section icon

## Content Update Workflow

### When Updating Content
1. **Maintain Structure:** Keep all existing HTML structure and CSS classes
2. **Content Only:** Update text content, not layout or styling
3. **Professional Focus:** Ensure all content reflects Trustora's business consulting focus
4. **Contact Info:** Always use info@trustora.net and Delaware address (16192 Coastal Hwy. Lewes, DE 19958)
5. **Branding:** Maintain Trustora branding throughout
6. **Government Focus:** Include relevant NAICS, SIC, PSC, SIN codes where appropriate
7. **Geographic Reference:** Use "USA • Asia" instead of "Delaware • Asia" in public-facing content

### Content Review Checklist
- [ ] Professional tone maintained
- [ ] Business consulting focus clear
- [ ] Contact information updated (info@trustora.net, Delaware address)
- [ ] USA/Asia presence mentioned (not Delaware specifically)
- [ ] Services accurately described
- [ ] SEO keywords included
- [ ] Call-to-actions appropriate
- [ ] No template placeholder content remains
- [ ] Government contracting codes included (subtle placement)
- [ ] Contact form follows Focus Hive reference design
- [ ] Team section updated with actual leadership
- [ ] About section reflects import/export and EOR specialization
- [ ] Service cards are equal height
- [ ] Pricing table prices are 4 characters or less
- [ ] Up-title-text numbers removed
- [ ] Contact hours removed
- [ ] SVG logo with "T" implemented

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
- **Critical:** All content must reflect Trustora's professional business consulting services
- **Domain:** Always reference trustora.net, not template domains
- **Email:** Use info@trustora.net for all contact information
- **Address:** Use 16192 Coastal Hwy. Lewes, DE 19958 for Delaware headquarters
- **Government Focus:** Include relevant codes for future government contracting opportunities
- **Contact Form:** Reference Focus Hive design for professional contact form implementation
- **Geographic Reference:** Use "USA • Asia" in public content, Delaware only in contact/footer
- **Team Updates:** Include actual leadership team (Abdul Rehman, Zarafshta Akhtar, Aroofa Mahmood)
- **About Focus:** Emphasize import/export of tech and professional services, EOR from APAC to west
- **Layout Requirements:** Ensure service cards equal height, pricing text ≤4 characters, remove up-title-text numbers
- **Logo:** Create SVG logo with letter "T" to replace current icon