import React, { useState ,useRef, useEffect} from 'react';
import './Agent.css';

const Agent = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    // pozycja i rozmiar popupu
    const [position, setPosition] = useState({ x: 100, y: 50 });
    const [size, setSize] = useState({ width: 600, height: 400 });

    const dragging = useRef(false);
    const resizing = useRef(false);
    const start = useRef({ mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 });


    // drag header
    const onMouseDownDrag = (e) => {
        dragging.current = true;
        start.current = { mouseX: e.clientX, mouseY: e.clientY, x: position.x, y: position.y };
    };

    // resize od dolnego prawego rogu
    const onMouseDownResize = (e) => {
        e.stopPropagation();
        resizing.current = true;
        start.current = { mouseX: e.clientX, mouseY: e.clientY, w: size.width, h: size.height };
    };

    const onMouseMove = (e) => {
        if (dragging.current) {
            setPosition({
                x: start.current.x + (e.clientX - start.current.mouseX),
                y: start.current.y + (e.clientY - start.current.mouseY),
            });
        } else if (resizing.current) {
            setSize({
                width: Math.max(300, start.current.w + (e.clientX - start.current.mouseX)),
                height: Math.max(200, start.current.h + (e.clientY - start.current.mouseY)),
            });
        }
    };

    const onMouseUp = () => {
        dragging.current = false;
        resizing.current = false;
    };

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);


    if (!isOpen) return null;


    const handleSend = () => {
        if (!message.trim()) return;

        // dodajemy wiadomość usera do historii w czacie
        setChatHistory((prev) => [...prev, { type: 'user', text: message }]);
        setMessage('');

        // tu trzeba tekst dodać np jako odp od agenta
        setChatHistory((prev) => [
            ...prev,
            { type: 'agent', text: `Tu by trzeba text wypełniać z odp` },
        ]);
    };

    return (
        <div className="agent-container" style={{ top: position.y, left: position.x, width: size.width, height: size.height }}>
            <div className="agent-header" onMouseDown={onMouseDownDrag}>
                <h4>AI Agent</h4>
                <button onClick={onClose}>X</button>
            </div>

            <div className="agent-messages">
                {chatHistory.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`agent-message ${msg.type === 'user' ? 'user' : 'agent'}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="agent-input">
                <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
            </div>
            <div className="agent-resize-handle" onMouseDown={onMouseDownResize} />
        </div>
    );
};

export default Agent;
