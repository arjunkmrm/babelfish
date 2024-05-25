import { createAI, getMutableAIState, render } from "ai/rsc";
import OpenAI from "openai";
import { z } from "zod";
import { Spinner } from "@/components/spinner";
import { BotMessage } from "@/components/message";
import WeatherCard from "@/components/weather-card";
import BillPaymentCard from "@/components/bill-payment-card";
import CurrencyConverter from "@/components/currency-card";
import RegisterPayNow from "@/components/register-paynow-card";
import PastTransactionsCard from "@/components/transactions-card";

const openai = new OpenAI();

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

  const ui = render({
    provider: openai,
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content },
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call)
    text: ({ content, done }) => {
      // text can be streamed from the LLM, but we only want to close the stream with .done() when its completed.
      // done() marks the state as available for the client to access
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }
      return <BotMessage>{content}</BotMessage>;
    },
    tools: {
      // get weather
      get_city_weather: {
        description: "Get the current weather for a city",
        parameters: z
          .object({
            city: z
              .string()
              .describe("The city and state, e.g. San Francisco, CA"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          // Workaround for a bug in the current version (v3.0.1)
          // issue: https://github.com/vercel/ai/issues/1026
          const { city } = JSON.parse(args as unknown as string);
          console.log(city); // This is the correct

          const weather = await getWeather(city);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_weather_info",
              // Content can be any string to provide context to the LLM in the rest of the conversation
              content: JSON.stringify(weather),
            },
          ]);

          return (
            <BotMessage>
              <WeatherCard info={weather} />
            </BotMessage>
          );
        },
      },
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
