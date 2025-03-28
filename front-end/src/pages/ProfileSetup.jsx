import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import StepOne from '../components/ProfileSteps/StepOne';
import StepTwo from '../components/ProfileSteps/StepTwo';
import StepThree from '../components/ProfileSteps/StepThree';
import StepReview from '../components/ProfileSteps/StepReview';
import FormProgress from '../components/FormProgress';
// import Header from '../components/Header';
import Header from '../components/Header/index';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    setCurrentStep, 
    saveProfile, 
    loading,
    isProfileComplete,
    error 
  } = useProfile();

  // Redirect if profile is already complete
  useEffect(() => {
    if (isProfileComplete) {
      navigate('/dashboard');
    }
  }, [isProfileComplete, navigate]);

  // Render appropriate step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepReview />;
      default:
        return <StepOne />;
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      // For steps 1-3, just save progress and move to next step
      await saveProfile(false);
      setCurrentStep(currentStep + 1);
    } else {
      // For final step (review), mark profile as complete and redirect
      const result = await saveProfile(true);
      if (result.success) {
        navigate('/profile-complete');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="d-flex">
        <FormProgress currentStep={currentStep} />
        <div className="flex-grow-1 p-4">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Profile Setup</h3>
            </div>
            <div className="card-body">
              {renderStep()}
              
              <div className="d-flex justify-content-between mt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary ms-auto"
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading 
                    ? 'Processing...' 
                    : currentStep < 4 
                      ? 'Next' 
                      : 'Complete Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;