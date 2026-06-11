/**
 * Newsletter signup — Google Forms (no redirect).
 * Responses sync to the linked Google Sheet.
 */
const NEWSLETTER_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLScwSdYYDxSTcKIpVbA3P1ABNfH9B-VPGrbQ1K8YoR5i9M0yNA/formResponse";
const NEWSLETTER_ENTRY_ID = "entry.415864406";

function newsletterMarkup(prefix) {
  return `
    <section class="newsletter" aria-label="Email updates">
      <div class="newsletter__inner">
        <div class="newsletter__copy">
          <h2 class="newsletter__title">
            New Lesson Plans, Functions, Recommendation Lists,
            <span class="newsletter__emphasis">AND many more innovative ideas!</span>
          </h2>
          <p class="newsletter__subtitle">We'll email new updates to you</p>

          <form id="${prefix}-form" class="newsletter__form" novalidate>
            <label for="${prefix}-email" class="newsletter__label">Add your email</label>
            <div class="newsletter__row">
              <input
                id="${prefix}-email"
                name="email"
                type="email"
                required
                autocomplete="email"
                placeholder="example@gmail.com"
                class="newsletter__input"
              />
              <button type="submit" class="newsletter__btn">Get updates</button>
            </div>
            <p id="${prefix}-message" class="newsletter__message" role="status" hidden></p>
            <p class="newsletter__fine-print">*Opt out at any time</p>
          </form>
        </div>

        <div class="newsletter__art" aria-hidden="true">
          <svg class="newsletter__svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="70" width="100" height="80" rx="8" fill="oklch(0.86 0.07 15)" stroke="oklch(0.25 0.04 240)" stroke-width="2"/>
            <rect x="40" y="70" width="100" height="24" rx="4" fill="oklch(0.25 0.04 240)"/>
            <path d="M90 70 V50 M60 58 C70 42 90 42 90 58 M90 58 C110 42 130 42 120 58" stroke="oklch(0.25 0.04 240)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="145" cy="55" r="28" fill="oklch(0.55 0.14 250)"/>
            <text x="145" y="52" text-anchor="middle" fill="white" font-size="9" font-weight="700" font-family="DM Sans, sans-serif">NEW</text>
            <text x="145" y="64" text-anchor="middle" fill="white" font-size="8" font-weight="600" font-family="DM Sans, sans-serif">IDEAS</text>
            <circle cx="30" cy="40" r="4" fill="oklch(0.72 0.14 35)"/>
            <circle cx="165" cy="120" r="3" fill="oklch(0.82 0.11 200)"/>
            <rect x="155" y="30" width="6" height="12" rx="2" fill="oklch(0.55 0.14 250)" transform="rotate(25 158 36)"/>
            <rect x="20" y="130" width="5" height="10" rx="2" fill="oklch(0.72 0.14 35)" transform="rotate(-15 22 135)"/>
          </svg>
        </div>
      </div>
    </section>
  `;
}

async function submitNewsletterEmail(email) {
  const body = new URLSearchParams();
  body.append(NEWSLETTER_ENTRY_ID, email);
  body.append("fvv", "1");

  await fetch(NEWSLETTER_FORM_ACTION, {
    method: "POST",
    mode: "no-cors",
    body,
  });
}

function initNewsletterForm(prefix) {
  const form = document.getElementById(`${prefix}-form`);
  const input = document.getElementById(`${prefix}-email`);
  const message = document.getElementById(`${prefix}-message`);
  const submitBtn = form?.querySelector(".newsletter__btn");

  if (!form || !input || !message || form.dataset.newsletterInit) return;

  form.dataset.newsletterInit = "true";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = input.value.trim();
    message.hidden = true;
    message.classList.remove("newsletter__message--success", "newsletter__message--error");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.textContent = "Please enter a valid email address.";
      message.classList.add("newsletter__message--error");
      message.hidden = false;
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    try {
      await submitNewsletterEmail(email);
      message.textContent = "You're on the list! We'll email you when there's something new.";
      message.classList.add("newsletter__message--success");
      form.reset();
    } catch {
      message.textContent = "Something went wrong. Please try again.";
      message.classList.add("newsletter__message--error");
    } finally {
      message.hidden = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Get updates";
      }
    }
  });
}

function mountNewsletter(mountId, prefix = "newsletter") {
  const mount = document.getElementById(mountId);
  if (!mount || mount.dataset.newsletterMounted) return;

  mount.innerHTML = newsletterMarkup(prefix);
  mount.dataset.newsletterMounted = "true";
  initNewsletterForm(prefix);
}

function initNewsletter() {
  mountNewsletter("newsletter-signup", "newsletter");
}
