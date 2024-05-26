"use server"

import { createAI, getAIState, useAIState, getMutableAIState, render } from "ai/rsc";
import OpenAI from "openai";
import { ReactNode } from 'react';
import { z } from "zod";
import { Spinner } from "@/components/spinner";
import { BotMessage } from "@/components/message";
// import WeatherCard from "@/components/weather-card";
import BillPaymentCard from "@/components/bill-payment-card";
import CurrencyConverter from "@/components/currency-card";
import RegisterPayNow from "@/components/register-paynow-card";
import PastTransactionsCard from "@/components/transactions-card";
import PaymentCard from "@/components/people-payment-card";
import InsurancePlansCard from "@/components/insurance-card";
import InvestmentCard from "@/components/manage-investment";
import LoansCard from "@/components/apply-loan-card";
import CardsManagementCard from "@/components/card-managemnent-card";
import fs from 'fs';
import CallHotline from "@/components/hotline-card";
import ChatComponent from "@/components/ChatComponent"
import AddMoneyToSafevault from "@/components/safevault-card";
import AccountBalanceCard from "@/components/account-balance-card";
import { systemPrompt } from '@/lib/systemPrompt'

const openai = new OpenAI();

interface ServerMessage {
  role: 'user' | 'assistant' | 'function';
  content: string;
}

interface ClientMessage {
  id: number;
  display: ReactNode;
}

