# Trust Indicators Project: Final Handover Document

**Date:** May 21, 2025
**To:** Sabrina Caldwell (Client Stakeholder)
**From:** Team Trust Indicators (S1 2025)

**Table of Contents:**

1.  [Introduction & Project Sign-off](#1-introduction--project-sign-off)
2.  [Project Overview](#2-project-overview)
3.  [System Architecture & Technology Stack](#3-system-architecture--technology-stack)
4.  [Access & Credentials](#4-access--credentials)
5.  [Setup & Usage](#5-setup--usage)
6.  [Completed Features](#6-completed-features)
7.  [Testing & Quality Assurance](#7-testing--quality-assurance)
8.  [Documentation](#8-documentation)
9.  [Maintenance & Support](#9-maintenance--support)
10. [Project Wrap-up & Future](#10-project-wrap-up--future)
11. [Appendices](#11-appendices)

---

## 1. Introduction & Project Sign-off

This document marks the official handover of the Trust Indicators project from the S1 2025 development team. The project aimed to develop an Australian-themed image gallery website that helps users better understand and assess the authenticity of uploaded images by displaying their metadata and providing visual cues. This website is an open-source project, allowing users to upload their own images while adhering to Creative Commons (CC) licensing requirements. By collecting image metadata and displaying credibility signals, the website will assist users in identifying and discerning genuine images. Additionally, website members can contribute background information, such as photographer statements, to provide more contextual details. The project aims to offer consumers a reliable resource to enhance their ability to judge image authenticity and provides a platform for photographers and creators to showcase their work and offer additional information, thereby improving public understanding and awareness of images.

We sincerely thank the previous team for their valuable contributions to the project; their hard work and dedication have laid a solid foundation for us. For detailed information about the previous team's work, please refer to the materials provided at `https://github.com/Trust-Indicator/Trust-Indicator`.

**Team Members (S1 2025):**

| Role               | Name          | Semester | Contact (Email)       |
| :----------------- | :------------ | :------- | :-------------------- |
| Team Leader        | Juliang Xiao  | S1 2025  | u7757949@anu.edu.au   |
| Web Developer      | Xinyang Li    | S1 2025  | u7760022@anu.edu.au   |
| Frontend Engineer  | Yushan Zhang  | S1 2025  | u7759158@anu.edu.au   |
| Backend Engineer   | Kun Gong      | S1 2025  | u7628201@anu.edu.au   |
| Project Admin      | Chu Zhang     | S1 2025  | u7770023@anu.edu.au   |
| DataBase Engineer | Haifan Yang   | S1 2025   | u7776711@anu.edu.au |

**Project Completion Sign-off Request:**
As per our email communication on May 21, 2025, we presented the deliverables at the client meeting on May 21, 2025, at 11:30 AM for your formal review and acceptance. We kindly request your confirmation on the following post-meeting:
* [ ] **Project Acceptance:** All deliverables meet the agreed-upon requirements.
* [ ] **Credentials Reception:** Sensitive data has been securely transferred and received.
* [ ] **Ownership Transfer:** Maintenance responsibilities are formally transferred.

Thank you for your guidance throughout this project.

---

## 2. Project Overview

* **Project Scope & Main Features:** The project delivers a functional web application enabling users to upload images, view extracted metadata, see AI-generated content (AIGC) detection probabilities, and assess image authenticity through visual indicators and personalized trust profiles. Key features include user authentication, image gallery with filtering and sorting, detailed image view with metadata and AIGC results, a user-configurable trust profile, and a trust report system.
* **Final Outcomes:** A live, deployed website with all core functionalities tested and operational. Comprehensive technical and user documentation is provided.
* **[Icon: Globe] Landing Page:** `https://sites.google.com/view/trustindicators`
* **[Icon: Link] Live Project Website (Deployment URL):** Hosted on VPS with IP: `144.34.161.14` (access details provided securely).

---

## 3. System Architecture & Technology Stack

* **Overall System Architecture:**
    * **High-Level Architecture:** The system is a Flask-based web application with an SQLite/SQLAlchemy database. It features a modular design with separated routes, models, and services.
    * **[Icon: Diagram] Component Interaction:**
        * **AIGC Detector:** Integrates with Alibaba Cloud for AI-generated content detection.
        * **Metadata Extractor:** Uses EXIF data extraction from images for authenticity analysis.
        * **User System:** Handles authentication, profiles, and trust preferences.
        * **Database:** SQLite stores user data, images (as binary data with metadata indexing), trust profiles, and feedback.
    * **[Icon: Flowchart] Key Functional Flow (Example: Image Upload & Analysis):** User uploads image -> Image processing pipeline (upload → metadata extraction → AI detection → storage) -> Data stored in DB -> Results displayed to user.

* **[Icon: Code] Technology Stack:**

    | Category       | Details                                                                         |
    | :------------- | :------------------------------------------------------------------------------ |
    | Backend        | Python 3.8+, Flask, SQLAlchemy                                                  |
    | Frontend       | HTML, CSS, JavaScript (specific frameworks/libraries in templates/static dirs)  |
    | Database       | SQLite (MyDatabase.db file, managed via SQLAlchemy/database.py)                 |
    | External APIs  | Alibaba Cloud AIGC detection, ImgBB (for image hosting)                         |
    | Key Libraries  | Pillow (PIL), Werkzeug, Flask-Login, Flask-SQLAlchemy, Flask-Mail, Flask-Session, alibabacloud_green20220302, requests, PyJWT |

---

## 4. Access & Credentials

All sensitive credentials listed below have been communicated securely, as detailed in the email dated May 21, 2025. **Note:** API keys and sensitive credentials in the `.env` file must be handled securely and should *not* be committed to version control repositories.

* **[Icon: GitHub] Code Repositories:**
    * Main Repository: `https://github.com/bridgeL/Trust-indicator`
    * (Client Sabrina Caldwell has been provided with access to all repositories as per handover checklist).
* **[Icon: Email] Gmail SMTP (Email Service):**
    * Address: `trustindicator9@gmail.com`
    * Password: `(Provided securely via email)`
* **[Icon: Server] VPS Management (BandwagonHost):**
    * Account: `sabrina.caldwell@anu.edu.au`
    * Password: `(Provided securely via email)`
* **[Icon: Terminal] Server Access:**
    * SSH Port: `28264`
    * IP Address: `144.34.161.14`
    * Usernames/Passwords:
        * `root`: `<Resettable on BandwagonHost by client>`
        * `user-ti`: `(Password provided securely via email)`
* **[Icon: File] Environment Variables (`.env` file):**
    * An `.env` file containing the following has been provided securely:
        * Alibaba Cloud API Keys (`ALIBABA_CLOUD_ACCESS_KEY_ID`, `ALIBABA_CLOUD_ACCESS_KEY_SECRET`)
        * ImgBB API Key (`IMGBB_API_KEY`)
        * Gmail SMTP Credentials (`MAIL_USERNAME`, `MAIL_PASSWORD`)

---

## 5. Setup & Usage

### 5.1. Developer Guide

* **Repository Structure:** The code is organized into modules for routes, models, services (e.g., `aigc_detector.py`, `ExifExtractor/`), static files, and templates. Refer to `README.md` in the repository for a general project overview.
* **[Icon: Laptop] Local Development Environment Setup:** (Detailed in `docs/local-deploy.md`)
    1.  Clone repository: `git clone https://github.com/bridgeL/Trust-indicator.git ~/Trust-Indicator`
    2.  Navigate to project directory: `cd ~/Trust-Indicator`
    3.  Create and activate Python virtual environment:
        * `python -m venv .venv`
        * `source .venv/bin/activate` (Linux/macOS) or `.venv\Scripts\activate` (Windows)
    4.  Install dependencies: `pip install -r requirements.txt`
    5.  **Environment Variables Setup:** Create a `.env` file in the root directory and populate it with the necessary API keys and credentials as listed in Section 4 (Access & Credentials). **Do not commit this file**.
* **Database Initialization:** The SQLite database (`instance/MyDatabase.db`) will be created automatically on the first run if it doesn't exist.
* **Running the Application:** `python app.py`
* **Key Libraries & Dependencies:** Refer to Section 3 and `requirements.txt`.

### 5.2. Server Deployment

* For detailed deployment instructions, refer to **`docs/deploy.md`** in the GitHub repository (`https://github.com/bridgeL/Trust-Indicator/blob/master/docs/deploy.md`).
* **Key Steps Overview:**
    1.  Server access and user account setup.
    2.  Environment setup (clone repository, virtual environment, dependency installation).
    3.  Using `screen` for persistent application running.
    4.  Caddy reverse proxy configuration.

### 5.3. User Instructions

* A comprehensive **User Manual (`User Manual.pdf`)** has been provided as part of this handover. It guides end-users on how to use the system's various features.
* **[Icon: Users] Core Functionalities Covered:**
    * Account Registration & Login
    * Image Exploration & Analysis (Gallery, Image Details)
    * Image Upload
    * Personalizing Trust Profile
    * Managing User Profile
    * Submitting Feedback

---

## 6. Completed Features (Summary)

The project successfully delivered the core functionalities outlined in the S1 2025 Delivery Plan. All key technical features, including the image processing pipeline, RESTful API endpoints, and binary image storage with metadata indexing, are implemented.

* **[Icon: User] User System:** Registration, login, logout, password change/reset (via email), profile viewing, and avatar modification.
* **[Icon: Upload] Image Upload and Processing:**
    * User image upload (JPEG format only).
    * Image storage as binary data and thumbnail generation.
    * EXIF Metadata Extractor.
    * AIGC Detector (Alibaba Cloud integration with fallback for API disruptions).
    * Image tagging (Original, AIGC, Manipulation) and descriptions.
    * Image visibility settings (public/private).
* **[Icon: Images] Image Browse and Details:**
    * Image gallery with filtering (tags, keywords) and sorting (upload time).
    * Image detail page displaying image, metadata, AIGC probability, tags, description.
* **[Icon: ShieldCheck] Credibility Indicators and Report:**
    * Visual indicators for AI probability and metadata completeness on images.
    * User-configurable Trust Profile for personalized credibility preferences.
    * Trust Report generated on image detail/analysis pages based on user's Trust Profile and image data.
* **[Icon: Search] Search Bar Function:** Image search by keyword.
* **[Icon: Cog] Trust Profile:** Users can define preferences for AIGC thresholds.
* **[Icon: Message] Feedback System:** Users can submit feedback (Bugs, Questions, Comments) via an online form, with email confirmation.

---

## 7. Testing & Quality Assurance

* **Testing Strategy:** Thorough validation of seven core functional modules of the "Trust Indicator" project to ensure functional correctness, data accuracy, smooth user experience, and system stability (as detailed in `test details.pdf`).
* **[Icon: Lab] Test Environment:** Backend: Python Flask; Database: SQLite; Frontend: HTML/CSS/JS; AIGC: Alibaba Cloud API; Browser: Chrome/Firefox (Latest).
* **[Icon: CheckList] Summary of Test Results:** Detailed test cases and results are documented in **`test details.pdf`**.
    * All 43 designed test cases across the seven core modules (Image Upload System, AIGC Detection Module, Image Browse Interface, Credibility Indicator System, Search Bar Function, Trust Profile configuration, and Trust Report Feature) **passed successfully**.

    | Module                       | Status |
    | :--------------------------- | :----- |
    | Image Upload System          | ✅ Pass  |
    | AIGC Detection Module        | ✅ Pass  |
    | Image Browse Interface       | ✅ Pass  |
    | Credibility Indicator System | ✅ Pass  |
    | Search Bar Function          | ✅ Pass  |
    | Trust Profile                | ✅ Pass  |
    | Trust Report Feature         | ✅ Pass  |

* **[Icon: CheckCircle] Non-Functional Requirements:** The system meets the specified non-functional requirements (detailed in the `24-S2 Trust indicators delivery plan.pdf`):
    * **Performance:** The website should process uploaded images and return detection results within 5 seconds (95th percentile) under normal load.
    * **Availability:** The deployed website should maintain at least 99% uptime during the assessment period.
    * **Security:** User data must be securely stored and accessed using authentication and authorization mechanisms. API keys handled via environment variables.
    * **Maintainability:** All features accompanied by comprehensive documentation. Code includes inline comments to improve readability and future maintenance.
    * **Usability:** The system's web interface should be intuitive and user-friendly, providing clear feedback.

---

## 8. Documentation

The following documentation is provided via GitHub and as part of this handover package. All project materials, including assessment items like the video, are in the repositories (as per the final checklist from the email).

* **[Icon: Book] GitHub Documentation Links:**
    * Project Overview (`total-project.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/total-project.md`
    * Deployment Guide (`deploy.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/deploy.md`
    * Local Deployment Guide (`local-deploy.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/local-deploy.md`
    * API Specification (`docs-backend.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/docs-backend.md`
    * Frontend Pages (`docs-page.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/docs-page.md`
    * Request Protocol (`docs-request-type.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/docs-request-type.md`
    * AIGC Detector Setup (`AIGC_DETECTOR_README.md`): `https://github.com/bridgeL/Trust-Indicator/blob/master/docs/AIGC_DETECTOR_README.md`
    * Database Documentation (`docs-database.md`): Located in `docs/` folder in the GitHub repository.
    * Project Dependencies (`requirements.txt`): Located in project root in the GitHub repository.
* **[Icon: FilePdf] Handover Package Documents:**
    * User Manual (`User Manual.pdf`)
    * Backup & Recovery Plan (`Backlog&Revovery.pdf`)
    * Detailed Test Plan & Results (`test details.pdf`)
    * This Handover Document
    * `README.md` (Project Root in GitHub)

---

## 9. Maintenance & Support

### 9.1. [Icon: Database] Backup & Recovery Plan

A detailed **Backup & Recovery Plan (`Backlog&Revovery.pdf`)** is provided. Key aspects include:

* **Key Assets to Back Up:** Source Code (Flask application, Python scripts, HTML, CSS, JS), Database (SQLite file `MyDatabase.db` containing user info, image info, metadata, trust profiles), Configuration Files (deployment scripts, environment variables, Caddy configs), Project Documentation, and API Keys (instructions for retrieval/secure storage locations for Alibaba Cloud AIGC, ImgBB, email services).
* **Backup Strategy:**
    * **Source Code:** Primarily via Git/GitHub (`https://github.com/bridgeL/Trust-indicator`); periodic offline clones. Frequency: Git immediately after significant changes; Offline clones weekly or after major releases.
    * **Database:** Daily file copy of `instance/MyDatabase.db`, synchronized to secure remote location (e.g., using rsync or secure cloud storage with encryption). Retention: daily for 7-14 days, weekly for 4-8 weeks, monthly for 6-12 months, and one annual backup.
    * **Configuration Files:** Non-sensitive in Git; sensitive (e.g., actual API keys in `.env`) via secure password manager or encrypted archive.
    * **Project Documentation:** Via Git for Markdown documents; Cloud Storage/Shared Drive (Google Drive, OneDrive, Dropbox) for binaries like PDFs.
* **Recovery Procedures:** Detailed steps for restoring Source Code (from Git/offline backup), Database (stop app, copy backup, verify, restart app), and Configuration Files (from Git/secure storage) are outlined.
* **Testing & Security:** Plan includes quarterly testing of recovery procedures, encryption of backups, access control, integrity checks, and off-site storage.
* **Responsible Parties:** The plan includes placeholder roles; **the next team should update this with actual responsible personnel**.

### 9.2. [Icon: Bug] Known Issues and Bugs

The project has undergone extensive testing and most core features have been validated (see `test details.pdf`). However, the following are known risks/areas for attention (identified in `24-S2 Trust indicators delivery plan.pdf` and `note.pdf`):

* **AIGC API Dependency:** Service unavailability or exceeding quotas for the Alibaba Cloud AIGC API may block detection features.
    * **Mitigation:** Implement local fallback or cache recent results to reduce API reliance. Fallback to simulated results is currently in place.
* **API Key Leakage:** Mishandling API keys could lead to security vulnerabilities or service suspension.
    * **Mitigation:** Store sensitive keys appropriately (e.g., `.env` file not in repo, use password manager) and rotate keys periodically. The client has been provided with keys securely.
* **Model Inaccuracy (Third-Party API):** Incorrect AI detection results from the third-party API may mislead users.
    * **Mitigation:** Display a disclaimer and provide confidence levels with explanations.
* **Frontend Refinement:** The frontend may have some minor UI/UX issues that require further testing and refinement.
* **Error Handling:** Some error handling and edge cases may need enhancement.

### 9.3. [Icon: Wrench] Maintenance Tips

(From `note.pdf`)
* **API Key Management:** The next team **must apply for their own API keys** (Alibaba Cloud, ImgBB, email services) and update them in the server's environment variables / `.env` file. Ensure continued secure handling.
* **Dependency Updates:** Regularly check libraries in `requirements.txt` for security updates or important version iterations and update as necessary.
* **Code Readability:** Continue maintaining and adding comments to the codebase to aid new members.
* **Frontend Performance:** For image-heavy pages like the gallery, consider optimizing further (e.g., advanced lazy loading, virtual lists).
* **Metadata Extensibility:** The `ExifExtractor` currently focuses on common EXIF tags. If support for more types of metadata (like XMP, IPTC) or more complex extraction logic is needed, this part can be extended.
* **Testing:** It is recommended to write unit tests for core modules (e.g., AIGC detection, metadata extraction, user authentication, database operations). Conduct integration tests for API interfaces.
* **Asynchronous Tasks:** For time-consuming operations, consider using task queues (e.g., Celery) to improve user experience and avoid request timeouts.

---

## 10. Project Wrap-up & Future

* **[Icon: Lightbulb] Suggested Improvements for Client and Next Team:** (Based on `note.pdf` and `Final checklist.md`)
    * Further enhance frontend performance for image galleries.
    * Expand metadata support to include XMP, IPTC, etc.
    * Develop a more comprehensive suite of automated unit and integration tests.
    * Implement asynchronous task handling for long-running processes.
    * Explore alternative or supplementary AIGC detection services or models.
    * Enhance the Trust Profile with more granular options.
* **[Icon: Archive] Jira PBI Export:**
    * The `TrustIndicator_Jira_Export.zip` (mentioned in the email, containing PBIs exported on 20/05/2025) contains all Product Backlog Items (requirements, tasks, and timeline) from Jira for archival purposes.
* **[Icon: Team] Retrospective:** (Summary of successes, challenges, lessons learned)
    * The project successfully delivered all core functionalities as per the plan and passed all core feature tests. Challenges included reliance on external APIs and managing API key security. Lessons learned include the importance of robust fallback mechanisms and secure credential management from the outset. (The `Final checklist.md` mentions "Notes from final retrospective"; if available, these should be reviewed by the next team).

---

## 11. Appendices

* `.env` file (containing API keys and secrets for Alibaba Cloud, ImgBB, and Gmail SMTP) has been provided separately through secure means as detailed in the handover email.

---

We trust this handover document provides the necessary information for the continued success of the Trust Indicators project. We wish the next team all the best.

Sincerely,
**Team Trust Indicators (S1 2025)**
