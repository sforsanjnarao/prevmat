"use client";
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'; // For animated text
import { motion } from 'framer-motion'; // Added for animations


const HeroSection = () => {
  return (
    <section className="w-full pt-32 md:pt-44 lg:pt-52 pb-10 relative">

      <div className="space-y-8 px-8 text-center relative z-10">
        <div className="space-y-6 mx-auto">
          {/* Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-space-grotesk font-extrabold headfont md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 via-sky-400 to-blue-600 "
          >
            <TypeAnimation
              sequence={[
                'Feeling Exposed Online?',
                1500,
                'Regain Control with Privmat',
                1500,
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
            />
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mx-auto max-w-[600px] text-lg md:text-xl text-gray-400"
          >
            Privmat empowers you to track your data footprint, generate fake information for privacy, and monitor for data breaches. Reclaim your digital privacy today.
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex justify-center space-x-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="/privacy-policy">
            <Button variant="outline" size="lg" className="px-8 border-gray-500 text-gray-300">
              How it Works
            </Button>
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="hero-image-wrapper mt-10 md:mt-4 flex items-center justify-center"
        >
          <div className="hero-image">
            <Image
              src="/hero5.png"
              alt="Dashboard Preview"
              width={500}
              height={500}
              // className="rounded-lg shadow-[0_0_60px_#6366f1]"
              priority
            />
          </div>
        </motion.div>
        {/* </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