export async function submitMessage(content: string): Promise<ClientMessage> {
  'use server';
  const aiState = getMutableAIState<typeof AI>();

  // Read the system prompt from system.txt
  // const systemPrompt = fs.readFileSync('./public/system.txt', 'utf-8');

  // Get the existing history from aiState
  const chatHistory = aiState.get();

  // Update AI state with new message.
  aiState.update([
    ...chatHistory,
    {
      role: "user",
      content: content,
    },
  ]);

  // Update AI state with new message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: content,
    },
  ]);

  // const additionalMessages = [
  //   { role: "user", content: "i want to travel to japan" },
  //   { role: "assistant", content: "oh great! Let's get you prepared" }
  // ];

  const ui = render({
    provider: openai,
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt},
      ...chatHistory.map(message => {
        if (message.role === "function") {
          return {
            role: message.role,
            content: message.content,
            name: message.name || "",
          };
        } else {
          return {
            role: message.role,
            content: message.content,
          };
        }
      }),
      { role: "user", content: content}
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call)
    text: ({ content, done }) => {
      // text can be streamed from the LLM, but we only want to close the stream with .done() when its completed.
      // done() marks the state as available for the client to access
      if (done) {
        // Remove ** patterns from the content
        const cleanedContent = content.replace(/\*\*/g, '');
      
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content: cleanedContent,
          },
        ]);
      
        return <BotMessage>{cleanedContent}</BotMessage>;
      }
      
      return <BotMessage>{content.replace(/\*\*/g, '')}</BotMessage>;
    },
    tools: {
      // // get weather
      // get_city_weather: {
      //   description: "Get the current weather for a city",
      //   parameters: z
      //     .object({
      //       city: z
      //         .string()
      //         .describe("The city and state, e.g. San Francisco, CA"),
      //     })
      //     .required(),
      //   render: async function* (args) {
      //     yield <Spinner />;

      //     // Workaround for a bug in the current version (v3.0.1)
      //     // issue: https://github.com/vercel/ai/issues/1026
      //     const { city } = JSON.parse(args as unknown as string);
      //     console.log(city); // This is the correct

      //     const weather = await getWeather(city);

      //     aiState.done([
      //       ...aiState.get(),
      //       {
      //         role: "function",
      //         name: "get_weather_info",
      //         // Content can be any string to provide context to the LLM in the rest of the conversation
      //         content: JSON.stringify(weather),
      //       },
      //     ]);

      //     return (
      //       <BotMessage>
      //         <WeatherCard info={weather} />
      //       </BotMessage>
      //     );
      //   },
      // },
      // pay bills
      pay_bill: {
        description: "Returns the list of bills to pay",
        parameters: z
          .object({
            date: z
              .date()
              .describe("The date of the bill payment"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;
          
          const { date } = JSON.parse(args as unknown as string);
          
          const paymentResult = await payBill(date);
          
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "pay_bill_result",
              content: JSON.stringify(paymentResult),
            },
          ]);
          
          return (
            <BotMessage>
              <BillPaymentCard bills={paymentResult} />
            </BotMessage>
          );
        },
      },
      // convert currency
      convert_currency: {
        description: "Display interface to convert currency",
        parameters: z
          .object({
            confirmation: z.string().describe("user confirmation"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          const { confirmation } = JSON.parse(args as unknown as string);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "convert_currency_result",
              content: JSON.stringify({ confirmation }),
            },
          ]);

          return (
            <BotMessage>
              <div>
                <CurrencyConverter/>
              </div>
            </BotMessage>
          );
        },
      },
      // end
      // register_paynow
      register_paynow: {
        description: "Display interface to register PayNow",
        parameters: z
          .object({
            confirmation : z.string().describe("user confirmation"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          const { confirmation } = JSON.parse(args as unknown as string);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "register_paynow_result",
              content: JSON.stringify({ confirmation }),
            },
          ]);

          return (
            <BotMessage>
              <div>
                <RegisterPayNow />
              </div>
            </BotMessage>
          );
        },
      },
      // end
      // view transactions
      view_transactions: {
        description: "Returns the list of past transactions",
        parameters: z
          .object({
            dateRange: z
              .object({
                start: z.date().describe("The start date of the transaction history"),
              })
              .describe("The day range for the transactions")
              .required(),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          const { dateRange } = JSON.parse(args as unknown as string);
          
          const transactionsResult = await getTransactions(dateRange);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "view_transactions_result",
              content: JSON.stringify(transactionsResult),
            },
          ]);

          return (
            <BotMessage>
              <PastTransactionsCard transactions={transactionsResult} />
            </BotMessage>
          );
        },
      },
      // end
      // initiate payment for people
      initiate_pay_people: {
        description: "Displays UI for paying people",
        parameters: z
          .object({
            date: z
              .string()
              .describe("person to pay to"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          const { date, group } = JSON.parse(args as unknown as string);

          const paymentResult = await initiatePayPeople(date, group);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "initiate_pay_people_result",
              content: JSON.stringify(paymentResult),
            },
          ]);

          return (
            <BotMessage>
              <PaymentCard payments={paymentResult} />
            </BotMessage>
          );
        },
      },
      // view insurance plans
      view_insurance_plans: {
        description: "shows a UI with list of insurance plans available",
        parameters: z
          .object({
            type: z
              .enum(["all", "travel", "life", "health"])
              .describe("The type of insurance plan user is interested in"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          const { type } = JSON.parse(args as unknown as string);

          const plansResult = await getInsurancePlans(type);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "view_insurance_plans_result",
              content: JSON.stringify(plansResult),
            },
          ]);

          return (
            <BotMessage>
              <InsurancePlansCard currentPlans={plansResult.currentPlans} otherPlans={plansResult.otherPlans} />
            </BotMessage>
          );
        },
      },
      // end
      // view investments
      view_investments: {
        description: "shows a UI of investment options",
        parameters: z
          .object({
            type: z
              .enum(["all", "bonds", "stocks", "mixed"])
              .describe("The type of investment products user is interested in"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          const { type } = JSON.parse(args as unknown as string) || {};

          const investmentsResult = await getInvestments(type);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "view_investments_result",
              content: JSON.stringify(investmentsResult),
            },
          ]);

          return (
            <BotMessage>
              <InvestmentCard investments={investmentsResult} />
            </BotMessage>
          );
        },
      },
      // end
      // view loans

      view_loans: {
        description: "shows a UI of loan options",

        parameters: z
          .object({
            type: z
              .enum(["all", "personal", "business", "student"])
              .describe("The type of loan product user is interested in"),
          })
          .required(),

        render: async function* (args) {
          yield <Spinner />;

          const { type } = JSON.parse(args as unknown as string) || {};

          const loansResult = await getLoans(type);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "view_loans_result",
              content: JSON.stringify(loansResult),
            },
          ]);

          return (
            <BotMessage>
              <LoansCard loans={loansResult} />
            </BotMessage>
          );
        },
      },
      // end
      // manage cards
      manage_cards: {
        description: "shows a UI for managing cards, when user wants to manage their cards for overseas use for example",
        parameters: z
          .object({
            type: z
              .enum(["all", "multicurrency", "live fresh"])
              .describe("The type of card"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;
          
          const { cardName } = JSON.parse(args as unknown as string) || {};
          
          const cardsResult = await getCreditCards();
          
          let selectedCard = null;
          if (cardName) {
            selectedCard = cardsResult.find((card) => card.name === cardName);
          }
          
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "manage_cards_result",
              content: JSON.stringify(cardsResult),
            }
          ]);
          
          return (
            <BotMessage>
              <CardsManagementCard cards={cardsResult} />
            </BotMessage>
          );
        },
      },
      // end
      // call_hotline
      call_hotline: {
        description: "Display interface to call a hotline",
        parameters: z
          .object({
            reason: z.string().optional().describe("Reason for calling the hotline"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;
          const { name, phoneNumber, avatarUrl, reason } = JSON.parse(args as unknown as string);
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "call_hotline_result",
              content: JSON.stringify({ reason }),
            },
          ]);
          return (
            <BotMessage>
              <div>
                <CallHotline
                />
              </div>
            </BotMessage>
          );
        },
      },
      // end
      // add_money_to_safevault
      add_money_to_safevault: {
        description: "Display interface to add money to safevault",
        parameters: z
          .object({
            confirmation: z.string().describe("user confirmation"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;
          const { confirmation } = JSON.parse(args as unknown as string);
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "add_money_to_safevault_result",
              content: JSON.stringify({ confirmation }),
            },
          ]);
          return (
            <BotMessage>
              <div>
                <AddMoneyToSafevault />
              </div>
            </BotMessage>
          );
        },
      },
      // end
      // display account balances

      display_account_balances: {
        description: "Displays account balances",
        parameters: z
          .object({
            accountType: z
              .string()
              .describe("name of account user interested"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;
          const { accountType } = JSON.parse(args as unknown as string);
          const accountBalances = await getAccountBalances();
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "display_account_balances_result",
              content: JSON.stringify(accountBalances),
            },
          ]);
          return (
            <BotMessage>
              <AccountBalanceCard accounts={accountBalances} />
            </BotMessage>
          );
        },
      },

    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Dummy function for getWeather
