// A reference to Stripe.js
var stripe;

var orderData = {
  items: [{ id: "photo" }]
};

// Disable the button until we have Stripe set up on the page
document.querySelector("button").disabled = true;

fetch("/config")
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    stripe = Stripe(data.publicKey, {
      betas: ["fpx_bank_beta_1"]
    });
    // Show formatted price information.
    var price = (data.amount / 100).toFixed(2);
    var numberFormat = new Intl.NumberFormat(["MS"], {
      style: "currency",
      currency: data.currency,
      currencyDisplay: "symbol"
    });
    document.getElementById("order-amount").innerText = numberFormat.format(
      price
    );
    // Check if we're returning from a redirect.
    var url = new URL(window.location.href);
    var payment_intent_client_secret = url.searchParams.get(
      "payment_intent_client_secret"
    );
    if (payment_intent_client_secret) {
      orderComplete(payment_intent_client_secret);
    } else {
      createPaymentIntent();
    }
  });

var createPaymentIntent = function() {
  fetch("/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  })
    .then(function(result) {
      return result.json();
    })
    .then(function(data) {
      return setupElements(data);
    })
    .then(function({ stripe, fpxBank, clientSecret }) {
      // Handle form submission.
      var form = document.getElementById("payment-form");
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        // Initiate payment when the submit button is clicked
        pay(stripe, fpxBank, clientSecret);
      });
    });
};

// Set up Stripe.js and Elements to use in checkout form
var setupElements = function(data) {
  var elements = stripe.elements({ locale: "MS" });
  var style = {
    base: {
      padding: "10px 12px",
      color: "#32325d",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a"
    }
  };

  // Create an instance of the fpxBank Element.
  var fpxBank = elements.create("fpxBank", {
    style: style,
    accountHolderType: "individual"
  });

  // Add an instance of the fpxBank Element into the container with id `fpx-bank-element`.
  fpxBank.mount("#fpx-bank-element");

  fpxBank.on("change", function(event) {
    if (event.complete) {
      document.querySelector("button").disabled = false;
    }
  });

  return {
    stripe: stripe,
    fpxBank: fpxBank,
    clientSecret: data.clientSecret
  };
};

/*
 * Calls stripe.handleFpxPayment which redirects to the selected bank.
 */
var pay = function(stripe, fpxBank, clientSecret) {
  changeLoadingState(true);

  // Initiate the payment.
  stripe
    .handleFpxPayment(clientSecret, fpxBank, {
      return_url: `${window.location.href}`
    })
    .then(function(result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment has been processed!
        orderComplete(clientSecret);
      }
    });
};

/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(clientSecret) {
  stripe.retrievePaymentIntent(clientSecret).then(function(result) {
    var paymentIntent = result.paymentIntent;
    var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

    document.querySelector(".sr-payment-form").classList.add("hidden");
    document.querySelector("pre").textContent = paymentIntentJson;

    document.querySelector(".sr-result").classList.remove("hidden");
    setTimeout(function() {
      document.querySelector(".sr-result").classList.add("expand");
    }, 200);

    changeLoadingState(false);
  });
};

var showError = function(errorMsgText) {
  changeLoadingState(false);
  var errorMsg = document.querySelector(".sr-field-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

// Show a spinner on payment submission
var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
