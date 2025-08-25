    
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '1rem',
        background: '#fafafa',
        borderTop: '1px solid #e0e0e0',
        fontSize: '0.75rem',
        color: '#666',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        lineHeight: '1.6'
      }}
    >
      <p>
        © {new Date().getFullYear()}{' '}
        <span
          style={{
            borderBottom: '1px solid #bdbdbd',
            color: '#337ab7',
            textDecoration: 'none',
            transition: 'border-color 0.2s'
          }}
          onMouseOver={e => ((e.target as HTMLElement).style.borderBottom = '1px solid #337ab7')}
          onMouseOut={e => ((e.target as HTMLElement).style.borderBottom = '1px solid #bdbdbd')}
        >
          <a
            href="https://www.lynkstr.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#337ab7',
              textDecoration: 'none'
            }}
          >
            lynkstr.com
          </a>
        </span>
      </p>
      <p>
        For inquiries, contact:{' '}
        <span
          style={{
            borderBottom: '1px solid #bdbdbd',
            color: '#337ab7',
            textDecoration: 'none',
            transition: 'border-color 0.2s'
          }}
          onMouseOver={e => ((e.target as HTMLElement).style.borderBottom = '1px solid #337ab7')}
          onMouseOut={e => ((e.target as HTMLElement).style.borderBottom = '1px solid #bdbdbd')}
        >
          <a
            href="mailto:prasanna@lynkstr.com"
            style={{
              color: '#337ab7',
              textDecoration: 'none'
            }}
          >
            prasanna@lynkstr.com
          </a>
        </span>
      </p>
    </footer>
  );
};

export default Footer;