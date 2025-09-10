export default function NotFound() {
	return (
		<div className="relative bg-black text-white h-screen w-screen flex items-center justify-center">
			<div
				className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-20"
				style={{
					backgroundImage: "url('/favicon.ico')",
				}}
			/>

			<div className="absolute inset-0 bg-black/80" />

			<div className="flex flex-col gap-4 items-center justify-center">
				<div className="relative z-10 flex flex-row items-center space-x-2 text-xl">
					<p>404</p>
					<p>|</p>
					<p>Not even Elvis could find what you were looking for!</p>
				</div>
				<a
					className="hover:underline z-10 text-yellow-400"
					href="/scenes/35"
				>
					Go back
				</a>
			</div>
		</div>
	);
}
