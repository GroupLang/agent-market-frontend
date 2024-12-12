import React, { useState } from 'react';
import styled from 'styled-components';

const ContactContainer = styled.section`
  padding: 3rem 0;
  background: #f6f8fa;

  @media (max-width: 968px) {
    padding: 2rem 0;
  }
`;

const ContactWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 0.9fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1rem;
    margin-left: -2rem;
  }
`;

const ContactInfo = styled.div`
  max-width: 500px;
  margin: 0;
  width: 100%;
  padding-right: 1rem;

  h2 {
    font-size: 2rem;
    color: #24292e;
    margin-bottom: 1rem;
  }

  p {
    color: #586069;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }

  @media (max-width: 968px) {
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
    max-width: 600px;
  }
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 968px) {
    align-items: center;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #24292e;
  font-size: 1.1rem;

  svg {
    width: 24px;
    height: 24px;
    color: #2da44e;
  }

  a {
    color: #2da44e;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContactForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 460px;
  margin: 0;
  width: 100%;

  @media (max-width: 968px) {
    margin: 0 auto;
    padding: 1.25rem;
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  width: 100%;
  max-width: 380px;
  margin-left: 1rem;
  margin-right: 1rem;

  @media (max-width: 968px) {
    margin: -0.5 auto 1rem;
    max-width: 70%;
    padding: 0 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.25rem;
    color: #24292e;
    font-weight: 500;
    font-size: 0.9rem;

    @media (max-width: 968px) {
      font-size: 0.85rem;
    }
  }

  input, textarea {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background-color: #f8fafc;
    color: #24292e;
    font-family: inherit;

    @media (max-width: 968px) {
      font-size: 0.9rem;
      padding: 0.75rem;
      background-color: white;
    }

    &:focus {
      outline: none;
      border-color: #2da44e;
      background-color: #fff;
      box-shadow: 0 0 0 3px rgba(45, 164, 78, 0.1);
    }

    &::placeholder {
      color: #8b949e;
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
    line-height: 1.4;
  }
`;

const SubmitButton = styled.button`
  width: calc(100% - 2rem);
  max-width: 380px;
  display: block;
  margin: 1rem auto;
  padding: 0.75rem;
  background: #2da44e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (max-width: 968px) {
    width: calc(100% - 2rem);
    max-width: 100%;
    margin: 1rem auto;
    font-size: 0.9rem;
    margin-left: 1;
  }

  &:hover {
    background: #218838;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #94d3a2;
    cursor: not-allowed;
    transform: none;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 968px) {
    justify-content: center;
    gap: 2rem;
    margin-top: 1.5rem;
  }

  a {
    color: #586069;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    font-size: 1rem;

    @media (max-width: 968px) {
      font-size: 0.9rem;
    }

    &:hover {
      color: #2da44e;
    }

    svg {
      width: 24px;
      height: 24px;

      @media (max-width: 968px) {
        width: 22px;
        height: 22px;
      }
    }
  }
`;

const Platforms = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 968px) {
    align-items: center;
    margin: 1.5rem 0;
    gap: 0.75rem;
  }
`;

const Platform = styled.a`
  color: #2da44e;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Add your form submission logic here
    // For example, sending to an API endpoint

    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      alert('Message sent successfully!');
    }, 1000);
  };

  return (
    <ContactContainer id="contact">
      <ContactWrapper>
        <ContactInfo>
          <h2>Get in Touch</h2>
          <p>
            We welcome collaborations, inquiries, and feedback. Interested in leveraging agent.market, 
            marketrouter.ai, or groupwrite.ai? Eager to contribute to our open-source efforts?
          </p>
          <ContactDetails>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@grouplang.com">info@grouplang.com</a>
            </ContactItem>
          </ContactDetails>

          <Platforms>
            <Platform href="https://agent.market" target="_blank">agent.market</Platform>
            <Platform href="https://marketrouter.ai" target="_blank">marketrouter.ai</Platform>
            <Platform href="https://groupwrite.ai" target="_blank">groupwrite.ai</Platform>
          </Platforms>

          <p>
            Explore our GitHub repositories for code samples, integration guides, and developer-friendly resources. 
            Experience the power of incentivized marketplaces, effortless model selection, and collaborative 
            synergy across our platforms.
          </p>

          <SocialLinks>
            <a href="https://x.com/GroupLang" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>@GroupLang</span>
            </a>
            <a href="https://github.com/grouplang" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>grouplang</span>
            </a>
          </SocialLinks>
        </ContactInfo>
        <ContactForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="What is this about?"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Type your message here..."
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </SubmitButton>
        </ContactForm>
      </ContactWrapper>
    </ContactContainer>
  );
};

export default ContactSection; 