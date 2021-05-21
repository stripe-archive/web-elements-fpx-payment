> <img src="https://stripe.dev/images/badges/archived.png" align="left" width="250"> This project is deprecated and is no longer being actively being actively maintained.

# Creating an FPX bank transfer

Use Payment Methods to [accept payments using FPX](https://stripe.com/docs/payments/payment-methods/fpx), a popular payment method in Malaysia.

During the payment process, [a PaymentIntent object is created](https://stripe.com/docs/stripe-js/elements/fpx-bank#create-payment-intent) and your customer is redirected to their bank’s login page to authorize the payment. After your customer successfully completes the authorization, the PaymentIntent will automatically be captured.

The [Payment Intents API](https://stripe.com/docs/api/payment_intents) abstracts away these separate steps by handling all steps of the process through the [confirm method](https://stripe.com/docs/api/payment_intents/confirm). After you create a PaymentIntent, call confirm referencing the [FPX Element](https://stripe.com/docs/stripe-js/elements/fpx-bank#submit-payment) to redirect, authenticate, and capture the funds in one API call.

## Demo

See a [hosted version](https://j6rzh.sse.codesandbox.io/) of the sample or fork a copy on [codesandbox.io](https://codesandbox.io/s/stripe-sample-web-elements-fpx-payment-j6rzh).

The demo is running in test mode. You will see a Stripe test mode redirect page.

<img src="./web-elements-fpx-payment.gif" alt="Creating an FPX bank transfer" align="center">

## Webhooks

You will need to handle asynchronous events in order to be notified when the payment is successful or has failed. To do so, it is essential that your integration uses webhooks to monitor the `payment_intent.succeeded` and `payment_intent.payment_failed` events.

<!-- prettier-ignore -->
| This sample shows: | Using webhooks | 
:--- | :---: 
📝 **Showing a list of bank logos and names for banks participating in FPX** using the [Stripe FPX Element](https://stripe.com/docs/stripe-js/elements/fpx-bank). | ✅ |
🙅 **Handling bank authentication via redirect** to the customer's banking page based on their selection in the Element.  | ✅ |
↪️ **Using webhooks to verify the payment outcome.** You will need to handle asynchronous events in order to be notified when the payment is successful or has failed. | ✅ |
🏦 **Easily scalable to other payment methods.** Webhooks enable easy adoption of other asynchroneous payment methods like direct debits and push-based payment flows. | ✅ |

## How to run locally

This sample includes 5 server implementations in Node, Ruby, Python, Java, and PHP.

Follow the steps below to run locally.

**1. Clone and configure the sample**

The Stripe CLI is the fastest way to clone and configure a sample to run locally. 

**Using the Stripe CLI**

If you haven't already installed the CLI, follow the [installation steps](https://github.com/stripe/stripe-cli#installation) in the project README. The CLI is useful for cloning samples and locally testing webhooks and Stripe integrations.

In your terminal shell, run the Stripe CLI command to clone the sample:

```
stripe samples create web-elements-fpx-payment
```

The CLI will walk you through picking your integration type, server and client languages, and configuring your .env config file with your Stripe API keys. 

**Installing and cloning manually**

If you do not want to use the Stripe CLI, you can manually clone and configure the sample yourself:

```
git clone https://github.com/stripe-samples/web-elements-fpx-payment
```

Copy the .env.example file into a file named .env in the folder of the server you want to use. For example:

```
cp .env.example using-webhooks/server/node/.env
```

You will need a Stripe account in order to run the demo. Once you set up your account, go to the Stripe [developer dashboard](https://stripe.com/docs/development/quickstart#api-keys) to find your API keys.

```
STRIPE_PUBLISHABLE_KEY=<replace-with-your-publishable-key>
STRIPE_SECRET_KEY=<replace-with-your-secret-key>
```

`STATIC_DIR` tells the server where to the client files are located and does not need to be modified unless you move the server files.

**2. Follow the server instructions on how to run:**

Pick the server language you want and follow the instructions in the server folder README on how to run.

For example, if you want to run the Node server in `using-webhooks`:

```
cd using-webhooks/server/node # there's a README in this folder with instructions
npm install
npm start
```

**4. [Optional] Run a webhook locally:**

If you want to test the `using-webhooks` integration with a local webhook on your machine, you can use the Stripe CLI to easily spin one up.

First [install the CLI](https://stripe.com/docs/stripe-cli) and [link your Stripe account](https://stripe.com/docs/stripe-cli#link-account).

```
stripe listen --forward-to localhost:4242/webhook
```

The CLI will print a webhook secret key to the console. Set `STRIPE_WEBHOOK_SECRET` to this value in your .env file.

You should see events logged in the console where the CLI is running.

When you are ready to create a live webhook endpoint, follow our guide in the docs on [configuring a webhook endpoint in the dashboard](https://stripe.com/docs/webhooks/setup#configure-webhook-settings).

## FAQ

Q: Why did you pick these frameworks?

A: We chose the most minimal framework to convey the key Stripe calls and concepts you need to understand. These demos are meant as an educational tool that helps you roadmap how to integrate Stripe within your own system independent of the framework.

## Get support
If you found a bug or want to suggest a new [feature/use case/sample], please [file an issue](../../issues).

If you have questions, comments, or need help with code, we're here to help:
- on [IRC via freenode](https://webchat.freenode.net/?channel=#stripe)
- on Twitter at [@StripeDev](https://twitter.com/StripeDev)
- on Stack Overflow at the [stripe-payments](https://stackoverflow.com/tags/stripe-payments/info) tag
- by [email](mailto:support+github@stripe.com)

Sign up to [stay updated with developer news](https://go.stripe.global/dev-digest).

## Author(s)

[@thorsten-stripe](https://twitter.com/thorwebdev)
