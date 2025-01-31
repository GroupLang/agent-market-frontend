import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setGithubUsername } from '../../redux/actions/authActions';
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

const UserInfoSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [githubUsernameInput, setGithubUsernameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && userData?.github_username) {
      setGithubUsernameInput(userData.github_username);
    }
  }, [isEditing, userData?.github_username]);

  const handleGithubUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!githubUsernameInput.trim()) {
      setError('GitHub username cannot be empty.');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      await dispatch(setGithubUsername(githubUsernameInput.trim()));
      setGithubUsernameInput('');
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      setError('Failed to set GitHub username. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserSection>
      <AvatarContainer>
        <FaUser size={48} color="#ffffff" />
      </AvatarContainer>
      <UserInfo>
        <h2>{userData?.username}</h2>
        <p>{userData?.email}</p>
        <p>{userData?.fullname}</p>
        {userData?.github_username && !isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
            <p>GitHub Username: {userData.github_username}</p>
            <EditButton onClick={() => setIsEditing(true)}>
              Edit
            </EditButton>
          </div>
        ) : (
          <GithubUsernameForm onSubmit={handleGithubUsernameSubmit}>
            <GithubInput
              type="text"
              placeholder="Enter your GitHub username"
              value={githubUsernameInput}
              onChange={(e) => setGithubUsernameInput(e.target.value)}
              disabled={isSubmitting}
            />
            <ButtonContainer>
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save GitHub Username'}
              </SubmitButton>
              {isEditing && (
                <CancelButton 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    setGithubUsernameInput('');
                    setError(null);
                  }}
                >
                  Cancel
                </CancelButton>
              )}
            </ButtonContainer>
            {error && <ErrorText>{error}</ErrorText>}
          </GithubUsernameForm>
        )}
        <SharedAccount>
          <span>✨ This account also works on </span>
          <a href="https://marketrouter.ai">marketrouter.ai</a>
        </SharedAccount>
      </UserInfo>
    </UserSection>
  );
};

const GithubUsernameForm = styled.form`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const GithubInput = styled.input`
  padding: 0.5em;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  font-size: 1em;
  width: 100%;
  max-width: 300px;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SubmitButton = styled.button`
  padding: 0.5em 1em;
  background-color: #2da44e;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:disabled {
    background-color: #94d3a2;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1em;
  margin-top: 0.5em;
`;

const EditButton = styled.button`
  padding: 0.3em 0.8em;
  background-color: #0366d6;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0256b4;
  }
`;

const CancelButton = styled.button`
  padding: 0.5em 1em;
  background-color: #6c757d;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5a6268;
  }
`;

const ErrorText = styled.span`
  color: #d73a49;
  font-size: 0.9em;
`;

export default UserInfoSection;
