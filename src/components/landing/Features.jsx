import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Brain, Users, Sparkles, ArrowRight, MessageSquare, Target } from 'lucide-react';
import { Button } from "../ui/button";

const features = [
    {
        icon: MessageSquare,
        title: "Conversation First",
        description: "Forget forms. Chat naturally with our AI to build your profile or find your perfect candidate.",
    },
    {
        icon: Brain,
        title: "AI-Powered Matching",
        description: "Our proprietary algorithms understand nuance, ensuring skills and culture fit align perfectly.",
    },
    {
        icon: Target,
        title: "Precision Hiring",
        description: "Cut through the noise. Get matched only with candidates or roles that truly meet your criteria.",
    },
    {
        icon: Users,
        title: "Human-Centric Design",
        description: "Technology that serves people, not the other way around. Intuitive, empathetic, and efficient.",
    },
];

const FeatureCard = ({ icon: Icon, title, description, index }) => {
    return (
        <div className="feature-card group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex flex-col items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    <Icon size={24} />
                </div>

                <h3 className="text-xl font-light text-white tracking-wide">
                    {title}
                </h3>

                <p className="text-emerald-100/60 font-light leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

const Features = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);

    useGSAP(() => {
        const cards = containerRef.current.querySelectorAll('.feature-card');

        gsap.fromTo(titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: titleRef.current, start: "top 80%" } }
        );

        gsap.fromTo(cards,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
            <div className="text-center mb-20 max-w-3xl mx-auto" ref={titleRef}>
                <h2 className="text-3xl md:text-5xl font-extralight text-white mb-6">
                    Reimagining <span className="text-emerald-400 font-normal">Talent Acquisition</span>
                </h2>
                <p className="text-lg text-emerald-100/60 font-light">
                    We strip away the complexity of traditional hiring. No more endless forms or keyword stuffing.
                    Just meaningful connections driven by heavy-lifting AI.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, idx) => (
                    <FeatureCard key={idx} {...feature} index={idx} />
                ))}
            </div>

            <div className="mt-20 flex justify-center">
                <Button className="bg-transparent border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200 px-8 py-6 rounded-full text-lg font-light tracking-wider transition-all">
                    Explore The Platform <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </section>
    );
};

export default Features;
