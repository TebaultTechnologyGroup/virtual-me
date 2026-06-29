interface ContactInfo {
    address?: string;
    phone?: string;
    email?: string;
    linkedin_url?: string;
}

interface JobEntry {
    company_name: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    position: string;
    description?: string;
    accomplishments?: string[];
    awards?: string[];
}

interface EducationEntry {
    institution?: string;
    degree?: string;
    field_of_study?: string;
    graduation_year?: string;
    location?: string;
    honors?: string;
}

interface CertificationEntry {
    name: string;
    issuer?: string;
    date?: string;
    credential_id?: string;
}

interface ResumeData {
    title?: string;
    contact?: ContactInfo;
    summary?: string;
    skills?: string[];
    job_history?: JobEntry[];
    education?: EducationEntry[];
    certifications?: CertificationEntry[];
}

/**
 * Converts a resume JSON object into an ATS-friendly HTLM document.
 *
 * ATS considerations applied:
 * - Plain headings
 * - Contact info as inline text — not in tables or columns
 * - Skills as a delimited list (most ATS parsers handle this better than bullets)
 * - Accomplishments as bullet points under each role
 * - Consistent date format preserved from input
 * - No icons, emojis, columns, or multi-column layouts
 */
export function createResumeHtml(resumeJson: JSON): string {
    const resume = resumeJson as unknown as ResumeData;
    const lines: string[] = [];

    // ── Name / Title ──────────────────────────────────────────────────
    if (resume.title) {
        lines.push(`<h1>${resume.title}</h1>`);
        lines.push("");
    }

    // ── Contact Information ───────────────────────────────────────────
    if (resume.contact) {
        const c = resume.contact;
        const contactParts: string[] = [];

        if (c.address) contactParts.push(c.address);
        if (c.phone) contactParts.push(c.phone);
        if (c.email) contactParts.push(c.email);
        if (c.linkedin_url) contactParts.push(c.linkedin_url);

        if (contactParts.length > 0) {
            lines.push("<small>");
            lines.push(contactParts.join(" | "));
            lines.push("</small>");
            lines.push("");
        }
    }

    // ── Summary ───────────────────────────────────────────────────────
    if (resume.summary?.trim()) {
        lines.push("<p>");
        lines.push(resume.summary.trim());
        lines.push("</p>");
    }

    // ── Skills ────────────────────────────────────────────────────────
    if (resume.skills && resume.skills.length > 0) {
        lines.push("<h2>Skills</h2>");
        lines.push("");
        lines.push(resume.skills.join(" | "));
        lines.push("");
    }

    // ── Work Experience ───────────────────────────────────────────────
    if (resume.job_history && resume.job_history.length > 0) {
        lines.push("<h2>Work Experience</h2>");
        lines.push("");

        for (const job of resume.job_history) {
            // Company and location on one line
            const companyLine = job.location
                ? `<h3>${job.company_name} — ${job.location}</h3>`
                : `<h3>${job.company_name}<h3>`;
            lines.push(companyLine);

            // Position and date range
            const dateRange = [job.start_date, job.end_date]
                .filter(Boolean)
                .join(" - ");
            const roleHeader = dateRange
                ? `<h4>${job.position} | ${dateRange}</h4>`
                : `<h4>${job.position}</h4>`;
            lines.push(roleHeader);
            lines.push("");

            // Role description
            if (job.description?.trim()) {
                lines.push("<p>");
                lines.push(job.description.trim());
                lines.push("</p>");
            }

            // Accomplishments
            if (job.accomplishments && job.accomplishments.length > 0) {
                lines.push("<ul>");
                for (const item of job.accomplishments) {
                    lines.push(`<li>${item}</li>`);
                }
                lines.push("</ul>");
            }

            // Awards
            if (job.awards && job.awards.length > 0) {
                lines.push("<b>Awards:</b>");
                lines.push("<ul>");
                for (const award of job.awards) {
                    lines.push(`<l>${award}</li>`);
                }
                lines.push("</ul>");
            }
        }
    }

    // ── Education ─────────────────────────────────────────────────────
    if (resume.education && resume.education.length > 0) {
        lines.push("<h2>Education</h2>");
        lines.push("");

        for (const edu of resume.education) {
            const institutionLine = edu.location
                ? `<b>${edu.institution}</b> — ${edu.location}`
                : `<b>${edu.institution}</b>`;
            lines.push(institutionLine);

            const degreeParts: string[] = [];
            if (edu.degree) degreeParts.push(edu.degree);
            if (edu.field_of_study) degreeParts.push(edu.field_of_study);
            if (edu.graduation_year) degreeParts.push(edu.graduation_year);

            if (degreeParts.length > 0) {
                lines.push(degreeParts.join(", "));
            }

            if (edu.honors?.trim()) {
                lines.push("<ul>");
                lines.push(`<li>${edu.honors.trim()}</li>`);
            }

            lines.push("/<ul>");
        }
    }

    // ── Certifications ────────────────────────────────────────────────
    if (resume.certifications && resume.certifications.length > 0) {
        lines.push("<h2>Certifications</h2>");
        lines.push("");

        lines.push("<ul>");
        for (const cert of resume.certifications) {

            const certParts: string[] = [`<b>${cert.name}</b>`];
            if (cert.issuer) certParts.push(cert.issuer);
            if (cert.date) certParts.push(cert.date);
            if (cert.credential_id) certParts.push(`ID: ${cert.credential_id}`);
            lines.push("<li>");
            lines.push(certParts.join(", "));
            lines.push("</li>");

        }

        lines.push("</ul>");
    }

    return lines.join("").trimEnd();
}