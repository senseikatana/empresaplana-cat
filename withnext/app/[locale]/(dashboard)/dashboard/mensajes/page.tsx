"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface Message {
	id: number;
	content: string;
	senderId: number;
	createdAt: string;
}

interface Conversation {
	id: number;
	name: string;
	lastMessage: string;
	unread: number;
}

export default function MensajesPage() {
	const t = useTranslations("app.panel");
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [activeId, setActiveId] = useState<number | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(true);
	const messagesEnd = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetch("/intranet/chat")
			.then((r) => (r.ok ? r.json() : []))
			.then((data) => {
				const list = data?.data ?? data ?? [];
				setConversations(list);
				if (list.length > 0) setActiveId(list[0].id);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (!activeId) return;
		fetch(`/intranet/chat/${activeId}`)
			.then((r) => (r.ok ? r.json() : []))
			.then((data) => setMessages(data?.data ?? data ?? []))
			.catch(() => {});
	}, [activeId]);

	useEffect(() => {
		messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const handleSend = async () => {
		if (!input.trim() || !activeId) return;
		const content = input.trim();
		setInput("");
		try {
			const res = await fetch("/intranet/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ conversationId: activeId, body: content }),
			});
			if (res.ok) {
				const msg = await res.json();
				setMessages((prev) => [...prev, msg]);
			}
		} catch {}
	};

	return (
		<div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-4">
			<div className="w-full md:w-72 shrink-0 bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col">
				<div className="p-4 border-b border-outline-variant">
					<h2 className="font-semibold text-on-surface">{t("conversations")}</h2>
				</div>
				<div className="flex-1 overflow-y-auto">
					{loading ? (
						<div className="p-4 text-center text-on-surface-variant">…</div>
					) : conversations.length === 0 ? (
						<div className="p-4 text-center text-on-surface-variant text-sm">
							{t("selectConversation")}
						</div>
					) : (
						conversations.map((conv) => (
							<button
								key={conv.id}
								onClick={() => setActiveId(conv.id)}
								className={`w-full text-left px-4 py-3 border-b border-outline-variant hover:bg-surface-container transition-colors ${
									activeId === conv.id ? "bg-surface-container" : ""
								}`}
							>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-on-surface truncate">{conv.name}</span>
									{conv.unread > 0 && (
										<span className="text-xs bg-energetic-orange text-white rounded-full px-2 py-0.5">
											{conv.unread}
										</span>
									)}
								</div>
								<p className="text-xs text-on-surface-variant truncate mt-0.5">
									{conv.lastMessage}
								</p>
							</button>
						))
					)}
				</div>
			</div>

			<div className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden">
				{activeId ? (
					<>
						<div className="flex-1 overflow-y-auto p-4 space-y-3">
							{messages.map((msg) => (
								<div key={msg.id} className="max-w-[75%]">
									<div className="bg-surface-container rounded-xl px-4 py-2.5 text-sm text-on-surface">
										{msg.content}
									</div>
									<span className="text-xs text-on-surface-variant mt-1 block">
										{new Date(msg.createdAt).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
							))}
							<div ref={messagesEnd} />
						</div>
						<div className="p-3 border-t border-outline-variant flex gap-2">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSend()}
								placeholder={t("send")}
								className="flex-1 px-4 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-deep-navy"
							/>
							<button
								onClick={handleSend}
								disabled={!input.trim()}
								className="px-4 py-2 bg-deep-navy text-on-primary rounded-lg font-medium text-sm hover:bg-primary transition-colors disabled:opacity-50"
							>
								<span className="material-symbols-outlined text-xl">send</span>
							</button>
						</div>
					</>
				) : (
					<div className="flex-1 flex items-center justify-center text-on-surface-variant">
						<p>{t("selectConversation")}</p>
					</div>
				)}
			</div>
		</div>
	);
}
