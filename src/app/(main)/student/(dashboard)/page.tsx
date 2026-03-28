import Image from "next/image";
import Link from "next/link";
import { userData } from "@/app/lib/data/user-data";

export default async function DashboardPage() {
    const currUser = await userData.findById(30);
    const cards = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `Housing ${i + 1}`,
    }));

	return (
        <div
            style={{
                width: "100%",
                minHeight: "100%",
                background: "white",
                display: "inline-flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
            }}
        >
            <div
                style={{
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
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <div
                        style={{
                            width: 215,
                            height: 72,
                            paddingLeft: 36,
                            paddingRight: 36,
                            paddingTop: 10,
                            paddingBottom: 10,
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ color: "#1C2632", fontSize: 40, fontFamily: "DM Sans", fontWeight: "600" }}>Title</div>
                    </div>
                    <div style={{ color: "black", fontSize: 24, fontFamily: "DM Mono" }}>Dashboard</div>
                    <div style={{ width: 2, height: 36, background: "black" }} />
                    <Link
                        href="/student/housing"
                        style={{ color: "black", fontSize: 24, fontFamily: "DM Mono", textDecoration: "none" }}
                    >
                        Browse
                    </Link>
                </div>
                <div
                    style={{
                        width: 260,
                        height: 72,
                        padding: 12,
                        background: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div style={{ color: "black", fontSize: 24, fontFamily: "DM Mono" }}>{currUser?.first_name ?? "Username"}</div>
                    <div style={{ width: 48, height: 48, background: "#6B6B6B" }} />
                </div>
            </div>

            <div
                style={{
                    height: 54,
                    paddingLeft: 36,
                    paddingRight: 36,
                    paddingTop: 10,
                    paddingBottom: 10,
                    background: "#1C2632",
                    display: "inline-flex",
                    alignItems: "center",
                }}
            >
                <div style={{ color: "#C9642A", fontSize: 40, fontFamily: "DM Sans", fontWeight: "600" }}>Housing Browser</div>
            </div>

            <div style={{ padding: 24, background: "#EDE9DE" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {cards.map((card) => (
                        <div key={card.id} style={{ background: "white", borderRadius: 12, overflow: "hidden" }}>
                            <Image
                                src="/assets/placeholders/housing-414x264.svg"
                                alt={`${card.name} placeholder image`}
                                width={414}
                                height={264}
                                style={{ width: "100%", height: "auto", display: "block" }}
                            />
                            <div style={{ background: "#1C2632", padding: "10px 14px", color: "#C9642A", fontSize: 22, fontFamily: "DM Sans", fontWeight: "600" }}>
                                {card.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
