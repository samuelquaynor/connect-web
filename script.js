// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Password toggle functionality
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);

      // Toggle icon
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  });

  // Form validation and submission
  const forms = document.querySelectorAll(".login-form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitButton = this.querySelector(".btn-primary");
      const originalText = submitButton.querySelector("span").textContent;

      // Add loading state
      submitButton.classList.add("loading");
      submitButton.querySelector("span").textContent = "Processing...";

      // Simulate form submission
      setTimeout(() => {
        submitButton.classList.remove("loading");
        submitButton.querySelector("span").textContent = originalText;

        // Show success message
        showNotification("Success! Please check your email.", "success");
      }, 2000);
    });
  });

  // Password strength validation for signup form
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (passwordInput && confirmPasswordInput) {
    passwordInput.addEventListener("input", validatePassword);
    confirmPasswordInput.addEventListener("input", validatePasswordMatch);
  }

  // Social login buttons
  const socialButtons = document.querySelectorAll(".btn-social");

  socialButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const provider = this.classList.contains("btn-google")
        ? "Google"
        : "Facebook";
      showNotification(`Redirecting to ${provider}...`, "info");
    });
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add hover effects to cards
  const cards = document.querySelectorAll(".login-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow =
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "var(--shadow-lg)";
    });
  });

  // Input focus effects
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";
    });
  });
});

// Password validation function
function validatePassword() {
  const password = this.value;
  const strength = getPasswordStrength(password);

  // Remove existing strength indicators
  const existingIndicator =
    this.parentElement.querySelector(".password-strength");
  if (existingIndicator) {
    existingIndicator.remove();
  }

  // Add strength indicator
  const indicator = document.createElement("div");
  indicator.className = `password-strength strength-${strength.level}`;
  indicator.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill" style="width: ${strength.percentage}%"></div>
        </div>
        <span class="strength-text">${strength.text}</span>
    `;

  this.parentElement.appendChild(indicator);
}

// Password strength checker
function getPasswordStrength(password) {
  let score = 0;
  let feedback = [];

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score < 2) {
    return { level: "weak", percentage: 20, text: "Weak password" };
  } else if (score < 4) {
    return { level: "medium", percentage: 60, text: "Medium strength" };
  } else {
    return { level: "strong", percentage: 100, text: "Strong password" };
  }
}

// Password match validation
function validatePasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = this.value;

  if (confirmPassword && password !== confirmPassword) {
    this.style.borderColor = "var(--error-color)";
    this.style.boxShadow = "0 0 0 3px rgb(239 68 68 / 0.1)";
  } else {
    this.style.borderColor = "var(--border-color)";
    this.style.boxShadow = "none";
  }
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--white);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        border-left: 4px solid ${getNotificationColor(type)};
    `;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification);
  }, 5000);

  // Close button functionality
  const closeButton = notification.querySelector(".notification-close");
  closeButton.addEventListener("click", () => {
    removeNotification(notification);
  });
}

// Remove notification
function removeNotification(notification) {
  notification.style.transform = "translateX(100%)";
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 300);
}

// Get notification icon
function getNotificationIcon(type) {
  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };
  return icons[type] || icons.info;
}

// Get notification color
function getNotificationColor(type) {
  const colors = {
    success: "var(--success-color)",
    error: "var(--error-color)",
    warning: "var(--warning-color)",
    info: "var(--primary-color)",
  };
  return colors[type] || colors.info;
}

// Add CSS for password strength indicator
const style = document.createElement("style");
style.textContent = `
    .password-strength {
        margin-top: 0.5rem;
        font-size: 0.75rem;
    }
    
    .strength-bar {
        width: 100%;
        height: 4px;
        background: var(--border-color);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.25rem;
    }
    
    .strength-fill {
        height: 100%;
        transition: width 0.3s ease;
    }
    
    .strength-weak .strength-fill {
        background: var(--error-color);
    }
    
    .strength-medium .strength-fill {
        background: var(--warning-color);
    }
    
    .strength-strong .strength-fill {
        background: var(--success-color);
    }
    
    .strength-text {
        color: var(--text-secondary);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 1.25rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        background: var(--secondary-color);
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);
