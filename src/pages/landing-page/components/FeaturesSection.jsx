import React from 'react';
import Icon from '../../../components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: "Receipt",
      title: "Bill Organization",
      description: "Keep all your monthly bills organized in one place. Never lose track of what\'s due and when.",
      color: "text-blue-600"
    },
    {
      id: 2,
      icon: "CheckCircle",
      title: "Payment Tracking",
      description: "Mark bills as paid or unpaid with a simple click. Visual indicators show your payment status at a glance.",
      color: "text-green-600"
    },
    {
      id: 3,
      icon: "CreditCard",
      title: "Payment Methods",
      description: "Track which payment method you used for each bill. Support for all major cards and accounts.",
      color: "text-purple-600"
    },
    {
      id: 4,
      icon: "Calendar",
      title: "Due Date Alerts",
      description: "Get visual alerts for upcoming and overdue bills. Never miss another payment deadline.",
      color: "text-orange-600"
    },
    {
      id: 5,
      icon: "BarChart3",
      title: "Financial Summary",
      description: "See your total expenses, income comparison, and remaining budget in comprehensive dashboards.",
      color: "text-indigo-600"
    },
    {
      id: 6,
      icon: "Repeat",
      title: "Recurring Bills",
      description: "Set up recurring bills with automatic tracking. Perfect for loans, utilities, and subscriptions.",
      color: "text-teal-600"
    }
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="text-primary block">Manage Your Bills</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Easy Bill Tracker provides all the tools you need to take control of your monthly expenses and never miss a payment again.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-md transition-shadow duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-6`}>
                <Icon name={feature.icon} size={24} className={feature.color} />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Get Organized?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of users who have taken control of their monthly bills with Easy Bill Tracker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-success mr-2" />
                  <span className="text-sm font-medium text-foreground">Bank-Level Security</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-center">
                  <Icon name="Smartphone" size={20} className="text-primary mr-2" />
                  <span className="text-sm font-medium text-foreground">Mobile Responsive</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-accent mr-2" />
                  <span className="text-sm font-medium text-foreground">Real-time Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;