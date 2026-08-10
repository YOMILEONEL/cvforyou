import { RepeatableSection } from "@/app/(app)/editor/repeatable-section";
import {
  CEFR_LEVELS,
  createId,
  type CefrLevel,
  type EditorSection,
  type ResumeData,
} from "@/app/(app)/editor/types";

type SectionFormProps = {
  activeSection: EditorSection;
  resume: ResumeData;
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

export function SectionForm({ activeSection, resume, onChange }: SectionFormProps) {
  if (activeSection === "personal") {
    const p = resume.personal;
    const update = (patch: Partial<typeof p>) => onChange({ personal: { ...p, ...patch } });
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Vorname" value={p.firstName} onChange={(e) => update({ firstName: e.target.value })} />
        <Field label="Nachname" value={p.lastName} onChange={(e) => update({ lastName: e.target.value })} />
        <Field
          label="Titel / Position"
          placeholder="z. B. Frontend-Entwicklerin"
          value={p.title}
          onChange={(e) => update({ title: e.target.value })}
          wrapperClassName="sm:col-span-2"
        />
        <Field label="E-Mail" type="email" value={p.email} onChange={(e) => update({ email: e.target.value })} />
        <Field label="Telefon" value={p.phone} onChange={(e) => update({ phone: e.target.value })} />
        <Field label="Ort" value={p.city} onChange={(e) => update({ city: e.target.value })} />
      </div>
    );
  }

  if (activeSection === "experience") {
    return (
      <RepeatableSection
        items={resume.experience}
        onChange={(items) => onChange({ experience: items })}
        createItem={() => ({ id: createId(), company: "", position: "", location: "", from: "", to: "", description: "" })}
        addLabel="Station hinzufügen"
        emptyLabel="Noch keine Berufserfahrung eingetragen."
        renderTitle={(item, index) => item.position || item.company || `Station ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label="Position" value={item.position} onChange={(e) => update({ position: e.target.value })} />
            <Field label="Unternehmen" value={item.company} onChange={(e) => update({ company: e.target.value })} />
            <Field label="Ort" value={item.location} onChange={(e) => update({ location: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Von" placeholder="09/2021" value={item.from} onChange={(e) => update({ from: e.target.value })} />
              <Field label="Bis" placeholder="heute" value={item.to} onChange={(e) => update({ to: e.target.value })} />
            </div>
            <TextAreaField
              label="Beschreibung"
              value={item.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </>
        )}
      />
    );
  }

  if (activeSection === "education") {
    return (
      <RepeatableSection
        items={resume.education}
        onChange={(items) => onChange({ education: items })}
        createItem={() => ({ id: createId(), institution: "", degree: "", from: "", to: "", grade: "" })}
        addLabel="Ausbildung hinzufügen"
        emptyLabel="Noch keine Ausbildung eingetragen."
        renderTitle={(item, index) => item.degree || item.institution || `Ausbildung ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label="Abschluss" value={item.degree} onChange={(e) => update({ degree: e.target.value })} />
            <Field label="Institution" value={item.institution} onChange={(e) => update({ institution: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Von" placeholder="2018" value={item.from} onChange={(e) => update({ from: e.target.value })} />
              <Field label="Bis" placeholder="2021" value={item.to} onChange={(e) => update({ to: e.target.value })} />
            </div>
            <Field label="Note (optional)" value={item.grade} onChange={(e) => update({ grade: e.target.value })} />
          </>
        )}
      />
    );
  }

  if (activeSection === "skills") {
    return (
      <RepeatableSection
        items={resume.skills}
        onChange={(items) => onChange({ skills: items })}
        createItem={() => ({ id: createId(), name: "", level: 3 })}
        addLabel="Fähigkeit hinzufügen"
        emptyLabel="Noch keine Fähigkeiten eingetragen."
        renderTitle={(item, index) => item.name || `Fähigkeit ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label="Fähigkeit" value={item.name} onChange={(e) => update({ name: e.target.value })} />
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
              Niveau ({item.level}/5)
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
    return (
      <RepeatableSection
        items={resume.languages}
        onChange={(items) => onChange({ languages: items })}
        createItem={() => ({ id: createId(), name: "", level: "B2" as CefrLevel })}
        addLabel="Sprache hinzufügen"
        emptyLabel="Noch keine Sprachen eingetragen."
        renderTitle={(item, index) => item.name || `Sprache ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label="Sprache" value={item.name} onChange={(e) => update({ name: e.target.value })} />
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
              Niveau (CEFR)
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
    return (
      <RepeatableSection
        items={resume.certificates}
        onChange={(items) => onChange({ certificates: items })}
        createItem={() => ({ id: createId(), title: "", issuer: "", date: "" })}
        addLabel="Zertifikat hinzufügen"
        emptyLabel="Noch keine Zertifikate eingetragen."
        renderTitle={(item, index) => item.title || `Zertifikat ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label="Titel" value={item.title} onChange={(e) => update({ title: e.target.value })} />
            <Field label="Aussteller" value={item.issuer} onChange={(e) => update({ issuer: e.target.value })} />
            <Field label="Datum" placeholder="03/2023" value={item.date} onChange={(e) => update({ date: e.target.value })} />
          </>
        )}
      />
    );
  }

  if (activeSection === "projects") {
    return (
      <RepeatableSection
        items={resume.projects}
        onChange={(items) => onChange({ projects: items })}
        createItem={() => ({ id: createId(), title: "", description: "", link: "" })}
        addLabel="Projekt hinzufügen"
        emptyLabel="Noch keine Projekte eingetragen."
        renderTitle={(item, index) => item.title || `Projekt ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label="Titel" value={item.title} onChange={(e) => update({ title: e.target.value })} />
            <Field label="Link (optional)" value={item.link} onChange={(e) => update({ link: e.target.value })} />
            <TextAreaField
              label="Beschreibung"
              value={item.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </>
        )}
      />
    );
  }

  if (activeSection === "references") {
    return (
      <RepeatableSection
        items={resume.references}
        onChange={(items) => onChange({ references: items })}
        createItem={() => ({ id: createId(), name: "", role: "", contact: "" })}
        addLabel="Referenz hinzufügen"
        emptyLabel="Noch keine Referenzen eingetragen."
        renderTitle={(item, index) => item.name || `Referenz ${index + 1}`}
        renderFields={(item, update) => (
          <>
            <Field label="Name" value={item.name} onChange={(e) => update({ name: e.target.value })} />
            <Field label="Position / Firma" value={item.role} onChange={(e) => update({ role: e.target.value })} />
            <Field label="Kontakt" value={item.contact} onChange={(e) => update({ contact: e.target.value })} />
          </>
        )}
      />
    );
  }

  const f = resume.freitext;
  return (
    <div className="flex flex-col gap-4">
      <Field label="Überschrift" value={f.title} onChange={(e) => onChange({ freitext: { ...f, title: e.target.value } })} />
      <TextAreaField
        label="Text"
        rows={6}
        placeholder="z. B. Hobbys, über mich ..."
        value={f.content}
        onChange={(e) => onChange({ freitext: { ...f, content: e.target.value } })}
      />
    </div>
  );
}
