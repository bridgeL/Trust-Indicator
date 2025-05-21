# 🌟 Key Reminders and Considerations for S2 2025 Team – Trust Indicators Project 🌟

This document outlines key reminders, critical focus areas, and advice for the incoming S2 2025 team to ensure a smooth continuation and successful further development of the Trust Indicators project.

## 🚀 General Reminders & Best Practices

1.  **📚 Familiarize Yourself with Existing Documentation:** Thoroughly review all handover documents, including:
    * The Main Handover Document
    * User Manual (`User Manual.pdf`)
    * Deployment Guides (`deploy.md`, `local-deploy.md`)
    * API Specifications (`docs-backend.md`)
    * Backup & Recovery Plan (`Backlog&Revovery.pdf`)
    * AIGC Detector Setup & Readme (`AIGC_DETECTOR_README.md`)
    * Test Plan & Results (`test details.pdf`)
    * All `docs/*.md` files in the repository.

2.  **🔑 API Key Management:** This is crucial.
    * The S1 2025 team has handed over existing API keys securely. However, for enhanced security and to comply with service provider terms, the S2 2025 team **must apply for your own new API keys** for Alibaba Cloud, ImgBB, and any email services.
    * Update these new keys in the server's environment variables / `.env` file.
    * **Never commit API keys or sensitive credentials directly into the Git repository.** Use the `.env` file (which is in `.gitignore`) for local development and appropriate environment variable management for deployment.

3.  **🔄 Version Control (Git):**
    * Continue to use Git for version control.
    * Make frequent, small, and well-described commits.
    * Utilize branches for new features or significant changes to keep the main branch stable.
    * Regularly push changes to the GitHub repository: `https://github.com/bridgeL/Trust-indicator`.

4.  **🔧 Dependency Management:**
    * Regularly check the libraries listed in `requirements.txt` for security updates or important version iterations using `pip list --outdated`.
    * Test thoroughly after updating dependencies.

5.  **✍️ Code Readability & Comments:**
    * Continue the practice of writing clean, readable code.
    * Add comments where necessary to explain complex logic, assumptions, or "why" something is done, not just "what" is done. This greatly helps new team members and future maintenance.

6.  **🧪 Testing:**
    * While the S1 team performed extensive testing on core features, continue to test any new features or modifications thoroughly.
    * Consider writing more unit tests for backend modules (e.g., AIGC detection logic, metadata extraction, database operations) and integration tests for API endpoints.
    * Test frontend changes across different browsers and screen sizes.

7.  **🤝 Team Communication & Collaboration:**
    * Establish regular team meetings and clear communication channels.
    * Define roles and responsibilities within the new team.
    * Maintain open communication with your tutor and the client (Sabrina Caldwell).

## 🎯 Critical Focus Areas for S2 2025

Based on feedback from the S1 team, client, and tutor, the following areas require particular attention:

### 1. 🛡️ Enhanced Security & Client Data Privacy

Security is paramount, especially concerning user data and image authenticity.

* **Website Login & Password Security:**
    * Review and potentially enhance existing password policies (e.g., complexity requirements, expiry).
    * Ensure robust protection against common web vulnerabilities (e.g., XSS, CSRF, SQL Injection – SQLAlchemy helps with the latter, but always be mindful).
    * Consider implementing multi-factor authentication (MFA) for user accounts, especially for any admin roles, if scope permits.
* **Image Security (General):**
    * While images are stored as binary data in the database, ensure that access controls are strictly enforced so private images remain private.
    * Be mindful of potential security issues if images are processed by external libraries (ensure libraries are up-to-date).
* **Client Privacy & Data Handover/Management:**
    * **Principle of Least Privilege:** Ensure that only necessary data is collected from users.
    * **Data Access:** Strictly control who has access to the production database and any backups. Document access protocols.
    * **Personally Identifiable Information (PII):** Be extremely careful with any PII. Understand ANU's privacy policies and Australian privacy laws.
    * **Image Content:** While users upload images, consider mechanisms or guidelines regarding sensitive content if this becomes a concern.
    * **Handover of User Data (if any, to client upon project end):** If the project involves a formal handover of a live system with user data to the client institutionally (beyond just code), this process must be formally documented and follow strict privacy and data transfer protocols defined by ANU and the client. Consult with your tutor on this.
