import styled from 'styled-components';
import { lighten } from 'polished';
import { FaCopy, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  background-color: #f8f9fa;
`;

export const Sidebar = styled.div`
  width: 300px;
  background-color: #ffffff;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
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
`;

export const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 10px;
  position: relative;
  ${props => props.$isUser ? `
    align-self: flex-end;
    background-color: #007bff;
    color: white;
    margin-left: auto;
  ` : `
    align-self: flex-start;
    background-color: #f1f3f5;
    color: #495057;
  `}
  ${props => props.$isSystem && `
    align-self: center;
    background-color: #ffc107;
    color: #212529;
  `}
`;

export const InputArea = styled.div`
  display: flex;
  padding: 20px;
  background-color: #ffffff;
  border-top: 1px solid #dee2e6;
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
`;

export const CopyIcon = styled(FaCopy)`
  position: absolute;
  bottom: 5px;
  right: 10px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  font-size: 0.9em;

  &:hover {
    opacity: 1;
  }

  ${props => props.$isUser && `
    color: white;
  `}
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
  max-height: 90vh; // Add this line to limit the maximum height
  overflow-y: auto; // Add this line to enable scrolling if content exceeds max-height
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

export const MessageContent = styled(ReactMarkdown)`
  // Add any specific styles for the markdown content here
`;

export const CodeBlock = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  position: relative;
  overflow-x: auto;
`;

export const CopyButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 2px 5px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;
