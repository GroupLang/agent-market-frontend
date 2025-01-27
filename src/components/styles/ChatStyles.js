import styled from 'styled-components';
import { lighten } from 'polished';
import { FaCopy, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  background-color: #f8f9fa;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: calc(100vh - 60px);
  }
`;

export const Sidebar = styled.div`
  width: 300px;
  background-color: #ffffff;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    height: 60px;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    border-right: none;
    border-bottom: 1px solid #dee2e6;
  }
`;

export const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ced4da;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ConversationItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${lighten(0.1, '#e9ecef')};
  }
  ${props => props.$active && `
    background-color: #e9ecef;
    border-left: 4px solid #007bff;
  `}
`;

export const ConversationTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 5px 0;
  color: #495057;
`;

export const ConversationPreview = styled.p`
  font-size: 14px;
  color: #6c757d;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ConversationMeta = styled.div`
  font-size: 12px;
  color: #adb5bd;
  margin-top: 5px;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    height: calc(100vh - 120px);
  }
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ced4da;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const MessageBubble = styled.div`
  margin: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 80%;
  position: relative;
  word-wrap: break-word;
  
  ${props => props.$isUser ? `
    background-color: #007bff;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  ` : props.$isSystem ? `
    background-color: #f8f9fa;
    color: #666;
    margin: 10px auto;
    text-align: center;
    font-style: italic;
  ` : `
    background-color: #e9ecef;
    color: #212529;
    margin-right: auto;
    border-bottom-left-radius: 4px;
  `}

  pre {
    background-color: ${props => props.$isUser ? '#0056b3' : '#dee2e6'};
    border-radius: 4px;
    padding: 8px;
    margin: 8px 0;
    overflow-x: auto;
  }

  code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
  }
`;

export const InputArea = styled.div`
  display: flex;
  padding: 20px;
  background-color: #ffffff;
  border-top: 1px solid #dee2e6;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

export const SendButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

export const CopyIcon = styled(FaCopy)`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  color: ${props => props.$isUser ? 'rgba(255, 255, 255, 0.7)' : '#6c757d'};

  ${MessageBubble}:hover & {
    opacity: 1;
  }

  &:hover {
    color: ${props => props.$isUser ? '#fff' : '#343a40'};
  }
`;

export const RewardButton = styled.button`
  background-color: #ffc107;
  color: #212529;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;

  &:hover {
    background-color: #e0a800;
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: 'Inter', sans-serif;
  width: 100%;
  position: relative;
  padding: 20px;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 15px;
    width: 95%;
  }
`;

export const ModalCloseIcon = styled(FaTimes)`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 20px;
  cursor: pointer;
  color: #6c757d;
  &:hover {
    color: #343a40;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 28px;
  color: #333;
  margin-bottom: 25px;
  font-weight: 600;
  text-align: center;
  font-family: 'Inter', sans-serif;
`;

export const ModalInput = styled.input`
  width: 93%;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 18px;
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 12px;
    font-size: 16px;
  }
`;

export const ModalButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 15px 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  margin-top: 15px;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 16px;
  }
`;

export const ModalText = styled.p`
  font-size: 16px;
  color: #495057;
  margin-bottom: 20px;
  text-align: center;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
`;

export const styles = {
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: '#fff',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    overflow: 'visible',
  }
};

export const MessageContent = styled.div`
  p {
    margin: 0;
    line-height: 1.4;
  }

  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  a {
    color: ${props => props.$isUser ? '#fff' : '#007bff'};
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    border-radius: 4px;
    margin: 8px 0;
  }
`;

export const CodeBlock = styled.div`
  position: relative;
  margin: 8px 0;

  pre {
    margin: 0;
    padding: 8px;
  }
`;

export const CopyButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8em;
  opacity: 0;
  transition: opacity 0.2s;

  ${CodeBlock}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #343a40;
  }
`;
