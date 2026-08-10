"use client";

import { PhotoUpload } from "@/app/(app)/editor/photo-upload";
import { RepeatableSection } from "@/app/(app)/editor/repeatable-section";
import {
  CEFR_LEVELS,
  createId,
  type CefrLevel,
  type EditorSection,
  type ResumeData,
} from "@/app/(app)/editor/types";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";

type SectionFormProps = {
  activeSection: EditorSection;
  resume: ResumeData;
  resumeId: string;
  onChange: (patch: Partial<ResumeData>) => void;
};

const inputClass =
  "border border-ink/30 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-rust dark:border-ink-dark/30 dark:bg-paper-dark dark:text-ink-dark";

function Field({
  label,
  wrapperClassName,
  ...props
}: { label: string; wrapperClassName?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={`flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark ${wrapperClassName ?? ""}`}
    >
      {label}
      <input {...props} className={inputClass} />
    </label>
  );
}

function TextAreaField({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="col-span-full flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
      {label}
      <textarea rows={3} {...props} className={inputClass} />
    </label>
  );
}

export function SectionForm({ activeSection, resume, resumeId, onChange }: SectionFormProps) {
  const { dict } = useDictionary();
  const p2 = dict.editor.personal;
  const s = dict.editor.sections;

  if (activeSection === "personal") {
    const p = resume.personal;
    const update = (patch: Partial<typeof p>) => onChange({ personal: { ...p, ...patch } });
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <PhotoUpload
            resumeId={resumeId}
            value={p.photoUrl}
            onChange={(photoUrl) => update({ photoUrl })}
          />
        </div>
        <Field label={p2.firstName} value={p.firstName} onChange={(e) => update({ firstName: e.target.value })} />
        <Field label={p2.lastName} value={p.lastName} onChange={(e) => update({ lastName: e.target.value })} />
        <Field
          label={p2.titlePosition}
          placeholder={p2.titlePositionPlaceholder}
          value={p.title}
          onChange={(e) => update({ title: e.target.value })}
          wrapperClassName="sm:col-span-2"
        />
        <Field label={p2.email} type="email" value={p.email} onChange={(e) => update({ email: e.target.value })} />
        <Field label={p2.phone} value={p.phone} onChange={(e) => update({ phone: e.target.value })} />
        <Field label={p2.city} value={p.city} onChange={(e) => update({ city: e.target.value })} />

        <p className="sm:col-span-2 mt-2 font-mono text-xs uppercase tracking-wide text-ink/50 dark:text-ink-dark/50">
          {p2.additionalInfo}
        </p>
        <Field
          label={p2.drivingLicense}
          placeholder={p2.drivingLicensePlaceholder}
          value={p.drivingLicense}
          onChange={(e) => update({ drivingLicense: e.target.value })}
        />
        <Field
          label={p2.linkedin}
          placeholder={p2.linkedinPlaceholder}
          value={p.linkedinUrl}
          onChange={(e) => update({ linkedinUrl: e.target.value })}
        />
        <Field
          label={p2.github}
          placeholder={p2.githubPlaceholder}
          value={p.githubUrl}
          onChange={(e) => update({ githubUrl: e.target.value })}
        />
        <Field
          label={p2.portfolio}
          placeholder={p2.portfolioPlaceholder}
          value={p.portfolioUrl}
          onChange={(e) => update({ portfolioUrl: e.target.value })}
        />
        <Field
          label={p2.birthPlace}
          value={p.birthPlace}
          onChange={(e) => update({ birthPlace: e.target.value })}
        />
        <Field
          label={p2.birthDate}
          type="date"
          value={p.birthDate}
          onChange={(e) => update({ birthDate: e.target.value })}
        />
      </div>
    );
  }

  if (activeSection === "experience") {
    const t = s.experience;
    return (
      <RepeatableSection
        items={resume.experience}
        onChange={(items) => onChange({ experience: items })}
        createItem={() => ({ id: createId(), company: "", position: "", location: "", from: "", to: "", description: "" })}
        addLabel={t.addLabel}
        emptyLabel={t.emptyLabel}
        renderTitle={(item, index) => item.position || item.company || `${t.titleFallback} ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label={t.position} value={item.position} onChange={(e) => update({ position: e.target.value })} />
            <Field label={t.company} value={item.company} onChange={(e) => update({ company: e.target.value })} />
            <Field label={t.location} value={item.location} onChange={(e) => update({ location: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.from} placeholder={t.fromPlaceholder} value={item.from} onChange={(e) => update({ from: e.target.value })} />
              <Field label={t.to} placeholder={t.toPlaceholder} value={item.to} onChange={(e) => update({ to: e.target.value })} />
            </div>
            <TextAreaField
              label={t.description}
              value={item.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </>
        )}
      />
    );
  }

  if (activeSection === "education") {
    const t = s.education;
    return (
      <RepeatableSection
        items={resume.education}
        onChange={(items) => onChange({ education: items })}
        createItem={() => ({ id: createId(), institution: "", degree: "", from: "", to: "", grade: "" })}
        addLabel={t.addLabel}
        emptyLabel={t.emptyLabel}
        renderTitle={(item, index) => item.degree || item.institution || `${t.titleFallback} ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label={t.degree} value={item.degree} onChange={(e) => update({ degree: e.target.value })} />
            <Field label={t.institution} value={item.institution} onChange={(e) => update({ institution: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.from} placeholder={t.fromPlaceholder} value={item.from} onChange={(e) => update({ from: e.target.value })} />
              <Field label={t.to} placeholder={t.toPlaceholder} value={item.to} onChange={(e) => update({ to: e.target.value })} />
            </div>
            <Field label={t.grade} value={item.grade} onChange={(e) => update({ grade: e.target.value })} />
          </>
        )}
      />
    );
  }

  if (activeSection === "skills") {
    const t = s.skills;
    return (
      <RepeatableSection
        items={resume.skills}
        onChange={(items) => onChange({ skills: items })}
        createItem={() => ({ id: createId(), name: "", level: 3 })}
        addLabel={t.addLabel}
        emptyLabel={t.emptyLabel}
        renderTitle={(item, index) => item.name || `${t.titleFallback} ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label={t.name} value={item.name} onChange={(e) => update({ name: e.target.value })} />
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
              {t.level} ({item.level}/5)
              <input
                type="range"
                min={1}
                max={5}
                value={item.level}
                onChange={(e) => update({ level: Number(e.target.value) })}
                className="accent-rust"
              />
            </label>
          </>
        )}
      />
    );
  }

  if (activeSection === "languages") {
    const t = s.languages;
    return (
      <RepeatableSection
        items={resume.languages}
        onChange={(items) => onChange({ languages: items })}
        createItem={() => ({ id: createId(), name: "", level: "B2" as CefrLevel })}
        addLabel={t.addLabel}
        emptyLabel={t.emptyLabel}
        renderTitle={(item, index) => item.name || `${t.titleFallback} ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label={t.name} value={item.name} onChange={(e) => update({ name: e.target.value })} />
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
              {t.level}
              <select
                value={item.level}
                onChange={(e) => update({ level: e.target.value as CefrLevel })}
                className={inputClass}
              >
                {CEFR_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      />
    );
  }

  if (activeSection === "certificates") {
    const t = s.certificates;
    return (
      <RepeatableSection
        items={resume.certificates}
        onChange={(items) => onChange({ certificates: items })}
        createItem={() => ({ id: createId(), title: "", issuer: "", date: "" })}
        addLabel={t.addLabel}
        emptyLabel={t.emptyLabel}
        renderTitle={(item, index) => item.title || `${t.titleFallback} ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label={t.title} value={item.title} onChange={(e) => update({ title: e.target.value })} />
            <Field label={t.issuer} value={item.issuer} onChange={(e) => update({ issuer: e.target.value })} />
            <Field label={t.date} placeholder={t.datePlaceholder} value={item.date} onChange={(e) => update({ date: e.target.value })} />
          </>
        )}
      />
    );
  }

  if (activeSection === "projects") {
    const t = s.projects;
    return (
      <RepeatableSection
        items={resume.projects}
        onChange={(items) => onChange({ projects: items })}
        createItem={() => ({ id: createId(), title: "", description: "", link: "" })}
        addLabel={t.addLabel}
        emptyLabel={t.emptyLabel}
        renderTitle={(item, index) => item.title || `${t.titleFallback} ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label={t.title} value={item.title} onChange={(e) => update({ title: e.target.value })} />
            <Field label={t.link} value={item.link} onChange={(e) => update({ link: e.target.value })} />
            <TextAreaField
              label={t.description}
              value={item.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </>
        )}
      />
    );
  }

  if (activeSection === "references") {
    const t = s.references;
    return (
      <RepeatableSection
        items={resume.references}
        onChange={(items) => onChange({ references: items })}
        createItem={() => ({ id: createId(), name: "", role: "", contact: "" })}
        addLabel={t.addLabel}
        emptyLabel={t.emptyLabel}
        renderTitle={(item, index) => item.name || `${t.titleFallback} ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label={t.name} value={item.name} onChange={(e) => update({ name: e.target.value })} />
            <Field label={t.role} value={item.role} onChange={(e) => update({ role: e.target.value })} />
            <Field label={t.contact} value={item.contact} onChange={(e) => update({ contact: e.target.value })} />
          </>
        )}
      />
    );
  }

  const f = resume.freitext;
  const t = s.freitext;
  return (
    <div className="flex flex-col gap-4">
      <Field label={t.heading} value={f.title} onChange={(e) => onChange({ freitext: { ...f, title: e.target.value } })} />
      <TextAreaField
        label={t.text}
        rows={6}
        placeholder={t.textPlaceholder}
        value={f.content}
        onChange={(e) => onChange({ freitext: { ...f, content: e.target.value } })}
      />
    </div>
  );
}
