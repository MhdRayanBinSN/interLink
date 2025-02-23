import React from 'react';
import { motion, useScroll, useTransform, useAnimation, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaCalendarPlus, FaChartLine, FaUsers, FaMoneyBillWave, 
  FaArrowRight, FaAward, FaRocket, FaHandshake 
} from 'react-icons/fa';
import { useEffect, useRef } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.3 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const AnimatedLetter = ({ letter, index }: { letter: string; index: number }) => (
  <motion.span
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: index * 0.1,
      type: "spring",
      stiffness: 120
    }}
    className="inline-block hover:text-[#7557e1] hover:scale-110 transition-all cursor-default"
  >
    {letter}
  </motion.span>
);

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[#7557e1] origin-left z-50"
      style={{ scaleX }}
    />
  );
};

const useParallax = (value: any, distance: number) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};

const TitleSection = () => {
  const letters = "interLink".split('');
  const controls = useAnimation();
  const titleRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useParallax(scrollYProgress, 100);

  useEffect(() => {
    const handleScroll = () => {
      if (titleRef.current) {
        const { top } = titleRef.current.getBoundingClientRect();
        const isVisible = top < window.innerHeight;
        if (isVisible) {
          controls.start({ opacity: 1, scale: 1 });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 50
      }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <h1 className="text-7xl md:text-8xl font-extrabold mb-4">
        {letters.map((letter, index) => (
          <AnimatedLetter key={index} letter={letter} index={index} />
        ))}
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Where Tech Events Come Alive
        </h2>
        <div className="absolute -inset-1 blur-xl bg-[#7557e1]/20 -z-10" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
      >
        Create, manage, and grow your tech events with our powerful platform.
        From workshops to conferences, we've got you covered.
      </motion.p>
    </motion.div>
  );
};

const IOrganizerHome: React.FunctionComponent = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen bg-[#1d2132]">
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-[#1d2132]/90"
            style={{ opacity }}
          />
          <motion.div
            className="absolute inset-0 -z-10"
            style={{ scale }}
          >
            <div className="absolute inset-0 bg-[#222839] opacity-50" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </motion.div>

          <div className="container mx-auto px-4 relative z-10">
            <TitleSection />
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto text-center mt-16" // Added mt-16 for margin-top
            >
              <motion.div 
                variants={item}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  to="/organizer/login"
                  className="px-8 py-4 bg-[#7557e1] text-white rounded-lg font-semibold hover:bg-[#6345d0] transition-all flex items-center justify-center gap-2 group"
                >
                  Sign In as Organizer
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/organizer/register"
                  className="px-8 py-4 bg-transparent border-2 border-[#d7ff42] text-[#d7ff42] rounded-lg font-semibold hover:bg-[#d7ff42] hover:text-[#1d2132] transition-all"
                >
                  Create Account
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="py-20 bg-[#1d2132]"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-[#222839] rounded-xl border border-[#7557e1] shadow-[0_0_15px_rgba(117,87,225,0.1)]"
                >
                  <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="py-20 bg-[#222839]"
        >
          <motion.div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-white">
              Why Choose Our Platform?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.concat(additionalFeatures).map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: `0 0 30px ${feature.glowColor}` 
                  }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="p-8 bg-[#1d2132] rounded-xl border border-gray-700/50 group cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <feature.icon className={`text-5xl ${feature.iconColor} mb-6 transform transition-transform group-hover:scale-110`} />
                    <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <section className="py-20 bg-[#222839]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-white">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#7557e1] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(117,87,225,0.3)]">
                      <span className="text-2xl font-bold text-white">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-[#7557e1]/20" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#1d2132] relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto px-4 text-center relative z-10"
          >
            <div className="max-w-3xl mx-auto p-8 bg-[#222839] rounded-2xl border border-[#7557e1] shadow-[0_0_50px_rgba(117,87,225,0.2)]">
              <h2 className="text-4xl font-bold mb-8 text-white">Ready to Host Your Event?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join our growing community of event organizers and start creating impactful tech events today.
              </p>
              <Link
                to="/organizer/create-event"
                className="inline-flex items-center px-8 py-4 bg-[#7557e1] text-white rounded-lg font-semibold transition-all group hover:shadow-[0_0_30px_rgba(117,87,225,0.5)]"
              >
                Create Your First Event
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </section>

        <motion.div
          className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          {['hero', 'stats', 'features', 'steps'].map((section, index) => (
            <motion.div
              key={section}
              className="w-2 h-2 rounded-full bg-[#7557e1] cursor-pointer"
              whileHover={{ scale: 1.5 }}
              animate={{
                opacity: scrollYProgress.get() > index * 0.25 ? 1 : 0.5
              }}
              onClick={() => {
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

const features = [
  {
    icon: FaCalendarPlus,
    title: "Easy Event Creation",
    description: "Intuitive tools to create and manage your tech events efficiently.",
    iconColor: "text-[#7557e1]",
    glowColor: "rgba(117,87,225,0.2)"
  },
  {
    icon: FaUsers,
    title: "Wide Reach",
    description: "Connect with thousands of potential attendees in the tech community.",
    iconColor: "text-[#7557e1]",
    glowColor: "rgba(117,87,225,0.2)"
  },
  {
    icon: FaMoneyBillWave,
    title: "Secure Payments",
    description: "Hassle-free payment processing for paid events and workshops.",
    iconColor: "text-[#7557e1]",
    glowColor: "rgba(117,87,225,0.2)"
  },
  {
    icon: FaChartLine,
    title: "Analytics & Insights",
    description: "Track registrations, attendance, and engagement metrics.",
    iconColor: "text-[#7557e1]",
    glowColor: "rgba(117,87,225,0.2)"
  }
];

const additionalFeatures = [
  {
    icon: FaRocket,
    title: "Quick Setup",
    description: "Launch your event page in minutes with our streamlined process",
    iconColor: "text-[#7557e1]",
    glowColor: "rgba(117,87,225,0.2)"
  },
  {
    icon: FaHandshake,
    title: "Community Support",
    description: "Connect with other organizers and share best practices",
    iconColor: "text-[#7557e1]",
    glowColor: "rgba(117,87,225,0.2)"
  }
];

const stats = [
  { value: "500+", label: "Events Hosted" },
  { value: "50K+", label: "Active Users" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "₹10M+", label: "Revenue Generated" }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Tech Conference Organizer",
    image: "/path-to-image1.jpg",
    quote: "InterLink made organizing our annual tech conference a breeze. The platform's features and support are unmatched."
  },
  // Add more testimonials...
];

const steps = [
  {
    title: "Create Account",
    description: "Sign up as an organizer and complete your profile"
  },
  {
    title: "List Your Event",
    description: "Add event details, schedule, and pricing"
  },
  {
    title: "Go Live",
    description: "Publish and start accepting registrations"
  }
];

export default IOrganizerHome;
