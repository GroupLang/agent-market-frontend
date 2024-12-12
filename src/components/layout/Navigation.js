import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    padding: 0.5rem 1rem;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 0.5rem;
    gap: 0.5rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2da44e;
  cursor: pointer;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    flex: 1;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin: 0 2rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0.5rem 0;
  
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    gap: 1.25rem;
    margin: 0 1rem;
  }

  @media (max-width: 768px) {
    order: 3;
    margin: 0;
    padding: 0.75rem 0.5rem;
    gap: 1.25rem;
    width: 100%;
    justify-content: flex-start;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }
`;

const NavLink = styled.a`
  color: ${props => props.$active ? '#2da44e' : '#586069'};
  text-decoration: none;
  font-weight: ${props => props.$active ? '600' : '500'};
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  font-size: 0.95rem;
  border-radius: 6px;
  background: ${props => props.$active ? 'rgba(45, 164, 78, 0.1)' : 'transparent'};

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0.75rem;
    right: 0.75rem;
    height: 2px;
    background-color: #2da44e;
    transform: scaleX(${props => props.$active ? 1 : 0});
    transition: transform 0.2s ease;
    border-radius: 2px;
  }

  &:hover {
    color: #2da44e;
    background: rgba(45, 164, 78, 0.05);
    
    &:after {
      transform: scaleX(1);
    }
  }

  &.docs-link {
    background: ${props => props.$active ? 'rgba(45, 164, 78, 0.1)' : 'rgba(88, 96, 105, 0.05)'};
    padding: 0.5rem 1rem;
    border-radius: 20px;
    
    &:hover {
      background: rgba(45, 164, 78, 0.1);
    }
    
    &:after {
      display: none;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 0.75rem;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-shrink: 0;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;

  &.login {
    background: transparent;
    border: 1px solid #2da44e;
    color: #2da44e;

    &:hover {
      background: rgba(45, 164, 78, 0.1);
    }
  }

  &.register {
    background: #2da44e;
    border: 1px solid #2da44e;
    color: white;

    &:hover {
      background: #218838;
      border-color: #218838;
    }
  }

  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
`;

const Navigation = ({ openModal }) => {
  const history = useHistory();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const tabs = [
    { id: 'about', label: 'Platform' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'github-integration', label: 'GitHub Integration' },
    { id: 'pricing', label: 'Get Started' },
    { id: 'contact', label: 'Connect' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'features', 'how-it-works', 'github-integration', 'pricing', 'contact']
        .map(id => ({
          id,
          element: document.getElementById(id)
        }))
        .filter(section => section.element);

      const scrollPosition = window.scrollY + 100;
      setIsScrolled(window.scrollY > 50);

      for (const section of sections) {
        const element = section.element;
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < top + height) {
            const activeId = section.id === 'features' ? 'about' : section.id;
            setActiveTab(activeId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTab(sectionId);
    }
  };

  return (
    <NavContainer style={{ 
      background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
      boxShadow: isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
    }}>
      <Logo onClick={() => history.push('/')}>Agent Market</Logo>
      <NavLinks>
        {tabs.map(tab => (
          <NavLink
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            $active={activeTab === tab.id}
          >
            {tab.label}
          </NavLink>
        ))}
        <NavLink 
          href="https://api.agent.market/redoc" 
          target="_blank"
          $active={false}
          className="docs-link"
        >
          Docs
        </NavLink>
      </NavLinks>
      <AuthButtons>
        <Button className="login" onClick={openModal}>
          Login
        </Button>
        <Button className="register" onClick={() => history.push('/register')}>
          Register
        </Button>
      </AuthButtons>
    </NavContainer>
  );
};

export default Navigation; 