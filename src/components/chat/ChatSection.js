import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { FaSearch, FaPaperPlane, FaCopy, FaGift, FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import ReactMarkdown from 'react-markdown';
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
    instances,
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
  const [maxRewardForEstimation, setMaxRewardForEstimation] = useState(null);
  const [expandedInstances, setExpandedInstances] = useState({});

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
      dispatch(fetchMessages(authToken, activeConversation.id, activeConversation.providerId));
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

    dispatch(sendMessage(authToken, activeConversation.id, activeConversation.providerId, inputMessage));
    setInputMessage('');
  };

  const getFirstMessage = (conversation) => {
    if (!conversation || !conversation.payload || !Array.isArray(conversation.payload.messages)) {
      console.warn('Invalid conversation payload:', conversation);
      return '';
    }
    const firstMessage = conversation.payload.messages[0];
    return firstMessage ? firstMessage.content : '';
  };

  const toggleInstanceExpand = (instanceId) => {
    setExpandedInstances(prev => ({
      ...prev,
      [instanceId]: !prev[instanceId]
    }));
  };

  const filteredInstances = instances.filter(instance =>
    instance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (instance.conversations && instance.conversations.some(conv => 
      getFirstMessage(conv).toLowerCase().includes(searchTerm.toLowerCase())
    ))
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

  const handleRewardClick = (conversation) => {
    dispatch(setActiveConversation(conversation));
    setMaxCreditPerInstance(conversation.maxCredit);
    setMaxRewardForEstimation(conversation.max_reward_for_estimation);
    setModalIsOpen(true);
  };

  const handleRewardSubmit = async () => {
    if (!activeConversation) return;

    let rewardValue = null;
    if (maxRewardForEstimation === null) {
      const rewardValueParsed = parseFloat(rewardAmount);
      if (isNaN(rewardValueParsed) || rewardValueParsed < 0) {
        toast.error('Please enter a valid positive number for the reward');
        return;
      }

      if (rewardValueParsed > maxCreditPerInstance) {
        toast.error(`Reward cannot exceed the maximum credit of ${maxCreditPerInstance}`);
        return;
      }
      rewardValue = rewardValueParsed;
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

  return (
    <>
      <ChatContainer>
        <Sidebar>
          <div style={{ padding: '10px' }}>
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ConversationList>
            {filteredInstances.map(instance => (
              <div key={instance.id}>
                <ConversationItem 
                  onClick={() => toggleInstanceExpand(instance.id)}
                  style={{ 
                    backgroundColor: '#f8f9fa',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 15px'
                  }}
                >
                  {expandedInstances[instance.id] ? <FaChevronDown /> : <FaChevronRight />}
                  <span style={{ marginLeft: '10px' }}>Instance: {instance.id.slice(0, 8)}...</span>
                </ConversationItem>
                {expandedInstances[instance.id] && instance.conversations && (
                  <div style={{ marginLeft: '20px' }}>
                    {instance.conversations.map(conv => (
                      <ConversationItem
                        key={`${conv.id}-${conv.providerId}`}
                        $active={activeConversation && 
                                activeConversation.id === conv.id && 
                                activeConversation.providerId === conv.providerId}
                        onClick={() => dispatch(setActiveConversation(conv))}
                      >
                        <ConversationTitle>Provider: {conv.providerId.slice(0, 8)}...</ConversationTitle>
                        <ConversationPreview>{getFirstMessage(conv)}</ConversationPreview>
                        <ConversationMeta>
                          <div>{conv.creation_date ? `Created: ${format(new Date(conv.creation_date), 'MMM d, yyyy h:mm a')} UTC` : 'No date'}</div>
                          {conv.gen_reward_timeout_datetime && (
                            <div>
                              <RewardButton onClick={(e) => {
                                e.stopPropagation();
                                handleRewardClick(conv);
                              }}>
                                <FaGift /> Submit Reward
                              </RewardButton>
                            </div>
                          )}
                        </ConversationMeta>
                      </ConversationItem>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
                  <MessageContent>
                    <ReactMarkdown components={renderers}>{msg.message}</ReactMarkdown>
                  </MessageContent>
                  <CopyIcon 
                    onClick={() => copyMessageToClipboard(msg.message)}
                    $isUser={msg.sender === 'requester'}
                  />
                  <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
                    {format(new Date(msg.timestamp), 'MMM d, yyyy h:mm a')} UTC
                  </div>
                </MessageBubble>
              ))
            )}
            {isTyping && (
              <MessageBubble $isSystem>
                Writing...
              </MessageBubble>
            )}
          </MessageList>
          <InputArea>
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              disabled={!activeConversation}
            />
            <SendButton onClick={handleSendMessage} disabled={!activeConversation}>
              <FaPaperPlane />
            </SendButton>
          </InputArea>
        </MainContent>
      </ChatContainer>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            maxWidth: '500px',
            width: '90%'
          }
        }}
      >
        <ModalContent>
          <ModalCloseIcon onClick={() => setModalIsOpen(false)}>
            <FaTimes />
          </ModalCloseIcon>
          <ModalTitle>Submit Reward</ModalTitle>
          {maxRewardForEstimation === null ? (
            <>
              <ModalText>
                Enter the reward amount (max: ${maxCreditPerInstance})
              </ModalText>
              <ModalInput
                type="number"
                step="0.01"
                min="0"
                max={maxCreditPerInstance}
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="Enter reward amount"
              />
            </>
          ) : (
            <ModalText>
              This will submit the pre-configured reward of ${maxRewardForEstimation}
            </ModalText>
          )}
          <ModalButton onClick={handleRewardSubmit}>
            Submit Reward
          </ModalButton>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatSection;
