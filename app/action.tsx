import { createAI, getMutableAIState, render } from "ai/rsc";
import OpenAI from "openai";
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
import ChatComponent from "@/components/ChatComponent"

const openai = new OpenAI();
const chatHistory = [];

async function submitMessage(content: string) {
  "use server";
  

  const aiState = getMutableAIState<typeof AI>();

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

  chatHistory.push({
    role:"user",
    content: content,
  })

  const ui = render({
    provider: openai,
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful assistant" },
      ...chatHistory, 
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call)
    text: ({ content, done }) => {
      // text can be streamed from the LLM, but we only want to close the stream with .done() when its completed.
      // done() marks the state as available for the client to access
      if (done) {
        const assistantMessage = {
          role: "assistant",
          content,
        }

        chatHistory.push(assistantMessage);
        
        aiState.done([
          ...aiState.get(),
          assistantMessage,
        ]);
      }
      return <BotMessage>{content}</BotMessage>;
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
            fromCurrency: z.string().describe("The starting currency"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          const { amount, fromCurrency, toCurrency } = JSON.parse(args as unknown as string);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "convert_currency_result",
              content: JSON.stringify({ fromCurrency }),
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
            phoneNumber: z.string().describe("optional phone number to register with PayNow"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          const { phoneNumber } = JSON.parse(args as unknown as string);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "register_paynow_result",
              content: JSON.stringify({ phoneNumber }),
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
                end: z.date().describe("The end date of the transaction history"),
              })
              .describe("The date range for the transactions")
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
        description: "Returns a UI with list of insurance plans available",
        parameters: z
          .object({
            type: z
              .enum(["all", "travel", "life", "health"])
              .describe("The type of insurance plan to filter by"),
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
              .describe("The type of investment product"),
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
              .describe("The type of loan product"),
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
        description: "shows a UI for managing credit cards",
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

// Dummy function for getTransactions
async function getTransactions(dateRange: { start: Date; end: Date }): Promise<any> {
  // This is a mock function. Replace it with your actual transaction fetching logic.
  console.log(`Transactions from ${dateRange.start} to ${dateRange.end}`);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock transactions result
  return [
    {
      id: 1,
      name: "Grocery Store",
      date: "2023-05-01",
      time: "10:30 AM",
      amount: 45.0,
    },
    {
      id: 2,
      name: "Online Purchase",
      date: "2023-05-15",
      time: "02:45 PM",
      amount: 89.99,
    },
    {
      id: 3,
      name: "Restaurant",
      date: "2023-05-20",
      time: "07:15 PM",
      amount: 60.0,
    },
  ];
}

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

