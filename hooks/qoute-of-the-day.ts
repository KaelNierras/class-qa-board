import { useEffect, useState } from "react";

export function useQuoteOfTheDay() {
    const [quote, setQuote] = useState("Welcome!");

    useEffect(() => {
        const localKey = "quoteOfTheDay";
        const today = new Date().toISOString().slice(0, 10);

        const stored = localStorage.getItem(localKey);
        if (stored) {
            try {
                const { date, quote: storedQuote } = JSON.parse(stored);
                if (date === today && storedQuote) {
                    setQuote(storedQuote);
                    return;
                }
            } catch {}
        }

        fetch("https://api.api-ninjas.com/v1/quotes", {
            headers: {
                "X-Api-Key": process.env.NEXT_PUBLIC_API_NINJAS_KEY || "",
            },
        })
            .then(res => res.json())
            .then(data => {
                const fetchedQuote = data[0]?.quote || "Welcome!";
                localStorage.setItem(localKey, JSON.stringify({ date: today, quote: fetchedQuote }));
                setQuote(fetchedQuote);
            })
            .catch(() => {
                localStorage.setItem(localKey, JSON.stringify({ date: today, quote: "Welcome!" }));
                setQuote("Welcome!");
            });
    }, []);

    return quote;
}