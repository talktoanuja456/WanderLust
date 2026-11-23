
(() => {
  "use strict";

  // Fetch all forms that need validation
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over forms and prevent invalid submissions
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

/* WanderLust Welcome Popup */

document.addEventListener("DOMContentLoaded", () => {
    const welcomeElement =
        document.getElementById("welcomeModal");

    if (!welcomeElement) return;

    // Show only on the listings page
    if (window.location.pathname !== "/listings") return;

    // Show once per browser tab session
    if (sessionStorage.getItem("welcomeShown")) return;

    if (typeof bootstrap === "undefined") return;

    const welcomeModal = new bootstrap.Modal(welcomeElement);

    welcomeModal.show();

    sessionStorage.setItem("welcomeShown", "true");
});
