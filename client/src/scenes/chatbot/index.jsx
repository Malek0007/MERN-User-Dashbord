import React, { useState } from 'react';
import { dataProduct, dataUser } from 'data';
import axios from 'axios'; 
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;

    const newMessage = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Generate the bot's response and add it after a delay
    const botResponse = await generateResponse(input);
    const botMessage = { sender: 'bot', text: botResponse };

    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 500);

    setInput('');
  };

  const generateResponse = async (question) => {
    question = await lemmatizeText(question); // Lemmatize the input text
    question = question.toLowerCase().trim();

    const foundProduct = dataProduct.find(product => question.includes(product.name.toLowerCase()));

    if (foundProduct) {
      if (question.includes('price') || question.includes('cost') || question.includes('how much')) {
        return `The price of ${foundProduct.name} is $${foundProduct.price}.`;
      } else if (question.includes('description') || question.includes('describe') || question.includes('what is it')) {
        return `The description of ${foundProduct.name} is "${foundProduct.description}".`;
      } else if (question.includes('category') || question.includes('type') || question.includes('what kind')) {
        return `The category of ${foundProduct.name} is "${foundProduct.category}".`;
      } else if (question.includes('rating') || question.includes('score') || question.includes('review')) {
        return `The rating of ${foundProduct.name} is ${foundProduct.rating}.`;
      } else if (question.includes('supply') || question.includes('availability') || question.includes('stock')) {
        return `The supply of ${foundProduct.name} is ${foundProduct.supply}.`;
      } else {
        return `You can ask about the price, description, category, rating, or supply of ${foundProduct.name}.`;
      }
    } else if (question.includes('product') || question.includes('item')) {
      const productList = dataProduct.map(product => product.name).join(', ');
      return `Here are the available products: ${productList}`;
    } else if (question.includes('user') || question.includes('customer')) {
      const userList = dataUser.map(user => user.name).join(', ');
      return `Here are the registered users: ${userList}`;
    }

    // Uncomment this block if you want to use OpenAI API
    // try {
    //   const response = await openai.chat.completions.create({
    //     model: 'gpt-3.5-turbo',
    //     messages: [{ role: 'user', content: question }],
    //     max_tokens: 100,
    //   });
    //   return response.choices[0].message.content.trim();
    // } catch (error) {
    //   console.error('Error with OpenAI API', error);
    //   return "I'm sorry, I couldn't understand your question.";
    // }

    return "Sorry, I don't have an answer for that.";
  };

  // Function to lemmatize text using spaCy API
  const lemmatizeText = async (text) => {
    try {
      const response = await axios.post('http://localhost:3000/admin', { text });
      return response.data.lemmatizedText; // Assuming API returns lemmatized text
    } catch (error) {
      console.error('Error with lemmatization API', error);
      return text; // Return original text if lemmatization fails
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: 'auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: "#4d547d",
    },
    chatbox: {
      height: '400px',
      overflowY: 'auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#fff',
      padding: '10px',
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column',
    },
    message: {
      padding: '10px',
      borderRadius: '10px',
      margin: '5px 0',
      maxWidth: '80%',
      wordWrap: 'break-word',
      display: 'inline-block',
    },
    userMessage: {
      backgroundColor: "#FF8C00",
      alignSelf: 'flex-start',
      textAlign: 'left',
    },
    botMessage: {
      backgroundColor: "#191F45",
      alignSelf: 'flex-end',
      textAlign: 'right',
    },
    inputContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    input: {
      width: '80%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    button: {
      width: '15%',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#FF8C00',
      color: 'white',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatbox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{ ...styles.message, ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage) }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={styles.input}
        />
        <button
          onClick={sendMessage}
          style={styles.button}
          onMouseOver={e => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={e => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