async function getWeather(city: string): Promise<any> {
  // This is a mock function. Replace it with your actual weather fetching logic.
  console.log(`Fetching weather for ${city}...`);
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Return a mock weather data
  return {
    city,
    temperature: 7,
    high: 12,
    low: 1,
    weatherType: "Sunny",
  };
}

// Dummy function for payBill
async function payBill(date: Date): Promise<any> {
  // This is a mock function. Replace it with your actual bill payment logic.
  console.log(`Bills for ${date}`);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock payment result
  return [
    {
      id: 1,
      organization: "Acme Inc.",
      dueDate: "2023-06-01",
      amount: 100.0,
    },
    {
      id: 2,
      organization: "XYZ Corporation",
      dueDate: "2023-06-15",
      amount: 75.5,
    },
    {
      id: 3,
      organization: "ABC Company",
      dueDate: "2023-06-30",
      amount: 200.0,
    },
  ];
}

// Dummy function for initiatePayPeople
async function initiatePayPeople(date: Date, group: string): Promise<any> {
  // This is a mock function. Replace it with your actual payment initiation logic.
  console.log(`Initiating payments for ${group} on ${date}`);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock payment result
  return [
    {
      id: 1,
      name: "John Doe",
      group: "friends",
      avatar: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Jane Smith",
      group: "family",
      avatar: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Emily Johnson",
      group: "flatmates",
      avatar: "https://via.placeholder.com/150",
    },
  ];
}
// Dummy function for getAccountBalances

async function getAccountBalances(): Promise<any> {
  // This is a mock function. Replace it with your actual account balance retrieval logic.
  console.log('Retrieving account balances');

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock account balances
  return [
    {
      id: 1,
      name: 'Primary Checking',
      avatar: 'https://via.placeholder.com/150',
      balance: 5000,
    },
    {
      id: 2,
      name: 'Secondary Checking',
      avatar: 'https://via.placeholder.com/150',
      balance: 2500,
    },
    {
      id: 3,
      name: 'Emergency Savings',
      avatar: 'https://via.placeholder.com/150',
      balance: 10000,
    },
    {
      id: 4,
      name: 'Vacation Savings',
      avatar: 'https://via.placeholder.com/150',
      balance: 3000,
    },
    {
      id: 5,
      name: 'Investment Account',
      avatar: 'https://via.placeholder.com/150',
      balance: 25000,
    },
  ];
}

// Dummy function for getTransactions
async function getTransactions(dateRange: { start: Date; end: Date }): Promise<any> {
  // This is a mock function. Replace it with your actual transaction fetching logic.
  console.log(`Transactions from ${dateRange.start} to ${dateRange.end}`);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock transactions result
  return [
          {
            "id": 1,
            "name": "Grocery Store",
            "date": "2024-05-23",
            "time": "14:00",
            "amount": 120.5
          },
          {
            "id": 2,
            "name": "Electricity Bill",
            "date": "2024-05-20",
            "time": "10:30",
            "amount": 250
          },
          {
            "id": 3,
            "name": "Pharmacy",
            "date": "2024-05-18",
            "time": "16:45",
            "amount": 75.3
          },
          {
            "id": 4,
            "name": "Monthly Rent",
            "date": "2024-05-01",
            "time": "09:00",
            "amount": 900
          },
          {
            "id": 5,
            "name": "Phone Bill",
            "date": "2024-05-15",
            "time": "12:00",
            "amount": 60
          },
          {
            "id": 6,
            "name": "Restaurant",
            "date": "2024-05-10",
            "time": "20:00",
            "amount": 150.75
          },
          {
            "id": 7,
            "name": "Water Bill",
            "date": "2024-05-08",
            "time": "11:00",
            "amount": 200
          },
          {
            "id": 8,
            "name": "Clothing Store",
            "date": "2024-05-05",
            "time": "13:00",
            "amount": 80
          },
          {
            "id": 9,
            "name": "Online Subscription",
            "date": "2024-05-03",
            "time": "19:00",
            "amount": 50
          },
          {
            "id": 10,
            "name": "Unknown Number",
            "date": "2024-04-30",
            "time": "21:00",
            "amount": 3000,
            "isScam": true
          }
        ]
      };

