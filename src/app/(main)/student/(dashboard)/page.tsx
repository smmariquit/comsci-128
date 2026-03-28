import Image from "next/image";
import { userData } from "@/app/lib/data/user-data";

export default async function DashboardPage() {
	const currUser = await userData.findById(30);
	const placeholderImage = "/assets/placeholders/housing-414x264.svg";
	const cardWidth = 414;
	const cardImageHeight = 264;
	const cardFooterHeight = 54;
	const cardHeight = cardImageHeight + cardFooterHeight;
	const housingCards = Array.from({ length: 10 }, (_, index) => ({
		id: index + 1,
		name: `Housing ${index + 1}`,
	}));

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				overflow: "hidden",
				flexDirection: "column",
				justifyContent: "flex-start",
				alignItems: "flex-start",
				display: "inline-flex",
			}}
		>
			<div
				style={{
					width: "100%",
					minHeight: 162,
					background: "white",
					flexDirection: "column",
					justifyContent: "flex-start",
					alignItems: "center",
					display: "flex",
				}}
			>
				<div
					style={{
						alignSelf: "stretch",
						height: 108,
						paddingLeft: 18,
						paddingRight: 18,
						background: "#567375",
						overflow: "hidden",
						justifyContent: "space-between",
						alignItems: "center",
						display: "inline-flex",
					}}
				>
					<div style={{ overflow: "hidden", justifyContent: "flex-start", alignItems: "center", display: "flex" }}>
						<div
							style={{
								width: 215,
								height: 72,
								paddingLeft: 36,
								paddingRight: 36,
								paddingTop: 10,
								paddingBottom: 10,
								background: "white",
								justifyContent: "flex-start",
								alignItems: "center",
								display: "flex",
							}}
						>
							<div
								style={{
									justifyContent: "center",
									display: "flex",
									flexDirection: "column",
									color: "#1C2632",
									fontSize: 40,
									fontFamily: "DM Sans",
									fontWeight: "600",
									wordWrap: "break-word",
								}}
							>
								Title
							</div>
						</div>
						<div style={{ overflow: "hidden", justifyContent: "flex-start", alignItems: "center", display: "flex" }}>
							<div
								style={{
									alignSelf: "stretch",
									paddingLeft: 18,
									paddingRight: 18,
									justifyContent: "flex-start",
									alignItems: "center",
									display: "flex",
								}}
							>
								<div
									style={{
										justifyContent: "center",
										display: "flex",
										flexDirection: "column",
										color: "black",
										fontSize: 24,
										fontFamily: "DM Mono",
										fontWeight: "400",
										wordWrap: "break-word",
									}}
								>
									Dashboard
								</div>
							</div>
							<div
								style={{
									width: 72,
									height: 0,
									left: 0,
									top: 0,
									position: "absolute",
									transform: "rotate(90deg)",
									transformOrigin: "top left",
									outline: "2px black solid",
									outlineOffset: "-1px",
								}}
							/>
							<div
								style={{
									alignSelf: "stretch",
									paddingLeft: 18,
									paddingRight: 18,
									justifyContent: "flex-start",
									alignItems: "center",
									display: "flex",
								}}
							>
								<div
									style={{
										justifyContent: "center",
										display: "flex",
										flexDirection: "column",
										color: "black",
										fontSize: 24,
										fontFamily: "DM Mono",
										fontWeight: "400",
										wordWrap: "break-word",
									}}
								>
									Browse
								</div>
							</div>
						</div>
					</div>
					<div
						style={{
							width: 260,
							height: 72,
							padding: 12,
							background: "white",
							justifyContent: "space-between",
							alignItems: "center",
							display: "flex",
						}}
					>
						<div
							style={{
								justifyContent: "center",
								display: "flex",
								flexDirection: "column",
								color: "black",
								fontSize: 24,
								fontFamily: "DM Mono",
								fontWeight: "400",
								wordWrap: "break-word",
							}}
						>
							{currUser?.first_name ?? "Username"}
						</div>
						<div style={{ width: 48, height: 48, background: "#6B6B6B" }} />
					</div>
				</div>
				<div
					style={{
						alignSelf: "stretch",
						height: 54,
						paddingLeft: 36,
						paddingRight: 36,
						paddingTop: 10,
						paddingBottom: 10,
						background: "#1C2632",
						overflow: "hidden",
						justifyContent: "flex-start",
						alignItems: "center",
						gap: 10,
						display: "inline-flex",
					}}
				>
					<div
						style={{
							justifyContent: "center",
							display: "flex",
							flexDirection: "column",
							color: "#C9642A",
							fontSize: 40,
							fontFamily: "DM Sans",
							fontWeight: "600",
							wordWrap: "break-word",
						}}
					>
						Housing Browser
					</div>
				</div>
			</div>
			<div
				style={{
					alignSelf: "stretch",
					flex: "1 1 0",
					paddingTop: 72,
					position: "relative",
					background: "#EDE9DE",
					overflow: "hidden",
					justifyContent: "flex-start",
					alignItems: "flex-start",
					display: "inline-flex",
				}}
			>
				<div style={{ left: 0, top: 18, position: "absolute", justifyContent: "flex-start", alignItems: "center", gap: 10, display: "flex" }}>
					<div style={{ width: 32, height: 32, left: 0, top: 2, position: "absolute", overflow: "hidden" }}>
						<div style={{ width: 25.6, height: 22.4, left: 3.2, top: 6.4, position: "absolute", background: "#C9642A" }} />
					</div>
				</div>
				<div
					style={{
						width: 1142,
						paddingLeft: 24,
						paddingRight: 24,
						left: 54,
						top: 19,
						position: "absolute",
						background: "#EDE9DE",
						borderRadius: 18,
						outline: "2px black solid",
						outlineOffset: "-2px",
						justifyContent: "flex-start",
						alignItems: "center",
						display: "flex",
					}}
				>
					<div
						style={{
							justifyContent: "center",
							display: "flex",
							flexDirection: "column",
							color: "black",
							fontSize: 26,
							fontFamily: "DM Mono",
							fontWeight: "400",
							wordWrap: "break-word",
						}}
					>
						Search
					</div>
				</div>
				<div
					style={{
						width: 208,
						paddingLeft: 24,
						left: 1214,
						top: 18,
						position: "absolute",
						background: "#1C2632",
						borderRadius: 18,
						justifyContent: "space-between",
						alignItems: "center",
						display: "flex",
					}}
				>
					<div
						style={{
							justifyContent: "center",
							display: "flex",
							flexDirection: "column",
							color: "#C9642A",
							fontSize: 26,
							fontFamily: "DM Sans",
							fontWeight: "600",
							wordWrap: "break-word",
						}}
					>
						Sort By
					</div>
					<div style={{ width: 36, height: 36, position: "relative", overflow: "hidden" }} />
				</div>
				<div
					style={{
						flex: "1 1 0",
						alignSelf: "stretch",
						paddingLeft: 36,
						paddingRight: 36,
						overflow: "hidden",
						flexDirection: "column",
						justifyContent: "flex-start",
						alignItems: "flex-start",
						gap: 10,
						display: "inline-flex",
					}}
				>
					<div
						style={{
							alignSelf: "stretch",
							padding: 18,
							background: "#EDE9DE",
							overflow: "hidden",
							flexDirection: "column",
							justifyContent: "flex-start",
							alignItems: "flex-start",
							display: "inline-flex",
							gap: 12,
						}}
					>
						{housingCards.map((card) => (
							<div
								key={card.id}
								data-property-1="Preview"
								style={{
									width: cardWidth,
									height: cardHeight,
									background: "white",
									overflow: "hidden",
									borderRadius: 18,
									flexDirection: "column",
									justifyContent: "flex-start",
									alignItems: "flex-start",
									display: "inline-flex",
								}}
							>
								<div style={{ alignSelf: "stretch", flex: "1 1 0", overflow: "hidden", display: "flex" }}>
									<Image
										src={placeholderImage}
										alt={`${card.name} preview image`}
										width={cardWidth}
										height={cardImageHeight}
										style={{ alignSelf: "stretch", height: cardImageHeight, width: "100%", objectFit: "cover" }}
									/>
								</div>
								<div
									style={{
										alignSelf: "stretch",
										height: cardFooterHeight,
										paddingLeft: 24,
										paddingRight: 24,
										background: "#1C2632",
										overflow: "hidden",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "flex-start",
										display: "flex",
									}}
								>
									<div
										style={{
											justifyContent: "center",
											display: "flex",
											flexDirection: "column",
											color: "#C9642A",
											fontSize: 26,
											fontFamily: "DM Sans",
											fontWeight: "600",
											wordWrap: "break-word",
										}}
									>
										{card.name}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
