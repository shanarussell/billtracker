import React from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FormHeader from './components/FormHeader';
import FormTips from './components/FormTips';
import BillForm from './components/BillForm';

const AddEditBill = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Breadcrumb />
        
        <FormHeader />
        
        <FormTips />
        
        <BillForm />
      </main>
    </div>
  );
};

export default AddEditBill;