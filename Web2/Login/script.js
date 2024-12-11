document.addEventListener("DOMContentLoaded", () => {
  let signUpButton = document.getElementById("sign-up-btn");
  let signInButton = document.getElementById("sign-in-btn");
  let container = document.querySelector(".container");

  

  // Event listeners for buttons
  signUpButton.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
  });
  signInButton.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let signUpForm = document.getElementById("sign-up");
  let createPasswordInput = document.getElementById("create-password");
  let confirmPasswordInput = document.getElementById("confirm-password");

  signUpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let fullName = signUpForm.elements["U-Name"].value;
    let email = document.getElementById("email").value;
    let createPassword = createPasswordInput.value;
    let confirmPassword = confirmPasswordInput.value;

    let alertMessage = document.createElement("div");
    alertMessage.style.color = "red";
    alertMessage.style.marginTop = "10px";

    // Check if passwords match
    if (createPassword !== confirmPassword) {
      alertMessage.innerText = "Passwords do not match!";
      if (!signUpForm.querySelector(".alert-message")) {
        signUpForm.appendChild(alertMessage);
        alertMessage.classList.add("alert-message");
      }
      return;
    }

    // Clear alert if passwords match
    let existingAlert = signUpForm.querySelector(".alert-message");
    if (existingAlert) {
      existingAlert.remove();
    }

    // Store account in localStorage
    let accounts = [];
    try {
      accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      accounts = [];
    }

    let newAccount = {
      fullName: fullName,
      email: email,
      password: createPassword,
    };

    // Check if the email is already registered
    let existingAccount = accounts.find((account) => account.email === email);
    if (existingAccount) {
      alertMessage.innerText = "This email is already registered.";
      if (!signUpForm.querySelector(".alert-message")) {
        signUpForm.appendChild(alertMessage);
        alertMessage.classList.add("alert-message");
      }
      return;
    }

    accounts.push(newAccount);
    localStorage.setItem("accounts", JSON.stringify(accounts));

    // Clear form and notify success
    signUpForm.reset();
    alert("Account created successfully!");
    window.location.href = "../Homepage/index.html";
  });

  // Handling login
  let loginForm = document.getElementById("sign-in");

  loginForm.addEventListener("submit", function (e) {
    console.log("here");
    e.preventDefault();

    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;
    let message = document.getElementById("login-message"); // Alert <p> for messages

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let curUser = accounts.find((user) => user.email === email);

    if (curUser && password === curUser.password) {
      message.style.color = "green";
      message.textContent = "Login successful!";
      // Redirect to the home page
      window.location.href = "../Homepage/index.html";
    } else {
      message.style.color = "red";
      message.textContent = "Invalid email or password. Please try again.";
    }
  });
});
