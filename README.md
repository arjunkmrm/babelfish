## About

This is a project [Valli](https://github.com/vallipichappan) and I built for angelhack's HackSingapore 2024. 
- **Problem statement:** 
    - Navigating banking applications is tough, there are 20 - 30 tools in an application. 
    - Many useful features end up not being used or not even known.
    - *How can we make navigating banking applications so simple, that even your grandma would love to use it?*
- **Solution:** 
    - Create generative user interfaces on the fly based on user interaction in any language. 
    - *Say goodbye to navigating through the UI, let the UI navigate to you.*

It utilizes [Vercel AI SDK v3.0](https://github.com/vercel/ai) to implement Generative UI.
It's developed based on the sample code provided in the [official documentation](https://sdk.vercel.ai/docs/concepts/ai-rsc).

## Demo

- [Generative UI Demo](https://www.youtube.com/watch?v=B_Wksd7MpRg)

[![Generative UI Demo](https://img.youtube.com/vi/B_Wksd7MpRg/0.jpg)](https://www.youtube.com/watch?v=B_Wksd7MpRg)

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/arjunkmrm/babelfish
```

2. Go to the project folder

```bash
cd babelfish
```

3. Install packages

```bash
pnpm install
```

4. Setup your .env.local file. And set your own OpenAI API Key.

```bash
cp .env.example .env.local
```

5. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.




