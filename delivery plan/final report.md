# Trust Indicators Project: Final Handover Document

**Date:** May 21, 2025
**To:** Sabrina Caldwell (Client Stakeholder)
**From:** Team Trust Indicators (S1 2025)

**Table of Contents:**

- [Trust Indicators Project: Final Handover Document](#trust-indicators-project-final-handover-document)
  - [1. Introduction \& Project Sign-off](#1-introduction--project-sign-off)
  - [2. Project Overview](#2-project-overview)
  - [3. System Architecture \& Technology Stack](#3-system-architecture--technology-stack)
  - [4. Access \& Credentials](#4-access--credentials)
  - [5. Setup \& Usage](#5-setup--usage)
    - [5.1. Developer Guide](#51-developer-guide)
    - [5.2. Server Deployment](#52-server-deployment)
    - [5.3. User Instructions](#53-user-instructions)
  - [6. Completed Features (Summary)](#6-completed-features-summary)
  - [7. Testing \& Quality Assurance](#7-testing--quality-assurance)
  - [8. Documentation](#8-documentation)
  - [9. Maintenance \& Support](#9-maintenance--support)
    - [9.1. \[Icon: Database\] Backup \& Recovery Plan](#91-icon-database-backup--recovery-plan)
    - [9.2. \[Icon: Bug\] Known Issues and Bugs](#92-icon-bug-known-issues-and-bugs)
    - [9.3. \[Icon: Wrench\] Maintenance Tips](#93-icon-wrench-maintenance-tips)
  - [10. Project Wrap-up \& Future](#10-project-wrap-up--future)
  - [11. Appendices](#11-appendices)

---

## 1. Introduction & Project Sign-off

This document marks the official handover of the Trust Indicators project from the S1 2025 development team. The project aimed to develop an Australian-themed image gallery website that helps users better understand and assess the authenticity of uploaded images by displaying their metadata and providing visual cues[cite: 145]. This website will be an open-source project, allowing users to upload their own images while adhering to Creative Commons (CC) licensing requirements[cite: 146]. By collecting image metadata and displaying credibility signals, the website will assist users in identifying and discerning genuine images[cite: 147]. Additionally, website members can contribute background information, such as photographer statements, to provide more contextual details[cite: 148]. The project aims to offer consumers a reliable resource to enhance their ability to judge image authenticity [cite: 149] and provides a platform for photographers and creators to showcase their work and offer additional information, thereby improving public understanding and awareness of images[cite: 150].

We sincerely thank the previous team for their valuable contributions to the project; their hard work and dedication have laid a solid foundation for us[cite: 153]. For detailed information about the previous team's work, please refer to the materials provided at `https://github.com/Trust-Indicator/Trust-Indicator`[cite: 154].

**Team Members (S1 2025):**

| Role               | Name          | Semester | Contact (Email)       | Sources        |
| :----------------- | :------------ | :------- | :-------------------- | :------------- |
| Team Leader        | Juliang Xiao  | S1 2025  | u7757949@anu.edu.au   | [cite: 1, 201] |
| Web Developer      | Xinyang Li    | S1 2025  | u7760022@anu.edu.au   | [cite: 1, 201] |
| Frontend Engineer  | Yushan Zhang  | S1 2025  | u7759158@anu.edu.au   | [cite: 1, 201] |
| Backend Engineer   | Kun Gong      | S1 2025  | u7628201@anu.edu.au   | [cite: 1, 201] |
| Project Admin      | Chu Zhang     | S1 2025  | u7770023@anu.edu.au   | [cite: 1, 201] |
| (No specific role) | Haifan Yang   | S1 2025  | (not specified in docs for contact) | [cite: 1]      |

**Project Completion Sign-off Request:**
As per our email communication on May 21, 2025, we presented the deliverables at the client meeting on May 21, 2025, at 11:30 AM for your formal review and acceptance. We kindly request your confirmation on the following post-meeting:
* [ ] **Project Acceptance:** All deliverables meet the agreed-upon requirements.
* [ ] **Credentials Reception:** Sensitive data has been securely transferred and received.
* [ ] **Ownership Transfer:** Maintenance responsibilities are formally transferred.

Thank you for your guidance throughout this project.

---

## 2. Project Overview

* **Project Scope & Main Features:** The project delivers a functional web application enabling users to upload images, view extracted metadata, see AI-generated content (AIGC) detection probabilities, and assess image authenticity through visual indicators and personalized trust profiles[cite: 1, 3]. Key features include user authentication, image gallery with filtering and sorting, detailed image view with metadata and AIGC results, a user-configurable trust profile, and a trust report system[cite: 1, 3, 7].
* **Final Outcomes:** A live, deployed website with all core functionalities tested and operational[cite: 4]. Comprehensive technical and user documentation is provided[cite: 4].
* **[Icon: Globe] Landing Page:** `https://sites.google.com/view/trustindicators` [cite: 152]
* **[Icon: Link] Live Project Website (Deployment URL):** As per VPS details in email (IP: `144.34.161.14`). The delivery plan specifies "Live project website (deployment URL)" as a deliverable[cite: 4].

---

## 3. System Architecture & Technology Stack

* **Overall System Architecture:**
    * **High-Level Architecture:** The system is a Flask-based web application with an SQLite/SQLAlchemy database[cite: 1]. It features a modular design with separated routes, models, and services[cite: 1].
    * **[Icon: Diagram] Component Interaction:**
        * **AIGC Detector:** Integrates with Alibaba Cloud for AI-generated content detection[cite: 1].
        * **Metadata Extractor:** Uses EXIF data extraction from images for authenticity analysis[cite: 1].
        * **User System:** Handles authentication, profiles, and trust preferences[cite: 1].
        * **Database:** SQLite stores user data, images (as binary data with metadata indexing [cite: 1]), trust profiles, and feedback[cite: 1].
    * **[Icon: Flowchart] Key Functional Flow (Example: Image Upload & Analysis):** User uploads image -> Image processing pipeline (upload → metadata extraction → AI detection → storage) [cite: 1] -> Data stored in DB -> Results displayed to user.

* **[Icon: Code] Technology Stack:**

    | Category       | Details                                                                         | Sources        |
    | :------------- | :------------------------------------------------------------------------------ | :------------- |
    | Backend        | Python 3.8+, Flask, SQLAlchemy                                                  | [cite: 2, 156] |
    | Frontend       | HTML, CSS, JavaScript (specific frameworks/libraries in templates/static dirs)  | [cite: 156]    |
    | Database       | SQLite (MyDatabase.db file, managed via SQLAlchemy/database.py)                 | [cite: 1, 156] |
    | External APIs  | Alibaba Cloud AIGC detection, ImgBB (for image hosting)                         | [cite: 2, 156] |
    | Key Libraries  | Pillow (PIL), Werkzeug, Flask-Login, Flask-SQLAlchemy, Flask-Mail, Flask-Session, alibabacloud_green20220302, requests, PyJWT | [cite: 2, 158] |

---

## 4. Access & Credentials

All sensitive credentials listed below have been communicated for secure transfer, as detailed in the email dated May 21, 2025. **Note:** API keys and sensitive credentials in the `.env` file must be handled securely and should *not* be committed to version control repositories[cite: 163].

---

## 5. Setup & Usage

### 5.1. Developer Guide

* **Repository Structure:** The code is organized into modules for routes, models, services (e.g., `aigc_detector.py`, `ExifExtractor/`), static files, and templates[cite: 1, 156, 158]. Refer to `README.md` in the repository for a general project overview[cite: 24, 190].
* **[Icon: Laptop] Local Development Environment Setup:** [cite: 159]
    1.  Clone repository: `git clone https://github.com/bridgeL/Trust-indicator.git ~/Trust-Indicator` [cite: 159]
    2.  Navigate to project directory: `cd ~/Trust-Indicator` [cite: 159]
    3.  Create and activate Python virtual environment: [cite: 160]
        * `python -m venv .venv` [cite: 160]
        * `source .venv/bin/activate` (Linux/macOS) or `.venv\Scripts\activate` (Windows) [cite: 160]
    4.  Install dependencies: `pip install -r requirements.txt` [cite: 160]
    5.  **Environment Variables Setup:** Create a `.env` file in the root directory and populate it with the necessary API keys and credentials as listed in Section 4 (Access & Credentials) and `note.pdf`[cite: 161, 162, 164]. **Do not commit this file**[cite: 163].
* **Database Initialization:** The SQLite database (`instance/MyDatabase.db`) will be created automatically on the first run if it doesn't exist[cite: 165].
* **Running the Application:** `python app.py` [cite: 166]
* **Key Libraries & Dependencies:** Refer to Section 3 and `requirements.txt`[cite: 2, 158].

### 5.2. Server Deployment

* For detailed deployment instructions, refer to **`docs/deploy.md`** in the GitHub repository[cite: 24, 166, 190]. (Link from email: `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/deploy.md`)
* **Key Steps Overview:** [cite: 166, 167, 168]
    1.  Server access and user account setup[cite: 167].
    2.  Environment setup (clone repository, virtual environment, dependency installation)[cite: 167].
    3.  Using `screen` for persistent application running[cite: 168].
    4.  Caddy reverse proxy configuration[cite: 168].

### 5.3. User Instructions

* A comprehensive **User Manual (`User Manual.pdf`)** has been provided as part of this handover[cite: 79]. It guides end-users on how to use the system's various features.
* **[Icon: Users] Core Functionalities Covered:**
    * Account Registration & Login [cite: 85, 92]
    * Image Exploration & Analysis (Gallery, Image Details) [cite: 100, 101, 105]
    * Image Upload [cite: 114]
    * Personalizing Trust Profile [cite: 123]
    * Managing User Profile [cite: 130]
    * Submitting Feedback [cite: 136]

---

## 6. Completed Features (Summary)

The project successfully delivered the core functionalities outlined in the S1 2025 Delivery Plan[cite: 1, 183]. All key technical features, including the image processing pipeline[cite: 1], RESTful API endpoints[cite: 1], and binary image storage with metadata indexing[cite: 1, 2], are implemented.

* **[Icon: User] User System:** Registration, login, logout[cite: 169], password change/reset (via email)[cite: 170], profile viewing, and avatar modification[cite: 171].
* **[Icon: Upload] Image Upload and Processing:**
    * User image upload (JPEG format only)[cite: 171].
    * Image storage as binary data and thumbnail generation[cite: 172].
    * EXIF Metadata Extractor[cite: 1, 173].
    * AIGC Detector (Alibaba Cloud integration [cite: 1, 174] with fallback for API disruptions [cite: 2, 175]).
    * Image tagging (Original, AIGC, Manipulation) and descriptions[cite: 176].
    * Image visibility settings (public/private)[cite: 176].
* **[Icon: Images] Image Browse and Details:**
    * Image gallery with filtering (tags, keywords) and sorting (upload time)[cite: 5, 177].
    * Image detail page displaying image, metadata, AIGC probability, tags, description[cite: 7, 178].
* **[Icon: ShieldCheck] Credibility Indicators and Report:**
    * Visual indicators for AI probability and metadata completeness on images[cite: 4].
    * User-configurable Trust Profile for personalized credibility preferences[cite: 1, 178].
    * Trust Report generated on image detail/analysis pages based on user's Trust Profile and image data[cite: 7, 179, 180].
* **[Icon: Search] Search Bar Function:** Image search by keyword[cite: 7, 177].
* **[Icon: Cog] Trust Profile:** Users can define preferences for AIGC thresholds[cite: 1, 178].
* **[Icon: Message] Feedback System:** Users can submit feedback (Bugs, Questions, Comments) via an online form, with email confirmation[cite: 1, 182].

---

## 7. Testing & Quality Assurance

* **Testing Strategy:** Thorough validation of seven core functional modules of the "Trust Indicator" project [cite: 203] to ensure functional correctness, data accuracy, smooth user experience, and system stability[cite: 204].
* **[Icon: Lab] Test Environment:** Backend: Python Flask; Database: SQLite; Frontend: HTML/CSS/JS; AIGC: Alibaba Cloud API; Browser: Chrome/Firefox (Latest)[cite: 205].
* **[Icon: CheckList] Summary of Test Results:** Detailed test cases and results are documented in **`test details.pdf`**[cite: 203].
    * All 43 designed test cases across the seven core modules (Image Upload System, AIGC Detection Module, Image Browse Interface, Credibility Indicator System, Search Bar Function, Trust Profile configuration, and Trust Report Feature) **passed successfully**[cite: 231].

    | Module                       | Status | Source(s) for Module Testing & Outcome |
    | :--------------------------- | :----- | :------------------------------------- |
    | Image Upload System          | ✅ Pass  | [cite: 206, 231]                       |
    | AIGC Detection Module        | ✅ Pass  | [cite: 210, 232]                       |
    | Image Browse Interface       | ✅ Pass  | [cite: 214, 233]                       |
    | Credibility Indicator System | ✅ Pass  | [cite: 218, 234]                       |
    | Search Bar Function          | ✅ Pass  | [cite: 221, 235]                       |
    | Trust Profile                | ✅ Pass  | [cite: 224, 236]                       |
    | Trust Report Feature         | ✅ Pass  | [cite: 227, 237]                       |

* **[Icon: CheckCircle] Non-Functional Requirements:** The system meets the specified non-functional requirements[cite: 15]:
    * **Performance:** The website should process uploaded images and return detection results within 5 seconds (95th percentile) under normal load[cite: 17].
    * **Availability:** The deployed website should maintain at least 99% uptime during the assessment period[cite: 18].
    * **Security:** User data must be securely stored and accessed using authentication and authorization mechanisms[cite: 19]. API keys handled via environment variables[cite: 163].
    * **Maintainability:** All features accompanied by comprehensive documentation[cite: 20]. Code includes inline comments to improve readability and future maintenance[cite: 21].
    * **Usability:** The system's web interface should be intuitive and user-friendly, providing clear feedback[cite: 22].

---

## 8. Documentation

The following documentation is provided via GitHub and as part of this handover package. All project materials, including assessment items like the video, are in the repositories (as per email checklist).

* **[Icon: Book] GitHub Documentation Links:** (Links from email and [cite: 190])
    * Project Overview (`total-project.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/total-project.md`
    * Deployment Guide (`deploy.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/deploy.md` [cite: 24]
    * Local Deployment Guide (`local-deploy.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/local-deploy.md`
    * API Specification (`docs-backend.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/docs-backend.md` [cite: 24]
    * Frontend Pages (`docs-page.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/docs-page.md` [cite: 24]
    * Request Protocol (`docs-request-type.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/docs-request-type.md` [cite: 25]
    * AIGC Detector Setup (`AIGC_DETECTOR_README.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/AIGC_DETECTOR_README.md` [cite: 24]
    * Database Documentation (`docs-database.md`): Located in `docs/` folder[cite: 24, 190].
    * Project Dependencies (`requirements.txt`): Located in project root[cite: 8, 190].
* **[Icon: FilePdf] Handover Package Documents:**
    * User Manual (`User Manual.pdf`) [cite: 4]
    * Backup & Recovery Plan (`Backlog&Revovery.pdf`)
    * Detailed Test Plan & Results (`test details.pdf`)
    * This Handover Document
    * `README.md` (Project Root in GitHub) [cite: 24, 190]

---

## 9. Maintenance & Support

### 9.1. [Icon: Database] Backup & Recovery Plan

A detailed **Backup & Recovery Plan (`Backlog&Revovery.pdf`)** is provided[cite: 26]. Key aspects include:

* **Key Assets to Back Up:** Source Code (Flask application, Python scripts, HTML, CSS, JS)[cite: 32], Database (SQLite file `MyDatabase.db` containing user info, image info, metadata, trust profiles)[cite: 32], Configuration Files (deployment scripts, environment variables, Caddy configs)[cite: 32], Project Documentation[cite: 32], and API Keys (instructions for retrieval/secure storage locations for Alibaba Cloud AIGC, ImgBB, email services)[cite: 32].
* **Backup Strategy:**
    * **Source Code:** Primarily via Git/GitHub (`https://github.com/bridgeL/Trust-indicator`)[cite: 35]; periodic offline clones[cite: 36]. Frequency: Git immediately after significant changes; Offline clones weekly or after major releases[cite: 37, 38].
    * **Database:** Daily file copy of `instance/MyDatabase.db`[cite: 41, 42, 44], synchronized to secure remote location (e.g., using rsync or secure cloud storage with encryption)[cite: 46]. Retention: daily for 7-14 days[cite: 47], weekly for 4-8 weeks[cite: 48], monthly for 6-12 months, and one annual backup[cite: 48, 49].
    * **Configuration Files:** Non-sensitive in Git[cite: 49]; sensitive (e.g., actual API keys in `.env`) via secure password manager or encrypted archive[cite: 50].
    * **Project Documentation:** Via Git for Markdown documents; Cloud Storage/Shared Drive (Google Drive, OneDrive, Dropbox) for binaries like PDFs[cite: 54, 55].
* **Recovery Procedures:** Detailed steps for restoring Source Code (from Git/offline backup)[cite: 61], Database (stop app, copy backup, verify, restart app)[cite: 62, 63, 64, 65], and Configuration Files (from Git/secure storage) [cite: 66] are outlined.
* **Testing & Security:** Plan includes quarterly testing of recovery procedures[cite: 69, 70, 71], encryption of backups[cite: 73], access control[cite: 74], integrity checks[cite: 75], and off-site storage[cite: 75].
* **Responsible Parties:** The plan includes placeholder roles[cite: 77]; **the next team should update this with actual responsible personnel**[cite: 78].

### 9.2. [Icon: Bug] Known Issues and Bugs

The project has undergone extensive testing and most core features have been validated[cite: 183]. However, the following are known risks/areas for attention:

* **AIGC API Dependency:** Service unavailability or exceeding quotas for the Alibaba Cloud AIGC API may block detection features[cite: 12, 184].
    * **Mitigation:** Implement local fallback or cache recent results to reduce API reliance[cite: 12, 185]. Fallback to simulated results is currently in place[cite: 175].
* **API Key Leakage:** Mishandling API keys could lead to security vulnerabilities or service suspension[cite: 12, 186].
    * **Mitigation:** Store sensitive keys appropriately (e.g., `.env` file not in repo, use password manager) and rotate keys periodically[cite: 12, 187].
* **Model Inaccuracy (Third-Party API):** Incorrect AI detection results from the third-party API may mislead users[cite: 12].
    * **Mitigation:** Display a disclaimer and provide confidence levels with explanations[cite: 12].
* **Frontend Refinement:** The frontend may have some minor UI/UX issues that require further testing and refinement[cite: 188].
* **Error Handling:** Some error handling and edge cases may need enhancement[cite: 189].

### 9.3. [Icon: Wrench] Maintenance Tips

* **API Key Management:** The next team **must apply for their own API keys** (Alibaba Cloud, ImgBB, email services) and update them in the server's environment variables / `.env` file[cite: 192]. Ensure continued secure handling[cite: 191].
* **Dependency Updates:** Regularly check libraries in `requirements.txt` for security updates or important version iterations and update as necessary[cite: 193].
* **Code Readability:** Continue maintaining and adding comments to the codebase to aid new members[cite: 21, 194].
* **Frontend Performance:** For image-heavy pages like the gallery, consider optimizing further (e.g., advanced lazy loading, virtual lists)[cite: 195].
* **Metadata Extensibility:** The `ExifExtractor` currently focuses on common EXIF tags. If support for more types of metadata (like XMP, IPTC) or more complex extraction logic is needed, this part can be extended[cite: 196, 197].
* **Testing:** It is recommended to write unit tests for core modules (e.g., AIGC detection, metadata extraction, user authentication, database operations)[cite: 198]. Conduct integration tests for API interfaces[cite: 199].
* **Asynchronous Tasks:** For time-consuming operations, consider using task queues (e.g., Celery) to improve user experience and avoid request timeouts[cite: 199].

---

## 10. Project Wrap-up & Future

* **[Icon: Lightbulb] Suggested Improvements for Client and Next Team:** (Based on `note.pdf` and `Final checklist.md`)
    * Further enhance frontend performance for image galleries[cite: 195].
    * Expand metadata support to include XMP, IPTC, etc.[cite: 197].
    * Develop a more comprehensive suite of automated unit and integration tests[cite: 198].
    * Implement asynchronous task handling for long-running processes[cite: 199].
    * Explore alternative or supplementary AIGC detection services or models.
    * Enhance the Trust Profile with more granular options[cite: 127].
* **[Icon: Archive] Jira PBI Export:**
    * The `TrustIndicator_Jira_Export.zip` (mentioned in the email, containing PBIs exported on 20/05/2025 [cite: 9]) contains all Product Backlog Items for archival purposes.
* **[Icon: Team] Retrospective:** (Summary of successes, challenges, lessons learned)
    * The project successfully delivered all core functionalities as per the plan [cite: 183] and passed all core feature tests[cite: 231]. Challenges included reliance on external APIs [cite: 12] and managing API key security[cite: 12]. Lessons learned include the importance of robust fallback mechanisms [cite: 12, 175] and secure credential management from the outset[cite: 163, 187]. (The "Final checklist.md" mentions "Notes from final retrospective"; if available, these should be attached or reviewed by the next team).

---

## 11. Appendices

* `.env` file (containing API keys and secrets for Alibaba Cloud, ImgBB, and Gmail SMTP) has been provided separately through secure means as detailed in the handover email.

---

We trust this handover document provides the necessary information for the continued success of the Trust Indicators project. We wish the next team all the best.

Sincerely,
**Team Trust Indicators (S1 2025)**
