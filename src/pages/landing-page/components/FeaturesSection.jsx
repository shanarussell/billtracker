import React from 'react';
import Icon from '../../../components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: "Receipt",
      title: "Bill Management",
      description: "Add, edit, and organize all your monthly bills with categories. Track due dates and payment status.",
      color: "text-blue-600"
    },
    {
      id: 2,
      icon: "DollarSign",
      title: "Income Tracking",
      description: "Record deposits and income sources. See your total income alongside your bills for better financial planning.",
      color: "text-green-600"
    },
    {
      id: 3,
      icon: "Repeat",
      title: "Recurring Bills",
      description: "Set up weekly, monthly, quarterly, or annual recurring bills. Automatic generation of future payments.",
      color: "text-purple-600"
    },
    {
      id: 4,
      icon: "CheckCircle",
      title: "Payment Tracking",
      description: "Mark bills as paid or unpaid with payment method tracking. Visual status indicators for easy monitoring.",
      color: "text-orange-600"
    },
    {
      id: 5,
      icon: "BarChart3",
      title: "Financial Metrics",
      description: "View total deposits, bills due, paid amounts, and remaining balance in comprehensive monthly summaries.",
      color: "text-indigo-600"
    },
    {
      id: 6,
      icon: "AlertTriangle",
      title: "Smart Alerts",
      description: "Get notifications for overdue bills and upcoming payments. Never miss a payment deadline again.",
      color: "text-teal-600"
    }
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Complete Financial
            <span className="text-primary block">Tracking Solution</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Easy Bill Tracker combines bill management and income tracking in one simple platform. Track your money flow and never miss a payment.
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
              Ready to Track Your Finances?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join users who have simplified their financial tracking with Easy Bill Tracker.
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