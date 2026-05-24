"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Briefcase, Mail, Phone, User, Link as LinkIcon, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const JOBS = [
  "IT Officer",
  "System Administrator",
  "SOC Analyst",
  "Network Support Engineer",
  "AI Automation Engineer",
];

export default function JobApplicationPortal() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    linkedinUrl: "",
    portfolioUrl: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const webhookUrl = "https://n8n.imaginationai.net/webhook/job-application";

  const canSubmit = useMemo(() => {
    return form.fullName && form.email && form.phone && form.jobTitle && resume;
  }, [form, resume]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setStatus({ type: "error", message: "Please upload resume in PDF format only." });
      return;
    }

    if (file.size > maxSize) {
      setStatus({ type: "error", message: "Resume file must be smaller than 5MB." });
      return;
    }

    setResume(file);
    setStatus({ type: "idle", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit) {
      setStatus({ type: "error", message: "Please fill all required fields and upload your resume." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const payload = new FormData();
      payload.append("fullName", form.fullName);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("jobTitle", form.jobTitle);
      payload.append("linkedinUrl", form.linkedinUrl);
      payload.append("portfolioUrl", form.portfolioUrl);
      payload.append("coverLetter", form.coverLetter);
      payload.append("resume", resume);
      payload.append("source", "Job Application Portal");
      payload.append("submittedAt", new Date().toISOString());

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Application submission failed.");
      }

      setStatus({ type: "success", message: "Application submitted successfully. Our hiring team will review your profile." });
      setForm({
        fullName: "",
        email: "",
        phone: "",
        jobTitle: "",
        linkedinUrl: "",
        portfolioUrl: "",
        coverLetter: "",
      });
      setResume(null);
      event.target.reset();
    } catch (error) {
      setStatus({ type: "error", message: "Could not submit application. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[0.9fr_1.1fr] md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            <Briefcase size={16} /> AI Powered Hiring Portal
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Apply for the right role. Let AI help us match your skills.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Submit your resume for one of our open roles. Your application will be securely stored and analyzed against the selected job description using our internal AI screening workflow.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
              <CheckCircle2 className="text-cyan-300" size={20} /> Resume routed to the correct job folder
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
              <CheckCircle2 className="text-cyan-300" size={20} /> AI screening report created for HR
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
              <CheckCircle2 className="text-cyan-300" size={20} /> Shortlisted profiles are moved automatically
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <Card className="rounded-3xl border-white/10 bg-white/10 shadow-2xl backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white">Job Application Form</h2>
              <p className="mt-2 text-sm text-slate-300">Fields marked with * are required.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <Field icon={<User size={18} />} label="Full Name *">
                  <input
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className="input"
                    placeholder="Enter your full name"
                  />
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field icon={<Mail size={18} />} label="Email *">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="input"
                      placeholder="name@email.com"
                    />
                  </Field>

                  <Field icon={<Phone size={18} />} label="Phone *">
                    <input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="input"
                      placeholder="+92..."
                    />
                  </Field>
                </div>

                <Field icon={<Briefcase size={18} />} label="Job Applied For *">
                  <select
                    value={form.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    className="input"
                  >
                    <option value="">Select a job</option>
                    {JOBS.map((job) => (
                      <option key={job} value={job}>{job}</option>
                    ))}
                  </select>
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field icon={<LinkIcon size={18} />} label="LinkedIn URL">
                    <input
                      value={form.linkedinUrl}
                      onChange={(e) => updateField("linkedinUrl", e.target.value)}
                      className="input"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </Field>

                  <Field icon={<LinkIcon size={18} />} label="Portfolio URL">
                    <input
                      value={form.portfolioUrl}
                      onChange={(e) => updateField("portfolioUrl", e.target.value)}
                      className="input"
                      placeholder="https://yourportfolio.com"
                    />
                  </Field>
                </div>

                <Field icon={<Upload size={18} />} label="Resume PDF *">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-500 bg-slate-900/60 px-4 py-6 text-center transition hover:border-cyan-300 hover:bg-cyan-400/10">
                    <Upload className="mb-2 text-cyan-300" size={26} />
                    <span className="text-sm text-slate-200">{resume ? resume.name : "Click to upload PDF resume"}</span>
                    <span className="mt-1 text-xs text-slate-400">PDF only, max 5MB</span>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                </Field>

                <Field icon={<FileText size={18} />} label="Cover Letter / Notes">
                  <textarea
                    value={form.coverLetter}
                    onChange={(e) => updateField("coverLetter", e.target.value)}
                    className="input min-h-28 resize-none"
                    placeholder="Write a short note about your experience..."
                  />
                </Field>

                {status.message && (
                  <div className={`flex items-start gap-2 rounded-2xl p-4 text-sm ${status.type === "success" ? "bg-emerald-400/10 text-emerald-200" : "bg-red-400/10 text-red-200"}`}>
                    {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{status.message}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full rounded-2xl bg-cyan-400 py-6 text-base font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          background: rgba(15, 23, 42, 0.75);
          padding: 0.85rem 1rem;
          color: white;
          outline: none;
        }
        .input:focus {
          border-color: rgba(103, 232, 249, 0.9);
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.12);
        }
        .input::placeholder {
          color: rgb(148, 163, 184);
        }
        select.input option {
          background: #0f172a;
          color: white;
        }
      `}</style>
    </div>
  );
}

function Field({ icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
        <span className="text-cyan-300">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}
