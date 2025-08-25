import React from 'react';
// Replace with your actual auth context hook
import { useAuth } from '../utils/auth';

const Header = () => {
  const { user, logout, isLoggedIn } = useAuth();

  const [hasProfile, setHasProfile] = React.useState(true);
  const [loadingProfileStatus, setLoadingProfileStatus] = React.useState(true);

  React.useEffect(() => {
    const fetchProfileStatus = async () => {
      if (user?.roleName === 'orgAdmin') {
        try {
        
          const res = await fetch(`/api/org/${user.organizationId}/has-profile`);
        
          const data = await res.json();
          setHasProfile(data?.hasProfile?.hasProfile ?? true);
        } catch (err) {
          console.error('[Header] Error fetching profile status:', err);
        } finally {
          setLoadingProfileStatus(false);
        }
      }
    };
    fetchProfileStatus();
  }, [user]);

  return (
    <div className="relative w-full px-6 mt-6">
      <div className="w-full flex justify-between items-center">
        <div className="text-xl font-bold text-blue-700">Scryyn</div>
        {isLoggedIn !== false && user != null ? (
          <div className="text-sm text-gray-700 flex items-center space-x-4">
            <div className="flex flex-col items-end text-right leading-tight">
              <div className="text-xs text-gray-500">Currently logged in as</div>
              <div className="font-medium text-sm">
                {user?.fullName || 'User'}
                <span className="text-green-700 font-semibold ml-1">({user?.organizationName || 'Org'})</span>
              </div>
            </div>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center space-x-1"
              onClick={logout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        ) : null}
      </div>
      {!loadingProfileStatus && !hasProfile && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-4 mt-4 mb-6 text-sm text-red-600 text-center">
          <div className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-2">
            ⚠️ Organization Profile Incomplete
          </div>
          <div>
            Your organization profile is not yet set up. Creating it helps showcase your brand and attract the right candidates.{' '}
            <a href="/hiring-org/admin/profile" className="underline text-blue-600 hover:text-blue-800">
              Click here to set up your profile.
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
