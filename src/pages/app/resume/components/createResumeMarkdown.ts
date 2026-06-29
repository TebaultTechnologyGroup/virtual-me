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
 * Converts a resume JSON object into an ATS-friendly Markdown string.
 *
 * ATS considerations applied:
 * - Plain headings (##, ###) with no special characters
 * - Contact info as inline text — not in tables or columns
 * - Skills as a comma-separated list (most ATS parsers handle this better than bullets)
 * - Accomplishments as bullet points under each role
 * - Consistent date format preserved from input
 * - No icons, emojis, columns, or multi-column layouts
 */
export function createResumeMarkdown(resumeJson: JSON): string {
    const resume = resumeJson as unknown as ResumeData;
    const lines: string[] = [];

    // ── Name / Title ──────────────────────────────────────────────────
    if (resume.title) {
        lines.push(`# ${resume.title}`);
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
            lines.push(contactParts.join(" | "));
            lines.push("");
        }
    }

    // ── Summary ───────────────────────────────────────────────────────
    if (resume.summary?.trim()) {
        lines.push("## Summary");
        lines.push("");
        lines.push(resume.summary.trim());
        lines.push("");
    }

    // ── Skills ────────────────────────────────────────────────────────
    if (resume.skills && resume.skills.length > 0) {
        lines.push("## Skills");
        lines.push("");
        lines.push(resume.skills.join(", "));
        lines.push("");
    }

    // ── Work Experience ───────────────────────────────────────────────
    if (resume.job_history && resume.job_history.length > 0) {
        lines.push("## Work Experience");
        lines.push("");

        for (const job of resume.job_history) {
            // Company and location on one line
            const companyLine = job.location
                ? `### ${job.company_name} — ${job.location}`
                : `### ${job.company_name}`;
            lines.push(companyLine);

            // Position and date range
            const dateRange = [job.start_date, job.end_date]
                .filter(Boolean)
                .join(" – ");
            const roleHeader = dateRange
                ? `**${job.position}** | ${dateRange}`
                : `**${job.position}**`;
            lines.push(roleHeader);
            lines.push("");

            // Role description
            if (job.description?.trim()) {
                lines.push(job.description.trim());
                lines.push("");
            }

            // Accomplishments
            if (job.accomplishments && job.accomplishments.length > 0) {
                for (const item of job.accomplishments) {
                    lines.push(`- ${item}`);
                }
                lines.push("");
            }

            // Awards
            if (job.awards && job.awards.length > 0) {
                lines.push("**Awards:**");
                for (const award of job.awards) {
                    lines.push(`- ${award}`);
                }
                lines.push("");
            }
        }
    }

    // ── Education ─────────────────────────────────────────────────────
    if (resume.education && resume.education.length > 0) {
        lines.push("## Education");
        lines.push("");

        for (const edu of resume.education) {
            const institutionLine = edu.location
                ? `### ${edu.institution} — ${edu.location}`
                : `### ${edu.institution}`;
            lines.push(institutionLine);

            const degreeParts: string[] = [];
            if (edu.degree) degreeParts.push(edu.degree);
            if (edu.field_of_study) degreeParts.push(edu.field_of_study);
            if (edu.graduation_year) degreeParts.push(edu.graduation_year);

            if (degreeParts.length > 0) {
                lines.push(degreeParts.join(", "));
            }

            if (edu.honors?.trim()) {
                lines.push(`*${edu.honors.trim()}*`);
            }

            lines.push("");
        }
    }

    // ── Certifications ────────────────────────────────────────────────
    if (resume.certifications && resume.certifications.length > 0) {
        lines.push("## Certifications");
        lines.push("");

        for (const cert of resume.certifications) {
            const certParts: string[] = [`**${cert.name}**`];
            if (cert.issuer) certParts.push(cert.issuer);
            if (cert.date) certParts.push(cert.date);
            if (cert.credential_id) certParts.push(`ID: ${cert.credential_id}`);

            lines.push(`- ${certParts.join(" | ")}`);
        }

        lines.push("");
    }

    return lines.join("\n").trimEnd();
}