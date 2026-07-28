/** §9 CONTATO — Empresa / Pessoa física toggle + client-side submit. */
export function initContato(): void {
  const form = document.querySelector<HTMLFormElement>("[data-form]");
  if (!form) return;

  const toggles = form.querySelectorAll<HTMLButtonElement>("[data-toggle]");
  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggles.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
    });
  });

  const status = form.querySelector<HTMLElement>("[data-form-status]");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (status) status.textContent = "Mensagem enviada — nossa engenharia retorna em breve.";
    form.reset();
  });
}
