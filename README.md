<p align="center">
  <a href="" rel="noopener">
 <img src="./readme/tribe-crowdfunding-app-banner.jpg" alt="Project logo"></a>
</p>
<h3 align="center">TRIBE CROWDFUNDING APP</h3>

<div align="center">

  <!-- [![Hackathon](https://img.shields.io/badge/hackathon-name-orange.svg)](http://hackathon.url.com) 
  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/mjhatami/tribe-crowdfunding-app/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/mjhatami/tribe-crowdfunding-app/pulls)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md) -->

</div>

---

<p align="center"> Add payment section in your posts and manage it.
    <br> 
</p>

## 📝 Table of Contents
- [Problem Statement](#problem_statement)
- [Idea / Solution](#idea)
- [Dependencies / Limitations](#limitations)
- [Future Scope](#future_scope)
- [Setting up a local environment](#getting_started)
- [How it works?](#usage)
- [Technology Stack](#tech_stack)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)

## 🧐 Problem Statement <a name = "problem_statement"></a>
There is some cost of management for every community, so collecting and reporting in a transparent way is a traditional problem and also there is a right for every person who pays, to get a transparent report in particular for charities. Furthermore, I saw Stripe integration in the Tribe roadmap on notion documents that needs product design and I think this can help this process.
- Collect money from members of a community and manage that in a transparent way.
- A dashboard for financial analyzing and reporting where the money comes and goes.
- Charities are a good target that increases the Tribe experience on how communities grow.



## 💡 Idea / Solution <a name = "idea"></a>
the Donation Box is an element in the post section. It manages how much money need for a specific purpose, which accounts achieved it, and how much spend on the transaction fees.
 - with the Stripe connect integration.
 - the Donation Box helps you define a goal and then collect money for that in a simple way.

## ⛓️ Production Requirements  <a name = "limitations"></a>
This project is not production-ready and needs more development. I list some problems below :
- The authorization process must be developed and it depends on how authorization work in the tribe. 
- The Webhook endpoint must be implemented to achieve payments.
- The Donation-Box section must be defined in post components like instagram.
- Design and develop post section.
- Stripe onboarding account success and refresh pages must be developed.
- Stripe return URL of payment intent must be set dynamically. 
- Reporting for members and admins must be implemented.
- MongoDB transactions and concurrency optimization must be developed.
- Typescripts must be improved and checked.

## 🚀 Future Scope <a name = "future_scope"></a>
- Multi-currency must be checked and developed.
- Statistics dashboard for members and admins.
- Webhook to write a comment to thank the payers and mention them.
- User information must be attached to the intents.
- Payable link for share.
## 🏁 Getting Started <a name = "getting_started"></a>
This project is dockerized but it needs network setting in envs. after run the project with command below (if you already installed docker) just create an stripe account, activate its stripe connect and start with postman. 

### Installing


If you installed docker on your machine just run the command below in the root of the project if not use alternative commands :

```
docker-compose up
```

An alternative is use the commands below in the root of the project :
```
npm install
```
```
npm run dev
```

## 🎈 How it works ? <a name="usage"></a>
Firstly, the admins must config their account in the app setting, after that each member who wants to use the donation-box must be onboard his account on it to activate the donation-box feature in his/her post section :
- Admins:
    - Create a stripe account with activated connect.
    - Create webhook on Tribe specific url.
    - Set "client_secret", publish_key", "webhook_key" on tribe-crowdfunding-app.
    - Define fees by any condition their like (in the future).
- Members:
    - Go to profile and onboard on admin's stripe account.
    - Now, donation-box feature is available for them. Define amount of money that they need and write a description about what they want to do.

After these steps, others can choose what proportion of total money does they like to pay depends on  community policy and after that a payment gateway ready for them.

- Available endpoints (post man doc is provided):
  - Post create admin stripe config
  - Get existing admin stripe configs
  - Get retrieve or create onboarding account for members
  - Post create donation-box
  - Post create stripe intent by donation code

In client side of the app you can create intent and pay easily. This process is completed(Stripe webhook must be implemented to achieve intents status).

## ⛏️ Built With <a name = "tech_stack"></a>
- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [ReactJs](https://reactjs.org/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Stripe](https://stripe.com/) - Payment Infrastructure

## ✍️ Authors <a name = "authors"></a>
- [@mjhatami](https://github.com/mjhatami) - Idea & Initial work

See also the list of [contributors](https://github.com/mjhatami/tribe-crowdfunding-app/contributors) 
who participated in this project.

## 🎉 Acknowledgments <a name = "acknowledgments"></a>
- Thanks to my family for buying me a computer as a child. 
- [@mahmood-saghrajooghi](https://github.com/mahmood-saghrajooghi) Thanks for your generous help.
- [@syavash](https://github.com/syavash) Thanks for your worthy youtube tutorials in Persian.
- [@kylelobo](https://github.com/kylelobo/The-Documentation-Compendium) Thanks for your great readme templates.
- [tribe-starter-app](https://github.com/tribeplatform/tribe-starter-app) Thanks for your boilerplate.
- [tribe](https://tribe.so/) Thanks for your effect on society's subcultures.
- [stripe](https://stripe.com/) Thanks for your awesome payment platform.
