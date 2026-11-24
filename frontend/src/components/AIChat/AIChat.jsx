import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowUpRight, Bot, LoaderCircle, MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { AI_API_END_POINT } from "../../utils/constant";

const getMessageBlocks = (content) => {
    const blocks = [];
    let paragraphLines = [];
    let listItems = [];

    const flushParagraph = () => {
        if (paragraphLines.length) {
            blocks.push({ type: "paragraph", content: paragraphLines.join(" ") });
            paragraphLines = [];
        }
    };
    const flushList = () => {
        if (listItems.length) {
            blocks.push({ type: "list", items: listItems });
            listItems = [];
        }
    };

    content.split(/\r?\n/).forEach((rawLine) => {
        const line = rawLine.trim();
        if (!line) {
            flushParagraph();
            flushList();
            return;
        }

        const listMatch = line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
        if (listMatch) {
            flushParagraph();
            listItems.push(listMatch[1]);
        } else {
            flushList();
            paragraphLines.push(line);
        }
    });

    flushParagraph();
    flushList();
    return blocks;
};

const suggestedQuestions = [
    "Show me MERN jobs",
    "What jobs are in Delhi?",
    "Which companies are hiring?"
];

const AIChat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [provider, setProvider] = useState("groq");
    const messagesEndRef = useRef(null);
    const assistantName = provider === "groq" ? "Groq" : "OpenAI";

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isOpen, loading, messages, error]);

    const handleSend = async (rawMessage) => {
        const content = rawMessage.trim();
        if (!content || loading) return;

        const history = messages.slice(-8).map(({ role, content: previousMessage }) => ({
            role,
            content: previousMessage
        }));

        setMessages((currentMessages) => [...currentMessages, { role: "user", content }]);
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const endpoint = provider === "groq" ? "chat" : "openai/chat";
            const response = await axios.post(`${AI_API_END_POINT}/${endpoint}`, {
                message: content,
                history
            });

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: "assistant",
                    content: response.data.reply,
                    jobs: Array.isArray(response.data.jobs) ? response.data.jobs : []
                }
            ]);
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Could not connect to the assistant. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const submitMessage = (event) => {
        event.preventDefault();
        handleSend(message);
    };

    const resetConversation = () => {
        if (loading) return;
        setMessages([]);
        setMessage("");
        setError("");
    };

    return (
        <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
            {isOpen && (
                <section
                    aria-label="JobPortal AI Career Assistant"
                    aria-modal="false"
                    className="flex h-[min(38rem,calc(100vh-6rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-20px_rgba(15,23,42,0.38)]"
                    role="dialog"
                >
                    <header className="relative overflow-hidden bg-gradient-to-br from-[#6A38C2] via-[#6032b5] to-[#44228f] px-5 pb-5 pt-4 text-white">
                        <div className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                        <div className="relative flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner">
                                    <Bot size={23} aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                                        JobPortal assistant
                                    </p>
                                    <h2 className="truncate text-lg font-semibold tracking-tight">
                                        Your career guide
                                    </h2>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    onClick={resetConversation}
                                    disabled={loading || messages.length === 0}
                                    aria-label="Start a new conversation"
                                    title="Start a new conversation"
                                    className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <RotateCcw size={17} aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close chat"
                                    className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                                >
                                    <X size={19} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                        <div className="relative mt-4 flex items-center justify-between gap-3">
                            <p className="text-xs text-white/75">
                                Answers from current job & company listings
                            </p>
                            <label className="sr-only" htmlFor="ai-provider">Choose AI provider</label>
                            <select
                                id="ai-provider"
                                value={provider}
                                onChange={(event) => {
                                    setProvider(event.target.value);
                                    setError("");
                                }}
                                disabled={loading}
                                className="max-w-28 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white outline-none transition hover:bg-white/15 focus:ring-2 focus:ring-white/60 disabled:opacity-60"
                            >
                                <option value="groq" className="text-slate-900">Groq</option>
                                <option value="openai" className="text-slate-900">OpenAI</option>
                            </select>
                        </div>
                    </header>

                    <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/80 px-4 py-5 sm:px-5" aria-live="polite">
                        {messages.length === 0 ? (
                            <div className="flex min-h-full flex-col items-center justify-center text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-orange-50 text-[#6A38C2]">
                                    <Sparkles size={25} aria-hidden="true" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900">Find your next move</h3>
                                <p className="mt-1 max-w-[16rem] text-sm leading-5 text-slate-500">
                                    Ask about jobs and companies listed on this portal.
                                </p>
                                <div className="mt-5 flex w-full flex-wrap justify-center gap-2">
                                    {suggestedQuestions.map((question) => (
                                        <button
                                            key={question}
                                            type="button"
                                            onClick={() => handleSend(question)}
                                            disabled={loading}
                                            className="rounded-full border border-violet-100 bg-white px-3 py-2 text-xs font-medium text-violet-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((entry, index) => (
                                <div
                                    key={`${entry.role}-${index}`}
                                    className={`flex items-end gap-2 ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {entry.role === "assistant" && (
                                        <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                                            <Sparkles size={14} aria-hidden="true" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[88%] min-w-0 break-words rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                                            entry.role === "user"
                                                ? "rounded-br-md bg-[#6A38C2] text-white shadow-sm"
                                                : "rounded-bl-md border border-slate-100 bg-white text-slate-700 shadow-sm"
                                        }`}
                                    >
                                        {entry.role === "user" ? (
                                            <p className="whitespace-pre-wrap">{entry.content}</p>
                                        ) : (
                                            <>
                                                <div className="space-y-2.5">
                                                    {getMessageBlocks(entry.content).map((block, blockIndex) => (
                                                        block.type === "list" ? (
                                                            <ul key={blockIndex} className="list-disc space-y-1 pl-5 marker:text-violet-500">
                                                                {block.items.map((item, itemIndex) => (
                                                                    <li key={itemIndex} className="pl-0.5">{item}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p key={blockIndex}>{block.content}</p>
                                                        )
                                                    ))}
                                                </div>
                                                {entry.jobs?.length > 0 && (
                                                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                                                        {entry.jobs.slice(0, 4).map((job) => (
                                                            <div
                                                                key={job._id}
                                                                className="flex items-center justify-between gap-2 rounded-xl bg-violet-50/80 px-3 py-2"
                                                            >
                                                                <div className="min-w-0">
                                                                    <p className="truncate text-xs font-semibold leading-4 text-slate-900">
                                                                        {job.company || "Company"}
                                                                    </p>
                                                                    <p className="truncate text-xs leading-4 text-slate-500">
                                                                        {job.title}
                                                                    </p>
                                                                </div>
                                                                <a
                                                                    href={`/description/${encodeURIComponent(job._id)}`}
                                                                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#6A38C2] px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#552ba5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                                                                >
                                                                    Apply <ArrowUpRight size={13} aria-hidden="true" />
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="flex items-end gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                                    <Sparkles size={14} aria-hidden="true" />
                                </div>
                                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-100 bg-white px-3.5 py-2.5 text-sm text-slate-500 shadow-sm">
                                    <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
                                    {assistantName} is thinking
                                </div>
                            </div>
                        )}
                        {error && (
                            <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm leading-5 text-red-700">
                                {error}
                            </p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={submitMessage} className="border-t border-slate-100 bg-white p-3.5 sm:p-4">
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100">
                            <input
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="Ask about a job or company..."
                                aria-label="Message for AI career assistant"
                                className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
                            />
                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                aria-label="Send message"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6A38C2] text-white shadow-sm transition hover:bg-[#552ba5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Send size={16} aria-hidden="true" />
                            </button>
                        </div>
                        <p className="mt-2 text-center text-[10px] text-slate-400">
                            Replies are based on current portal listings
                        </p>
                    </form>
                </section>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close AI Career Assistant" : "Open AI Career Assistant"}
                className="group flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-[#6A38C2] to-[#5227a3] px-4 text-white shadow-[0_8px_24px_-6px_rgba(83,39,163,0.65)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-6px_rgba(83,39,163,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
            >
                {isOpen ? <X size={20} aria-hidden="true" /> : <MessageCircle size={20} aria-hidden="true" />}
                <span className="text-sm font-semibold">{isOpen ? "Close" : "Ask AI"}</span>
            </button>
        </div>
    );
};

export default AIChat;
