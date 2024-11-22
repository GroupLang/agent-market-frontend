import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Define a color palette
const colors = {
  primary: '#2da44e',
  primaryDark: '#238636',
  secondary: '#586069',
  background: '#f6f8fa',
  text: '#24292e',
  lightText: '#444d56',
  white: '#ffffff',
};

// Landing Container
export const LandingContainer = styled.div`
  max-width: 960px;
  margin: 20px auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    margin: 10px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    margin: 5px;
    padding: 10px;
  }

  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: ${colors.text};
  background-color: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

// Top Navigation for "Back to Login"
export const TopNav = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

// Landing Header
export const LandingHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 2.8rem;
    
    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.8rem;
    }
    color: ${colors.primary};
    margin-bottom: 10px;
  }

  p {
    font-size: 1.2rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
    color: ${colors.secondary};
  }
`;

// Enhanced list styling for nested lists
export const LandingSection = styled.section`
  margin-bottom: 50px;
  background-color: ${colors.background}; // Ensure a distinct background color
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h2 {
    color: ${colors.text};
    margin-bottom: 25px;
    font-size: 2rem;
    padding-bottom: 10px;
    border-bottom: 2px solid ${colors.background};
    
    @media (max-width: 768px) {
      font-size: 1.6rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.4rem;
    }
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      position: relative;
      padding-left: 24px;
      margin-bottom: 16px;
      color: ${colors.lightText};
      font-size: 1.05rem;
      line-height: 1.6;

      &:before {
        content: '→';
        color: ${colors.primary};
        position: absolute;
        left: 0;
        top: 0;
        font-weight: bold;
      }

      strong {
        color: ${colors.text};
        display: block;
        margin-bottom: 8px;
        font-size: 1.1rem;
      }

      ul {
        margin-top: 12px;
        margin-left: 8px;
        
        li {
          margin-bottom: 10px;
          font-size: 0.95rem;
          
          &:before {
            content: '•';
            font-size: 1.2rem;
          }
        }
      }
    }
  }

  p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: ${colors.lightText};
    margin-bottom: 24px;
  }
`;

// Enhanced UserTypes grid
export const UserTypes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 40px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

// Enhanced UserType cards
export const UserType = styled.div`
  padding: 30px;
  background: ${colors.white}; // Ensure a distinct background color
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  }

  h3 {
    color: ${colors.primary};
    margin-bottom: 16px;
    font-size: 1.5rem;
    padding-bottom: 12px;
    border-bottom: 2px solid rgba(45, 164, 78, 0.1);
  }

  p {
    line-height: 1.7;
    color: ${colors.lightText};
    font-size: 1rem;
  }
`;

// Styled "Back to Login" Link
export const BackToLoginLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: ${colors.primary};
  color: ${colors.white};
  text-decoration: none;
  font-weight: 600;
  border-radius: 5px;
  text-align: center;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${colors.primaryDark};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Footer for Bottom "Back to Login"
export const Footer = styled.footer`
  text-align: center;
  margin-top: 60px;
`;

// Process Step Container
export const ProcessSteps = styled.div`
  position: relative;
  max-width: 800px;
  margin: 40px auto;
  padding-left: 50px;

  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${colors.primary};
  }
  
  @media (max-width: 768px) {
    padding-left: 30px;
    
    &::before {
      left: 10px;
    }
  }
`;

export const ProcessStep = styled.div`
  position: relative;
  margin-bottom: 30px;
  padding: 20px;
  background: ${colors.background}; // Ensure a distinct background color
  border-radius: 8px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(10px);
  }

  &::before {
    content: '${props => props.number}';
    position: absolute;
    left: -50px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    background: ${colors.primary};
    border-radius: 50%;
    color: ${colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  h4 {
    color: ${colors.primary};
    margin: 0 0 10px 0;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    color: ${colors.lightText};
    font-size: 0.95rem;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    
    &::before {
      left: -30px;
      width: 24px;
      height: 24px;
      font-size: 0.9rem;
    }
    
    h4 {
      font-size: 1.1rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

// Update PaymentExample styling
export const PaymentExample = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 40px;
  margin: 40px 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);

  h3 {
    color: ${colors.primary};
    margin-bottom: 30px;
    font-size: 1.8rem;
    text-align: center;
    padding-bottom: 15px;
    border-bottom: 2px solid ${colors.background};
  }
`;

// Update PaymentScenario styling
export const PaymentScenario = styled.div`
  background: ${colors.background};
  border-radius: 12px;
  padding: 35px;
  margin: 30px 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .scenario-title {
    font-weight: 600;
    color: ${colors.primary};
    margin-bottom: 30px;
    font-size: 1.4rem;
    text-align: center;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(45, 164, 78, 0.2);
  }

  .scenario-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    justify-items: center; // Center items horizontally
  }

  .scenario-item {
    background: ${colors.white};
    padding: 25px 30px;
    border-radius: 12px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.05);
    transition: all 0.2s ease;
    width: 100%;
    max-width: 320px;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .label {
      color: ${colors.secondary};
      font-size: 1.1rem;
      margin-bottom: 15px;
      font-weight: 500;
      text-align: center;
    }

    .value {
      color: ${colors.text};
      font-weight: 600;
      font-size: 1.1rem;
      line-height: 1.8;
      text-align: center;
      padding: 18px;
      background: ${colors.background};
      border-radius: 8px;

      small {
        display: block;
        color: ${colors.secondary};
        font-size: 0.9rem;
        font-weight: normal;
        margin-top: 8px;
        font-style: italic;
        line-height: 1.5;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 25px;
    
    .scenario-details {
      grid-template-columns: 1fr;
    }

    .scenario-item {
      padding: 20px;
    }
  }
`;

// Add these new styled components
export const PaymentSystem = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 30px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PaymentCard = styled.div`
  background: ${colors.white};
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  }

  h4 {
    color: ${colors.primary};
    font-size: 1.2rem;
    margin-bottom: 15px;
    border-bottom: 2px solid ${colors.background};
    padding-bottom: 10px;
  }

  p {
    color: ${colors.lightText};
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
  }
`;