// Dummy function for getInsurancePlans
async function getInsurancePlans(type: string): Promise<any> {
  // This is a mock function. Replace it with your actual logic for fetching insurance plans.
  console.log(`Fetching insurance plans of type: ${type}`);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock result
  const allPlans = [
    {
      id: 1,
      name: "Travel Protect",
      type: "travel",
      amount: 120.0,
    },
    {
      id: 2,
      name: "Life Secure",
      type: "life",
      amount: 250.0,
    },
    {
      id: 3,
      name: "Health Guard",
      type: "health",
      amount: 150.0,
    },
    {
      id: 4,
      name: "Global Travel",
      type: "travel",
      amount: 200.0,
    },
    {
      id: 5,
      name: "Family Life",
      type: "life",
      amount: 300.0,
    },
  ];

  // Filter plans by type if necessary
  const filteredPlans = type === 'all' ? allPlans : allPlans.filter(plan => plan.type === type);

  // Mock current plans and other plans
  const currentPlans = filteredPlans.slice(0, 2);
  const otherPlans = filteredPlans.slice(2);

  return {
    currentPlans,
    otherPlans,
  };
}

// Dummy function for getInvestments
async function getInvestments(type: string): Promise<any> {
  // This is a mock function. Replace it with your actual logic for fetching investments.
  console.log("Fetching investments");

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock result
  const allInvestments = [
    {
      id: 1,
      name: "Apple Inc.",
      type: "stocks",
      amount: 5000.0,
    },
    {
      id: 2,
      name: "Government Bond",
      type: "bonds",
      amount: 10000.0,
    },
    {
      id: 3,
      name: "Growth Fund",
      type: "mutual-funds",
      amount: 8000.0,
    },
    {
      id: 4,
      name: "Amazon.com Inc.",
      type: "stocks",
      amount: 4000.0,
    },
    {
      id: 5,
      name: "Corporate Bond",
      type: "bonds",
      amount: 6000.0,
    },
    {
      id: 6,
      name: "Emerging Markets Fund",
      type: "mutual-funds",
      amount: 7000.0,
    },
  ];

  return allInvestments;
}

// Dummy function for getLoans

async function getLoans(type: string): Promise<any> {
  // This is a mock function. Replace it with your actual logic for fetching loans.

  console.log("Fetching loans");

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock result
  const allLoans = [
    {
      id: 1,
      name: "Personal Loan",
      type: "personal",
      duration: 36,
      interestRate: 12.5,
    },
    {
      id: 2,
      name: "Business Loan",
      type: "business",
      duration: 60,
      interestRate: 10.0,
    },
    {
      id: 3,
      name: "Student Loan",
      type: "student",
      duration: 120,
      interestRate: 8.5,
    },
    {
      id: 4,
      name: "Home Improvement Loan",
      type: "personal",
      duration: 48,
      interestRate: 11.0,
    },
    {
      id: 5,
      name: "Equipment Financing",
      type: "business",
      duration: 24,
      interestRate: 9.5,
    },
    {
      id: 6,
      name: "Graduate Loan",
      type: "student",
      duration: 180,
      interestRate: 7.0,
    },
  ];

  if (type === "all") {
    return allLoans;
  } else {
    return allLoans.filter((loan) => loan.type === type);
  }
}

// Dummy function for getCreditCards

async function getCreditCards(): Promise<any[]> {
  // This is a mock function. Replace it with your actual logic for fetching credit cards.
  console.log("Fetching credit cards");

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock result
  const creditCards = [
    {
      id: 1,
      name: "live fresh",
      image: "/live_fresh.webp",
      active: true,
      overseasActive: false,
      spendingLimit: 5000.0,
      currentSpending: 2500.0,
    },
    {
      id: 2,
      name: "multicurrency",
      image: "/multicurrency.webp",
      active: true,
      overseasActive: true,
      spendingLimit: 10000.0,
      currentSpending: 7500.0,
    },
    {
      id: 3,
      name: "insignia",
      image: "/insignia.webp",
      active: false,
      overseasActive: false,
      spendingLimit: 8000.0,
      currentSpending: 1200.0,
    },
  ];

  return creditCards;
}


const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});

