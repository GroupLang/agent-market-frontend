import React from 'react';
import { FaUser } from 'react-icons/fa';
import styled from 'styled-components';

const UserSection = styled.section`
  display: flex;
  align-items: flex-start;
  background-color: #ffffff;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  margin-bottom: 2em;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 1.5em;
    text-align: center;
  }
`;

const AvatarContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #2da44e;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 2em;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1.5em;
  }
`;

const UserInfo = styled.div`
  flex: 1;

  h2 {
    margin: 0 0 0.5em 0;
    color: #24292e;
    font-size: 1.5em;

    @media (max-width: 768px) {
      font-size: 1.3em;
    }
  }

  p {
    margin: 0.25em 0;
    color: #586069;
    font-size: 1em;

    @media (max-width: 768px) {
      font-size: 0.9em;
    }
  }
`;

const SharedAccount = styled.div`
  margin: 1em 0 0 0;
  padding: 0.5em;
  background-color: #f6f8fa;
  border-radius: 6px;
  font-size: 0.85em;
  color: #586069;
  display: flex;
  align-items: center;
  gap: 0.5em;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1em;
    margin-top: 1.5em;
  }

  a {
    color: #2da44e;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const UserInfoSection = ({ userData }) => (
  <UserSection>
    <AvatarContainer>
      <FaUser size={48} color="#ffffff" />
    </AvatarContainer>
    <UserInfo>
      <h2>{userData?.username}</h2>
      <p>{userData?.email}</p>
      <p>{userData?.fullname}</p>
      <SharedAccount>
        <span>✨ This account also works on </span>
        <a href="https://marketrouter.ai">marketrouter.ai</a>
      </SharedAccount>
    </UserInfo>
  </UserSection>
);

export default UserInfoSection;