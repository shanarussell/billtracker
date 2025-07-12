import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: `Easy Bill Tracker has completely transformed how I track my finances. I can see both my bills and income in one place, and the recurring bill feature saves me so much time.`,
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: `The recurring bill feature is a game-changer. I set up my car loan and utilities once, and the app tracks everything automatically. It's saved me hours of manual tracking.`,
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: `The financial summary dashboard gives me a clear picture of my monthly expenses versus income. It's helped me identify areas where I can save money and budget better.`,
      rating: 5
    }
  ];

  const stats = [
    { label: "Active Users", value: "5,000+", icon: "Users" },
    { label: "Bills Tracked", value: "50,000+", icon: "Receipt" },
    { label: "Money Saved", value: "$2M+", icon: "DollarSign" },
    { label: "Satisfaction Rate", value: "98%", icon: "Heart" }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Loved by Thousands of
            <span className="text-primary block">Happy Users</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            See what users are saying about how Easy Bill Tracker has helped them track their finances better.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Icon name={stat.icon} size={24} className="text-primary" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-border"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-16 border-t border-border">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Your Financial Data is Safe & Secure
            </h3>
            <p className="text-muted-foreground">
              We use bank-level encryption and security measures to protect your information.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center bg-card rounded-lg px-6 py-4 shadow-sm border border-border">
              <Icon name="Shield" size={24} className="text-success mr-3" />
              <div>
                <div className="font-semibold text-foreground text-sm">SSL Encrypted</div>
                <div className="text-xs text-muted-foreground">256-bit Security</div>
              </div>
            </div>

            <div className="flex items-center bg-card rounded-lg px-6 py-4 shadow-sm border border-border">
              <Icon name="Lock" size={24} className="text-primary mr-3" />
              <div>
                <div className="font-semibold text-foreground text-sm">Privacy Protected</div>
                <div className="text-xs text-muted-foreground">GDPR Compliant</div>
              </div>
            </div>

            <div className="flex items-center bg-card rounded-lg px-6 py-4 shadow-sm border border-border">
              <Icon name="Database" size={24} className="text-accent mr-3" />
              <div>
                <div className="font-semibold text-foreground text-sm">Secure Storage</div>
                <div className="text-xs text-muted-foreground">Encrypted Database</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;