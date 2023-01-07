import './App.css';
import './normal.css';
import bot from './assets/bot.svg';
import user from './assets/user.svg';
import { useState } from 'react';


function App() {
  const [input, setInput] = useState('');
  const [models, setModels] = useState([
    {
      name: "Default (Curie)",
      id: "text-curie-001",
      object: "engine",
    },
    {
      name: "Davinci",
      object: "engine",
      id: "text-davinci-003",
    },
    {
      name: "Curie",
      object: "engine",
      id: "text-curie-001",
    },
    {
      name: "Babbage",
      object: "engine",
      id: "text-babbage-001",
    },
    {
      name: "Ada",
      object: "engine",
      id: "text-ada-001",
    },
  ]);
  const [currentModel, setCurrentModel] = useState('text-curie-001');
  const [chatLog, setChatLog] = useState([]);

  // Clear chats
  function clearChat() {
    setChatLog([]);
  }

  // Get Engines
  function getEngines() {
    fetch("http://localhost:3080/models")
      .then(res => res.json())
      .then(data => {
        setModels(data.models);
      })
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(currentModel, "currentModel")
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);

    let messages = chatLogNew.map((message) => message.message).join("\n");
    console.log(messages)

    // Fetch respoinse to the api combining the chat log array of messages and sending it as a message to localhost:3080 as a POST
    const response = await fetch("http://localhost:3080", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
        currentModel: currentModel,
      })
    });
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>New Chat
        </div>
        <div className="models">
          <select className="models-select" onChange={(e) => setCurrentModel(e.target.value)}>
            {models.map((model, index) => (
              <option key={index} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {
            chatLog.map((message, index) => {
              return <ChatMessage key={index} message={message} />
            })
          }

        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <textarea
              className="chat-input-textarea"
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.keyCode === 13 && !e.shiftKey) {
                  handleSubmit(e);
                }
              }
            }></textarea>
          </form>
        </div>
      </section>

    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
          {(message.user === "gpt") ? <img src={bot} alt="bot" /> : <img src={user} alt="user" />}
        </div>
        <div style={{ whiteSpace: "pre-warp" }} className="message">
          {
            message.message.split("\n").map(function (item, idx) {
              if (item != "" && item != "?" && item != "!" && item != "." && item != ",") {
                return (
                  <span key={idx}>
                    {item}
                    <br />
                  </span>
                )
              }
            })
          }
        </div>
      </div>
    </div>
  )
}


export default App;
