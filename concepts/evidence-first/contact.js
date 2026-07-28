export function validateContact(input) {
  const errors = {};
  const email = input.email?.trim() ?? "";
  const flow = input.flow?.trim() ?? "";

  if (!email) {
    errors.email = "Enter your work email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid work email.";
  }
  if (!flow) {
    errors.flow = "Describe the flow you need verified.";
  }
  return errors;
}

export function buildContactMailto(input) {
  const subject = `Molar verification inquiry · ${input.company || "New team"}`;
  const body = [
    `Work email: ${input.email}`,
    `Company: ${input.company || "Not provided"}`,
    `App URL: ${input.appUrl || "Not provided"}`,
    `Team size: ${input.teamSize || "Not provided"}`,
    "",
    "Flow to verify:",
    input.flow,
  ].join("\n");
  return `mailto:pratik@molar.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function initContactPage(doc) {
  const form = doc.querySelector("[data-contact-form]");
  const status = doc.querySelector("[data-contact-status]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new doc.defaultView.FormData(form);
    const input = {
      email: String(formData.get("email") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      appUrl: String(formData.get("appUrl") || "").trim(),
      teamSize: String(formData.get("teamSize") || "").trim(),
      flow: String(formData.get("flow") || "").trim(),
    };
    const errors = validateContact(input);

    for (const field of form.elements) {
      if (typeof field.setCustomValidity === "function") {
        field.setCustomValidity(errors[field.name] || "");
      }
    }

    const firstError = Object.values(errors)[0];
    if (!form.checkValidity()) {
      if (status) status.textContent = firstError || "Check the highlighted fields.";
      form.reportValidity();
      return;
    }

    if (status) status.textContent = "Opening your email app.";
    doc.defaultView.location.href = buildContactMailto(input);
  });
}

if (typeof document !== "undefined") initContactPage(document);
