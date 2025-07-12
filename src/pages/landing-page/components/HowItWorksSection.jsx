import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      title: "Add Your Bills & Income",
      description: "Create your account and start adding your monthly bills and income sources. Categorize bills and track payment methods.",
      icon: "UserPlus",
      image: "/assets/images/bill-tracker-screenshots-5.png"
    },
    {
      id: 2,
      title: "Set Up Recurring Bills",
      description: "Configure recurring bills with weekly, monthly, quarterly, or annual frequencies. Our system automatically generates future payments.",
      icon: "Repeat",
      image: "/assets/images/bill-tracker-screenshots-1.png"
    },
    {
      id: 3,
      title: "Track & Monitor",
      description: "Mark payments as complete, track your income vs expenses, and get alerts for overdue bills. View comprehensive financial metrics.",
      icon: "BarChart3",
      image: "/assets/images/bill-tracker-screenshots-2.png"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            How Easy Bill Tracker
            <span className="text-primary block">Works for You</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started in minutes and take control of your finances with our simple three-step process.
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
                        <span className="text-sm text-muted-foreground">Add bills with categories</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Track income sources</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Set payment methods</span>
                      </div>
                    </>
                  )}
                  
                  {step.id === 2 && (
                    <>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Weekly, monthly, quarterly, annual</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Automatic future bill generation</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Edit or delete individual instances</span>
                      </div>
                    </>
                  )}
                  
                  {step.id === 3 && (
                    <>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Mark payments as paid/unpaid</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">View income vs expenses</span>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start">
                        <Icon name="Check" size={16} className="text-success mr-2" />
                        <span className="text-sm text-muted-foreground">Get overdue bill alerts</span>
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


      </div>
    </section>
  );
};

export default HowItWorksSection;