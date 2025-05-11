"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginModal from '@/components/LoginModal';
import SignUpModal from '@/components/SignUpModel';

const GlobalModalRenderer = () => {
  const searchParams = useSearchParams();
  const [modalParam, setModalParam] = useState('');

  useEffect(() => {
    const modalValue = searchParams.get('modal');
    setModalParam(modalValue ?? '');

  }, [searchParams]);

  const renderModal = () => {

    if (modalParam === 'login') {
      return <LoginModal />;
    }

    if (modalParam === 'signup') {
      return <SignUpModal />;
    }

    return null;
  };

  return renderModal();
};

export default GlobalModalRenderer;
