import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      title: "Sign Up & Set Up",
      description: "Create your free account and add your monthly bills in just a few clicks. Import from your bank or add manually.",
      icon: "UserPlus",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Organize & Track",
      description: "Set up recurring bills, due dates, and payment methods. Our system automatically tracks everything for you.",
      icon: "Calendar",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Stay on Top",
      description: "Get visual alerts for upcoming bills, mark payments as complete, and see your financial summary at a glance.",
      icon: "CheckCircle",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            How BillTracker Pro
            <span className="text-primary block">Works for You</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started in minutes and take control of your monthly bills with our simple three-step process.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12 lg:gap-16`}
            >
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mr-4">
                    <Icon name={step.icon} size={32} className="text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    {step.id.toString().padStart(2, '0')}
                  </div>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  {step.title}
                </h3>

                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  {step.description}
                </p>

                {/* Step Features */}
                <div className="space-y-3">
                  {step.id === 1 && (
                    <>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Quick 2-minute setup</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Import from bank or add manually</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Secure account protection</span>
                      </div>
                    </>
                  )}
                  
                  {step.id === 2 && (
                    <>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Set up recurring bills automatically</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Track multiple payment methods</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Organize by categories</span>
                      </div>
                    </>
                  )}
                  
                  {step.id === 3 && (
                    <>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Visual payment status indicators</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Comprehensive financial dashboard</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Income vs expenses tracking</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="flex-1">
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                      <Image
                        src={step.image}
                        alt={`Step ${step.id}: ${step.title}`}
                        className="w-full h-64 lg:h-80 object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 lg:mt-24">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of users who have simplified their bill management with BillTracker Pro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="Clock" size={16} className="mr-2 text-primary" />
                <span>Setup takes less than 5 minutes</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="CreditCard" size={16} className="mr-2 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="mr-2 text-accent" />
                <span>100% secure & private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;