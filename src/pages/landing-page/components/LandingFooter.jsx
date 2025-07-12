import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LandingFooter = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: "How It Works", action: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: "Pricing", action: () => {} },
        { label: "Security", action: () => {} }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", action: () => {} },
        { label: "Contact", action: () => {} },
        { label: "Blog", action: () => {} },
        { label: "Careers", action: () => {} }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", action: () => {} },
        { label: "Documentation", action: () => {} },
        { label: "Community", action: () => {} },
        { label: "Status", action: () => {} }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", action: () => {} },
        { label: "Terms of Service", action: () => {} },
        { label: "Cookie Policy", action: () => {} },
        { label: "GDPR", action: () => {} }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", url: "#" },
    { name: "Facebook", icon: "Facebook", url: "#" },
    { name: "LinkedIn", icon: "Linkedin", url: "#" },
    { name: "Instagram", icon: "Instagram", url: "#" }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Icon name="Receipt" size={20} color="white" />
                </div>
                <span className="text-xl font-bold">Easy Bill Tracker</span>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-md">
                Take control of your monthly bills with our comprehensive tracking and management platform. Never miss a payment again.
              </p>

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <Icon name="Shield" size={16} className="mr-2 text-green-400" />
                  <span>Bank-level security & encryption</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Icon name="Lock" size={16} className="mr-2 text-blue-400" />
                  <span>GDPR compliant & privacy protected</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Icon name="Users" size={16} className="mr-2 text-purple-400" />
                  <span>Trusted by 5,000+ users worldwide</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={link.action}
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300 text-sm">
                Get the latest tips on bill management and financial organization.
              </p>
            </div>
            
            <div className="flex w-full lg:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-r-lg transition-colors duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Easy Bill Tracker. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <Icon name={social.icon} size={20} />
                </a>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/login-screen')}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavigation('/registration-screen')}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;