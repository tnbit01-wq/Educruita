import React, { useEffect } from 'react';
import SyntheticHero from '../components/ui/synthetic-hero';
import Footer from '../components/landing/Footer'; // Assuming Footer exists
import { useNavigate } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import {
    AcademicCapIcon,
    BriefcaseIcon,
    UserGroupIcon,
    ChartBarIcon,
    RocketLaunchIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

gsap.registerPlugin(ScrollTrigger);

// Custom Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <div
        className="feature-card p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
        style={{ opacity: 0, transform: 'translateY(20px)' }}
    >
        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
            <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Feature cards animation
        gsap.to('.feature-card', {
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Section headers animation
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.fromTo(header,
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 85%',
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }
            );
        });
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden selection:bg-emerald-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                            T
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                            TalentFlow
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
                        <a href="#campus" className="text-zinc-400 hover:text-white transition-colors">Campus</a>
                        <a href="#roles" className="text-zinc-400 hover:text-white transition-colors">For You</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/auth/login" className="text-white font-medium hover:text-emerald-400 transition-colors">
                            Sign In
                        </a>
                        <a href="/auth/register" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            Get Started
                        </a>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {/* Hero Section */}
                <SyntheticHero
                    title="TalentFlow"
                    description="The intelligent ecosystem connecting talent, education, and opportunity. Bridge the gap between campus and corporate with AI-driven insights."
                    badgeText="Platform 2.0"
                    badgeLabel="New Features"
                    ctaButtons={[
                        { text: "Explore Platform", primary: true, href: "/auth/login" },
                        { text: "View Demo", href: "/demo" }
                    ]}
                    microDetails={[
                        "Campus Connect Integration",
                        "Smart Recruitment ATS",
                        "AI-Powered Analytics",
                        "Seamless Collaboration"
                    ]}
                />

                {/* Core Features Grid */}
                <section id="features" className="py-24 bg-zinc-900/30 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent opacity-30"></div>
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="section-header text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Everything you need to <span className="text-emerald-400">succeed</span>
                            </h2>
                            <p className="text-lg text-zinc-400">
                                Whether you're hiring, job hunting, teaching, or learning, TalentFlow provides the tools to manage your entire journey.
                            </p>
                        </div>

                        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FeatureCard
                                icon={BriefcaseIcon}
                                title="Smart Recruitment"
                                description="Advanced ATS for employers to track, filter, and manage applicants with AI-powered match scores and automated workflows."
                            />
                            <FeatureCard
                                icon={AcademicCapIcon}
                                title="Campus Connect"
                                description="A dedicated ecosystem for colleges. Manage student achievements, faculty announcements, polls, and academic progress."
                            />
                            <FeatureCard
                                icon={UserGroupIcon}
                                title="Collaborative Groups"
                                description="Join interest-based communities, share resources, and collaborate on projects with integrated group chats and file sharing."
                            />
                            <FeatureCard
                                icon={RocketLaunchIcon}
                                title="Career Acceleration"
                                description="For candidates: AI resume builder, skill gap analysis, and personalized job recommendations to fast-track your career."
                            />
                            <FeatureCard
                                icon={ChartBarIcon}
                                title="Real-time Analytics"
                                description="Deep insights into placement trends, class performance, and hiring metrics for actionable decision-making."
                            />
                            <FeatureCard
                                icon={ShieldCheckIcon}
                                title="Secure & Verified"
                                description="Role-based access control with verified company profiles and secure background verification document management."
                            />
                        </div>
                    </div>
                </section>

                {/* Role-Based Benefits Section */}
                <section id="roles" className="py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="section-header mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Tailored for <span className="text-emerald-400">every role</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* For Corporate */}
                            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 md:p-12">
                                <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 inline-block">
                                    Corporate
                                </span>
                                <h3 className="text-3xl font-bold mb-4">Employers & Recruiters</h3>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3 text-zinc-400">
                                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">✓</div>
                                        <span>Post jobs and manage end-to-end recruitment</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-zinc-400">
                                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">✓</div>
                                        <span>Real-time communication with candidates</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-zinc-400">
                                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">✓</div>
                                        <span>Company branding and analytics dashboard</span>
                                    </li>
                                </ul>
                                <a href="/auth/login" className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors">
                                    Login as Employer →
                                </a>
                            </div>

                            {/* For Education */}
                            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 md:p-12">
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6 inline-block">
                                    Education
                                </span>
                                <h3 className="text-3xl font-bold mb-4">Students & Faculty</h3>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3 text-zinc-400">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">✓</div>
                                        <span>Academic dashboards with attendance and CGPA</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-zinc-400">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">✓</div>
                                        <span>Leave management and feedback systems</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-zinc-400">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">✓</div>
                                        <span>Campus announcements and interactive polls</span>
                                    </li>
                                </ul>
                                <a href="/auth/login" className="inline-flex items-center text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                                    Access Campus Portal →
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 border-y border-white/5 bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">500+</div>
                                <div className="text-zinc-500 text-sm uppercase tracking-wider">Companies</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">10k+</div>
                                <div className="text-zinc-500 text-sm uppercase tracking-wider">Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">95%</div>
                                <div className="text-zinc-500 text-sm uppercase tracking-wider">Success Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                                <div className="text-zinc-500 text-sm uppercase tracking-wider">Support</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-600/10"></div>
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to transform your future?</h2>
                        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                            Join thousands of students, professionals, and recruiters on the most advanced talent ecosystem today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="/auth/register"
                                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25"
                            >
                                Get Started Free
                            </a>
                            <a
                                href="/demo"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-lg border border-white/10 transition-all"
                            >
                                View Live Demo
                            </a>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
};

export default LandingPage;
