import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Outlet } from 'react-router-dom';

// Simple Grid Background for internal pages
const GridBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-20%,rgba(16,185,129,0.15),transparent)]" />
    </div>
);

const AuthLayout = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
        );
    }, { scope: containerRef });

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-light">
            <GridBackground />

            <div ref={containerRef} className="relative z-10 w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-light text-white tracking-wide">Project 10X</h1>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
