import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { FaSearch, FaPaperPlane, FaCopy, FaGift, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import {
  ChatContainer, Sidebar, ConversationList, ConversationItem, ConversationTitle,
  ConversationPreview, ConversationMeta, MainContent, MessageList, MessageBubble,
  InputArea, Input, SendButton, CodeBlock, CopyButton, CopyIcon, MessageContent,
  RewardButton, ModalContent, ModalTitle, ModalInput, ModalButton, styles, ModalCloseIcon
} from '../styles/ChatStyles';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  setActiveConversation,
  submitReward
} from '../../redux/actions/chatActions';
import { ModalText } from '../styles/ChatStyles';

const ChatSection = () => {
  const dispatch = useDispatch();
  const {
    conversations,
    messages,
    activeConversation,
    loading,
    error,
    isTyping
  } = useSelector(state => state.chat);
  const { token: authToken } = useSelector(state => state.auth);

  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');
  const [maxCreditPerInstance, setMaxCreditPerInstance] = useState(null);

  const messageListRef = useRef(null);

  useEffect(() => {
    // Update page title when component mounts
    const event = new CustomEvent('updatePageTitle', {
      detail: { section: 'chat' }
    });
    window.dispatchEvent(event);
  }, []);

  useEffect(() => {
    dispatch(fetchConversations(authToken));
  }, [dispatch, authToken]);

  useEffect(() => {
    if (activeConversation) {
      dispatch(fetchMessages(authToken, activeConversation.id));
    }
  }, [dispatch, authToken, activeConversation]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeConversation?.id) {
      toast.warn('Please enter a message and select a conversation');
      return;
    }

    dispatch(sendMessage(authToken, activeConversation.id, inputMessage));
    setInputMessage('');
  };

  const getFirstMessage = (conversation) => {
    if (conversation.payload && Array.isArray(conversation.payload.messages)) {
      const firstMessage = conversation.payload.messages[0];
      return firstMessage ? firstMessage.content : '';
    }
    return '';
  };

  const filteredConversations = conversations.filter(conv =>
    conv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getFirstMessage(conv).toLowerCase().includes(searchTerm.toLowerCase())
  );


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy');
    });
  };

  const copyMessageToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Message copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy message: ', err);
      toast.error('Failed to copy message');
    });
  };

  const renderers = {
    code: ({node, inline, className, children, ...props}) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <CodeBlock>
          <CopyButton onClick={() => copyToClipboard(String(children))}>
            <FaCopy /> Copy
          </CopyButton>
          <pre>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </CodeBlock>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  const handleRewardClick = (conversation) => {
    dispatch(setActiveConversation(conversation));
    setMaxCreditPerInstance(conversation.maxCredit);
    setModalIsOpen(true);
  };

  const handleRewardSubmit = async () => {
    if (!activeConversation) return;

    const rewardValue = parseFloat(rewardAmount);
    if (isNaN(rewardValue) || rewardValue < 0) {
      toast.error('Please enter a valid positive number for the reward');
      return;
    }

    if (rewardValue > maxCreditPerInstance) {
      toast.error(`Reward cannot exceed the maximum credit of ${maxCreditPerInstance}`);
      return;
    }

    try {
      await dispatch(submitReward(authToken, activeConversation.id, rewardValue));
      setModalIsOpen(false);
      setRewardAmount('');
      toast.success('Reward submitted successfully');
      
      window.location.reload();
    } catch (error) {
      toast.error('Failed to submit reward. Please try again.');
    }
  };

  return (
    <>
      <ChatContainer>
        <Sidebar>
          <div style={{ padding: '15px' }}>
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ConversationList>
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <ConversationItem
                  key={conv.id}
                  $active={activeConversation && activeConversation.id === conv.id}
                  onClick={() => dispatch(setActiveConversation(conv))}
                >
                  <ConversationTitle>{conv.id ? conv.id.slice(0, 8) + '...' : 'No ID'}</ConversationTitle>
                  <ConversationPreview>{getFirstMessage(conv)}</ConversationPreview>
                  <ConversationMeta>
                    <div>{conv.creation_date ? `Created: ${format(new Date(conv.creation_date), 'MMM d, yyyy h:mm a')} UTC` : 'No date'}</div>
                    {conv.gen_reward_timeout_datetime && (
                      <div>
                        {`Ends: ${format(new Date(conv.gen_reward_timeout_datetime), 'MMM d, yyyy h:mm a')} UTC`}
                      </div>
                    )}
                  </ConversationMeta>
                  <RewardButton onClick={(e) => { e.stopPropagation(); handleRewardClick(conv); }}>
                    <FaGift /> Submit Reward
                  </RewardButton>
                </ConversationItem>
              ))
            ) : (
              <div style={{ padding: '15px', textAlign: 'center' }}>
                {searchTerm ? 'No matching conversations' : 'No conversations available'}
              </div>
            )}
          </ConversationList>
        </Sidebar>
        <MainContent>
          <MessageList ref={messageListRef}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>No messages yet</div>
            ) : (
              messages.map((msg, index) => (
                <MessageBubble 
                  key={index} 
                  $isUser={msg.sender === 'requester'}
                  $isSystem={msg.sender !== 'requester' && msg.sender !== 'provider'}
                >
                  <MessageContent components={renderers}>{msg.message}</MessageContent>
                  <CopyIcon 
                    onClick={() => copyMessageToClipboard(msg.message)}
                    $isUser={msg.sender === 'requester'}
                  />
                </MessageBubble>
              ))
            )}
            {isTyping && (
              <MessageBubble $isSystem>
                Writing...
              </MessageBubble>
            )}
          </MessageList>
          {!modalIsOpen && (
            <InputArea>
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <SendButton onClick={handleSendMessage}>
                <FaPaperPlane />
              </SendButton>
            </InputArea>
          )}
        </MainContent>
      </ChatContainer>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            ...styles.modalContent,
            padding: '50px', // Add padding to the modal content
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          },
          overlay: styles.modalOverlay
        }}
      >
        <ModalCloseIcon onClick={() => setModalIsOpen(false)} />
        <ModalTitle>Submit Reward</ModalTitle>
        <ModalInput
          type="number"
          min="0"
          max={maxCreditPerInstance}
          step="0.01"
          value={rewardAmount}
          onChange={(e) => setRewardAmount(e.target.value)}
          placeholder="Enter reward amount"
        />
        <ModalButton 
          onClick={handleRewardSubmit} 
          disabled={!rewardAmount}
          style={{ marginTop: '20px' }} // Add margin to the top of the button
        >
          Confirm Reward
        </ModalButton>
      </Modal>
    </>
  );
};

export default ChatSection;
