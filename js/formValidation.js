/**
 * @fileoverview Functions for form validation and remembering form state during session
 * @author Cameron Simpson
 */

// Variables
const storageKey = "northStarContactForm";

const form = document.querySelector("#contactForm");

const formState = {
    name: "",
    email: "",
    pickupDate: "",
    requestType: "",
    requestDetails: "",
    allergy: ""
};

function updateFormState() {
    formState.name = document.getElementById("name").value;

    formState.email = document.getElementById("email").value;

    formState.pickupDate = document.getElementById("pickupDate").value;

    formState.requestType = document.getElementById("requestType").value;

    formState.requestDetails = document.getElementById("requestDetails").value;

    formState.allergy = document.getElementById("allergy").value;
}

function saveFormState() {
    updateFormState();

    sessionStorage.setItem(storageKey, JSON.stringify(formState));
}

function loadFormState() {
    const storedData =
        sessionStorage.getItem(storageKey);

    if (storedData === null) {
        return;
    }

    const savedData =
        JSON.parse(storedData);

    if (savedData.name) {
        formState.name = savedData.name;
    }

    if (savedData.email) {
        formState.email = savedData.email;
    }

    if (savedData.pickupDate) {
        formState.pickupDate = savedData.pickupDate;
    }

    if (savedData.requestType) {
        formState.requestType = savedData.requestType;
    }

    if (savedData.requestDetails) {
        formState.requestDetails = savedData.requestDetails;
    }

    if (savedData.allergy) {
        formState.allergy = savedData.allergy;
    }

    document.getElementById("name").value = formState.name;

    document.getElementById("email").value = formState.email;

    document.getElementById("pickupDate").value = formState.pickupDate;

    document.getElementById("requestType").value = formState.requestType;

    document.getElementById("requestDetails").value = formState.requestDetails;

    document.getElementById("allergy").value = formState.allergy;
}

function validateForm() {
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(fieldId + "Error");

        field.classList.add("input-error");

        field.setAttribute("aria-invalid", "true");

        if (errorSpan !== null) {
            errorSpan.textContent = message;
        }
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(fieldId + "Error");

        field.classList.remove("input-error");

        field.setAttribute("aria-invalid", "false");

        if (errorSpan !== null) {
            errorSpan.textContent = "";
        }
    }

    function isValidName (name) {
        if (name.trim() === "") {
            showError("name", "Please enter your name");
            return false;
        } else {
            clearError("name");
            return true;
        }
    }

    function isValidEmail(email) {
        const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showError("email", "Please enter a valid email address");
            return false;
        } else {
            clearError("email");
            return true;
        }
    }

    function todayDate () {
        const today = new Date();

        const year = today.getFullYear(); 
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function isValidDate(pickupDate) {
        const date = todayDate();

        if (formState.requestType === "preorder" && formState.pickupDate === "") {
            showError ("pickupDate", "Please select a pickup date");
            return false;
        } else if (formState.requestType === "preorder" && pickupDate < date) {
            showError ("pickupDate", "Please select a date that is not in the past");
            return false;
        } else {
            clearError ("pickupDate");
            return true;
        }
    }

    function isValidRequestType(requestType) {
        if (requestType === "") {
            showError ("requestType", "Please select a request type");
            return false;
        } else {
            clearError ("requestType")
            return true;
        }
    }

    function isValidRequest(requestDetails) {
        if (requestDetails === "") {
            showError ("requestDetails", "Please enter your request details")
            return false;
        } else {
            clearError ("requestDetails")
            return true;
        }
    }

    updateFormState();

    const validName = isValidName (formState.name);
    const validEmail = isValidEmail (formState.email);
    const validRequestType = isValidRequestType (formState.requestType);
    const validDate = isValidDate (formState.pickupDate);
    const validRequest = isValidRequest (formState.requestDetails);

    return (
        validName && 
        validEmail &&
        validRequestType &&
        validDate &&
        validRequest
    );
}

form.addEventListener("change", saveFormState);

form.addEventListener ("submit", function (event) {
    event.preventDefault();

    const formIsValid = validateForm();

    if (formIsValid) {
        sessionStorage.removeItem(storageKey);

        form.submit();
    }
});

loadFormState();