
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Account modal
  const accountModal = document.getElementById("accountModal");
  const accountOpen = document.getElementById("accountOpen");
  const footerAccount = document.getElementById("footerAccount");
  const accountClose = document.getElementById("accountClose");

  function openAccount() {
    document.getElementById("accountMessage").textContent = "";
    accountModal.showModal();
  }

  accountOpen.addEventListener("click", openAccount);
  footerAccount.addEventListener("click", openAccount);
  accountClose.addEventListener("click", () => accountModal.close());

  // Close a dialog when clicking outside its content
  [accountModal, document.getElementById("infoModal")].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  // Login and registration preview
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const confirmField = document.getElementById("confirmField");
  const confirmPassword = document.getElementById("confirmPassword");
  const accountForm = document.getElementById("accountForm");
  const accountMessage = document.getElementById("accountMessage");
  const modalTitle = document.getElementById("modalTitle");
  const modalIntro = document.getElementById("modalIntro");
  const accountSubmit = document.getElementById("accountSubmit");

  let mode = "login";

  function setMode(nextMode) {
    mode = nextMode;
    const isRegister = mode === "register";

    loginTab.classList.toggle("active", !isRegister);
    registerTab.classList.toggle("active", isRegister);

    confirmField.hidden = !isRegister;
    confirmPassword.required = isRegister;

    modalTitle.textContent = isRegister ? "Create Account" : "Your Account";
    modalIntro.textContent = isRegister
      ? "Join the Zevra community when customer accounts launch."
      : "Welcome back. Customer login will be available at launch.";

    accountSubmit.innerHTML = isRegister
      ? "Create Account <span>→</span>"
      : "Log In <span>→</span>";

    accountMessage.textContent = "";
  }

  loginTab.addEventListener("click", () => setMode("login"));
  registerTab.addEventListener("click", () => setMode("register"));

  accountForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (mode === "register") {
      if (
        document.getElementById("accountPassword").value !==
        confirmPassword.value
      ) {
        accountMessage.textContent = "The passwords do not match.";
        return;
      }
    }

    accountMessage.textContent =
      "This is a website preview. Real accounts and login are not connected yet.";

    // Do not send or store entered credentials.
    accountForm.reset();
  });

  // Information links
  const infoModal = document.getElementById("infoModal");
  const infoClose = document.getElementById("infoClose");
  const infoTitle = document.getElementById("infoTitle");
  const infoContent = document.getElementById("infoContent");

  const information = {
    Privacy:
      "Zevra's privacy policy is being prepared. Before collecting customer data, publish a complete policy explaining what is collected, why it is needed, and how it is protected.",
    Terms:
      "Zevra's terms of use are being prepared. Full terms will be published before any online sales or customer account services launch.",
    FAQ:
      "Our website is currently a preview. Product availability, delivery information, returns and customer accounts will be announced when the store launches."
  };

  document.querySelectorAll("[data-info]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const topic = link.dataset.info;
      infoTitle.textContent = topic === "FAQ"
        ? "Frequently Asked Questions"
        : topic === "Privacy"
          ? "Privacy Policy"
          : "Terms of Use";

      infoContent.textContent = information[topic];
      infoModal.showModal();
    });
  });

  infoClose.addEventListener("click", () => infoModal.close());
});
