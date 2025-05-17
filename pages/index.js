import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Dynamically import components to prevent SSR issues with browser-only APIs
const AGIPercentage = dynamic(() => import('../src/components-js/AGIPercentage'), { ssr: false });
const Methodology = dynamic(() => import('../src/components-js/Methodology'), { ssr: false });
const DashboardVisualizations = dynamic(() => import('../src/components-js/DashboardVisualizations'), { ssr: false });
const EnhancedNewsAggregator = dynamic(() => import('../src/components-js/EnhancedNewsAggregator'), { ssr: false });
const ExpertOpinions = dynamic(() => import('../src/components-js/ExpertOpinions'), { ssr: false });
const SocialSharing = dynamic(() => import('../src/components-js/SocialSharing'), { ssr: false });
const MethodologyExplanation = dynamic(() => import('../src/components-js/MethodologyExplanation'), { ssr: false });
const UserAuth = dynamic(() => import('../src/components-js/UserAuth'), { ssr: false });
const AdminDashboard = dynamic(() => import('../src/components-js/AdminDashboard'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [activeModel, setActiveModel] = useState('conservative');
  const [customPercentage, setCustomPercentage] = useState(null);
  const [sharedEstimate, setSharedEstimate] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // These would normally come from your backend or API
  const percentageModels = {
    conservative: 37.8,
    optimistic: 62.4,
    capabilities: 45.2,
    academic: 29.6
  };

  // Check for shared estimate in URL
  useEffect(() => {
    if (router.isReady) {
      const { estimate, section } = router.query;
      
      if (estimate && !isNaN(parseFloat(estimate))) {
        setCustomPercentage(parseFloat(estimate));
        setSharedEstimate(true);
      }
      
      if (section && ['methodology', 'dashboard', 'news', 'account', 'admin'].includes(section)) {
        setActiveSection(section);
      }
    }
  }, [router.isReady, router.query]);

  // Get the current active percentage based on model or custom
  const currentPercentage = customPercentage !== null 
    ? parseFloat(customPercentage) 
    : percentageModels[activeModel];

  // Handler for when a custom percentage is set via the sliders
  const handleCustomPercentage = (value) => {
    setCustomPercentage(value);
    setSharedEstimate(false);
  };

  // Reset to model-based percentages
  const resetCustomPercentage = () => {
    setCustomPercentage(null);
    setSharedEstimate(false);
    
    // Remove estimate from URL if present
    if (router.query.estimate) {
      const newQuery = { ...router.query };
      delete newQuery.estimate;
      router.replace({
        pathname: router.pathname,
        query: Object.keys(newQuery).length ? newQuery : undefined
      }, undefined, { shallow: true });
    }
  };

  // Navigate to a section and update URL
  const navigateToSection = (section) => {
    setActiveSection(section);
    
    // Update URL to reflect current section
    const newQuery = { ...router.query, section };
    router.replace({
      pathname: router.pathname,
      query: newQuery
    }, undefined, { shallow: true });
  };

  return (
    <div>
      <Head>
        <title>Percent to AGI - Tracking Progress to Artificial General Intelligence</title>
        <meta name="description" content="A humorous yet scientifically-backed tracker of humanity's progress toward Artificial General Intelligence" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <header className="bg-dark text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <h1 className="text-4xl font-bold cursor-pointer" onClick={() => navigateToSection('home')}>Percent to AGI</h1>
                <p className="text-xl mt-2">Tracking humanity's progress toward Artificial General Intelligence</p>
              </div>
              
              <nav>
                <ul className="flex flex-wrap space-x-1 md:space-x-4">
                  <li>
                    <button 
                      className={`px-3 py-2 rounded-md ${activeSection === 'methodology' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                      onClick={() => navigateToSection('methodology')}
                    >
                      Methodology
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`px-3 py-2 rounded-md ${activeSection === 'dashboard' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                      onClick={() => navigateToSection('dashboard')}
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`px-3 py-2 rounded-md ${activeSection === 'news' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                      onClick={() => navigateToSection('news')}
                    >
                      News
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`px-3 py-2 rounded-md ${activeSection === 'account' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                      onClick={() => navigateToSection('account')}
                    >
                      Account
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 py-12">
          {activeSection === 'home' && (
            <>
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">Current Progress to AGI</h2>
                <div className="flex justify-center mb-8">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    {Object.keys(percentageModels).map((model) => (
                      <button
                        key={model}
                        type="button"
                        onClick={() => {
                          setActiveModel(model);
                          resetCustomPercentage();
                        }}
                        className={`px-4 py-2 text-sm font-medium ${
                          activeModel === model && customPercentage === null
                            ? 'bg-primary text-white'
                            : 'bg-white text-dark hover:bg-gray-100'
                        } ${model === Object.keys(percentageModels)[0] ? 'rounded-l-lg' : ''} ${
                          model === Object.keys(percentageModels)[Object.keys(percentageModels).length - 1]
                            ? 'rounded-r-lg'
                            : ''
                        } border border-gray-200`}
                      >
                        {model.charAt(0).toUpperCase() + model.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <AGIPercentage percentage={currentPercentage} />
                
                {customPercentage !== null && (
                  <div className="text-center mt-4">
                    <span className="text-sm font-medium bg-secondary text-white px-3 py-1 rounded-full">
                      {sharedEstimate ? 'Shared Estimate' : 'Custom Estimate'}
                    </span>
                    <button 
                      onClick={resetCustomPercentage}
                      className="ml-3 text-sm text-gray-600 hover:text-primary"
                    >
                      Reset to Model
                    </button>
                  </div>
                )}
                
                {sharedEstimate && (
                  <div className="text-center mt-2">
                    <p className="text-sm text-gray-600">
                      This is a shared estimate from another user. 
                      <button 
                        className="ml-1 text-primary underline"
                        onClick={() => {
                          const methodologySection = document.getElementById('methodology-section');
                          if (methodologySection) {
                            methodologySection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Create your own estimate
                      </button>
                    </p>
                  </div>
                )}
              </div>
              
              <div id="methodology-section">
                <Methodology onPercentageChange={handleCustomPercentage} />
              </div>
            </>
          )}
          
          {activeSection === 'methodology' && <MethodologyExplanation />}
          {activeSection === 'dashboard' && <DashboardVisualizations />}
          {activeSection === 'news' && <EnhancedNewsAggregator />}
          {activeSection === 'account' && <UserAuth />}
          {activeSection === 'admin' && <AdminDashboard />}
          
          {activeSection === 'home' && (
            <>
              <ExpertOpinions />
              <SocialSharing percentage={currentPercentage} />
            </>
          )}
        </section>

        <footer className="bg-dark text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Percent to AGI. Created with a blend of humor and scientific rigor.</p>
            <p className="text-sm mt-2">Disclaimer: AGI percentages are estimations based on current research and may not reflect actual AGI development progress. Or maybe they do. Who knows?</p>
          </div>
        </footer>
      </main>
    </div>
  );
} 