* **Client Image Security (Uploaded Images):**
    * Ensure the visibility settings (public/private) for images are robustly implemented and respected throughout the application.
    * Protect against unauthorized access or modification of uploaded images.
    * Regularly review file permission settings on the server where images/database might be stored or backed up.

### 2. ❓ Handling Client Sign-off & Feedback

Formal acceptance by the client is a key project milestone.

* **If Client Sign-off is Delayed or Not Received:**
    * **Proactive Communication:** Don't wait until the last minute. Maintain regular communication with the client (Sabrina Caldwell) throughout the semester, showcasing progress and gathering feedback continuously.
    * **Understand Concerns:** If sign-off is withheld, professionally seek to understand the specific reasons or concerns. Are there outstanding issues? Misunderstandings about scope or deliverables?
    * **Document Everything:** Keep records of all communications, meeting minutes, feedback received, and actions taken to address concerns. This is vital.
    * **Review Requirements:** Revisit the project requirements and deliverables agreed upon at the start of S2. Demonstrate how these have been met.
    * **Seek Tutor Guidance:** Inform your tutor about the situation and seek their advice on how to proceed. They can help mediate or provide an academic perspective.
    * **Negotiate & Plan:** If there are genuine shortcomings, discuss a plan to address them within a reasonable timeframe, if possible. If it's a matter of differing expectations, clear and documented discussion is key.
    * **Final Report:** Regardless of sign-off, your academic requirements will include final reports and presentations. Ensure these comprehensively document your work, achievements, any outstanding issues, and the client feedback situation.

### 3. 🎨 Frontend Refinement & Addressing "Factors" – TOP PRIORITY 🌟

**This has been highlighted as the most important task for the S2 2025 semester from the client and tutor's perspective.**


* **Key Areas for Investigation & Improvement:**
    * **User Experience (UX) Review:** Conduct a thorough review of the user journey for all key features. Identify any points of friction, confusion, or inefficiency.
    * **UI Consistency:** Ensure a consistent design language (colors, fonts, spacing, component behavior) across all pages.
    * **Responsiveness & Performance:**
        * Pay special attention to the image gallery and image detail pages, especially regarding loading times for many or large images. The S1 team suggested looking into advanced image lazy loading or virtual lists.
        * Ensure the entire site is fully responsive and performs well on various devices (desktops, tablets, mobiles).
    * **Code Quality & Maintainability:**
        * Refactor complex JavaScript/HTML/CSS sections if they are difficult to understand or modify.
        * Ensure frontend code is well-organized. Consider if CSS can be further optimized (e.g., removing unused styles, better organization).
    * **Address Minor UI/UX Issues:** The S1 handover mentioned "minor UI/UX issues that require further testing and refinement." Actively seek these out and address them.
    * **Accessibility (a11y):** Review the site for basic web accessibility compliance (e.g., keyboard navigation, ARIA attributes where needed, sufficient color contrast). This is good practice and often a requirement.
* **Action Plan:**
    * **Early Assessment:** Dedicate time at the beginning of the semester to deeply analyze the current frontend.
    * **Gather Feedback:** Actively solicit specific feedback from the client (Sabrina) and tutor  on areas they see as problematic "factors."
    * **Prioritize:** Create a prioritized list of frontend tasks based on impact and effort.
    * **Iterate & Test:** Implement changes iteratively and test them thoroughly with users (if possible) and across devices.

## 💡 Other General Tips from S1 Team

* **Asynchronous Tasks:** For potentially time-consuming operations (like AIGC detection if it were to be scaled or applied to very large images/batches), the S1 team suggested considering task queues like Celery to improve responsiveness. This might be relevant if new features increase such loads.
* **Extensibility of Metadata Extraction:** The current `ExifExtractor` focuses on common EXIF tags. If broader metadata support (XMP, IPTC) is needed, this module can be extended.

Good luck with the continued development of the Trust Indicators project! We hope these reminders and pointers are helpful.

Best regards,
Team Trust Indicators (S1 2025)