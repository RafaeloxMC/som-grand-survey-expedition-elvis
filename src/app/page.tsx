"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clue, DialogContent } from "@/util/types";

const INITIAL_CLUES: Clue[] = [
	{
		id: "flashlight",
		name: "Flashlight",
		description: "Standard investigation equipment",
	},
	{
		id: "notepad",
		name: "Notepad",
		description: "For recording observations",
	},
];

const ALL_CLUES: Clue[] = [
	{
		id: "sunglasses",
		name: "Gold-rimmed sunglasses",
		description: "Distinctive TCB inscription",
	},
	{
		id: "sign",
		name: "Suspicious signage",
		description: "Hastily made with hidden text",
	},
	{
		id: "radio",
		name: "Vintage radio evidence",
		description: "Picks up underground signals",
	},
	{
		id: "tree",
		name: "Carved initials",
		description: "E.P. + P.P. in a heart",
	},
	{
		id: "bush",
		name: "Hidden jumpsuit",
		description: "White with rhinestones",
	},
	{
		id: "speaker",
		name: "Hidden speaker system",
		description: "Playing Elvis hits on repeat",
	},
];

const DIALOGS: DialogContent[] = [
	{
		itemId: "sunglasses",
		title: "🕶️ Suspicious Eyewear",
		content: `These aren't just any sunglasses... they're gold-rimmed, with a very distinctive style.
The lenses are tinted blue, and there's a small "TCB" inscription on the temple.
Someone clearly dropped these in a hurry. They're still warm!`,
	},
	{
		itemId: "sign",
		title: "📋 Hastily Made Sign",
		content: `This sign was clearly made in a hurry. The wood is fresh and the paint is still slightly wet.
It reads "DEFINITELY JUST A NORMAL HOLE" in handwriting that looks suspiciously like it was trying to disguise itself.
Upon closer inspection, you can see that it originally said something else underneath...`,
	},
	{
		itemId: "radio",
		title: "📻 Mysterious Radio",
		content: `You tune the radio and suddenly hear a familiar voice crooning "Love Me Tender" coming from... underground?
The signal seems to be strongest when you point the antenna toward the hole.
Wait... is that a live performance?`,
	},
	{
		itemId: "tree",
		title: "🌳 Ancient Oak Tree",
		content: `You examine the old oak tree and notice fresh carvings in the bark.
"E.P. + P.P." is carved inside a heart, along with "TCB 4EVR".
The bark around the carving is still oozing sap - this was done recently!`,
	},
	{
		itemId: "bush",
		title: "🌿 Suspicious Shrubbery",
		content: `You push aside the leaves and discover a white jumpsuit covered in rhinestones!
It's been hastily stuffed into the bush, but it's clearly expensive and well-maintained.
There's a name tag that reads "Property of The King".`,
	},
	{
		itemId: "speaker",
		title: "🪨 Ordinary Rock",
		content: `It's just a rock. But wait... it's warm to the touch and seems to be vibrating slightly.
You lift it up and discover a hidden speaker underneath playing "Hound Dog" at very low volume!
Someone's been using this as a decoy!`,
	},
];

