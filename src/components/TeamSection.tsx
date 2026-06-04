function TeamMember({ name, role, img, isActive, quote }: {
    name: string;
    role: string;
    img?: string;
    isActive?: boolean;
    quote: string;
}) {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="flex flex-col group">

            {/* Perspective wrapper — no overflow:hidden here or the flip clips */}
            <div className="relative aspect-[3/4] [perspective:900px]">

                {/* Flip container */}
                <div className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ease-in-out group-hover:[transform:rotateY(180deg)]">

                    {/* ── FRONT FACE ── */}
                    <div className={`absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded bg-brand-light/5 border ${isActive ? 'border-brand-green' : 'border-white/10'}`}>
                        {img ? (
                            <img
                                src={img}
                                alt={name}
                                className={`w-full h-full object-cover team-member-img transition-opacity duration-500 ${isActive ? 'opacity-90' : 'opacity-80'}`}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 bg-black relative select-none">
                                <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0))] bg-[length:100%_4px] pointer-events-none opacity-40"></div>

                                <div className="flex justify-between font-mono text-[8px] sm:text-[9px] text-brand-green/40 tracking-wider relative z-10">
                                    <span>[ NODE_ACTIVE ]</span>
                                    <span>ID: {initials}</span>
                                </div>

                                <div className="flex flex-col items-center justify-center my-auto relative z-10">
                                    <div className="font-display text-5xl sm:text-6xl text-brand-green/80 tracking-tighter relative">
                                        {initials}
                                        <div className="absolute -inset-0.5 bg-brand-green/10 -z-10 blur-sm opacity-50"></div>
                                    </div>
                                    <div className="font-mono text-[7px] sm:text-[8px] text-brand-green/50 mt-2 uppercase tracking-widest bg-brand-green/5 px-2 py-0.5 border border-brand-green/20">
                                        Core Member
                                    </div>
                                </div>

                                <div className="font-mono text-[7px] sm:text-[8px] text-brand-green/45 uppercase space-y-0.5 relative z-10">
                                    <p className="truncate">&gt; SECURE_CONN_ESTABLISHED</p>
                                    <p className="flex justify-between text-[6px] sm:text-[7px] text-brand-green/30">
                                        <span>TYPE: Board</span>
                                        <span>LVL: Core</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {isActive && (
                            <div className="absolute inset-0 bg-brand-green/10 mix-blend-color"></div>
                        )}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.04)_50%,rgba(0,0,0,0.08)_50%,rgba(0,0,0,0))] bg-[length:100%_4px] pointer-events-none opacity-40 mix-blend-overlay"></div>

                        {isActive && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-green text-brand-dark rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-bold font-mono">
                                →
                            </div>
                        )}
                    </div>

                    {/* ── BACK FACE ── */}
                    <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden rounded border bg-brand-dark flex flex-col ${isActive ? 'border-brand-green' : 'border-white/20'}`}>
                        {/* Grid bg */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.12]"></div>
                        {/* CRT scanlines */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.015)_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0))] bg-[length:100%_4px] pointer-events-none opacity-50"></div>

                        <div className="relative z-10 flex flex-col h-full p-4 sm:p-5 justify-between">

                            {/* Role label */}
                            <span className={`font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.18em] ${isActive ? 'text-brand-green' : 'text-white/35'}`}>
                                [ {role} ]
                            </span>

                            {/* Quote */}
                            <div className="flex-1 flex flex-col justify-center py-3">
                                <div className={`font-display text-4xl sm:text-5xl leading-none mb-2 ${isActive ? 'text-brand-green' : 'text-white/15'}`}>"</div>
                                <p className="font-mono text-[9px] sm:text-[10px] leading-relaxed text-white/75 uppercase">
                                    {quote}
                                </p>
                            </div>

                            {/* First name */}
                            <div className={`border-t pt-3 ${isActive ? 'border-brand-green/30' : 'border-white/10'}`}>
                                <p className={`font-display text-sm sm:text-base uppercase tracking-wide leading-none ${isActive ? 'text-brand-green' : 'text-white/50'}`}>
                                    {name.split(' ')[0]}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Name & role below card */}
            <div className="flex gap-2 items-center mt-3">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-brand-green' : 'bg-white/40'}`}></div>
                <h4 className="font-display tracking-wide uppercase text-base sm:text-lg leading-none truncate">{name}</h4>
            </div>
            <p className="font-mono text-[10px] sm:text-xs text-white/50 pl-3.5 uppercase">{role}</p>
        </div>
    );
}

export default function TeamSection() {
    const teamMembers = [
        {
            name: "Syed Mashood Hussain",
            role: "President",
            img: "/team/mashood.png",
            isActive: true,
            quote: "Committed to creating opportunities that empower future innovators.",
        },
        {
            name: "Zunnoorain Ali",
            role: "Vice-President",
            img: "/team/zunoorain.png",
            quote: "Dedicated to turning ideas into impactful tech initiatives.",
        },
        {
            name: "Faris Siddique",
            role: "Event Manager",
            img: "/team/faris.png",
            quote: "Focused on delivering engaging and inspiring tech experiences.",
        },
        {
            name: "Hazib Sheikh",
            role: "Technical Lead",
            quote: "Passionate about fostering technical growth and innovation.",
        },
        {
            name: "Muhammad Ousman",
            role: "Director Outreach",
            quote: "Building connections that open doors for future technologists.",
        },
        {
            name: "Tasbeeh",
            role: "Director Marketing",
            img: "/team/tasbih.jpeg",
            quote: "Showcasing innovation and inspiring participation through creativity.",
        },
        {
            name: "Areeba Dosani",
            role: "Director Media",
            img: "/team/areeba.png",
            quote: "Capturing and sharing the stories behind innovation.",
        },
        {
            name: "Neha Zari",
            role: "Treasurer",
            img: "/team/neha.png",
            quote: "Ensuring resources are managed to maximize opportunities for growth.",
        },
    ];

    return (
        <section className="py-14 md:py-24 px-6 md:px-12 bg-brand-dark">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 md:mb-16 border-b border-white/20 pb-6 md:pb-8">
                    <p className="font-mono text-xs text-brand-green mb-3 md:mb-0">[ 04 ]</p>
                    <h2 className="font-display text-[14vw] sm:text-7xl md:text-[8vw] text-brand-green uppercase tracking-normal leading-[0.8]">
                        Society Board
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:gap-x-8 md:gap-y-16">
                    {teamMembers.map((member, i) => (
                        <TeamMember
                            key={i}
                            name={member.name}
                            role={member.role}
                            img={member.img}
                            isActive={member.isActive}
                            quote={member.quote}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
