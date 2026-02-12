import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const footerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(footerRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: footerRef.current, start: "top 95%" } }
        );
    }, { scope: footerRef, dependencies: [] }); // Adding dependencies array

    return (
        <footer ref={footerRef} className="bg-black/40 backdrop-blur-xl border-t border-white/5 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-emerald-100/40 font-light text-sm">

                <div className="flex flex-col gap-2">
                    <span className="text-white font-medium text-lg tracking-wider">Project 10X</span>
                    <span>© {new Date().getFullYear()} All rights reserved.</span>
                </div>

                <div className="flex gap-8">
                    <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
                </div>

                <div className="flex gap-6">
                    <a href="#" className="hover:text-emerald-400 transition-colors transform hover:scale-110 duration-200">
                        <Twitter size={20} />
                    </a>
                    <a href="#" className="hover:text-emerald-400 transition-colors transform hover:scale-110 duration-200">
                        <Github size={20} />
                    </a>
                    <a href="#" className="hover:text-emerald-400 transition-colors transform hover:scale-110 duration-200">
                        <Linkedin size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