export default function ElvisAdventure() {
	const [discoveredClues, setDiscoveredClues] = useState<Clue[]>([]);
	const [dialogContent, setDialogContent] = useState<DialogContent | null>(
		null
	);
	const [musicPlaying, setMusicPlaying] = useState(false);
	const [sequins, setSequins] = useState<
		Array<{ id: string; x: number; y: number }>
	>([]);
	const [windowWidth, setWindowWidth] = useState(1200);
	const [foundItems, setFoundItems] = useState<string[]>([]);
	const [suspicionLevel, setSuspicionLevel] = useState(0);

	useEffect(() => {
		setDiscoveredClues(INITIAL_CLUES);

		function handleResize() {
			setWindowWidth(window.innerWidth);
		}

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const addClue = (clue: Clue) => {
		setDiscoveredClues((prev) => {
			if (!prev.find((c) => c.id === clue.id)) {
				setSuspicionLevel((s) => s + 1);
				return [...prev, clue];
			}
			return prev;
		});
	};

	const showDialog = (content: DialogContent) => {
		setDialogContent(content);
	};

	const closeDialog = () => {
		setDialogContent(null);
	};

	function examine(id: string) {
		if (id == "hole") {
			examineHole();
			return;
		}
		if (foundItems.includes(id)) return;
		setFoundItems((prev) => [...prev, id]);

		for (const dialog of DIALOGS) {
			if (dialog.itemId === id) {
				if (id === "radio") {
					if (!musicPlaying) {
						setMusicPlaying(true);
					}
				}
				showDialog(dialog);
			}
		}

		for (const clue of ALL_CLUES) {
			if (clue.id === id) {
				addClue(clue);
			}
		}
	}

	function examineHole() {
		const evidenceClues = discoveredClues.filter(
			(clue) => !["flashlight", "notepad"].includes(clue.id)
		);

		if (evidenceClues.length < 5) {
			showDialog({
				itemId: "hole",
				title: "🔍 The Mysterious Hole",
				content: `You peer into the dark depths. It's surprisingly deep and... is that carpeting down there?
The hole seems to go way deeper than a normal hole should. You hear a faint echo that sounds suspiciously like... no, it couldn't be. You need more evidence before investigating further.

Evidence needed: ${evidenceClues.length}/5`,
			});
		} else {
			showDialog({
				itemId: "hole",
				title: "🕳️ Into the Rabbit Hole",
				content: `With all the evidence you've gathered, you decide to investigate further.
You shine your flashlight down and see... a ladder? And is that a neon sign that says "Graceland II"?
A voice from below calls out: "Thank ya, thank ya very much for finding me. I was just... uh... inspecting this here hole for... geological purposes."
🎵 MYSTERY SOLVED! 🎵`,
				isVictory: true,
			});
		}
	}

	function handleSceneClick(e: React.MouseEvent) {
		if (Math.random() < 0.15) {
			const rect = e.currentTarget.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 100;
			const y = ((e.clientY - rect.top) / rect.height) * 100;

			const newSequin = {
				id: Date.now().toString(),
				x,
				y,
			};

			setSequins((prev) => [...prev, newSequin]);

			setTimeout(() => {
				setSequins((prev) => prev.filter((s) => s.id !== newSequin.id));
			}, 8000);
		}
	}

	function restartScene() {
		setDiscoveredClues(INITIAL_CLUES);
		setMusicPlaying(false);
		setSequins([]);
		setFoundItems([]);
		setSuspicionLevel(0);
		closeDialog();
	}

	const getSuspicionText = () => {
		if (suspicionLevel <= 1) return "Nothing suspicious here...";
		if (suspicionLevel <= 3) return "Something's not quite right...";
		if (suspicionLevel <= 5) return "This is getting weird...";
		return "HIGHLY SUSPICIOUS ACTIVITY DETECTED!";
	};

	return (
		<div className="relative w-screen h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-green-300 cursor-crosshair overflow-hidden">
			<div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-black/85 text-yellow-400 px-8 py-4 rounded-lg text-center z-50 border-2 border-yellow-400 shadow-lg max-w-4xl">
				<h1 className="text-2xl font-bold">
					A Hole in the Ground Where Elvis Presley is Definitely Not
					Hiding
				</h1>
				<p className="text-sm italic text-gray-300 mt-1">
					Scene 35 - I mean, he&apos;s not dead... right?
				</p>
			</div>

			<div className="absolute top-5 left-5 bg-black/85 text-white px-4 py-3 rounded-lg border-2 border-red-500 z-50">
				<div className="text-sm font-bold text-red-400">
					SUSPICION LEVEL
				</div>
				<div className="flex gap-1 mt-1">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className={`w-4 h-2 rounded ${
								i < suspicionLevel
									? "bg-red-500"
									: "bg-gray-600"
							}`}
						/>
					))}
				</div>
				<div className="text-xs text-gray-300 mt-1">
					{getSuspicionText()}
				</div>
			</div>

			<motion.div
				className="absolute top-[10%] right-[15%] w-16 h-16 bg-yellow-400 rounded-full shadow-lg"
				animate={{
					rotate: 360,
				}}
				transition={{
					duration: 60,
					repeat: Infinity,
					ease: "linear",
				}}
			>
				<div className="absolute inset-2 bg-yellow-300 rounded-full">
					<div className="absolute inset-2 bg-yellow-200 rounded-full"></div>
				</div>
			</motion.div>

			<motion.div
				className="absolute top-[15%] w-24 h-10 bg-white rounded-full opacity-80 shadow-md"
				initial={{ x: -100 }}
				animate={{ x: windowWidth + 200 }}
				transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
			>
				<div className="absolute -top-4 left-2 w-12 h-12 bg-white rounded-full"></div>
				<div className="absolute -top-2 right-4 w-16 h-10 bg-white rounded-full"></div>
			</motion.div>

			<motion.div
				className="absolute top-[25%] w-20 h-8 bg-white rounded-full opacity-60 shadow-md"
				initial={{ x: windowWidth + 100 }}
				animate={{ x: -300 }}
				transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
			>
				<div className="absolute -top-3 left-3 w-10 h-10 bg-white rounded-full"></div>
				<div className="absolute -top-1 right-2 w-12 h-6 bg-white rounded-full"></div>
			</motion.div>

			<motion.div
				className="absolute bottom-[60%] left-[15%] w-20 h-40 bg-transparent cursor-pointer z-40"
				whileHover={{ scale: 1.1 }}
				onClick={(e) => {
					e.stopPropagation();
					examine("tree");
				}}
				title="An old oak tree with fresh carvings..."
			>
				<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-20 bg-amber-900 rounded"></div>
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-green-700 rounded-full"></div>
				<div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-green-600 rounded-full"></div>
				<div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-500 rounded-full"></div>
				{!foundItems.includes("tree") && (
					<motion.div
						className="absolute top-20 left-1/2 transform -translate-x-1/2 text-red-500 text-xl"
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ duration: 2, repeat: Infinity }}
					>
						💕
					</motion.div>
				)}
			</motion.div>

			<motion.div
				className="absolute bottom-[60%] right-[25%] w-24 h-16 bg-green-600 rounded-full cursor-pointer z-40"
				whileHover={{ scale: 1.1 }}
				onClick={(e) => {
					e.stopPropagation();
					examine("bush");
				}}
				title="A suspiciously well-groomed bush..."
			>
				<div className="absolute top-2 left-2 w-20 h-12 bg-green-500 rounded-full"></div>
				<div className="absolute top-4 left-4 w-16 h-8 bg-green-400 rounded-full"></div>
				{!foundItems.includes("bush") && (
					<motion.div
						className="absolute top-2 right-2 w-3 h-6 bg-white rounded"
						animate={{ opacity: [0.3, 1, 0.3] }}
						transition={{ duration: 3, repeat: Infinity }}
					/>
				)}
			</motion.div>

			<motion.div
				className="absolute bottom-[25%] left-[15%] w-12 h-8 bg-gray-500 rounded-full cursor-pointer shadow-lg z-40"
				whileHover={{ scale: 1.1 }}
				onClick={(e) => {
					e.stopPropagation();
					examine("speaker");
				}}
				title="Just an ordinary rock... or is it?"
			>
				<div className="absolute top-1 left-1 w-10 h-6 bg-gray-400 rounded-full"></div>
				<div className="absolute top-2 left-2 w-8 h-4 bg-gray-300 rounded-full"></div>
				{!foundItems.includes("speaker") && musicPlaying && (
					<motion.div
						className="absolute -top-1 -left-1 w-2 h-2 bg-green-400 rounded-full"
						animate={{ opacity: [0, 1, 0] }}
						transition={{ duration: 1, repeat: Infinity }}
					/>
				)}
			</motion.div>

			<div
				className="absolute bottom-0 w-full h-3/5 bg-gradient-to-b from-green-500 to-green-700 rounded-t-[50px] shadow-inner"
				onClick={handleSceneClick}
			>
				<motion.div
					className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-48 h-36 bg-gradient-to-br from-black via-gray-800 to-gray-600 rounded-full cursor-pointer shadow-inner border-4 border-gray-700"
					whileHover={{
						scale: 1.05,
						boxShadow: "inset 0 0 40px rgba(255, 215, 0, 0.3)",
					}}
					onClick={(e) => {
						e.stopPropagation();
						examineHole();
					}}
					title="A suspiciously well-maintained hole..."
				>
					<motion.div
						className="absolute inset-0 bg-yellow-400 rounded-full opacity-10"
						animate={{
							opacity: [0.05, 0.15, 0.05],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
						}}
					/>
				</motion.div>

				{!foundItems.includes("sunglasses") && (
					<motion.div
						className="absolute bottom-[65%] right-[25%] w-10 h-5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full cursor-pointer border-2 border-yellow-700 shadow-lg"
						whileHover={{ scale: 1.2 }}
						onClick={(e) => {
							e.stopPropagation();
							examine("sunglasses");
						}}
						title="Gold-rimmed sunglasses... hmm"
						animate={{
							y: [0, -2, 0],
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
						}}
					>
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-yellow-800"></div>
						<div className="absolute top-1/2 left-1 w-2 h-2 bg-blue-600 rounded-full opacity-70"></div>
						<div className="absolute top-1/2 right-1 w-2 h-2 bg-blue-600 rounded-full opacity-70"></div>
					</motion.div>
				)}

				{!foundItems.includes("sign") && (
					<motion.div
						className="absolute bottom-[55%] left-[40%] w-28 h-20 bg-amber-800 rounded cursor-pointer flex items-center justify-center border-2 border-amber-900 shadow-lg"
						whileHover={{ scale: 1.1, rotate: 2 }}
						onClick={(e) => {
							e.stopPropagation();
							examine("sign");
						}}
						title="A hastily made sign"
						animate={{
							rotate: [-1, 1, -1],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
						}}
					>
						<div className="text-white text-xs font-bold text-center leading-tight">
							DEFINITELY
							<br />
							JUST A<br />
							NORMAL
							<br />
							HOLE
						</div>
					</motion.div>
				)}

				{!foundItems.includes("radio") && (
					<motion.div
						className="absolute bottom-[45%] right-[5%] w-14 h-10 bg-gray-400 rounded border-2 border-gray-600 cursor-pointer flex items-center justify-center shadow-lg"
						whileHover={{ scale: 1.2 }}
						onClick={(e) => {
							e.stopPropagation();
							examine("radio");
						}}
						title="An old transistor radio"
						animate={{
							boxShadow: musicPlaying
								? [
										"0 0 0 rgba(34, 197, 94, 0.7)",
										"0 0 20px rgba(34, 197, 94, 0.7)",
										"0 0 0 rgba(34, 197, 94, 0.7)",
								  ]
								: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
						}}
					>
						<span className="text-xl">📻</span>
						{musicPlaying && (
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
						)}
					</motion.div>
				)}

				{[
					{ bottom: "30%", left: "45%", delay: 0 },
					{ bottom: "32%", left: "55%", delay: 0.5 },
					{ bottom: "28%", left: "48%", delay: 1 },
					{ bottom: "35%", left: "52%", delay: 1.5 },
					{ bottom: "33%", left: "43%", delay: 2 },
					{ bottom: "29%", left: "57%", delay: 2.5 },
				].map((sequin, index) => (
					<motion.div
						key={index}
						className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-sm"
						style={{ bottom: sequin.bottom, left: sequin.left }}
						animate={{
							opacity: [0.7, 1, 0.7],
							scale: [1, 1.3, 1],
							rotate: [0, 180, 360],
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
							delay: sequin.delay,
						}}
					/>
				))}

				<AnimatePresence>
					{sequins.map((sequin) => (
						<motion.div
							key={sequin.id}
							className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
							style={{
								left: `${sequin.x}%`,
								top: `${sequin.y}%`,
							}}
							initial={{ opacity: 0, scale: 0 }}
							animate={{
								opacity: [0, 1, 0],
								scale: [0, 1.5, 0],
								rotate: [0, 720],
							}}
							exit={{ opacity: 0, scale: 0 }}
							transition={{ duration: 8 }}
						/>
					))}
				</AnimatePresence>

				<AnimatePresence>
					{musicPlaying && (
						<>
							{[...Array(8)].map((_, i) => (
								<motion.div
									key={i}
									className="absolute text-yellow-400 text-2xl pointer-events-none font-bold"
									style={{
										left: `${40 + Math.random() * 20}%`,
										bottom: "40%",
									}}
									initial={{ opacity: 0, y: 0, rotate: 0 }}
									animate={{
										opacity: [0, 1, 0],
										y: -50,
										rotate: 360,
									}}
									exit={{ opacity: 0 }}
									transition={{
										duration: 4,
										delay: i * 0.3,
										ease: "easeInOut",
									}}
								>
									{
										["♪", "♫", "♩", "♬"][
											Math.floor(Math.random() * 4)
										]
									}
								</motion.div>
							))}
						</>
					)}
				</AnimatePresence>
			</div>

			<div className="fixed top-24 right-5 bg-black/90 p-4 rounded-lg min-w-[280px] border-2 border-yellow-400 shadow-lg max-h-[60vh] overflow-y-auto">
				<h3 className="text-yellow-400 mb-3 font-bold text-lg">
					Investigation Notes
				</h3>
				<div className="space-y-2">
					{discoveredClues.map((clue) => (
						<div
							key={clue.id}
							className="text-white text-sm p-2 bg-white/10 rounded border border-gray-600 hover:bg-white/20 transition-colors"
							title={clue.description}
						>
							✓ {clue.name}
						</div>
					))}
				</div>
				<div className="mt-3 text-xs text-gray-400 border-t border-gray-600 pt-2">
					Evidence:{" "}
					{
						discoveredClues.filter(
							(c) => !["flashlight", "notepad"].includes(c.id)
						).length
					}
					/6
				</div>
				<div className="text-xs text-gray-400">
					Items found: {foundItems.length}/6
				</div>
			</div>

			<AnimatePresence>
				{dialogContent && (
					<motion.div
						className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black/95 text-white p-6 rounded-lg max-w-3xl min-h-[120px] z-50 border-2 border-yellow-400 shadow-2xl"
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 100, opacity: 0 }}
						transition={{ duration: 0.5 }}
					>
						<button
							className="absolute top-3 right-4 text-yellow-400 text-xl hover:text-yellow-200 transition-colors"
							onClick={closeDialog}
						>
							✕
						</button>
						<h3 className="text-xl font-bold mb-3 text-yellow-400">
							{dialogContent.title}
						</h3>
						<p className="text-gray-200 whitespace-pre-line leading-relaxed">
							{dialogContent.content}
						</p>
						{dialogContent.isVictory && (
							<div className="flex flex-row gap-x-4 items-center justify-between">
								<button
									className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition-colors font-bold"
									onClick={restartScene}
								>
									Start New Investigation
								</button>
								<a
									href="/scenes/47/"
									className="text-yellow-400 hover:underline mt-auto"
								>
									Continue to: Wetwater Lake
								</a>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
