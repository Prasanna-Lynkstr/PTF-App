import React, { useEffect, useState } from 'react';
// import axios from 'axios';

interface CompanyProfileProps {
  orgId: string;
}

interface CompanyProfile {
  name: string;
  location?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  about?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  mission?: string;
  vision?: string;
  headcount?: number;
  headquarters?: string;
  yearFounded?: string;
  orgType?: string;
  numberOfEmployees?: string;
}

const CompanyProfileCard: React.FC<CompanyProfileProps> = ({ orgId }) => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/org/${orgId}/profile`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError('Failed to load company profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [orgId]);

  if (loading) return <p>Loading company profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div style={{ maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden', width: '100%', maxWidth: 700, margin: '0 auto', fontFamily: 'sans-serif', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        {!!profile.coverImageUrl && (
          <img
            src={profile.coverImageUrl}
            alt="Company Cover"
            style={{ width: '100%', height: 180, objectFit: 'cover' }}
          />
        )}

        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!!profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt="Company Logo"
                style={{ width: 80, height: 80, objectFit: 'contain', marginRight: 20, borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
              />
            )}
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{profile.name}</h2>
              {!!profile.location && (
                <p style={{ margin: '4px 0', fontSize: '0.95rem', color: '#666' }}>{profile.location}</p>
              )}
              {!!profile.website && (
                <a
                  href={profile.website?.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.95rem', color: '#0073b1' }}
                >
                  {profile.website}
                </a>
              )}
              {!!profile.about && (
                <div style={{ marginTop: 24, backgroundColor: '#fffaf5', padding: '16px 20px', borderRadius: 8 }}>
                  <h3 style={{ marginBottom: 12, fontSize: '1.2rem', fontWeight: 600, color: '#8b4513' }}>About</h3>
                  <p style={{ color: '#333', fontSize: '0.95rem' }}>{profile.about}</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}>
            {!!profile.headquarters && (
              <div style={{ backgroundColor: '#e0f7fa', padding: 12, borderRadius: 8 }}>
                <strong>Headquarters</strong>
                <p style={{ margin: 4 }}>{profile.headquarters}</p>
              </div>
            )}
            {!!profile.yearFounded && (
              <div style={{ backgroundColor: '#fce4ec', padding: 12, borderRadius: 8 }}>
                <strong>Founded</strong>
                <p style={{ margin: 4 }}>{profile.yearFounded}</p>
              </div>
            )}
            {!!profile.numberOfEmployees && (
              <div style={{ backgroundColor: '#f3e5f5', padding: 12, borderRadius: 8 }}>
                <strong>Employees</strong>
                <p style={{ margin: 4 }}>{profile.numberOfEmployees}</p>
              </div>
            )}
            {!!profile.orgType && (
              <div style={{ backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8 }}>
                <strong>Company Type</strong>
                <p style={{ margin: 4 }}>{profile.orgType}</p>
              </div>
            )}
            {!!profile.contactEmail && (
              <div style={{ backgroundColor: '#fff3e0', padding: 12, borderRadius: 8 }}>
                <strong>Email</strong>
                <p style={{ margin: 4 }}>{profile.contactEmail}</p>
              </div>
            )}
            {!!profile.contactPhone && (
              <div style={{ backgroundColor: '#ede7f6', padding: 12, borderRadius: 8 }}>
                <strong>Phone</strong>
                <p style={{ margin: 4 }}>{profile.contactPhone}</p>
              </div>
            )}
          </div>

          {!!profile.mission && (
            <div style={{ marginTop: 32, backgroundColor: '#f9f9ff', padding: '16px 20px', borderRadius: 8 }}>
              <h3 style={{ marginBottom: 12, fontSize: '1.2rem', fontWeight: 600, color: '#4b0082' }}>Mission</h3>
              <p style={{ color: '#333', fontSize: '1rem' }}>{profile.mission}</p>
            </div>
          )}

          {!!profile.vision && (
            <div style={{ marginTop: 24, backgroundColor: '#f5fff9', padding: '16px 20px', borderRadius: 8 }}>
              <h3 style={{ marginBottom: 12, fontSize: '1.2rem', fontWeight: 600, color: '#006400' }}>Vision</h3>
              <p style={{ color: '#333', fontSize: '1rem' }}>{profile.vision}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileCard;